"use client";

import { useEffect, useRef } from "react";

export default function PlaceholderContent() {
  const ref = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!ref.current || isLoaded.current) return;
    isLoaded.current = true;

    const atOptions = {
      key: "e5dde221df3915c3a5695be2decfe583",
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    };

    (window as any).atOptions = atOptions;

    const script = document.createElement("script");
    script.src =
      "https://www.highperformanceformat.com/e5dde221df3915c3a5695be2decfe583/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} className="w-full flex justify-center my-4" />;
}
