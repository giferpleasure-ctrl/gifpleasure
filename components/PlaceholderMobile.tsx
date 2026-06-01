"use client";

import { useEffect, useRef } from "react";

export default function PlaceholderMobile() {
  const ref = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!ref.current || isLoaded.current) return;
    isLoaded.current = true;

    const atOptions = {
      key: "306b86d8a7f7af5d53e074677220d8a6", // ← замени на свой ключ
      format: "iframe",
      height: 50,
      width: 320,
      params: {},
    };

    (window as any).atOptions = atOptions;

    const script = document.createElement("script");
    script.src =
      "https://www.highperformanceformat.com/306b86d8a7f7af5d53e074677220d8a6/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} className="w-full flex justify-center my-4" />;
}
