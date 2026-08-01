import { Metadata } from "next";
import { MapPin } from "lucide-react";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import RedaksiClient from "./RedaksiClient";

export const metadata: Metadata = {
  title: "Redaksi",
  description:
    "Mengenal lebih dekat tim redaksi PenaSakti yang bekerja keras menyajikan berita terbaik untuk Anda.",
};

// Revalidate setiap 60 detik
export const revalidate = 60;

export default async function RedaksiPage() {
  const [session, rawMembers] = await Promise.all([
    getServerSession(authOptions),
    prisma.redaksiMember.findMany({
      where: { isActive: true },
      orderBy: [{ group: "asc" }, { order: "asc" }, { name: "asc" }],
    }),
  ]);

  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  // Serialisasi (Date → string agar bisa dikirim ke Client Component)
  const members = rawMembers.map((m) => ({
    id: m.id,
    name: m.name,
    jabatan: m.jabatan,
    group: m.group as string,
    photo: m.photo,
    email: m.email,
    order: m.order,
    isActive: m.isActive,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3 font-heading">
            Tim <span className="text-penasakti-red">Redaksi</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tim profesional yang terdiri dari jurnalis berpengalaman, editor, fotografer, dan tim
            kreatif yang berdedikasi menyajikan informasi berkualitas.
          </p>
        </div>

        {/* Alamat Redaksi */}
        <section className="mb-10">
          <div className="flex items-center gap-3 p-5 rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                Alamat Redaksi
              </p>
              <p className="font-semibold">Jalan Baladewa No. 07, Kec. Cicendo, Kota Bandung</p>
            </div>
          </div>
        </section>

        {/* Client Component — edit panel + daftar anggota */}
        <RedaksiClient initialMembers={members} isSuperAdmin={isSuperAdmin} />

        {/* Footer CTA */}
        <div className="mt-12 p-8 rounded-2xl bg-muted/50 border border-border text-center">
          <h3 className="text-xl font-bold mb-2">Tertarik Bergabung dengan Tim Redaksi?</h3>
          <p className="text-muted-foreground mb-4">
            Kami selalu mencari bakat-bakat baru yang bersemangat di dunia jurnalisme.
          </p>
          <a
            href="mailto:hrd@penasakti.com?subject=Lamaran Jurnalis"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-penasakti-blue text-white font-semibold rounded-lg hover:bg-penasakti-blue/90 transition-colors"
          >
            Kirim Lamaran Anda
          </a>
        </div>
      </div>
    </div>
  );
}
