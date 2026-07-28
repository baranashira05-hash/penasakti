import Link from "next/link";
import Image from "next/image";

const DEMO_RELATED = [
  { id: "r1", title: "Menteri Keuangan: Anggaran Infrastruktur 2026 Naik 25 Persen", slug: "anggaran-infrastruktur-2026", image: "https://picsum.photos/seed/rel1/400/250", category: "Ekonomi", categoryColor: "#27ae60", timeLabel: "1 hari lalu" },
  { id: "r2", title: "Bank Dunia Setujui Pinjaman Rp 12 Triliun untuk Proyek Air Bersih", slug: "bank-dunia-pinjaman-air-bersih", image: "https://picsum.photos/seed/rel2/400/250", category: "Nasional", categoryColor: "#e74c3c", timeLabel: "2 hari lalu" },
  { id: "r3", title: "Realisasi Investasi Q1 2026 Capai Rp 435 Triliun, Melampaui Target", slug: "realisasi-investasi-q1-2026", image: "https://picsum.photos/seed/rel3/400/250", category: "Ekonomi", categoryColor: "#27ae60", timeLabel: "3 hari lalu" },
  { id: "r4", title: "Indonesia Bergabung CPTPP, Ini Dampaknya bagi Perekonomian", slug: "indonesia-bergabung-cptpp", image: "https://picsum.photos/seed/rel4/400/250", category: "Ekonomi", categoryColor: "#27ae60", timeLabel: "4 hari lalu" },
];

interface RelatedArticlesProps {
  categorySlug: string;
  currentId: string;
}

export default function RelatedArticles({ categorySlug, currentId }: RelatedArticlesProps) {
  return (
    <section className="mt-10 border-t border-border pt-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-penasakti-blue rounded-full" />
          <h2 className="text-xl font-bold">Baca Juga</h2>
        </div>
        <Link href={`/kategori/${categorySlug}`} className="text-sm text-penasakti-blue hover:underline">
          Selengkapnya →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_RELATED.map((article) => (
          <Link key={article.id} href={`/artikel/${article.slug}`} className="group">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <span className="text-xs font-bold" style={{ color: article.categoryColor }}>
              {article.category}
            </span>
            <h3 className="font-semibold text-sm line-clamp-3 group-hover:text-penasakti-blue transition-colors mt-1 leading-snug">
              {article.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5" suppressHydrationWarning>
              {article.timeLabel}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
