import { getGifBySlug } from "@/lib/gifs";
import { Metadata } from "next";
import GifPageClient from "./GifPageClient";

interface GifPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: GifPageProps): Promise<Metadata> {
  const gif = await getGifBySlug(params.slug);
  if (!gif) return {};

  return {
    title: `${gif.title.en} | GifPleasure`,
    description: gif.description.en,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: gif.title.en,
      description: gif.description.en,
      images: [`/gifs/preview/${gif.id}_preview.webp`],
    },
    other: {
      rating: "adult",
    },
  };
}

export default async function GifPage({ params }: GifPageProps) {
  const gif = await getGifBySlug(params.slug);
  if (!gif) return null;

  return <GifPageClient initialGif={gif} />;
}
