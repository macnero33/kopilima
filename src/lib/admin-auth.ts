import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function requireAdminBearer(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) return null;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  // Fail closed: jika belum dikonfigurasi, tidak ada yang jadi admin
  if (adminEmails.length === 0) return null;

  if (!adminEmails.includes(data.user.email?.toLowerCase() ?? "")) return null;

  return data.user;
}
