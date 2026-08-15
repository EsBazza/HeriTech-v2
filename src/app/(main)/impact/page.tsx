"use client";

import { useState } from "react";
import {
  LEADERBOARD,
  ARTISAN_LEADERBOARD,
  NGO_DISBURSEMENTS,
  GLOBAL_STATS,
} from "@/lib/mock-data";
import { Globe, Leaf, TrendingUp } from "lucide-react";
import { LEDGER_LABEL } from "@/lib/constants";

type Tab = "leaderboard" | "donations";

const GLOBAL_STAT_CARDS = [
  { icon: "🌿", label: "Waste diverted",    color: "#10b981", value: (s: typeof GLOBAL_STATS) => `${(s.totalKgDiverted / 1000).toFixed(1)} t`     },
  { icon: "🎨", label: "Artisans supported", color: "#f43f5e", value: (s: typeof GLOBAL_STATS) => String(s.totalArtisans)                           },
  { icon: "💰", label: "NGO donated",        color: "#f59e0b", value: (s: typeof GLOBAL_STATS) => `$${s.totalNgoDonated.toLocaleString()}`           },
  { icon: "🛍️", label: "Orders placed",      color: "#2563eb", value: (s: typeof GLOBAL_STATS) => s.totalOrders.toLocaleString()                    },
];

export default function ImpactPage() {
  const [tab, setTab] = useState<Tab>("leaderboard");
  const [leaderRole, setLeaderRole] = useState<"buyer" | "artisan">("buyer");

  const leaderboard = leaderRole === "buyer" ? LEADERBOARD : ARTISAN_LEADERBOARD;

  const rankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="mobile-page">
      {/* ── HERO ── */}
      <div className="mobile-header">
        <div className="page-hero" style={{ 
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(226,232,240,0.7)"
        }}>
          <div className="pointer-events-none absolute -top-12 -right-8 w-36 h-36 rounded-full bg-emerald-400/06 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-blue-400/05 blur-3xl" />

          <div className="hero-header relative z-10">
            <div className="hero-main">
              <div className="hero-icon" style={{ 
                background: "rgba(255,255,255,0.95)",
                boxShadow: "0 4px 12px rgba(16,185,129,0.08)"
              }}>
                <Leaf size={20} className="text-emerald-600" />
              </div>
              <div className="hero-text">
                <p className="section-kicker text-emerald-600">Impact Ledger</p>
                <h1 className="section-title">Global impact</h1>
              </div>
            </div>
          </div>

          <div className="hero-description relative z-10">
            <p className="section-copy">
              Every kg counted. Every dollar traced.
            </p>
          </div>

          <div className="hero-stats relative z-10" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
            {GLOBAL_STAT_CARDS.map((s) => (
              <div key={s.label} className="stat-card">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="stat-value" style={{ color: s.color }}>
                  {s.value(GLOBAL_STATS)}
                </div>
                <div className="stat-label">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB SECTION ── */}
      <div className="mobile-content">
        <div className="mobile-card">
          {/* Tab switcher */}
          <div className="flex p-1 rounded-xl bg-slate-50 border border-slate-200/50 mb-6">
            {(["leaderboard", "donations"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-200 capitalize ${
                  tab === t 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {t === "leaderboard" ? "🏆 Leaderboard" : "💸 Donations"}
              </button>
            ))}
          </div>

          {/* Leaderboard tab */}
          {tab === "leaderboard" && (
            <div className="space-y-5">
              {/* Sub-filter */}
              <div className="flex gap-2">
                {(["buyer", "artisan"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setLeaderRole(r)}
                    className={`flex-1 mobile-btn ${
                      leaderRole === r 
                        ? (r === "buyer" ? 'mobile-btn-primary' : 'mobile-btn-artisan')
                        : 'mobile-btn-secondary'
                    }`}
                  >
                    {r === "buyer" ? "🛍️ Buyers" : "🎨 Artisans"}
                  </button>
                ))}
              </div>

              {/* Entries */}
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div key={entry.userId} className="mobile-card-compact flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border border-slate-200"
                      style={{
                        background:
                          entry.rank === 1 ? "linear-gradient(135deg, #fef3c7, #fcd34d)" :
                          entry.rank === 2 ? "linear-gradient(135deg, #f1f5f9, #cbd5e1)" :
                          entry.rank === 3 ? "linear-gradient(135deg, #ffedd5, #fb923c)" :
                          "#f8fafc",
                      }}
                    >
                      {rankEmoji(entry.rank)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">
                        {entry.name}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {leaderRole === "buyer"
                          ? `${entry.itemsPurchased} items purchased`
                          : `${entry.itemsListed} items listed`}
                        <span className="text-emerald-600 font-semibold ml-2">{entry.kgDiverted}kg diverted</span>
                      </p>
                    </div>
                    <TrendingUp size={16} className="text-emerald-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Donations tab */}
          {tab === "donations" && (
            <div className="space-y-5">
              <div className="mobile-card-compact bg-blue-50/80 border-blue-200/50">
                <div className="flex items-start gap-3">
                  <Globe size={16} className="text-blue-600 mt-1" />
                  <p className="text-sm text-blue-900 leading-relaxed">
                    <strong>{LEDGER_LABEL}:</strong> All disbursements are hashed and publicly verifiable.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {NGO_DISBURSEMENTS.map((d) => (
                  <div key={d.id} className="mobile-card-compact space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-sm text-slate-900 flex-1">
                        {d.ngoName}
                      </h3>
                      <span className="text-lg font-bold text-emerald-600">
                        ${d.amount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="mobile-badge mobile-badge-primary">{d.festival}</span>
                      <span className="text-xs text-slate-500">
                        {new Date(d.date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-3 font-mono text-xs text-slate-600 break-all">
                      {d.txHash}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
