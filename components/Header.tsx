"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Search from "./Search";

export default function Header({ lang }: { lang: string }) {
  const searchParams = useSearchParams();
  const seed = searchParams.get("seed");
  const href = seed ? `/${lang}?seed=${seed}` : `/${lang}`;

  return (
    <header className="border-b border-border bg-bg/95 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Логотип */}
          <Link
            href={href}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent hover:text-accent/80 text-center sm:text-left"
          >
            GifPleasure
          </Link>

          {/* Поиск — растягивается */}
          <div className="flex-1 w-full sm:max-w-md md:max-w-xl">
            <Search lang={lang} />
          </div>

          {/* Навигация */}
          <div className="flex gap-4 text-sm justify-center sm:justify-end">
            <Link href={href} className="hover:text-accent">
              Home
            </Link>
            {/* <Link href={`/${lang}/popular`} className="hover:text-accent">
              Popular
            </Link> */}
          </div>
        </div>
      </div>
    </header>
  );
}
