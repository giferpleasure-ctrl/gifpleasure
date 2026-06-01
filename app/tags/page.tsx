import { getGifs } from "@/lib/gifs";
import Link from "next/link";
import { Metadata } from "next";
import PlaceholderGif from "@/components/PlaceholderGif";
import PlaceholderContent from "@/components/PlaceholderContent";

export const metadata: Metadata = {
  title: "All Tags | GifPleasure",
  description:
    "Browse adult GIFs by tags. From anal to blowjob — find exactly what you're looking for.",
  alternates: {
    canonical: "/tags",
  },
};

export default async function TagsPage() {
  const gifs = await getGifs();

  // Собираем уникальные теги
  const tagsSet = new Set<string>();
  gifs.forEach((gif) => {
    gif.tags.forEach((tag: string) => tagsSet.add(tag));
  });

  // Сортируем по алфавиту
  const tags = Array.from(tagsSet).sort((a, b) => a.localeCompare(b));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">All Tags</h1>
      <p className="text-textDim mb-8">
        Browse adult GIFs by tags. From #anal to #blowjob — find exactly what
        you're looking for.
      </p>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tag/${tag}`}
            className="bg-card hover:bg-accent/20 text-textDim hover:text-accent px-4 py-2 rounded-full text-sm transition"
          >
            #{tag}
          </Link>
        ))}
      </div>

      {/* РЕКЛАМНЫЙ БЛОК ВНИЗУ СТРАНИЦЫ — адаптивный */}
      <div className="mt-12">
        <div className="hidden sm:block">
          <PlaceholderGif />
        </div>
        <div className="block sm:hidden">
          <PlaceholderContent />
        </div>
      </div>
    </div>
  );
}
