"use client";

import { useState } from "react";
import { Database, Download, RefreshCw, CheckCircle, AlertCircle, Loader2, Globe, FileText, Tag, Users, Image as ImageIcon } from "lucide-react";

interface MigrationStatus {
  totalArticles: number;
  totalCategories: number;
  totalTags: number;
  totalAuthors: number;
}

interface MigrationProgress {
  page: number;
  totalPages: number;
  migratedCount: number;
  totalArticles: number;
  progress: number;
}

export default function MigrationPage() {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState<MigrationProgress | null>(null);
  const [migratedTotal, setMigratedTotal] = useState(0);
  const [error, setError] = useState("");
  const [previewArticles, setPreviewArticles] = useState<any[]>([]);

  const fetchStatus = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/migration?action=status");
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
      } else {
        setError(data.error || "Gagal mengambil data");
      }
    } catch (err) {
      setError("Tidak dapat terhubung ke WordPress API");
    } finally {
      setLoading(false);
    }
  };

  const fetchPreview = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/migration?action=preview&page=1");
      const data = await res.json();
      if (data.success) {
        setPreviewArticles(data.data.articles);
      }
    } catch {
      setError("Gagal preview");
    } finally {
      setLoading(false);
    }
  };

  const startMigration = async () => {
    setMigrating(true);
    setMigratedTotal(0);
    setError("");

    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const res = await fetch("/api/migration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page, perPage: 20 }),
        });
        const data = await res.json();

        if (data.success) {
          setProgress(data.data);
          setMigratedTotal(prev => prev + data.data.migratedCount);
          hasMore = page < data.data.totalPages;
          page++;
        } else {
          setError(data.error);
          hasMore = false;
        }
      } catch {
        setError("Migration interrupted");
        hasMore = false;
      }

      // Small delay to prevent rate limiting
      await new Promise(r => setTimeout(r, 500));
    }

    setMigrating(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-indigo-600" /> Migrasi WordPress
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Import data dari penasakti.com (WordPress) ke Next.js</p>
      </div>

      {/* Source Info */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white text-sm">Sumber Data</p>
            <p className="text-xs text-gray-500">https://penasakti.com (WordPress REST API)</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={fetchStatus} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Cek Status WordPress
          </button>
          <button onClick={fetchPreview} disabled={loading} className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-600 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-70">
            <FileText className="w-4 h-4" /> Preview Artikel
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-300">Error</p>
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* WordPress Stats */}
      {status && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <FileText className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{status.totalArticles.toLocaleString()}</p>
            <p className="text-[11px] text-gray-500">Artikel</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <Tag className="w-5 h-5 text-emerald-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{status.totalCategories}</p>
            <p className="text-[11px] text-gray-500">Kategori</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <Tag className="w-5 h-5 text-amber-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{status.totalTags}</p>
            <p className="text-[11px] text-gray-500">Tags</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <Users className="w-5 h-5 text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{status.totalAuthors}</p>
            <p className="text-[11px] text-gray-500">Penulis</p>
          </div>
        </div>
      )}

      {/* Start Migration */}
      {status && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Mulai Migrasi</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Akan memigrasikan {status.totalArticles.toLocaleString()} artikel, {status.totalCategories} kategori, {status.totalTags} tag, dan {status.totalAuthors} penulis.
          </p>

          {/* Progress */}
          {progress && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                <span>Progress: {progress.progress}%</span>
                <span>{migratedTotal} / {progress.totalArticles} artikel</span>
              </div>
              <div className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress.progress}%` }} />
              </div>
            </div>
          )}

          <button onClick={startMigration} disabled={migrating} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-70">
            {migrating ? <><Loader2 className="w-4 h-4 animate-spin" /> Memigrasikan...</> : <><Download className="w-4 h-4" /> Mulai Migrasi</>}
          </button>

          {!migrating && migratedTotal > 0 && (
            <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                Migrasi selesai! {migratedTotal} artikel berhasil diproses.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Preview Articles */}
      {previewArticles.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Preview Artikel WordPress</h3>
          <div className="space-y-3">
            {previewArticles.map((a: any) => (
              <div key={a.wpId} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                {a.featuredImage && (
                  <img src={a.featuredImage} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1" dangerouslySetInnerHTML={{ __html: a.title }} />
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    /{a.slug} • {a.author?.name} • {new Date(a.publishedAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
