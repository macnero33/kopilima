"use client";

import { useState } from "react";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function ScanClient() {
  const router = useRouter();
  const [message,setMessage] = useState("Arahkan kamera ke QR pelanggan");
  const [busy,setBusy] = useState(false);
  const [paused,setPaused] = useState(false);
  async function action(action:"stamp"|"redeem"|"undo", token:string) {
    if (busy) return;
    setBusy(true); setPaused(true);
    const supabase = getSupabaseBrowser();
    const { data:{session} } = await supabase.auth.getSession();
    if (!session) { setMessage("Sesi kasir habis. Login ulang."); setBusy(false); setPaused(false); return; }
    const res = await fetch("/api/admin/actions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${session.access_token}`},body:JSON.stringify({action,token})});
    const data = await res.json();
    setMessage(res.ok ? (action=== "stamp" ? (data.status=== "ready_to_redeem" ? `${data.name}: stempel ke-5 — kopi gratis siap ditebus!` : `${data.name}: +1 stempel`) : action=== "redeem" ? `${data.name}: kopi gratis sudah ditebus` : "Aksi terakhir dibatalkan") : data.error);
    setBusy(false);
  }
  async function onScan(codes: IDetectedBarcode[]) {
    const raw=String(codes[0]?.rawValue??"");
    const token=raw.includes("/kartu/") ? raw.split("/kartu/")[1] : raw;
    if (/^[A-Za-z0-9]{16,64}$/.test(token)) await action("stamp",token);
  }
  return <main className="min-h-screen bg-cream px-5 py-8 text-coffee"><div className="mx-auto max-w-md"><h1 className="font-display text-4xl font-black">Scan kartu</h1><div className="mt-5 overflow-hidden rounded-[24px_16px_24px_14px] border-2 border-coffee/15 bg-coffee"><Scanner onScan={onScan} paused={paused} allowMultiple={false} scanDelay={1500} constraints={{facingMode:"environment"}} onError={e=>setMessage(e.message)} /></div><p role="status" className="mt-4 rounded-2xl bg-yellow/60 p-4 font-black">{message}</p><div className="mt-3 grid grid-cols-2 gap-3"><button onClick={()=>setPaused(false)} className="rounded-xl border-2 border-coffee px-4 py-3 font-black">Scan lagi</button><button onClick={()=>router.back()} className="rounded-xl bg-coffee px-4 py-3 font-black text-cream">Kembali</button></div></div></main>;
}