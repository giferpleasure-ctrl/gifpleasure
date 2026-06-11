"use client";

import { useEffect, useRef } from "react";
import { useId } from "react";

export default function PlaceholderContent() {
  const uniqueId = useId();
  const containerId = `ad-container-${uniqueId}`;
  const ref = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!ref.current || isLoaded.current) return;
    isLoaded.current = true;

    const atAsyncOptions = {
      key: "e5dde221df3915c3a5695be2decfe583", // твой ключ
      format: "js",
      async: true,
      container: containerId,
      params: {},
    };

    // Проверяем, существует ли глобальный массив
    if (typeof (window as any).atAsyncOptions === "undefined") {
      (window as any).atAsyncOptions = [];
    }
    (window as any).atAsyncOptions.push(atAsyncOptions);

    // Загружаем скрипт, если ещё не загружен
    if (!(window as any).atAsyncScriptLoaded) {
      (window as any).atAsyncScriptLoaded = true;
      const script = document.createElement("script");
      script.src =
        "https://www.highperformanceformat.com/e5dde221df3915c3a5695be2decfe583/invoke.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Создаём контейнер, куда Adsterra вставит iframe
    const containerDiv = document.createElement("div");
    containerDiv.id = containerId;
    ref.current.appendChild(containerDiv);
  }, [containerId]);

  return <div ref={ref} className="w-full flex justify-center my-4" />;
}
