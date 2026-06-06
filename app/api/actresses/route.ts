import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const actressesPath = path.join(process.cwd(), "data", "actresses.json");
const metadataPath = path.join(
  process.cwd(),
  "public",
  "gifs",
  "metadata.json",
);

async function getActressCounts(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  try {
    const content = await readFile(metadataPath, "utf-8");
    const gifs = JSON.parse(content);
    gifs.forEach((gif: any) => {
      if (gif.actress && gif.actress !== "Amateur") {
        counts.set(gif.actress, (counts.get(gif.actress) || 0) + 1);
      }
    });
  } catch (e) {
    console.error("Failed to load metadata for counts:", e);
  }
  return counts;
}

// GET - получить всех актрис со счётчиками
export async function GET() {
  try {
    if (!existsSync(actressesPath)) {
      return NextResponse.json([]);
    }
    const content = await readFile(actressesPath, "utf-8");
    const actresses = JSON.parse(content);
    const counts = await getActressCounts();

    const result = actresses.map((name: string) => ({
      name,
      count: counts.get(name) || 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load actresses" },
      { status: 500 },
    );
  }
}

// POST - добавить новую актрису
export async function POST(request: NextRequest) {
  try {
    const { actress } = await request.json();
    if (!actress) {
      return NextResponse.json(
        { error: "Actress name required" },
        { status: 400 },
      );
    }

    const normalized = actress.trim();

    let actresses = [];
    if (existsSync(actressesPath)) {
      const content = await readFile(actressesPath, "utf-8");
      actresses = JSON.parse(content);
    }

    if (actresses.includes(normalized)) {
      return NextResponse.json(
        { error: "Actress already exists" },
        { status: 400 },
      );
    }

    actresses.push(normalized);
    actresses.sort();
    await writeFile(actressesPath, JSON.stringify(actresses, null, 2));

    return NextResponse.json({ success: true, actresses });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add actress" },
      { status: 500 },
    );
  }
}

// DELETE - удалить актрису
export async function DELETE(request: NextRequest) {
  try {
    const { actress } = await request.json();
    if (!actress) {
      return NextResponse.json(
        { error: "Actress name required" },
        { status: 400 },
      );
    }

    if (!existsSync(actressesPath)) {
      return NextResponse.json(
        { error: "Actresses not found" },
        { status: 404 },
      );
    }

    const content = await readFile(actressesPath, "utf-8");
    let actresses = JSON.parse(content);

    if (!actresses.includes(actress)) {
      return NextResponse.json({ error: "Actress not found" }, { status: 404 });
    }

    actresses = actresses.filter((a: string) => a !== actress);
    await writeFile(actressesPath, JSON.stringify(actresses, null, 2));

    return NextResponse.json({ success: true, actresses });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete actress" },
      { status: 500 },
    );
  }
}
