"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Mic, TrendingUp, Clock, X } from "lucide-react";
import ArticleCard from "@/components/article/ArticleCard";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "@/lib/utils";

const TRENDING_SEARCHES = [
  "Pemilu 2026", "IKN Nusantara", "Liga Champions", "iPhone 17",
  "BPJS", "Harga BBM", "Timnas Indonesia", "Gempa Hari Ini",
];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query.trim() || query.length < 2) return null;
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=12`);
      return res.json();
    },
    enabled: query.trim().length >= 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setQuery(inputValue.trim());
      router.push(`/pencarian?q=${encodeURIComponent(inputValue.trim())}`, { scroll: false });
    }
  };

  const handleTrendingClick = (term: string) => {
    setInputValue(term);
    setQuery(term);
    router.push(`/pencarian?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-10">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Cari berita, topik, penulis..."
            autoFocus
            className="w-full pl-14 pr-24 py-4 text-lg border-2 border-border rounded-2xl bg-background focus:outline-none focus:border-penasakti-blue focus:ring-4 focus:ring-penasakti-blue/10 transition-all"
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => { setInputValue(""); setQuery(""); }}
              className="absolute right-16 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-penasakti-blue text-white rounded-xl font-semibold hover:bg-penasakti-blue/90 transition-colors text-sm"
          >
            Cari
          </button>
        </form>

        {/* Trending Searches */}
        {!query && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Trending Pencarian
            </p>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleTrendingClick(term)}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl skeleton" />
          ))}
        </div>
      )}

      {data?.data && !isLoading && (
        <>
          <div className="flex items-center justify-between mb-5">
            <p className="text-muted-foreground">
              Ditemukan <span className="font-bold text-foreground">{data.meta?.total || 0}</span> hasil untuk{" "}
              <span className="font-bold text-penasakti-blue">"{query}"</span>
            </p>
          </div>

          {data.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.data.map((article: never) => (
                <ArticleCard key={(article as { id: string }).id} article={article} variant="vertical" />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h2 className="text-xl font-bold mb-2">Tidak ada hasil ditemukan</h2>
              <p className="text-muted-foreground">
                Coba kata kunci lain atau periksa ejaan Anda
              </p>
            </div>
          )}
        </>
      )}

      {!query && !isLoading && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
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
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
