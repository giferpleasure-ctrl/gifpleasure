const fs = require("fs");
const path = require("path");

// Путь к твоему metadata.json
const filePath = path.join(__dirname, "public", "gifs", "metadata.json");

// Читаем файл
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Ошибка чтения файла:", err);
    return;
  }

  // Парсим JSON
  let metadata;
  try {
    metadata = JSON.parse(data);
  } catch (e) {
    console.error("Ошибка парсинга JSON:", e);
    return;
  }

  // Счётчик замен
  let totalChanges = 0;

  // Проходим по каждой гифке
  const updatedMetadata = metadata.map((gif) => {
    if (gif.tags && Array.isArray(gif.tags)) {
      const originalTags = [...gif.tags];
      const updatedTags = gif.tags.map((tag) => {
        // Заменяем пробелы на дефисы, приводим к нижнему регистру
        const newTag = tag.toLowerCase().replace(/ /g, "-");
        if (newTag !== tag) totalChanges++;
        return newTag;
      });
      return { ...gif, tags: updatedTags };
    }
    return gif;
  });

  // Сохраняем обновлённый JSON
  fs.writeFile(
    filePath,
    JSON.stringify(updatedMetadata, null, 2),
    "utf8",
    (err) => {
      if (err) {
        console.error("Ошибка записи файла:", err);
        return;
      }
      console.log(`✅ Готово! Заменено тегов: ${totalChanges}`);
    },
  );
});
