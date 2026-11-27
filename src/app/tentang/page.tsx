import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-cream px-5 py-10 text-coffee">
      <div className="mx-auto max-w-4xl">
        <span className="rounded-full bg-yellow px-4 py-2 text-sm font-black">
          tentang kami
        </span>
        <h1 className="mt-4 font-display text-5xl font-black sm:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="mt-3 text-xl font-bold text-orange">{siteConfig.about.tagline}</p>

        <section className="mt-10 space-y-6">
          <h2 className="font-display text-3xl font-black">Cerita kami</h2>
          <ul className="space-y-4 text-lg font-bold leading-relaxed">
            {siteConfig.about.story.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 rounded-full bg-orange px-3 py-1 text-xs font-black">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-coffee/10 bg-white/70 p-6">
            <h3 className="font-display text-2xl font-black mb-3">Lokasi</h3>
            <p className="font-bold">{siteConfig.address}</p>
            {siteConfig.mapsUrl && (
              <a
                href={siteConfig.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-orange font-black underline decoration-green decoration-4 underline-offset-4"
              >
                Buka di Google Maps →
              </a>
            )}
          </div>
          <div className="rounded-2xl border-2 border-coffee/10 bg-white/70 p-6">
            <h3 className="font-display text-2xl font-black mb-3">Jam buka</h3>
            <p className="font-bold">{siteConfig.hours}</p>
          </div>
          <div className="rounded-2xl border-2 border-coffee/10 bg-white/70 p-6">
            <h3 className="font-display text-2xl font-black mb-3">WhatsApp</h3>
            {siteConfig.whatsapp ? (
              <>
                <p className="font-bold">{siteConfig.whatsapp}</p>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block rounded-full bg-orange px-4 py-2 font-black text-cream"
                >
                  Chat sekarang →
                </a>
              </>
            ) : (
              <p className="font-bold">Belum diisi</p>
            )}
          </div>
        </section>

        <div className="mt-12 rounded-2xl border-2 border-coffee bg-orange p-8 text-cream">
          <h2 className="font-display text-3xl font-black">Mau nongkrong bareng kami?</h2>
          <p className="mt-3 font-bold">Bikin kartu loyalty, kumpulkan 5 stempel, dapat kopi gratis.</p>
          <Link
            href="/daftar"
            className="mt-6 inline-block rounded-full bg-cream px-5 py-3 font-black text-coffee"
          >
            Bikin kartu sekarang →
          </Link>
        </div>
      </div>
    </main>
  );
}