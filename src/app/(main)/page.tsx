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
  "Yi Peng": "🏮",
  "Pingxi Sky Lantern Festival": "🕯️",
  "Bali Kite Festival": "🪁",
  "Aomori Nebuta Matsuri": "🎆",
  "Ganesh Chaturthi": "🪷",
  "Panagbenga Festival": "🌺",
  Nowruz: "🌸",
};

const ROLE_EMOJIS: Record<Role, string> = {
  buyer: "🛍️ Buyer",
  artisan: "🎨 Artisan",
  lgu: "🏛️ LGU Officer",
};

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
    const matchFilter =
      activeFilter === "All" || p.materialTags.some((t) => t === activeFilter);
    return matchSearch && matchFilter;
  });

  const visibleCount = filtered.length;

  const handleBuy = () => {
    if (!selectedProduct) return;
    buyProduct(selectedProduct.id, user?.id ?? "guest");
    setSelectedProduct(null);
    setToast(`🎉 Purchase complete! Your HeriTech Pass is issued.`);
    setTimeout(() => setToast(null), 4000);
  };

  const nextRole: Record<Role, Role> = {
    buyer: "artisan",
    artisan: "lgu",
    lgu: "buyer",
  };

  return (
    <div className="relative min-h-full pb-4">
      <div className="px-4 pt-4 pb-4 space-y-4">
        <div className="hero-panel section-panel overflow-hidden relative px-4 py-5">
          <div className="absolute -top-10 -right-8 w-28 h-28 rounded-full bg-blue-500/14 blur-2xl" />
          <div className="absolute -bottom-10 -left-8 w-28 h-28 rounded-full bg-emerald-500/14 blur-2xl" />

          <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center hero-orb border border-white/75 shadow-[0_18px_30px_rgba(37,99,235,0.16)]">
                <Leaf size={18} className="text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="section-kicker mb-1">
                  HeriTech Market
                </p>
                <h1 className="section-title">
                  Festival marketplace
                </h1>
              </div>
            </div>

            <button
              onClick={() => switchRole(nextRole[role])}
              id="quick-role-toggle"
              className="route-stat flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-slate-700 transition-all cursor-pointer min-h-[38px]"
            >
              <UserCheck size={13} className="text-blue-600" />
              <span>{ROLE_EMOJIS[role]}</span>
              <span className="text-[10px] text-slate-400 font-medium">
                Demo Switch
              </span>
            </button>
          </div>

          <p className="section-copy max-w-[28ch] relative z-10">
            Browse reclaimed festival materials, compare the split instantly, and buy from verified artisans.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4 relative z-10">
            {[
              { label: "kg diverted", value: `${(GLOBAL_STATS.totalKgDiverted / 1000).toFixed(1)}t` },
              { label: "artisans", value: GLOBAL_STATS.totalArtisans },
              { label: "countries", value: GLOBAL_STATS.countriesReached },
              { label: "donated", value: `$${(GLOBAL_STATS.totalNgoDonated / 1000).toFixed(1)}k` },
            ].map((s) => (
              <div key={s.label} className="route-stat p-3 rounded-2xl text-center">
                <div className="text-base font-extrabold text-blue-600">{s.value}</div>
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.12em] mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-panel p-3 space-y-3">
          <div className="clay-input-inset flex items-center gap-2.5 px-3.5 h-12">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              id="marketplace-search"
              type="text"
              placeholder="Search festival, material, country…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent flex-1 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                <X size={14} className="text-slate-400" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                id={`filter-${f.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setActiveFilter(f)}
                className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer"
                style={{
                  minHeight: 36,
                  background: activeFilter === f ? "var(--color-primary)" : "rgba(255,255,255,0.92)",
                  color: activeFilter === f ? "#ffffff" : "#475569",
                  boxShadow: activeFilter === f
                    ? "4px 10px 18px rgba(37,99,235,0.28)"
                    : "2px 4px 10px rgba(148,163,184,0.18)",
                  border: activeFilter === f ? "none" : "1px solid rgba(255,255,255,0.8)",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
            <span>{visibleCount} items available</span>
            <span className="font-semibold text-blue-600">70 / 15 / 15 split shown at checkout</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="section-panel p-6 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-extrabold text-sm text-slate-700">No products found</p>
            <p className="text-xs text-slate-500 mt-1">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid gap-3">
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

      {selectedProduct && (
        <div className="dialog-overlay" onClick={() => setSelectedProduct(null)}>
          <div
                className="dialog-panel px-4 pt-2 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-12 h-1.5 rounded-full bg-slate-300" />
            </div>

            <div
              className="rounded-[28px] h-40 flex items-center justify-center mb-4 relative overflow-hidden border border-white/70"
              style={{
                background:
                  "radial-gradient(circle at 30% 22%, rgba(255,255,255,0.96), rgba(255,255,255,0.18) 34%), linear-gradient(145deg, #d7e2ff 0%, #cbd7ff 100%)",
              }}
            >
              <span className="text-6xl drop-shadow-sm">
                {FESTIVAL_EMOJIS[selectedProduct.festival] ?? "🌿"}
              </span>
              <div className="absolute bottom-3 left-3">
                <span className="badge-pill badge-eco bg-white/90">
                  🌱 {selectedProduct.kgDiverted}kg diverted
                </span>
              </div>
            </div>

            <div className="mb-1 flex items-center gap-2 flex-wrap">
              <span className="badge-pill badge-primary text-[10px]">
                {selectedProduct.festival}
              </span>
              <span className="badge-pill badge-gray text-[10px]">
                {selectedProduct.country}
              </span>
            </div>

            <h2 className="text-lg font-extrabold mt-2 mb-1 text-slate-900">
              {selectedProduct.title}
            </h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="clay-card-sm p-3 mb-4 border border-white/70">
              <p className="text-[11px] font-bold text-slate-500 mb-1">
                📍 Tamper-Evident Provenance
              </p>
              <div className="mono-tech">
                Batch ID: {selectedProduct.sourceBatchId}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Crafted by {selectedProduct.artisanName}
              </div>
            </div>

            {/* Escrow breakdown */}
            <div className="mb-4">
              <EscrowBreakdown
                price={selectedProduct.price}
                ngoFundName={selectedProduct.split.ngoFundName}
              />
            </div>

            {/* Buy button */}
            <button
              id={`buy-${selectedProduct.id}`}
              onClick={handleBuy}
              className="clay-button-primary w-full flex items-center justify-center gap-2 text-sm font-bold cursor-pointer"
              style={{ height: 52 }}
              disabled={selectedProduct.stock === 0}
            >
              <ShoppingBag size={16} />
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
            <CheckCircle
              size={18}
              className="text-emerald-500 shrink-0"
            />
            <span className="text-xs font-bold text-slate-800">
              {toast}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
