import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Удаляем файлы
    const webpPath = path.join(
      process.cwd(),
      "public",
      "gifs",
      "webp",
      `${id}.webp`,
    );
    const wmPath = path.join(
      process.cwd(),
      "public",
      "gifs",
      "webp",
      `${id}_wm.webp`,
    );
    const previewPath = path.join(
      process.cwd(),
      "public",
      "gifs",
      "preview",
      `${id}_preview.webp`,
    );

    if (existsSync(webpPath)) await unlink(webpPath);
    if (existsSync(wmPath)) await unlink(wmPath);
    if (existsSync(previewPath)) await unlink(previewPath);

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
