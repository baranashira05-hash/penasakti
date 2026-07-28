import Link from "next/link";
import Image from "next/image";

const CATEGORY_NEWS = {
  ekonomi: {
    name: "Ekonomi",
    color: "#27ae60",
    slug: "ekonomi",
    articles: [
      { id: "e1", title: "Inflasi Mei 2026 Tercatat 2,8 Persen, Terendah dalam 3 Tahun", slug: "inflasi-mei-2026", image: "https://picsum.photos/seed/ek1/400/250", timeLabel: "2 jam lalu" },
      { id: "e2", title: "Neraca Perdagangan Surplus USD 4,2 Miliar pada April 2026", slug: "neraca-perdagangan-surplus", image: "https://picsum.photos/seed/ek2/400/250", timeLabel: "4 jam lalu" },
      { id: "e3", title: "OJK Terbitkan Aturan Baru Pinjol, Bunga Maksimal 0,3% per Hari", slug: "ojk-aturan-baru-pinjol", image: "https://picsum.photos/seed/ek3/400/250", timeLabel: "6 jam lalu" },
    ],
  },
  teknologi: {
    name: "Teknologi",
    color: "#16a085",
    slug: "teknologi",
    articles: [
      { id: "t1", title: "Google Luncurkan Gemini 2.5 Ultra, Klaim Kalahkan GPT-5 dalam Benchmark", slug: "google-gemini-25-ultra", image: "https://picsum.photos/seed/tek1/400/250", timeLabel: "3 jam lalu" },
      { id: "t2", title: "Starlink Indonesia Perluas Jangkauan ke 1.000 Desa Terpencil", slug: "starlink-indonesia-1000-desa", image: "https://picsum.photos/seed/tek2/400/250", timeLabel: "5 jam lalu" },
      { id: "t3", title: "Chip AI Buatan Indonesia Siap Diproduksi Massal 2027", slug: "chip-ai-indonesia-produksi-massal", image: "https://picsum.photos/seed/tek3/400/250", timeLabel: "7 jam lalu" },
    ],
  },
  olahraga: {
    name: "Olahraga",
    color: "#d35400",
    slug: "olahraga",
    articles: [
      { id: "o1", title: "Klasemen Liga 1 Terbaru: Persija Memimpin dengan 5 Poin Unggul", slug: "klasemen-liga1-terbaru", image: "https://picsum.photos/seed/ol1/400/250", timeLabel: "1 jam lalu" },
      { id: "o2", title: "Kevin/Marcus Raih Gelar Juara All England 2026 Berturut-turut", slug: "kevin-marcus-juara-all-england", image: "https://picsum.photos/seed/ol2/400/250", timeLabel: "4 jam lalu" },
      { id: "o3", title: "Lionel Messi Umumkan Pensiun di Usia 39, Bakal Jadi Pelatih", slug: "messi-umumkan-pensiun", image: "https://picsum.photos/seed/ol3/400/250", timeLabel: "8 jam lalu" },
    ],
  },
};

export default function CategorySection() {
  return (
    <div className="bg-muted/30 py-10">
      <div className="container mx-auto px-4 space-y-10">
        {Object.values(CATEGORY_NEWS).map((cat) => (
          <section key={cat.slug}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <h2 className="text-xl font-bold">{cat.name}</h2>
              </div>
              <Link
                href={`/kategori/${cat.slug}`}
                className="text-sm font-semibold hover:underline"
                style={{ color: cat.color }}
              >
                Selengkapnya →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main Article */}
              <Link
                href={`/artikel/${cat.articles[0].slug}`}
                className="group md:col-span-1"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                  <Image
                    src={cat.articles[0].image}
                    alt={cat.articles[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <h3 className="font-bold text-base leading-snug line-clamp-3 group-hover:text-penasakti-blue transition-colors">
                  {cat.articles[0].title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1" suppressHydrationWarning>
                  {cat.articles[0].timeLabel}
                </p>
              </Link>

              {/* Sub Articles */}
              <div className="md:col-span-2 space-y-4">
                {cat.articles.slice(1).map((article) => (
                  <Link
                    key={article.id}
                    href={`/artikel/${article.slug}`}
                    className="group flex gap-4 p-3 rounded-xl hover:bg-background transition-colors"
                  >
                    <div className="relative w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-3 group-hover:text-penasakti-blue transition-colors leading-snug">
                        {article.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1.5" suppressHydrationWarning>
                        {article.timeLabel}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
