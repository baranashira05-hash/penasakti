import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, User, ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import Breadcrumb from "@/components/shared/Breadcrumb";
import AdBanner from "@/components/shared/AdBanner";
import { getImageUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { title: true, excerpt: true, metaTitle: true, metaDesc: true, ogImage: true, featuredImage: true, publishedAt: true },
    });

    if (!article) return { title: "Artikel Tidak Ditemukan" };

    return {
      title: article.metaTitle || article.title,
      description: article.metaDesc || article.excerpt || "",
      openGraph: {
        title: article.metaTitle || article.title,
        description: article.metaDesc || article.excerpt || "",
        images: article.ogImage || article.featuredImage ? [{ url: (article.ogImage || article.featuredImage)! }] : [],
        type: "article",
        publishedTime: article.publishedAt?.toISOString(),
      },
      alternates: { canonical: `/artikel/${slug}` },
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

  return (
    <div className="container mx-auto px-4 py-6">
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
              <Image src={getImageUrl(article.featuredImage)!} alt={article.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 900px" />
            </div>
          </figure>
        )}

        <AdBanner position="IN_ARTICLE" className="mb-6" />

        {/* Content */}
        <div className="article-content prose prose-lg max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: article.content }} />

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
