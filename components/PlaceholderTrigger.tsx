"use client";

import { useEffect, useRef } from "react";

export default function PlaceholderTrigger() {
  const hasTriggered = useRef(false);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (hasTriggered.current) return;

    const handleFirstClick = () => {
      if (hasTriggered.current) return;
      hasTriggered.current = true;

      if (scriptLoaded.current) return;
      scriptLoaded.current = true;

      // Загружаем Popunder скрипт при первом клике
      const script = document.createElement("script");
      // НОВЫЙ Anti-Adblock URL
      script.src =
        "https://reactahead.com/c6/4a/57/c64a57ae13934a5a71279088655f28d1.js";
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      document.body.appendChild(script);
    };

    document.addEventListener("click", handleFirstClick);
    return () => document.removeEventListener("click", handleFirstClick);
  }, []);

  return null;
}
