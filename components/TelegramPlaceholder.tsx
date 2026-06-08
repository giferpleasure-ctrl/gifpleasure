"use client";

import Link from "next/link";

export default function TelegramPlaceholder() {
  const tgLink = "https://t.me/+EEwXBmddaHw2YWVi";

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col items-center justify-between gap-6 p-6 md:flex-row">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <svg
              className="h-8 w-8 text-accent"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.214-1.446 1.394c-.16.16-.294.294-.604.294l.215-3.092 5.628-5.086c.245-.215-.053-.335-.38-.12l-6.96 4.383-3-.937c-.654-.205-.666-.654.137-.97l11.61-4.48c.542-.197 1.018.12.84.93z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text">
              Join our <span className="text-accent">Telegram VIP</span>
            </h3>
            <p className="text-base text-textDim">
              Exclusive GIFs. New content earlier.
            </p>
            <div className="mt-2 flex gap-3">
              <span className="text-xs text-textDim">✓ Daily updates</span>
              <span className="text-xs text-textDim">✓ Premium content</span>
              <span className="text-xs text-textDim">✓ 100% free</span>
            </div>
          </div>
        </div>
        <Link
          href={tgLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-accent px-8 py-3 font-semibold whitespace-nowrap text-white hover:bg-accent/80"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.214-1.446 1.394c-.16.16-.294.294-.604.294l.215-3.092 5.628-5.086c.245-.215-.053-.335-.38-.12l-6.96 4.383-3-.937c-.654-.205-.666-.654.137-.97l11.61-4.48c.542-.197 1.018.12.84.93z" />
          </svg>
          Join Telegram VIP
        </Link>
      </div>
    </div>
  );
}
