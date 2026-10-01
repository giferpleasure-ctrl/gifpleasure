import { getFilteredGifs } from "@/lib/gifs";
import { notFound } from "next/navigation";
import GifGridInfinite from "@/components/GifGridInfinite";
import { Metadata } from "next";

interface ActressPageProps {
  params: { name: string };
}

const CHUNK_SIZE = 45;

export async function generateMetadata({
  params,
}: ActressPageProps): Promise<Metadata> {
  const actress = decodeURIComponent(params.name).replace(/-/g, " ");
  return {
    title: `${actress} — Adult GIFs | GifPleasure`,
    description: `Watch the best GIFs with ${actress}. Free high-quality adult animated GIFs.`,
    alternates: { canonical: `/actress/${params.name}` },
  };
}

export default async function ActressPage({ params }: ActressPageProps) {
  const actressName = decodeURIComponent(params.name).replace(/-/g, " ");
  const gifs = await getFilteredGifs({ actress: actressName });

  if (gifs.length === 0) notFound();

  const initialItems = gifs.slice(0, CHUNK_SIZE);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{actressName}</h1>
        <p className="text-textDim">
          {gifs.length} GIF{gifs.length !== 1 ? "s" : ""} with {actressName}
        </p>
      </div>
      <GifGridInfinite
        key={`actress-${actressName}`}
        initialItems={initialItems}
        totalCount={gifs.length}
        sort="latest"
        filters={{ actress: actressName }}
      />
    </div>
  );
}
