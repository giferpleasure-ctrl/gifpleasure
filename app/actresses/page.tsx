import { getGifs } from "@/lib/gifs";
import Link from "next/link";
import { Metadata } from "next";

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

  // Собираем уникальных актрис (исключаем "Amateur")
  const actressesSet = new Set<string>();
  gifs.forEach((gif) => {
    if (gif.actress && gif.actress !== "Amateur") {
      actressesSet.add(gif.actress);
    }
  });

  // Сортируем по алфавиту
  const actresses = Array.from(actressesSet).sort((a, b) => a.localeCompare(b));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">All Actresses</h1>
      <p className="text-textDim mb-8">
        Discover the hottest adult actresses in high-quality GIFs. Browse
        through the biggest stars and find your favorite scenes.
      </p>

      <div className="flex flex-wrap gap-3">
        {actresses.map((actress) => (
          <Link
            key={actress}
            href={`/actress/${actress.toLowerCase().replace(/ /g, "-")}`}
            className="bg-card hover:bg-accent/20 text-textDim hover:text-accent px-4 py-2 rounded-full text-sm transition"
          >
            {actress}
          </Link>
        ))}
      </div>
    </div>
  );
}
