import { Metadata } from "next";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { BookOpen, Trash2, Clock, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDateRelative, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reading List",
  description: "Daftar bacaan pilihan yang akan Anda baca selanjutnya.",
};

const DEMO_READING_LIST = [
  {
    id: "1",
    article: {
      id: "a1",
      title: "IKN Nusantara: Menjajaki Ibu Kota Negara Masa Depan Indonesia",
      slug: "ikn-nusantara-ibu-kota-negara-masa-depan",
      excerpt: "Proyek ambisius pemindahan ibu kota negara yang akan menjadi simbol kebanggaan bangsa Indonesia.",
      featuredImage: "https://picsum.photos/seed/rl1/600/400",
      publishedAt: new Date(Date.now() - 10800000),
      viewCount: BigInt(89000),
      readTime: 7,
      category: { id: "c1", name: "Nasional", slug: "nasional", color: "#e74c3c" },
      author: { id: "au1", name: "Budi Santoso", image: null },
    },
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: "2",
    article: {
      id: "a2",
      title: "Mobil Listrik Buatan Indonesia Siap Bersaing di Pasar Global",
      slug: "mobil-listrik-buatan-indonesia-siap-bersaing",
      excerpt: "Industri otomotif nasional bertransformasi menuju era kendaraan listrik yang ramah lingkungan.",
      featuredImage: "https://picsum.photos/seed/rl2/600/400",
      publishedAt: new Date(Date.now() - 14400000),
      viewCount: BigInt(56000),
      readTime: 6,
      category: { id: "c2", name: "Otomotif", slug: "otomotif", color: "#7f8c8d" },
      author: { id: "au2", name: "Dewi Lestari", image: null },
    },
    createdAt: new Date(Date.now() - 10800000),
  },
  {
    id: "3",
    article: {
      id: "a3",
      title: "Menuju Indonesia Emas 2045: Strategi dan Tantangan",
      slug: "menuju-indonesia-emas-2045-strategi-tantangan",
      excerpt: "Pandangan 20 tahun ke depan tentang visi Indonesia menjadi negara maju pada 100 tahun kemerdekaan.",
      featuredImage: "https://picsum.photos/seed/rl3/600/400",
      publishedAt: new Date(Date.now() - 86400000),
      viewCount: BigInt(145000),
      readTime: 8,
      category: { id: "c3", name: "Opini", slug: "opini", color: "#34495e" },
      author: { id: "au3", name: "Prof. Dr. Sutarno", image: null },
    },
    createdAt: new Date(Date.now() - 86400000),
  },
];

export default async function ReadingListPage() {
  const session = await getServerSession(authOptions);
  let readingList = DEMO_READING_LIST as unknown as Array<{
    id: string;
    article: any;
    createdAt: Date;
  }>;

  if (session?.user) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const result = await prisma.readingList.findMany({
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
      if (result.length > 0) readingList = result as any;
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
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black font-heading">
                <span className="text-emerald-600 dark:text-emerald-400">Reading List</span>
              </h1>
              <p className="text-muted-foreground text-sm">
                Daftar bacaan pilihan yang akan Anda nikmati
              </p>
            </div>
          </div>

          {!session?.user && (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm">
              ⚠️ Anda belum login. Reading list di bawah adalah contoh.
              <Link href="/login" className="ml-2 underline font-semibold hover:text-amber-800">
                Masuk untuk kelola reading list Anda
              </Link>
              .
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-xs text-muted-foreground mb-1">Total Bacaan</p>
            <p className="text-2xl font-bold text-penasakti-blue">{readingList.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-xs text-muted-foreground mb-1">Total Estimasi Waktu</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {readingList.reduce((acc, item) => acc + (item.article.readTime || 3), 0)} menit
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-xs text-muted-foreground mb-1">Kategori Berbeda</p>
            <p className="text-2xl font-bold text-penasakti-gold">
              {new Set(readingList.map((i) => i.article.category?.id)).size}
            </p>
          </div>
        </div>

        {/* Reading List */}
        {readingList.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Reading list kosong</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Tambahkan artikel menarik ke reading list untuk dibaca ketika Anda punya waktu luang.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Temukan Bacaan
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {readingList.map((item, index) => {
              const article = item.article;
              return (
                <div
                  key={item.id}
                  className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all"
                >
                  {/* Number */}
                  <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-penasakti-blue/10 text-penasakti-blue font-bold flex-shrink-0 self-center">
                    {index + 1}
                  </div>

                  <Link
                    href={`/artikel/${article.slug}`}
                    className="relative w-full sm:w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-muted"
                  >
                    {article.featuredImage ? (
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 192px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-penasakti-blue/20" />
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
                          Ditambahkan {formatDateRelative(item.createdAt)}
                        </span>
                      </div>
                      <button
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                        aria-label="Hapus dari reading list"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <Link href={`/artikel/${article.slug}`} className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-2">
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
