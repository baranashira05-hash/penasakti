import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Share2, BookOpen } from "lucide-react";
import { formatDate, formatDateRelative, formatNumber } from "@/lib/utils";
import ArticleContent from "@/components/article/ArticleContent";
import ArticleShare from "@/components/article/ArticleShare";
import ArticleSidebar from "@/components/article/ArticleSidebar";
import CommentSection from "@/components/article/CommentSection";
import RelatedArticles from "@/components/article/RelatedArticles";
import ArticleToolbar from "@/components/article/ArticleToolbar";
import Breadcrumb from "@/components/shared/Breadcrumb";
import AdBanner from "@/components/shared/AdBanner";

// Demo article for development
const DEMO_ARTICLE = {
  id: "demo-1",
  title: "Presiden Umumkan Paket Stimulus Ekonomi Rp 500 Triliun untuk Pemulihan Nasional",
  slug: "presiden-umumkan-paket-stimulus-ekonomi",
  excerpt: "Pemerintah menggelontorkan stimulus besar-besaran untuk mendorong pertumbuhan ekonomi nasional yang ditargetkan mencapai 6% pada tahun ini.",
  content: `
    <p>JAKARTA - Presiden Republik Indonesia resmi mengumumkan paket stimulus ekonomi senilai Rp 500 triliun dalam konferensi pers di Istana Negara, Senin (28/7/2026). Paket stimulus ini merupakan yang terbesar sepanjang sejarah Indonesia dan dirancang untuk mendorong pertumbuhan ekonomi nasional.</p>

    <p>"Kami berkomitmen untuk memastikan pertumbuhan ekonomi Indonesia mencapai target 6 persen pada tahun ini. Paket stimulus ini akan menjadi katalisator yang kuat," ujar Presiden dalam pernyataannya.</p>

    <h2>Fokus Stimulus Ekonomi</h2>

    <p>Paket stimulus ini terbagi dalam beberapa komponen utama:</p>

    <ul>
      <li>Rp 150 triliun untuk infrastruktur digital dan konektivitas</li>
      <li>Rp 120 triliun untuk industri manufaktur dan hilirisasi</li>
      <li>Rp 100 triliun untuk ketahanan pangan dan pertanian</li>
      <li>Rp 80 triliun untuk energi terbarukan dan transisi energi</li>
      <li>Rp 50 triliun untuk program perlindungan sosial</li>
    </ul>

    <h2>Respons Pasar</h2>

    <p>Pasar keuangan menyambut positif pengumuman ini. Indeks Harga Saham Gabungan (IHSG) menguat 1,8 persen ke level 8.750 tak lama setelah pengumuman tersebut. Rupiah juga menguat ke posisi Rp 15.100 per dolar AS.</p>

    <blockquote>
      "Ini adalah langkah berani dan tepat waktu. Paket stimulus ini akan memberikan dorongan signifikan bagi perekonomian Indonesia, terutama dalam mendorong investasi dan penciptaan lapangan kerja," kata Kepala BPS dalam keterangannya.
    </blockquote>

    <h2>Implementasi Bertahap</h2>

    <p>Pemerintah menyatakan paket stimulus ini akan diimplementasikan secara bertahap selama 18 bulan ke depan. Tim khusus telah dibentuk untuk memantau realisasi dan dampak setiap komponen stimulus.</p>

    <p>Bank Indonesia juga mendukung kebijakan ini dengan memastikan kondisi likuiditas yang memadai. Gubernur BI menyatakan siap untuk mengambil langkah-langkah yang diperlukan untuk mendukung pemulihan ekonomi.</p>

    <p>Sejumlah ekonom menilai paket stimulus ini cukup komprehensif dan realistis. Namun, mereka juga mengingatkan pentingnya transparansi dan akuntabilitas dalam pengelolaan anggaran sebesar ini.</p>
  `,
  featuredImage: "https://picsum.photos/seed/article1/1200/600",
  featuredImageAlt: "Presiden mengumumkan paket stimulus ekonomi",
  category: { id: "1", name: "Nasional", slug: "nasional", color: "#e74c3c" },
  author: { id: "1", name: "Ahmad Fauzi", image: "https://picsum.photos/seed/author1/100/100" },
  editor: { id: "2", name: "Siti Rahayu" },
  tags: [
    { tag: { id: "1", name: "Ekonomi", slug: "ekonomi" } },
    { tag: { id: "2", name: "Presiden", slug: "presiden" } },
    { tag: { id: "3", name: "Stimulus", slug: "stimulus" } },
  ],
  viewCount: BigInt(125000),
  commentCount: 87,
  readTime: 5,
  source: "Antara News",
  sourceUrl: "https://antaranews.com",
  publishedAt: new Date("2026-07-28T07:00:00Z"),
  metaTitle: "Presiden Umumkan Paket Stimulus Ekonomi Rp 500 Triliun",
  metaDesc: "Pemerintah menggelontorkan stimulus besar-besaran untuk mendorong pertumbuhan ekonomi nasional yang ditargetkan mencapai 6% pada tahun ini.",
};

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/articles/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug) || (slug === DEMO_ARTICLE.slug ? DEMO_ARTICLE : null);

  if (!article) return { title: "Artikel Tidak Ditemukan" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://penasakti.com";

  return {
    title: article.metaTitle || article.title,
    description: article.metaDesc || article.excerpt,
    openGraph: {
      title: article.ogTitle || article.title,
      description: article.ogDesc || article.excerpt,
      images: [{ url: article.ogImage || article.featuredImage || `${appUrl}/og-image.jpg`, width: 1200, height: 630 }],
      type: "article",
      publishedTime: article.publishedAt?.toISOString?.(),
      authors: [article.author?.name],
      section: article.category?.name,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImage || `${appUrl}/og-image.jpg`],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug) || (slug === DEMO_ARTICLE.slug ? DEMO_ARTICLE : null);

  if (!article) {
    // Return demo if no DB
    if (slug !== DEMO_ARTICLE.slug) notFound();
  }

  const displayArticle = article || DEMO_ARTICLE;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://penasakti.com";
  const articleUrl = `${appUrl}/artikel/${displayArticle.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: appUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: displayArticle.category?.name || "Kategori",
        item: `${appUrl}/kategori/${displayArticle.category?.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: displayArticle.title,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Apa inti dari berita ini?",
        acceptedAnswer: {
          "@type": "Answer",
          text: displayArticle.excerpt || "Informasi utama dapat dibaca pada bagian ringkasan artikel.",
        },
      },
      {
        "@type": "Question",
        name: `Siapa penulis artikel ini?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Artikel ini ditulis oleh ${displayArticle.author?.name || "Redaksi PenaSakti"} dan diedit oleh ${displayArticle.editor?.name || "tim editorial PenaSakti"}.`,
        },
      },
      {
        "@type": "Question",
        name: `Kapan berita ini dipublikasikan?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Berita ini dipublikasikan pada ${displayArticle.publishedAt instanceof Date
            ? formatDate(displayArticle.publishedAt)
            : displayArticle.publishedAt} dan dikelola oleh tim editorial PenaSakti.`,
        },
      },
      {
        "@type": "Question",
        name: "Bagaimana cara mengutip konten artikel ini?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Pengutipan diperbolehkan dengan mencantumkan sumber PenaSakti dan tautan kembali ke ${articleUrl}. Untuk penggunaan komersial, harap hubungi Redaksi PenaSakti.`,
        },
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: displayArticle.title,
    description: displayArticle.excerpt,
    image: displayArticle.featuredImage,
    datePublished: displayArticle.publishedAt instanceof Date
      ? displayArticle.publishedAt.toISOString()
      : displayArticle.publishedAt,
    dateModified: displayArticle.publishedAt instanceof Date
      ? displayArticle.publishedAt.toISOString()
      : displayArticle.publishedAt,
    author: {
      "@type": "Person",
      name: displayArticle.author?.name,
      url: `${appUrl}/penulis/${displayArticle.author?.slug || displayArticle.author?.id || ""}`,
    },
    editor: displayArticle.editor?.name
      ? {
          "@type": "Person",
          name: displayArticle.editor?.name,
        }
      : undefined,
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "PenaSakti",
      url: appUrl,
      logo: { "@type": "ImageObject", url: `${appUrl}/logo-penasakti.png` },
      foundingDate: "2024",
      sameAs: [
        "https://twitter.com/penasakti",
        "https://facebook.com/penasakti",
        "https://instagram.com/penasakti",
      ],
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    articleSection: displayArticle.category?.name,
    keywords: displayArticle.tags?.map((t: { tag: { name: string } }) => t.tag.name).join(", "),
    wordCount: Math.max(100, (displayArticle.content?.length || 0) / 5),
    inLanguage: "id-ID",
    isAccessibleForFree: true,
    hasPart: displayArticle.tags?.slice(0, 3).map((t: { tag: { name: string } }) => ({
      "@type": "WebPageElement",
      name: t.tag.name,
    })),
    potentialAction: {
      "@type": "ReadAction",
      target: articleUrl,
      expectsAcceptanceOf: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
        availability: "https://schema.org/InStock",
      },
    },
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: displayArticle.category?.name || "", href: `/kategori/${displayArticle.category?.slug}` },
            { label: displayArticle.title },
          ]}
        />

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2">
            {/* Category */}
            <Link
              href={`/kategori/${displayArticle.category?.slug}`}
              className="inline-block text-sm font-bold uppercase tracking-wider mb-3 hover:underline"
              style={{ color: displayArticle.category?.color || "#1a3a6b" }}
            >
              {displayArticle.category?.name}
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4 font-heading">
              {displayArticle.title}
            </h1>

            {/* Excerpt */}
            {displayArticle.excerpt && (
              <p className="text-lg text-muted-foreground mb-5 font-medium leading-relaxed border-l-4 border-penasakti-blue/30 pl-4">
                {displayArticle.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border mb-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                {displayArticle.author?.image && (
                  <Image
                    src={displayArticle.author.image}
                    alt={displayArticle.author.name || ""}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {displayArticle.author?.name}
                  </p>
                  {displayArticle.editor && (
                    <p className="text-xs">
                      Editor: {displayArticle.editor.name}
                    </p>
                  )}
                </div>
              </div>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {displayArticle.publishedAt && (
                  <>
                    <span className="hidden sm:inline">
                      {formatDate(displayArticle.publishedAt)}
                    </span>
                    <span className="sm:hidden">
                      {formatDateRelative(displayArticle.publishedAt)}
                    </span>
                  </>
                )}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatNumber(displayArticle.viewCount || 0)}
              </span>
              {displayArticle.readTime && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {displayArticle.readTime} menit baca
                </span>
              )}
            </div>

            {/* Article Toolbar (Font Resize, TTS, etc) */}
            <ArticleToolbar title={displayArticle.title} text={displayArticle.content} />

            {/* Featured Image */}
            {displayArticle.featuredImage && (
              <figure className="mb-6">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                  <Image
                    src={displayArticle.featuredImage}
                    alt={displayArticle.featuredImageAlt || displayArticle.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
                {displayArticle.featuredImageAlt && (
                  <figcaption className="text-xs text-muted-foreground mt-2 text-center">
                    {displayArticle.featuredImageAlt}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Ad Banner */}
            <AdBanner position="IN_ARTICLE" className="mb-6" />

            {/* Article Content */}
            <ArticleContent content={displayArticle.content} />

            {/* Source */}
            {displayArticle.source && (
              <p className="text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                Sumber:{" "}
                {displayArticle.sourceUrl ? (
                  <a
                    href={displayArticle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-penasakti-blue hover:underline"
                  >
                    {displayArticle.source}
                  </a>
                ) : (
                  displayArticle.source
                )}
              </p>
            )}

            {/* Tags */}
            {displayArticle.tags && displayArticle.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="text-sm font-semibold mr-1">Tags:</span>
                {displayArticle.tags.map(({ tag }: { tag: { id: string; name: string; slug: string } }) => (
                  <Link
                    key={tag.id}
                    href={`/tag/${tag.slug}`}
                    className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Share */}
            <ArticleShare
              url={articleUrl}
              title={displayArticle.title}
            />

            {/* Author Box */}
            {displayArticle.author && (
              <div className="mt-8 p-5 bg-muted/30 rounded-2xl border border-border">
                <h3 className="font-bold mb-3">Tentang Penulis</h3>
                <div className="flex items-start gap-4">
                  {displayArticle.author.image ? (
                    <Image
                      src={displayArticle.author.image}
                      alt={displayArticle.author.name || ""}
                      width={64}
                      height={64}
                      className="rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-penasakti-blue/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-penasakti-blue">
                        {displayArticle.author.name?.[0] || "P"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold">{displayArticle.author.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Jurnalis PenaSakti dengan pengalaman 10+ tahun di bidang politik dan ekonomi nasional.
                    </p>
                    <Link
                      href={`/penulis/ahmad-fauzi`}
                      className="text-sm text-penasakti-blue hover:underline mt-2 inline-block"
                    >
                      Lihat semua artikel →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Comments */}
            <CommentSection articleId={displayArticle.id} />
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <ArticleSidebar currentArticleId={displayArticle.id} />
          </aside>
        </div>

        {/* Related Articles */}
        <RelatedArticles categorySlug={displayArticle.category?.slug || ""} currentId={displayArticle.id} />
      </div>
    </>
  );
}
