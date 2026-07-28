import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { nanoid } from "@/lib/utils";

const DUITKU_MERCHANT_CODE = process.env.DUITKU_MERCHANT_CODE || "";
const DUITKU_API_KEY = process.env.DUITKU_API_KEY || "";
const DUITKU_BASE_URL = process.env.DUITKU_SANDBOX === "true"
  ? "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry"
  : "https://passport.duitku.com/webapi/api/merchant/v2/inquiry";
const PLATFORM_FEE_PERCENT = 10; // PenaSakti takes 10%

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, quantity, buyerName, buyerEmail, buyerPhone, shippingAddress, paymentMethod } = body;

    if (!productId || !quantity || !buyerName || !buyerEmail || !buyerPhone || !shippingAddress) {
      return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 });
    }

    // Fetch product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { seller: true },
    });

    if (!product || product.status !== "ACTIVE") {
      return NextResponse.json({ success: false, error: "Produk tidak tersedia" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ success: false, error: "Stok tidak cukup" }, { status: 400 });
    }

    const subtotal = BigInt(product.price) * BigInt(quantity);
    const platformFee = subtotal * BigInt(PLATFORM_FEE_PERCENT) / BigInt(100);
    const shippingCost = BigInt(0); // Flat for now
    const totalAmount = subtotal + shippingCost;
    const orderNumber = `PS-${Date.now()}-${nanoid(4).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        buyerName,
        buyerEmail,
        buyerPhone,
        shippingAddress,
        sellerId: product.sellerId,
        subtotal,
        platformFee,
        shippingCost,
        totalAmount,
        paymentMethod: paymentMethod || "VA",
        items: {
          create: {
            productId: product.id,
            productName: product.name,
            quantity,
            price: product.price,
            total: subtotal,
          },
        },
      },
    });

    // Create Duitku payment
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const paymentPayload = {
      merchantCode: DUITKU_MERCHANT_CODE,
      paymentAmount: Number(totalAmount),
      merchantOrderId: orderNumber,
      productDetails: `Pembelian ${product.name} x${quantity}`,
      email: buyerEmail,
      phoneNumber: buyerPhone,
      customerVaName: buyerName,
      callbackUrl: `${appUrl}/api/store/webhook/duitku`,
      returnUrl: `${appUrl}/store/order/${orderNumber}?status=success`,
      expiryPeriod: 1440, // 24 hours
      paymentMethod: paymentMethod || "VA",
    };

    // Generate signature
    const crypto = await import("crypto");
    const signature = crypto
      .createHash("md5")
      .update(DUITKU_MERCHANT_CODE + orderNumber + Number(totalAmount) + DUITKU_API_KEY)
      .digest("hex");

    const duitkuPayload = { ...paymentPayload, signature };

    let paymentUrl = "";
    let duitkuRef = "";

    try {
      const duitkuRes = await fetch(DUITKU_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duitkuPayload),
      });
      const duitkuData = await duitkuRes.json();

      if (duitkuData.paymentUrl) {
        paymentUrl = duitkuData.paymentUrl;
        duitkuRef = duitkuData.reference || "";
      }
    } catch {
      // Duitku not configured - use mock URL for development
      paymentUrl = `${appUrl}/store/order/${orderNumber}?mock_payment=true`;
    }

    // Update order with payment info
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentUrl, duitkuRef },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber,
        totalAmount: Number(totalAmount),
        platformFee: Number(platformFee),
        paymentUrl,
      },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ success: false, error: "Gagal memproses pesanan" }, { status: 500 });
  }
}
