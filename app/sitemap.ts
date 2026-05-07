import { MetadataRoute } from "next";
import { getGifs } from "@/lib/gifs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://gifpleasure.com";
  const gifs = await getGifs();

  // Основные статические страницы
  const staticPages = [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          "x-default": `${baseUrl}/en`,
        },
      },
    },
  ];

  // Генерируем страницы гифок
  const gifPages = gifs.map((gif) => ({
    url: `${baseUrl}/en/gif/${gif.slug.en}`,
    lastModified: new Date(gif.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        en: `${baseUrl}/en/gif/${gif.slug.en}`,
        "x-default": `${baseUrl}/en/gif/${gif.slug.en}`,
      },
    },
  }));

  // Получаем уникальные теги
  const tags = new Set<string>();
  gifs.forEach((gif) => {
    gif.tags.forEach((tag) => tags.add(tag));
  });

  const tagPages = Array.from(tags).map((tag) => ({
    url: `${baseUrl}/en/tag/${tag}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: `${baseUrl}/en/tag/${tag}`,
        "x-default": `${baseUrl}/en/tag/${tag}`,
      },
    },
  }));

  // Получаем уникальные актрисы
  const actresses = new Set<string>();
  gifs.forEach((gif) => {
    if (gif.actress && gif.actress !== "Amateur") {
      actresses.add(gif.actress);
    }
  });

  const actressPages = Array.from(actresses).map((actress) => ({
    url: `${baseUrl}/en/actress/${actress.toLowerCase().replace(/ /g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: `${baseUrl}/en/actress/${actress.toLowerCase().replace(/ /g, "-")}`,
        "x-default": `${baseUrl}/en/actress/${actress.toLowerCase().replace(/ /g, "-")}`,
      },
    },
  }));

  // Получаем уникальные категории
  const categories = new Set<string>();
  gifs.forEach((gif) => {
    if (gif.category) {
      categories.add(gif.category);
    }
  });

  const categoryPages = Array.from(categories).map((category) => ({
    url: `${baseUrl}/en/category/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: `${baseUrl}/en/category/${category}`,
        "x-default": `${baseUrl}/en/category/${category}`,
      },
    },
  }));

  return [
    ...staticPages,
    ...gifPages,
    ...tagPages,
    ...actressPages,
    ...categoryPages,
  ];
}
