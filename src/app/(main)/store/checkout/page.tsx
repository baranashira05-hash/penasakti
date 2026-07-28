"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Shield, Lock } from "lucide-react";
import { toast } from "sonner";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("product") || "";
  const qty = parseInt(searchParams.get("qty") || "1");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    shippingAddress: "",
    paymentMethod: "VA",
  });

  const PAYMENT_METHODS = [
    { code: "VA", label: "Virtual Account (Bank Transfer)", desc: "BCA, BNI, BRI, Mandiri" },
    { code: "OV", label: "OVO", desc: "Bayar dengan OVO" },
    { code: "SA", label: "ShopeePay", desc: "Bayar dengan ShopeePay" },
    { code: "QR", label: "QRIS", desc: "Scan QR di semua e-wallet" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.buyerName || !form.buyerEmail || !form.buyerPhone || !form.shippingAddress) {
      toast.error("Lengkapi semua data");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: qty,
          ...form,
        }),
      });
      const data = await res.json();

      if (data.success && data.data.paymentUrl) {
        toast.success("Mengarahkan ke pembayaran...");
        window.location.href = data.data.paymentUrl;
      } else {
        toast.error(data.error || "Gagal memproses pesanan");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/store" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-600" /> Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-3 space-y-5">
            {/* Buyer Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Data Pembeli</h2>
              <div className="space-y-3">
                <input type="text" value={form.buyerName} onChange={(e) => updateForm("buyerName", e.target.value)} placeholder="Nama Lengkap *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="email" value={form.buyerEmail} onChange={(e) => updateForm("buyerEmail", e.target.value)} placeholder="Email *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 text-sm" />
                  <input type="tel" value={form.buyerPhone} onChange={(e) => updateForm("buyerPhone", e.target.value)} placeholder="No. HP *" required className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 text-sm" />
                </div>
                <textarea value={form.shippingAddress} onChange={(e) => updateForm("shippingAddress", e.target.value)} placeholder="Alamat Pengiriman Lengkap *" required rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 text-sm resize-none" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Metode Pembayaran</h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((m) => (
                  <label key={m.code} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${form.paymentMethod === m.code ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500"}`}>
                    <input type="radio" name="payment" value={m.code} checked={form.paymentMethod === m.code} onChange={(e) => updateForm("paymentMethod", e.target.value)} className="accent-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{m.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 sticky top-24">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Ringkasan</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Jumlah</span>
                  <span>{qty} item</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Ongkir</span>
                  <span className="text-emerald-600">Gratis</span>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mb-5">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total akan ditampilkan setelah pembayaran diproses.</p>
              </div>

              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold transition-colors disabled:opacity-70">
                <Lock className="w-4 h-4" />
                {loading ? "Memproses..." : "Bayar Sekarang"}
              </button>

              <div className="flex items-center gap-2 justify-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                <Shield className="w-3.5 h-3.5" />
                <span>Pembayaran aman via Duitku</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
