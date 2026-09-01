import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";

// ========== КОНФИГУРАЦИЯ ==========
const s3 = new S3Client({
  region: "ru-3",
  endpoint:
    process.env.SELECTEL_ENDPOINT || "https://s3.ru-3.storage.selcloud.ru",
  credentials: {
    accessKeyId: process.env.SELECTEL_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SELECTEL_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true,
});

const BUCKET = process.env.SELECTEL_BUCKET || "gifpleasure-storage";
const IMGBB_API_KEY = "6d7c893b8fd7eefac404972d82d18938";
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";
const LOCAL_BACKUP_DIR = "H:/gifpleasure_archive/gifs";
// ==================================

function generateId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uploadToSelectel(
  buffer: Buffer,
  key: string,
  contentType: string,
) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read",
  });
  await s3.send(command);
  return `https://${BUCKET}.selstorage.ru/${key}`;
}

// Загрузка файла на ImgBB через base64
async function uploadToImgBB(
  buffer: Buffer,
  fileName: string,
): Promise<string | null> {
  const base64 = buffer.toString("base64");
  const params = new URLSearchParams();
  params.append("key", IMGBB_API_KEY);
  params.append("image", base64);
  params.append("name", fileName);

  try {
    const response = await fetch(IMGBB_UPLOAD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const result = await response.json();
    if (result.status === 200) {
      return result.data.url;
    } else {
      console.error("ImgBB upload error:", result);
      return null;
    }
  } catch (error) {
    console.error("ImgBB upload exception:", error);
    return null;
  }
}

function saveToLocalDisk(buffer: Buffer, filePath: string): void {
  const dir = path.dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(filePath, buffer);
}

export async function GET() {
  try {
    const metadataPath = path.join(
      process.cwd(),
      "public",
      "gifs",
      "metadata.json",
    );
    const content = await readFile(metadataPath, "utf-8");
    const metadata = JSON.parse(content);
    return NextResponse.json(metadata);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const cleanFile = formData.get("clean") as File;
    const wmFile = formData.get("watermarked") as File;
    const previewFile = formData.get("preview") as File;

    if (!cleanFile || !wmFile || !previewFile) {
      return NextResponse.json(
        { error: "All three files are required" },
        { status: 400 },
      );
    }

    // Проверка имён файлов
    const cleanName = cleanFile.name.replace(/\.webp$/i, "");
    const wmName = wmFile.name.replace(/\.webp$/i, "");
    const previewName = previewFile.name.replace(/\.webp$/i, "");

    if (!wmName.endsWith("_wm")) {
      return NextResponse.json(
        { error: "Watermarked file must end with _wm.webp" },
        { status: 400 },
      );
    }
    if (!previewName.endsWith("_preview")) {
      return NextResponse.json(
        { error: "Preview file must end with _preview.webp" },
        { status: 400 },
      );
    }

    const baseName = cleanName;
    const expectedWmBase = wmName.slice(0, -3);
    const expectedPreviewBase = previewName.slice(0, -8);

    if (baseName !== expectedWmBase || baseName !== expectedPreviewBase) {
      return NextResponse.json(
        { error: "Base names do not match" },
        { status: 400 },
      );
    }

    // Метаданные
    const titleEn = formData.get("titleEn") as string;
    if (!titleEn) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const descriptionEn = (formData.get("descriptionEn") as string) || "";
    const tagsRaw = (formData.get("tags") as string) || "";
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t);
    const actress = (formData.get("actress") as string) || "Amateur";
    const category = (formData.get("category") as string) || "other";
    const width = parseInt(formData.get("width") as string) || 480;
    const height = parseInt(formData.get("height") as string) || 270;

    const id = generateId(titleEn);

    // ----- НОВАЯ ПРОВЕРКА НА ДУБЛИКАТ -----
    const metadataPath = path.join(
      process.cwd(),
      "public",
      "gifs",
      "metadata.json",
    );
    let existingMetadata = [];
    try {
      const content = await readFile(metadataPath, "utf-8");
      existingMetadata = JSON.parse(content);
    } catch (e) {
      // файл не существует или пустой
    }
    if (existingMetadata.some((item: any) => item.id === id)) {
      return NextResponse.json(
        { error: `ID "${id}" already exists. Please change title.` },
        { status: 409 },
      );
    }
    // -------------------------------------

    const cleanBuffer = Buffer.from(await cleanFile.arrayBuffer());
    const wmBuffer = Buffer.from(await wmFile.arrayBuffer());
    const previewBuffer = Buffer.from(await previewFile.arrayBuffer());

    // 1. Selectel
    const selectelCleanUrl = await uploadToSelectel(
      cleanBuffer,
      `webp/${id}.webp`,
      "image/webp",
    );
    const selectelWmUrl = await uploadToSelectel(
      wmBuffer,
      `webp/${id}_wm.webp`,
      "image/webp",
    );
    const selectelPreviewUrl = await uploadToSelectel(
      previewBuffer,
      `preview/${id}_preview.webp`,
      "image/webp",
    );

    // 2. ImgBB
    const imgbbCleanUrl = await uploadToImgBB(cleanBuffer, `${id}.webp`);
    const imgbbWmUrl = await uploadToImgBB(wmBuffer, `${id}_wm.webp`);
    const imgbbPreviewUrl = await uploadToImgBB(
      previewBuffer,
      `${id}_preview.webp`,
    );

    if (!imgbbCleanUrl || !imgbbWmUrl || !imgbbPreviewUrl) {
      console.error("❌ ImgBB upload failed, aborting operation");
      return NextResponse.json(
        { error: "Failed to upload to ImgBB. Please try again." },
        { status: 500 },
      );
    }

    // 3. Локальный бэкап
    try {
      saveToLocalDisk(cleanBuffer, `${LOCAL_BACKUP_DIR}/${id}.webp`);
      saveToLocalDisk(wmBuffer, `${LOCAL_BACKUP_DIR}/${id}_wm.webp`);
      saveToLocalDisk(previewBuffer, `${LOCAL_BACKUP_DIR}/${id}_preview.webp`);
      console.log(`✅ Local backup saved: ${LOCAL_BACKUP_DIR}/${id}.*`);
    } catch (error) {
      console.error("❌ Local backup error:", error);
    }

    // 4. Metadata (переиспользуем existingMetadata)
    const newEntry = {
      id,
      slug: { en: id },
      title: { en: titleEn },
      description: { en: descriptionEn },
      tags,
      actress,
      category,
      width,
      height,
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString().split("T")[0],
      urls: {
        imgbb: {
          clean: imgbbCleanUrl,
          wm: imgbbWmUrl,
          preview: imgbbPreviewUrl,
        },
        selectel: {
          clean: selectelCleanUrl,
          wm: selectelWmUrl,
          preview: selectelPreviewUrl,
        },
      },
    };

    existingMetadata.push(newEntry);
    await writeFile(metadataPath, JSON.stringify(existingMetadata, null, 2));

    return NextResponse.json({ success: true, id, url: `/gif/${id}` });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}
