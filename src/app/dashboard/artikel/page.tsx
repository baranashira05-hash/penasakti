import Link from "next/link";
import { PlusCircle, Search, Filter } from "lucide-react";

export const metadata = { title: "Manajemen Artikel | Dashboard PenaSakti" };

const DEMO_ARTICLES = [
  { id: "1", title: "Presiden Umumkan Paket Stimulus Ekonomi Rp 500 Triliun", status: "PUBLISHED", category: "Ekonomi", views: 125000, publishedAt: "28 Jul 2026", author: "Ahmad Fauzi" },
  { id: "2", title: "Timnas Indonesia Lolos ke Final Piala AFF 2026", status: "PUBLISHED", category: "Olahraga", views: 98000, publishedAt: "28 Jul 2026", author: "Budi Santoso" },
  { id: "3", title: "Apple Investasi Rp 45 Triliun di Indonesia", status: "PUBLISHED", category: "Teknologi", views: 45200, publishedAt: "27 Jul 2026", author: "Siti Rahayu" },
  { id: "4", title: "Cara Mengurus KTP Elektronik Hilang 2026", status: "DRAFT", category: "Nasional", views: 0, publishedAt: "-", author: "Hendra W." },
  { id: "5", title: "Review Samsung Galaxy S26 Ultra Lengkap", status: "SCHEDULED", category: "Teknologi", views: 0, publishedAt: "29 Jul 2026", author: "Dewi P." },
  { id: "6", title: "Daftar 10 Universitas Terbaik Indonesia 2026", status: "PUBLISHED", category: "Pendidikan", views: 312000, publishedAt: "25 Jul 2026", author: "Fajar N." },
];

const STATUS_BADGE: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-700",
  DRAFT: "bg-yellow-100 text-yellow-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  ARCHIVED: "bg-gray-100 text-gray-600",
  TRASH: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
  PUBLISHED: "Tayang", DRAFT: "Draft", SCHEDULED: "Terjadwal", ARCHIVED: "Arsip", TRASH: "Sampah",
};

export default function ArticlesPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Artikel</h1>
          <p className="text-muted-foreground text-sm">Kelola semua artikel PenaSakti</p>
        </div>
        <Link
          href="/dashboard/artikel/baru"
          className="flex items-center gap-2 px-4 py-2.5 bg-penasakti-blue text-white rounded-xl font-semibold hover:bg-penasakti-blue/90 transition-colors text-sm"
        >
          <PlusCircle className="w-4 h-4" /> Buat Artikel
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Cari artikel..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-penasakti-blue/20 text-sm"
          />
        </div>
        <select className="px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none text-sm">
          <option value="">Semua Status</option>
          <option value="PUBLISHED">Tayang</option>
          <option value="DRAFT">Draft</option>
          <option value="SCHEDULED">Terjadwal</option>
          <option value="ARCHIVED">Arsip</option>
        </select>
        <select className="px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none text-sm">
          <option value="">Semua Kategori</option>
          <option>Nasional</option><option>Ekonomi</option><option>Teknologi</option>
          <option>Olahraga</option><option>Politik</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-semibold">Judul</th>
                <th className="text-left px-4 py-3 font-semibold">Penulis</th>
                <th className="text-left px-4 py-3 font-semibold">Kategori</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Views</th>
                <th className="text-left px-4 py-3 font-semibold">Tanggal</th>
                <th className="text-left px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DEMO_ARTICLES.map((a) => (
                <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium line-clamp-1 max-w-xs">{a.title}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{a.author}</td>
                  <td className="px-4 py-3">
                    <span className="bg-muted px-2 py-0.5 rounded-full text-xs">{a.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[a.status]}`}>
                      {STATUS_LABEL[a.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{a.views > 0 ? a.views.toLocaleString() : "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{a.publishedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/artikel/${a.id}/edit`} className="text-xs text-penasakti-blue hover:underline">Edit</Link>
                      <span className="text-border">|</span>
                      <Link href={`/artikel/${a.id}`} className="text-xs text-muted-foreground hover:underline">Lihat</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>Menampilkan 6 dari 24.751 artikel</span>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-sm ${p === 1 ? "bg-penasakti-blue text-white" : "border border-border hover:bg-muted"}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
