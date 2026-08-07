"use client";

import { useAuthStore } from "@/stores/authStore";
import type { Role } from "@/lib/types";
import { ShieldAlert, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

interface RoleGateProps {
  allow: Role[];
  children: React.ReactNode;
}

const ROLE_LABELS: Record<Role, string> = {
  buyer: "Buyer (Consumer)",
  artisan: "Artisan (Seller)",
  lgu: "LGU Officer / Admin",
};

export function RoleGate({ allow, children }: RoleGateProps) {
  const { role, switchRole } = useAuthStore();

  if (!allow.includes(role)) {
    const suggestedRole = allow[0];
    return (
      <div className="p-6 text-center flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-500 flex items-center justify-center mb-4 shadow-sm">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">
          Access Restricted
        </h2>
        <p className="text-xs text-slate-600 mb-4 max-w-xs leading-relaxed">
          Your active role <span className="font-bold text-slate-800">({ROLE_LABELS[role]})</span> does not have permission to view this module.
        </p>

        <div className="clay-card p-4 w-full max-w-xs mb-6 text-left bg-white">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Required Role
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
            <span className="text-sm font-extrabold text-blue-600">
              {allow.map((r) => ROLE_LABELS[r]).join(" or ")}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full max-w-xs">
          <button
            onClick={() => switchRole(suggestedRole)}
            className="clay-button-primary w-full text-xs font-bold flex items-center justify-center gap-2"
            style={{ height: 44 }}
          >
            <RefreshCw size={14} />
            Switch to {ROLE_LABELS[suggestedRole]}
          </button>

          <Link href="/" className="w-full">
            <button
              className="w-full py-2.5 rounded-full text-xs font-bold text-slate-600 bg-slate-200/80 hover:bg-slate-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} />
              Return to Marketplace
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
