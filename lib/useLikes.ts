"use client";

import { useState, useEffect } from "react";

export function useLikes(gifId: string) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Загружаем лайки при монтировании
  useEffect(() => {
    try {
      // Загружаем количество лайков из глобального хранилища (изначально из metadata)
      const storedLikes = localStorage.getItem(`likes_${gifId}`);
      const storedIsLiked = localStorage.getItem(`isLiked_${gifId}`);

      if (storedLikes !== null) {
        setLikes(parseInt(storedLikes));
      }

      setIsLiked(storedIsLiked === "true");
    } catch (error) {
      console.error("Failed to load likes:", error);
    }
    setLoaded(true);
  }, [gifId]);

  const toggleLike = () => {
    if (!loaded) return;

    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;

    setLikes(newLikes);
    setIsLiked(newIsLiked);

    try {
      localStorage.setItem(`likes_${gifId}`, newLikes.toString());
      localStorage.setItem(`isLiked_${gifId}`, newIsLiked.toString());
    } catch (error) {
      console.error("Failed to save like:", error);
    }
  };

  return { likes, isLiked, toggleLike, loaded };
}
