import { getFilteredGifs } from "@/lib/gifs";
import GifGridInfinite from "@/components/GifGridInfinite";
import { Metadata } from "next";

interface SearchPageProps {
  searchParams: { q?: string };
}

const CHUNK_SIZE = 45;

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || "";
  return {
    title: `Search results for "${query}" | GifPleasure`,
    description: `Browse ${query} adult GIFs. Free high-quality animated GIFs.`,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `/search${searchParams.q ? `?q=${encodeURIComponent(searchParams.q)}` : ""}`,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const gifs = query.length >= 2 ? await getFilteredGifs({ q: query }) : [];
  const initialItems = gifs.slice(0, CHUNK_SIZE);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Search results for "{query}"
        </h1>
        <p className="text-textDim">
          Found {gifs.length} GIF{gifs.length !== 1 ? "s" : ""}
        </p>
      </div>

      {gifs.length === 0 ? (
        <div className="text-center py-12 text-textDim">
          No GIFs found. Try different keywords.
        </div>
      ) : (
        <GifGridInfinite
          key={`search-${query}`}
          initialItems={initialItems}
          totalCount={gifs.length}
          sort="latest"
          filters={{ q: query }}
        />
      )}
    </div>
  );
}
