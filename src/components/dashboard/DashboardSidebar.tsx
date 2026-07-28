"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Image, Users, MessageSquare,
  BarChart2, DollarSign, Settings, Tag, FolderOpen,
  PenSquare, Calendar, Bell, ChevronLeft, ChevronRight,
  Film, Mic, Globe, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  badge?: string;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Artikel",
    href: "/dashboard/artikel",
    icon: FileText,
    children: [
      { label: "Semua Artikel", href: "/dashboard/artikel" },
      { label: "Buat Baru", href: "/dashboard/artikel/baru" },
      { label: "Draft", href: "/dashboard/artikel?status=draft" },
      { label: "Dijadwalkan", href: "/dashboard/artikel?status=scheduled" },
      { label: "Arsip", href: "/dashboard/artikel?status=archived" },
    ],
  },
  {
    label: "Media",
    href: "/dashboard/media",
    icon: Image,
    children: [
      { label: "Library Media", href: "/dashboard/media" },
      { label: "Upload", href: "/dashboard/media/upload" },
    ],
  },
  { label: "Kategori & Tag", href: "/dashboard/kategori", icon: Tag, roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { label: "Komentar", href: "/dashboard/komentar", icon: MessageSquare, badge: "12" },
  { label: "Pengguna", href: "/dashboard/pengguna", icon: Users, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { label: "Video", href: "/dashboard/video", icon: Film, roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { label: "Podcast", href: "/dashboard/podcast", icon: Mic, roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { label: "Iklan", href: "/dashboard/iklan", icon: DollarSign, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "SEO", href: "/dashboard/seo", icon: Globe, roles: ["SUPER_ADMIN", "ADMIN", "SEO_TEAM"] },
  { label: "Notifikasi", href: "/dashboard/notifikasi", icon: Bell },
  { label: "Pengaturan", href: "/dashboard/pengaturan", icon: Settings, roles: ["SUPER_ADMIN", "ADMIN"] },
];

interface DashboardSidebarProps {
  userRole: string;
}

export default function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["/dashboard/artikel"]);

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const filteredNav = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <aside
      className={cn(
        "bg-background border-r border-border flex flex-col transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center gap-3 h-16">
        <img
          src="/logo-penasakti.png"
          alt="PenaSakti"
          className="h-8 w-auto flex-shrink-0"
        />
        {!collapsed && (
          <span className="font-bold text-lg">
            Pena<span className="text-penasakti-red">Sakti</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isExpanded = expandedItems.includes(item.href);

          if (item.children && !collapsed) {
            return (
              <div key={item.href} className="mb-1">
                <button
                  onClick={() => toggleExpand(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-penasakti-blue/10 text-penasakti-blue"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-penasakti-red text-white text-xs rounded-full px-1.5 py-0.5">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={cn("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-90")}
                  />
                </button>
                {isExpanded && (
                  <div className="ml-10 mt-1 space-y-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-3 py-2 rounded-lg text-sm transition-colors",
                          pathname === child.href
                            ? "bg-penasakti-blue text-white"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all",
                isActive
                  ? "bg-penasakti-blue text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-penasakti-red text-white text-xs rounded-full px-1.5 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}
