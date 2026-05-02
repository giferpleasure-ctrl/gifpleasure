import { getGifs } from "@/lib/gifs";
import GifGrid from "@/components/GifGrid";
import { Locale } from "@/lib/types";
import { shuffleArray } from "@/lib/shuffle";

interface SearchPageProps {
  params: { lang: Locale };
  searchParams: { q?: string };
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const query = searchParams.q?.toLowerCase() || "";
  const allGifs = await getGifs();

  const results = allGifs.filter((gif) => {
    const title = (gif.title[params.lang] || gif.title.en || "").toLowerCase();
    const tags = gif.tags.some((tag) => tag.toLowerCase().includes(query));
    const actress = (gif.actress || "").toLowerCase().includes(query);
    return title.includes(query) || tags || actress;
  });

  // Перемешиваем результаты поиска
  const shuffledResults = shuffleArray(results);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Search results for "{query}"
        </h1>
        <p className="text-textDim">
          Found {results.length} GIF{results.length !== 1 ? "s" : ""}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12 text-textDim">
          No GIFs found. Try different keywords.
        </div>
      ) : (
        <GifGrid
          gifs={shuffledResults}
          lang={params.lang}
          firstPosition={7}
          interval={9}
        />
      )}
    </div>
  );
}
