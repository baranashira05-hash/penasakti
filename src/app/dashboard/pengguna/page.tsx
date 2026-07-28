export const metadata = { title: "Manajemen Pengguna | Dashboard PenaSakti" };

const USERS = [
  { id: "1", name: "Super Admin", email: "superadmin@penasakti.com", role: "SUPER_ADMIN", articles: 0, joined: "1 Jan 2026", status: "Aktif" },
  { id: "2", name: "Ahmad Fauzi", email: "redaksi@penasakti.com", role: "JOURNALIST", articles: 312, joined: "15 Jan 2026", status: "Aktif" },
  { id: "3", name: "Siti Rahayu", email: "siti@penasakti.com", role: "EDITOR", articles: 0, joined: "20 Jan 2026", status: "Aktif" },
  { id: "4", name: "Budi Santoso", email: "budi@penasakti.com", role: "JOURNALIST", articles: 245, joined: "1 Feb 2026", status: "Aktif" },
  { id: "5", name: "John Doe", email: "user@example.com", role: "USER", articles: 0, joined: "10 Jul 2026", status: "Aktif" },
];

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin", ADMIN: "Admin", EDITOR: "Editor",
  JOURNALIST: "Jurnalis", CONTRIBUTOR: "Kontributor", SEO_TEAM: "Tim SEO",
  MODERATOR: "Moderator", USER: "Pengguna",
};

const ROLE_COLOR: Record<string, string> = {
  SUPER_ADMIN: "bg-red-100 text-red-700", ADMIN: "bg-orange-100 text-orange-700",
  EDITOR: "bg-purple-100 text-purple-700", JOURNALIST: "bg-blue-100 text-blue-700",
  USER: "bg-gray-100 text-gray-600",
};

export default function UsersPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
        <p className="text-muted-foreground text-sm">Kelola semua pengguna terdaftar</p>
      </div>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-semibold">Pengguna</th>
                <th className="text-left px-4 py-3 font-semibold">Role</th>
                <th className="text-right px-4 py-3 font-semibold">Artikel</th>
                <th className="text-left px-4 py-3 font-semibold">Bergabung</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {USERS.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-penasakti-blue/20 flex items-center justify-center font-bold text-penasakti-blue">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLOR[u.role] ?? "bg-gray-100 text-gray-600"}`}>
                      {ROLE_LABEL[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{u.articles}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{u.joined}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">{u.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-penasakti-blue hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
