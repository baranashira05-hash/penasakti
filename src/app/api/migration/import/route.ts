import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// POST - Import articles from WordPress to Supabase database
export async function POST(req: NextRequest) {
  try {
    const { articles } = await req.json();

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json({ success: false, error: "No articles to import" }, { status: 400 });
    }

    let imported = 0;
    let skipped = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const article of articles) {
      try {
        // Check if already exists by slug
        const existing = await prisma.article.findUnique({ where: { slug: article.slug } });
        if (existing) {
          skipped++;
          continue;
        }

        // Find or create category
        let categoryId: string | null = null;
        if (article.categoryName) {
          const catSlug = slugify(article.categoryName);
          const cat = await prisma.category.upsert({
            where: { slug: catSlug },
            update: {},
            create: { name: article.categoryName, slug: catSlug },
          });
          categoryId = cat.id;
        }

        // Find or create author
        let authorId: string;
        if (article.authorName) {
          const authorEmail = slugify(article.authorName) + "@penasakti.com";
          const author = await prisma.user.upsert({
            where: { email: authorEmail },
            update: {},
            create: {
              email: authorEmail,
              name: article.authorName,
              role: "JOURNALIST",
            },
          });
          authorId = author.id;
        } else {
          // Default admin author
          const admin = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });
          if (admin) {
            authorId = admin.id;
          } else {
            const newAdmin = await prisma.user.create({
              data: { email: "admin@penasakti.com", name: "Redaksi PenaSakti", role: "SUPER_ADMIN" },
            });
            authorId = newAdmin.id;
          }
        }

        // If no category, create default
        if (!categoryId) {
          const defaultCat = await prisma.category.upsert({
            where: { slug: "umum" },
            update: {},
            create: { name: "Umum", slug: "umum" },
          });
          categoryId = defaultCat.id;
        }

        // Calculate read time
        const plainText = (article.content || "").replace(/<[^>]+>/g, "");
        const readTime = Math.ceil(plainText.split(/\s+/).length / 200);

        // Create article
        await prisma.article.create({
          data: {
            title: article.title,
            slug: article.slug,
            content: article.content || "",
            excerpt: article.excerpt || plainText.substring(0, 200),
            featuredImage: article.featuredImage || null,
            status: "PUBLISHED",
            authorId,
            categoryId,
            publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
            readTime,
            metaTitle: article.metaTitle || null,
            metaDesc: article.metaDesc || null,
            ogImage: article.ogImage || article.featuredImage || null,
          },
        });

        // Create tags
        if (article.tags && Array.isArray(article.tags)) {
          for (const tagName of article.tags) {
            const tagSlug = slugify(tagName);
            const tag = await prisma.tag.upsert({
              where: { slug: tagSlug },
              update: {},
              create: { name: tagName, slug: tagSlug },
            });
            // Link to article
            try {
              const art = await prisma.article.findUnique({ where: { slug: article.slug } });
              if (art) {
                await prisma.articleTag.upsert({
                  where: { articleId_tagId: { articleId: art.id, tagId: tag.id } },
                  update: {},
                  create: { articleId: art.id, tagId: tag.id },
                });
              }
            } catch { /* skip tag link errors */ }
          }
        }

        imported++;
      } catch (err) {
        failed++;
        errors.push(`${article.slug}: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    }

    return NextResponse.json({
      success: true,
      data: { imported, skipped, failed, total: articles.length, errors: errors.slice(0, 10) },
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Import failed",
    }, { status: 500 });
  }
}
