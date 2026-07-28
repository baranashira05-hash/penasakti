import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DUITKU_MERCHANT_CODE = process.env.DUITKU_MERCHANT_CODE || "";
const DUITKU_API_KEY = process.env.DUITKU_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { merchantCode, amount, merchantOrderId, resultCode, signature, reference } = body;

    // Verify signature
    const crypto = await import("crypto");
    const expectedSignature = crypto
      .createHash("md5")
      .update(DUITKU_MERCHANT_CODE + amount + merchantOrderId + DUITKU_API_KEY)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 403 });
    }

    const order = await prisma.order.findUnique({ where: { orderNumber: merchantOrderId } });
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (resultCode === "00" || resultCode === "SUCCESS") {
      // Payment successful
      await prisma.order.update({
        where: { orderNumber: merchantOrderId },
        data: {
          status: "PAID",
          paidAt: new Date(),
          duitkuRef: reference,
        },
      });

      // Update product stock & sold count
      const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity },
          },
        });
      }

      // Update seller stats
      await prisma.sellerProfile.update({
        where: { id: order.sellerId },
        data: {
          totalSales: { increment: 1 },
          totalRevenue: { increment: order.subtotal - order.platformFee },
        },
      });
    } else {
      // Payment failed
      await prisma.order.update({
        where: { orderNumber: merchantOrderId },
        data: { status: "CANCELLED" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ success: false, error: "Webhook processing failed" }, { status: 500 });
  }
}
