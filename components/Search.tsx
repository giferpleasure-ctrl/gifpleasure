"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getGifUrl } from "@/lib/cloudStorage";

interface SearchProps {
  lang: string;
}

export default function Search({ lang }: SearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const res = await fetch(
      `/api/search?q=${encodeURIComponent(value)}&lang=${lang}`,
    );
    const data = await res.json();
    setResults(data);
    setShowResults(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.length >= 2) {
      router.push(`/${lang}/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <input
        type="text"
        placeholder="Search GIFs..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 rounded-full bg-card border border-border focus:border-accent outline-none text-sm transition"
      />
      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full max-h-80 overflow-y-auto bg-card border border-border rounded-xl z-50">
          {results.map((gif: any) => (
            <Link
              key={gif.id}
              href={`/${lang}/gif/${gif.slug[lang] || gif.slug.en}`}
              onClick={() => setShowResults(false)}
              className="flex items-center gap-3 p-2 hover:bg-border transition"
            >
              <img
                src={getGifUrl(`preview/${gif.id}_preview.webp`)}
                alt=""
                className="w-10 h-10 object-cover rounded"
                onError={(e) => {
                  // Fallback для локальной разработки (если облако недоступно)
                  const target = e.target as HTMLImageElement;
                  if (target.src !== `/gifs/preview/${gif.id}_preview.webp`) {
                    target.src = `/gifs/preview/${gif.id}_preview.webp`;
                  }
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">
                  {gif.title[lang] || gif.title.en}
                </div>
                <div className="text-xs text-textDim truncate">
                  {gif.tags.slice(0, 2).join(", ")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
