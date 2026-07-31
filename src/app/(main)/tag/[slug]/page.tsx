import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Tag } from "lucide-react";
import ArticleCard from "@/components/article/ArticleCard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import AdBanner from "@/components/shared/AdBanner";
import { SITE_URL } from "@/lib/site-url";
import type { ArticleWithRelations } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getTagData(slug: string, page: number) {
  try {
    const base = SITE_URL;
    const res = await fetch(
      `${base}/api/articles?tag=${slug}&status=PUBLISHED&limit=12&page=${page}`,
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      const data = await res.json();
      return { articles: data.data ?? [], meta: data.meta };
    }
  } catch {
    // fallback
  }
  return { articles: [], meta: { total: 0, totalPages: 1 } };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const BASE_URL = SITE_URL;
  const tagName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const title = `#${tagName} - Berita & Artikel Terkini | PenaSakti`;
  const description = `Kumpulan berita dan artikel terbaru tentang ${tagName}. Baca informasi terkini, terpercaya, dan berimbang hanya di PenaSakti.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/tag/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/tag/${slug}`,
      type: "website",
      locale: "id_ID",
      siteName: "PenaSakti",
      images: [
        {
          url: `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${title} - PenaSakti`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og-image.jpg`],
      site: "@penasakti",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1");
  const tagName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const { articles, meta } = await getTagData(slug, page);

  // demo fallback
  const displayArticles: ArticleWithRelations[] =
    articles.length > 0
      ? articles
      : Array.from({ length: 9 }, (_, i) => ({
          id: `tag-${slug}-${i}`,
          title: `Artikel tentang ${tagName}: Informasi Terbaru ${i + 1}`,
          slug: `artikel-${slug}-${i + 1}`,
          excerpt: "Informasi terkini dan terpercaya mengenai topik ini.",
          content: "",
          featuredImage: `https://picsum.photos/seed/tag${slug}${i}/600/400`,
          featuredImageAlt: null,
          status: "PUBLISHED" as const,
          isBreaking: false,
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
          viewCount: BigInt(Math.floor(Math.random() * 50000)),
          shareCount: 0,
          likeCount: 0,
          commentCount: 0,
          readTime: Math.floor(Math.random() * 6) + 2,
          publishedAt: new Date(Date.now() - Math.random() * 7 * 86400000),
          scheduledAt: null,
          authorId: "1",
          editorId: null,
          categoryId: "nasional",
          source: null,
          sourceUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          category: { id: "nasional", name: "Nasional", slug: "nasional", color: "#e74c3c" },
          author: { id: "1", name: "Redaksi PenaSakti", image: null },
          editor: null,
          tags: [{ tag: { id: slug, name: tagName, slug } }],
          _count: { comments: 0 },
        }));

  const totalPages = meta?.totalPages || 1;
  const BASE_URL = SITE_URL;
  const tagUrl = `${BASE_URL}/tag/${slug}`;

  // JSON-LD CollectionPage untuk halaman tag
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `#${tagName}`,
    "description": `Kumpulan berita dan artikel terkait ${tagName}`,
    "url": tagUrl,
    "inLanguage": "id-ID",
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "PenaSakti",
      "url": BASE_URL,
    },
  };

  // JSON-LD BreadcrumbList
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Beranda", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Tag", "item": `${BASE_URL}/tag` },
      { "@type": "ListItem", "position": 3, "name": `#${tagName}`, "item": tagUrl },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Tag Header */}
      <div className="bg-gradient-to-br from-penasakti-blue to-penasakti-blue/80 py-10 px-4 text-white">
        <div className="container mx-auto">
          <Breadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: "Tag", href: "#" },
              { label: tagName },
            ]}
          />
          <div className="mt-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black">#{tagName}</h1>
              <p className="text-white/70 text-sm mt-0.5">
                {meta?.total
                  ? `${meta.total} artikel ditemukan`
                  : "Kumpulan berita dan artikel terkait"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <AdBanner position="HEADER" className="mb-8" />

        {displayArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="vertical" />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏷️</p>
            <h2 className="text-xl font-bold mb-2">Belum ada artikel</h2>
            <p className="text-muted-foreground">
              Belum ada artikel dengan tag #{tagName} saat ini.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block px-6 py-2.5 bg-penasakti-blue text-white rounded-xl font-semibold hover:bg-penasakti-blue/90 transition-colors text-sm"
            >
              Kembali ke Beranda
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {page > 1 && (
              <Link
                href={`/tag/${slug}?page=${page - 1}`}
                className="px-4 h-10 rounded-xl border border-border flex items-center text-sm font-medium hover:bg-muted transition-colors"
              >
                ← Sebelumnya
              </Link>
            )}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/tag/${slug}?page=${p}`}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-penasakti-blue text-white"
                    : "border border-border hover:bg-muted"
                }`}
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={`/tag/${slug}?page=${page + 1}`}
                className="px-4 h-10 rounded-xl border border-border flex items-center text-sm font-medium hover:bg-muted transition-colors"
              >
                Berikutnya →
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
