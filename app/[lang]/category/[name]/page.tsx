import { getGifs } from "@/lib/gifs";
import { notFound } from "next/navigation";
import Link from "next/link";
import GifGrid from "@/components/GifGrid";
import { Metadata } from "next";
import { Locale } from "@/lib/types";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { shuffleArray } from "@/lib/shuffle";

interface CategoryPageProps {
  params: {
    lang: Locale;
    name: string;
  };
}

async function getAllCategories(): Promise<string[]> {
  const categoriesPath = path.join(process.cwd(), "data", "categories.json");
  if (!existsSync(categoriesPath)) return [];
  const content = await readFile(categoriesPath, "utf-8");
  return JSON.parse(content);
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = params.name;
  return {
    title: `${category} — Adult GIFs | GifPleasure`,
    description: `Watch the best ${category} adult GIFs. Free high-quality animated GIFs.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const allGifs = await getGifs();
  const categoryName = params.name;
  const gifs = allGifs.filter(
    (gif) => gif.category.toLowerCase() === categoryName.toLowerCase(),
  );

  const shuffledGifs = shuffleArray(gifs);

  if (gifs.length === 0) notFound();

  const allCategories = await getAllCategories();
  const displayName = allCategories.includes(categoryName)
    ? categoryName
    : categoryName;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
        <p className="text-textDim">
          {gifs.length} GIF{gifs.length !== 1 ? "s" : ""} in {displayName}
        </p>
      </div>
      <GifGrid
        gifs={shuffledGifs}
        lang={params.lang}
        firstPosition={7}
        interval={9}
      />
    </div>
  );
}
