"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GifInteractions from "@/components/GifInteractions";
import { getGifUrl } from "@/lib/getGifUrl";
import MindLeaderboard from "@/components/MindLeaderboard";
import MindMobileBanner from "@/components/MindMobileBanner";
import type { Gif } from "@/lib/gifs";

interface GifPageClientProps {
  initialGif: Gif;
  initialRelated: Gif[];
  initialPrevGif: { id: string; slug: string } | null;
  initialNextGif: { id: string; slug: string } | null;
}

export default function GifPageClient({
  initialGif,
  initialRelated,
  initialPrevGif,
  initialNextGif,
}: GifPageClientProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const safeGif = {
    ...initialGif,
    actress: initialGif.actress ?? "Amateur",
    category: initialGif.category ?? "anal",
    tags: initialGif.tags ?? [],
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative w-full mb-6 rounded-xl overflow-hidden bg-black">
        <img
          src={getGifUrl(safeGif, "clean") || ""}
          alt={safeGif.title.en}
          className="w-full h-auto"
          style={{ maxHeight: "70vh", objectFit: "contain" }}
        />
      </div>

      <GifInteractions
        gifId={safeGif.id}
        wmUrl={getGifUrl(safeGif, "wm") || ""}
        initialViews={0}
        tags={safeGif.tags}
        actress={safeGif.actress}
        category={safeGif.category}
        prevGif={initialPrevGif}
        nextGif={initialNextGif}
      />

      <div className="bg-card rounded-xl p-6 mb-6">
        <p className="text-textDim leading-relaxed">{safeGif.description.en}</p>
      </div>

      {isMobile !== null && (
        <div className="my-6">
          {isMobile ? <MindMobileBanner /> : <MindLeaderboard />}
        </div>
      )}

      {initialRelated.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4">✨ You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {initialRelated.map((g) => {
              const title = g.title.en || "Untitled";
              return (
                <Link key={g.id} href={`/gif/${g.slug.en}`}>
                  <div className="rounded-lg overflow-hidden bg-card hover:scale-105 transition">
                    <img
                      src={getGifUrl(g, "preview") || ""}
                      alt={title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-2 text-xs text-textDim text-center truncate">
                      {title.slice(0, 40)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
