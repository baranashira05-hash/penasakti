"use client";

import { useState } from "react";
import {
  Search, CheckCircle, AlertTriangle, Send,
  Loader2, RefreshCw, Zap,
} from "lucide-react";
import { toast } from "sonner";

const SEO_SCORE = [
  { page: "Homepage", score: 95, issues: 0, indexed: true },
  { page: "/kategori/nasional", score: 92, issues: 1, indexed: true },
  { page: "/kategori/ekonomi", score: 88, issues: 2, indexed: true },
  { page: "/artikel/presiden-stimulus", score: 97, issues: 0, indexed: true },
  { page: "/store", score: 78, issues: 3, indexed: false },
];

export default function SEOPage() {
  const [indexing, setIndexing] = useState(false);
  const [indexSlug, setIndexSlug] = useState("");
  const [lastResult, setLastResult] = useState<{ message: string; success: boolean } | null>(null);

  /** Kirim semua artikel hari ini ke Google */
  const handleIndexAll = async () => {
    setIndexing(true);
    setLastResult(null);
    try {
      const res = await fetch("/api/seo/index-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setLastResult({ message: data.message || data.error, success: res.ok });
      if (res.ok) toast.success(data.message);
      else toast.error(data.error || "Gagal mengirim ke Google");
    } catch {
      toast.error("Gagal menghubungi server");
    } finally {
      setIndexing(false);
    }
  };

  /** Kirim satu artikel spesifik */
  const handleIndexOne = async () => {
    if (!indexSlug.trim()) { toast.error("Masukkan slug artikel"); return; }
    setIndexing(true);
    setLastResult(null);
    try {
      const slug = indexSlug.trim().replace(/^\/artikel\//, "");
      const res = await fetch("/api/seo/index-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      setLastResult({ message: data.message || data.error, success: res.ok });
      if (res.ok) { toast.success(data.message); setIndexSlug(""); }
      else toast.error(data.error || "Gagal");
    } catch {
      toast.error("Gagal menghubungi server");
    } finally {
      setIndexing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-emerald-600" /> SEO Center
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Monitor dan optimasi SEO website</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "SEO Score", value: "92/100", color: "emerald" },
          { label: "Indexed Pages", value: "18,420", color: "blue" },
          { label: "Broken Links", value: "3", color: "red" },
          { label: "Avg. Position", value: "4.2", color: "amber" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-[11px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Google Indexing Panel ── */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Google Indexing</h3>
            <p className="text-[11px] text-gray-400">Kirim artikel langsung ke Google agar cepat terindeks</p>
          </div>
        </div>

        {/* Kirim semua artikel hari ini */}
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
            Kirim Semua Artikel Hari Ini
          </p>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-3">
            Otomatis mengirim semua artikel yang diterbitkan 24 jam terakhir ke Google Indexing API dan ping sitemap ke Google & Bing.
          </p>
          <button
            onClick={handleIndexAll}
            disabled={indexing}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          >
            {indexing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {indexing ? "Mengirim..." : "Kirim ke Google Sekarang"}
          </button>
        </div>

        {/* Kirim satu artikel */}
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
            Kirim Artikel Spesifik
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400 mb-3">
            Masukkan slug artikel (contoh: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">usaha-bulu-ayam-ditutup</code>)
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={indexSlug}
              onChange={(e) => setIndexSlug(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleIndexOne()}
              placeholder="slug-artikel-anda"
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={handleIndexOne}
              disabled={indexing}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 flex-shrink-0"
            >
              {indexing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Kirim
            </button>
          </div>
        </div>

        {/* Hasil */}
        {lastResult && (
          <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
            lastResult.success
              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
          }`}>
            {lastResult.success
              ? <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              : <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
            {lastResult.message}
          </div>
        )}

        {/* Info setup */}
        <details className="text-xs text-gray-500 dark:text-gray-400">
          <summary className="cursor-pointer font-medium hover:text-gray-700 dark:hover:text-gray-200">
            ⚙️ Cara setup Google Indexing API
          </summary>
          <div className="mt-2 space-y-1 pl-2 border-l-2 border-gray-200 dark:border-slate-600">
            <p>1. Buka <a href="https://console.cloud.google.com" target="_blank" rel="noopener" className="text-blue-500 underline">Google Cloud Console</a></p>
            <p>2. APIs &amp; Services → Enable &quot;Web Search Indexing API&quot;</p>
            <p>3. Buat Service Account → buat JSON Key</p>
            <p>4. Copy isi JSON key ke env variable <code className="bg-gray-100 dark:bg-slate-700 px-1 rounded">GOOGLE_INDEXING_SA_JSON</code> di Vercel</p>
            <p>5. Di <a href="https://search.google.com/search-console" target="_blank" rel="noopener" className="text-blue-500 underline">Google Search Console</a> → Settings → Users &amp; Permissions → Tambahkan email service account sebagai <strong>Owner</strong></p>
          </div>
        </details>
      </div>

      {/* SEO Score Table */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Halaman &amp; Skor SEO</h3>
        <div className="space-y-3">
          {SEO_SCORE.map((p) => (
            <div
              key={p.page}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-slate-700"
            >
              <div className="flex items-center gap-3">
                {p.indexed ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{p.page}</p>
                  <p className="text-[10px] text-gray-400">
                    {p.issues === 0 ? "Tidak ada masalah" : `${p.issues} masalah ditemukan`}
                  </p>
                </div>
              </div>
              <div
                className={`text-sm font-bold ${
                  p.score >= 90 ? "text-emerald-600" : p.score >= 80 ? "text-amber-600" : "text-red-600"
                }`}
              >
                {p.score}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
