export type Locale = "en" | "pt" | "es";

export interface Gif {
  id: string;
  slug: Record<Locale, string>;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  tags: string[];
  actress: string; // обязательно, не опционально
  category: string; // обязательно, не опционально
  width: number;
  height: number;
  likes: number;
  views: number;
  createdAt: string;
}
