export function formatCategory(category: string): string {
  return category
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatTag(tag: string): string {
  // Заменяем дефисы на пробелы, затем капитализируем каждое слово
  return tag
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
