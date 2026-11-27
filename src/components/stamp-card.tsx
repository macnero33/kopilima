"use client";

import { stampColors } from "@/lib/loyalty";

export function StampCard({ stamps, name }: { stamps: number; name: string }) {
  return <div className="rounded-[30px_20px_28px_18px] border-2 border-coffee/10 bg-white/80 p-5 shadow-[7px_8px_0_#FF7BB5]">
    <p className="text-sm font-black opacity-60">LOYALTY CARD</p>
    <h1 className="mt-1 font-display text-3xl font-black">Hai, {name}!</h1>
    <div className="mt-5 grid grid-cols-5 gap-2" aria-label={`${stamps} dari 5 stempel`}>
      {Array.from({ length: 5 }, (_, i) => <div key={i} className={`aspect-square rounded-[42%_58%_50%_50%] rotate-[-3deg] border-[3px] ${i < stamps ? "stamp-pop border-coffee shadow-[2px_2px_0_#2B1B14]" : "border-dashed border-coffee/35 bg-cream"}`} style={i < stamps ? { background: stampColors[i] } : undefined}><span className="sr-only">Stempel {i + 1}</span></div>)}
    </div>
    <p className="mt-5 text-center text-lg font-black">{stamps >= 5 ? "Kopi gratis siap ditebus! 🎉" : `${stamps}/5 stempel — ${5 - stamps} lagi gratis!`}</p>
  </div>;
}
