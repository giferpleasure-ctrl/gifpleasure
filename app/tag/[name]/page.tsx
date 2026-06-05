// app/tag/[name]/page.tsx
import { getGifs } from "@/lib/gifs";
import { notFound } from "next/navigation";
import Link from "next/link";
import GifGrid from "@/components/GifGrid";
import { Metadata } from "next";
import { shuffleArray } from "@/lib/shuffle";

interface TagPageProps {
  params: {
    name: string;
  };
}

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
    alternates: {
      canonical: `/tag/${tag}`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.name);

  const allGifs = await getGifs();

  const gifs = allGifs.filter((gif) =>
    gif.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );

  const shuffledGifs = shuffleArray(gifs);

  if (gifs.length === 0) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">#{tag}</h1>
        <p className="text-textDim">
          {gifs.length} GIF{gifs.length !== 1 ? "s" : ""} with tag{" "}
          <span className="text-accent">#{tag}</span>
        </p>
      </div>

      <GifGrid gifs={shuffledGifs} firstPosition={7} interval={9} />
    </div>
  );
}
