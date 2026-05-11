"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatTag } from "@/lib/format";
import { getGifUrl } from "@/lib/cloudStorage";

interface GifCardProps {
  gif: any;
  priority?: boolean;
}

export default function GifCard({ gif, priority = false }: GifCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const seed = searchParams.get("seed");

  const href = seed
    ? `/gif/${gif.slug.en}?seed=${seed}`
    : `/gif/${gif.slug.en}`;

  useEffect(() => {
    setHasMounted(true);
    setIsMobile(/iPhone|iPad|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 },
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [isMobile, hasMounted]);

  if (!hasMounted) {
    return (
      <div className="relative overflow-hidden rounded-lg bg-card">
        <div
          className="relative w-full"
          style={{ paddingBottom: `${(gif.height / gif.width) * 100}%` }}
        >
          <img
            src={getGifUrl(`preview/${gif.id}_preview.webp`)}
            alt={gif.title.en}
            className="absolute inset-0 w-full h-full object-cover"
            loading={priority ? "eager" : "lazy"}
          />
        </div>
        <div className="p-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-1 text-xs text-textDim">
              {gif.tags.slice(0, 2).map((tag: string) => (
                <span key={tag}>#{formatTag(tag)}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div ref={imgRef}>
        <div onClick={() => (window.location.href = href)}>
          <div className="relative overflow-hidden rounded-lg bg-card cursor-pointer">
            <div
              className="relative w-full"
              style={{ paddingBottom: `${(gif.height / gif.width) * 100}%` }}
            >
              <img
                src={
                  isVisible
                    ? getGifUrl(`webp/${gif.id}.webp`)
                    : getGifUrl(`preview/${gif.id}_preview.webp`)
                }
                alt={gif.title.en}
                className="absolute inset-0 w-full h-full object-cover"
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
              />
            </div>
          </div>
        </div>
        <div className="p-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-1 text-xs text-textDim">
              {gif.tags.slice(0, 2).map((tag: string) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-accent transition"
                >
                  #{formatTag(tag)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href={href}>
        <div
          className="relative overflow-hidden rounded-lg bg-card cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="relative w-full"
            style={{ paddingBottom: `${(gif.height / gif.width) * 100}%` }}
          >
            <img
              src={getGifUrl(`preview/${gif.id}_preview.webp`)}
              alt={gif.title.en}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              style={{ opacity: isHovered ? 0 : 1 }}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
            />
            <img
              src={getGifUrl(`webp/${gif.id}.webp`)}
              alt={gif.title.en}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              style={{ opacity: isHovered ? 1 : 0 }}
              loading="lazy"
            />
          </div>
        </div>
      </Link>
      <div className="p-2">
        <div className="flex justify-end items-center text-sm">
          <div className="flex gap-1 text-xs text-textDim">
            {gif.tags.slice(0, 2).map((tag: string) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:text-accent transition"
              >
                #{formatTag(tag)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
