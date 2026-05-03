import { supabaseAdmin } from "./supabase";

export async function getGifStats(gifId: string) {
  const { data, error } = await supabaseAdmin
    .from("gif_stats")
    .select("likes, views")
    .eq("gif_id", gifId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching stats:", error);
  }

  return {
    likes: data?.likes || 0,
    views: data?.views || 0,
  };
}
