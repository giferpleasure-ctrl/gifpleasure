"use client";

import Link from "next/link";
import Search from "./Search";

export default function Header() {
  const href = "/";

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

          {/* Поиск */}
          <div className="flex-1 w-full sm:max-w-md md:max-w-xl">
            <Search />
          </div>

          {/* Навигация */}
          <div className="flex gap-4 text-sm justify-center sm:justify-end items-center">
            <Link href="/actresses" className="hover:text-accent">
              Actresses
            </Link>
            <Link href="/tags" className="hover:text-accent">
              Tags
            </Link>
            <Link href="/categories" className="hover:text-accent">
              Categories
            </Link>
            <Link href={href} className="hover:text-accent">
              Home
            </Link>
            {/* BongaCams Live Models — розовая ссылка */}
            <Link
              href="https://bngprm.com/promo.php?type=direct_link&v=2&c=837848&page=top_5_by_growth&g=female"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 font-medium transition"
            >
              Live Models
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
