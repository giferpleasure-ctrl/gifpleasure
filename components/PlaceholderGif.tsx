"use client";

import { useEffect, useRef } from "react";

export default function PlaceholderGif() {
  const ref = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!ref.current || isLoaded.current) return;
    isLoaded.current = true;

    const atOptions = {
      key: "45eeecb0bb7f6f67793c784881019b75", // ← замени на свой ключ
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };

    (window as any).atOptions = atOptions;

    const script = document.createElement("script");
    script.src =
      "https://www.highperformanceformat.com/45eeecb0bb7f6f67793c784881019b75/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} className="w-full flex justify-center my-4" />;
}
