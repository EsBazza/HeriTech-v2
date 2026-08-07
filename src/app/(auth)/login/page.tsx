"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";
import { Leaf } from "lucide-react";

const ROLES: { role: Role; label: string; emoji: string; desc: string; color: string }[] = [
  {
    role: "buyer",
    label: "Buyer",
    emoji: "🛍️",
    desc: "Browse traceable festival craft",
    color: "#2563eb",
  },
  {
    role: "artisan",
    label: "Artisan",
    emoji: "🎨",
    desc: "Claim waste, create products",
    color: "#ff6b6b",
  },
  {
    role: "lgu",
    label: "LGU Officer",
    emoji: "🏛️",
    desc: "Scan waste, log batches",
    color: "#f59e0b",
  },
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
      style={{
        maxWidth: 480,
        margin: "0 auto",
        minHeight: "100vh",
        background: "var(--color-surface)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      {/* Brand */}
      <div className="text-center mb-10">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{
            background: "var(--color-primary)",
            boxShadow: "6px 10px 24px rgba(37,99,235,0.35)",
          }}
        >
          <Leaf size={28} color="white" />
        </div>
        <h1
          className="text-3xl font-extrabold mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          HeriTech
        </h1>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)", maxWidth: 280, margin: "0 auto" }}
        >
          Circular digital system for festival waste across Asia. Choose your role to continue.
        </p>
      </div>

      {/* Role cards */}
      <div className="flex flex-col gap-3 mb-8">
        {ROLES.map(({ role, label, emoji, desc, color }) => (
          <button
            key={role}
            id={`login-${role}`}
            onClick={() => handleLogin(role)}
            className="clay-card p-5 flex items-center gap-4 text-left transition-all duration-200 hover:scale-[1.01]"
            style={{ cursor: "pointer", minHeight: 80 }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{
                background: `${color}18`,
                boxShadow: `3px 5px 12px ${color}30`,
              }}
            >
              {emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="font-extrabold text-base"
                style={{ color: "var(--color-text-primary)" }}
              >
                {label}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {desc}
              </p>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: color }}
            >
              →
            </div>
          </button>
        ))}
      </div>

      {/* Festival coverage */}
      <div
        className="clay-card-sm p-4 text-center"
        style={{ background: "var(--color-inset)" }}
      >
        <p
          className="text-xs font-semibold mb-2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          🌏 Active Festival Coverage
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          {["🇹🇷", "🇮🇳", "🇹🇭", "🇹🇼", "🇮🇩", "🇵🇭", "🇯🇵"].map((flag) => (
            <span key={flag} className="text-xl">
              {flag}
            </span>
          ))}
        </div>
        <p
          className="text-[10px] mt-2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Turkey · India · Thailand · Taiwan · Indonesia · Philippines · Japan
        </p>
      </div>
    </div>
  );
}
