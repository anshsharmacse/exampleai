import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CREDIT_PRICING } from "@/lib/models";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, credits: true, totalSpent: true },
    });

    const payments = await db.payment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      plan: user?.plan || "free",
      credits: user?.credits || 0,
      totalSpent: user?.totalSpent || 0,
      pricePerCredit: CREDIT_PRICING.pricePerCredit,
      creditsPerPlan: CREDIT_PRICING.creditsPerPlan,
      planPrice: CREDIT_PRICING.planPrice,
      payments,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch credits" }, { status: 500 });
  }
}
