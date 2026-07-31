import { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/article/ArticleCard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import AdBanner from "@/components/shared/AdBanner";
import prisma from "@/lib/prisma";
import { CATEGORIES } from "@/lib/utils";
import { SITE_URL } from "@/lib/site-url";
import type { ArticleWithRelations } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

// ISR: revalidate setiap 1 menit untuk kategori
export const revalidate = 60;

export async function generateStaticParams() {
  // Pre-render semua halaman kategori saat build
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const BASE_URL = SITE_URL;

  // Coba ambil dari database dulu
  let catName = slug.charAt(0).toUpperCase() + slug.slice(1);
  let catDesc = `Baca berita ${catName} terbaru, terpercaya, dan terupdate hanya di PenaSakti - portal berita nasional Indonesia.`;

  try {
    const dbCat = await prisma.category.findFirst({ where: { slug } });
    if (dbCat) {
      catName = dbCat.name;
      catDesc = dbCat.metaDesc || dbCat.description || catDesc;
    } else {
      const staticCat = CATEGORIES.find((c) => c.slug === slug);
      if (!staticCat) return { title: "Kategori Tidak Ditemukan" };
      catName = staticCat.name;
    }
  } catch {
    const staticCat = CATEGORIES.find((c) => c.slug === slug);
    if (!staticCat) return { title: "Kategori Tidak Ditemukan" };
    catName = staticCat.name;
  }

  return {
    title: `Berita ${catName} Terkini | PenaSakti`,
    description: catDesc,
    alternates: { canonical: `${BASE_URL}/kategori/${slug}` },
    openGraph: {
      title: `Berita ${catName} Terkini | PenaSakti`,
      description: catDesc,
      type: "website",
      locale: "id_ID",
      siteName: "PenaSakti",
      url: `${BASE_URL}/kategori/${slug}`,
      images: [
        {
          url: `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `Berita ${catName} Terkini - PenaSakti`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Berita ${catName} Terkini | PenaSakti`,
      description: catDesc,
      images: [`${BASE_URL}/og-image.jpg`],
      site: "@penasakti",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function generateDemoArticles(slug: string): ArticleWithRelations[] {
  const catName = slug.charAt(0).toUpperCase() + slug.slice(1);
  return Array.from({ length: 9 }, (_, i) => ({
    id: `${slug}-${i}`,
    title: `Berita ${catName} Terkini: Perkembangan Situasi ${i + 1} yang Perlu Anda Ketahui`,
    slug: `${slug}-artikel-${i + 1}`,
    excerpt:
      "Ringkasan artikel yang akan ditampilkan di halaman kategori dengan informasi penting.",
    content: "",
    featuredImage: `https://picsum.photos/seed/${slug}${i}/600/400`,
    featuredImageAlt: null,
    status: "PUBLISHED" as const,
    isBreaking: i === 0,
    isFeatured: false,
    isEditorChoice: false,
    isPremium: false,
    isSponsored: false,
    allowComments: true,
    metaTitle: null,
    metaDesc: null,
    metaKeywords: null,
    canonicalUrl: null,
    ogImage: null,
    ogTitle: null,
    ogDesc: null,
    viewCount: BigInt(Math.floor(Math.random() * 100000)),
    shareCount: 0,
    likeCount: 0,
    commentCount: Math.floor(Math.random() * 50),
    readTime: Math.floor(Math.random() * 8) + 2,
    publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 3600000),
    scheduledAt: null,
    authorId: "1",
    editorId: null,
    categoryId: slug,
    source: null,
    sourceUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: slug, name: catName, slug, color: "#1a3a6b" } as ArticleWithRelations["category"],
    author: { id: "1", name: "Redaksi PenaSakti", image: null } as ArticleWithRelations["author"],
    editor: null,
    tags: [],
    _count: { comments: Math.floor(Math.random() * 50) },
  }));
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1"));
  const LIMIT = 9;

  // Cari kategori di database atau fallback ke static
  let cat: { name: string; slug: string; color: string; description?: string | null } | null = null;
  try {
    const dbCat = await prisma.category.findFirst({ where: { slug, isActive: true } });
    if (dbCat) {
      cat = { name: dbCat.name, slug: dbCat.slug, color: dbCat.color || "#1a3a6b", description: dbCat.description };
    }
  } catch {}

  if (!cat) {
    const staticCat = CATEGORIES.find((c) => c.slug === slug);
    if (!staticCat) notFound();
    cat = staticCat;
  }

  // Ambil artikel dari database langsung (lebih cepat dan reliable)
  let articles: ArticleWithRelations[] = [];
  try {
    const dbArticles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        category: { slug },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * LIMIT,
      take: LIMIT,
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true, color: true } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } }, take: 3 },
      },
    });

    articles = dbArticles.map((a) => ({
      ...a,
      viewCount: Number(a.viewCount),
      shareCount: Number(a.shareCount),
      likeCount: Number(a.likeCount),
      _count: { comments: a.commentCount },
    })) as ArticleWithRelations[];
  } catch {}

  if (articles.length === 0) {
    articles = generateDemoArticles(slug);
  }

  const BASE_URL = SITE_URL;

  // JSON-LD CollectionPage untuk halaman kategori
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Berita ${cat.name} Terkini`,
    "description": `Baca berita ${cat.name.toLowerCase()} terbaru dan terpercaya`,
    "url": `${BASE_URL}/kategori/${slug}`,
    "inLanguage": "id-ID",
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "PenaSakti",
      "url": BASE_URL,
    },
  };

  return (
    <>
      {/* JSON-LD CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      {/* Category Header */}
      <div
        className="py-10 px-4 text-white"
        style={{
          background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}99 100%)`,
        }}
      >
        <div className="container mx-auto">
          <Breadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: cat.name },
            ]}
          />
          <div className="mt-4">
            <h1 className="text-4xl font-black mb-2">{cat.name}</h1>
            <p className="text-white/70">
              {cat.description || `Baca berita ${cat.name.toLowerCase()} terkini, terupdate, dan terpercaya`}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <AdBanner position="HEADER" className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="vertical" />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-10">
          {page > 1 && (
            <a
              href={`/kategori/${slug}?page=${page - 1}`}
              className="px-4 h-10 rounded-xl border border-border flex items-center text-sm font-medium hover:bg-muted transition-colors"
            >
              ← Sebelumnya
            </a>
          )}
          {[1, 2, 3, 4, 5].map((p) => (
            <a
              key={p}
              href={`/kategori/${slug}?page=${p}`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${
                p === page
                  ? "bg-penasakti-blue text-white"
                  : "border border-border hover:bg-muted"
              }`}
            >
              {p}
            </a>
          ))}
          <a
            href={`/kategori/${slug}?page=${page + 1}`}
            className="px-4 h-10 rounded-xl border border-border flex items-center text-sm font-medium hover:bg-muted transition-colors"
          >
            Berikutnya →
          </a>
        </div>
      </div>
    </>
  );
}
