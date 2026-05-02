import { getGifs, getGifsShuffled } from "@/lib/gifs";
import SortButtons from "@/components/SortButtons";
import GifGrid from "@/components/GifGrid";
import { Locale } from "@/lib/types";

interface HomePageProps {
  params: {
    lang: Locale;
  };
  searchParams: {
    sort?: string;
    seed?: string;
  };
}

export default async function HomePage({
  params,
  searchParams,
}: HomePageProps) {
  const sort = searchParams.sort || "shuffle";
  let gifs;

  if (sort === "latest") {
    const allGifs = await getGifs();
    gifs = allGifs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else {
    const seed = searchParams.seed
      ? parseInt(searchParams.seed)
      : Math.floor(Math.random() * 1000000);
    gifs = await getGifsShuffled(seed);
  }

  // Добавляем priority для первых 3 гифок (ускоряет их загрузку)
  const gifsWithPriority = gifs.map((gif, index) => ({
    ...gif,
    priority: index < 3,
  }));

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {sort === "latest" ? "🔥 Latest GIFs" : "🔥 Hot GIFs"}
        </h1>
        <SortButtons />
      </div>
      <GifGrid
        gifs={gifsWithPriority}
        lang={params.lang}
        firstPosition={7}
        interval={9}
      />
    </>
  );
}
