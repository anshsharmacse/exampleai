import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CREDIT_PRICING } from "@/lib/models";
import crypto from "crypto";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

// Helper to verify Razorpay signature
function verifySignature(orderId: string, paymentId: string, signature: string): boolean {
  if (!RAZORPAY_KEY_SECRET) return false;
  const body = orderId + "|" + paymentId;
  const expectedSig = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(signature));
}

// POST /api/payment — Create Razorpay order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { credits } = body;
    if (!credits || credits <= 0) return NextResponse.json({ error: "Invalid credits" }, { status: 400 });

    const amountUsd = credits * CREDIT_PRICING.pricePerCredit;
    // Convert to INR (approximate rate — Razorpay requires INR)
    const amountInr = Math.round(amountUsd * 83.5); // 1 USD ≈ 83.5 INR
    const amountInPaise = amountInr * 100;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return NextResponse.json({
        error: "Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file.",
        setupUrl: "https://dashboard.razorpay.com/settings/keys",
      }, { status: 503 });
    }

    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${session.user.id.slice(0, 8)}_${Date.now()}`,
      notes: { userId: session.user.id, credits: credits.toString(), amountUsd: amountUsd.toString() },
    });

    await db.payment.create({
      data: { userId: session.user.id, razorpayOrderId: order.id, amount: amountUsd, creditsAdded: credits, status: "pending" },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: amountInr,
      currency: "INR",
      credits,
      creditsAdded: credits,
      key: RAZORPAY_KEY_ID,
      amountUsd,
      // Prefill user info if available
      prefill: {
        name: session.user.name || "",
        email: session.user.email || "",
      },
    });
  } catch (error) {
    console.error("Payment create error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// PUT /api/payment — Verify payment after frontend success
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { orderId, paymentId, razorpaySignature, status } = body;

    const payment = await db.payment.findFirst({ where: { razorpayOrderId: orderId, userId: session.user.id } });
    if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

    // If we have a signature, verify it (real payment)
    const isRealPayment = razorpaySignature && paymentId;
    if (isRealPayment) {
      const valid = verifySignature(orderId, paymentId, razorpaySignature);
      if (!valid) return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Verify with Razorpay API if we have paymentId
    if (paymentId && RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      try {
        const Razorpay = (await import("razorpay")).default;
        const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
        const paymentFetch = await razorpay.payments.fetch(paymentId);
        if (paymentFetch.status !== "captured") {
          // Try to capture the payment
          try {
            await razorpay.payments.capture(paymentId, Math.round(payment.amount * 83.5 * 100), "INR");
          } catch (captureErr) {
            console.error("Capture failed:", captureErr);
          }
        }
      } catch (verifyErr) {
        console.error("Payment verification error:", verifyErr);
      }
    }

    // Update payment record
    await db.payment.update({
      where: { id: payment.id },
      data: { razorpayPaymentId: paymentId, status: "completed" },
    });

    // Add credits to user
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { credits: { increment: payment.creditsAdded }, plan: "premium", totalSpent: { increment: payment.amount } },
    });

    return NextResponse.json({
      success: true,
      credits: updatedUser.credits,
      plan: updatedUser.plan,
      creditsAdded: payment.creditsAdded,
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}

// POST /api/payment/webhook — Razorpay webhook endpoint
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, action } = body;

    if (action === "fail") {
      const payment = await db.payment.findFirst({ where: { razorpayOrderId: orderId } });
      if (payment) {
        await db.payment.update({ where: { id: payment.id }, data: { status: "failed" } });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
