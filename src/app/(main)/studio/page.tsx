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
    <div className="relative min-h-full pb-4">
      <div className="px-4 pt-4 pb-4 space-y-4">
        <div className="hero-panel section-panel overflow-hidden relative px-4 py-5">
          <div className="absolute -top-10 -right-8 w-28 h-28 rounded-full bg-rose-500/14 blur-2xl" />
          <div className="absolute -bottom-10 -left-8 w-28 h-28 rounded-full bg-orange-500/12 blur-2xl" />

          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl hero-orb flex items-center justify-center border border-white/75">
                <Palette size={18} className="text-rose-700" />
              </div>
              <div>
                <p className="section-kicker mb-1 text-rose-700">Artisan Studio</p>
                <h1 className="section-title">Product creator & batch linker</h1>
              </div>
            </div>
            <span className="badge-pill bg-rose-100/90 text-rose-800 text-[10px] font-bold border border-white/70">
              🎨 Artisan Only
            </span>
          </div>

          <p className="section-copy max-w-[28ch] relative z-10">
            Link claimed waste batches to craft items with 70/15/15 escrow provenance.
          </p>
        </div>

        <div className="section-panel p-4">
          {done ? (
            <div className="text-center py-2">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">
                Upcycled Product Listed!
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Your item is now live in the marketplace with verifiable digital provenance.
              </p>
              <button
                id="studio-create-another"
                onClick={handleReset}
                className="clay-button-artisan px-6 py-2 text-xs font-bold cursor-pointer"
                style={{ height: 42 }}
              >
                List Another Product
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="clay-card p-4 bg-white border border-white/70">
                <div className="flex items-center gap-1.5 mb-3">
                  <Link2 size={16} className="text-rose-500" />
                  <h2 className="font-bold text-xs text-slate-900">
                    1. Link Source Waste Batch
                  </h2>
                </div>

                {artisanBatches.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[11px] font-semibold text-slate-500 mb-2">
                      Your Reserved & Claimed Batches:
                    </p>
                    <div className="flex flex-col gap-2">
                      {artisanBatches.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBatchId(b.id)}
                          className={`clay-card-sm p-3 text-left transition-all cursor-pointer ${
                            selectedBatchId === b.id
                              ? "border-2 border-rose-500 bg-rose-50/40"
                              : "border border-slate-200"
                          }`}
                        >
                          <p className="font-bold text-xs text-slate-900">
                            {b.title}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {b.weightKg}kg · {b.materialType} · {b.festival}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
                    Or select any available batch from system registry:
                  </p>
                  <select
                    id="studio-batch-select"
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="clay-input-inset w-full px-3 text-xs"
                    style={{ height: 42 }}
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
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-emerald-600" />
                      <p className="text-xs font-bold text-emerald-900">
                        Linked Batch: {selectedBatch.id}
                      </p>
                    </div>
                    <p className="text-[10px] text-emerald-700 mt-0.5">
                      {selectedBatch.title} ({selectedBatch.weightKg}kg from {selectedBatch.festival})
                    </p>
                  </div>
                )}
              </div>

              <div className="clay-card p-4 bg-white flex flex-col gap-3.5 border border-white/70">
                <div className="flex items-center gap-1.5">
                  <Package size={16} className="text-blue-600" />
                  <h2 className="font-bold text-xs text-slate-900">
                    2. Product Listing Details
                  </h2>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    id="studio-title"
                    type="text"
                    placeholder="e.g. Yi Peng Scaffolding Bamboo Bowl"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="clay-input-inset w-full px-3 text-xs"
                    style={{ height: 42 }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description & Origin Story
                  </label>
                  <textarea
                    id="studio-description"
                    placeholder="Describe how this craft was created from reclaimed waste…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="clay-input-inset w-full px-3 py-2 text-xs"
                    rows={2}
                    style={{ resize: "none" }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (USD) *
                  </label>
                  <input
                    id="studio-price"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="e.g. 48.00"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="clay-input-inset w-full px-3 text-xs"
                    style={{ height: 42 }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NGO Fund Partner Name
                  </label>
                  <input
                    id="studio-ngo"
                    type="text"
                    placeholder="e.g. Thai River Conservation Fund"
                    value={ngoFundName}
                    onChange={(e) => setNgoFundName(e.target.value)}
                    className="clay-input-inset w-full px-3 text-xs"
                    style={{ height: 42 }}
                  />
                </div>

                {price && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-[11px] font-bold text-slate-500 mb-1.5">
                      💰 70/15/15 Escrow Split Preview
                    </p>
                    {[
                      {
                        label: "Artisan Share (70%)",
                        amt: (Number(price) * ESCROW_SPLIT.ARTISAN).toFixed(2),
                        color: "text-rose-600",
                      },
                      {
                        label: "Platform Operations (15%)",
                        amt: (Number(price) * ESCROW_SPLIT.PLATFORM).toFixed(2),
                        color: "text-blue-600",
                      },
                      {
                        label: `${ngoFundName} (15%)`,
                        amt: (Number(price) * ESCROW_SPLIT.NGO).toFixed(2),
                        color: "text-amber-600",
                      },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between text-xs mb-0.5">
                        <span className="text-slate-600 text-[11px]">{item.label}</span>
                        <span className={`font-extrabold ${item.color}`}>${item.amt}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  id="studio-publish-btn"
                  onClick={handlePublish}
                  className="clay-button-artisan w-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer mt-1"
                  style={{ height: 48 }}
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
            <span className="text-xs font-bold text-slate-800">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
