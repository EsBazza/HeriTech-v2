"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Leaf, MapPin, ScanLine, Palette, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import type { Role } from "@/lib/types";

interface NavItem {
  href: string;
  icon: typeof Store;
  label: string;
  roles: Role[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", icon: Store, label: "Market", roles: ["buyer", "artisan", "lgu"] },
  { href: "/impact", icon: Leaf, label: "Impact", roles: ["buyer", "artisan", "lgu"] },
  { href: "/map", icon: MapPin, label: "Map", roles: ["artisan", "lgu"] },
  { href: "/scanner", icon: ScanLine, label: "Scanner", roles: ["lgu"] },
  { href: "/studio", icon: Palette, label: "Studio", roles: ["artisan"] },
  { href: "/profile", icon: User, label: "Profile", roles: ["buyer", "artisan", "lgu"] },
];

export function BottomNav() {
  const pathname = usePathname();
  const { role } = useAuthStore();

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <nav className="bottom-nav mx-3 mb-3 rounded-[30px]" aria-label="Main navigation">
      <div className="flex items-center justify-around px-2 py-2">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase()}`}
              aria-label={item.label}
              className="flex flex-col items-center gap-1 px-2.5 py-1.5 min-h-[52px] justify-center transition-all duration-200"
            >
              <div
                className={`p-1.5 rounded-[18px] transition-all duration-200 ${
                  isActive
                    ? "text-white scale-105"
                    : "text-slate-500 hover:text-blue-600"
                }`}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                        boxShadow:
                          "0 10px 20px rgba(37,99,235,0.25), inset -1px -1px 3px rgba(0,0,0,0.18), inset 1px 1px 3px rgba(255,255,255,0.38)",
                      }
                    : undefined
                }
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={`text-[10px] font-semibold tracking-tight ${
                  isActive ? "text-blue-600" : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
