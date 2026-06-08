"use client";

import Link from "next/link";

export default function TelegramGif() {
  const tgLink = "https://t.me/+EEwXBmddaHw2YWVi";

  return (
    <div className="max-w-sm rounded-lg border border-border bg-card p-5 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
        <svg
          className="h-8 w-8 text-accent"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.214-1.446 1.394c-.16.16-.294.294-.604.294l.215-3.092 5.628-5.086c.245-.215-.053-.335-.38-.12l-6.96 4.383-3-.937c-.654-.205-.666-.654.137-.97l11.61-4.48c.542-.197 1.018.12.84.93z" />
        </svg>
      </div>
      <h3 className="mb-1 text-xl font-bold text-text">
        GifPleasure VIP <span className="text-accent">Telegram</span>
      </h3>
      <p className="mb-4 text-sm text-textDim">
        Exclusive content. New GIFs earlier.
      </p>
      <Link
        href={tgLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-lg bg-accent py-2 font-medium text-white transition hover:bg-accent/80"
      >
        Join Telegram
      </Link>
    </div>
  );
}
