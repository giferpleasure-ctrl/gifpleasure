import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Удаляем файлы из Selectel
    const keys = [
      `webp/${id}.webp`,
      `webp/${id}_wm.webp`,
      `preview/${id}_preview.webp`,
    ];

    for (const key of keys) {
      const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: key });
      await s3.send(command);
    }

    // Удаляем из metadata.json
    const metadataPath = path.join(
      process.cwd(),
      "public",
      "gifs",
      "metadata.json",
    );
    if (!existsSync(metadataPath)) {
      return NextResponse.json(
        { error: "Metadata not found" },
        { status: 404 },
      );
    }

    const metadata = JSON.parse(await readFile(metadataPath, "utf-8"));
    const filtered = metadata.filter((g: any) => g.id !== id);
    await writeFile(metadataPath, JSON.stringify(filtered, null, 2));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json();

    const metadataPath = path.join(
      process.cwd(),
      "public",
      "gifs",
      "metadata.json",
    );
    if (!existsSync(metadataPath)) {
      return NextResponse.json(
        { error: "Metadata not found" },
        { status: 404 },
      );
    }

    const metadata = JSON.parse(await readFile(metadataPath, "utf-8"));
    const index = metadata.findIndex((g: any) => g.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "GIF not found" }, { status: 404 });
    }

    metadata[index] = {
      ...metadata[index],
      title: { en: body.title?.en || metadata[index].title.en },
      description: {
        en: body.description?.en || metadata[index].description.en,
      },
      tags: body.tags || metadata[index].tags,
      actress: body.actress || metadata[index].actress,
      category: body.category || metadata[index].category,
      width: body.width || metadata[index].width,
      height: body.height || metadata[index].height,
    };

    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
