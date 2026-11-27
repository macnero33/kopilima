import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function SeniBulanPage() {
  const art = siteConfig.artOfTheMonth;

  return (
    <main className="min-h-screen bg-cream px-5 py-10 text-coffee">
      <div className="mx-auto max-w-5xl">
        <span className="rounded-full bg-yellow px-4 py-2 text-sm font-black">
          seni bulanan
        </span>
        <h1 className="mt-4 font-display text-5xl font-black sm:text-6xl">
          {art.title}
        </h1>
        <p className="mt-3 text-xl font-bold text-orange">{art.subtitle}</p>

        <section className="mt-10 grid gap-6 md:grid-cols-[1fr_400px]">
          <div>
            <h2 className="font-display text-3xl font-black mb-3">{art.artist}</h2>
            <p className="text-lg font-bold leading-relaxed">
              {art.description}
            </p>
            <p className="mt-4 text-coffee/75 font-bold">
              {art.year} · Karya lokal di dinding {siteConfig.name}
            </p>
            <Link
              href="/tentang"
              className="mt-6 inline-block rounded-full border-2 border-coffee bg-cream px-5 py-3 font-black"
            >
              Kembali ke tentang kami →
            </Link>
          </div>

          <div className="relative group">
            {art.imageUrl ? (
              <Image
                src={art.imageUrl}
                alt={`Seni bulan ini oleh ${art.artist}`}
                width={400}
                height={400}
                className="rounded-2xl border-2 border-coffee shadow-[5px_6px_0_#2B1B14]"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="aspect-square rounded-2xl border-4 border-dashed border-coffee/20 bg-yellow/30 flex flex-col items-center justify-center">
                <span className="text-6xl">🎨</span>
                <p className="mt-2 font-bold text-coffee/50">
                  Gambar seni belum diisi
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}