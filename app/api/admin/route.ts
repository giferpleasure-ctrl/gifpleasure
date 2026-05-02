import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// GET /api/admin — получить список всех гифок
export async function GET() {
  try {
    const metadataPath = path.join(
      process.cwd(),
      "public",
      "gifs",
      "metadata.json",
    );

    if (!existsSync(metadataPath)) {
      return NextResponse.json([]);
    }

    const fileContent = await readFile(metadataPath, "utf-8");
    const metadata = JSON.parse(fileContent);
    return NextResponse.json(metadata);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to read metadata" },
      { status: 500 },
    );
  }
}

// POST /api/admin — добавить новую гифку (3 файла + метаданные)
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

    if (baseName !== expectedWmBase) {
      return NextResponse.json(
        { error: `Base names don't match: ${baseName} vs ${expectedWmBase}` },
        { status: 400 },
      );
    }
    if (baseName !== expectedPreviewBase) {
      return NextResponse.json(
        {
          error: `Base names don't match: ${baseName} vs ${expectedPreviewBase}`,
        },
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

    // ID из названия
    const id = titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Папки
    const webpDir = path.join(process.cwd(), "public", "gifs", "webp");
    const previewDir = path.join(process.cwd(), "public", "gifs", "preview");

    if (!existsSync(webpDir)) await mkdir(webpDir, { recursive: true });
    if (!existsSync(previewDir)) await mkdir(previewDir, { recursive: true });

    // Сохраняем файлы
    await writeFile(
      path.join(webpDir, `${id}.webp`),
      Buffer.from(await cleanFile.arrayBuffer()),
    );
    await writeFile(
      path.join(webpDir, `${id}_wm.webp`),
      Buffer.from(await wmFile.arrayBuffer()),
    );
    await writeFile(
      path.join(previewDir, `${id}_preview.webp`),
      Buffer.from(await previewFile.arrayBuffer()),
    );

    // Metadata
    const metadataPath = path.join(
      process.cwd(),
      "public",
      "gifs",
      "metadata.json",
    );
    let metadata = [];
    if (existsSync(metadataPath)) {
      metadata = JSON.parse(await readFile(metadataPath, "utf-8"));
    }

    metadata.push({
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
    });

    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    return NextResponse.json({ success: true, id, url: `/en/gif/${id}` });
  } catch (error: any) {
    console.error("POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
