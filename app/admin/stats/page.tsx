"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Item {
  name: string;
  count: number;
}

type TabType = "actresses" | "categories" | "tags";

export default function AdminStatsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("actresses");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "count">("count");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const loadItems = () => {
    setLoading(true);
    fetch(`/api/${activeTab}`)
      .then((res) => res.json())
      .then((data: Item[]) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const handleDelete = async (name: string) => {
    if (
      !confirm(
        `Delete "${name}"? This will NOT delete GIFs, only remove it from the list.`,
      )
    )
      return;

    const res = await fetch(`/api/${activeTab}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        activeTab === "actresses"
          ? { actress: name }
          : activeTab === "categories"
            ? { category: name }
            : { tag: name },
      ),
    });
    const data = await res.json();
    if (data.success) {
      loadItems(); // Перезагружаем список
    } else {
      alert(data.error || "Delete failed");
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortOrder === "asc" ? a.count - b.count : b.count - a.count;
    }
  });

  const getEditUrl = (name: string): string => {
    switch (activeTab) {
      case "actresses":
        return `/admin?actress=${encodeURIComponent(name)}`;
      case "categories":
        return `/admin?category=${encodeURIComponent(name)}`;
      case "tags":
        return `/admin?tag=${encodeURIComponent(name)}`;
      default:
        return "/admin";
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Content Statistics</h1>

      {/* Вкладки */}
      <div className="flex gap-2 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("actresses")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "actresses"
              ? "text-accent border-b-2 border-accent"
              : "text-textDim hover:text-text"
          }`}
        >
          Actresses
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "categories"
              ? "text-accent border-b-2 border-accent"
              : "text-textDim hover:text-text"
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab("tags")}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === "tags"
              ? "text-accent border-b-2 border-accent"
              : "text-textDim hover:text-text"
          }`}
        >
          Tags
        </button>
      </div>

      {/* Поиск и сортировка */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 bg-card border border-border rounded-lg text-sm w-full sm:w-64"
        />
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "count")}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm"
          >
            <option value="count">Sort by count</option>
            <option value="name">Sort by name</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm hover:border-accent transition"
          >
            {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
          </button>
        </div>
      </div>

      {/* Таблица */}
      {loading ? (
        <div className="text-center py-12 text-textDim">Loading...</div>
      ) : sortedItems.length === 0 ? (
        <div className="text-center py-12 text-textDim">No results found</div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-border/30">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium">
                  Name
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium w-32">
                  GIFs
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr
                  key={item.name}
                  className="border-t border-border hover:bg-border/20 transition"
                >
                  <td className="px-4 py-3 text-sm">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className="bg-accent/20 text-accent px-2 py-0.5 rounded-full text-xs">
                      {item.count}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={getEditUrl(item.name)}
                      className="text-accent text-sm hover:underline mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.name)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
