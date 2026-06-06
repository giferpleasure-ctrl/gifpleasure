"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Gif {
  id: string;
  title: { en: string };
  tags: string[];
  actress: string;
  category: string;
  createdAt: string;
}

interface ListItem {
  name: string;
  count: number;
}

export default function AdminPage() {
  const searchParams = useSearchParams();
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [filteredGifs, setFilteredGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(true);

  // Фильтры
  const [searchTitle, setSearchTitle] = useState("");
  const [searchActress, setSearchActress] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [categories, setCategories] = useState<ListItem[]>([]);
  const [actresses, setActresses] = useState<ListItem[]>([]);

  const loadGifs = async () => {
    const res = await fetch("/api/admin");
    const data: Gif[] = await res.json();
    setGifs(data);
    setFilteredGifs(data);

    // Загружаем категории и актрис со счётчиками
    const [catsRes, actsRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/actresses"),
    ]);
    const catsData: ListItem[] = await catsRes.json();
    const actsData: ListItem[] = await actsRes.json();
    setCategories(catsData);
    setActresses(actsData);

    // Применяем фильтры из URL
    const actressParam = searchParams.get("actress");
    const categoryParam = searchParams.get("category");
    const tagParam = searchParams.get("tag");

    if (actressParam) setSearchActress(actressParam);
    if (categoryParam) setSearchCategory(categoryParam);
    if (tagParam) setSearchTitle(tagParam);

    setLoading(false);
  };

  useEffect(() => {
    loadGifs();
  }, []);

  // Фильтрация
  useEffect(() => {
    let filtered = [...gifs];

    if (searchTitle) {
      const isTagSearch = searchParams.get("tag") !== null;
      if (isTagSearch) {
        filtered = filtered.filter((g) =>
          g.tags.some((tag) =>
            tag.toLowerCase().includes(searchTitle.toLowerCase()),
          ),
        );
      } else {
        filtered = filtered.filter((g) =>
          g.title.en.toLowerCase().includes(searchTitle.toLowerCase()),
        );
      }
    }

    if (searchActress) {
      filtered = filtered.filter((g) =>
        g.actress.toLowerCase().includes(searchActress.toLowerCase()),
      );
    }

    if (searchCategory) {
      filtered = filtered.filter((g) =>
        g.category.toLowerCase().includes(searchCategory.toLowerCase()),
      );
    }

    setFilteredGifs(filtered);
  }, [searchTitle, searchActress, searchCategory, gifs, searchParams]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this GIF?")) return;
    const res = await fetch(`/api/admin/${id}`, { method: "DELETE" });
    if (res.ok) {
      loadGifs();
    } else {
      alert("Delete failed");
    }
  };

  const clearFilters = () => {
    setSearchTitle("");
    setSearchActress("");
    setSearchCategory("");
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link
          href="/admin/add"
          className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/80"
        >
          + Add New GIF
        </Link>
      </div>

      {/* Фильтры */}
      <div className="bg-card rounded-lg p-4 mb-6 border border-border">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Filters</h2>
          <button
            onClick={clearFilters}
            className="text-sm text-textDim hover:text-accent transition"
          >
            Clear all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-textDim mb-1">
              Title / Tag
            </label>
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Filter by title or tag..."
              className="w-full border border-border rounded px-3 py-2 bg-bg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-textDim mb-1">Actress</label>
            <input
              type="text"
              value={searchActress}
              onChange={(e) => setSearchActress(e.target.value)}
              placeholder="Filter by actress..."
              list="actress-list"
              className="w-full border border-border rounded px-3 py-2 bg-bg text-sm"
            />
            <datalist id="actress-list">
              {actresses.map((a) => (
                <option key={a.name} value={a.name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-xs text-textDim mb-1">Category</label>
            <input
              type="text"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              placeholder="Filter by category..."
              list="category-list"
              className="w-full border border-border rounded px-3 py-2 bg-bg text-sm"
            />
            <datalist id="category-list">
              {categories.map((c) => (
                <option key={c.name} value={c.name} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="mt-3 text-xs text-textDim">
          Found {filteredGifs.length} GIF{filteredGifs.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Таблица гифок */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Actress</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Tags</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGifs.map((gif) => (
              <tr key={gif.id} className="border-b border-border">
                <td className="p-2 text-sm">{gif.id}</td>
                <td className="p-2 max-w-xs truncate">{gif.title.en}</td>
                <td className="p-2">
                  {gif.actress !== "Amateur" ? gif.actress : "—"}
                </td>
                <td className="p-2">{gif.category}</td>
                <td className="p-2 text-sm max-w-xs truncate">
                  {gif.tags.slice(0, 3).join(", ")}
                </td>
                <td className="p-2">
                  <Link
                    href={`/admin/edit/${gif.id}`}
                    className="text-accent mr-3 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(gif.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredGifs.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-8 text-textDim">
                  No GIFs found. Try different filters or{" "}
                  <Link href="/admin/add" className="text-accent">
                    add new
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
