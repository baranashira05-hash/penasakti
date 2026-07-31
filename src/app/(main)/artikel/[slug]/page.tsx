import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Eye, User, ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import Breadcrumb from "@/components/shared/Breadcrumb";
import AdBanner from "@/components/shared/AdBanner";
import ArticleImage from "@/components/shared/ArticleImage";
import ArticleShare from "@/components/article/ArticleShare";

// Halaman dirender secara dynamic agar selalu fresh
// Crawler Google akan tetap bisa mengindeks karena ISR diaktifkan di bawah
export const revalidate = 300; // revalidate setiap 5 menit

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://penasakti.com";

interface Props {
  params: Promise<{ slug: string }>;
}

// Pre-render 200 artikel terpopuler saat build untuk kecepatan akses Google
export async function generateStaticParams() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
      orderBy: [{ isFeatured: "desc" }, { viewCount: "desc" }],
      take: 200,
    });
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      select: {
        title: true, excerpt: true, metaTitle: true, metaDesc: true,
        ogImage: true, featuredImage: true, publishedAt: true, updatedAt: true,
        author: { select: { name: true } },
        category: { select: { name: true } },
        tags: { select: { tag: { select: { name: true } } } },
      },
    });

    if (!article) return { title: "Artikel Tidak Ditemukan" };

    const title = article.metaTitle || article.title;
    const description = article.metaDesc || article.excerpt || "";
    const image = article.ogImage || article.featuredImage;
    const keywords = article.tags.map(t => t.tag.name);

    return {
      title,
      description,
      keywords: keywords.length > 0 ? keywords : undefined,
      authors: article.author?.name ? [{ name: article.author.name }] : undefined,
      openGraph: {
        title,
        description,
        images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
        type: "article",
        publishedTime: article.publishedAt?.toISOString(),
        modifiedTime: article.updatedAt?.toISOString(),
        authors: article.author?.name ? [article.author.name] : undefined,
        section: article.category?.name,
        tags: keywords,
        siteName: "PenaSakti",
        locale: "id_ID",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : undefined,
        site: "@penasakti",
      },
      alternates: {
        canonical: `${BASE_URL}/artikel/${slug}`,
      },
      robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    };
  } catch {
    return { title: "Artikel" };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article;
  try {
    article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true, color: true } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
      },
    });
  } catch {
    article = null;
  }

  if (!article) notFound();

  // Increment views
  try {
    await prisma.article.update({ where: { slug }, data: { viewCount: { increment: 1 } } });
  } catch {}

  const articleUrl = `${BASE_URL}/artikel/${slug}`;
  const imageUrl = article.featuredImage || `${BASE_URL}/logo-penasakti.png`;

  // Hitung word count dari konten (stripped HTML)
  const plainText = article.content.replace(/<[^>]+>/g, " ").trim();
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  // JSON-LD NewsArticle schema untuk Google News & Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.excerpt || article.metaDesc || "",
    "url": articleUrl,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    "datePublished": article.publishedAt?.toISOString() || article.createdAt.toISOString(),
    "dateModified": article.updatedAt?.toISOString() || article.publishedAt?.toISOString() || article.createdAt.toISOString(),
    "author": {
      "@type": "Person",
      "name": article.author?.name || "Redaksi PenaSakti",
      "url": article.author?.name ? `${BASE_URL}/penulis/${article.author.name.toLowerCase().replace(/\s+/g, "-")}` : BASE_URL,
    },
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "PenaSakti",
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo-penasakti.png`,
        "width": 200,
        "height": 60,
      },
      "sameAs": [
        "https://twitter.com/penasakti",
        "https://www.facebook.com/penasakti",
        "https://www.instagram.com/penasakti",
      ],
    },
    "image": {
      "@type": "ImageObject",
      "url": imageUrl,
      "width": 1200,
      "height": 630,
    },
    "articleSection": article.category?.name || "Berita",
    "keywords": article.tags?.map(({ tag }) => tag.name).join(", ") || "",
    "inLanguage": "id-ID",
    "isAccessibleForFree": true,
    "wordCount": wordCount,
    ...(article.isBreaking && { "genre": "Breaking News" }),
  };

  // JSON-LD BreadcrumbList
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Beranda", "item": BASE_URL },
      { "@type": "ListItem", "position": 2, "name": article.category?.name || "Berita", "item": `${BASE_URL}/kategori/${article.category?.slug || "berita"}` },
      { "@type": "ListItem", "position": 3, "name": article.title, "item": articleUrl },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: article.category?.name || "Berita", href: `/kategori/${article.category?.slug || "berita"}` },
          { label: article.title.substring(0, 40) + "..." },
        ]}
      />

      <article className="max-w-4xl mx-auto mt-6">
        {/* Category */}
        {article.category && (
          <Link
            href={`/kategori/${article.category.slug}`}
            className="inline-block text-xs font-bold uppercase tracking-wider mb-3 px-3 py-1 rounded"
            style={{ color: article.category.color || "#2563eb", backgroundColor: (article.category.color || "#2563eb") + "15" }}
          >
            {article.category.name}
          </Link>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
          {article.author && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{article.author.name}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {article.publishedAt?.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {Number(article.viewCount || 0).toLocaleString()} views
          </span>
          {article.readTime && <span>{article.readTime} menit baca</span>}
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <figure className="mb-8">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800">
              <ArticleImage
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
                category={article.category?.slug}
              />
            </div>
          </figure>
        )}

        <AdBanner position="IN_ARTICLE" className="mb-6" />

        {/* Content */}
        <div className="article-content prose prose-lg max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.content }} />

        {/* Share */}
        <ArticleShare url={articleUrl} title={article.title} />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tags:</span>
            {article.tags.map(({ tag }) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`} className="px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors">
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        <AdBanner position="FOOTER" className="mt-8" />

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
      </article>
    </div>
  );
}
