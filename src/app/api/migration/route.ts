import { NextRequest, NextResponse } from "next/server";
import { getPosts, getCategories, getTags, getAuthors, getFeaturedImage, getAuthor, cleanContent, getYoastMeta } from "@/lib/wordpress";
import type { WPPost, WPCategory, WPTag } from "@/lib/wordpress";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// GET - Migration status / fetch WP data preview
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action") || "status";

    if (action === "status") {
      // Fetch basic stats from WordPress
      const { total, totalPages } = await getPosts(1, 1);
      const categories = await getCategories();
      const tags = await getTags();
      const authors = await getAuthors();

      return NextResponse.json({
        success: true,
        data: {
          source: "https://penasakti.com",
          totalArticles: total,
          totalPages,
          totalCategories: categories.length,
          totalTags: tags.length,
          totalAuthors: authors.length,
          categories: categories.map(c => ({ id: c.id, name: c.name, slug: c.slug, count: c.count })),
          tags: tags.slice(0, 20).map(t => ({ id: t.id, name: t.name, slug: t.slug, count: t.count })),
          authors: authors.map(a => ({ id: a.id, name: a.name, slug: a.slug })),
        },
      });
    }

    if (action === "preview") {
      const page = parseInt(searchParams.get("page") || "1");
      const { posts, total, totalPages } = await getPosts(page, 10);

      const articles = posts.map(post => ({
        wpId: post.id,
        title: post.title.rendered,
        slug: post.slug,
        excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, "").trim().substring(0, 200),
        featuredImage: getFeaturedImage(post),
        author: getAuthor(post),
        publishedAt: post.date,
        categories: post.categories,
        tags: post.tags,
        meta: getYoastMeta(post),
      }));

      return NextResponse.json({
        success: true,
        data: { articles, total, totalPages, currentPage: page },
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Migration API error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Gagal mengambil data WordPress",
    }, { status: 500 });
  }
}

// POST - Start migration (imports articles to database)
export async function POST(req: NextRequest) {
  try {
    const { page = 1, perPage = 20 } = await req.json();

    const { posts, total, totalPages } = await getPosts(page, perPage);

    const migrated = posts.map((post: WPPost) => ({
      wpId: post.id,
      title: post.title.rendered,
      slug: post.slug,
      content: cleanContent(post.content.rendered),
      excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, "").trim(),
      featuredImage: getFeaturedImage(post),
      author: getAuthor(post),
      publishedAt: post.date,
      updatedAt: post.modified,
      categories: post.categories,
      tags: post.tags,
      meta: getYoastMeta(post),
      status: "PUBLISHED",
    }));

    // In production, this would save to database via Prisma
    // For now, return the processed data
    return NextResponse.json({
      success: true,
      data: {
        page,
        totalPages,
        totalArticles: total,
        migratedCount: migrated.length,
        articles: migrated,
        progress: Math.round((page / totalPages) * 100),
      },
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Migration failed",
    }, { status: 500 });
  }
}
