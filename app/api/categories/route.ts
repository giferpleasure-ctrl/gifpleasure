import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const categoriesPath = path.join(process.cwd(), "data", "categories.json");
const metadataPath = path.join(
  process.cwd(),
  "public",
  "gifs",
  "metadata.json",
);

async function getCategoryCounts(): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  try {
    const content = await readFile(metadataPath, "utf-8");
    const gifs = JSON.parse(content);
    gifs.forEach((gif: any) => {
      if (gif.category) {
        counts.set(gif.category, (counts.get(gif.category) || 0) + 1);
      }
    });
  } catch (e) {
    console.error("Failed to load metadata for counts:", e);
  }
  return counts;
}

// GET - получить все категории со счётчиками
export async function GET() {
  try {
    if (!existsSync(categoriesPath)) {
      return NextResponse.json([]);
    }
    const content = await readFile(categoriesPath, "utf-8");
    const categories = JSON.parse(content);
    const counts = await getCategoryCounts();

    const result = categories.map((name: string) => ({
      name,
      count: counts.get(name) || 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 },
    );
  }
}

// POST - добавить новую категорию
export async function POST(request: NextRequest) {
  try {
    const { category } = await request.json();
    if (!category) {
      return NextResponse.json({ error: "Category required" }, { status: 400 });
    }

    const normalized = category.toLowerCase().trim();

    let categories = [];
    if (existsSync(categoriesPath)) {
      const content = await readFile(categoriesPath, "utf-8");
      categories = JSON.parse(content);
    }

    if (categories.includes(normalized)) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 },
      );
    }

    categories.push(normalized);
    categories.sort();
    await writeFile(categoriesPath, JSON.stringify(categories, null, 2));

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add category" },
      { status: 500 },
    );
  }
}

// DELETE - удалить категорию
export async function DELETE(request: NextRequest) {
  try {
    const { category } = await request.json();
    if (!category) {
      return NextResponse.json({ error: "Category required" }, { status: 400 });
    }

    if (!existsSync(categoriesPath)) {
      return NextResponse.json(
        { error: "Categories not found" },
        { status: 404 },
      );
    }

    const content = await readFile(categoriesPath, "utf-8");
    let categories = JSON.parse(content);

    if (!categories.includes(category)) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    categories = categories.filter((c: string) => c !== category);
    await writeFile(categoriesPath, JSON.stringify(categories, null, 2));

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
