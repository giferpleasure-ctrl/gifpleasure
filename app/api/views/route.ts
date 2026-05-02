import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const { gifId } = await request.json();

    if (!gifId) {
      return NextResponse.json({ error: "Missing gifId" }, { status: 400 });
    }

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

    const content = await readFile(metadataPath, "utf-8");
    const metadata = JSON.parse(content);

    const index = metadata.findIndex((g: any) => g.id === gifId);
    if (index === -1) {
      return NextResponse.json({ error: "GIF not found" }, { status: 404 });
    }

    metadata[index].views = (metadata[index].views || 0) + 1;
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    return NextResponse.json({ success: true, views: metadata[index].views });
  } catch (error) {
    console.error("View error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
