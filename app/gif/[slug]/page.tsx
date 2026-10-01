import { getGifBySlug, getGifs, getRelatedGifs } from "@/lib/gifs";
import { Metadata } from "next";
import GifPageClient from "./GifPageClient";
import { getGifUrl } from "@/lib/getGifUrl";

interface GifPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: GifPageProps): Promise<Metadata> {
  const gif = await getGifBySlug(params.slug);
  if (!gif) return {};

  return {
    title: `${gif.title.en} | GifPleasure`,
    description: gif.description.en,
    robots: { index: true, follow: true },
    openGraph: {
      title: gif.title.en,
      description: gif.description.en,
      images: [`/gifs/preview/${gif.id}_preview.webp`],
    },
    alternates: { canonical: `/gif/${gif.slug.en}` },
    other: { rating: "adult" },
  };
}

export default async function GifPage({ params }: GifPageProps) {
  const gif = await getGifBySlug(params.slug);
  if (!gif) return null;

  const allGifs = await getGifs();
  const categoryGifs = allGifs.filter((g) => g.category === gif.category);
  const currentIndex = categoryGifs.findIndex((g) => g.id === gif.id);

  const prevG = currentIndex > 0 ? categoryGifs[currentIndex - 1] : null;
  const nextG =
    currentIndex < categoryGifs.length - 1
      ? categoryGifs[currentIndex + 1]
      : null;

  const related = await getRelatedGifs(gif.id, 8);

  const imageUrl = getGifUrl(gif, "clean");
  const uploadDate = new Date(gif.createdAt).toISOString();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageObject",
            contentUrl: imageUrl,
            name: gif.title.en,
            description: gif.tags.join(", "),
            uploadDate,
          }),
        }}
      />
      <GifPageClient
        initialGif={gif}
        initialRelated={related}
        initialPrevGif={prevG ? { id: prevG.id, slug: prevG.slug.en } : null}
        initialNextGif={nextG ? { id: nextG.id, slug: nextG.slug.en } : null}
      />
    </>
  );
}
