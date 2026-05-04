"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { formatCategory, formatTag } from "@/lib/format";
import { getGifUrl } from "@/lib/cloudStorage";

interface GifInteractionsProps {
  gifId: string;
  wmUrl: string;
  initialViews: number;
  tags: string[];
  lang: string;
  actress?: string;
  category?: string;
  prevGif?: { id: string; slug: string } | null;
  nextGif?: { id: string; slug: string } | null;
}

export default function GifInteractions({
  gifId,
  wmUrl,
  initialViews,
  tags,
  lang,
  actress,
  category,
  prevGif,
  nextGif,
}: GifInteractionsProps) {
  // const [likes, setLikes] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|Android/i.test(navigator.userAgent));
  }, []);

  // Загружаем актуальное количество лайков из БД
  // useEffect(() => {
  //   fetch(`/api/stats?gifId=${gifId}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("🔄 Загружены лайки из БД:", data.likes);
  //       setLikes(data.likes);
  //     })
  //     .catch(console.error);
  // }, [gifId]);

  // const handleLike = () => {
  //   fetch("/api/like", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ gifId }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("👍 Новое количество лайков:", data.likes);
  //       setLikes(data.likes);
  //       setIsLiked(true);
  //     })
  //     .catch(console.error);
  // };

  const handleCopy = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const MobileNavigation = () => (
    <div className="flex justify-between items-center gap-2 mb-6">
      {prevGif ? (
        <Link
          href={`/${lang}/gif/${prevGif.slug}`}
          className="bg-card border border-border hover:border-accent px-4 py-2 rounded-full text-sm transition"
        >
          ← Previous
        </Link>
      ) : (
        <div className="w-24" />
      )}
      <button
        onClick={() => setShowShare(!showShare)}
        className="bg-card border border-border hover:border-accent px-4 py-2 rounded-full text-sm transition"
      >
        🔗 Share
      </button>
      {nextGif ? (
        <Link
          href={`/${lang}/gif/${nextGif.slug}`}
          className="bg-card border border-border hover:border-accent px-4 py-2 rounded-full text-sm transition"
        >
          Next →
        </Link>
      ) : (
        <div className="w-24" />
      )}
    </div>
  );

  const DesktopNavigation = () => (
    <div className="flex gap-2">
      {prevGif ? (
        <Link
          href={`/${lang}/gif/${prevGif.slug}`}
          className="bg-card border border-border hover:border-accent px-3 py-1.5 rounded-full text-sm transition"
        >
          ← Prev
        </Link>
      ) : (
        <div className="w-12" />
      )}
      <button
        onClick={() => setShowShare(!showShare)}
        className="bg-card border border-border hover:border-accent px-3 py-1.5 rounded-full text-sm transition"
      >
        🔗 Share
      </button>
      {nextGif ? (
        <Link
          href={`/${lang}/gif/${nextGif.slug}`}
          className="bg-card border border-border hover:border-accent px-3 py-1.5 rounded-full text-sm transition"
        >
          Next →
        </Link>
      ) : (
        <div className="w-12" />
      )}
    </div>
  );

  return (
    <>
      {isMobile && <MobileNavigation />}

      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        {/* <button
          onClick={handleLike}
          className={`px-6 py-2 rounded-full transition min-w-[150px] ${
            isLiked
              ? "bg-likeButton text-white"
              : "bg-card border border-border hover:border-accent"
          }`}
        >
          ❤️ Like {likes}
        </button> */}

        {/* <div className="text-sm text-textDim">👁️ {initialViews} views</div> */}
        {!isMobile && (
          <div className="px-6 py-2 rounded-full transition min-w-[150px] bg-likeButton text-white">
            Enjoy this GIF!
          </div>
        )}

        {!isMobile && <DesktopNavigation />}

        {isMobile ? (
          <div className="w-full">
            <a
              href={wmUrl}
              onClick={(e) => {
                e.preventDefault();
                fetch(wmUrl)
                  .then((response) => response.blob())
                  .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `gifpleasure.com_${gifId}_wm.webp`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  });
              }}
              className="block w-full text-center bg-card border border-border hover:border-accent px-6 py-2 rounded-full transition"
            >
              ⬇️ Download
            </a>
          </div>
        ) : (
          <a
            href={wmUrl}
            onClick={(e) => {
              e.preventDefault();
              fetch(wmUrl)
                .then((response) => response.blob())
                .then((blob) => {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `gifpleasure.com_${gifId}_wm.webp`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                });
            }}
            className="bg-card border border-border hover:border-accent px-6 py-2 rounded-full transition"
          >
            ⬇️ Download
          </a>
        )}
      </div>

      {showShare && (
        <div className="bg-card rounded-xl p-4 mb-6">
          <p className="text-sm text-textDim mb-2">Share this GIF:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={typeof window !== "undefined" ? window.location.href : ""}
              readOnly
              className="flex-1 bg-bg border border-border rounded px-3 py-2 text-sm"
            />
            <button
              onClick={handleCopy}
              className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded text-sm transition"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6 text-sm text-textDim">
        {actress && actress !== "Amateur" && (
          <div>
            <span className="text-text">Actress:</span>{" "}
            <Link
              href={`/${lang}/actress/${actress.toLowerCase().replace(/ /g, "-")}`}
              className="text-accent hover:underline"
            >
              {actress}
            </Link>
          </div>
        )}
        {category && (
          <div>
            <span className="text-text">Category:</span>{" "}
            <Link
              href={`/${lang}/category/${category}`}
              className="text-accent hover:underline"
            >
              {formatCategory(category)}
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag: string) => (
          <Link
            key={tag}
            href={`/${lang}/tag/${tag}`}
            className="bg-card text-textDim hover:text-accent px-3 py-1 rounded-full text-sm transition"
          >
            #{formatTag(tag)}
          </Link>
        ))}
      </div>
    </>
  );
}
