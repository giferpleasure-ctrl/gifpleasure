"use client";

import { useEffect, useRef, useState } from "react";
import GifGrid from "./GifGrid";
import type { Gif, GifFilters } from "@/lib/gifs";

interface Props {
  initialItems: Gif[];
  totalCount: number;
  sort?: "shuffle" | "latest";
  seed?: number;
  filters?: GifFilters;
}

const CHUNK_SIZE = 45;

export default function GifGridInfinite({
  initialItems,
  totalCount,
  sort = "latest",
  seed,
  filters,
}: Props) {
  const [items, setItems] = useState<Gif[]>(initialItems);
  const [hasMore, setHasMore] = useState(initialItems.length < totalCount);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          loadMore();
        }
      },
      { rootMargin: "500px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, items.length]);

  async function loadMore() {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        offset: String(items.length),
        limit: String(CHUNK_SIZE),
        sort,
      });
      if (seed !== undefined) params.set("seed", String(seed));
      if (filters?.category) params.set("category", filters.category);
      if (filters?.tag) params.set("tag", filters.tag);
      if (filters?.actress) params.set("actress", filters.actress);
      if (filters?.q) params.set("q", filters.q);

      const res = await fetch(`/api/gifs?${params}`);
      const data = await res.json();
      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.hasMore);
    } catch (e) {
      console.error("Failed to load more:", e);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <>
      <GifGrid gifs={items} />
      {hasMore && <div ref={sentinelRef} className="h-1" aria-hidden="true" />}
      {loading && (
        <div className="text-center py-6 text-textDim text-sm">Loading...</div>
      )}
    </>
  );
}
