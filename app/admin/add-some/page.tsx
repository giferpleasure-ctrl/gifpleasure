"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ListItem {
  name: string;
  count: number;
}

interface FileGroup {
  baseName: string;
  clean: File;
  preview: File;
  wm: File;
}

interface GroupStatus {
  baseName: string;
  category: string;
  tags: string[];
  description: string;
  title: string;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export default function AddSomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [groupStatuses, setGroupStatuses] = useState<GroupStatus[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Актриса (как в Add)
  const [actresses, setActresses] = useState<ListItem[]>([]);
  const [selectedActress, setSelectedActress] = useState("");
  const [actressSearch, setActressSearch] = useState("");
  const [newActress, setNewActress] = useState("");
  const [showAddActress, setShowAddActress] = useState(false);

  // Категории, теги, seos
  const [categories, setCategories] = useState<ListItem[]>([]);
  const [tagsList, setTagsList] = useState<ListItem[]>([]);
  const [seos, setSeos] = useState<string[]>([]);
  const [site, setSite] = useState("");

  // Существующие id (для проверки уникальности)
  const [existingIds, setExistingIds] = useState<Set<string>>(new Set());

  // Все выбранные файлы
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Загрузка данных
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/tags").then((r) => r.json()),
      fetch("/api/seos").then((r) => r.json()),
      fetch("/api/actresses").then((r) => r.json()),
      fetch("/api/admin").then((r) => r.json()), // для существующих id
    ])
      .then(([catData, tagData, seoData, actData, metaData]) => {
        setCategories(catData);
        setTagsList(tagData);
        setSeos(seoData);
        setActresses(actData);
        const ids = metaData.map((item: any) => item.id);
        setExistingIds(new Set(ids));
      })
      .catch(console.error);
  }, []);

  // Фильтрация актрис
  const filteredActresses = actresses.filter((a) =>
    a.name.toLowerCase().includes(actressSearch.toLowerCase()),
  );

  const addNewActress = async () => {
    if (!newActress.trim()) return;
    const res = await fetch("/api/actresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actress: newActress.trim() }),
    });
    const data = await res.json();
    if (data.success) {
      const updated = await fetch("/api/actresses").then((r) => r.json());
      setActresses(updated);
      setSelectedActress(newActress.trim());
      setNewActress("");
      setShowAddActress(false);
    } else {
      alert(data.error || "Failed to add actress");
    }
  };

  // Функция генерации id (как на сервере)
  function generateId(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Группировка файлов
  function groupFiles(files: File[]): FileGroup[] {
    const groups: { [key: string]: Partial<FileGroup> } = {};
    for (const file of files) {
      const name = file.name.replace(/\.webp$/i, "");
      let base = name;
      let type: "clean" | "preview" | "wm" = "clean";
      if (name.endsWith("_preview")) {
        base = name.slice(0, -8);
        type = "preview";
      } else if (name.endsWith("_wm")) {
        base = name.slice(0, -3);
        type = "wm";
      }
      if (!groups[base]) groups[base] = { baseName: base };
      groups[base][type] = file;
    }
    return Object.values(groups)
      .filter((g) => g.clean && g.preview && g.wm)
      .map((g) => g as FileGroup);
  }

  // Генерация случайной категории, тегов и seo-фразы
  const getRandomCategory = () => {
    if (categories.length === 0) return "other";
    return categories[Math.floor(Math.random() * categories.length)].name;
  };

  const getRandomTags = (count = 5) => {
    if (tagsList.length === 0) return ["hot"];
    const shuffled = [...tagsList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map((t) => t.name);
  };

  const getRandomSeo = () => {
    if (seos.length === 0) return "porn gif";
    return seos[Math.floor(Math.random() * seos.length)];
  };

  // Шаблоны описания
  const descriptionTemplates = [
    (
      actress: string,
      category: string,
      site: string,
      tag1: string,
      tag2: string,
    ) =>
      `Watch ${actress} in a hot ${category} scene${site ? ` from ${site}` : ""}. This Full HD GIF captures ${tag1} and ${tag2}. Only on GifPleasure – uncensored, no watermarks.`,
    (
      actress: string,
      category: string,
      site: string,
      tag1: string,
      tag2: string,
    ) =>
      `${actress} delivers pure passion in this ${category} video${site ? ` from ${site}` : ""}. The GIF shows intense ${tag1} action, with ${tag2} and more. High-quality adult GIF.`,
    (
      actress: string,
      category: string,
      site: string,
      tag1: string,
      tag2: string,
    ) =>
      `Check out ${actress} getting ${category} action – a must-see${site ? ` from ${site}` : ""}. This 5‑sec Full HD GIF features ${tag1}, ${tag2} and more. Only on GifPleasure.`,
    (
      actress: string,
      category: string,
      site: string,
      tag1: string,
      tag2: string,
    ) =>
      `Experience ${actress} in a hardcore ${category} scene${site ? ` from ${site}` : ""}. The GIF highlights ${tag1} and ${tag2}, perfect for quick viewing. GifPleasure – the best adult GIFs.`,
  ];

  const generateDescription = (
    actress: string,
    category: string,
    site: string,
    tags: string[],
  ) => {
    const idx = Math.floor(Math.random() * descriptionTemplates.length);
    const tag1 = tags[0] || "hot";
    const tag2 = tags[1] || "passion";
    return descriptionTemplates[idx](actress, category, site, tag1, tag2);
  };

  // Генерация уникального title с добавлением тегов при коллизии
  function generateUniqueTitle(
    actress: string,
    seoPhrase: string,
    category: string,
    tags: string[],
  ): { title: string; finalTags: string[] } {
    let currentTags = [...tags];
    let title = `${actress} ${seoPhrase} ${category} ${currentTags.join(" ")}`;
    let id = generateId(title);
    let attempts = 0;
    const allTagNames = tagsList.map((t) => t.name);
    while (existingIds.has(id) && attempts < 20) {
      // Находим новый тег, которого ещё нет в currentTags
      const available = allTagNames.filter((t) => !currentTags.includes(t));
      if (available.length === 0) break; // если все теги уже использованы, выходим
      const newTag = available[Math.floor(Math.random() * available.length)];
      currentTags.push(newTag);
      title = `${actress} ${seoPhrase} ${category} ${currentTags.join(" ")}`;
      id = generateId(title);
      attempts++;
    }
    return { title, finalTags: currentTags };
  }

  // Обработка выбора файлов
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    // Сбрасываем старые статусы, если они были
    setGroupStatuses([]);
    setShowResults(false);
  };

  // Генерация метаданных для групп
  const handleGenerate = () => {
    if (!selectedActress) {
      alert("Please select an actress.");
      return;
    }
    const groups = groupFiles(selectedFiles);
    if (groups.length === 0) {
      alert(
        "No complete groups found. Each GIF needs clean, preview and wm files.",
      );
      return;
    }

    const newStatuses: GroupStatus[] = groups.map((group) => {
      const category = getRandomCategory();
      const tags = getRandomTags(5);
      const seoPhrase = getRandomSeo();
      const { title, finalTags } = generateUniqueTitle(
        selectedActress,
        seoPhrase,
        category,
        tags,
      );
      const description = generateDescription(
        selectedActress,
        category,
        site,
        finalTags,
      );
      return {
        baseName: group.baseName,
        category,
        tags: finalTags,
        description,
        title,
        status: "pending",
      };
    });
    setGroupStatuses(newStatuses);
  };

  // Загрузка всех групп
  const handleUploadAll = async () => {
    if (groupStatuses.length === 0) {
      alert("No groups to upload. Generate first.");
      return;
    }
    const pendingGroups = groupStatuses.filter(
      (g) => g.status === "pending" || g.status === "error",
    );
    if (pendingGroups.length === 0) {
      alert("All groups are already uploaded or in progress.");
      return;
    }

    setLoading(true);
    setShowResults(false);

    const total = pendingGroups.length;
    let processed = 0;

    // Обновляем статусы на "uploading" для выбранных групп
    setGroupStatuses((prev) =>
      prev.map((g) =>
        pendingGroups.some((p) => p.baseName === g.baseName)
          ? { ...g, status: "uploading" }
          : g,
      ),
    );

    const MAX_RETRIES = 3;
    const RETRY_DELAY = (attempt: number) => Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
    const DELAY_BETWEEN_GROUPS = 10000; // 10 секунд

    for (let i = 0; i < pendingGroups.length; i++) {
      const group = pendingGroups[i];
      // Находим актуальные файлы для этой группы
      const fileGroup = groupFiles(selectedFiles).find(
        (g) => g.baseName === group.baseName,
      );
      if (!fileGroup) {
        setGroupStatuses((prev) =>
          prev.map((g) =>
            g.baseName === group.baseName
              ? { ...g, status: "error", error: "Files not found" }
              : g,
          ),
        );
        continue;
      }

      let success = false;
      let errorMsg = "";

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const formData = new FormData();
          formData.append("clean", fileGroup.clean);
          formData.append("watermarked", fileGroup.wm);
          formData.append("preview", fileGroup.preview);
          formData.append("titleEn", group.title);
          formData.append("descriptionEn", group.description);
          formData.append("tags", group.tags.join(","));
          formData.append("actress", selectedActress);
          formData.append("category", group.category);
          formData.append("width", "480");
          formData.append("height", "270");

          const res = await fetch("/api/admin", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (res.ok && data.success) {
            success = true;
            // После успеха обновляем existingIds, чтобы следующие проверки учитывали новый id
            const newId = generateId(group.title);
            setExistingIds((prev) => new Set(prev).add(newId));
            break;
          } else {
            errorMsg = data.error || "Server error";
          }
        } catch (err: any) {
          errorMsg = err.message || "Network error";
        }
        if (attempt < MAX_RETRIES) {
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY(attempt)),
          );
        }
      }

      setGroupStatuses((prev) =>
        prev.map((g) =>
          g.baseName === group.baseName
            ? {
                ...g,
                status: success ? "success" : "error",
                error: success ? undefined : errorMsg,
              }
            : g,
        ),
      );

      processed++;
      setProgress(Math.round((processed / total) * 100));

      // Пауза 10 секунд между группами, если не последняя
      if (i < pendingGroups.length - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, DELAY_BETWEEN_GROUPS),
        );
      }
    }

    setShowResults(true);
    setLoading(false);
  };

  // Редактирование в таблице
  const updateGroupStatus = (
    index: number,
    field: keyof GroupStatus,
    value: any,
  ) => {
    setGroupStatuses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Add Multiple GIFs</h1>

      {/* Актриса (как в Add) */}
      <div className="space-y-4 mb-6">
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
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowAddActress(!showAddActress)}
              className="bg-card border border-border hover:border-accent px-3 py-2 rounded transition"
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
          <p className="text-xs text-textDim mt-2">
            Type to search, click to select, or click "+" to add new actress
          </p>
        </div>

        {/* Сайт */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Website (for SEO, optional)
          </label>
          <input
            type="text"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder="e.g. SexMex, Brazzers..."
            className="w-full border rounded px-3 py-2 bg-card"
          />
        </div>

        {/* Выбор файлов */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Choose GIF files (select all clean, preview, wm)
          </label>
          <input
            type="file"
            multiple
            accept=".webp"
            onChange={handleFileSelect}
            className="w-full border rounded px-3 py-2 bg-card"
          />
          <p className="text-xs text-textDim mt-1">
            Select all three files for each GIF: clean, preview, and wm. They
            will be grouped automatically.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!selectedActress || selectedFiles.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition disabled:opacity-50"
          >
            Generate
          </button>
          <button
            type="button"
            onClick={handleUploadAll}
            disabled={loading || groupStatuses.length === 0}
            className="bg-accent hover:bg-accent/80 text-white py-2 px-6 rounded transition disabled:opacity-50"
          >
            {loading ? `Uploading... ${progress}%` : "Upload All"}
          </button>
        </div>
      </div>

      {/* Таблица с группами */}
      {groupStatuses.length > 0 && (
        <div className="overflow-x-auto border rounded-lg mt-6">
          <table className="w-full text-sm">
            <thead className="bg-card border-b">
              <tr>
                <th className="px-3 py-2 text-left">File</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Tags (comma separated)</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {groupStatuses.map((group, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-3 py-2">{group.baseName}</td>
                  <td className="px-3 py-2">
                    <select
                      value={group.category}
                      onChange={(e) =>
                        updateGroupStatus(idx, "category", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1 bg-card"
                      disabled={
                        group.status === "success" ||
                        group.status === "uploading"
                      }
                    >
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={group.tags.join(", ")}
                      onChange={(e) => {
                        const tags = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        updateGroupStatus(idx, "tags", tags);
                      }}
                      className="w-full border rounded px-2 py-1 bg-card"
                      disabled={
                        group.status === "success" ||
                        group.status === "uploading"
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={group.title}
                      onChange={(e) =>
                        updateGroupStatus(idx, "title", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1 bg-card"
                      disabled={
                        group.status === "success" ||
                        group.status === "uploading"
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <textarea
                      value={group.description}
                      onChange={(e) =>
                        updateGroupStatus(idx, "description", e.target.value)
                      }
                      rows={2}
                      className="w-full border rounded px-2 py-1 bg-card"
                      disabled={
                        group.status === "success" ||
                        group.status === "uploading"
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    {group.status === "pending" && (
                      <span className="text-yellow-500">Pending</span>
                    )}
                    {group.status === "uploading" && (
                      <span className="text-blue-500">Uploading</span>
                    )}
                    {group.status === "success" && (
                      <span className="text-green-500">✅ Success</span>
                    )}
                    {group.status === "error" && (
                      <span className="text-red-500">❌ {group.error}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Результаты */}
      {showResults && (
        <div className="mt-6 p-4 border rounded bg-card">
          <h2 className="font-bold mb-2">Upload Summary</h2>
          {groupStatuses.map((g, idx) => (
            <div key={idx} className="text-sm">
              {g.status === "success" ? (
                <span className="text-green-500">
                  ✅ {g.baseName} – success
                </span>
              ) : g.status === "error" ? (
                <span className="text-red-500">
                  ❌ {g.baseName} – error: {g.error}
                </span>
              ) : (
                <span className="text-gray-400">
                  ⏳ {g.baseName} – {g.status}
                </span>
              )}
            </div>
          ))}
          <button
            onClick={() => router.push("/admin")}
            className="mt-4 bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded transition"
          >
            Go back to Admin
          </button>
        </div>
      )}
    </div>
  );
}
