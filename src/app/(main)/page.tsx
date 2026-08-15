"use client";

import { useState } from "react";
import { ClayCard } from "@/components/heritech/clay/ClayCard";
import { EscrowBreakdown } from "@/components/heritech/escrow/EscrowBreakdown";
import { useProductStore } from "@/stores/productStore";
import { useAuthStore } from "@/stores/authStore";
import type { Product, Role } from "@/lib/types";
import { Search, X, ShoppingBag, CheckCircle, Leaf, UserCheck } from "lucide-react";
import { GLOBAL_STATS } from "@/lib/mock-data";

const FESTIVAL_EMOJIS: Record<string, string> = {
  "Yi Peng":                    "🏮",
  "Pingxi Sky Lantern Festival": "🕯️",
  "Bali Kite Festival":         "🪁",
  "Aomori Nebuta Matsuri":      "🎆",
  "Ganesh Chaturthi":           "🪷",
  "Panagbenga Festival":        "🌺",
  Nowruz:                       "🌸",
};

const ROLE_LABELS: Record<Role, string> = {
  buyer:   "🛍️ Buyer",
  artisan: "🎨 Artisan",
  lgu:     "🏛️ LGU",
};

const STATS = [
  { label: "kg diverted", value: (s: typeof GLOBAL_STATS) => `${(s.totalKgDiverted / 1000).toFixed(1)}t`,   color: "text-blue-600"   },
  { label: "artisans",    value: (s: typeof GLOBAL_STATS) => String(s.totalArtisans),                         color: "text-emerald-600" },
  { label: "countries",   value: (s: typeof GLOBAL_STATS) => String(s.countriesReached),                      color: "text-violet-600"  },
  { label: "donated",     value: (s: typeof GLOBAL_STATS) => `$${(s.totalNgoDonated / 1000).toFixed(1)}k`,   color: "text-amber-600"   },
];

export default function MarketplacePage() {
  const { products, buyProduct } = useProductStore();
  const { user, role, switchRole } = useAuthStore();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filters = ["All", "Bamboo", "Rice Paper", "Floral / Organic", "Cotton Cloth"];

  const filtered = products.filter((p) => {
    const matchSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.festival.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "All" || p.materialTags.some((t) => t === activeFilter);
    return matchSearch && matchFilter;
  });

  const handleBuy = () => {
    if (!selectedProduct) return;
    buyProduct(selectedProduct.id, user?.id ?? "guest");
    setSelectedProduct(null);
    setToast("🎉 Purchase complete! Your HeriTech Pass is issued.");
    setTimeout(() => setToast(null), 4000);
  };

  const nextRole: Record<Role, Role> = { buyer: "artisan", artisan: "lgu", lgu: "buyer" };

  return (
    <div className="mobile-page">
      {/* ── HERO SECTION ── */}
      <div className="mobile-header">
        <div className="page-hero" style={{ 
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(226,232,240,0.7)"
        }}>
          {/* Background effects */}
          <div className="pointer-events-none absolute -top-12 -right-10 w-36 h-36 rounded-full bg-blue-500/06 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-emerald-500/05 blur-3xl" />

          <div className="hero-header relative z-10">
            <div className="hero-main">
              <div className="hero-icon" style={{ 
                background: "rgba(255,255,255,0.95)",
                boxShadow: "0 4px 12px rgba(37,99,235,0.08)"
              }}>
                <Leaf size={20} className="text-blue-600" />
              </div>
              <div className="hero-text">
                <p className="section-kicker text-blue-600">HeriTech Market</p>
                <h1 className="section-title">Festival marketplace</h1>
              </div>
            </div>

            <button
              onClick={() => switchRole(nextRole[role])}
              className="hero-badge mobile-btn mobile-btn-small mobile-btn-secondary"
              style={{ minWidth: 64 }}
            >
              <UserCheck size={14} />
              <span className="text-[10px] font-bold">Switch</span>
            </button>
          </div>

          <div className="hero-description relative z-10">
            <p className="section-copy">
              Browse reclaimed festival materials, compare splits instantly, and buy from verified artisans.
            </p>
          </div>

          <div className="hero-stats relative z-10">
            {STATS.map((s) => (
              <div key={s.label} className="stat-card">
                <div className={`stat-value ${s.color}`}>
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

      {/* ── SEARCH + FILTERS ── */}
      <div className="mobile-content">
        <div className="mobile-card-compact">
          {/* Search bar */}
          <div className="mb-4">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search festivals, materials, countries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mobile-input w-full pl-11 pr-12"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X size={16} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`filter-chip ${activeFilter === f ? 'filter-chip-active' : 'filter-chip-inactive'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Results meta */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-500">
              {filtered.length} items available
            </span>
            <span className="text-xs font-bold text-blue-600">
              70 / 15 / 15 split
            </span>
          </div>
        </div>

        {/* ── PRODUCT LIST ── */}
        {filtered.length === 0 ? (
          <div className="mobile-card text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="font-bold text-sm text-slate-700 mb-2">No products found</p>
            <p className="text-xs text-slate-500">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((product) => (
              <ClayCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── PRODUCT DETAIL SHEET ── */}
      {selectedProduct && (
        <div
          className="dialog-overlay animate-fade-in"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="dialog-panel px-6 pt-3 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-6">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Hero image */}
            <div
              className="rounded-[22px] h-52 flex items-center justify-center mb-6 relative overflow-hidden border border-slate-100"
              style={{
                background:
                  "radial-gradient(ellipse 70% 70% at 40% 35%, rgba(255,255,255,0.96), rgba(255,255,255,0.1) 70%), linear-gradient(145deg, #c7d9ff 0%, #e0e9ff 100%)",
                boxShadow: "0 4px 20px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              <span className="text-7xl drop-shadow-sm select-none transition-transform duration-200 hover:scale-105">
                {FESTIVAL_EMOJIS[selectedProduct.festival] ?? "🌿"}
              </span>
              <div className="absolute bottom-4 left-4">
                <span className="badge-pill badge-eco bg-white/95 backdrop-blur-md shadow-sm border-0">
                  🌱 {selectedProduct.kgDiverted}kg diverted
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="badge-pill badge-primary">{selectedProduct.festival}</span>
              <span className="badge-pill badge-gray">{selectedProduct.country}</span>
            </div>

            {/* Title + desc */}
            <h2 className="text-[20px] font-extrabold text-slate-900 leading-tight mb-2">
              {selectedProduct.title}
            </h2>
            <p className="text-[13px] text-slate-500 leading-relaxed mb-6 font-medium">
              {selectedProduct.description}
            </p>

            {/* Provenance */}
            <div className="clay-card-sm px-4 py-4 mb-6">
              <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                📍 Tamper-Evident Provenance
              </p>
              <div className="mono-tech font-bold text-[11px] mb-1">
                Batch ID: {selectedProduct.sourceBatchId}
              </div>
              <div className="text-[12px] text-slate-500 font-medium">
                Crafted by{" "}
                <span className="text-slate-800 font-bold">{selectedProduct.artisanName}</span>
              </div>
            </div>

            {/* Escrow breakdown */}
            <div className="mb-6">
              <EscrowBreakdown
                price={selectedProduct.price}
                ngoFundName={selectedProduct.split.ngoFundName}
              />
            </div>

            {/* Buy button */}
            <button
              onClick={handleBuy}
              className="mobile-btn mobile-btn-primary mobile-btn-large w-full"
              disabled={selectedProduct.stock === 0}
            >
              <ShoppingBag size={18} />
              {selectedProduct.stock === 0
                ? "Out of Stock"
                : `Buy for $${selectedProduct.price}`}
            </button>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="toast-container">
          <div className="toast">
            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
            <span className="text-[12.5px] font-bold text-slate-800">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
