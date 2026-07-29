"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Search, Edit, Trash2, Eye, ExternalLink } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  viewCount: number;
  publishedAt: string | null;
  category: { name: string } | null;
  author: { name: string } | null;
}

const STATUS_BADGE: Record<string, string> = {
  PUBLISHED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  DRAFT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  REVIEW: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  ARCHIVED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const STATUS_LABEL: Record<string, string> = {
  PUBLISHED: "Tayang", DRAFT: "Draft", REVIEW: "Review", ARCHIVED: "Arsip", SCHEDULED: "Terjadwal",
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchArticles = async (p = 1, q = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p.toString(), limit: "20" });
      if (q) params.set("q", q);
      const res = await fetch(`/api/articles?${params}`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.data);
        setTotal(data.meta.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(page, search); }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchArticles(1, search);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus artikel ini?")) return;
    try {
      await fetch(`/api/articles/${id}`, { method: "DELETE" });
      fetchArticles(page, search);
    } catch {}
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Manajemen Artikel</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{total.toLocaleString()} artikel total</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/artikel/baru" className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
            <PlusCircle className="w-4 h-4" /> Buat Artikel
          </Link>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setSearch(""); setPage(1); fetchArticles(1, ""); }} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white">
          Semua ({total})
        </button>
        <button onClick={() => { setSearch(""); setPage(1); fetchArticles(1, ""); }} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
          🔥 Berita Terkini
        </button>
        <button onClick={() => { setSearch(""); setPage(1); fetchArticles(1, ""); }} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          📈 Trending
        </button>
        <button onClick={() => { setSearch(""); setPage(1); fetchArticles(1, ""); }} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
          ⭐ Populer
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari artikel..." className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <button type="submit" className="px-4 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700">Cari</button>
      </form>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Memuat artikel...</div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Tidak ada artikel ditemukan</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Judul</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 hidden md:table-cell">Kategori</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 hidden sm:table-cell">Views</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                {articles.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white text-xs line-clamp-1 max-w-xs">{a.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{a.author?.name || "Redaksi"} • {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("id-ID") : "-"}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{a.category?.name || "-"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[a.status] || STATUS_BADGE.DRAFT}`}>
                        {STATUS_LABEL[a.status] || a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                      {(a.viewCount || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/artikel/${a.slug}`} target="_blank" className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-blue-600" title="Lihat">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link href={`/dashboard/artikel/edit/${a.id}`} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-emerald-600" title="Edit">
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-red-600" title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > 20 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between text-sm">
            <span className="text-gray-500 text-xs">Halaman {page} dari {Math.ceil(total / 20)}</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 rounded border border-gray-200 dark:border-slate-700 text-xs disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-800">←</button>
              <button onClick={() => setPage(page + 1)} disabled={page >= Math.ceil(total / 20)} className="px-3 py-1 rounded border border-gray-200 dark:border-slate-700 text-xs disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-800">→</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
