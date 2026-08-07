"use client";

import type { Product } from "@/lib/types";

interface ClayCardProps {
  product: Product;
  onClick: () => void;
}

const FESTIVAL_EMOJIS: Record<string, string> = {
  "Yi Peng": "🏮",
  "Pingxi Sky Lantern Festival": "🕯️",
  "Bali Kite Festival": "🪁",
  "Aomori Nebuta Matsuri": "🎆",
  "Ganesh Chaturthi": "🪷",
  "Panagbenga Festival": "🌺",
  Nowruz: "🌸",
};

const COUNTRY_FLAGS: Record<string, string> = {
  Thailand: "🇹🇭",
  Taiwan: "🇹🇼",
  Indonesia: "🇮🇩",
  Japan: "🇯🇵",
  India: "🇮🇳",
  Philippines: "🇵🇭",
  Turkey: "🇹🇷",
};

export function ClayCard({ product, onClick }: ClayCardProps) {
  const emoji = FESTIVAL_EMOJIS[product.festival] ?? "🌿";
  const flag = COUNTRY_FLAGS[product.country] ?? "🌏";

  return (
    <button
      onClick={onClick}
      id={`product-card-${product.id}`}
      className="clay-card w-full text-left overflow-hidden cursor-pointer flex flex-col justify-between border border-white/80"
      style={{ minHeight: 0, padding: 0 }}
      aria-label={`View ${product.title}`}
    >
      <div
        className="h-44 w-full relative flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at 28% 20%, rgba(255,255,255,0.96), rgba(255,255,255,0.12) 36%), linear-gradient(145deg, #bfd1ff 0%, #e7eeff 52%, #d4dcff 100%)",
        }}
      >
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <span className="badge-pill badge-eco bg-white/84 backdrop-blur-sm shadow-sm border-0 text-[10px]">
            {flag} {product.country}
          </span>
          <span className="badge-pill badge-artisan bg-white/84 backdrop-blur-sm shadow-sm border-0 text-[10px]">
            🌱 {product.kgDiverted}kg diverted
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full hero-orb flex items-center justify-center border border-white/70 shadow-[0_20px_40px_rgba(37,99,235,0.16)]">
            <span className="text-5xl transform transition-transform duration-200">
              {emoji}
            </span>
          </div>
          <span className="badge-pill badge-primary bg-white/84 backdrop-blur-sm shadow-sm border-0 text-[10px]">
            {product.stock} left
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-slate-500 truncate uppercase tracking-[0.12em]">
            {product.festival}
          </p>
          <h3 className="font-extrabold text-[15px] text-slate-900 leading-snug line-clamp-2 min-h-[40px]">
            {product.title}
          </h3>
          <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 min-h-[34px]">
            {product.description}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {product.materialTags.slice(0, 2).map((tag) => (
              <span key={tag} className="badge-pill badge-gray text-[9px] bg-white/84 border-0">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 pt-1">
          <div>
            <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 block mb-0.5">
              Price
            </span>
            <span className="text-lg font-extrabold text-blue-600">
              ${product.price}
            </span>
          </div>
          <span className="badge-pill badge-primary text-[10px] bg-white/92 backdrop-blur-sm border-0">
            {product.materialTags[0] ?? "Upcycled"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/70 text-[10px] text-slate-500">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-4 h-4 rounded-full bg-gradient-to-br from-rose-500 to-orange-400 text-white flex items-center justify-center text-[8px] font-bold shadow-sm">
              A
            </span>
            <span className="truncate max-w-[92px] font-medium text-slate-600">
              {product.artisanName}
            </span>
          </div>
          <span className="font-semibold text-slate-400">Batch {product.sourceBatchId.slice(-4)}</span>
        </div>
      </div>
    </button>
  );
}
