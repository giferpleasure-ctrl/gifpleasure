export function formatCategory(category: string): string {
  return category
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatTag(tag: string): string {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}
