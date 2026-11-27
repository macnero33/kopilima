import { menuItems } from "@/config/menu";

export default function MenuPage() {
  const categories = ["Kopi", "Non-kopi", "Camilan"] as const;

  return (
    <main className="min-h-screen bg-cream px-5 py-10 text-coffee">
      <div className="mx-auto max-w-5xl">
        <span className="rounded-full bg-yellow px-4 py-2 text-sm font-black">pilihan hari ini</span>
        <h1 className="mt-4 font-display text-5xl font-black sm:text-6xl">Menu Kopi Lima</h1>

        <div className="mt-8 space-y-10">
          {categories.map((category, categoryIndex) => {
            const items = menuItems.filter((item) => item.category === category);
            if (!items.length) return null;
            return (
              <section key={category}>
                <h2 className="mb-4 flex items-center gap-3 font-display text-3xl font-black">
                  <span className={`h-4 w-4 rotate-12 rounded-sm ${["bg-orange", "bg-green", "bg-pink"][categoryIndex]}`} />
                  {category}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((item) => (
                    <article key={item.name} className="relative rounded-[22px_16px_20px_14px] border-2 border-coffee/10 bg-white/70 p-5 shadow-[3px_4px_0_rgba(43,27,20,.08)]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-black">{item.name}</h3>
                          <div className="mt-2 flex gap-1">
                            {item.tags?.map((tag) => <span key={tag} className="rounded-full bg-yellow/70 px-2 py-1 text-xs font-black">{tag}</span>)}
                          </div>
                        </div>
                        <strong className="whitespace-nowrap text-lg">{item.price > 0 ? `Rp${item.price.toLocaleString("id-ID")}` : "Belum ada harga"}</strong>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
