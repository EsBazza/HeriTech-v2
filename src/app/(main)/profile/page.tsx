"use client";

import { useAuthStore } from "@/stores/authStore";
import { useProductStore } from "@/stores/productStore";
import { useBatchStore } from "@/stores/batchStore";
import type { Role } from "@/lib/types";
import { ARTISAN_QR_CODE } from "@/lib/constants";
import {
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
  buyer:   "#2563eb",
  artisan: "#f43f5e",
  lgu:     "#f59e0b",
};

const ROLE_EMOJIS: Record<Role, string> = {
  buyer:   "🛍️",
  artisan: "🎨",
  lgu:     "🏛️",
};

const ROLE_LABELS: Record<Role, string> = {
  buyer:   "Buyer (Consumer)",
  artisan: "Verified Artisan",
  lgu:     "LGU Officer / Admin",
};

export default function ProfilePage() {
  const { user, role, switchRole } = useAuthStore();
  const { orders, products } = useProductStore();
  const { batches } = useBatchStore();

  const userOrders   = orders.filter((o) => o.buyerId === user.id);
  const userProducts = products.filter((p) => p.artisanId === user.id);
  const userBatches  = batches.filter((b) => b.scannedByOfficerId === user.id);

  return (
    <div className="mobile-page">
      <div className="mobile-header">
        {/* ── PROFILE HERO ── */}
        <div className="page-hero" style={{ 
          background: `linear-gradient(135deg, ${ROLE_COLORS[role]}08, ${ROLE_COLORS[role]}04)`,
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(226,232,240,0.7)"
        }}>
          <div
            className="pointer-events-none absolute -top-10 -right-8 w-32 h-32 rounded-full blur-3xl"
            style={{ background: `${ROLE_COLORS[role]}12` }}
          />

          <div className="hero-header relative z-10">
            <div className="hero-main">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                style={{
                  background: ROLE_COLORS[role],
                  boxShadow: `0 4px 16px ${ROLE_COLORS[role]}40`,
                }}
              >
                {ROLE_EMOJIS[role]}
              </div>
              <div className="hero-text">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Demo Profile
                </p>
                <h1 className="section-title mb-2">{user.name}</h1>
                <span
                  className="mobile-badge"
                  style={{
                    background: `${ROLE_COLORS[role]}10`,
                    color: ROLE_COLORS[role],
                    border: `1px solid ${ROLE_COLORS[role]}25`,
                  }}
                >
                  {ROLE_LABELS[role]}
                </span>
              </div>
            </div>
          </div>

          {role === "artisan" && (
            <p className="text-sm text-slate-600 relative z-10">
              📍 {user.workshopName ?? "Lotus Craft Studio"}
            </p>
          )}
          {role === "lgu" && (
            <p className="text-sm text-slate-600 relative z-10">
              📍 {user.stationName ?? "Chiang Mai Heritage Station"}
            </p>
          )}
        </div>
      </div>

      <div className="mobile-content">
        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-3 gap-3">
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

        {/* ── ARTISAN QR ── */}
        {role === "artisan" && (
          <div className="mobile-card space-y-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <QrCode size={16} className="text-rose-500" /> Artisan Handover QR
              </span>
              <span className="mobile-badge mobile-badge-artisan">Show to LGU</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Show this QR code to the LGU Officer when picking up waste batches to verify physical custody transfer.
            </p>
            <div className="flex justify-center">
              <div className="w-36 h-36 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-3">
                <QRCodeSVG value={ARTISAN_QR_CODE} size={120} />
              </div>
            </div>
            <p className="text-center font-mono text-xs font-bold text-rose-600 select-all">
              {ARTISAN_QR_CODE}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-sm font-semibold text-slate-600">Artisan Studio</span>
              <Link href="/studio" className="mobile-btn mobile-btn-artisan mobile-btn-small">
                <Palette size={14} /> Open Studio
              </Link>
            </div>
          </div>
        )}

        {/* ── LGU STATIONS ── */}
        {role === "lgu" && (
          <div className="mobile-card space-y-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Award size={16} className="text-amber-500" /> Station Management
              </span>
              <Link href="/scanner" className="mobile-btn mobile-btn-primary mobile-btn-small">
                + AI Scan
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { label: "Chiang Mai Station", sub: "8,500 kg Allocated · Active", icon: "🏛️" },
                { label: "Thane Nirmalaya Station", sub: "150,000 kg Allocated · Active", icon: "🪷" },
              ].map((s) => (
                <div key={s.label} className="mobile-card-compact flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900">{s.label}</p>
                    <p className="text-xs text-slate-600 mt-1">{s.sub}</p>
                  </div>
                  <span className="mobile-badge mobile-badge-eco">Verified</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BUYER PURCHASES ── */}
        {role === "buyer" && (
          <div className="mobile-card space-y-5">
            <h2 className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <ShoppingBag size={16} className="text-blue-600" />
              My Purchases & Impact Passes
            </h2>
            {userOrders.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles size={28} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm text-slate-600 font-semibold mb-2">No purchases yet.</p>
                <Link href="/" className="text-sm text-blue-600 font-bold">
                  Browse Festival Marketplace →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userOrders.map((order) => (
                  <div key={order.id} className="mobile-card-compact flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{order.id}</p>
                      <p className="text-xs text-slate-600 mt-1">
                        {new Date(order.purchasedAt).toLocaleDateString()} · Wallet Pass Issued
                      </p>
                    </div>
                    <span className="mobile-badge mobile-badge-eco flex items-center gap-1">
                      <CheckCircle size={12} /> Verified
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ROLE SWITCHER ── */}
        <div className="mobile-card space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <RefreshCw size={14} className="text-blue-600" />
              Switch Active Role
            </h2>
            <span className="text-xs font-semibold text-slate-500">Demo Permissions</span>
          </div>

          <div className="space-y-3">
            {(["buyer", "artisan", "lgu"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border ${
                  role === r 
                    ? 'border-2 bg-opacity-5' 
                    : 'border border-slate-200 bg-white hover:bg-slate-50'
                }`}
                style={{
                  borderColor: role === r ? ROLE_COLORS[r] : undefined,
                  backgroundColor: role === r ? `${ROLE_COLORS[r]}05` : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ROLE_EMOJIS[r]}</span>
                  <p className={`text-sm font-bold ${role === r ? 'text-slate-900' : 'text-slate-700'}`}>
                    {ROLE_LABELS[r]}
                  </p>
                </div>
                {role === r ? (
                  <span
                    className="mobile-badge"
                    style={{
                      background: `${ROLE_COLORS[r]}12`,
                      color: ROLE_COLORS[r],
                      border: `1px solid ${ROLE_COLORS[r]}30`,
                    }}
                  >
                    Active
                  </span>
                ) : (
                  <span className="text-sm text-slate-500 font-semibold">Switch →</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="stat-card">
      <span className="text-xl">{icon}</span>
      <span className="stat-value text-slate-900">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
