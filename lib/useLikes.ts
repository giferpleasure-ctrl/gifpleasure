"use client";

import { useState, useEffect } from "react";

export function useLikes(gifId: string, initialLikes: number = 0) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Загружаем статус лайка из localStorage
  useEffect(() => {
    const liked = localStorage.getItem(`liked_${gifId}`) === "true";
    setIsLiked(liked);
    setLoaded(true);
  }, [gifId]);

  const toggleLike = async () => {
    if (isLiked) return; // Уже лайкнуто — ничего не делаем

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gifId }),
      });
      const data = await res.json();

      if (res.ok) {
        setLikes(data.likes);
        setIsLiked(true);
        localStorage.setItem(`liked_${gifId}`, "true");
      } else {
        console.error("Like failed:", data.error);
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return { likes, isLiked, toggleLike, loaded };
}
