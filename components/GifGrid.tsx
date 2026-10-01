import GifCard from "./GifCard";
import { insertEmptyItems } from "@/lib/contentInject";
import TelegramInFeed from "./TelegramInFeed";
import GirlInFeed from "./GirlInFeed";
import MindInFeed from "./MindInFeed";

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
  let placeholderIndex = 0;

  return (
    <div className="masonry-grid">
      {itemsWithEmpty.map((item, idx) => {
        if (item.type === "content") {
          return (
            <div key={idx} className="masonry-item">
              <GifCard gif={item.data} priority={item.data.priority} />
            </div>
          );
        }

        const i = placeholderIndex++;

        if (i === 0) {
          return (
            <div key={idx} className="masonry-item">
              <MindInFeed />
            </div>
          );
        }

        if (i === 1) {
          return (
            <div key={idx} className="masonry-item">
              <GirlInFeed />
            </div>
          );
        }

        return (
          <div key={idx} className="masonry-item">
            <TelegramInFeed />
          </div>
        );
      })}
    </div>
  );
}
