import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-coffee/10 bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Navigasi utama">
        <Link href="/" className="text-lg font-black tracking-tight text-coffee">Kopi Lima<span className="text-orange">.</span></Link>
        <div className="flex items-center gap-2 text-sm font-bold">
          <Link className="rounded-full px-3 py-2 hover:bg-yellow/40" href="/tentang">
            Tentang
          </Link>
          <Link className="rounded-full px-3 py-2 hover:bg-yellow/40" href="/seni-bulan">
            Seni Bulan
          </Link>
          <Link className="rounded-full px-3 py-2 hover:bg-yellow/40" href="/menu">Menu</Link>
          <Link className="rounded-full bg-coffee px-4 py-2 text-cream" href="/daftar">Bikin kartu</Link>
        </div>
      </nav>
    </header>
  );
}
