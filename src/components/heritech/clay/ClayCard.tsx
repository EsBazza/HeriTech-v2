"use client";

import type { Product } from "@/lib/types";

interface ClayCardProps {
  product: Product;
  onClick: () => void;
}

const FESTIVAL_EMOJIS: Record<string, string> = {
  "Yi Peng":                    "🏮",
  "Pingxi Sky Lantern Festival": "🕯️",
  "Bali Kite Festival":         "🪁",
  "Aomori Nebuta Matsuri":      "🎆",
  "Ganesh Chaturthi":           "🪷",
  "Panagbenga Festival":        "🌺",
  Nowruz:                       "🌸",
};

const COUNTRY_FLAGS: Record<string, string> = {
  Thailand:    "🇹🇭",
  Taiwan:      "🇹🇼",
  Indonesia:   "🇮🇩",
  Japan:       "🇯🇵",
  India:       "🇮🇳",
  Philippines: "🇵🇭",
  Turkey:      "🇹🇷",
};

export function ClayCard({ product, onClick }: ClayCardProps) {
  const emoji = FESTIVAL_EMOJIS[product.festival] ?? "🌿";
  const flag  = COUNTRY_FLAGS[product.country]    ?? "🌏";

  return (
    <button
      onClick={onClick}
      className="mobile-card w-full text-left overflow-hidden cursor-pointer"
      style={{ padding: 0 }}
    >
      {/* ── Image / Hero zone ── */}
      <div
        className="h-32 w-full relative flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)",
          borderRadius: "16px 16px 0 0",
        }}
      >
        {/* Badges */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="text-xs px-2 py-1 bg-white/90 backdrop-blur-sm shadow-sm rounded-md font-medium text-slate-700">
            {flag} {product.country}
          </span>
          <span className="text-xs px-2 py-1 bg-emerald-50/90 backdrop-blur-sm shadow-sm rounded-md font-medium text-emerald-700">
            🌱 {product.kgDiverted}kg
          </span>
        </div>

        {/* Central emoji */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md border border-white/60">
            <span className="text-2xl select-none">
              {emoji}
            </span>
          </div>
          <span className="text-xs px-2 py-1 bg-blue-50/90 backdrop-blur-sm shadow-sm rounded-md font-medium text-blue-700">
            {product.stock} left
          </span>
        </div>
      </div>

      {/* ── Content zone ── */}
      <div className="product-card-content p-4 space-y-3">
        {/* Title section */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{product.festival}</p>
          <h3 className="font-bold text-sm text-slate-900 leading-tight line-clamp-2">
            {product.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Material tags */}
        <div className="flex flex-wrap gap-1.5">
          {product.materialTags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Price and artisan */}
        <div className="flex items-end justify-between pt-3 border-t border-slate-100 gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-500 mb-1">Price</p>
            <p className="text-lg font-bold text-blue-600">${product.price}</p>
          </div>
          <div className="artisan-name-container text-right">
            <p className="text-xs font-medium text-slate-500 mb-1">Artisan</p>
            <p className="text-xs font-semibold text-slate-800 truncate leading-tight" title={product.artisanName}>
              {product.artisanName}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
