"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";
import { Leaf, ArrowRight } from "lucide-react";

const ROLES: { role: Role; label: string; emoji: string; desc: string; color: string }[] = [
  { role: "buyer",   label: "Buyer",       emoji: "🛍️", desc: "Browse traceable festival craft",  color: "#2563eb" },
  { role: "artisan", label: "Artisan",     emoji: "🎨", desc: "Claim waste, create products",      color: "#f43f5e" },
  { role: "lgu",     label: "LGU Officer", emoji: "🏛️", desc: "Scan waste, log batches",           color: "#f59e0b" },
];

export default function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = (role: Role) => {
    login(role);
    router.push("/");
  };

  return (
    <div
      className="app-shell-backdrop min-h-screen w-full flex items-center justify-center p-4"
    >
      <div
        className="w-full max-w-[420px] soft-panel login-card rounded-[36px] px-6 pt-10 pb-8"
        style={{
          boxShadow: "0 0 0 8px rgba(255,255,255,0.6), 0 24px 64px -16px rgba(37,99,235,0.18), 0 16px 40px -12px rgba(15,23,42,0.12)",
        }}
      >
        {/* ── Brand header ── */}
        <div className="text-center mb-10">
          <div
            className="w-[60px] h-[60px] rounded-[20px] flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{
              background: "linear-gradient(145deg, #3b82f6 0%, #2563eb 100%)",
              boxShadow: "0 12px 28px rgba(37,99,235,0.28), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <Leaf size={26} color="white" strokeWidth={2} />
          </div>

          <div className="space-y-3">
            <h1 className="text-[clamp(22px,6vw,28px)] font-extrabold tracking-tight text-slate-900 leading-tight">
              HeriTech
            </h1>
            <p className="text-[13px] text-slate-500 leading-relaxed font-medium max-w-[260px] mx-auto">
              Circular digital system for festival waste across Asia. Choose your role to continue.
            </p>
          </div>
        </div>

        {/* ── Role selection ── */}
        <div className="flex flex-col gap-3 mb-8">
          {ROLES.map(({ role, label, emoji, desc, color }) => (
            <button
              key={role}
              id={`login-${role}`}
              onClick={() => handleLogin(role)}
              className="clay-card flex items-center gap-3 px-4 py-4 text-left transition-all cursor-pointer group"
              style={{ minHeight: 72, border: "1.5px solid rgba(226,232,240,0.7)" }}
            >
              {/* Emoji orb */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-[24px] shrink-0"
                style={{
                  background: `${color}10`,
                  border: `1.5px solid ${color}20`,
                  boxShadow: `0 4px 12px ${color}15`,
                }}
              >
                {emoji}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-[14px] text-slate-900 leading-snug">{label}</p>
                <p className="text-[12px] text-slate-500 mt-0.5 font-medium leading-snug">{desc}</p>
              </div>

              {/* Arrow */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white transition-transform duration-200 group-hover:translate-x-0.5"
                style={{
                  background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                  boxShadow: `0 4px 10px ${color}30`,
                }}
              >
                <ArrowRight size={13} strokeWidth={2.5} />
              </div>
            </button>
          ))}
        </div>

        {/* ── Festival coverage ── */}
        <div
          className="text-center px-5 py-4 rounded-2xl"
          style={{ background: "rgba(241,245,249,0.7)", border: "1.5px solid rgba(226,232,240,0.7)" }}
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.14em] mb-3">
            🌏 Active Festival Coverage
          </p>
          <div className="flex justify-center gap-2 flex-wrap mb-2">
            {["🇹🇷", "🇮🇳", "🇹🇭", "🇹🇼", "🇮🇩", "🇵🇭", "🇯🇵"].map((flag) => (
              <span key={flag} className="text-[22px] transition-transform hover:scale-110">
                {flag}
              </span>
            ))}
          </div>
          <p className="text-[10.5px] text-slate-400 font-medium leading-relaxed text-center">
            Turkey · India · Thailand · Taiwan · Indonesia · Philippines · Japan
          </p>
        </div>
      </div>
    </div>
  );
}
