import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "today";

    const where: Record<string, unknown> = { userId: session.user.id };

    if (period === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      where.createdAt = { gte: today };
    } else if (period === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      where.createdAt = { gte: weekAgo };
    } else if (period === "month") {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      where.createdAt = { gte: monthAgo };
    }

    const [usageRecords, aggregates] = await Promise.all([
      db.usageRecord.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.usageRecord.aggregate({
        where,
        _sum: {
          inputTokens: true,
          outputTokens: true,
          cachedTokens: true,
          creditsUsed: true,
          costUsd: true,
        },
        _count: true,
      }),
    ]);

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, credits: true, totalSpent: true },
    });

    // Get daily usage for charts (last 7 days)
    const dailyUsage = await db.usageRecord.groupBy({
      by: ["createdAt"],
      where: {
        userId: session.user.id,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      _sum: {
        inputTokens: true,
        outputTokens: true,
        creditsUsed: true,
        costUsd: true,
      },
      _count: true,
    });

    // Group by date
    const dailyMap = new Map<string, { inputTokens: number; outputTokens: number; creditsUsed: number; costUsd: number; requests: number }>();
    for (const record of dailyUsage) {
      const date = new Date(record.createdAt).toISOString().split("T")[0];
      const existing = dailyMap.get(date) || { inputTokens: 0, outputTokens: 0, creditsUsed: 0, costUsd: 0, requests: 0 };
      existing.inputTokens += record._sum.inputTokens || 0;
      existing.outputTokens += record._sum.outputTokens || 0;
      existing.creditsUsed += record._sum.creditsUsed || 0;
      existing.costUsd += record._sum.costUsd || 0;
      existing.requests += record._count;
      dailyMap.set(date, existing);
    }

    const chartData = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));

    return NextResponse.json({
      summary: {
        totalInputTokens: aggregates._sum.inputTokens || 0,
        totalOutputTokens: aggregates._sum.outputTokens || 0,
        totalCachedTokens: aggregates._sum.cachedTokens || 0,
        totalCreditsUsed: aggregates._sum.creditsUsed || 0,
        totalCostUsd: aggregates._sum.costUsd || 0,
        totalRequests: aggregates._count,
        currentCredits: user?.credits || 0,
        plan: user?.plan || "free",
        totalSpent: user?.totalSpent || 0,
      },
      records: usageRecords,
      chartData,
    });
  } catch (error) {
    console.error("Usage API error:", error);
    return NextResponse.json({ error: "Failed to fetch usage data" }, { status: 500 });
  }
}
