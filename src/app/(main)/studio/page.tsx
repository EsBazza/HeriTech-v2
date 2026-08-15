"use client";

import { useState } from "react";
import { useBatchStore } from "@/stores/batchStore";
import { useProductStore } from "@/stores/productStore";
import { useAuthStore } from "@/stores/authStore";
import type { Product } from "@/lib/types";
import { ESCROW_SPLIT } from "@/lib/constants";
import { Palette, Plus, Link2, CheckCircle, Package } from "lucide-react";
import { RoleGate } from "@/components/heritech/RoleGate";

export default function StudioPage() {
  return (
    <RoleGate allow={["artisan"]}>
      <StudioContent />
    </RoleGate>
  );
}

function StudioContent() {
  const { batches } = useBatchStore();
  const { addProduct } = useProductStore();
  const { user } = useAuthStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [ngoFundName, setNgoFundName] = useState("Environmental NGO Fund");
  const [toast, setToast] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const artisanBatches = batches.filter(
    (b) =>
      (b.status === "reserved" || b.status === "claimed") &&
      (b.reservedByArtisanId === user?.id || b.claimedByArtisanId === user?.id),
  );
  const allAvailable = batches.filter((b) => b.status === "available");
  const selectedBatch = batches.find((b) => b.id === selectedBatchId) ?? null;

  const handlePublish = () => {
    if (!title || !price || !selectedBatchId) {
      setToast("⚠️ Please fill in all required fields.");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const product: Product = {
      id: `prod-${Date.now()}`,
      title,
      description: description || "Hand-crafted upcycled product traced to festival waste.",
      price: Number(price),
      images: [],
      artisanId: user?.id ?? "usr-art-001",
      artisanName: user?.name ?? "Priya Mehta",
      sourceBatchId: selectedBatchId,
      materialTags: selectedBatch
        ? [selectedBatch.materialType, selectedBatch.festival, selectedBatch.country]
        : ["Upcycled"],
      stock: 5,
      split: {
        artisanPct: ESCROW_SPLIT.ARTISAN * 100,
        platformPct: ESCROW_SPLIT.PLATFORM * 100,
        ngoPct: ESCROW_SPLIT.NGO * 100,
        ngoFundName,
      },
      festival: selectedBatch?.festival ?? "Yi Peng",
      country: selectedBatch?.country ?? "Thailand",
      kgDiverted: Number(((selectedBatch?.weightKg ?? 10) * 0.05).toFixed(1)),
    };

    addProduct(product);
    setDone(true);
    setToast("🎉 Upcycled Product Listed in Marketplace!");
    setTimeout(() => setToast(null), 4000);
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setSelectedBatchId("");
    setNgoFundName("Environmental NGO Fund");
    setDone(false);
  };

  return (
    <div className="relative min-h-full">
      <div className="px-5 pt-6 pb-8 space-y-4">

        {/* ── HERO ── */}
        <div className="hero-panel relative overflow-hidden px-5 py-6" style={{ borderRadius: 24 }}>
          <div className="pointer-events-none absolute -top-10 -right-8 w-32 h-32 rounded-full bg-rose-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-orange-400/08 blur-3xl" />

          <div className="page-header">
            <div className="page-header-row">
              <div className="page-header-content">
                <div
                  className="w-10 h-10 rounded-2xl hero-orb flex items-center justify-center shrink-0 border border-white/80"
                  style={{ boxShadow: "0 8px 20px rgba(244,63,94,0.12)" }}
                >
                  <Palette size={17} className="text-rose-600" />
                </div>
                <div className="page-header-text">
                  <p className="section-kicker" style={{ color: "#f43f5e" }}>Artisan Studio</p>
                  <h1 className="section-title">Product creator & batch linker</h1>
                </div>
              </div>
              <span
                className="page-header-badge badge-pill text-[10px] font-bold shrink-0"
                style={{ background: "rgba(244,63,94,0.07)", color: "#e11d48", border: "1.5px solid rgba(244,63,94,0.15)" }}
              >
                🎨 Artisan Only
              </span>
            </div>

            <p className="section-copy">
              Link claimed waste batches to craft items with 70/15/15 escrow provenance.
            </p>
          </div>
        </div>

        {/* ── MAIN FORM or SUCCESS ── */}
        <div className="section-panel px-5 py-5">
          {done ? (
            <div className="text-center py-8">
              <div className="text-[44px] mb-4">🎨</div>
              <h3 className="font-extrabold text-[16px] text-slate-900 mb-2">Upcycled Product Listed!</h3>
              <p className="text-[12.5px] text-slate-500 mb-6 leading-relaxed max-w-[260px] mx-auto font-medium">
                Your item is now live in the marketplace with verifiable digital provenance.
              </p>
              <button
                id="studio-create-another"
                onClick={handleReset}
                className="clay-button-artisan px-8 text-[13px] font-bold cursor-pointer"
                style={{ height: 46 }}
              >
                List Another Product
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">

              {/* Step 1: Link batch */}
              <div className="clay-card px-5 py-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Link2 size={15} className="text-rose-500" />
                  <h2 className="font-extrabold text-[13.5px] text-slate-900">1. Link Source Waste Batch</h2>
                </div>

                {artisanBatches.length > 0 && (
                  <div className="space-y-2.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">
                      Your Reserved & Claimed Batches:
                    </p>
                    {artisanBatches.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBatchId(b.id)}
                        className="w-full clay-card-sm px-4 py-3.5 text-left transition-all cursor-pointer"
                        style={{
                          border: selectedBatchId === b.id
                            ? "2px solid rgba(244,63,94,0.6)"
                            : "1.5px solid rgba(226,232,240,0.7)",
                          background: selectedBatchId === b.id ? "rgba(244,63,94,0.04)" : "rgba(255,255,255,0.8)",
                        }}
                      >
                        <p className="font-extrabold text-[12.5px] text-slate-900 leading-snug">{b.title}</p>
                        <p className="text-[10.5px] text-slate-500 mt-1 font-medium">
                          {b.weightKg}kg · {b.materialType} · {b.festival}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">
                    Or select from system registry:
                  </p>
                  <select
                    id="studio-batch-select"
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="clay-input-inset w-full px-4 text-[12.5px] font-medium"
                    style={{ height: 46 }}
                  >
                    <option value="">Choose a batch to link…</option>
                    {allAvailable.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id} — {b.title} ({b.weightKg}kg {b.materialType})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedBatch && (
                  <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
                    style={{ background: "rgba(209,250,229,0.5)", border: "1.5px solid rgba(52,211,153,0.3)" }}
                  >
                    <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12.5px] font-extrabold text-emerald-900">Linked: {selectedBatch.id}</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                        {selectedBatch.title} ({selectedBatch.weightKg}kg from {selectedBatch.festival})
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Product details */}
              <div className="clay-card px-5 py-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Package size={15} className="text-blue-600" />
                  <h2 className="font-extrabold text-[13.5px] text-slate-900">2. Product Listing Details</h2>
                </div>

                <FormField label="Product Name *">
                  <input
                    id="studio-title"
                    type="text"
                    placeholder="e.g. Yi Peng Scaffolding Bamboo Bowl"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="clay-input-inset w-full px-4 text-[13px] font-medium"
                    style={{ height: 46 }}
                  />
                </FormField>

                <FormField label="Description & Origin Story">
                  <textarea
                    id="studio-description"
                    placeholder="Describe how this craft was created from reclaimed waste…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="clay-input-inset w-full px-4 py-3 text-[13px] font-medium"
                    rows={3}
                    style={{ resize: "none" }}
                  />
                </FormField>

                <FormField label="Price (USD) *">
                  <input
                    id="studio-price"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="e.g. 48.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    className="clay-input-inset w-full px-4 text-[13px] font-bold"
                    style={{ height: 46 }}
                  />
                </FormField>

                <FormField label="NGO Fund Partner Name">
                  <input
                    id="studio-ngo"
                    type="text"
                    placeholder="e.g. Thai River Conservation Fund"
                    value={ngoFundName}
                    onChange={(e) => setNgoFundName(e.target.value)}
                    className="clay-input-inset w-full px-4 text-[13px] font-medium"
                    style={{ height: 46 }}
                  />
                </FormField>

                {/* Escrow preview */}
                {price && (
                  <div
                    className="px-4 py-4 rounded-2xl flex flex-col gap-2.5"
                    style={{ background: "rgba(241,245,249,0.8)", border: "1.5px solid rgba(226,232,240,0.8)" }}
                  >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-0.5">
                      💰 70/15/15 Escrow Split Preview
                    </p>
                    {[
                      { label: "Artisan Share (70%)",    amt: (Number(price) * ESCROW_SPLIT.ARTISAN).toFixed(2),   color: "#e11d48" },
                      { label: "Platform Operations (15%)", amt: (Number(price) * ESCROW_SPLIT.PLATFORM).toFixed(2), color: "#2563eb" },
                      { label: `${ngoFundName} (15%)`,   amt: (Number(price) * ESCROW_SPLIT.NGO).toFixed(2),       color: "#b45309" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-slate-200/60 last:border-0">
                        <span className="text-[11.5px] text-slate-500 font-medium">{item.label}</span>
                        <span className="text-[13px] font-extrabold" style={{ color: item.color }}>${item.amt}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  id="studio-publish-btn"
                  onClick={handlePublish}
                  className="clay-button-artisan w-full text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer"
                  style={{ height: 50 }}
                >
                  <Plus size={16} />
                  Publish Product to Marketplace
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="toast-container">
          <div className="toast">
            <span className="text-[12.5px] font-bold text-slate-800">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.12em]">{label}</label>
      {children}
    </div>
  );
}
