import { getGifs } from "@/lib/gifs";
import Link from "next/link";
import { Metadata } from "next";

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

  // Собираем уникальные категории
  const categoriesSet = new Set<string>();
  gifs.forEach((gif) => {
    if (gif.category) {
      categoriesSet.add(gif.category);
    }
  });

  // Сортируем по алфавиту
  const categories = Array.from(categoriesSet).sort((a, b) =>
    a.localeCompare(b),
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">All Categories</h1>
      <p className="text-textDim mb-8">
        Explore adult GIFs by category. Big ass, anal, blowjob and more — all in
        high quality.
      </p>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/category/${category}`}
            className="bg-card hover:bg-accent/20 text-textDim hover:text-accent px-4 py-2 rounded-full text-sm transition"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}
