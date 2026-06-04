import metadata from "@/public/gifs/metadata.json";

export interface GifUrls {
  imgbb?: {
    clean?: string;
    wm?: string;
    preview?: string;
  };
  selectel?: {
    clean?: string;
    wm?: string;
    preview?: string;
  };
}

export interface Gif {
  id: string;
  slug: { en: string };
  title: { en: string };
  description: { en: string };
  tags: string[];
  actress: string;
  category: string;
  width: number;
  height: number;
  likes: number;
  views: number;
  createdAt: string;
  urls?: GifUrls; // ← ДОБАВЛЕНО
}

// Получает гифки без статистики (только из metadata.json)
async function getGifsWithStats(): Promise<Gif[]> {
  const baseGifs = (metadata as any[]).map((item) => ({
    ...item,
    actress: item.actress || "Amateur",
    category: item.category || "anal",
  })) as Gif[];

  return baseGifs;
}

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const rng = mulberry32(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function getGifs(): Promise<Gif[]> {
  const gifs = await getGifsWithStats();
  return gifs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getGifsShuffled(seed: number): Promise<Gif[]> {
  const sorted = await getGifs();
  return shuffleArray(sorted, seed);
}

export async function getGifBySlug(slug: string): Promise<Gif | null> {
  const allGifs = await getGifsWithStats();
  return allGifs.find((gif) => gif.slug.en === slug) || null;
}

export async function getRelatedGifs(
  currentId: string,
  limit: number = 8,
): Promise<Gif[]> {
  const allGifs = await getGifsWithStats();
  const current = allGifs.find((g) => g.id === currentId);
  if (!current) return [];

  const withScores = allGifs
    .filter((g) => g.id !== currentId)
    .map((g) => {
      const matchCount = g.tags.filter((tag) =>
        current.tags.includes(tag),
      ).length;
      return { gif: g, score: matchCount };
    })
    .filter((item) => item.score > 0);

  withScores.sort((a, b) => b.score - a.score);

  const groupedByScore = new Map<number, typeof withScores>();
  for (const item of withScores) {
    if (!groupedByScore.has(item.score)) {
      groupedByScore.set(item.score, []);
    }
    groupedByScore.get(item.score)!.push(item);
  }

  const shuffledResults: Gif[] = [];
  for (const [_, group] of groupedByScore) {
    for (let i = group.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [group[i], group[j]] = [group[j], group[i]];
    }
    shuffledResults.push(...group.map((item) => item.gif));
  }

  return shuffledResults.slice(0, limit);
}
