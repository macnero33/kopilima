import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getSupabaseAuth() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => undefined,
      },
    }
  );
}

export async function requireAuth() {
  const supabase = await getSupabaseAuth();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (!user) return null;

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  // Fail closed: jika belum dikonfigurasi, tidak ada yang jadi admin
  if (adminEmails.length === 0) return null;

  if (!adminEmails.includes(user.email?.toLowerCase() ?? "")) return null;

  return user;
}
