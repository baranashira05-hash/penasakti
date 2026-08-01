"use client";

import { useState } from "react";
import { Edit3, UserPlus, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { RedaksiMember, RedaksiGroup } from "@/components/redaksi/RedaksiEditModal";

const RedaksiEditModal = dynamic(() => import("@/components/redaksi/RedaksiEditModal"), {
  ssr: false,
});

type MemberData = {
  id: string;
  name: string;
  jabatan: string;
  group: string;
  photo: string | null;
  email: string | null;
  order: number;
  isActive: boolean;
};

interface Props {
  initialMembers: MemberData[];
  isSuperAdmin: boolean;
}

const GROUP_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  PIMPINAN: { label: "Pimpinan Redaksi", color: "bg-penasakti-red", icon: Shield },
  EDITOR: { label: "Editor & Kontributor", color: "bg-teal-500", icon: Edit3 },
  REPORTER: { label: "Reporter", color: "bg-blue-500", icon: Edit3 },
  FOTOGRAFER: { label: "Fotografer", color: "bg-purple-500", icon: Edit3 },
  DESAIN: { label: "Tim Desain", color: "bg-pink-500", icon: Edit3 },
  TEKNIK: { label: "Tim Teknik", color: "bg-orange-500", icon: Edit3 },
  KONTRIBUTOR: { label: "Kontributor", color: "bg-green-500", icon: Edit3 },
};

export default function RedaksiClient({ initialMembers, isSuperAdmin }: Props) {
  const router = useRouter();
  const [members, setMembers] = useState<MemberData[]>(initialMembers);
  const [editTarget, setEditTarget] = useState<MemberData | null | "new">(null); // null = tutup, "new" = tambah baru

  const pimpinan = members.filter((m) => m.group === "PIMPINAN");
  const otherGroups = Object.keys(GROUP_CONFIG).filter((g) => g !== "PIMPINAN");
  const groupedOthers = otherGroups
    .map((g) => ({ group: g, members: members.filter((m) => m.group === g) }))
    .filter((g) => g.members.length > 0 || isSuperAdmin);

  const handleSaved = (updated: RedaksiMember) => {
    setMembers((prev) => {
      const idx = prev.findIndex((m) => m.id === updated.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [...prev, updated];
    });
    setEditTarget(null);
    router.refresh();
  };

  const handleDeleted = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setEditTarget(null);
    router.refresh();
  };

  return (
    <>
      {/* Toolbar SUPER_ADMIN */}
      {isSuperAdmin && (
        <div className="flex items-center justify-between mb-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              Mode Admin — Klik edit pada anggota atau tambah baru
            </span>
          </div>
          <button
            onClick={() => setEditTarget("new")}
            className="flex items-center gap-2 px-4 py-2 bg-penasakti-blue text-white text-sm font-semibold rounded-xl hover:bg-penasakti-blue/90 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Tambah Anggota
          </button>
        </div>
      )}

      {/* Pimpinan Redaksi */}
      {(pimpinan.length > 0 || isSuperAdmin) && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-penasakti-red rounded-full" />
            Pimpinan Redaksi
          </h2>
          {pimpinan.length === 0 && isSuperAdmin && (
            <p className="text-sm text-muted-foreground italic">
              Belum ada pimpinan redaksi — tambah anggota dengan grup &quot;Pimpinan Redaksi&quot;.
            </p>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pimpinan.map((editor) => (
              <div
                key={editor.id}
                className="relative p-6 rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-penasakti-blue/5 rounded-full -translate-y-16 translate-x-16 group-hover:bg-penasakti-blue/10 transition-colors" />
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 ring-4 ring-penasakti-blue/10 bg-muted">
                    {editor.photo ? (
                      <img
                        src={editor.photo}
                        alt={editor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground">
                        {editor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="inline-block px-2 py-0.5 bg-penasakti-red/10 text-penasakti-red text-xs font-bold rounded mb-2">
                    Pimpinan
                  </span>
                  <h3 className="text-xl font-bold mb-1">{editor.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{editor.jabatan}</p>
                  {editor.email && (
                    <a
                      href={`mailto:${editor.email}`}
                      className="text-sm text-penasakti-blue hover:underline"
                    >
                      {editor.email}
                    </a>
                  )}
                </div>

                {/* Edit button SUPER_ADMIN */}
                {isSuperAdmin && (
                  <button
                    onClick={() => setEditTarget(editor)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-background/80 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-penasakti-blue hover:text-white hover:border-penasakti-blue transition-all"
                    title="Edit anggota"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Divisi lainnya */}
      <div className="space-y-10">
        {groupedOthers.map(({ group, members: groupMembers }) => {
          const cfg = GROUP_CONFIG[group] ?? {
            label: group,
            color: "bg-gray-500",
            icon: Edit3,
          };
          const Icon = cfg.icon;

          return (
            <section key={group}>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-10 h-10 rounded-xl ${cfg.color} text-white flex items-center justify-center`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold">{cfg.label}</h2>
              </div>

              {groupMembers.length === 0 && isSuperAdmin && (
                <p className="text-sm text-muted-foreground italic">
                  Belum ada anggota di divisi ini.
                </p>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupMembers.map((member) => (
                  <div
                    key={member.id}
                    className="relative flex items-center gap-4 p-4 rounded-xl border border-border hover:border-penasakti-blue/30 hover:bg-card/50 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold truncate">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.jabatan}</p>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-xs text-penasakti-blue hover:underline truncate block"
                        >
                          {member.email}
                        </a>
                      )}
                    </div>

                    {/* Edit button SUPER_ADMIN */}
                    {isSuperAdmin && (
                      <button
                        onClick={() => setEditTarget(member)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-background/80 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-penasakti-blue hover:text-white hover:border-penasakti-blue transition-all"
                        title="Edit anggota"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Modal Edit / Tambah */}
      {editTarget !== null && (
        <RedaksiEditModal
          member={editTarget === "new" ? null : (editTarget as RedaksiMember)}
          onClose={() => setEditTarget(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}
