"use client";

import { useEffect } from "react";

const SCRIPT_SRC =
  "https://pl29608556.profitableratecpmnetwork.com/0d2910e5c1e1fbf77c0735a4c5d3afeb/invoke.js";
const CONTAINER_ID = "container-0d2910e5c1e1fbf77c0735a4c5d3afeb";

export default function MindInFeed() {
  useEffect(() => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

    const s = document.createElement("script");
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    s.src = SCRIPT_SRC;
    document.body.appendChild(s);
  }, []);

  return (
    <div
      className="w-full min-h-[380px] rounded-lg bg-card overflow-hidden"
      data-slot="feed"
    >
      <div id={CONTAINER_ID} />
    </div>
  );
}
