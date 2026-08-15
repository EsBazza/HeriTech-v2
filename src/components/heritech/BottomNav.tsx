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
  { href: "/",        icon: Store,   label: "Market",  roles: ["buyer", "artisan", "lgu"] },
  { href: "/impact",  icon: Leaf,    label: "Impact",  roles: ["buyer", "artisan", "lgu"] },
  { href: "/map",     icon: MapPin,  label: "Map",     roles: ["artisan", "lgu"]          },
  { href: "/scanner", icon: ScanLine,label: "Scanner", roles: ["lgu"]                     },
  { href: "/studio",  icon: Palette, label: "Studio",  roles: ["artisan"]                 },
  { href: "/profile", icon: User,    label: "Profile", roles: ["buyer", "artisan", "lgu"] },
];

export function BottomNav() {
  const pathname = usePathname();
  const { role } = useAuthStore();

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <nav
      className="bottom-nav mx-3 mb-0 rounded-[26px]"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around px-1 py-2.5">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase()}`}
              aria-label={item.label}
              className="flex flex-col items-center gap-1 px-3 py-1 min-w-[48px] min-h-[52px] justify-center transition-all duration-200"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-[18px] transition-all duration-200 ${
                  isActive ? "scale-105" : "hover:bg-slate-100"
                }`}
                style={
                  isActive
                    ? {
                        background: "linear-gradient(145deg, #3b82f6 0%, #2563eb 100%)",
                        boxShadow:
                          "0 6px 16px rgba(37,99,235,0.28), inset -1px -1px 2px rgba(0,0,0,0.12), inset 1px 1px 2px rgba(255,255,255,0.3)",
                      }
                    : undefined
                }
              >
                <Icon
                  size={17}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? "text-white" : "text-slate-500"}
                />
              </div>
              <span
                className={`text-[9.5px] font-bold tracking-tight ${
                  isActive ? "text-blue-600" : "text-slate-400"
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
