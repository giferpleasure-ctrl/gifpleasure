import SortButtons from "@/components/SortButtons";
import GifGrid from "@/components/GifGrid";
import { Locale } from "@/lib/types";

interface HomePageProps {
  params: { lang: Locale };
  searchParams: { sort?: string; seed?: string };
}

async function getGifs() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/gifs`, { cache: "no-store" });
  return res.json();
}

export default async function HomePage({
  params,
  searchParams,
}: HomePageProps) {
  const sort = searchParams.sort || "shuffle";
  let gifs = await getGifs();

  if (sort === "latest") {
    gifs = gifs.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else {
    const seed = searchParams.seed
      ? parseInt(searchParams.seed)
      : Math.floor(Math.random() * 1000000);
    // Перемешиваем на клиенте (или переделай серверную логику)
    gifs = shuffleArray(gifs, seed);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {sort === "latest" ? "🔥 Latest GIFs" : "🔥 Hot GIFs"}
        </h1>
        <SortButtons />
      </div>
      <GifGrid gifs={gifs} lang={params.lang} firstPosition={7} interval={9} />
    </>
  );
}

function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const rng = mulberry32(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
