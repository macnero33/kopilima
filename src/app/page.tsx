import Link from "next/link";
import { HeroLogo } from "@/components/hero-logo";
import { siteConfig } from "@/config/site";

export default function Home() {
  const whatsappLink = siteConfig.whatsapp
    ? `https://wa.me/${siteConfig.whatsapp}`
    : "#";

  return (
    <main className="min-h-[calc(100vh-68px)] overflow-hidden bg-cream text-coffee">
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-10 md:min-h-[620px] md:grid-cols-[1fr_.9fr] md:px-8">
        <div className="relative z-10">
          <span className="inline-block rotate-[-2deg] rounded-full bg-yellow px-4 py-2 text-sm font-black text-coffee">buat nongkrong, ngampus, & ngejar skripsi</span>
          <h1 className="mt-5 font-display text-5xl leading-[0.92] font-black sm:text-7xl">
            Kopi mantap.<br /><span className="text-orange">Harga</span> tetap waras.
          </h1>
          <p className="mt-5 max-w-lg text-lg font-bold leading-relaxed text-coffee/75">Ambil kopi, lanjut aktivitas. Singkat, nikmat, dan gampang.</p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/daftar" className="rounded-[18px_14px_18px_14px] bg-orange px-6 py-4 text-center text-lg font-black text-coffee shadow-[5px_6px_0_#2B1B14] transition-transform active:translate-y-1 active:shadow-none">
              Bikin kartu loyalty
            </Link>
            <Link href="/menu" className="rounded-[14px_18px_14px_18px] border-2 border-coffee bg-cream px-6 py-4 text-center text-lg font-black shadow-[4px_5px_0_#FFC93C]">
              Lihat menu
            </Link>
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 text-sm font-bold">
            <div className="rounded-2xl border-2 border-coffee/10 bg-white/60 p-4"><span className="block text-xs uppercase opacity-60">Jam buka</span>{siteConfig.hours}</div>
            <div className="rounded-2xl border-2 border-coffee/10 bg-white/60 p-4"><span className="block text-xs uppercase opacity-60">Lokasi</span>{siteConfig.address}</div>
          </div>
          {siteConfig.whatsapp && (
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-full font-black underline decoration-green decoration-4 underline-offset-4">Chat WhatsApp →</a>
          )}
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[480px]">
          <div className="absolute inset-[8%] rotate-3 rounded-[34%_66%_38%_62%] bg-pink" />
          <div className="absolute inset-[18%] -rotate-6 rounded-[30%_70%_56%_44%] bg-blue" />
          <HeroLogo />
          <div className="absolute bottom-2 right-0 rotate-[-5deg] rounded-xl border-2 border-coffee bg-yellow px-4 py-3 font-black shadow-[4px_4px_0_#2B1B14]">5 stempel → 1 gratis!</div>
        </div>
      </section>
    </main>
  );
}
