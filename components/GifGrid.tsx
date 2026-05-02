import GifCard from "./GifCard";
import EmptyPlaceholder from "./EmptyPlaceholder";
import { insertEmptyItems } from "@/lib/contentInject";
import { Locale } from "@/lib/types";

interface GifGridProps {
  gifs: any[];
  lang: Locale;
  firstPosition?: number;
  interval?: number;
}

export default function GifGrid({
  gifs,
  lang,
  firstPosition = 7,
  interval = 9,
}: GifGridProps) {
  const itemsWithEmpty = insertEmptyItems(gifs, firstPosition, interval);

  //когда будет реклама удалить ниже этого комментария и разкомментировать другой return
  const onlyGifs = itemsWithEmpty.filter((item) => item.type === "content");

  return (
    <div className="masonry-grid">
      {onlyGifs.map((item, idx) => (
        <div key={idx} className="masonry-item">
          <GifCard gif={item.data} lang={lang} priority={item.data.priority} />
        </div>
      ))}
    </div>
  );
}

//   return (
//     <div className="masonry-grid">
//       {itemsWithEmpty.map((item, idx) => (
//         <div key={idx} className="masonry-item">
//           {item.type === "content" ? (
//             <GifCard
//               gif={item.data}
//               lang={lang}
//               priority={item.data.priority}
//             />
//           ) : (
//             <EmptyPlaceholder />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
