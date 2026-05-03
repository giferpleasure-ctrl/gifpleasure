import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Используем service_role (только на сервере)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const { gifId } = await request.json();
    if (!gifId) {
      return NextResponse.json({ error: "gifId required" }, { status: 400 });
    }

    // Получаем текущие лайки
    let { data: stats, error: selectError } = await supabaseAdmin
      .from("gif_stats")
      .select("likes")
      .eq("gif_id", gifId)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    let newLikes = 1;
    if (stats) {
      newLikes = stats.likes + 1;
      await supabaseAdmin
        .from("gif_stats")
        .update({ likes: newLikes, updated_at: new Date() })
        .eq("gif_id", gifId);
    } else {
      await supabaseAdmin
        .from("gif_stats")
        .insert({ gif_id: gifId, likes: 1, views: 0 });
    }

    return NextResponse.json({ likes: newLikes });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
