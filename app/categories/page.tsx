import { getGifs } from "@/lib/gifs";
import Link from "next/link";
import { Metadata } from "next";
import { getGifUrl } from "@/lib/cloudStorage";

export const metadata: Metadata = {
  title: "All Categories | GifPleasure",
  description:
    "Explore adult GIFs by category. Big ass, anal, blowjob and more — all in high quality.",
  alternates: {
    canonical: "/categories",
  },
};

export default async function CategoriesPage() {
  const gifs = await getGifs();

  // Создаём Map: категория -> первая гифка
  const categoryMap = new Map<string, any>();
  gifs.forEach((gif) => {
    if (gif.category && !categoryMap.has(gif.category)) {
      categoryMap.set(gif.category, gif);
    }
  });

  // Сортируем по алфавиту
  const categories = Array.from(categoryMap.entries()).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">All Categories</h1>
      <p className="text-textDim mb-8">
        Explore adult GIFs by category. Big ass, anal, blowjob and more — all in
        high quality.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {categories.map(([name, gif]) => {
          const previewUrl = getGifUrl(`preview/${gif.id}_preview.webp`);

          return (
            <Link
              key={name}
              href={`/category/${name}`}
              className="group block bg-card rounded-lg overflow-hidden hover:scale-105 transition"
            >
              <div className="aspect-square w-full overflow-hidden bg-black">
                <img
                  src={previewUrl}
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
