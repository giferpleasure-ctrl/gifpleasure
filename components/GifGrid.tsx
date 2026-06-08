import GifCard from "./GifCard";
import { insertEmptyItems } from "@/lib/contentInject";
import TelegramGif from "./TelegramGif";

interface GifGridProps {
  gifs: any[];
  firstPosition?: number;
  interval?: number;
}

export default function GifGrid({
  gifs,
  firstPosition = 7,
  interval = 12,
}: GifGridProps) {
  const itemsWithEmpty = insertEmptyItems(gifs, firstPosition, interval);

  return (
    <div className="masonry-grid">
      {itemsWithEmpty.map((item, idx) => (
        <div key={idx} className="masonry-item">
          {item.type === "content" ? (
            <GifCard gif={item.data} priority={item.data.priority} />
          ) : (
            <TelegramGif />
          )}
        </div>
      ))}
    </div>
  );
}
