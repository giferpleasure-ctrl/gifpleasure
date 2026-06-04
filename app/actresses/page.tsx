import { getGifs } from "@/lib/gifs";
import Link from "next/link";
import { Metadata } from "next";
import { getGifUrl } from "@/lib/getGifUrl"; // ← ИЗМЕНЕНО
import PlaceholderGif from "@/components/PlaceholderGif";
import PlaceholderContent from "@/components/PlaceholderContent";

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

  // Первые 5 актрис
  const firstFive = actresses.slice(0, 5);
  const rest = actresses.slice(5);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">All Actresses</h1>
      <p className="text-textDim mb-8">
        Discover the hottest adult actresses in high-quality GIFs. Browse
        through the biggest stars and find your favorite scenes.
      </p>

      {/* Первые 5 актрис */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {firstFive.map(([name, gif]) => {
          const previewUrl = getGifUrl(gif, "preview"); // ← ИЗМЕНЕНО
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

      {/* РЕКЛАМНЫЙ БЛОК — адаптивный (десктоп 728×90, мобилка 300×250) */}
      <div className="my-8">
        <div className="hidden sm:block">
          <PlaceholderGif />
        </div>
        <div className="block sm:hidden">
          <PlaceholderContent />
        </div>
      </div>

      {/* Остальные актрисы */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {rest.map(([name, gif]) => {
          const previewUrl = getGifUrl(gif, "preview"); // ← ИЗМЕНЕНО
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
