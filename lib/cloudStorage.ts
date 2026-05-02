// lib/cloudStorage.ts

// Базовый URL твоего статического веб-сайта в Selectel
export const CLOUD_STORAGE_URL =
  "https://e099d422-ee00-4423-8964-895951b48226.selstorage.ru";

// Вспомогательная функция для получения полного URL гифки
export function getGifUrl(path: string): string {
  return `${CLOUD_STORAGE_URL}/${path}`;
}
