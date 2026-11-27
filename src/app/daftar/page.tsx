"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DaftarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/customers", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ name: form.get("name"), phone: form.get("phone") || undefined, consent: form.get("consent") === "on" }) });
    let data: { token?: string; error?: string } = {};
    try {
      data = await res.json();
    } catch {
      data = { error: "Server belum bisa menjawab. Coba lagi sebentar." };
    }
    setLoading(false);
    if (!res.ok) { setError(data.error || "Gagal bikin kartu."); return; }
    if (!data.token) { setError("Server tidak mengembalikan kartu. Coba lagi."); return; }
    router.push(`/kartu/${data.token}`);
  }

  return <main className="min-h-[calc(100vh-68px)] bg-cream px-5 py-10 text-coffee"><form onSubmit={submit} className="mx-auto max-w-md rounded-[28px_18px_26px_16px] border-2 border-coffee/10 bg-white/70 p-6 shadow-[6px_7px_0_#FFC93C]">
    <span className="rounded-full bg-pink/50 px-3 py-1 text-sm font-black">gratis & cuma 1 menit</span>
    <h1 className="mt-4 font-display text-4xl font-black">Bikin kartu loyalty</h1>
    <label className="mt-6 block font-black">Nama<p className="mt-2"><input name="name" required minLength={2} maxLength={80} className="w-full rounded-2xl border-2 border-coffee/20 bg-cream px-4 py-4 outline-none focus:border-orange" placeholder="Nama panggilan" /></p></label>
    <label className="mt-4 block font-black">Nomor WhatsApp <span className="font-normal opacity-60">(opsional)</span><p className="mt-2"><input name="phone" inputMode="tel" className="w-full rounded-2xl border-2 border-coffee/20 bg-cream px-4 py-4 outline-none focus:border-orange" placeholder="628..." /></p></label>
    <label className="mt-5 flex items-start gap-3 text-sm font-bold"><input name="consent" type="checkbox" required className="mt-1 size-5 accent-orange" /><span>Setuju data saya dipakai untuk kartu loyalty. Data hanya dipakai untuk layanan ini dan bisa dihapus atas permintaan.</span></label>
    {error && <p role="alert" className="mt-4 rounded-xl bg-pink/30 p-3 font-black">{error}</p>}
    <button disabled={loading} className="mt-6 w-full rounded-[18px_14px_18px_14px] bg-orange px-5 py-4 text-lg font-black shadow-[4px_5px_0_#2B1B14] disabled:opacity-60">{loading ? "Bikinin..." : "Lanjut ke kartu →"}</button>
  </form></main>;
}
