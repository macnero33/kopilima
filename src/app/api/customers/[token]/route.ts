import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkRateLimit } from "@/lib/rate-limit";

const tokenSchema = z.object({ token: z.string().min(16).max(64).regex(/^[A-Za-z0-9]+$/) });

export async function GET(request: Request, context: { params: Promise<{ token: string }> }) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const limited = checkRateLimit(`card:${ip}`, 60, 60_000);
  if (!limited.allowed) return NextResponse.json({ error: "Coba lagi sebentar." }, { status: 429 });

  const { token } = await context.params;
  const parsed = tokenSchema.safeParse({ token });
  if (!parsed.success) return NextResponse.json({ error: "Kartu tidak valid." }, { status: 404 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("customers")
    .select("name,stamps,created_at")
    .eq("token", parsed.data.token)
    .maybeSingle();

  if (error || !data) return NextResponse.json({ error: "Kartu tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ name: data.name, stamps: data.stamps, createdAt: data.created_at });
}
