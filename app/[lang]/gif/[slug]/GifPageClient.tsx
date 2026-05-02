"use client";

import { useEffect, useState } from "react";
import { getRelatedGifs, getGifs } from "@/lib/gifs";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Locale } from "@/lib/types";
import GifInteractions from "@/components/GifInteractions";
// import ContentBlock from "@/components/ContentBlock";
import { getGifUrl } from "@/lib/cloudStorage";

interface GifPageClientProps {
  params: {
    lang: Locale;
    slug: string;
  };
  initialGif: any;
}

// Компонент счётчика просмотров
function ViewTracker({ gifId }: { gifId: string }) {
  useEffect(() => {
    console.log("🔍 ViewTracker gifId:", gifId);

    const key = `viewed_${gifId}`;
    if (!sessionStorage.getItem(key)) {
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gifId }),
      });
      sessionStorage.setItem(key, "true");
    }
  }, [gifId]);
  return null;
}

export default function GifPageClient({
  params,
  initialGif,
}: GifPageClientProps) {
  const [gif, setGif] = useState<any>(initialGif);
  const [loading, setLoading] = useState(false);
  const [related, setRelated] = useState<any[]>([]);
  const [dict, setDict] = useState<any>(null);
  const [prevGifData, setPrevGifData] = useState<any>(null);
  const [nextGifData, setNextGifData] = useState<any>(null);

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
              slug: prevG.slug[params.lang] || prevG.slug.en,
            }
          : null,
      );

      setNextGifData(
        nextG
          ? {
              id: nextG.id,
              slug: nextG.slug[params.lang] || nextG.slug.en,
            }
          : null,
      );

      const relatedData = await getRelatedGifs(gif.id, 8);
      const dictData = await getDictionary(params.lang);

      setRelated(relatedData);
      setDict(dictData);
      setLoading(false);
    }

    loadData();
  }, [params.lang, params.slug, gif]);

  if (loading || !gif || !dict) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const safeGif = {
    ...gif,
    actress: gif.actress ?? "Amateur",
    category: gif.category ?? "anal",
    tags: gif.tags ?? [],
    likes: gif.likes ?? 0,
    views: gif.views ?? 0,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ViewTracker gifId={safeGif.id} />

      <div className="relative w-full mb-6 rounded-xl overflow-hidden bg-black">
        <img
          src={getGifUrl(`webp/${safeGif.id}.webp`)}
          alt={safeGif.title[params.lang]}
          className="w-full h-auto"
          style={{ maxHeight: "70vh", objectFit: "contain" }}
        />
      </div>

      <GifInteractions
        gifId={safeGif.id}
        wmUrl={getGifUrl(`webp/${safeGif.id}_wm.webp`)}
        initialLikes={safeGif.likes}
        initialViews={safeGif.views}
        tags={safeGif.tags}
        lang={params.lang}
        actress={safeGif.actress}
        category={safeGif.category}
        prevGif={prevGifData}
        nextGif={nextGifData}
      />

      <div className="bg-card rounded-xl p-6 mb-6">
        <p className="text-textDim leading-relaxed">
          {safeGif.description[params.lang]}
        </p>
      </div>

      {/* Блок перед похожими гифками */}
      {/* <ContentBlock /> */}

      {related.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4">✨ {dict.gif.related}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((g) => {
              const title = g.title[params.lang] || g.title.en || "Untitled";
              return (
                <Link
                  key={g.id}
                  href={`/${params.lang}/gif/${g.slug[params.lang]}`}
                >
                  <div className="rounded-lg overflow-hidden bg-card hover:scale-105 transition">
                    <img
                      src={getGifUrl(`preview/${g.id}_preview.webp`)}
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
