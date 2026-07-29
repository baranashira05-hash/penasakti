import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, User, ArrowLeft } from "lucide-react";
import { getPostBySlug, getFeaturedImage, getAuthor, cleanContent, getYoastMeta } from "@/lib/wordpress";
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
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Artikel Tidak Ditemukan" };

    const meta = getYoastMeta(post);
    return {
      title: meta.metaTitle,
      description: meta.metaDesc,
      openGraph: {
        title: meta.metaTitle,
        description: meta.metaDesc,
        images: meta.ogImage ? [{ url: meta.ogImage }] : [],
        type: "article",
        publishedTime: post.date,
      },
      alternates: { canonical: meta.canonical || `/berita/${slug}` },
    };
  } catch {
    return { title: "Artikel" };
  }
}

export default async function BeritaPage({ params }: Props) {
  const { slug } = await params;

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

  return (
    <div className="container mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Berita", href: "#" },
          { label: post.title.rendered.substring(0, 50) + "..." },
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
