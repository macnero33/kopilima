"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function AdminLogin() {
  const router = useRouter();
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);
  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const form = new FormData(e.currentTarget);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email:String(form.get("email")), password:String(form.get("password")) });
    if (error) { setError("Email atau password salah."); setLoading(false); return; }
    router.push("/admin");
  }
  return <main className="min-h-screen bg-cream px-5 py-12 text-coffee"><form onSubmit={submit} className="mx-auto max-w-sm rounded-[24px_16px_24px_14px] border-2 border-coffee/10 bg-white/70 p-6"><h1 className="font-display text-4xl font-black">Masuk kasir</h1><label className="mt-6 block font-black">Email<input name="email" type="email" required className="mt-2 w-full rounded-xl border-2 border-coffee/20 bg-cream px-4 py-3" /></label><label className="mt-4 block font-black">Password<input name="password" type="password" required className="mt-2 w-full rounded-xl border-2 border-coffee/20 bg-cream px-4 py-3" /></label>{error&&<p className="mt-4 rounded-xl bg-pink/30 p-3 font-black">{error}</p>}<button disabled={loading} className="mt-6 w-full rounded-xl bg-orange px-5 py-4 font-black">{loading?"Masuk...":"Masuk"}</button></form></main>;
}
