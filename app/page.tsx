import SortButtons from "@/components/SortButtons";
import GifGrid from "@/components/GifGrid";
import metadata from "@/public/gifs/metadata.json";

interface HomePageProps {
  searchParams: { sort?: string; seed?: string };
}

// Генератор псевдослучайных чисел
function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Перемешивает массив на основе seed
function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const rng = mulberry32(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const sort = searchParams.sort || "shuffle";
  let gifs = metadata as any[];

  if (sort === "latest") {
    gifs = [...gifs].sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else {
    // ТОЛЬКО если seed передан явно (через кнопку Shuffle или историю)
    if (searchParams.seed) {
      const seed = parseInt(searchParams.seed);
      gifs = shuffleArray(gifs, seed);
    } else {
      // При первом заходе или клике на Home — генерируем случайный порядок,
      // НО НЕ ДОБАВЛЯЕМ seed В URL!
      const randomSeed = Math.floor(Math.random() * 1000000);
      gifs = shuffleArray(gifs, randomSeed);
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {sort === "latest" ? "🔥 Latest GIFs" : "🔥 Hot GIFs"}
        </h1>
        <SortButtons />
      </div>
      <GifGrid gifs={gifs} firstPosition={7} interval={9} />
    </>
  );
}
