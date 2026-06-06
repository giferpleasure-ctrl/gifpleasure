import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const tagsPath = path.join(process.cwd(), "data", "tags.json");
const metadataPath = path.join(
  process.cwd(),
  "public",
  "gifs",
  "metadata.json",
);

async function getTagCounts(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  try {
    const content = await readFile(metadataPath, "utf-8");
    const gifs = JSON.parse(content);
    gifs.forEach((gif: any) => {
      if (gif.tags && Array.isArray(gif.tags)) {
        gif.tags.forEach((tag: string) => {
          counts.set(tag, (counts.get(tag) || 0) + 1);
        });
      }
    });
  } catch (e) {
    console.error("Failed to load metadata for counts:", e);
  }
  return counts;
}

// GET - получить все теги со счётчиками
export async function GET() {
  try {
    if (!existsSync(tagsPath)) {
      return NextResponse.json([]);
    }
    const content = await readFile(tagsPath, "utf-8");
    const tags = JSON.parse(content);
    const counts = await getTagCounts();

    const result = tags.map((name: string) => ({
      name,
      count: counts.get(name) || 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load tags" }, { status: 500 });
  }
}

// POST - добавить новый тег
export async function POST(request: NextRequest) {
  try {
    const { tag } = await request.json();
    if (!tag) {
      return NextResponse.json({ error: "Tag required" }, { status: 400 });
    }

    const normalized = tag.toLowerCase().trim();

    let tags = [];
    if (existsSync(tagsPath)) {
      const content = await readFile(tagsPath, "utf-8");
      tags = JSON.parse(content);
    }

    if (tags.includes(normalized)) {
      return NextResponse.json(
        { error: "Tag already exists" },
        { status: 400 },
      );
    }

    tags.push(normalized);
    tags.sort();
    await writeFile(tagsPath, JSON.stringify(tags, null, 2));

    return NextResponse.json({ success: true, tags });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add tag" }, { status: 500 });
  }
}

// DELETE - удалить тег
export async function DELETE(request: NextRequest) {
  try {
    const { tag } = await request.json();
    if (!tag) {
      return NextResponse.json({ error: "Tag required" }, { status: 400 });
    }

    if (!existsSync(tagsPath)) {
      return NextResponse.json({ error: "Tags not found" }, { status: 404 });
    }

    const content = await readFile(tagsPath, "utf-8");
    let tags = JSON.parse(content);

    if (!tags.includes(tag)) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    tags = tags.filter((t: string) => t !== tag);
    await writeFile(tagsPath, JSON.stringify(tags, null, 2));

    return NextResponse.json({ success: true, tags });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 },
    );
  }
}
