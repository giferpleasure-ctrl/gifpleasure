"use client";

import { useEffect } from "react";

const KEY = "e5dde221df3915c3a5695be2decfe583";
const CONTAINER_ID = `atContainer-${KEY}`;
const SCRIPT_SRC = `https://www.highrevenueformat.com/${KEY}/invoke.js`;

export default function MindMobileBanner() {
  useEffect(() => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

    (window as any).atAsyncOptions = (window as any).atAsyncOptions || [];
    (window as any).atAsyncOptions.push({
      key: KEY,
      format: "js",
      async: true,
      container: CONTAINER_ID,
      params: {},
    });

    const s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = SCRIPT_SRC;
    document.head.appendChild(s);
  }, []);

  return (
    <div className="w-full flex justify-center" data-slot="page">
      <div id={CONTAINER_ID} style={{ width: 300, height: 250 }} />
    </div>
  );
}
