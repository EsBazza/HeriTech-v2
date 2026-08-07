// HeriTech — Global Constants
// Single source of truth for the 70/15/15 escrow split.
// NEVER hardcode these percentages in TSX components — always import from here.

export const ESCROW_SPLIT = {
  ARTISAN: 0.7,      // 70% → Artisan payment
  PLATFORM: 0.15,    // 15% → Platform operations
  NGO: 0.15,         // 15% → NGO / Charity fund
} as const;

export const APP_NAME = "HeriTech";
export const APP_TAGLINE = "Circular Digital System for Festival Materials";
export const ARTISAN_QR_CODE = "ART-12345";
export const LEDGER_LABEL = "Tamper-Evident Ledger";

export const ROLES = {
  BUYER: "buyer",
  ARTISAN: "artisan",
  LGU: "lgu",
} as const;

export const MATERIAL_CONDITIONS = ["Excellent", "Good", "Fair"] as const;
export const MATERIAL_TYPES = [
  "Bamboo",
  "Rice Paper",
  "Silk / Fabric",
  "Cotton Cloth",
  "Floral / Organic",
  "Wood",
  "Mixed",
] as const;

export const BATCH_STATUS = {
  AVAILABLE: "available",
  RESERVED: "reserved",
  CLAIMED: "claimed",
} as const;
