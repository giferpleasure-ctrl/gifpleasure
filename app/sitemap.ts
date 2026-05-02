import { MetadataRoute } from "next";
import { getGifs } from "@/lib/gifs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://gifpleasure.com"; // Замени на свой домен позже
  const gifs = await getGifs();

  // Основные статические страницы
  const staticPages = [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  // Генерируем страницы гифок
  const gifPages = gifs.map((gif) => ({
    url: `${baseUrl}/en/gif/${gif.slug.en}`,
    lastModified: new Date(gif.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
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
  }));

  return [
    ...staticPages,
    ...gifPages,
    ...tagPages,
    ...actressPages,
    ...categoryPages,
  ];
}
