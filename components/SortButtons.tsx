"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function SortButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "shuffle";

  const handleShuffle = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    const params = new URLSearchParams();
    params.set("sort", "shuffle");
    params.set("seed", newSeed.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLatest = () => {
    const params = new URLSearchParams();
    params.set("sort", "latest");
    router.push(`${pathname}?${params.toString()}`);
  };

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
