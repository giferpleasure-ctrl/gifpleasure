import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (query.length < 2) {
    return NextResponse.json([]);
  }

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
  const gifs = JSON.parse(fileContent);

  const filtered = gifs.filter((gif: any) => {
    const title = (gif.title.en || "").toLowerCase();
    const tags = gif.tags.some((tag: string) =>
      tag.toLowerCase().includes(query),
    );
    const actress = (gif.actress || "").toLowerCase().includes(query);
    return title.includes(query) || tags || actress;
  });

  return NextResponse.json(filtered.slice(0, 10));
}
