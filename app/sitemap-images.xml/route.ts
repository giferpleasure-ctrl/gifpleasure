import { NextResponse } from "next/server";
import { getGifs } from "@/lib/gifs";
import { getGifUrl } from "@/lib/cloudStorage";

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&]/g, (m) => {
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    if (m === "&") return "&amp;";
    return m;
  });
}

export async function GET() {
  const gifs = await getGifs();
  const baseUrl = "https://gifpleasure.com";

  const imageUrls = gifs
    .map((gif) => {
      const imageLoc = getGifUrl(`webp/${gif.id}.webp`);
      // Преобразуем дату в ISO 8601 формат (например, 2026-05-19T00:00:00.000Z)
      const uploadDate = new Date(gif.createdAt).toISOString();
      return `
    <url>
      <loc>${baseUrl}/gif/${gif.slug.en}</loc>
      <image:image>
        <image:loc>${escapeXml(imageLoc)}</image:loc>
        <image:title>${escapeXml(gif.title.en)}</image:title>
        <image:caption>${escapeXml(gif.tags.join(", "))}</image:caption>
        <image:uploadDate>${uploadDate}</image:uploadDate>
      </image:image>
    </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${imageUrls}
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
