import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Camera, Eye, ChevronRight, Flame, Grid3x3, LayoutGrid, Sparkles, Clock, Heart } from "lucide-react";
import { formatDateRelative, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Foto Jurnalistik",
  description: "Koleksi foto jurnalistik PenaSakti yang mengabadikan momen-momen penting, peristiwa terkini, dan kisah manusia melalui lensa fotografer profesional kami.",
};

type Photo = {
  id: string;
  title: string;
  slug: string;
  image: string;
  width: number;
  height: number;
  caption?: string;
  category: { name: string; color: string };
  photographer: string;
  viewCount: bigint;
  likeCount: number;
  publishedAt: Date;
};

const PHOTOS: Photo[] = [
  { id: "p1", title: "Pawai Budaya Kemerdekaan RI ke-81", slug: "pawai-kemerdekaan-ri", image: "https://picsum.photos/seed/fot1/800/1100", width: 800, height: 1100, caption: "Peserta pawai budaya mengenakan pakaian adat khas daerah di sepanjang Jalan Medan Merdeka.", category: { name: "Nasional", color: "#e74c3c" }, photographer: "Eko Prabowo", viewCount: BigInt(56000), likeCount: 2876, publishedAt: new Date(Date.now() - 3600000) },
  { id: "p2", title: "Suasana Pasar Tradisional di Pagi Hari", slug: "suasana-pagar-tradisional", image: "https://picsum.photos/seed/fot2/800/520", width: 800, height: 520, caption: "Pedagang sayur menata dagangannya di Pasar Senen pagi ini.", category: { name: "Daerah", color: "#1abc9c" }, photographer: "Sari Dewi", viewCount: BigInt(32000), likeCount: 1542, publishedAt: new Date(Date.now() - 7200000) },
  { id: "p3", title: "Dramatis Final Lari 100m Putra SEA Games", slug: "final-lari-100m-sea-games", image: "https://picsum.photos/seed/fot3/800/500", width: 800, height: 500, caption: "Atlet Indonesia (nomor 478) meraih emas di nomor lari 100 meter putra SEA Games 2026.", category: { name: "Olahraga", color: "#d35400" }, photographer: "Budi Pratama", viewCount: BigInt(128000), likeCount: 7821, publishedAt: new Date(Date.now() - 10800000) },
  { id: "p4", title: "Lanskap IKN Nusantara di Pagi Buta", slug: "lanskap-ikn-pagi-buta", image: "https://picsum.photos/seed/fot4/800/900", width: 800, height: 900, caption: "Pemandangan area ibu kota negara baru saat matahari mulai terbit.", category: { name: "Nasional", color: "#e74c3c" }, photographer: "Eko Prabowo", viewCount: BigInt(89000), likeCount: 5123, publishedAt: new Date(Date.now() - 14400000) },
  { id: "p5", title: "Anak-anak di Desa Wisata", slug: "anak-anak-desa-wisata", image: "https://picsum.photos/seed/fot5/800/600", width: 800, height: 600, caption: "Sekelompok anak desa dengan senyum ceria menyambut turis yang datang.", category: { name: "Lifestyle", color: "#e91e63" }, photographer: "Sari Dewi", viewCount: BigInt(45000), likeCount: 2345, publishedAt: new Date(Date.now() - 86400000) },
  { id: "p6", title: "Konser Musik untuk Kemanusiaan", slug: "konser-musik-kemanusiaan", image: "https://picsum.photos/seed/fot6/800/450", width: 800, height: 450, caption: "Penampilan spesial band papan atas dalam konser bertajuk 'Indonesia Bersatu'.", category: { name: "Hiburan", color: "#9b59b6" }, photographer: "Arif Rahman", viewCount: BigInt(78000), likeCount: 4567, publishedAt: new Date(Date.now() - 2 * 86400000) },
  { id: "p7", title: "Infrastruktur Digital di Pedesaan", slug: "infrastruktur-digital-pedesaan", image: "https://picsum.photos/seed/fot7/800/750", width: 800, height: 750, caption: "Teknisi sedang memasang perangkat jaringan fiber optic di desa terpencil.", category: { name: "Teknologi", color: "#16a085" }, photographer: "Budi Pratama", viewCount: BigInt(29000), likeCount: 1234, publishedAt: new Date(Date.now() - 3 * 86400000) },
  { id: "p8", title: "Upacara HUT ke-50 BUMN", slug: "upacara-hut-bumn", image: "https://picsum.photos/seed/fot8/800/530", width: 800, height: 530, caption: "Peserta upacara mengheningkan cipta mengenang jasa pendiri.", category: { name: "Ekonomi", color: "#27ae60" }, photographer: "Eko Prabowo", viewCount: BigInt(19000), likeCount: 876, publishedAt: new Date(Date.now() - 4 * 86400000) },
  { id: "p9", title: "Makanan Khas Indonesia di Food Festival", slug: "makanan-khas-food-festival", image: "https://picsum.photos/seed/fot9/800/800", width: 800, height: 800, caption: "Aneka makanan tradisional Indonesia dari 34 provinsi siap disajikan.", category: { name: "Lifestyle", color: "#e91e63" }, photographer: "Sari Dewi", viewCount: BigInt(65000), likeCount: 3987, publishedAt: new Date(Date.now() - 5 * 86400000) },
  { id: "p10", title: "Jalanan Jakarta di Malam Hari", slug: "jalanan-jakarta-malam", image: "https://picsum.photos/seed/fot10/800/500", width: 800, height: 500, caption: "Traffic light trails di bundaran HI pada jam sibuk malam hari.", category: { name: "Daerah", color: "#1abc9c" }, photographer: "Arif Rahman", viewCount: BigInt(51000), likeCount: 2876, publishedAt: new Date(Date.now() - 6 * 86400000) },
];

export default function PhotoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-3">
          <Camera className="w-3.5 h-3.5" />
          Photo Gallery
        </div>
        <h1 className="text-3xl md:text-4xl font-black font-heading mb-2">
          Foto <span className="text-teal-600 dark:text-teal-400">Jurnalistik</span> PenaSakti
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Abadikan momen berharga melalui koleksi foto jurnalistik berkualitas tinggi dari
          fotografer profesional PenaSakti.
        </p>
      </div>

      {/* Featured Photo */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-penasakti-red" />
          <h2 className="text-xl font-bold">Foto Pilihan</h2>
        </div>

        <Link
          href={`/foto/${PHOTOS[0].slug}`}
          className="group grid md:grid-cols-5 gap-0 rounded-2xl overflow-hidden bg-card border border-border hover:shadow-card-hover transition-all"
        >
          <div className="md:col-span-3 relative aspect-[4/3] md:aspect-auto overflow-hidden">
            <Image
              src={PHOTOS[0].image}
              alt={PHOTOS[0].title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
          </div>
          <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-teal-500/5 to-transparent">
            <span
              className="inline-block self-start px-3 py-1 rounded-full text-xs font-bold text-white mb-4"
              style={{ backgroundColor: PHOTOS[0].category.color }}
            >
              {PHOTOS[0].category.name}
            </span>
            <h3 className="text-2xl md:text-3xl font-black leading-tight mb-4 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {PHOTOS[0].title}
            </h3>
            {PHOTOS[0].caption && (
              <p className="text-muted-foreground mb-5 leading-relaxed">
                {PHOTOS[0].caption}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
              <span className="font-semibold text-foreground/80">
                📷 {PHOTOS[0].photographer}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {formatNumber(PHOTOS[0].viewCount)}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-penasakti-red fill-penasakti-red/20" /> {formatNumber(PHOTOS[0].likeCount)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {formatDateRelative(PHOTOS[0].publishedAt)}
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Category Tabs */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-bold">Galeri Foto</h2>
        </div>
        <button className="flex items-center gap-1 text-sm text-penasakti-blue font-semibold hover:underline">
          Lihat Semua <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Masonry Gallery */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {PHOTOS.map((photo) => (
          <Link
            key={photo.id}
            href={`/foto/${photo.slug}`}
            className="group relative block break-inside-avoid rounded-xl overflow-hidden bg-muted border border-border hover:shadow-card-hover transition-all"
          >
            <div
              className="relative w-full"
              style={{ paddingTop: `${(photo.height / photo.width) * 100}%` }}
            >
              <Image
                src={photo.image}
                alt={photo.title}
                fill
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
              <span
                className="inline-block self-start px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white mb-2"
                style={{ backgroundColor: photo.category.color }}
              >
                {photo.category.name}
              </span>
              <h3 className="text-white font-bold leading-snug line-clamp-2 mb-2">
                {photo.title}
              </h3>
              {photo.caption && (
                <p className="text-white/70 text-xs line-clamp-2 mb-3">
                  {photo.caption}
                </p>
              )}
              <div className="flex items-center gap-3 text-xs text-white/70">
                <span>📷 {photo.photographer}</span>
                <span className="flex items-center gap-0.5">
                  <Eye className="w-3 h-3" /> {formatNumber(photo.viewCount)}
                </span>
                <span className="flex items-center gap-0.5">
                  <Heart className="w-3 h-3" /> {photo.likeCount}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 text-white text-center">
        <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-90" />
        <h3 className="text-2xl font-bold mb-2">Ingin Berbagi Cerita Melalui Foto?</h3>
        <p className="text-white/80 mb-5 max-w-xl mx-auto">
          Kirim karya foto terbaik Anda dan dapatkan kesempatan untuk ditampilkan di
          galeri PenaSakti dengan kredit lengkap atas nama Anda.
        </p>
        <a
          href="mailto:redaksi@penasakti.com?subject=Kirim%20Foto%20Jurnalistik"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-teal-600 font-semibold rounded-lg hover:bg-white/90 transition-colors"
        >
          <Grid3x3 className="w-4 h-4" />
          Kirim Foto Anda
        </a>
      </div>
    </div>
  );
}
