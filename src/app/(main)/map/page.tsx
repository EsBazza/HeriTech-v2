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
  () =>
    import("@/components/heritech/map/MaterialMap").then(
      (m) => m.MaterialMap,
    ),
  { ssr: false, loading: () => <MapPlaceholder /> },
);

function MapPlaceholder() {
  return (
    <div
      className="scan-viewport"
      style={{ minHeight: 320, borderRadius: 28 }}
    >
      <div className="text-center text-white">
        <MapPin size={32} className="mx-auto mb-2 opacity-50 animate-bounce" />
        <p className="text-xs font-semibold opacity-70">Loading Leaflet Map…</p>
      </div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  available: "#10b981",
  reserved: "#f59e0b",
  claimed: "#64748b",
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

  const filtered = batches.filter(
    (b) => filter === "all" || b.status === filter,
  );

  const handleReserve = () => {
    if (!selectedBatch || !user) return;
    reserveBatch(selectedBatch.id, user.id);
    setSelectedBatch(null);
    setToast("✅ Material Batch Reserved! Collect within 48h.");
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="relative min-h-full pb-4">
      <div className="px-4 pt-4 pb-4 space-y-4">
        <div className="hero-panel section-panel overflow-hidden relative px-4 py-5">
          <div className="absolute -top-10 -right-8 w-28 h-28 rounded-full bg-purple-500/14 blur-2xl" />
          <div className="absolute -bottom-10 -left-8 w-28 h-28 rounded-full bg-emerald-500/14 blur-2xl" />

          <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl hero-orb flex items-center justify-center border border-white/75">
                <MapPin size={18} className="text-purple-700" />
              </div>
              <div>
                <p className="section-kicker mb-1 text-purple-700">
                  Interactive Materials Map
                </p>
                <h1 className="section-title">
                  Festival waste batches
                </h1>
              </div>
            </div>
            <span className="badge-pill bg-purple-100/90 text-purple-800 text-[10px] font-bold border border-white/70">
              {role === "lgu" ? "🏛️ Full Mgmt" : "🎨 Reserve Mode"}
            </span>
          </div>

          <p className="section-copy max-w-[26ch] relative z-10">
            {batches.length} tracked material batches across {FESTIVALS.length} festivals.
          </p>

          <div className="flex flex-wrap gap-2 pt-4 relative z-10">
            {(["all", "available", "reserved", "claimed"] as const).map((f) => (
              <button
                key={f}
                id={`map-filter-${f}`}
                onClick={() => setFilter(f)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 capitalize cursor-pointer"
                style={{
                  minHeight: 36,
                  background:
                    filter === f
                      ? f === "all"
                        ? "#7c3aed"
                        : STATUS_COLORS[f]
                      : "rgba(255,255,255,0.85)",
                  color: filter === f ? "#ffffff" : "#4c1d95",
                  boxShadow: filter === f ? "0 4px 12px rgba(124,58,237,0.3)" : "none",
                }}
              >
                {f === "all" ? `All (${batches.length})` : `${f} (${batches.filter((b) => b.status === f).length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="section-panel p-3 space-y-4">
          <div className="overflow-hidden rounded-[28px] border border-white/70 shadow-md" style={{ height: 340 }}>
            <MaterialMap batches={filtered} onBatchClick={setSelectedBatch} />
          </div>

          {filtered.length === 0 ? (
            <div className="section-panel p-5 text-center">
              <p className="text-3xl mb-2">📍</p>
              <p className="font-extrabold text-sm text-slate-700">
                No batches in this category
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pb-2">
              {filtered.map((batch) => (
                <button
                  key={batch.id}
                  id={`batch-${batch.id}`}
                  onClick={() => setSelectedBatch(batch)}
                  className="section-panel p-3.5 text-left w-full cursor-pointer hover:border-purple-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div>
                      <p className="font-bold text-xs text-slate-900 leading-snug">
                        {batch.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {batch.festival} · {batch.country}
                      </p>
                    </div>
                    <span
                      className="badge-pill text-[10px] shrink-0 ml-2"
                      style={{
                        background: `${STATUS_COLORS[batch.status]}20`,
                        color: STATUS_COLORS[batch.status],
                        border: `1px solid ${STATUS_COLORS[batch.status]}40`,
                      }}
                    >
                      {batch.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs font-extrabold text-blue-600">
                      {batch.weightKg} kg
                    </span>
                    <span className="badge-pill badge-gray text-[10px]">
                      {batch.materialType}
                    </span>
                    <span className="badge-pill badge-eco text-[10px]">
                      {batch.condition}
                    </span>
                  </div>
                  <div className="mono-tech mt-2 text-[10px] text-slate-400 truncate">
                    TxHash: {batch.txHash}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Batch Detail Modal ── */}
      {selectedBatch && (
        <div className="dialog-overlay" onClick={() => setSelectedBatch(null)}>
          <div
            className="dialog-panel px-4 pt-2 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pt-3 pb-3">
              <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto" />
              <button
                onClick={() => setSelectedBatch(null)}
                aria-label="Close"
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <h2 className="text-lg font-extrabold text-slate-900 mb-1">
              {selectedBatch.title}
            </h2>

            <div className="flex gap-2 mb-3 flex-wrap">
              <span
                className="badge-pill text-[10px]"
                style={{
                  background: `${STATUS_COLORS[selectedBatch.status]}20`,
                  color: STATUS_COLORS[selectedBatch.status],
                }}
              >
                {selectedBatch.status}
              </span>
              <span className="badge-pill badge-primary text-[10px]">
                {selectedBatch.festival}
              </span>
              <span className="badge-pill badge-gray text-[10px]">
                {selectedBatch.country}
              </span>
            </div>

            <div className="clay-card-sm p-3 mb-3 grid grid-cols-2 gap-2 border border-white/70">
              {[
                { label: "Weight", value: `${selectedBatch.weightKg} kg` },
                { label: "Material", value: selectedBatch.materialType },
                { label: "Condition", value: selectedBatch.condition },
                { label: "Agreement ID", value: selectedBatch.releaseAgreementId },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {item.label}
                  </p>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {selectedBatch.aiInferredMaterial && (
              <div className="clay-card-sm p-3 mb-3 bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-bold text-emerald-800 mb-0.5">
                  🤖 Gemini AI Classification Log
                </p>
                <p className="text-xs text-emerald-900">
                  Material: <strong>{selectedBatch.aiInferredMaterial}</strong> · Condition: <strong>{selectedBatch.aiInferredCondition}</strong> ({( (selectedBatch.aiConfidence ?? 0.9) * 100 ).toFixed(0)}% confidence)
                </p>
              </div>
            )}

            <div className="mono-tech mb-4 p-2.5 clay-card-sm bg-slate-50 text-[10px]">
              <span className="font-bold text-slate-500">Tamper-Evident Hash: </span>
              <span className="break-all">{selectedBatch.txHash}</span>
            </div>

            {selectedBatch.status === "available" && role === "artisan" && (
              <button
                id={`reserve-batch-${selectedBatch.id}`}
                onClick={handleReserve}
                className="clay-button-artisan w-full text-xs font-bold cursor-pointer"
                style={{ height: 48 }}
              >
                🎨 Reserve This Waste Batch
              </button>
            )}

            {role === "buyer" && (
              <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <Lock size={14} /> Only verified Artisans can reserve waste batches.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className="toast">
            <CheckCircle size={18} className="text-emerald-500 shrink-0" />
            <span className="text-xs font-bold text-slate-800">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
