import { Metadata } from "next";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { Bookmark as BookmarkIcon, Trash2, Clock, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDateRelative, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bookmark",
  description: "Kumpulan artikel yang Anda simpan untuk dibaca nanti.",
};

const DEMO_BOOKMARKS = [
  {
    id: "1",
    article: {
      id: "a1",
      title: "Presiden Umumkan Paket Stimulus Ekonomi Rp 500 Triliun untuk Pemulihan Nasional",
      slug: "presiden-umumkan-paket-stimulus-ekonomi",
      excerpt: "Pemerintah menggelontorkan stimulus besar-besaran untuk mendorong pertumbuhan ekonomi.",
      featuredImage: "https://picsum.photos/seed/bm1/600/400",
      publishedAt: new Date(Date.now() - 3600000),
      viewCount: BigInt(125000),
      readTime: 5,
      category: { id: "c1", name: "Nasional", slug: "nasional", color: "#e74c3c" },
      author: { id: "au1", name: "Ahmad Fauzi", image: null },
    },
    createdAt: new Date(Date.now() - 1800000),
  },
  {
    id: "2",
    article: {
      id: "a2",
      title: "Startup Indonesia Raih Valuasi Unicorn Ketiga Tahun Ini",
      slug: "startup-indonesia-raih-valuasi-unicorn",
      excerpt: "Ekosistem startup Indonesia terus berkembang pesat dengan tiga unicorn baru.",
      featuredImage: "https://picsum.photos/seed/bm2/600/400",
      publishedAt: new Date(Date.now() - 7200000),
      viewCount: BigInt(72000),
      readTime: 4,
      category: { id: "c2", name: "Teknologi", slug: "teknologi", color: "#16a085" },
      author: { id: "au2", name: "Siti Rahayu", image: null },
    },
    createdAt: new Date(Date.now() - 3600000),
  },
];

export default async function BookmarkPage() {
  const session = await getServerSession(authOptions);
  let bookmarks = DEMO_BOOKMARKS as unknown as Array<{
    id: string;
    article: any;
    createdAt: Date;
  }>;

  if (session?.user) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const result = await prisma.bookmark.findMany({
        where: { userId: session.user.id },
        include: {
          article: {
            include: {
              category: true,
              author: { select: { id: true, name: true, image: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      if (result.length > 0) bookmarks = result as any;
    } catch {
      // keep demo data
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-penasakti-blue/10 text-penasakti-blue flex items-center justify-center">
              <BookmarkIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black font-heading">
                Artikel <span className="text-penasakti-blue">Tersimpan</span>
              </h1>
              <p className="text-muted-foreground text-sm">
                Kumpulan berita yang Anda simpan untuk dibaca nanti
              </p>
            </div>
          </div>

          {!session?.user && (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm">
              ⚠️ Anda belum login. Bookmark di bawah adalah contoh.
              <Link href="/login" className="ml-2 underline font-semibold hover:text-amber-800">
                Masuk untuk menyimpan bookmark Anda
              </Link>
              .
            </div>
          )}
        </div>

        {/* Bookmark List */}
        {bookmarks.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <BookmarkIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Belum ada bookmark</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Simpan artikel menarik untuk dibaca nanti dengan menekan ikon bookmark di halaman artikel.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-penasakti-blue text-white font-semibold rounded-lg hover:bg-penasakti-blue/90 transition-colors"
            >
              Jelajahi Berita
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bm) => {
              const article = bm.article;
              return (
                <div
                  key={bm.id}
                  className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all"
                >
                  <Link
                    href={`/artikel/${article.slug}`}
                    className="relative w-full sm:w-52 h-36 flex-shrink-0 rounded-xl overflow-hidden bg-muted"
                  >
                    {article.featuredImage ? (
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 208px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-penasakti-blue/20 to-penasakti-red/20" />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/kategori/${article.category?.slug}`}
                          className="text-xs font-bold uppercase tracking-wider hover:underline"
                          style={{ color: article.category?.color || "#1a3a6b" }}
                        >
                          {article.category?.name}
                        </Link>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Disimpan {formatDateRelative(bm.createdAt)}
                        </span>
                      </div>
                      <button
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                        aria-label="Hapus bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <Link href={`/artikel/${article.slug}`} className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg group-hover:text-penasakti-blue transition-colors line-clamp-2 leading-snug mb-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                      )}
                    </Link>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-2">
                      {article.author?.name && (
                        <span className="font-medium text-foreground/80">
                          {article.author.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(article.viewCount || 0)}
                      </span>
                      <span>{article.readTime || 3} menit baca</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
