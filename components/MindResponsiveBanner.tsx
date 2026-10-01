"use client";

import { useEffect, useState } from "react";
import MindLeaderboard from "./MindLeaderboard";
import MindMobileBanner from "./MindMobileBanner";

export default function MindResponsiveBanner() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile === null) return null;
  return isMobile ? <MindMobileBanner /> : <MindLeaderboard />;
}
