"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, MessageSquare } from "lucide-react";
import { formatDateRelative, formatNumber } from "@/lib/utils";
import type { ArticleWithRelations } from "@/types";
import ArticleCard from "@/components/article/ArticleCard";

const DEMO_ARTICLES: Partial<ArticleWithRelations>[] = [
  {
    id: "l1",
    title: "Bank Indonesia Pertahankan Suku Bunga Acuan di 5,75 Persen",
    slug: "bi-pertahankan-suku-bunga-acuan",
    excerpt: "Rapat Dewan Gubernur Bank Indonesia memutuskan mempertahankan BI Rate di level 5,75 persen untuk menjaga stabilitas rupiah.",
    featuredImage: "https://picsum.photos/seed/latest1/600/400",
    category: { id: "1", name: "Ekonomi", slug: "ekonomi", color: "#27ae60" } as never,
    author: { id: "1", name: "Dewi Pertiwi", image: null } as never,
    viewCount: 18500 as unknown as bigint,
    publishedAt: new Date("2026-07-28T09:45:00Z"),
    readTime: 3,
    commentCount: 24,
  },
  {
    id: "l2",
    title: "Pemerintah Percepat Pembangunan 100 Sekolah Negeri di Daerah Terluar",
    slug: "pemerintah-percepat-pembangunan-sekolah",
    excerpt: "Kementerian Pendidikan mengalokasikan Rp 8,5 triliun untuk membangun dan merenovasi sekolah di kawasan 3T Indonesia.",
    featuredImage: "https://picsum.photos/seed/latest2/600/400",
    category: { id: "2", name: "Pendidikan", slug: "pendidikan", color: "#f39c12" } as never,
    author: { id: "2", name: "Rini Susanti", image: null } as never,
    viewCount: 12300 as unknown as bigint,
    publishedAt: new Date("2026-07-28T09:30:00Z"),
    readTime: 4,
    commentCount: 18,
  },
  {
    id: "l3",
    title: "Apple Investasi Rp 45 Triliun di Indonesia untuk Pabrik Komponen",
    slug: "apple-investasi-indonesia-pabrik-komponen",
    excerpt: "Raksasa teknologi Apple mengumumkan investasi senilai 3 miliar dolar AS untuk membangun fasilitas produksi komponen iPhone di Batam.",
    featuredImage: "https://picsum.photos/seed/latest3/600/400",
    category: { id: "3", name: "Teknologi", slug: "teknologi", color: "#16a085" } as never,
    author: { id: "3", name: "Hendra Wijaya", image: null } as never,
    viewCount: 45200 as unknown as bigint,
    publishedAt: new Date("2026-07-28T09:00:00Z"),
    readTime: 5,
    commentCount: 67,
  },
  {
    id: "l4",
    title: "Pelabuhan Patimban Resmi Beroperasi Penuh, Kapasitas 7,5 Juta TEU",
    slug: "pelabuhan-patimban-beroperasi-penuh",
    excerpt: "Pelabuhan Patimban di Subang, Jawa Barat kini beroperasi penuh dengan kapasitas penanganan peti kemas terbesar kedua di Indonesia.",
    featuredImage: "https://picsum.photos/seed/latest4/600/400",
    category: { id: "4", name: "Ekonomi", slug: "ekonomi", color: "#27ae60" } as never,
    author: { id: "4", name: "Mulyono Sasono", image: null } as never,
    viewCount: 9800 as unknown as bigint,
    publishedAt: new Date("2026-07-28T08:30:00Z"),
    readTime: 4,
    commentCount: 12,
  },
  {
    id: "l5",
    title: "Mahkamah Agung Tolak Kasasi Terdakwa Kasus Suap Anggaran Daerah",
    slug: "mahkamah-agung-tolak-kasasi-suap",
    excerpt: "MA memperkuat vonis 12 tahun penjara bagi mantan kepala dinas yang terbukti menerima suap dalam pengadaan alat kesehatan.",
    featuredImage: "https://picsum.photos/seed/latest5/600/400",
    category: { id: "5", name: "Hukum", slug: "hukum", color: "#c0392b" } as never,
    author: { id: "5", name: "Fajar Nugroho", image: null } as never,
    viewCount: 22100 as unknown as bigint,
    publishedAt: new Date("2026-07-28T08:00:00Z"),
    readTime: 4,
    commentCount: 45,
  },
  {
    id: "l6",
    title: "Indonesia Ekspor Perdana Baterai EV ke Eropa, Nilai Rp 3,2 Triliun",
    slug: "indonesia-ekspor-baterai-ev-eropa",
    excerpt: "Industri baterai kendaraan listrik Indonesia mencapai tonggak sejarah dengan pengiriman pertama ke pasar Eropa melalui kontrak multi-tahun.",
    featuredImage: "https://picsum.photos/seed/latest6/600/400",
    category: { id: "6", name: "Ekonomi", slug: "ekonomi", color: "#27ae60" } as never,
    author: { id: "6", name: "Sri Astuti", image: null } as never,
    viewCount: 31500 as unknown as bigint,
    publishedAt: new Date("2026-07-28T07:30:00Z"),
    readTime: 5,
    commentCount: 38,
  },
];

interface LatestNewsProps {
  articles?: ArticleWithRelations[];
}

export default function LatestNews({ articles }: LatestNewsProps) {
  const [page, setPage] = useState(1);
  const displayArticles = articles && articles.length > 0
    ? articles
    : (DEMO_ARTICLES as ArticleWithRelations[]);

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-penasakti-blue rounded-full" />
          <h2 className="text-xl font-bold">Berita Terbaru</h2>
        </div>
        <Link
          href="/terbaru"
          className="text-sm text-penasakti-blue hover:underline font-medium"
        >
          Lihat Semua →
        </Link>
      </div>

      <div className="space-y-5">
        {displayArticles.map((article, index) => (
          <ArticleCard key={article.id} article={article} variant="horizontal" />
        ))}
      </div>

      {/* Load More */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-8 py-3 border-2 border-penasakti-blue text-penasakti-blue rounded-xl font-semibold hover:bg-penasakti-blue hover:text-white transition-all"
        >
          Muat Lebih Banyak
        </button>
      </div>
    </section>
  );
}
