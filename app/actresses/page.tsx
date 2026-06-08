import { getGifs } from "@/lib/gifs";
import Link from "next/link";
import { Metadata } from "next";
import { getGifUrl } from "@/lib/getGifUrl";
import TelegramPlaceholder from "@/components/TelegramPlaceholder";
import TelegramGif from "@/components/TelegramGif";

export const metadata: Metadata = {
  title: "All Actresses | GifPleasure",
  description:
    "Discover the hottest adult actresses in high-quality GIFs. Browse through the biggest stars and find your favorite scenes.",
  alternates: {
    canonical: "/actresses",
  },
};

export default async function ActressesPage() {
  const gifs = await getGifs();

  // Создаём Map: актриса -> первая гифка
  const actressMap = new Map<string, any>();
  gifs.forEach((gif) => {
    if (
      gif.actress &&
      gif.actress !== "Amateur" &&
      !actressMap.has(gif.actress)
    ) {
      actressMap.set(gif.actress, gif);
    }
  });

  // Сортируем по алфавиту
  const actresses = Array.from(actressMap.entries()).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  // На десктопе (5 колонок) баннер после 5 элементов
  // На мобилке (2 колонки) баннер после 4 элементов
  const firstRowCountDesktop = 5;
  const firstRowCountMobile = 4;

  const firstRow = actresses.slice(0, firstRowCountDesktop);
  const rest = actresses.slice(firstRowCountDesktop);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">All Actresses</h1>
      <p className="text-textDim mb-8">
        Discover the hottest adult actresses in high-quality GIFs. Browse
        through the biggest stars and find your favorite scenes.
      </p>

      {/* Первые 5 актрис (видно на всех экранах) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {firstRow.map(([name, gif]) => {
          const previewUrl = getGifUrl(gif, "preview");
          const slug = name.toLowerCase().replace(/ /g, "-");

          return (
            <Link
              key={name}
              href={`/actress/${slug}`}
              className="group block bg-card rounded-lg overflow-hidden hover:scale-105 transition"
            >
              <div className="aspect-square w-full overflow-hidden bg-black">
                <img
                  src={previewUrl || ""}
                  alt={name}
                  className="w-full h-full object-cover group-hover:opacity-90 transition"
                  loading="lazy"
                />
              </div>
              <div className="p-3 text-center">
                <h2 className="text-sm font-medium text-text group-hover:text-accent transition">
                  {name}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>

      {/* РЕКЛАМНЫЙ БЛОК — позиция зависит от экрана */}
      {/* На десктопе (≥640px) баннер после первого ряда (5 элементов) */}
      {/* На мобилке (<640px) баннер после 4 элементов (2 ряда по 2) */}
      <div className="my-8">
        {/* Десктоп: 728×90 */}
        <div className="hidden sm:block">
          <TelegramPlaceholder />
        </div>
        {/* Мобилка: 300×250 */}
        <div className="block sm:hidden">
          <TelegramGif />
        </div>
      </div>

      {/* Остальные актрисы */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {rest.map(([name, gif]) => {
          const previewUrl = getGifUrl(gif, "preview");
          const slug = name.toLowerCase().replace(/ /g, "-");

          return (
            <Link
              key={name}
              href={`/actress/${slug}`}
              className="group block bg-card rounded-lg overflow-hidden hover:scale-105 transition"
            >
              <div className="aspect-square w-full overflow-hidden bg-black">
                <img
                  src={previewUrl || ""}
                  alt={name}
                  className="w-full h-full object-cover group-hover:opacity-90 transition"
                  loading="lazy"
                />
              </div>
              <div className="p-3 text-center">
                <h2 className="text-sm font-medium text-text group-hover:text-accent transition">
                  {name}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
