import { NextRequest, NextResponse } from "next/server";
import { getGifs, getGifsShuffled, applyGifFilters } from "@/lib/gifs";

const MAX_LIMIT = 100;

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const offset = Math.max(0, parseInt(sp.get("offset") || "0", 10) || 0);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(sp.get("limit") || "45", 10) || 45),
  );
  const sort = sp.get("sort") || "latest";
  const seedParam = sp.get("seed");

  const filters = {
    category: sp.get("category") || undefined,
    tag: sp.get("tag") || undefined,
    actress: sp.get("actress") || undefined,
    q: sp.get("q") || undefined,
  };

  let gifs;
  if (sort === "shuffle") {
    const seed = seedParam ? parseInt(seedParam, 10) : 0;
    gifs = await getGifsShuffled(seed);
  } else {
    gifs = await getGifs();
  }

  gifs = applyGifFilters(gifs, filters);

  const total = gifs.length;
  const items = gifs.slice(offset, offset + limit);
  const hasMore = offset + limit < total;

  return NextResponse.json({ items, total, hasMore });
}
