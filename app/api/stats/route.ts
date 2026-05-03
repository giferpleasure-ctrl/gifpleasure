import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const gifId = request.nextUrl.searchParams.get("gifId");
  if (!gifId) {
    return NextResponse.json({ error: "gifId required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("gif_stats")
    .select("likes, views")
    .eq("gif_id", gifId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({
    likes: data?.likes || 0,
    views: data?.views || 0,
  });
}
