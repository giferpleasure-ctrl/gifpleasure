"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ListItem {
  name: string;
  count: number;
}

export default function AddGifPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    url?: string;
    error?: string;
  } | null>(null);

  // Тэги
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [suggestions, setSuggestions] = useState<ListItem[]>([]);
  const [existingTags, setExistingTags] = useState<ListItem[]>([]);

  // Категории
  const [categories, setCategories] = useState<ListItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Актрисы
  const [actresses, setActresses] = useState<ListItem[]>([]);
  const [selectedActress, setSelectedActress] = useState("");
  const [actressSearch, setActressSearch] = useState("");
  const [newActress, setNewActress] = useState("");
  const [showAddActress, setShowAddActress] = useState(false);

  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // Загружаем категории
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: ListItem[]) => {
        setCategories(data);
        if (data.length > 0 && !selectedCategory) {
          setSelectedCategory(data[0].name);
        }
      })
      .catch(console.error);
  }, []);

  // Загружаем актрис
  useEffect(() => {
    fetch("/api/actresses")
      .then((res) => res.json())
      .then((data: ListItem[]) => {
        setActresses(data);
      })
      .catch(console.error);
  }, []);

  // Загружаем тэги
  useEffect(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data: ListItem[]) => {
        setExistingTags(data);
      })
      .catch(console.error);
  }, []);

  // Автодополнение тэгов
  useEffect(() => {
    if (tagInput.length < 1) {
      setSuggestions([]);
      return;
    }
    const filtered = existingTags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
        !tags.includes(tag.name),
    );
    setSuggestions(filtered.slice(0, 10));
  }, [tagInput, tags, existingTags]);

  // Фильтрация категорий
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  // Фильтрация актрис
  const filteredActresses = actresses.filter((act) =>
    act.name.toLowerCase().includes(actressSearch.toLowerCase()),
  );

  // ========== ТЭГИ ==========
  const addTag = async () => {
    const newTag = tagInput.trim().toLowerCase();
    if (!newTag) return;
    if (tags.includes(newTag)) return;

    // Если тэга нет в глобальном списке — добавляем через API
    if (!existingTags.some((t) => t.name === newTag)) {
      try {
        const res = await fetch("/api/tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tag: newTag }),
        });
        const data = await res.json();
        if (data.success) {
          // Обновляем список тэгов с новыми данными
          const updatedRes = await fetch("/api/tags");
          const updatedTags = await updatedRes.json();
          setExistingTags(updatedTags);
        } else {
          alert(data.error);
        }
      } catch (err) {
        console.error("Failed to add tag:", err);
      }
    }

    setTags([...tags, newTag]);
    setTagInput("");
    setSuggestions([]);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // ========== КАТЕГОРИИ ==========
  const addNewCategory = async () => {
    if (!newCategory.trim()) return;
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: newCategory }),
    });
    const data = await res.json();
    if (data.success) {
      const updatedRes = await fetch("/api/categories");
      const updated = await updatedRes.json();
      setCategories(updated);
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
      const updatedRes = await fetch("/api/categories");
      const updated = await updatedRes.json();
      setCategories(updated);
      if (selectedCategory === categoryToDelete) {
        setSelectedCategory(updated[0]?.name || "");
      }
    } else {
      alert(data.error);
    }
  };

  // ========== АКТРИСЫ ==========
  const addNewActress = async () => {
    if (!newActress.trim()) return;
    const res = await fetch("/api/actresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actress: newActress }),
    });
    const data = await res.json();
    if (data.success) {
      const updatedRes = await fetch("/api/actresses");
      const updated = await updatedRes.json();
      setActresses(updated);
      setNewActress("");
      setShowAddActress(false);
      setSelectedActress(newActress.trim());
    } else {
      alert(data.error);
    }
  };

  const deleteActress = async (actressToDelete: string) => {
    const res = await fetch("/api/actresses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actress: actressToDelete }),
    });
    const data = await res.json();
    if (data.success) {
      const updatedRes = await fetch("/api/actresses");
      const updated = await updatedRes.json();
      setActresses(updated);
      if (selectedActress === actressToDelete) {
        setSelectedActress("");
      }
    } else {
      alert(data.error);
    }
  };

  // ========== ОТПРАВКА ==========
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    formData.set("tags", tags.join(","));
    if (selectedCategory) {
      formData.set("category", selectedCategory);
    }
    if (selectedActress) {
      formData.set("actress", selectedActress);
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
        setSelectedCategory(categories[0]?.name || "");
        setSelectedActress("");
        // Обновляем счётчики после добавления
        const [updatedCategories, updatedActresses, updatedTags] =
          await Promise.all([
            fetch("/api/categories").then((r) => r.json()),
            fetch("/api/actresses").then((r) => r.json()),
            fetch("/api/tags").then((r) => r.json()),
          ]);
        setCategories(updatedCategories);
        setActresses(updatedActresses);
        setExistingTags(updatedTags);
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
        {/* Файлы — без изменений */}
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

        {/* Title */}
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

        {/* Description */}
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

        {/* Тэги */}
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Enter a tag..."
                className="w-full border rounded px-3 py-2 bg-card"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-lg shadow-lg">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.name}
                      className="px-3 py-2 hover:bg-border cursor-pointer text-sm"
                      onClick={() => {
                        setTagInput(suggestion.name);
                        addTag();
                      }}
                    >
                      {suggestion.name}{" "}
                      <span className="text-textDim text-xs ml-1">
                        ({suggestion.count} GIFs)
                      </span>
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

        {/* Актриса */}
        <div>
          <label className="block text-sm font-medium mb-1">Actress name</label>

          <div className="flex gap-2 mb-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={actressSearch}
                onChange={(e) => setActressSearch(e.target.value)}
                placeholder="Search or select actress..."
                className="w-full border rounded px-3 py-2 bg-card"
              />
              {actressSearch.length > 0 && filteredActresses.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredActresses.map((act) => (
                    <div
                      key={act.name}
                      className="px-3 py-2 hover:bg-border cursor-pointer text-sm flex justify-between items-center"
                      onClick={() => {
                        setSelectedActress(act.name);
                        setActressSearch("");
                      }}
                    >
                      <span>
                        {act.name}
                        <span className="text-textDim text-xs ml-2">
                          ({act.count} GIFs)
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete actress "${act.name}"?`)) {
                            deleteActress(act.name);
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
              onClick={() => setShowAddActress(!showAddActress)}
              className="bg-card border border-border hover:border-accent px-3 py-2 rounded transition"
              title="Add new actress"
            >
              +
            </button>
          </div>

          {selectedActress && (
            <div className="mb-2">
              <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm inline-flex items-center gap-2">
                {selectedActress}
                <button
                  type="button"
                  onClick={() => setSelectedActress("")}
                  className="hover:text-red-500 transition"
                >
                  ✕
                </button>
              </span>
            </div>
          )}

          {showAddActress && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newActress}
                onChange={(e) => setNewActress(e.target.value)}
                placeholder="New actress name..."
                className="flex-1 border rounded px-3 py-2 bg-card text-sm"
              />
              <button
                type="button"
                onClick={addNewActress}
                className="bg-accent hover:bg-accent/80 text-white px-3 py-2 rounded text-sm transition"
              >
                Add
              </button>
            </div>
          )}

          <input type="hidden" name="actress" value={selectedActress} />
          <p className="text-xs text-textDim mt-2">
            Type to search, click to select, or click "+" to add new actress
          </p>
        </div>

        {/* Категории */}
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
                      key={cat.name}
                      className="px-3 py-2 hover:bg-border cursor-pointer text-sm flex justify-between items-center"
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setCategorySearch("");
                      }}
                    >
                      <span>
                        {cat.name}
                        <span className="text-textDim text-xs ml-2">
                          ({cat.count} GIFs)
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete category "${cat.name}"?`)) {
                            deleteCategory(cat.name);
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

        {/* Width / Height */}
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
