import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Share2,
  Camera,
  Globe,
  FileText,
  Eye,
  Calendar,
} from "lucide-react";
import ArticleCard from "@/components/article/ArticleCard";
import Breadcrumb from "@/components/shared/Breadcrumb";
import AdBanner from "@/components/shared/AdBanner";
import { formatDate, formatNumber } from "@/lib/utils";
import type { ArticleWithRelations } from "@/types";

interface AuthorProfile {
  id: string;
  slug: string;
  displayName: string;
  bio: string | null;
  avatar: string | null;
  coverImage: string | null;
  expertise: string[];
  totalArticles: number;
  totalViews: bigint | number;
  isVerified: boolean;
  createdAt: string | Date;
  user: {
    name: string | null;
    email: string;
    twitter: string | null;
    instagram: string | null;
    facebook: string | null;
    website: string | null;
  };
}

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const DEMO_AUTHOR: AuthorProfile = {
  id: "1",
  slug: "ahmad-fauzi",
  displayName: "Ahmad Fauzi",
  bio: "Jurnalis senior PenaSakti dengan pengalaman lebih dari 10 tahun meliput isu-isu politik dan ekonomi nasional. Lulusan Universitas Indonesia Jurusan Komunikasi.",
  avatar: "https://picsum.photos/seed/author1/200/200",
  coverImage: "https://picsum.photos/seed/authorbg/1200/400",
  expertise: ["Politik", "Ekonomi", "Hukum"],
  totalArticles: 1240,
  totalViews: 8500000,
  isVerified: true,
  createdAt: new Date("2018-01-15"),
  user: {
    name: "Ahmad Fauzi",
    email: "ahmad@penasakti.com",
    twitter: "ahmadfauzi",
    instagram: "ahmadfauzi_news",
    facebook: null,
    website: null,
  },
};

async function getAuthorData(slug: string) {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/authors/${slug}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data || null;
    }
  } catch {
    // fallback
  }
  return null;
}

async function getAuthorArticles(slug: string, page: number) {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(
      `${base}/api/articles?author=${slug}&status=PUBLISHED&limit=9&page=${page}`,
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
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://penasakti.com";
  const author = await getAuthorData(slug);
  const displayName =
    author?.displayName ||
    slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  const title = `${displayName} - Profil Jurnalis | PenaSakti`;
  const description =
    author?.bio ||
    `Baca semua artikel dari ${displayName} di PenaSakti - portal berita nasional terpercaya Indonesia.`;
  const avatar = author?.avatar || null;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/penulis/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/penulis/${slug}`,
      type: "profile",
      locale: "id_ID",
      siteName: "PenaSakti",
      images: avatar ? [{ url: avatar, width: 400, height: 400, alt: displayName }] : [],
    },
    twitter: {
      card: "summary",
      title,
      description,
      site: "@penasakti",
      images: avatar ? [avatar] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function generateDemoArticles(slug: string): ArticleWithRelations[] {
  return Array.from({ length: 9 }, (_, i) => ({
    id: `author-${slug}-${i}`,
    title: `Laporan Eksklusif: Situasi Terkini ${i + 1}`,
    slug: `laporan-eksklusif-${i + 1}`,
    excerpt: "Laporan mendalam dari jurnalis lapangan kami.",
    content: "",
    featuredImage: `https://picsum.photos/seed/pa${i}/600/400`,
    featuredImageAlt: null,
    status: "PUBLISHED" as const,
    isBreaking: false,
    isFeatured: i === 0,
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
    viewCount: BigInt(Math.floor(Math.random() * 80000)),
    shareCount: 0,
    likeCount: 0,
    commentCount: Math.floor(Math.random() * 30),
    readTime: Math.floor(Math.random() * 7) + 2,
    publishedAt: new Date(Date.now() - Math.random() * 30 * 86400000),
    scheduledAt: null,
    authorId: "1",
    editorId: null,
    categoryId: "nasional",
    source: null,
    sourceUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: "nasional", name: "Nasional", slug: "nasional", color: "#e74c3c" },
    author: { id: "1", name: "Ahmad Fauzi", image: DEMO_AUTHOR.avatar },
    editor: null,
    tags: [],
    _count: { comments: Math.floor(Math.random() * 30) },
  }));
}

export default async function AuthorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1");

  const author: AuthorProfile = (await getAuthorData(slug)) || (slug === "ahmad-fauzi" ? DEMO_AUTHOR : null);
  if (!author && slug !== "ahmad-fauzi") notFound();
  const displayAuthor = author || DEMO_AUTHOR;

  const { articles, meta } = await getAuthorArticles(slug, page);
  const displayArticles: ArticleWithRelations[] =
    articles.length > 0 ? articles : generateDemoArticles(slug);

  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://penasakti.com";
  const authorUrl = `${BASE_URL}/penulis/${slug}`;

  // JSON-LD Person schema
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": displayAuthor.displayName,
    "url": authorUrl,
    "description": displayAuthor.bio || undefined,
    "image": displayAuthor.avatar || undefined,
    "jobTitle": "Jurnalis",
    "worksFor": {
      "@type": "NewsMediaOrganization",
      "name": "PenaSakti",
      "url": BASE_URL,
    },
    ...(displayAuthor.user.twitter && {
      "sameAs": [`https://twitter.com/${displayAuthor.user.twitter}`],
    }),
  };

  // JSON-LD BreadcrumbList
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Beranda", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": "Penulis", "item": `${BASE_URL}/penulis` },
      { "@type": "ListItem", "position": 3, "name": displayAuthor.displayName, "item": authorUrl },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Cover */}
      <div className="relative h-48 bg-gradient-to-br from-penasakti-blue to-penasakti-blue/80">
        {displayAuthor.coverImage && (
          <Image
            src={displayAuthor.coverImage}
            alt="Cover"
            fill
            className="object-cover opacity-30"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        {/* Author Info Card */}
        <div className="relative -mt-16 mb-8">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {displayAuthor.avatar ? (
                  <Image
                    src={displayAuthor.avatar}
                    alt={displayAuthor.displayName}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-card"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-penasakti-blue/20 flex items-center justify-center ring-4 ring-card">
                    <span className="text-3xl font-bold text-penasakti-blue">
                      {displayAuthor.displayName[0]}
                    </span>
                  </div>
                )}
                {displayAuthor.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-penasakti-blue rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-black flex items-center gap-2">
                      {displayAuthor.displayName}
                      {displayAuthor.isVerified && (
                        <span className="text-xs font-normal text-penasakti-blue bg-penasakti-blue/10 px-2 py-0.5 rounded-full">
                          Terverifikasi
                        </span>
                      )}
                    </h1>
                    {displayAuthor.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {displayAuthor.expertise.map((exp) => (
                          <span
                            key={exp}
                            className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center gap-2">
                    {displayAuthor.user.twitter && (
                      <a
                        href={`https://twitter.com/${displayAuthor.user.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Share2 className="w-4 h-4" />
                      </a>
                    )}
                    {displayAuthor.user.instagram && (
                      <a
                        href={`https://instagram.com/${displayAuthor.user.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Camera className="w-4 h-4" />
                      </a>
                    )}
                    {displayAuthor.user.website && (
                      <a
                        href={displayAuthor.user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {displayAuthor.bio && (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {displayAuthor.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="flex flex-wrap gap-5 mt-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-penasakti-blue" />
                    <span className="font-bold">{displayAuthor.totalArticles.toLocaleString()}</span>
                    <span className="text-muted-foreground">artikel</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-penasakti-blue" />
                    <span className="font-bold">{formatNumber(displayAuthor.totalViews as number)}</span>
                    <span className="text-muted-foreground">pembaca</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-penasakti-blue" />
                    <span className="text-muted-foreground">
                      Bergabung {formatDate(displayAuthor.createdAt, "MMMM yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Penulis", href: "/penulis" },
            { label: displayAuthor.displayName },
          ]}
        />
        <div className="mb-6" />

        <AdBanner position="HEADER" className="mb-8" />

        {/* Articles Grid */}
        <h2 className="text-xl font-bold mb-5">
          Artikel oleh {displayAuthor.displayName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="vertical" />
          ))}
        </div>

        {/* Pagination */}
        {(meta?.totalPages || 1) > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {page > 1 && (
              <Link
                href={`/penulis/${slug}?page=${page - 1}`}
                className="px-4 h-10 rounded-xl border border-border flex items-center text-sm font-medium hover:bg-muted transition-colors"
              >
                ← Sebelumnya
              </Link>
            )}
            {Array.from(
              { length: Math.min(meta?.totalPages || 1, 5) },
              (_, i) => i + 1
            ).map((p) => (
              <Link
                key={p}
                href={`/penulis/${slug}?page=${p}`}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-penasakti-blue text-white"
                    : "border border-border hover:bg-muted"
                }`}
              >
                {p}
              </Link>
            ))}
            {page < (meta?.totalPages || 1) && (
              <Link
                href={`/penulis/${slug}?page=${page + 1}`}
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
