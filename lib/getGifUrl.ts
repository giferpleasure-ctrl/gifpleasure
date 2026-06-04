// lib/getGifUrl.ts

interface GifUrls {
  imgbb?: {
    clean?: string;
    wm?: string;
    preview?: string;
  };
  selectel?: {
    clean?: string;
    wm?: string;
    preview?: string;
  };
}

export type FileType = "clean" | "wm" | "preview";

/**
 * Возвращает URL гифки с приоритетом ImgBB -> Selectel
 */
export function getGifUrl(
  gif: { urls?: GifUrls },
  type: FileType,
): string | null {
  // 1. Пытаемся взять ссылку из ImgBB
  const imgbbUrl = gif.urls?.imgbb?.[type];
  if (imgbbUrl) {
    return imgbbUrl;
  }

  // 2. Если ImgBB нет, берём ссылку из Selectel
  const selectelUrl = gif.urls?.selectel?.[type];
  if (selectelUrl) {
    return selectelUrl;
  }

  // 3. Если ничего нет — возвращаем null (или ссылку на заглушку)
  console.warn(`No URL found for GIF ${(gif as any).id}, type ${type}`);
  return null;
}
