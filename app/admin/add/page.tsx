"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// Словарь существующих тегов для автодополнения
const EXISTING_TAGS = [
  "anal",
  "blowjob",
  "lesbian",
  "group",
  "solo",
  "pov",
  "casting",
  "hard",
  "deep",
  "double",
  "creampie",
  "facial",
  "rough",
  "amateur",
  "brunette",
  "blonde",
  "redhead",
  "milf",
  "teen",
  "mature",
  "bdsm",
  "threesome",
  "gangbang",
  "squirt",
  "feet",
  "latex",
  "cosplay",
  "vr",
];

export default function AddGifPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    url?: string;
    error?: string;
  } | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // Загружаем категории
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0 && !selectedCategory) {
          setSelectedCategory(data[0]);
        }
      })
      .catch(console.error);
  }, []);

  // Автодополнение тегов
  useEffect(() => {
    if (tagInput.length < 1) {
      setSuggestions([]);
      return;
    }
    const filtered = EXISTING_TAGS.filter(
      (tag) =>
        tag.toLowerCase().includes(tagInput.toLowerCase()) &&
        !tags.includes(tag),
    );
    setSuggestions(filtered.slice(0, 5));
  }, [tagInput, tags]);

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const addTag = () => {
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput("");
      setSuggestions([]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const addNewCategory = async () => {
    if (!newCategory.trim()) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: newCategory }),
    });
    const data = await res.json();
    if (data.success) {
      setCategories(data.categories);
      setNewCategory("");
      setShowAddCategory(false);
      setSelectedCategory(newCategory.trim().toLowerCase());
    } else {
      alert(data.error);
    }
  };

  const deleteCategory = async (categoryToDelete: string) => {
    const res = await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: categoryToDelete }),
    });
    const data = await res.json();
    if (data.success) {
      setCategories(data.categories);
      if (selectedCategory === categoryToDelete) {
        setSelectedCategory(data.categories[0] || "");
      }
    } else {
      alert(data.error);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    formData.set("tags", tags.join(","));
    if (selectedCategory) {
      formData.set("category", selectedCategory);
    }

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);

      if (response.ok && data.success) {
        if (formRef.current) formRef.current.reset();
        setTags([]);
        setTagInput("");
        setSelectedCategory(categories[0] || "");
        setTimeout(() => router.push("/admin"), 2000);
      }
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Add New GIF</h1>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Clean GIF (no watermark) *
          </label>
          <input
            type="file"
            name="clean"
            accept=".webp"
            required
            className="w-full border rounded px-3 py-2 bg-card"
          />
          <p className="text-xs text-textDim mt-1">Example: video.webp</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Watermarked GIF *
          </label>
          <input
            type="file"
            name="watermarked"
            accept=".webp"
            required
            className="w-full border rounded px-3 py-2 bg-card"
          />
          <p className="text-xs text-textDim mt-1">
            Must have same base name + "_wm" suffix
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Preview (static WebP) *
          </label>
          <input
            type="file"
            name="preview"
            accept=".webp"
            required
            className="w-full border rounded px-3 py-2 bg-card"
          />
          <p className="text-xs text-textDim mt-1">
            Must have same base name + "_preview" suffix
          </p>
        </div>

        <hr className="border-border" />

        <div>
          <label className="block text-sm font-medium mb-1">
            Title (English) *
          </label>
          <input
            type="text"
            name="titleEn"
            required
            className="w-full border rounded px-3 py-2 bg-card"
          />
          <p className="text-xs text-textDim mt-1">
            Will be used for URL. Example: "Anal Casting Brunette 25"
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description (English) *
          </label>
          <textarea
            name="descriptionEn"
            rows={4}
            required
            className="w-full border rounded px-3 py-2 bg-card"
          />
          <p className="text-xs text-textDim mt-1">
            Start with "Watch..." for better CTR. 150-160 characters
            recommended.
          </p>
        </div>

        {/* Умный ввод тегов */}
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a tag..."
                className="w-full border rounded px-3 py-2 bg-card"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-lg shadow-lg">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      className="px-3 py-2 hover:bg-border cursor-pointer text-sm"
                      onClick={() => {
                        setTagInput(suggestion);
                        addTag();
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={addTag}
              className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded transition"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 transition"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-textDim mt-2">
            Type a tag, click Add or press Enter. You can add unlimited tags.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Actress name</label>
          <input
            type="text"
            name="actress"
            placeholder="Leave empty for 'Amateur'"
            className="w-full border rounded px-3 py-2 bg-card"
          />
        </div>

        {/* Динамические категории с поиском и удалением */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>

          <div className="flex gap-2 mb-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search or select category..."
                className="w-full border rounded px-3 py-2 bg-card"
              />
              {categorySearch.length > 0 && filteredCategories.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredCategories.map((cat) => (
                    <div
                      key={cat}
                      className="px-3 py-2 hover:bg-border cursor-pointer text-sm flex justify-between items-center"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCategorySearch("");
                      }}
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete category "${cat}"?`)) {
                            deleteCategory(cat);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 ml-2 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="bg-card border border-border hover:border-accent px-3 py-2 rounded transition"
              title="Add new category"
            >
              +
            </button>
          </div>

          {selectedCategory && (
            <div className="mb-2">
              <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm inline-flex items-center gap-2">
                {selectedCategory}
                <button
                  type="button"
                  onClick={() => setSelectedCategory("")}
                  className="hover:text-red-500 transition"
                >
                  ✕
                </button>
              </span>
            </div>
          )}

          {showAddCategory && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name..."
                className="flex-1 border rounded px-3 py-2 bg-card text-sm"
              />
              <button
                type="button"
                onClick={addNewCategory}
                className="bg-accent hover:bg-accent/80 text-white px-3 py-2 rounded text-sm transition"
              >
                Add
              </button>
            </div>
          )}

          <input type="hidden" name="category" value={selectedCategory} />
          <p className="text-xs text-textDim mt-2">
            Type to search, click to select, or click "+" to add new category
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Width (px)</label>
            <input
              type="number"
              name="width"
              defaultValue={480}
              className="w-full border rounded px-3 py-2 bg-card"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Height (px)
            </label>
            <input
              type="number"
              name="height"
              defaultValue={270}
              className="w-full border rounded px-3 py-2 bg-card"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/80 text-white py-2 rounded transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Add GIF"}
        </button>
      </form>

      {result && (
        <div
          className={`mt-4 p-3 rounded ${result.success ? "bg-green-900" : "bg-red-900"}`}
        >
          {result.success ? (
            <>
              <p>✅ GIF added successfully!</p>
              <a
                href={result.url}
                target="_blank"
                className="text-accent underline"
              >
                View GIF page →
              </a>
              <p className="text-sm text-textDim mt-2">
                Redirecting to admin panel...
              </p>
            </>
          ) : (
            <p>❌ Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
