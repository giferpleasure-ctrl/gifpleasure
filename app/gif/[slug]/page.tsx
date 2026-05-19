// app/gif/[slug]/page.tsx
import { getGifBySlug } from "@/lib/gifs";
import { Metadata } from "next";
import GifPageClient from "./GifPageClient";
import { getGifUrl } from "@/lib/cloudStorage";

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
    alternates: {
      canonical: `/gif/${gif.slug.en}`,
    },
    other: {
      rating: "adult",
    },
  };
}

export default async function GifPage({ params }: GifPageProps) {
  const gif = await getGifBySlug(params.slug);
  if (!gif) return null;

  const imageUrl = getGifUrl(`webp/${gif.id}.webp`);
  // Преобразуем дату в ISO 8601 формат (например, 2026-05-19T00:00:00.000Z)
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
            uploadDate: uploadDate,
          }),
        }}
      />
      <GifPageClient initialGif={gif} />
    </>
  );
}
