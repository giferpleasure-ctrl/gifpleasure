"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SortButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "shuffle";
  const seed = searchParams.get("seed");

  const handleShuffle = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", "shuffle");
    params.set("seed", newSeed.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLatest = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", "latest");
    params.delete("seed");
    router.push(`${pathname}?${params.toString()}`);
  };

  // При первой загрузке, если нет параметров, устанавливаем shuffle
  useEffect(() => {
    if (!searchParams.has("sort") && !searchParams.has("seed")) {
      const newSeed = Math.floor(Math.random() * 1000000);
      router.replace(`${pathname}?sort=shuffle&seed=${newSeed}`);
    }
  }, [pathname, router, searchParams]);

  return (
    <div className="flex gap-2">
      <button
        onClick={handleLatest}
        className={`text-sm px-3 py-1 rounded-full transition ${
          currentSort === "latest"
            ? "bg-likeButton text-white"
            : "bg-card text-textDim hover:text-accent border border-border"
        }`}
      >
        ⚡New
      </button>
      <button
        onClick={handleShuffle}
        className={`text-sm px-3 py-1 rounded-full transition ${
          currentSort === "shuffle"
            ? "bg-likeButton text-white"
            : "bg-card text-textDim hover:text-accent border border-border"
        }`}
      >
        🔀 Shuffle
      </button>
    </div>
  );
}
