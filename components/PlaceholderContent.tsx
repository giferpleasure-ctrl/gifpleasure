"use client";

import { useEffect, useRef } from "react";

interface PlaceholderContentProps {
  id?: string; // ← добавляем уникальный ID
}

export default function PlaceholderContent({
  id = "default",
}: PlaceholderContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!ref.current || isLoaded.current) return;
    isLoaded.current = true;

    // Уникальный идентификатор для этого блока
    const uniqueKey = `atOptions_${id}`;

    // Создаём уникальный объект atOptions для каждого блока
    (window as any)[uniqueKey] = {
      key: "e5dde221df3915c3a5695be2decfe583",
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    };

    const script = document.createElement("script");
    script.src =
      "https://www.highperformanceformat.com/e5dde221df3915c3a5695be2decfe583/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");

    // Передаём уникальный ключ скрипту
    script.setAttribute("data-at-options-var", uniqueKey);

    ref.current.appendChild(script);
  }, [id]);

  return <div ref={ref} className="w-full flex justify-center my-4" />;
}
