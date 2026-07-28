import Link from "next/link";
import { Clock, Eye } from "lucide-react";
import { formatDateRelative, formatNumber } from "@/lib/utils";

const RECENT = [
  { id: "1", title: "Presiden Umumkan Paket Stimulus Ekonomi Rp 500 Triliun", status: "PUBLISHED", views: 125000 as unknown as bigint, publishedAt: new Date("2026-07-28T09:00:00Z"), category: "Nasional" },
  { id: "2", title: "Timnas Indonesia Lolos Final Piala AFF 2026", status: "PUBLISHED", views: 98000 as unknown as bigint, publishedAt: new Date("2026-07-28T08:00:00Z"), category: "Olahraga" },
  { id: "3", title: "Apple Investasi Rp 45 Triliun di Indonesia", status: "PUBLISHED", views: 45200 as unknown as bigint, publishedAt: new Date("2026-07-28T07:00:00Z"), category: "Teknologi" },
  { id: "4", title: "Cara Mengurus KTP Elektronik Hilang 2026", status: "DRAFT", views: 0 as unknown as bigint, publishedAt: new Date("2026-07-28T06:00:00Z"), category: "Nasional" },
  { id: "5", title: "Review Lengkap Samsung Galaxy S26 Ultra", status: "SCHEDULED", views: 0 as unknown as bigint, publishedAt: new Date("2026-07-29T10:00:00Z"), category: "Teknologi" },
];

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  DRAFT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  SCHEDULED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  ARCHIVED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  TRASH: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: "Tayang",
  DRAFT: "Draft",
  SCHEDULED: "Terjadwal",
  ARCHIVED: "Arsip",
  TRASH: "Sampah",
};

export default function RecentArticles() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Artikel Terbaru</h2>
        <Link href="/dashboard/artikel" className="text-sm text-penasakti-blue hover:underline">
          Semua →
        </Link>
      </div>

      <div className="space-y-3">
        {RECENT.map((article) => (
          <div key={article.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group">
            <div className="flex-1 min-w-0">
              <Link
                href={`/dashboard/artikel/${article.id}/edit`}
                className="text-sm font-semibold line-clamp-2 group-hover:text-penasakti-blue transition-colors leading-snug"
              >
                {article.title}
              </Link>
              <div className="flex items-center gap-3 mt-1.5">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[article.status]}`}
                >
                  {STATUS_LABELS[article.status]}
                </span>
                <span className="text-xs text-muted-foreground">{article.category}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1" suppressHydrationWarning>
                  <Clock className="w-3 h-3" />
                  {formatDateRelative(article.publishedAt)}
                </span>
                {article.status === "PUBLISHED" && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(article.views)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
