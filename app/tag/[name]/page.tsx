import { getFilteredGifs } from "@/lib/gifs";
import { notFound } from "next/navigation";
import GifGridInfinite from "@/components/GifGridInfinite";
import { Metadata } from "next";

interface TagPageProps {
  params: { name: string };
}

const CHUNK_SIZE = 45;

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const tag = params.name;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `#${decodedTag} — GIFs | GifPleasure`,
    description: `Watch the best #${decodedTag} adult GIFs. Free high-quality animated GIFs.`,
    openGraph: {
      title: `#${decodedTag} — Adult GIFs`,
      description: `Collection of #${decodedTag} GIFs`,
    },
    alternates: { canonical: `/tag/${tag}` },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.name);
  const gifs = await getFilteredGifs({ tag });

  if (gifs.length === 0) notFound();

  const initialItems = gifs.slice(0, CHUNK_SIZE);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">#{tag}</h1>
        <p className="text-textDim">
          {gifs.length} GIF{gifs.length !== 1 ? "s" : ""} with tag{" "}
          <span className="text-accent">#{tag}</span>
        </p>
      </div>
      <GifGridInfinite
        key={`tag-${tag}`}
        initialItems={initialItems}
        totalCount={gifs.length}
        sort="latest"
        filters={{ tag }}
      />
    </div>
  );
}
