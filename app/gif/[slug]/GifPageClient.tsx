"use client";

import { useEffect, useState } from "react";
import { getRelatedGifs, getGifs } from "@/lib/gifs";
import { notFound } from "next/navigation";
import Link from "next/link";
import GifInteractions from "@/components/GifInteractions";
import { getGifUrl } from "@/lib/getGifUrl"; // ← ИЗМЕНЕНО
import TelegramPlaceholder from "@/components/TelegramPlaceholder";
import TelegramGif from "@/components/TelegramGif";
import PlaceholderGif from "@/components/PlaceholderGif";
import PlaceholderContent from "@/components/PlaceholderContent";

interface GifPageClientProps {
  initialGif: any;
}

// Компонент счётчика просмотров (временно отключён)
function ViewTracker({ gifId }: { gifId: string }) {
  return null;
}

export default function GifPageClient({ initialGif }: GifPageClientProps) {
  const [gif, setGif] = useState<any>(initialGif);
  const [loading, setLoading] = useState(false);
  const [related, setRelated] = useState<any[]>([]);
  const [prevGifData, setPrevGifData] = useState<any>(null);
  const [nextGifData, setNextGifData] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!gif) {
        notFound();
        return;
      }

      const allGifs = await getGifs();
      const categoryGifs = allGifs.filter((g) => g.category === gif.category);

      const currentIndex = categoryGifs.findIndex((g) => g.id === gif.id);
      const prevG = currentIndex > 0 ? categoryGifs[currentIndex - 1] : null;
      const nextG =
        currentIndex < categoryGifs.length - 1
          ? categoryGifs[currentIndex + 1]
          : null;

      setPrevGifData(
        prevG
          ? {
              id: prevG.id,
              slug: prevG.slug.en,
            }
          : null,
      );

      setNextGifData(
        nextG
          ? {
              id: nextG.id,
              slug: nextG.slug.en,
            }
          : null,
      );

      const relatedData = await getRelatedGifs(gif.id, 8);
      setRelated(relatedData);
      setLoading(false);
    }

    loadData();
  }, [gif]);

  if (loading || !gif) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const safeGif = {
    ...gif,
    actress: gif.actress ?? "Amateur",
    category: gif.category ?? "anal",
    tags: gif.tags ?? [],
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ViewTracker gifId={safeGif.id} />

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
        prevGif={prevGifData}
        nextGif={nextGifData}
      />

      <div className="bg-card rounded-xl p-6 mb-6">
        <p className="text-textDim leading-relaxed">{safeGif.description.en}</p>
      </div>

      {/* АДАПТИВНЫЙ РЕКЛАМНЫЙ БЛОК */}
      <div className="my-6">
        {isMobile ? <PlaceholderGif /> : <PlaceholderContent />}
      </div>

      {related.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4">✨ You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((g) => {
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
