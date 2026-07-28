import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Play, Clock, Download, Share2, Volume2, Headphones,
  ChevronRight, Mic, TrendingUp, Radio
} from "lucide-react";
import { formatDateRelative, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Podcast",
  description: "Dengarkan podcast PenaSakti yang membahas berita, analisis mendalam, wawancara eksklusif, dan topik menarik lainnya langsung dari para ahli dan narasumber terpercaya.",
};

const PODCASTS = [
  {
    id: "pd1",
    title: "Stimulus Rp 500 Triliun: Cukup atau Kurang untuk Pemulihan?",
    slug: "podcast-stimulus-500-triliun",
    thumbnail: "https://picsum.photos/seed/pod1/600/600",
    duration: 2780,
    viewCount: BigInt(89000),
    episode: 142,
    season: 5,
    category: { name: "Analisis Ekonomi", color: "#27ae60" },
    host: "Dr. Andi Wijaya",
    guests: ["Prof. Dr. Sri Mulyani", "Dr. Chatib Basri"],
    publishedAt: new Date(Date.now() - 3600000),
    isFeatured: true,
    description:
      "Podcast spesial yang membahas dampak paket stimulus ekonomi pemerintah terhadap pertumbuhan ekonomi nasional. Bersama dua pakar ekonomi ternama Indonesia.",
  },
  {
    id: "pd2",
    title: "Politik 2026: Jelang Pemilu Serentak Regional",
    slug: "podcast-politik-2026",
    thumbnail: "https://picsum.photos/seed/pod2/600/600",
    duration: 1980,
    viewCount: BigInt(67000),
    episode: 141,
    season: 5,
    category: { name: "Politik", color: "#8e44ad" },
    host: "Rina Kusumawardhani",
    guests: ["Dr. Airlangga Pribadi"],
    publishedAt: new Date(Date.now() - 86400000),
    description:
      "Mengupas dinamika politik lokal menjelang pemilihan kepala daerah serentak tahun depan.",
  },
  {
    id: "pd3",
    title: "AI & Masa Depan Jurnalisme: Kolaborasi Manusia & Mesin",
    slug: "podcast-ai-jurnalisme",
    thumbnail: "https://picsum.photos/seed/pod3/600/600",
    duration: 2450,
    viewCount: BigInt(112000),
    episode: 140,
    season: 5,
    category: { name: "Teknologi", color: "#16a085" },
    host: "Kevin Sanjaya",
    guests: ["Drs. Bambang Heru Tjahjono, M.Si."],
    publishedAt: new Date(Date.now() - 2 * 86400000),
    description:
      "Diskusi mendalam tentang bagaimana AI mengubah landscape industri media dan apa yang harus disiapkan jurnalis.",
  },
  {
    id: "pd4",
    title: "Mental Health di Tengah Arus Modernisasi",
    slug: "podcast-kesehatan-mental",
    thumbnail: "https://picsum.photos/seed/pod4/600/600",
    duration: 2100,
    viewCount: BigInt(45000),
    episode: 139,
    season: 5,
    category: { name: "Lifestyle", color: "#e91e63" },
    host: "Dewi Lestari",
    guests: ["dr. Andri Sp.KJ"],
    publishedAt: new Date(Date.now() - 3 * 86400000),
    description:
      "Membahas pentingnya menjaga kesehatan mental di era digital bersama psikiater.",
  },
  {
    id: "pd5",
    title: "Sepakbola Indonesia: Menuju Piala Dunia 2034?",
    slug: "podcast-sepakbola-piala-dunia",
    thumbnail: "https://picsum.photos/seed/pod5/600/600",
    duration: 3200,
    viewCount: BigInt(156000),
    episode: 138,
    season: 5,
    category: { name: "Olahraga", color: "#d35400" },
    host: "Yudi Pratama",
    guests: ["Robby Darwis", "Kurniawan Dwi Yulianto"],
    publishedAt: new Date(Date.now() - 4 * 86400000),
    description:
      "Bincang santai dengan legenda sepak bola Indonesia tentang peluang Garuda ke Piala Dunia 2034.",
  },
  {
    id: "pd6",
    title: "Startup & Investasi: Peluang di 2026",
    slug: "podcast-startup-investasi",
    thumbnail: "https://picsum.photos/seed/pod6/600/600",
    duration: 2630,
    viewCount: BigInt(78000),
    episode: 137,
    season: 5,
    category: { name: "Ekonomi", color: "#27ae60" },
    host: "Rizki Hakim",
    guests: ["Amiran Ruslan, Managing Partner East Ventures"],
    publishedAt: new Date(Date.now() - 5 * 86400000),
    description:
      "Apa saja sektor startup yang potensial dan strategi investasi bagi investor muda?",
  },
];

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h} jam ${m} menit`;
  if (m > 0) return `${m}:${String(s).padStart(2, "0")}`;
  return `${s} detik`;
}

export default function PodcastPage() {
  const featured = PODCASTS[0];
  const list = PODCASTS.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/10 text-pink-600 dark:text-pink-400 mb-3">
          <Mic className="w-3.5 h-3.5" />
          Audio On-Demand
        </div>
        <h1 className="text-3xl md:text-4xl font-black font-heading mb-2">
          <span className="text-pink-600 dark:text-pink-400">Podcast</span> PenaSakti
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Dengarkan analisis mendalam, wawancara eksklusif, dan diskusi menarik dari
          para ahli, hanya di podcast PenaSakti.
        </p>
      </div>

      {/* Featured Podcast */}
      <section className="mb-10">
        <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-700 text-white">
          <div className="absolute inset-0 opacity-20">
            <Image
              src={featured.thumbnail}
              alt=""
              fill
              className="object-cover"
              aria-hidden
            />
          </div>
          <div className="relative grid md:grid-cols-5 gap-6 p-6 md:p-10">
            <div className="md:col-span-2 flex justify-center md:justify-start">
              <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20">
                <Image
                  src={featured.thumbnail}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <button className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center ring-2 ring-white/40">
                    <div className="w-14 h-14 rounded-full bg-white text-pink-600 flex items-center justify-center shadow-xl">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold">
                  Episode {featured.episode} · Season {featured.season}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Episode Unggulan
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-bold">
                  {featured.category.name}
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black leading-tight mb-3">
                {featured.title}
              </h2>
              <p className="text-white/85 leading-relaxed mb-5 max-w-2xl">
                {featured.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                <span className="text-xs text-white/70">Bersama:</span>
                {featured.guests.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-0.5 rounded-full bg-white/15 text-xs font-medium"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80 pt-4 border-t border-white/20">
                <span className="flex items-center gap-1.5">
                  <Headphones className="w-4 h-4" />
                  {formatNumber(featured.viewCount)} pendengar
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatDuration(featured.duration)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Radio className="w-4 h-4" />
                  Host: {featured.host}
                </span>
                <span>{formatDateRelative(featured.publishedAt)}</span>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-pink-600 font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg">
                  <Play className="w-4 h-4 fill-current" />
                  Putar Sekarang
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur text-white font-semibold rounded-xl border border-white/20 hover:bg-white/25 transition-colors">
                  <Download className="w-4 h-4" />
                  Unduh
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur text-white font-semibold rounded-xl border border-white/20 hover:bg-white/25 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Bagikan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* List Section */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-purple-500" />
          Episode Terbaru
        </h2>
        <button className="flex items-center gap-1 text-sm text-pink-600 dark:text-pink-400 font-semibold hover:underline">
          Semua Episode <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {list.map((pod) => (
          <Link
            key={pod.id}
            href={`/podcast/${pod.slug}`}
            className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-card border border-border hover:shadow-card-hover hover:border-pink-500/30 transition-all"
          >
            <div className="relative w-full sm:w-36 aspect-square flex-shrink-0 rounded-xl overflow-hidden bg-muted">
              <Image
                src={pod.thumbnail}
                alt={pod.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 144px"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white/90 text-pink-600 flex items-center justify-center shadow-xl">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: pod.category.color }}
                >
                  {pod.category.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  Eps {pod.episode} · S{pod.season}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  Host: {pod.host}
                </span>
              </div>

              <h3 className="font-bold group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-2 leading-snug mb-2">
                {pod.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {pod.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-auto pt-2 border-t border-border/50">
                <span className="flex items-center gap-1">
                  <Headphones className="w-3 h-3" />
                  {formatNumber(pod.viewCount)} didengar
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(pod.duration)}
                </span>
                <span>{formatDateRelative(pod.publishedAt)}</span>
                <div className="flex gap-1.5 ml-auto">
                  {pod.guests.slice(0, 2).map((g) => (
                    <span
                      key={g}
                      className="px-2 py-0.5 bg-muted rounded-full text-[10px] font-medium truncate max-w-[160px]"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Subscribe Platforms */}
      <div className="mt-12 p-6 md:p-8 rounded-2xl bg-slate-900 text-white">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-2">Jangan Lewatkan Episode Terbaru</h3>
            <p className="text-white/70 mb-5">
              Subscribe podcast PenaSakti di platform favorit Anda: Spotify, Apple Podcasts, Google Podcasts, Noice, dan YouTube.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {[
                "Spotify", "Apple Podcasts", "Google Podcasts", "Noice", "YouTube Music"
              ].map((platform) => (
                <button
                  key={platform}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors"
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center justify-end">
            <div className="flex -space-x-4">
              {["pod1", "pod2", "pod3", "pod4"].map((seed, i) => (
                <div
                  key={seed}
                  className={`w-20 h-20 rounded-xl overflow-hidden ring-2 ring-slate-900 shadow-xl ${i % 2 === 0 ? "translate-y-3" : "-translate-y-3"}`}
                >
                  <img
                    src={`https://picsum.photos/seed/${seed}/200/200`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
