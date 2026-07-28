import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { ArticleWithRelations } from "@/types";

const DEMO_TRENDING = [
  { id: "1", title: "10 Universitas Terbaik di Indonesia Versi QS World Rankings 2026", slug: "universitas-terbaik-indonesia-2026", viewCount: 245000 as unknown as bigint, category: { name: "Pendidikan", slug: "pendidikan", color: "#f39c12" } },
  { id: "2", title: "Cara Daftar KIS BPJS Kesehatan Gratis untuk Warga Tidak Mampu", slug: "cara-daftar-kis-bpjs-kesehatan", viewCount: 198000 as unknown as bigint, category: { name: "Nasional", slug: "nasional", color: "#e74c3c" } },
  { id: "3", title: "Jadwal Pertandingan Timnas Indonesia di Kualifikasi Piala Dunia", slug: "jadwal-timnas-kualifikasi-piala-dunia", viewCount: 175000 as unknown as bigint, category: { name: "Olahraga", slug: "olahraga", color: "#d35400" } },
  { id: "4", title: "Samsung Galaxy S26 Ultra Resmi Hadir di Indonesia, Ini Spesifikasi Lengkapnya", slug: "samsung-galaxy-s26-ultra-indonesia", viewCount: 152000 as unknown as bigint, category: { name: "Teknologi", slug: "teknologi", color: "#16a085" } },
  { id: "5", title: "Daftar Gaji PNS Terbaru 2026 Setelah Kenaikan 8 Persen", slug: "gaji-pns-terbaru-2026", viewCount: 134000 as unknown as bigint, category: { name: "Nasional", slug: "nasional", color: "#e74c3c" } },
  { id: "6", title: "Harga Emas Antam Hari Ini Naik Rp 15.000 per Gram", slug: "harga-emas-antam-naik", viewCount: 121000 as unknown as bigint, category: { name: "Ekonomi", slug: "ekonomi", color: "#27ae60" } },
  { id: "7", title: "Cara Mengurus Paspor Online Terbaru 2026, Lebih Mudah dan Cepat", slug: "cara-mengurus-paspor-online-2026", viewCount: 112000 as unknown as bigint, category: { name: "Nasional", slug: "nasional", color: "#e74c3c" } },
  { id: "8", title: "Resep Rendang Padang Asli yang Gurih dan Empuk ala Restoran", slug: "resep-rendang-padang-asli", viewCount: 98000 as unknown as bigint, category: { name: "Lifestyle", slug: "lifestyle", color: "#e91e63" } },
  { id: "9", title: "Bali Masuk 5 Destinasi Wisata Terbaik Dunia 2026 versi CNN Travel", slug: "bali-destinasi-wisata-terbaik-2026", viewCount: 87000 as unknown as bigint, category: { name: "Lifestyle", slug: "lifestyle", color: "#e91e63" } },
  { id: "10", title: "KPK Tetapkan Tersangka Baru Kasus Korupsi Proyek Infrastruktur", slug: "kpk-tetapkan-tersangka-korupsi-infrastruktur", viewCount: 76000 as unknown as bigint, category: { name: "Hukum", slug: "hukum", color: "#c0392b" } },
];

interface TrendingSectionProps {
  articles?: ArticleWithRelations[];
}

export default function TrendingSection({ articles }: TrendingSectionProps) {
  const displayArticles = articles && articles.length > 0
    ? articles
    : (DEMO_TRENDING as unknown as ArticleWithRelations[]);

  return (
    <section className="bg-muted/30 rounded-2xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-penasakti-red" />
        <h2 className="text-lg font-bold">Trending Hari Ini</h2>
      </div>

      <ol className="space-y-3">
        {displayArticles.slice(0, 10).map((article, index) => (
          <li key={article.id}>
            <Link
              href={`/artikel/${article.slug}`}
              className="group flex items-start gap-3"
            >
              <span
                className={`flex-shrink-0 text-2xl font-black leading-none mt-0.5 ${
                  index < 3
                    ? "text-penasakti-red"
                    : "text-muted-foreground/30"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-penasakti-blue transition-colors leading-snug">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-xs font-medium"
                    style={{ color: article.category?.color || "#666" }}
                  >
                    {article.category?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · {formatNumber(article.viewCount || 0)} views
                  </span>
                </div>
              </div>
            </Link>
            {index < 9 && <div className="mt-3 border-b border-border/50" />}
          </li>
        ))}
      </ol>
    </section>
  );
}
