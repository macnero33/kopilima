export const instant = false;

import { redirect } from "next/navigation";
import { getSupabaseAuth, requireAdmin } from "@/lib/supabase-server";

export default async function AdminPage() {
  const admin = await requireAdmin();

  // Cek apakah setidaknya sudah login (untuk membedakan belum-login vs bukan-admin)
  const supabase = await getSupabaseAuth();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData?.user ?? null;

  if (authError || !user) redirect("/admin/login");

  if (!admin) {
    return (
      <main className="min-h-screen bg-cream px-5 py-10 text-coffee">
        <div className="mx-auto max-w-lg">
          <h1 className="font-display text-4xl font-black">Akses Ditolak</h1>
          <p className="mt-5 text-lg font-bold">
            Email {user.email} tidak terdaftar sebagai admin.
          </p>
          <p className="mt-3 text-coffee/75">
            Tambahkan email Anda ke variabel{" "}
            <code className="bg-coffee/10 px-2 py-1 rounded">ADMIN_EMAILS</code> di{" "}
            <code className="bg-coffee/10 px-2 py-1 rounded">.env.local</code>, lalu restart server.
          </p>
          <a href="/admin/login" className="mt-6 inline-block rounded-xl bg-orange px-5 py-4 font-black">
            Kembali ke login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-5 py-10 text-coffee">
      <div className="mx-auto max-w-lg">
        <h1 className="font-display text-4xl font-black">Pusat kasir</h1>
        <div className="mt-6 grid gap-3">
          <a
            href="/admin/scan"
            className="rounded-2xl bg-orange p-5 text-xl font-black shadow-[4px_5px_0_#2B1B14]"
          >
            📷 Scan QR pelanggan
          </a>
          <a
            href="/admin/pelanggan"
            className="rounded-2xl border-2 border-coffee/15 bg-white/70 p-5 text-xl font-black"
          >
            🔎 Cari & kelola pelanggan
          </a>
        </div>
      </div>
    </main>
  );
}
