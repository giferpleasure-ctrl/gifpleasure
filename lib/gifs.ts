import metadata from "@/public/gifs/metadata.json";

export interface Gif {
  id: string;
  slug: { en: string; pt?: string; es?: string };
  title: { en: string; pt?: string; es?: string };
  description: { en: string; pt?: string; es?: string };
  tags: string[];
  actress: string;
  category: string;
  width: number;
  height: number;
  likes: number;
  views: number;
  createdAt: string;
}

const gifsData = (metadata as any[]).map((item) => ({
  ...item,
  actress: item.actress || "Amateur",
  category: item.category || "anal",
})) as Gif[];

// Генератор псевдослучайных чисел на основе seed
function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Перемешивает массив детерминированно на основе seed
export function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const rng = mulberry32(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Обычная сортировка по дате (новые сверху)
export async function getGifs(): Promise<Gif[]> {
  return gifsData.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

// Перемешанные гифки на основе seed
export async function getGifsShuffled(seed: number): Promise<Gif[]> {
  const sorted = await getGifs();
  return shuffleArray(sorted, seed);
}

export async function getGifBySlug(
  lang: string,
  slug: string,
): Promise<Gif | null> {
  return (
    gifsData.find((gif) => gif.slug[lang as keyof typeof gif.slug] === slug) ||
    null
  );
}

export async function getRelatedGifs(
  currentId: string,
  limit: number = 6,
): Promise<Gif[]> {
  const current = gifsData.find((g) => g.id === currentId);
  if (!current) return [];

  // Считаем количество совпадающих тегов для каждой гифки
  const withScores = gifsData
    .filter((g) => g.id !== currentId)
    .map((g) => {
      const matchCount = g.tags.filter((tag) =>
        current.tags.includes(tag),
      ).length;
      return { gif: g, score: matchCount };
    })
    .filter((item) => item.score > 0); // Только гифки с хотя бы одним общим тегом

  // Сортируем по убыванию количества совпадений
  withScores.sort((a, b) => b.score - a.score);

  // Перемешиваем гифки с одинаковым счётом, чтобы избежать повторений
  const groupedByScore = new Map<number, typeof withScores>();
  for (const item of withScores) {
    if (!groupedByScore.has(item.score)) {
      groupedByScore.set(item.score, []);
    }
    groupedByScore.get(item.score)!.push(item);
  }

  const shuffledResults: Gif[] = [];
  for (const [_, group] of groupedByScore) {
    // Перемешиваем внутри группы
    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]];
    }
    shuffledResults.push(...group.map((item) => item.gif));
  }

  // Берём первые `limit` гифок
  return shuffledResults.slice(0, limit);
}
