"use client";

import dynamic from "next/dynamic";
import { useBatchStore } from "@/stores/batchStore";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import type { MaterialBatch } from "@/lib/types";
import { MapPin, X, CheckCircle, Lock } from "lucide-react";
import { FESTIVALS } from "@/lib/mock-data";
import { RoleGate } from "@/components/heritech/RoleGate";

const MaterialMap = dynamic(
  () => import("@/components/heritech/map/MaterialMap").then((m) => m.MaterialMap),
  { ssr: false, loading: () => <MapPlaceholder /> },
);

function MapPlaceholder() {
  return (
    <div className="scan-viewport" style={{ minHeight: 320, borderRadius: 22 }}>
      <div className="text-center text-white">
        <MapPin size={30} className="mx-auto mb-2.5 opacity-40 animate-bounce" />
        <p className="text-[12px] font-semibold opacity-60">Loading Leaflet Map…</p>
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  available: "#10b981",
  reserved:  "#f59e0b",
  claimed:   "#94a3b8",
};

const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  reserved:  "Reserved",
  claimed:   "Claimed",
};

export default function MapPage() {
  return (
    <RoleGate allow={["artisan", "lgu"]}>
      <MapPageContent />
    </RoleGate>
  );
}

function MapPageContent() {
  const { batches, reserveBatch } = useBatchStore();
  const { user, role } = useAuthStore();
  const [selectedBatch, setSelectedBatch] = useState<MaterialBatch | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "available" | "reserved" | "claimed">("all");

  const filtered = batches.filter((b) => filter === "all" || b.status === filter);

  const handleReserve = () => {
    if (!selectedBatch || !user) return;
    reserveBatch(selectedBatch.id, user.id);
    setSelectedBatch(null);
    setToast("✅ Material Batch Reserved! Collect within 48h.");
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="relative min-h-full">

      {/* ── HERO ── */}
      <div className="px-4 pt-5 pb-5">
        <div className="hero-panel relative overflow-hidden px-5 py-6" style={{ borderRadius: 24 }}>
          <div className="pointer-events-none absolute -top-10 -right-8 w-32 h-32 rounded-full bg-purple-400/08 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-emerald-400/07 blur-3xl" />

          <div className="page-header">
            <div className="page-header-row">
              <div className="page-header-content">
                <div
                  className="w-10 h-10 rounded-2xl hero-orb flex items-center justify-center shrink-0 border border-white/80"
                  style={{ boxShadow: "0 8px 20px rgba(124,58,237,0.10)" }}
                >
                  <MapPin size={17} className="text-purple-700" />
                </div>
                <div className="page-header-text">
                  <p className="section-kicker" style={{ color: "#7c3aed" }}>Interactive Materials Map</p>
                  <h1 className="section-title">Festival waste batches</h1>
                </div>
              </div>
              <span
                className="page-header-badge badge-pill text-[10px] font-bold shrink-0"
                style={{ background: "rgba(124,58,237,0.07)", color: "#7c3aed", border: "1.5px solid rgba(124,58,237,0.15)" }}
              >
                {role === "lgu" ? "🏛️ Full Mgmt" : "🎨 Reserve Mode"}
              </span>
            </div>

            <p className="section-copy">
              {batches.length} tracked material batches across {FESTIVALS.length} festivals.
            </p>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto route-chip-scroll pb-0.5 relative z-10 mt-5">
            {(["all", "available", "reserved", "claimed"] as const).map((f) => {
              const count = f === "all" ? batches.length : batches.filter((b) => b.status === f).length;
              const activeColor = f === "all" ? "#7c3aed" : STATUS_COLORS[f];
              return (
                <button
                  key={f}
                  id={`map-filter-${f}`}
                  onClick={() => setFilter(f)}
                  className="shrink-0 px-3.5 py-2 rounded-full text-[11.5px] font-bold transition-all duration-180 cursor-pointer capitalize"
                  style={{
                    height: 36,
                    background: filter === f ? activeColor : "rgba(255,255,255,0.9)",
                    color:      filter === f ? "#ffffff" : "#64748b",
                    border:     filter === f ? "none" : "1.5px solid rgba(226,232,240,0.9)",
                    boxShadow:  filter === f ? `0 4px 12px ${activeColor}30` : "0 1px 3px rgba(15,23,42,0.04)",
                  }}
                >
                  {f === "all" ? `All (${count})` : `${STATUS_LABELS[f]} (${count})`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAP + LIST ── */}
      <div className="px-4 pb-8 space-y-4">
        <div className="section-panel p-4">
          {/* Leaflet map */}
          <div className="overflow-hidden rounded-[18px] border border-slate-100" style={{ height: "clamp(240px, 45vw, 320px)" }}>
            <MaterialMap batches={filtered} onBatchClick={setSelectedBatch} />
          </div>
        </div>

        {/* Batch list */}
        {filtered.length === 0 ? (
          <div className="section-panel p-8 text-center">
            <p className="text-3xl mb-3">📍</p>
            <p className="font-bold text-[13px] text-slate-700">No batches in this category</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((batch) => (
              <button
                key={batch.id}
                id={`batch-${batch.id}`}
                onClick={() => setSelectedBatch(batch)}
                className="clay-card px-5 py-4 text-left w-full cursor-pointer flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-[13.5px] text-slate-900 leading-snug truncate">
                      {batch.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">
                      {batch.festival} · {batch.country}
                    </p>
                  </div>
                  <span
                    className="badge-pill text-[10px] shrink-0"
                    style={{
                      background: `${STATUS_COLORS[batch.status]}10`,
                      color: STATUS_COLORS[batch.status],
                      border: `1.5px solid ${STATUS_COLORS[batch.status]}25`,
                    }}
                  >
                    {batch.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-extrabold text-blue-600">
                    {batch.weightKg} kg
                  </span>
                  <span className="badge-pill badge-gray">{batch.materialType}</span>
                  <span className="badge-pill badge-eco">{batch.condition}</span>
                </div>

                <div className="mono-tech text-[10px] text-slate-400 truncate pt-2.5 border-t border-slate-100">
                  TxHash: {batch.txHash}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Batch Detail Modal ── */}
      {selectedBatch && (
        <div className="dialog-overlay animate-fade-in" onClick={() => setSelectedBatch(null)}>
          <div
            className="dialog-panel px-6 pt-3 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle + close */}
            <div className="flex items-center justify-between pt-3 pb-4">
              <div className="flex-1" />
              <div className="w-10 h-1 rounded-full bg-slate-200" />
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => setSelectedBatch(null)}
                  aria-label="Close"
                  className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <h2 className="text-[20px] font-extrabold text-slate-900 mb-3 leading-tight">
              {selectedBatch.title}
            </h2>

            <div className="flex gap-2 mb-5 flex-wrap">
              <span
                className="badge-pill"
                style={{
                  background: `${STATUS_COLORS[selectedBatch.status]}10`,
                  color: STATUS_COLORS[selectedBatch.status],
                  border: `1.5px solid ${STATUS_COLORS[selectedBatch.status]}25`,
                }}
              >
                {selectedBatch.status}
              </span>
              <span className="badge-pill badge-primary">{selectedBatch.festival}</span>
              <span className="badge-pill badge-gray">{selectedBatch.country}</span>
            </div>

            <div
              className="clay-card-sm grid grid-cols-2 gap-4 px-4 py-4 mb-5"
            >
              {[
                { label: "Weight",       value: `${selectedBatch.weightKg} kg` },
                { label: "Material",     value: selectedBatch.materialType      },
                { label: "Condition",    value: selectedBatch.condition          },
                { label: "Agreement ID", value: selectedBatch.releaseAgreementId },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1">{item.label}</p>
                  <p className="text-[12.5px] font-extrabold text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>

            {selectedBatch.aiInferredMaterial && (
              <div
                className="px-4 py-3.5 rounded-2xl mb-5"
                style={{ background: "rgba(209,250,229,0.5)", border: "1.5px solid rgba(52,211,153,0.25)" }}
              >
                <p className="text-[11px] font-bold text-emerald-800 mb-1.5">🤖 Gemini AI Classification Log</p>
                <p className="text-[12px] text-emerald-900 leading-relaxed font-medium">
                  Material: <strong>{selectedBatch.aiInferredMaterial}</strong> · Condition: <strong>{selectedBatch.aiInferredCondition}</strong>{" "}
                  ({((selectedBatch.aiConfidence ?? 0.9) * 100).toFixed(0)}% confidence)
                </p>
              </div>
            )}

            <div className="mono-tech mb-6 px-4 py-3.5 rounded-2xl text-[10px]"
              style={{ background: "rgba(241,245,249,0.8)", border: "1px solid rgba(226,232,240,0.8)" }}
            >
              <span className="font-bold text-slate-400 block mb-1">Tamper-Evident Hash:</span>
              <span className="break-all text-slate-500 select-all leading-normal">{selectedBatch.txHash}</span>
            </div>

            {selectedBatch.status === "available" && role === "artisan" && (
              <button
                id={`reserve-batch-${selectedBatch.id}`}
                onClick={handleReserve}
                className="clay-button-artisan w-full text-[13px] font-bold cursor-pointer"
                style={{ height: 50 }}
              >
                🎨 Reserve This Waste Batch
              </button>
            )}

            {role === "buyer" && (
              <div
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-[12px] text-slate-500 font-medium"
                style={{ background: "rgba(241,245,249,0.8)", border: "1.5px solid rgba(226,232,240,0.8)" }}
              >
                <Lock size={13} className="text-slate-400 shrink-0" />
                Only verified Artisans can reserve waste batches.
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <div className="toast">
            <CheckCircle size={15} className="text-emerald-500 shrink-0" />
            <span className="text-[12.5px] font-bold text-slate-800">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
