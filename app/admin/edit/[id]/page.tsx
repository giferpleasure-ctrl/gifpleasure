"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditGifPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState("");

  // Загружаем категории
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  // Загружаем данные гифки
  useEffect(() => {
    fetch("/api/admin")
      .then((res) => res.json())
      .then((data) => {
        const gif = data.find((g: any) => g.id === id);
        if (gif) setFormData(gif);
        else setError("GIF not found");
        setLoading(false);
      })
      .catch(() => setError("Failed to load"));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/admin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) router.push("/admin");
    else setError("Save failed");
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (!formData) return <div className="p-8 text-center">Not found</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit GIF: {id}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Title (English)
          </label>
          <input
            type="text"
            value={formData.title.en}
            onChange={(e) =>
              setFormData({ ...formData, title: { en: e.target.value } })
            }
            className="w-full border rounded px-3 py-2 bg-card"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description (English)
          </label>
          <textarea
            rows={4}
            value={formData.description.en}
            onChange={(e) =>
              setFormData({ ...formData, description: { en: e.target.value } })
            }
            className="w-full border rounded px-3 py-2 bg-card"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={formData.tags.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                tags: e.target.value.split(",").map((t: string) => t.trim()),
              })
            }
            className="w-full border rounded px-3 py-2 bg-card"
          />
          <p className="text-xs text-textDim mt-1">
            Separate tags with commas: anal, casting, brunette
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Actress</label>
          <input
            type="text"
            value={formData.actress || ""}
            onChange={(e) =>
              setFormData({ ...formData, actress: e.target.value })
            }
            placeholder="Leave empty for 'Amateur'"
            className="w-full border rounded px-3 py-2 bg-card"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full border rounded px-3 py-2 bg-card"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <p className="text-xs text-textDim mt-1">
            Select from existing categories
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Width</label>
            <input
              type="number"
              value={formData.width}
              onChange={(e) =>
                setFormData({ ...formData, width: parseInt(e.target.value) })
              }
              className="w-full border rounded px-3 py-2 bg-card"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Height</label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) =>
                setFormData({ ...formData, height: parseInt(e.target.value) })
              }
              className="w-full border rounded px-3 py-2 bg-card"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-accent hover:bg-accent/80 text-white py-2 rounded transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
