import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const seosPath = path.join(process.cwd(), "data", "seos.json");

// GET – получить все SEO-фразы (простой массив строк)
export async function GET() {
  try {
    if (!existsSync(seosPath)) {
      return NextResponse.json([]);
    }
    const content = await readFile(seosPath, "utf-8");
    const seos = JSON.parse(content);
    return NextResponse.json(seos);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load seos" }, { status: 500 });
  }
}

// POST – добавить новую SEO-фразу (опционально)
export async function POST(request: NextRequest) {
  try {
    const { phrase } = await request.json();
    if (!phrase) {
      return NextResponse.json({ error: "Phrase required" }, { status: 400 });
    }
    const normalized = phrase.toLowerCase().trim();
    let seos = [];
    if (existsSync(seosPath)) {
      const content = await readFile(seosPath, "utf-8");
      seos = JSON.parse(content);
    }
    if (seos.includes(normalized)) {
      return NextResponse.json(
        { error: "Phrase already exists" },
        { status: 400 },
      );
    }
    seos.push(normalized);
    seos.sort();
    await writeFile(seosPath, JSON.stringify(seos, null, 2));
    return NextResponse.json({ success: true, seos });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add seo phrase" },
      { status: 500 },
    );
  }
}

// DELETE – удалить фразу (опционально)
export async function DELETE(request: NextRequest) {
  try {
    const { phrase } = await request.json();
    if (!phrase) {
      return NextResponse.json({ error: "Phrase required" }, { status: 400 });
    }
    if (!existsSync(seosPath)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const content = await readFile(seosPath, "utf-8");
    let seos = JSON.parse(content);
    if (!seos.includes(phrase)) {
      return NextResponse.json({ error: "Phrase not found" }, { status: 404 });
    }
    seos = seos.filter((p: string) => p !== phrase);
    await writeFile(seosPath, JSON.stringify(seos, null, 2));
    return NextResponse.json({ success: true, seos });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
