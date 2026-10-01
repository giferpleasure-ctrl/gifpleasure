import { getFilteredGifs } from "@/lib/gifs";
import { notFound } from "next/navigation";
import GifGridInfinite from "@/components/GifGridInfinite";
import { Metadata } from "next";

interface CategoryPageProps {
  params: { name: string };
}

const CHUNK_SIZE = 45;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = params.name;
  return {
    title: `${category} — Adult GIFs | GifPleasure`,
    description: `Watch the best ${category} adult GIFs. Free high-quality animated GIFs.`,
    alternates: { canonical: `/category/${category}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = params.name;
  const gifs = await getFilteredGifs({ category: categoryName });

  if (gifs.length === 0) notFound();

  const initialItems = gifs.slice(0, CHUNK_SIZE);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
        <p className="text-textDim">
          {gifs.length} GIF{gifs.length !== 1 ? "s" : ""} in {categoryName}
        </p>
      </div>
      <GifGridInfinite
        key={`category-${categoryName}`}
        initialItems={initialItems}
        totalCount={gifs.length}
        sort="latest"
        filters={{ category: categoryName }}
      />
    </div>
  );
}
