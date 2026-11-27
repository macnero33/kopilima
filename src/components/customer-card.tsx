"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { StampCard } from "@/components/stamp-card";

export function CustomerCard({ token }: { token: string }) {
  const [data, setData] = useState<{name:string;stamps:number}|null>(null);
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { QRCode.toDataURL(token, { width: 260, margin: 2, color: { dark: "#2B1B14", light: "#FFF4E0" } }).then(setQr).catch(() => setError("QR gagal dibuat.")); fetch(`/api/customers/${encodeURIComponent(token)}`).then(async r => { const d = await r.json(); if (!r.ok) throw new Error(d.error); setData(d); }).catch(() => setError("Gagal memuat data kartu. Coba lagi.")); }, [token]);
  if (error) return <p className="rounded-2xl bg-pink/30 p-5 font-black">{error}</p>;
  if (!data) return <p className="rounded-2xl bg-yellow/40 p-5 font-black">Memuat kartu...</p>;
  return <div className="space-y-5"><StampCard name={data.name} stamps={data.stamps}/><div className="rounded-[24px_18px_24px_16px] bg-coffee p-5 text-center text-cream"><p className="mb-3 font-black">Tunjukkan QR ini ke kasir</p>{qr && <Image src={qr} alt="QR kartu loyalty" width={208} height={208} unoptimized className="mx-auto rounded-xl bg-cream p-2" />}</div></div>;
}
