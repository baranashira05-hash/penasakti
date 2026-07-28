import Link from "next/link";
import Image from "next/image";
import AdBanner from "@/components/shared/AdBanner";
import NewsletterSection from "@/components/home/NewsletterSection";

const RELATED_SIDEBAR = [
  { id: "1", title: "IMF Naikkan Proyeksi Pertumbuhan Ekonomi Indonesia ke 5,8 Persen", slug: "imf-proyeksi-pertumbuhan-ekonomi", image: "https://picsum.photos/seed/side1/200/120", category: "Ekonomi", color: "#27ae60" },
  { id: "2", title: "Menteri Keuangan Jelaskan Rincian APBN Perubahan 2026", slug: "menteri-keuangan-apbn-perubahan", image: "https://picsum.photos/seed/side2/200/120", category: "Ekonomi", color: "#27ae60" },
  { id: "3", title: "Bursa Saham Asia Kompak Menguat Sambut Data Inflasi AS", slug: "bursa-saham-asia-menguat", image: "https://picsum.photos/seed/side3/200/120", category: "Ekonomi", color: "#27ae60" },
  { id: "4", title: "Pemerintah Buka Lelang Obligasi Rp 30 Triliun Pekan Ini", slug: "pemerintah-lelang-obligasi", image: "https://picsum.photos/seed/side4/200/120", category: "Ekonomi", color: "#27ae60" },
];

interface ArticleSidebarProps {
  currentArticleId: string;
}

export default function ArticleSidebar({ currentArticleId }: ArticleSidebarProps) {
  return (
    <div className="sticky top-24 space-y-6">
      {/* Ad */}
      <AdBanner position="SIDEBAR" />

      {/* Related Sidebar */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-penasakti-red rounded-full inline-block" />
          Berita Terkait
        </h3>
        <div className="space-y-4">
          {RELATED_SIDEBAR.map((item) => (
            <Link
              key={item.id}
              href={`/artikel/${item.slug}`}
              className="group flex gap-3"
            >
              <div className="relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold" style={{ color: item.color }}>
                  {item.category}
                </span>
                <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-penasakti-blue transition-colors leading-snug">
                  {item.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterSection />

      {/* Second Ad */}
      <AdBanner position="SIDEBAR" />
    </div>
  );
}
