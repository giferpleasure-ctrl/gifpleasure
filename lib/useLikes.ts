"use client";

import { useState, useEffect } from "react";

export function useLikes(gifId: string) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetch(`/api/stats?gifId=${gifId}`)
      .then((res) => res.json())
      .then((data) => setLikes(data.likes))
      .catch(console.error);
  }, [gifId]);

  const toggleLike = () => {
    fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gifId }),
    })
      .then((res) => res.json())
      .then((data) => setLikes(data.likes))
      .catch(console.error);
  };

  return { likes, isLiked, toggleLike };
}
