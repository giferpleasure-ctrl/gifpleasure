import { getGifs } from "@/lib/gifs";
import { notFound } from "next/navigation";
import Link from "next/link";
import GifGrid from "@/components/GifGrid";
import { Metadata } from "next";
import { Locale } from "@/lib/types";
import { shuffleArray } from "@/lib/shuffle";

interface ActressPageProps {
  params: {
    lang: Locale;
    name: string;
  };
}

export async function generateMetadata({
  params,
}: ActressPageProps): Promise<Metadata> {
  const actress = decodeURIComponent(params.name).replace(/-/g, " ");
  return {
    title: `${actress} — Adult GIFs | GifPleasure`,
    description: `Watch the best GIFs with ${actress}. Free high-quality adult animated GIFs.`,
  };
}

export default async function ActressPage({ params }: ActressPageProps) {
  const allGifs = await getGifs();
  const actressName = decodeURIComponent(params.name).replace(/-/g, " ");
  const gifs = allGifs.filter(
    (gif) => gif.actress.toLowerCase() === actressName.toLowerCase(),
  );

  const shuffledGifs = shuffleArray(gifs);

  if (gifs.length === 0) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{actressName}</h1>
        <p className="text-textDim">
          {gifs.length} GIF{gifs.length !== 1 ? "s" : ""} with {actressName}
        </p>
      </div>
      <GifGrid
        gifs={shuffledGifs}
        lang={params.lang}
        firstPosition={7}
        interval={9}
      />
    </div>
  );
}
