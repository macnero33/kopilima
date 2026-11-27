import { NextResponse } from "next/server";
import { z } from "zod";
import { customAlphabet } from "nanoid";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkRateLimit } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().optional().or(z.literal("")),
  consent: z.literal(true),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  // Di development, lewati rate limit agar ngetes tidak terblokir.
  const isDev = process.env.NODE_ENV === "development";
  const limited = isDev ? { allowed: true } : checkRateLimit(`register:${ip}`, 5, 600_000);
  if (!limited.allowed) return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi nanti." }, { status: 429 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Nama dan persetujuan wajib diisi." }, { status: 400 });

  const token = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 24)();
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi. Hubungi pengelola website." }, { status: 503 });
  }
  const { data, error } = await supabase.from("customers").insert({
    token,
    name: parsed.data.name,
    phone: parsed.data.phone || null,
    stamps: 0,
    consent_at: new Date().toISOString(),
  }).select("token").single();

  if (error) {
    console.error("Register insert error:", error);
    return NextResponse.json({ error: "Gagal bikin kartu. Coba lagi." }, { status: 500 });
  }
  return NextResponse.json({ token: data.token }, { status: 201 });
}
