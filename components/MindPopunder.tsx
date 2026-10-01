"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SESSION_COOKIE = "mnd_ps";
const POPUNDER_SRC =
  "https://pl29608555.profitableratecpmnetwork.com/c6/4a/57/c64a57ae13934a5a71279088655f28d1.js";

export default function MindPopunder() {
  const pathname = usePathname();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    // Сессионная кука — умирает при закрытии браузера
    if (
      document.cookie
        .split("; ")
        .some((c) => c.startsWith(SESSION_COOKIE + "="))
    ) {
      return;
    }

    document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Lax`;
    setShouldLoad(true);
  }, [pathname]);

  if (!shouldLoad) return null;

  return <Script src={POPUNDER_SRC} strategy="afterInteractive" />;
}
