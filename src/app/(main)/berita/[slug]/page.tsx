import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, User, ArrowLeft } from "lucide-react";
import { getPostBySlug, getFeaturedImage, getAuthor, cleanContent, getYoastMeta } from "@/lib/wordpress";
import Breadcrumb from "@/components/shared/Breadcrumb";
import AdBanner from "@/components/shared/AdBanner";
import { getImageUrl } from "@/lib/utils";
import { SITE_URL } from "@/lib/site-url";

// ISR: revalidate setiap 10 menit agar berita WordPress selalu fresh
export const revalidate = 600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Selalu gunakan SITE_URL (www) agar tidak kena redirect 308 saat crawler fetch
  const APP_URL = SITE_URL;

  try {
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Artikel Tidak Ditemukan" };

    const meta = getYoastMeta(post);
    const featuredImage = getFeaturedImage(post);

    // Ambil URL gambar asli (masih bisa http://cdn.penasakti.com)
    const rawImageUrl = meta.ogImage || (featuredImage ? getImageUrl(featuredImage) : null);

    // Bangun URL dynamic OG image via /api/og agar:
    // 1. Selalu HTTPS (tidak ada masalah mixed content di crawler)
    // 2. Gambar di-render server-side, pasti muncul di WhatsApp/FB/Telegram
    // 3. Fallback ke gradient jika gambar asli tidak ada
    const ogParams = new URLSearchParams({
      title: meta.metaTitle.slice(0, 100),
      category: "Berita",
      author: "Redaksi PenaSakti",
      ...(meta.metaDesc && { excerpt: meta.metaDesc.slice(0, 130) }),
      ...(rawImageUrl && { image: rawImageUrl }),
    });
    const ogImageUrl = `${APP_URL}/api/og?${ogParams.toString()}`;

    return {
      title: meta.metaTitle,
      description: meta.metaDesc,
      alternates: {
        canonical: meta.canonical || `${APP_URL}/berita/${slug}`,
      },
      openGraph: {
        title: meta.metaTitle,
        description: meta.metaDesc,
        url: `${APP_URL}/berita/${slug}`,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: meta.metaTitle }],
        type: "article",
        publishedTime: post.date,
        modifiedTime: post.modified,
        siteName: "PenaSakti",
        locale: "id_ID",
      },
      twitter: {
        card: "summary_large_image",
        title: meta.metaTitle,
        description: meta.metaDesc,
        images: [ogImageUrl],
        site: "@penasakti",
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

export default async function BeritaPage({ params }: Props) {
  const { slug } = await params;

  // Gunakan SITE_URL (www) untuk konsistensi canonical & JSON-LD
  const APP_URL = SITE_URL;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    // WordPress API not reachable
    post = null;
  }

  if (!post) notFound();

  const featuredImage = getFeaturedImage(post);
  const author = getAuthor(post);
  const content = cleanContent(post.content.rendered);
  const meta = getYoastMeta(post);
  const articleUrl = `${APP_URL}/berita/${slug}`;
  const imageUrl = meta.ogImage || (featuredImage ? getImageUrl(featuredImage) : null);

  // JSON-LD NewsArticle
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title.rendered.replace(/<[^>]+>/g, ""),
    "description": meta.metaDesc || post.excerpt.rendered.replace(/<[^>]+>/g, "").trim(),
    "url": articleUrl,
    "mainEntityOfPage": { "@type": "WebPage", "@id": articleUrl },
    "datePublished": post.date,
    "dateModified": post.modified || post.date,
    "author": {
      "@type": "Person",
      "name": author?.name || "Redaksi PenaSakti",
    },
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "PenaSakti",
      "url": APP_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${APP_URL}/logo-penasakti.png`,
        "width": 200,
        "height": 60,
      },
    },
    ...(imageUrl && {
      "image": {
        "@type": "ImageObject",
        "url": imageUrl,
        "width": 1200,
        "height": 630,
      },
    }),
    "inLanguage": "id-ID",
    "isAccessibleForFree": true,
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Berita", href: "#" },
          { label: post.title.rendered.replace(/<[^>]+>/g, "").substring(0, 50) + "..." },
        ]}
      />

      <article className="max-w-4xl mx-auto mt-6">
        {/* Title */}
        <h1
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
          {author && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{author.name}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {new Date(post.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        {/* Featured Image */}
        {featuredImage && (
          <figure className="mb-8">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800">
              <Image
                src={getImageUrl(featuredImage)!}
                alt={post.title.rendered}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
              />
            </div>
          </figure>
        )}

        <AdBanner position="IN_ARTICLE" className="mb-6" />

        {/* Content */}
        <div
          className="article-content prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Bottom Ad */}
        <AdBanner position="FOOTER" className="mt-8" />

        {/* Back */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
      </article>
    </div>
  );
}
