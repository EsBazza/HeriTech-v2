"use client";

import { useState } from "react";
import {
  LEADERBOARD,
  ARTISAN_LEADERBOARD,
  NGO_DISBURSEMENTS,
  GLOBAL_STATS,
} from "@/lib/mock-data";
import { Trophy, Leaf, Globe, TrendingUp } from "lucide-react";
import { LEDGER_LABEL } from "@/lib/constants";

type Tab = "leaderboard" | "donations";

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
    <div className="relative min-h-full pb-4">
      <div className="px-4 pt-4 pb-4 space-y-4">
        <div className="hero-panel section-panel overflow-hidden relative px-4 py-5">
          <div className="absolute -top-10 -right-8 w-28 h-28 rounded-full bg-emerald-500/14 blur-2xl" />
          <div className="absolute -bottom-10 -left-8 w-28 h-28 rounded-full bg-blue-500/12 blur-2xl" />

          <div className="flex items-center gap-2 mb-2 relative z-10">
            <div className="w-10 h-10 rounded-2xl hero-orb flex items-center justify-center border border-white/75">
              <Leaf size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="section-kicker mb-1 text-emerald-600">
                Impact Ledger
              </p>
              <h1 className="section-title">Global impact</h1>
            </div>
          </div>

          <p className="section-copy max-w-[24ch] relative z-10">
            Every kg counted. Every dollar traced.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4 relative z-10">
            {[
              {
                icon: "🌿",
                label: "Waste diverted",
                value: `${(GLOBAL_STATS.totalKgDiverted / 1000).toFixed(1)} tonnes`,
                color: "#10b981",
              },
              {
                icon: "🎨",
                label: "Artisans supported",
                value: GLOBAL_STATS.totalArtisans,
                color: "#ef4444",
              },
              {
                icon: "💰",
                label: "NGO donated",
                value: `$${GLOBAL_STATS.totalNgoDonated.toLocaleString()}`,
                color: "#f59e0b",
              },
              {
                icon: "🛍️",
                label: "Orders placed",
                value: GLOBAL_STATS.totalOrders.toLocaleString(),
                color: "#2563eb",
              },
            ].map((s) => (
              <div key={s.label} className="route-stat p-3 rounded-2xl text-left">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-lg font-extrabold" style={{ color: s.color }}>
                  {s.value}
                </div>
                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-[0.12em] mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-panel p-3">
          <div className="clay-input-inset flex p-1 rounded-[22px] mb-4">
            {(["leaderboard", "donations"] as Tab[]).map((t) => (
              <button
                key={t}
                id={`impact-tab-${t}`}
                onClick={() => setTab(t)}
                className="flex-1 py-2.5 text-sm font-bold rounded-[18px] transition-all duration-200 capitalize"
                style={{
                  background: tab === t ? "var(--color-tile)" : "transparent",
                  color:
                    tab === t ? "var(--color-primary)" : "var(--color-text-secondary)",
                  boxShadow:
                    tab === t
                      ? "4px 6px 12px rgba(165,175,215,0.24), inset -2px -2px 4px rgba(210,218,240,0.45), inset 2px 2px 4px rgba(255,255,255,0.82)"
                      : "none",
                }}
              >
                {t === "leaderboard" ? "🏆 Leaderboard" : "💸 Donations"}
              </button>
            ))}
          </div>

          {tab === "leaderboard" && (
            <>
              <div className="flex gap-2 mb-4">
                {(["buyer", "artisan"] as const).map((r) => (
                  <button
                    key={r}
                    id={`leaderboard-${r}`}
                    onClick={() => setLeaderRole(r)}
                    className="flex-1 py-2.5 text-xs font-bold rounded-full transition-all duration-200 capitalize"
                    style={{
                      minHeight: 40,
                      background:
                        leaderRole === r
                          ? r === "buyer"
                            ? "var(--color-primary)"
                            : "var(--color-artisan)"
                          : "var(--color-tile)",
                      color: leaderRole === r ? "white" : "var(--color-text-secondary)",
                      boxShadow:
                        leaderRole === r
                          ? "4px 6px 12px rgba(37,99,235,0.25)"
                          : "3px 5px 10px rgba(165,175,215,0.3)",
                    }}
                  >
                    {r === "buyer" ? "🛍️ Buyers" : "🎨 Artisans"}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {leaderboard.map((entry) => (
                  <div key={entry.userId} className="section-panel p-4 flex items-center gap-3">
                    <div
                      className="text-2xl w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          entry.rank === 1
                            ? "linear-gradient(135deg, #fef3c7, #fcd34d)"
                            : entry.rank === 2
                              ? "linear-gradient(135deg, #f1f5f9, #cbd5e1)"
                              : entry.rank === 3
                                ? "linear-gradient(135deg, #ffedd5, #fb923c)"
                                : "var(--color-inset)",
                      }}
                    >
                      {rankEmoji(entry.rank)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate text-slate-900">{entry.name}</p>
                      <p className="text-xs text-slate-500">
                        {leaderRole === "buyer"
                          ? `${entry.itemsPurchased} items • `
                          : `${entry.itemsListed} listed • `}
                        <span className="font-bold text-emerald-600">{entry.kgDiverted}kg</span>{" "}
                        diverted
                      </p>
                    </div>
                    <TrendingUp size={16} style={{ color: "var(--color-eco)", flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "donations" && (
            <>
              <div className="route-stat p-3 mb-4 flex items-center gap-2">
                <Globe size={14} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                <p className="text-xs text-slate-500">
                  <span className="font-bold text-slate-900">{LEDGER_LABEL}:</span>{" "}
                  All disbursements are hashed and publicly verifiable.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {NGO_DISBURSEMENTS.map((d) => (
                  <div key={d.id} className="section-panel p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-sm text-slate-900">{d.ngoName}</h3>
                      <span className="text-lg font-extrabold text-emerald-600">
                        ${d.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge-pill badge-primary text-[10px]">{d.festival}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(d.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="mono-tech mt-2 truncate">{d.txHash}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
