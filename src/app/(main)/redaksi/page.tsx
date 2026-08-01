import { Metadata } from "next";
import { Edit3, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Redaksi",
  description: "Mengenal lebih dekat tim redaksi PenaSakti yang bekerja keras menyajikan berita terbaik untuk Anda.",
};

export default function RedaksiPage() {
  const editors = [
    { name: "Ugastra, MB, SH", role: "Pemimpin Redaksi", email: "redaksi@penasakti.com", dept: "Pimpinan", image: "https://picsum.photos/seed/red1/200/200" },
  ];

  const sections = [
    {
      title: "Editor & Kontributor",
      icon: Edit3,
      color: "bg-teal-500",
      members: [
        { name: "Agus Yulianto", role: "Editor Kontributor", image: "https://picsum.photos/seed/sec3a/150/150" },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-3 font-heading">
            Tim <span className="text-penasakti-red">Redaksi</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tim profesional yang terdiri dari jurnalis berpengalaman, editor, fotografer,
            dan tim kreatif yang berdedikasi menyajikan informasi berkualitas.
          </p>
        </div>

        {/* Pimpinan Redaksi */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-penasakti-red rounded-full" />
            Pimpinan Redaksi
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {editors.map((editor) => (
              <div
                key={editor.name}
                className="relative p-6 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-penasakti-blue/5 rounded-full -translate-y-16 translate-x-16 group-hover:bg-penasakti-blue/10 transition-colors" />
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 ring-4 ring-penasakti-blue/10">
                    <img
                      src={editor.image}
                      alt={editor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="inline-block px-2 py-0.5 bg-penasakti-red/10 text-penasakti-red text-xs font-bold rounded mb-2">
                    {editor.dept}
                  </span>
                  <h3 className="text-xl font-bold mb-1">{editor.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{editor.role}</p>
                  <a
                    href={`mailto:${editor.email}`}
                    className="text-sm text-penasakti-blue hover:underline"
                  >
                    {editor.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Alamat Redaksi */}
        <section className="mb-12">
          <div className="flex items-center gap-3 p-5 rounded-2xl bg-card border border-border">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Alamat Redaksi</p>
              <p className="font-semibold">Jalan Baladewa No. 07, Kec. Cicendo, Kota Bandung</p>
            </div>
          </div>
        </section>

        {/* Desk Sections */}
        <div className="space-y-10">
          {sections.map(({ title, icon: Icon, color, members }) => (
            <section key={title}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl ${color} text-white flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold">{title}</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-penasakti-blue/30 hover:bg-card/50 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

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
