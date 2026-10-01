import SortButtons from "@/components/SortButtons";
import GifGridInfinite from "@/components/GifGridInfinite";
import { getGifs, getGifsShuffled } from "@/lib/gifs";

const CHUNK_SIZE = 45;

interface HomePageProps {
  searchParams: { sort?: string; seed?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const sort: "latest" | "shuffle" =
    searchParams.sort === "latest" ? "latest" : "shuffle";

  let allGifs;
  let seed: number;

  if (sort === "latest") {
    allGifs = await getGifs();
    seed = 0;
  } else {
    seed = searchParams.seed
      ? parseInt(searchParams.seed, 10)
      : Math.floor(Math.random() * 1000000);
    allGifs = await getGifsShuffled(seed);
  }

  const initialItems = allGifs.slice(0, CHUNK_SIZE);

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {sort === "latest" ? "🔥 Latest GIFs" : "🔥 Hot GIFs"}
        </h1>
        <SortButtons />
      </div>
      <GifGridInfinite
        key={`${sort}-${seed}`}
        initialItems={initialItems}
        totalCount={allGifs.length}
        seed={seed}
        sort={sort}
      />
    </>
  );
}
