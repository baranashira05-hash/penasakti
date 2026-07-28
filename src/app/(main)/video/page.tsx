import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Play, Clock, Eye, ChevronRight, Flame, TrendingUp, Newspaper } from "lucide-react";
import { formatDateRelative, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Video Berita",
  description: "Tonton koleksi video berita terkini dan terlengkap di PenaSakti. Mulai dari berita harian, liputan mendalam, wawancara eksklusif, dan konten video menarik lainnya.",
};

const DEMO_VIDEOS = [
  {
    id: "v1",
    title: "Breaking: Pemerintah Umumkan Stimulus Ekonomi Rp 500 Triliun",
    slug: "stimulus-ekonomi-500-triliun",
    thumbnail: "https://picsum.photos/seed/vid1/800/450",
    duration: 542,
    viewCount: BigInt(345000),
    category: { id: "c1", name: "Nasional", color: "#e74c3c" },
    publishedAt: new Date(Date.now() - 3600000),
    isFeatured: true,
  },
  {
    id: "v2",
    title: "Wawancara Eksklusif dengan Menteri Keuangan tentang APBN 2026",
    slug: "wawancara-eksklusif-menkeu",
    thumbnail: "https://picsum.photos/seed/vid2/800/450",
    duration: 1250,
    viewCount: BigInt(218000),
    category: { id: "c2", name: "Ekonomi", color: "#27ae60" },
    publishedAt: new Date(Date.now() - 7200000),
    isBreaking: true,
  },
  {
    id: "v3",
    title: "Timnas Indonesia Lolos ke Final Piala AFF 2026",
    slug: "timnas-lolos-final-aff-2026",
    thumbnail: "https://picsum.photos/seed/vid3/800/450",
    duration: 430,
    viewCount: BigInt(678000),
    category: { id: "c3", name: "Olahraga", color: "#d35400" },
    publishedAt: new Date(Date.now() - 10800000),
    isTrending: true,
  },
  {
    id: "v4",
    title: "Teknologi AI di Dunia Jurnalisme Masa Depan",
    slug: "teknologi-ai-jurnalisme",
    thumbnail: "https://picsum.photos/seed/vid4/800/450",
    duration: 680,
    viewCount: BigInt(156000),
    category: { id: "c4", name: "Teknologi", color: "#16a085" },
    publishedAt: new Date(Date.now() - 14400000),
  },
  {
    id: "v5",
    title: "Liputan Khusus: IKN Nusantara dan Masa Depan Indonesia",
    slug: "liputan-ikn-nusantara",
    thumbnail: "https://picsum.photos/seed/vid5/800/450",
    duration: 1520,
    viewCount: BigInt(289000),
    category: { id: "c1", name: "Nasional", color: "#e74c3c" },
    publishedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "v6",
    title: "Review Mobil Listrik Buatan Indonesia 2026",
    slug: "review-mobil-listrik-indonesia",
    thumbnail: "https://picsum.photos/seed/vid6/800/450",
    duration: 740,
    viewCount: BigInt(189000),
    category: { id: "c5", name: "Otomotif", color: "#7f8c8d" },
    publishedAt: new Date(Date.now() - 2 * 86400000),
  },
];

const CATEGORIES = [
  { name: "Semua", active: true },
  { name: "Nasional" },
  { name: "Ekonomi" },
  { name: "Olahraga" },
  { name: "Teknologi" },
  { name: "Hiburan" },
  { name: "Otomotif" },
  { name: "Internasional" },
  { name: "Wawancara" },
  { name: "Liputan Khusus" },
];

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default async function VideoPage() {
  const featured = DEMO_VIDEOS[0];
  const videos = DEMO_VIDEOS.slice(1);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-penasakti-red/10 text-penasakti-red mb-3">
            <Play className="w-3.5 h-3.5 fill-current" />
            Video Channel
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-heading">
            Video <span className="text-penasakti-red">Berita</span> Terkini
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Tonton koleksi video berita terlengkap dan terpercaya, mulai dari berita harian,
            wawancara eksklusif, hingga liputan mendalam.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat, i) => (
          <button
            key={i}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              cat.active
                ? "bg-penasakti-blue text-white"
                : "bg-muted hover:bg-muted/70 text-foreground/80"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Featured Video */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-penasakti-red" />
          <h2 className="text-xl font-bold">Video Unggulan</h2>
        </div>
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 group relative rounded-2xl overflow-hidden bg-card border border-border">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={featured.thumbnail}
                alt={featured.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-16 h-16 rounded-full bg-penasakti-red text-white flex items-center justify-center shadow-lg">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded text-xs text-white font-medium">
                {formatDuration(featured.duration)}
              </div>

              {/* Category */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: featured.category.color }}
                >
                  {featured.category.name}
                </span>
                {featured.isFeatured && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white bg-penasakti-gold">
                    UNGGULAN
                  </span>
                )}
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold group-hover:text-penasakti-blue transition-colors line-clamp-2 mb-3 leading-snug">
                {featured.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {formatNumber(featured.viewCount)} ditonton
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDateRelative(featured.publishedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Top Trending Videos */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-bold">Video Trending</h2>
            </div>
            {videos.slice(0, 4).map((video, i) => (
              <Link
                key={video.id}
                href={`/video/${video.slug}`}
                className="group flex gap-3 p-2 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="128px"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[10px] text-white font-medium">
                    {formatDuration(video.duration)}
                  </span>
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: video.category.color }}>
                    {video.category.name}
                  </span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className="text-xs text-purple-500 font-semibold mb-0.5">
                    #{i + 1} Trending
                  </span>
                  <h4 className="text-sm font-semibold line-clamp-3 group-hover:text-penasakti-blue transition-colors leading-snug">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-1">
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3" /> {formatNumber(video.viewCount)}
                    </span>
                    <span>·</span>
                    <span>{formatDateRelative(video.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Video */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-penasakti-blue" />
            <h2 className="text-xl font-bold">Video Terbaru</h2>
          </div>
          <button className="flex items-center gap-1 text-sm text-penasakti-blue font-semibold hover:underline">
            Lihat Semua <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...videos, ...DEMO_VIDEOS.slice(0, 2)].map((video) => (
            <Link
              key={`grid-${video.id}-${Math.random()}`}
              href={`/video/${video.slug}`}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-card-hover transition-all"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-penasakti-red text-white flex items-center justify-center shadow-xl">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 rounded text-xs text-white font-medium">
                  {formatDuration(video.duration)}
                </span>
              </div>
              <div className="p-3.5">
                <span
                  className="inline-block text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: video.category.color }}
                >
                  {video.category.name}
                </span>
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-penasakti-blue transition-colors leading-snug mb-2">
                  {video.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(video.viewCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDateRelative(video.publishedAt)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
