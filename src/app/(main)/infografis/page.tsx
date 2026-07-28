import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BarChart3, Download, Share2, Eye, ChevronRight, TrendingUp, Info, Clock, Search } from "lucide-react";
import { formatDateRelative, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Infografis",
  description: "Pahami berita dan data penting melalui koleksi infografis PenaSakti yang informatif, menarik, dan mudah dipahami secara visual.",
};

const INFOGRAPHICS = [
  {
    id: "i1",
    title: "Stimulus Ekonomi Rp 500 Triliun: Cara Kerjanya",
    slug: "infografis-stimulus-500-triliun",
    image: "https://picsum.photos/seed/info1/800/1100",
    category: { name: "Ekonomi", color: "#27ae60" },
    downloads: 3421,
    views: BigInt(56000),
    publishedAt: new Date(Date.now() - 3600000),
    topics: ["APBN 2026", "Pemulihan Ekonomi", "UMKM"],
  },
  {
    id: "i2",
    title: "IKN Nusantara: Masterplan Pembangunan 2025-2035",
    slug: "infografis-masterplan-ikn",
    image: "https://picsum.photos/seed/info2/800/1100",
    category: { name: "Nasional", color: "#e74c3c" },
    downloads: 5678,
    views: BigInt(123000),
    publishedAt: new Date(Date.now() - 7200000),
    topics: ["Ibu Kota Baru", "Infrastruktur", "Pemerintah"],
  },
  {
    id: "i3",
    title: "Pertumbuhan Startup Unicorn Indonesia 2015-2026",
    slug: "infografis-startup-unicorn",
    image: "https://picsum.photos/seed/info3/800/900",
    category: { name: "Teknologi", color: "#16a085" },
    downloads: 2145,
    views: BigInt(78000),
    publishedAt: new Date(Date.now() - 10800000),
    topics: ["Startup", "Investasi", "Digital"],
  },
  {
    id: "i4",
    title: "Laporan Inflasi & Daya Beli Masyarakat 2026",
    slug: "infografis-inflasi-2026",
    image: "https://picsum.photos/seed/info4/800/1000",
    category: { name: "Ekonomi", color: "#27ae60" },
    downloads: 1876,
    views: BigInt(45000),
    publishedAt: new Date(Date.now() - 86400000),
    topics: ["Inflasi", "BPS", "Kebijakan Fiskal"],
  },
  {
    id: "i5",
    title: "Prestasi Olahraga Indonesia di SEA Games 2026",
    slug: "infografis-prestasi-sea-games",
    image: "https://picsum.photos/seed/info5/800/1050",
    category: { name: "Olahraga", color: "#d35400" },
    downloads: 4231,
    views: BigInt(89000),
    publishedAt: new Date(Date.now() - 2 * 86400000),
    topics: ["SEA Games", "Prestasi", "Atlet"],
  },
  {
    id: "i6",
    title: "Kesehatan Nasional: Data Stunting & Imunisasi Balita",
    slug: "infografis-kesehatan-stunting",
    image: "https://picsum.photos/seed/info6/800/1100",
    category: { name: "Nasional", color: "#e74c3c" },
    downloads: 1543,
    views: BigInt(34000),
    publishedAt: new Date(Date.now() - 3 * 86400000),
    topics: ["Kesehatan", "Kemenkes", "Program Nasional"],
  },
];

export default function InfografisPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-3">
          <BarChart3 className="w-3.5 h-3.5" />
          Data Visual & Visualisasi
        </div>
        <h1 className="text-3xl md:text-4xl font-black font-heading mb-2">
          Koleksi <span className="text-blue-600 dark:text-blue-400">Infografis</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Jelajahi data penting dan berita kompleks yang disajikan secara visual,
          mudah dipahami, dan informatif melalui infografis berkualitas PenaSakti.
        </p>
      </div>

      {/* Hero Infographic */}
      <section className="mb-10">
        <Link
          href={`/infografis/${INFOGRAPHICS[0].slug}`}
          className="group grid lg:grid-cols-2 gap-6 p-5 rounded-2xl bg-gradient-to-br from-blue-500/5 via-background to-blue-500/5 border border-border hover:shadow-card-hover transition-all"
        >
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={INFOGRAPHICS[0].image}
              alt={INFOGRAPHICS[0].title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5 text-penasakti-red" />
              Terpopuler
            </div>
          </div>
          <div className="flex flex-col justify-center lg:p-4">
            <span
              className="inline-block self-start px-3 py-1 rounded-full text-xs font-bold text-white mb-4"
              style={{ backgroundColor: INFOGRAPHICS[0].category.color }}
            >
              {INFOGRAPHICS[0].category.name}
            </span>
            <h2 className="text-2xl md:text-3xl font-black leading-tight mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {INFOGRAPHICS[0].title}
            </h2>
            <div className="flex flex-wrap gap-2 mb-5">
              {INFOGRAPHICS[0].topics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-foreground/70"
                >
                  #{topic}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-5 border-t border-border">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-foreground/80">{formatNumber(INFOGRAPHICS[0].views)}</span> dilihat
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-foreground/80">{INFOGRAPHICS[0].downloads.toLocaleString("id-ID")}</span> diunduh
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formatDateRelative(INFOGRAPHICS[0].publishedAt)}
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Section Title */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Search className="w-5 h-5 text-purple-500" />
          Infografis Terbaru
        </h2>
        <button className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">
          Lihat Semua <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Infographic */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {INFOGRAPHICS.slice(1).map((info) => (
          <Link
            key={info.id}
            href={`/infografis/${info.slug}`}
            className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card-hover transition-all flex flex-col"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={info.image}
                alt={info.title}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-foreground shadow-lg">
                  <Download className="w-3.5 h-3.5" />
                  Unduh
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-foreground shadow-lg">
                  <Share2 className="w-3.5 h-3.5" />
                  Bagikan
                </button>
              </div>
              <span
                className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm"
                style={{ backgroundColor: info.category.color }}
              >
                {info.category.name}
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold leading-snug line-clamp-3 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {info.title}
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {info.topics.slice(0, 2).map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-[11px] font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border mt-auto">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {formatNumber(info.views)}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3 text-emerald-500" /> {info.downloads.toLocaleString("id-ID")}
                </span>
                <span>{formatDateRelative(info.publishedAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mt-12 grid md:grid-cols-2 gap-5 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-50 to-indigo-500/10 dark:from-blue-900/30 dark:via-slate-900 dark:to-indigo-900/30 border border-border">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">Request Infografis</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Butuh infografis tentang topik tertentu? Kirim request Anda, tim data
              visual kami akan mempertimbangkannya.
            </p>
          </div>
        </div>
        <div className="flex md:items-end md:justify-end">
          <a
            href="mailto:redaksi@penasakti.com?subject=Request%20Infografis"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kirim Request
          </a>
        </div>
      </div>
    </div>
  );
}
