"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateRelative, formatNumber } from "@/lib/utils";
import type { ArticleWithRelations } from "@/types";
import RelativeTime from "@/components/shared/RelativeTime";

// Demo articles for when DB is empty
function getDemoArticles(): Partial<ArticleWithRelations>[] {
  return [
    {
      id: "1",
      title: "Presiden Umumkan Paket Stimulus Ekonomi Rp 500 Triliun untuk Pemulihan Nasional",
      slug: "presiden-umumkan-paket-stimulus-ekonomi",
      excerpt: "Pemerintah menggelontorkan stimulus besar-besaran untuk mendorong pertumbuhan ekonomi nasional yang ditargetkan mencapai 6% pada tahun ini.",
      featuredImage: "https://picsum.photos/seed/hero1/1200/600",
      category: { id: "1", name: "Nasional", slug: "nasional", color: "#e74c3c" } as never,
      author: { id: "1", name: "Ahmad Fauzi", image: null } as never,
      viewCount: 125000 as unknown as bigint,
      publishedAt: new Date("2026-07-28T08:00:00Z"),
      readTime: 5,
    },
    {
      id: "2",
      title: "Timnas Indonesia Lolos ke Final Piala AFF 2026, Siap Rebut Gelar Perdana",
      slug: "timnas-indonesia-lolos-final-piala-aff",
      excerpt: "Garuda Nusantara memastikan tiket final setelah mengalahkan Vietnam 3-1 dalam pertandingan dramatis di Stadion Gelora Bung Karno.",
      featuredImage: "https://picsum.photos/seed/hero2/1200/600",
      category: { id: "2", name: "Olahraga", slug: "olahraga", color: "#d35400" } as never,
      author: { id: "2", name: "Budi Santoso", image: null } as never,
      viewCount: 98000 as unknown as bigint,
      publishedAt: new Date("2026-07-28T06:00:00Z"),
      readTime: 3,
    },
    {
      id: "3",
      title: "Startup Indonesia Raih Valuasi Unicorn Ketiga Tahun Ini, Sektor Fintech Mendominasi",
      slug: "startup-indonesia-raih-valuasi-unicorn",
      excerpt: "Ekosistem startup Indonesia terus berkembang pesat dengan tiga unicorn baru yang lahir dalam satu tahun, menarik investasi global.",
      featuredImage: "https://picsum.photos/seed/hero3/1200/600",
      category: { id: "3", name: "Teknologi", slug: "teknologi", color: "#16a085" } as never,
      author: { id: "3", name: "Siti Rahayu", image: null } as never,
      viewCount: 72000 as unknown as bigint,
      publishedAt: new Date("2026-07-28T04:00:00Z"),
      readTime: 4,
    },
  ];
}

interface HeroSectionProps {
  articles: ArticleWithRelations[];
}

export default function HeroSection({ articles }: HeroSectionProps) {
  const displayArticles = articles.length > 0
    ? articles
    : (getDemoArticles() as ArticleWithRelations[]);

  const mainArticle = displayArticles[0];
  const sideArticles = displayArticles.slice(1, 5);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(displayArticles.length, 3));
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoplay, displayArticles.length]);

  const sliderArticles = displayArticles.slice(0, 3);

  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Slider */}
          <div className="lg:col-span-2">
            <div
              className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] bg-muted"
              onMouseEnter={() => setIsAutoplay(false)}
              onMouseLeave={() => setIsAutoplay(true)}
            >
              <AnimatePresence mode="wait">
                {sliderArticles.map((article, index) =>
                  index === currentSlide ? (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      {article.featuredImage ? (
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          fill
                          className="object-cover"
                          priority={index === 0}
                          sizes="(max-width: 1024px) 100vw, 66vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-penasakti-blue to-penasakti-red" />
                      )}
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pb-5 sm:pb-6 text-white">
                        <Link
                          href={`/kategori/${article.category?.slug || ""}`}
                          className="inline-block bg-red-600 px-3 py-1 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3 hover:bg-red-700 transition-colors"
                        >
                          {article.category?.name}
                        </Link>
                        <Link href={`/artikel/${article.slug}`}>
                          <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1.5 sm:mb-2 hover:text-yellow-300 transition-colors line-clamp-2 sm:line-clamp-3 leading-snug">
                            {article.title}
                          </h2>
                        </Link>
                        {article.excerpt && (
                          <p className="text-white/70 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3 hidden sm:block">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-3 sm:gap-4 text-white/60 text-[10px] sm:text-xs">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {article.publishedAt && <RelativeTime date={article.publishedAt} />}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {formatNumber(article.viewCount || 0)}
                          </span>
                          {article.readTime && (
                            <span>{article.readTime} menit baca</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>

              {/* Slider Controls */}
              {sliderArticles.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === 0 ? sliderArticles.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                    aria-label="Sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        (prev + 1) % sliderArticles.length
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                    aria-label="Berikutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-4 right-4 flex gap-1.5">
                    {sliderArticles.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`transition-all rounded-full ${
                          i === currentSlide
                            ? "w-6 h-2 bg-white"
                            : "w-2 h-2 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Side Articles */}
          <div className="flex flex-col gap-2 sm:gap-3">
            {sideArticles.map((article) => (
              <Link
                key={article.id}
                href={`/artikel/${article.slug}`}
                className="group flex gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all"
              >
                <div className="relative w-20 h-16 sm:w-24 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800">
                  {article.featuredImage ? (
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-red-100 dark:from-blue-900/30 dark:to-red-900/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider" style={{ color: article.category?.color || "#2563eb" }}>
                    {article.category?.name}
                  </span>
                  <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 sm:line-clamp-3 mt-0.5 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {article.publishedAt && <RelativeTime date={article.publishedAt} />}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
