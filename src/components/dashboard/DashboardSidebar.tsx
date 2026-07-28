"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Image, Users, MessageSquare,
  BarChart2, DollarSign, Settings, Tag, Radio,
  PenSquare, Bell, ChevronLeft, ChevronRight, ChevronDown,
  Film, Globe, Shield, ShoppingBag, Megaphone, Mail,
  Search, Zap, ClipboardList, Wallet
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
    label: "Artikel", href: "/dashboard/artikel", icon: FileText, badge: "342",
    children: [
      { label: "Semua Artikel", href: "/dashboard/artikel" },
      { label: "Buat Baru", href: "/dashboard/artikel/baru" },
    ],
  },
  { label: "Live Video", href: "/dashboard/live", icon: Radio, badge: "2" },
  { label: "Media Library", href: "/dashboard/media", icon: Image },
  { label: "Komentar", href: "/dashboard/komentar", icon: MessageSquare, badge: "12" },
  { label: "Pengguna", href: "/dashboard/pengguna", icon: Users, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Iklan", href: "/dashboard/iklan", icon: Megaphone },
  { label: "Store", href: "/dashboard/store", icon: ShoppingBag },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { label: "SEO Center", href: "/dashboard/seo", icon: Search },
  { label: "Newsletter", href: "/dashboard/newsletter", icon: Mail },
  { label: "Keuangan", href: "/dashboard/keuangan", icon: Wallet, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Notifikasi", href: "/dashboard/notifikasi", icon: Bell },
  { label: "Task", href: "/dashboard/task", icon: ClipboardList },
  { label: "Keamanan", href: "/dashboard/keamanan", icon: Shield, roles: ["SUPER_ADMIN"] },
  { label: "Migrasi WP", href: "/dashboard/migration", icon: Globe, roles: ["SUPER_ADMIN"] },
  { label: "Pengaturan", href: "/dashboard/pengaturan", icon: Settings },
];

interface Props {
  userRole: string;
}

export default function DashboardSidebar({ userRole }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]);
  };

  const filteredItems = navItems.filter(item => !item.roles || item.roles.includes(userRole));

  return (
    <aside
      className={cn(
        "h-full border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col transition-all duration-300 flex-shrink-0",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-3 h-16">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        {!collapsed && (
          <span className="font-bold text-sm text-gray-900 dark:text-white truncate">PenaSakti CMS</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isExpanded = expandedItems.includes(item.label);
          const Icon = item.icon;

          if (item.children && !collapsed) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
                  )}
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-180")} />
                </button>
                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-0.5">
                    {item.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                          pathname === child.href
                            ? "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
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
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-gray-200 dark:border-slate-700">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
