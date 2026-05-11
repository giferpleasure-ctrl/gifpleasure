import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { readFileSync } from "fs";
import path from "path";

// Конфигурация Selectel
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

// Генерация уникального ID
function generateId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Загрузка файла в Selectel
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

// GET: получение списка гифок (из metadata.json)
export async function GET() {
  try {
    const metadataPath = path.join(
      process.cwd(),
      "public",
      "gifs",
      "metadata.json",
    );
    const { readFile } = await import("fs/promises");

    const content = await readFile(metadataPath, "utf-8");
    const metadata = JSON.parse(content);

    return NextResponse.json(metadata);
  } catch (error) {
    return NextResponse.json([]);
  }
}

// POST: добавление новой гифки
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

    // Проверяем имена файлов
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

    // Загружаем файлы в Selectel
    const cleanBuffer = Buffer.from(await cleanFile.arrayBuffer());
    const wmBuffer = Buffer.from(await wmFile.arrayBuffer());
    const previewBuffer = Buffer.from(await previewFile.arrayBuffer());

    await uploadToSelectel(cleanBuffer, `webp/${id}.webp`, "image/webp");
    await uploadToSelectel(wmBuffer, `webp/${id}_wm.webp`, "image/webp");
    await uploadToSelectel(
      previewBuffer,
      `preview/${id}_preview.webp`,
      "image/webp",
    );

    // Обновляем metadata.json
    const metadataPath = path.join(
      process.cwd(),
      "public",
      "gifs",
      "metadata.json",
    );
    const { readFile, writeFile } = await import("fs/promises");

    let metadata = [];
    try {
      const content = await readFile(metadataPath, "utf-8");
      metadata = JSON.parse(content);
    } catch (e) {
      // Файла нет
    }

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
    };

    metadata.push(newEntry);
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    return NextResponse.json({ success: true, id, url: `/gif/${id}` });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}
