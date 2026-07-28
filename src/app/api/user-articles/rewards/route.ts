import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import prisma from "@/lib/prisma";

const REWARD_AMOUNT = 50000; // Rp 50.000 per 1000 viewers
const VIEWER_THRESHOLD = 1000;

// GET - Fetch user's rewards
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const rewards = await prisma.userReward.findMany({
      where: { userId: session.user.id },
      include: { article: { select: { title: true, slug: true, viewCount: true } } },
      orderBy: { createdAt: "desc" },
    });

    const totalEarned = rewards.filter(r => r.status === "PAID").reduce((sum, r) => sum + Number(r.amount), 0);
    const totalPending = rewards.filter(r => r.status === "PENDING" || r.status === "APPROVED").reduce((sum, r) => sum + Number(r.amount), 0);

    return NextResponse.json({
      success: true,
      data: { rewards, totalEarned, totalPending },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch rewards" }, { status: 500 });
  }
}

// POST - Check and create reward (called when article reaches threshold)
// This would typically be triggered by a cron job or background process
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json({ success: false, error: "Article ID required" }, { status: 400 });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, authorId: true, viewCount: true, title: true },
    });

    if (!article) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const viewCount = Number(article.viewCount);
    const milestones = Math.floor(viewCount / VIEWER_THRESHOLD);

    if (milestones < 1) {
      return NextResponse.json({ success: true, data: { eligible: false, viewCount } });
    }

    // Check how many rewards already given for this article
    const existingRewards = await prisma.userReward.count({
      where: { articleId, userId: article.authorId },
    });

    const newMilestones = milestones - existingRewards;

    if (newMilestones <= 0) {
      return NextResponse.json({ success: true, data: { eligible: false, alreadyClaimed: true } });
    }

    // Create rewards for each new milestone
    const newRewards = [];
    for (let i = 0; i < newMilestones; i++) {
      const milestone = existingRewards + i + 1;
      const reward = await prisma.userReward.create({
        data: {
          userId: article.authorId,
          articleId: article.id,
          amount: BigInt(REWARD_AMOUNT),
          reason: `Milestone ${milestone * VIEWER_THRESHOLD} viewers - ${article.title}`,
          status: "PENDING",
        },
      });
      newRewards.push(reward);
    }

    return NextResponse.json({
      success: true,
      data: { eligible: true, newRewards: newRewards.length, totalReward: newRewards.length * REWARD_AMOUNT },
    });
  } catch (error) {
    console.error("Reward check error:", error);
    return NextResponse.json({ success: false, error: "Failed to process rewards" }, { status: 500 });
  }
}
