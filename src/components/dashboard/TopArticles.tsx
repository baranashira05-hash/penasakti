import { Eye, TrendingUp } from "lucide-react";
import { formatNumber } from "@/lib/utils";

const TOP_ARTICLES = [
  { id: "1", title: "10 Universitas Terbaik Indonesia 2026", views: BigInt(312000), category: "Pendidikan", growth: 45 },
  { id: "2", title: "Cara Daftar KIS BPJS Kesehatan Gratis", views: BigInt(287000), category: "Nasional", growth: 32 },
  { id: "3", title: "Jadwal Timnas Kualifikasi Piala Dunia", views: BigInt(256000), category: "Olahraga", growth: 28 },
  { id: "4", title: "Samsung Galaxy S26 Ultra di Indonesia", views: BigInt(234000), category: "Teknologi", growth: 67 },
  { id: "5", title: "Daftar Gaji PNS Terbaru 2026", views: BigInt(198000), category: "Nasional", growth: 12 },
];

export default function TopArticles() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-penasakti-red" />
        <h2 className="font-bold text-lg">Artikel Terpopuler</h2>
      </div>

      <div className="space-y-3">
        {TOP_ARTICLES.map((article, index) => (
          <div key={article.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
            <span
              className={`text-2xl font-black w-8 flex-shrink-0 ${
                index < 3 ? "text-penasakti-red" : "text-muted-foreground/30"
              }`}
            >
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold line-clamp-2 leading-snug">
                {article.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{article.category}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-sm flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                {formatNumber(article.views)}
              </p>
              <p className="text-xs text-green-600 font-medium">+{article.growth}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
