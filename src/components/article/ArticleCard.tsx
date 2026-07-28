import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, MessageSquare, Bookmark } from "lucide-react";
import { formatDateRelative, formatNumber, cn } from "@/lib/utils";
import type { ArticleWithRelations } from "@/types";

interface ArticleCardProps {
  article: ArticleWithRelations;
  variant?: "horizontal" | "vertical" | "compact" | "featured";
  className?: string;
  showExcerpt?: boolean;
}

export default function ArticleCard({
  article,
  variant = "vertical",
  className,
  showExcerpt = true,
}: ArticleCardProps) {
  if (variant === "horizontal") {
    return (
      <article
        className={cn(
          "group flex gap-4 p-4 rounded-xl border border-border hover:border-penasakti-blue/30 hover:shadow-card transition-all bg-card",
          className
        )}
      >
        {/* Image */}
        <Link
          href={`/artikel/${article.slug}`}
          className="flex-shrink-0 relative w-36 sm:w-44 h-28 rounded-lg overflow-hidden bg-muted"
        >
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 144px, 176px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-penasakti-blue/20 to-penasakti-red/20 flex items-center justify-center">
              <span className="text-4xl">📰</span>
            </div>
          )}
          {article.isBreaking && (
            <span className="absolute top-2 left-2 bg-penasakti-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
              Breaking
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href={`/kategori/${article.category?.slug}`}
              className="text-xs font-bold uppercase tracking-wide hover:underline"
              style={{ color: article.category?.color || "#1a3a6b" }}
            >
              {article.category?.name}
            </Link>
          </div>

          <Link href={`/artikel/${article.slug}`}>
            <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-penasakti-blue transition-colors mb-2">
              {article.title}
            </h3>
          </Link>

          {showExcerpt && article.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-auto hidden sm:block">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span suppressHydrationWarning>
                {article.publishedAt && formatDateRelative(article.publishedAt)}
              </span>
            </span>
            {article.viewCount !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatNumber(article.viewCount)}
              </span>
            )}
            {article.commentCount !== undefined && (
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {article.commentCount}
              </span>
            )}
            {article.readTime && (
              <span className="hidden sm:inline">
                {article.readTime} mnt baca
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className={cn("group flex gap-3", className)}>
        <Link
          href={`/artikel/${article.slug}`}
          className="flex-shrink-0 relative w-20 h-16 rounded-lg overflow-hidden bg-muted"
        >
          {article.featuredImage ? (
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/artikel/${article.slug}`}>
            <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-penasakti-blue transition-colors leading-snug">
              {article.title}
            </h4>
          </Link>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span suppressHydrationWarning>
              {article.publishedAt && formatDateRelative(article.publishedAt)}
            </span>
          </p>
        </div>
      </article>
    );
  }

  // Default: vertical
  return (
    <article
      className={cn(
        "group bg-card rounded-xl overflow-hidden border border-border hover:border-penasakti-blue/30 hover:shadow-card-hover transition-all",
        className
      )}
    >
      <Link
        href={`/artikel/${article.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-muted"
      >
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-penasakti-blue/20 to-penasakti-red/20 flex items-center justify-center">
            <span className="text-5xl">📰</span>
          </div>
        )}
        {article.isBreaking && (
          <span className="absolute top-3 left-3 bg-penasakti-red text-white text-xs font-bold px-2 py-1 rounded uppercase">
            Breaking
          </span>
        )}
      </Link>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href={`/kategori/${article.category?.slug}`}
            className="text-xs font-bold uppercase tracking-wide hover:underline"
            style={{ color: article.category?.color || "#1a3a6b" }}
          >
            {article.category?.name}
          </Link>
          {article.readTime && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {article.readTime} mnt
              </span>
            </>
          )}
        </div>

        <Link href={`/artikel/${article.slug}`}>
          <h3 className="font-bold text-base leading-snug line-clamp-3 group-hover:text-penasakti-blue transition-colors mb-2">
            {article.title}
          </h3>
        </Link>

        {showExcerpt && article.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span suppressHydrationWarning>
                {article.publishedAt && formatDateRelative(article.publishedAt)}
              </span>
            </span>
            {article.viewCount !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatNumber(article.viewCount)}
              </span>
            )}
          </div>
          {article.author && (
            <span className="font-medium text-foreground/70 truncate max-w-24">
              {article.author.name}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
