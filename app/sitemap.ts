import { MetadataRoute } from "next";
import { getGifs } from "@/lib/gifs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.gifpleasure.com";
  const gifs = await getGifs();

  // Вычисляем дату последнего изменения контента для статичных страниц
  const lastModifiedDate = gifs.reduce((latest, gif) => {
    const gifDate = new Date(gif.createdAt).getTime();
    return gifDate > latest ? gifDate : latest;
  }, 0);
  const lastModified = new Date(lastModifiedDate);

  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: lastModified,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  const gifPages = gifs.map((gif) => ({
    url: `${baseUrl}/gif/${gif.slug.en}`,
    lastModified: new Date(gif.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const tags = new Set<string>();
  gifs.forEach((gif) => {
    gif.tags.forEach((tag) => tags.add(tag));
  });

  const tagPages = Array.from(tags).map((tag) => ({
    url: `${baseUrl}/tag/${tag.replace(/ /g, "-")}`,
    lastModified: lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const actresses = new Set<string>();
  gifs.forEach((gif) => {
    if (gif.actress && gif.actress !== "Amateur") {
      actresses.add(gif.actress);
    }
  });

  const actressPages = Array.from(actresses).map((actress) => ({
    url: `${baseUrl}/actress/${actress.toLowerCase().replace(/ /g, "-")}`,
    lastModified: lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categories = new Set<string>();
  gifs.forEach((gif) => {
    if (gif.category) {
      categories.add(gif.category);
    }
  });

  const categoryPages = Array.from(categories).map((category) => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...gifPages,
    ...tagPages,
    ...actressPages,
    ...categoryPages,
    {
      url: `${baseUrl}/sitemap-images.xml`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];
}
