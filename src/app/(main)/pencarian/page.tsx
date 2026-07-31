"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, TrendingUp, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import ArticleCard from "@/components/article/ArticleCard";
import type { ArticleWithRelations } from "@/types";

const TRENDING_SEARCHES = [
  "Pemilu 2026", "IKN Nusantara", "Liga Champions", "iPhone 17",
  "BPJS", "Harga BBM", "Timnas Indonesia", "Gempa Hari Ini",
];

interface SearchMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  query: string;
}

function SearchContent() {
  const router      = useRouter();
  const searchParams = useSearchParams();

  const initialQ    = searchParams.get("q") || "";
  const initialPage = parseInt(searchParams.get("page") || "1");

  const [inputValue, setInputValue] = useState(initialQ);
  const [results,    setResults]    = useState<ArticleWithRelations[]>([]);
  const [meta,       setMeta]       = useState<SearchMeta | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [searchedQ,  setSearchedQ]  = useState(initialQ);

  const inputRef = useRef<HTMLInputElement>(null);

  // ── Fungsi search utama ─────────────────────────────────────────────────
  const doSearch = useCallback(async (q: string, page = 1) => {
    if (!q.trim() || q.trim().length < 2) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q.trim())}&page=${page}&limit=12`
      );
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || "Terjadi kesalahan, coba lagi.");
        setResults([]);
        setMeta(null);
        return;
      }

      setResults(json.data || []);
      setMeta(json.meta || null);
      setSearchedQ(q.trim());
    } catch {
      setError("Tidak bisa terhubung ke server. Coba lagi.");
      setResults([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Jalankan search otomatis jika URL sudah punya ?q=
  useEffect(() => {
    if (initialQ.trim().length >= 2) {
      doSearch(initialQ, initialPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Submit form ─────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q) return;
    router.push(`/pencarian?q=${encodeURIComponent(q)}`, { scroll: false });
    doSearch(q, 1);
  };

  // ── Klik trending ───────────────────────────────────────────────────────
  const handleTrending = (term: string) => {
    setInputValue(term);
    router.push(`/pencarian?q=${encodeURIComponent(term)}`, { scroll: false });
    doSearch(term, 1);
  };

  // ── Ganti halaman ───────────────────────────────────────────────────────
  const goPage = (page: number) => {
    router.push(`/pencarian?q=${encodeURIComponent(searchedQ)}&page=${page}`, { scroll: true });
    doSearch(searchedQ, page);
  };

  const hasResults = results.length > 0;
  const hasQuery   = searchedQ.trim().length >= 2;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ── Search Bar ── */}
      <div className="max-w-3xl mx-auto mb-10">
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Cari berita, topik, penulis..."
            autoFocus
            className="w-full pl-14 pr-28 py-4 text-base sm:text-lg border-2 border-border rounded-2xl bg-background focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => { setInputValue(""); setResults([]); setMeta(null); setSearchedQ(""); inputRef.current?.focus(); }}
              className="absolute right-20 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-lg transition-colors"
              aria-label="Hapus"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button
            type="submit"
            disabled={loading || inputValue.trim().length < 2}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cari"}
          </button>
        </form>

        {/* Trending — hanya tampil jika belum ada query */}
        {!hasQuery && !loading && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Trending Pencarian
            </p>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleTrending(term)}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors border border-border hover:border-blue-400"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div className="max-w-lg mx-auto text-center py-16">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-lg font-bold mb-2 text-destructive">{error}</h2>
          <button
            onClick={() => doSearch(searchedQ || inputValue)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* ── Hasil pencarian ── */}
      {!loading && !error && hasQuery && (
        <>
          {/* Info hasil */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {meta?.total
                ? <>Ditemukan <span className="font-bold text-foreground">{meta.total.toLocaleString()}</span> hasil untuk <span className="font-semibold text-blue-600">"{searchedQ}"</span></>
                : <>Tidak ada hasil untuk <span className="font-semibold text-blue-600">"{searchedQ}"</span></>
              }
            </p>
            {meta && meta.totalPages > 1 && (
              <p className="text-xs text-muted-foreground">
                Halaman {meta.page} dari {meta.totalPages}
              </p>
            )}
          </div>

          {/* Grid artikel */}
          {hasResults ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="vertical" />
                ))}
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => goPage(meta.page - 1)}
                    disabled={!meta.hasPrevPage}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Sebelumnya
                  </button>

                  {/* Nomor halaman */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(meta.totalPages, 7) }, (_, i) => {
                      const pg = i + 1;
                      return (
                        <button
                          key={pg}
                          onClick={() => goPage(pg)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
                            pg === meta.page
                              ? "bg-blue-600 text-white"
                              : "border border-border hover:bg-muted"
                          }`}
                        >
                          {pg}
                        </button>
                      );
                    })}
                    {meta.totalPages > 7 && (
                      <span className="flex items-center px-2 text-muted-foreground text-sm">…{meta.totalPages}</span>
                    )}
                  </div>

                  <button
                    onClick={() => goPage(meta.page + 1)}
                    disabled={!meta.hasNextPage}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  >
                    Berikutnya <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            // Tidak ada hasil
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h2 className="text-xl font-bold mb-2">Tidak ada hasil ditemukan</h2>
              <p className="text-muted-foreground mb-6">
                Coba kata kunci lain atau periksa ejaan Anda
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {TRENDING_SEARCHES.slice(0, 4).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTrending(t)}
                    className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Empty state — belum pernah search ── */}
      {!loading && !error && !hasQuery && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="w-9 h-9 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Cari Berita Apapun</h2>
          <p className="text-muted-foreground">
            Masukkan kata kunci untuk mencari berita, topik, atau penulis
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
