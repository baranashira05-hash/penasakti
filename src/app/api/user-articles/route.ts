import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

// GET - Fetch user's own articles
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const articles = await prisma.article.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        viewCount: true,
        publishedAt: true,
        createdAt: true,
        category: { select: { name: true } },
        rewards: { select: { id: true, amount: true, status: true, reason: true } },
      },
    });

    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch articles" }, { status: 500 });
  }
}

// POST - Submit new article for review
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, excerpt, categoryId, tags, featuredImage } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json({ success: false, error: "Judul, konten, dan kategori wajib diisi" }, { status: 400 });
    }

    if (title.length < 10) {
      return NextResponse.json({ success: false, error: "Judul minimal 10 karakter" }, { status: 400 });
    }

    if (content.length < 100) {
      return NextResponse.json({ success: false, error: "Konten minimal 100 karakter" }, { status: 400 });
    }

    // Generate unique slug
    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    // Calculate read time
    const wordCount = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.replace(/<[^>]+>/g, "").substring(0, 160),
        categoryId,
        featuredImage,
        authorId: session.user.id,
        status: "REVIEW", // Needs admin approval
        readTime,
        tags: tags?.length ? {
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { slug: slugify(tagName) },
                create: { name: tagName, slug: slugify(tagName) },
              },
            },
          })),
        } : undefined,
      },
    });

    // Update user role to CONTRIBUTOR if still USER
    if (session.user.role === "USER") {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { role: "CONTRIBUTOR" },
      });
    }

    return NextResponse.json({ success: true, data: { id: article.id, slug: article.slug } });
  } catch (error) {
    console.error("Submit article error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengirim artikel" }, { status: 500 });
  }
}
