"use client";

import { useAuthStore } from "@/stores/authStore";
import { useProductStore } from "@/stores/productStore";
import { useBatchStore } from "@/stores/batchStore";
import type { Role } from "@/lib/types";
import { ESCROW_SPLIT, ARTISAN_QR_CODE } from "@/lib/constants";
import {
  User,
  ShoppingBag,
  Palette,
  QrCode,
  CheckCircle,
  RefreshCw,
  Award,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

const ROLE_COLORS: Record<Role, string> = {
  buyer: "#2563eb",
  artisan: "#ef4444",
  lgu: "#f59e0b",
};

const ROLE_EMOJIS: Record<Role, string> = {
  buyer: "🛍️",
  artisan: "🎨",
  lgu: "🏛️",
};

const ROLE_LABELS: Record<Role, string> = {
  buyer: "Buyer (Consumer)",
  artisan: "Verified Artisan", 
  lgu: "LGU Officer / Admin",
};

export default function ProfilePage() {
  const { user, role, switchRole } = useAuthStore();
  const { orders, products } = useProductStore();
  const { batches } = useBatchStore();

  const userOrders = orders.filter((o) => o.buyerId === user.id);
  const userProducts = products.filter((p) => p.artisanId === user.id);
  const userBatches = batches.filter((b) => b.scannedByOfficerId === user.id);

  return (
    <div className="relative min-h-full pb-4">
      <div className="px-4 pt-4 pb-4 space-y-4">
        <div className="hero-panel section-panel overflow-hidden relative px-4 py-5">
          <div className="absolute -top-10 -right-8 w-28 h-28 rounded-full blur-2xl" style={{ background: `${ROLE_COLORS[role]}22` }} />
          <div className="absolute -bottom-10 -left-8 w-28 h-28 rounded-full bg-blue-500/12 blur-2xl" />

          <div className="flex items-center gap-3.5 relative z-10">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: ROLE_COLORS[role], color: "white", boxShadow: "0 16px 28px rgba(15,23,42,0.16)" }}
            >
              {ROLE_EMOJIS[role]}
            </div>

            <div className="flex-1 min-w-0">
              <p className="section-kicker mb-1 text-slate-500">
                Demo Profile
              </p>
              <h1 className="section-title truncate">{user.name}</h1>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span
                  className="badge-pill text-[10px]"
                  style={{
                    background: `${ROLE_COLORS[role]}20`,
                    color: ROLE_COLORS[role],
                    border: `1px solid ${ROLE_COLORS[role]}40`,
                  }}
                >
                  {ROLE_LABELS[role]}
                </span>
              </div>
              {role === "artisan" && (
                <p className="text-[11px] text-slate-600 mt-2 font-semibold">
                  📍 {user.workshopName ?? "Lotus Craft Studio"}
                </p>
              )}
              {role === "lgu" && (
                <p className="text-[11px] text-slate-600 mt-2 font-semibold">
                  📍 {user.stationName ?? "Chiang Mai Heritage Station"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {role === "buyer" && (
            <>
              <StatCard icon="🛍️" label="Orders" value={userOrders.length} />
              <StatCard icon="🌿" label="kg Diverted" value={`${(userOrders.length * 0.6 + 1.2).toFixed(1)}kg`} />
              <StatCard icon="💰" label="Donated" value={`$${(userOrders.length * 4.8 + 12).toFixed(0)}`} />
            </>
          )}
          {role === "artisan" && (
            <>
              <StatCard icon="📦" label="Products" value={userProducts.length + 4} />
              <StatCard icon="🌿" label="kg Upcycled" value="284kg" />
              <StatCard icon="⭐" label="Rating" value="4.9" />
            </>
          )}
          {role === "lgu" && (
            <>
              <StatCard icon="📷" label="Batches" value={userBatches.length + 7} />
              <StatCard icon="🌿" label="kg Logged" value="2.4t" />
              <StatCard icon="📜" label="Agreements" value="5" />
            </>
          )}
        </div>

        {role === "artisan" && (
          <div className="section-panel p-4 text-center">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <QrCode size={16} className="text-rose-500" /> Artisan Handover QR Code
              </span>
              <span className="badge-pill badge-artisan text-[9px]">Show to LGU</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Show this QR code to the LGU Officer when picking up waste batches to verify physical custody transfer.
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl w-36 h-36 mx-auto mb-2 border border-slate-200 flex items-center justify-center">
              <QRCodeSVG value={ARTISAN_QR_CODE} size={116} />
            </div>
            <p className="mono-tech text-xs text-rose-600 font-bold">{ARTISAN_QR_CODE}</p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs text-slate-600 font-semibold">Artisan Studio</span>
              <Link href="/studio" className="clay-button-artisan px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5">
                <Palette size={14} /> Open Studio
              </Link>
            </div>
          </div>
        )}

        {role === "lgu" && (
          <div className="section-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Award size={16} className="text-amber-600" /> Station Management
              </span>
              <Link href="/scanner" className="clay-button-primary px-3 py-2 text-xs font-bold inline-flex items-center gap-1.5 min-h-[32px]">
                + AI Scan
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { label: "Chiang Mai Station", sub: "8,500 kg Allocated · Active", icon: "🏛️" },
                { label: "Thane Nirmalaya Station", sub: "150,000 kg Allocated · Active", icon: "🪷" },
              ].map((s) => (
                <div key={s.label} className="clay-card-sm p-3 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.icon}</span>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{s.label}</p>
                      <p className="text-[10px] text-slate-500">{s.sub}</p>
                    </div>
                  </div>
                  <span className="badge-pill badge-eco text-[9px]">Verified</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {role === "buyer" && (
          <div className="section-panel p-4">
            <h2 className="font-bold text-xs text-slate-900 mb-3 flex items-center gap-1.5">
              <ShoppingBag size={16} className="text-blue-600" /> My Purchases & HeriTech Impact Passes
            </h2>

            {userOrders.length === 0 ? (
              <div className="text-center py-6">
                <Sparkles size={28} className="mx-auto mb-1 text-slate-300" />
                <p className="text-xs text-slate-500 font-medium">No purchases yet.</p>
                <Link href="/" className="text-xs text-blue-600 font-bold mt-1 inline-block">
                  Browse Festival Marketplace →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {userOrders.map((order) => (
                  <div key={order.id} className="clay-card-sm p-3 flex items-center justify-between bg-slate-50">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{order.id}</p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(order.purchasedAt).toLocaleDateString()} · Wallet Pass Issued
                      </p>
                    </div>
                    <span className="badge-pill badge-eco text-[9px] flex items-center gap-1">
                      <CheckCircle size={10} /> Pass Verified
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="section-panel p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <RefreshCw size={14} className="text-blue-600" /> Switch Active Role
            </h2>
            <span className="text-[10px] font-bold text-slate-400">Strict Permissions Matrix</span>
          </div>

          <div className="flex flex-col gap-2">
            {(["buyer", "artisan", "lgu"] as Role[]).map((r) => (
              <button
                key={r}
                id={`switch-role-${r}`}
                onClick={() => switchRole(r)}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                  role === r
                    ? "bg-blue-50 border-2 border-blue-600 shadow-xs"
                    : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
                }`}
                style={{ minHeight: 44 }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{ROLE_EMOJIS[r]}</span>
                  <div className="text-left">
                    <p className={`text-xs font-extrabold ${role === r ? "text-blue-700" : "text-slate-700"}`}>
                      {ROLE_LABELS[r]}
                    </p>
                  </div>
                </div>
                {role === r ? (
                  <span className="badge-pill badge-primary text-[9px]">Active Role</span>
                ) : (
                  <span className="text-xs text-slate-400 font-bold">Switch →</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="route-stat p-2.5 text-center rounded-2xl">
      <div className="text-lg mb-0.5">{icon}</div>
      <div className="text-sm font-extrabold text-slate-900">{value}</div>
      <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-tight">
        {label}
      </div>
    </div>
  );
}
