"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

const DEMO_BREAKING = [
  {
    id: "1",
    title: "Gempa 6.2 SR Guncang Sulawesi Tengah, BMKG Imbau Warga Tetap Waspada",
    slug: "gempa-62-sr-sulawesi-tengah",
    category: "Nasional",
    categorySlug: "nasional",
    categoryColor: "#e74c3c",
    timeLabel: "30 menit lalu",
  },
  {
    id: "2",
    title: "Rupiah Menguat ke Level Rp 15.200 per Dolar AS di Tengah Arus Modal Masuk",
    slug: "rupiah-menguat-rp-15200",
    category: "Ekonomi",
    categorySlug: "ekonomi",
    categoryColor: "#27ae60",
    timeLabel: "1 jam lalu",
  },
  {
    id: "3",
    title: "DPR Setujui RUU Omnibus Law Ketenagakerjaan dalam Sidang Paripurna",
    slug: "dpr-setujui-ruu-omnibus-law",
    category: "Politik",
    categorySlug: "politik",
    categoryColor: "#8e44ad",
    timeLabel: "2 jam lalu",
  },
  {
    id: "4",
    title: "Polisi Tangkap Pelaku Penipuan Investasi Bodong Rp 2,3 Triliun di Jakarta",
    slug: "polisi-tangkap-pelaku-penipuan-investasi",
    category: "Hukum",
    categorySlug: "hukum",
    categoryColor: "#c0392b",
    timeLabel: "3 jam lalu",
  },
];

export default function BreakingSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-penasakti-red rounded-full" />
          <h2 className="text-xl font-bold">Berita Terkini</h2>
        </div>
        <Link
          href="/terkini"
          className="text-sm text-penasakti-blue hover:underline font-medium"
        >
          Lihat Semua →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DEMO_BREAKING.map((article, index) => (
          <Link
            key={article.id}
            href={`/artikel/${article.slug}`}
            className="group flex gap-3 p-3 rounded-xl border border-border hover:border-penasakti-blue/30 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-penasakti-blue/10 text-penasakti-blue flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <span
                className="text-xs font-bold uppercase"
                style={{ color: article.categoryColor }}
              >
                {article.category}
              </span>
              <h3 className="text-sm font-semibold line-clamp-2 mt-0.5 group-hover:text-penasakti-blue transition-colors leading-snug">
                {article.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {mounted ? article.timeLabel : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
