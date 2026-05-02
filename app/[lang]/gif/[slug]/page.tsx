import { getGifBySlug } from "@/lib/gifs";
import { Metadata } from "next";
import { Locale } from "@/lib/types";
import GifPageClient from "./GifPageClient";

interface GifPageProps {
  params: {
    lang: Locale;
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: GifPageProps): Promise<Metadata> {
  const gif = await getGifBySlug(params.lang, params.slug);
  if (!gif) return {};

  return {
    title: `${gif.title[params.lang]} | GifPleasure`,
    description: gif.description[params.lang],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: gif.title[params.lang],
      description: gif.description[params.lang],
      images: [`/gifs/preview/${gif.id}_preview.webp`],
    },
    other: {
      rating: "adult",
    },
  };
}

export default async function GifPage({ params }: GifPageProps) {
  const gif = await getGifBySlug(params.lang, params.slug);
  if (!gif) return null;

  return <GifPageClient params={params} initialGif={gif} />;
}
