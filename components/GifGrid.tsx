import GifCard from "./GifCard";
import TelegramInFeed from "./TelegramInFeed";
import GirlInFeed from "./GirlInFeed";
import MindInFeed from "./MindInFeed";

interface GifGridProps {
  gifs: any[];
}

// First placeholder после гифки с индексом 6 (0-based), шаг в гифках = 11.
// Соответствует прежним firstPosition=7, interval=12, но в глобальных терминах.
const FIRST_GIF_INDEX = 6;
const STEP = 11;

function shouldPlaceholderAfter(globalIndex: number): boolean {
  if (globalIndex < FIRST_GIF_INDEX) return false;
  return (globalIndex - FIRST_GIF_INDEX) % STEP === 0;
}

function getPlaceholderType(globalIndex: number): "mind" | "girl" | "telegram" {
  const n = (globalIndex - FIRST_GIF_INDEX) / STEP;
  if (n === 0) return "mind";
  if (n === 1) return "girl";
  return "telegram";
}

export default function GifGrid({ gifs }: GifGridProps) {
  const cells: React.ReactNode[] = [];

  gifs.forEach((gif, idx) => {
    cells.push(
      <div key={`gif-${gif.id}`} className="masonry-item">
        <GifCard gif={gif} priority={gif.priority} />
      </div>,
    );

    if (shouldPlaceholderAfter(idx)) {
      const type = getPlaceholderType(idx);
      cells.push(
        <div key={`ph-${idx}`} className="masonry-item">
          {type === "mind" ? (
            <MindInFeed />
          ) : type === "girl" ? (
            <GirlInFeed />
          ) : (
            <TelegramInFeed />
          )}
        </div>,
      );
    }
  });

  return <div className="masonry-grid">{cells}</div>;
}
