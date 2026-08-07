// HeriTech — TypeScript Type Definitions
// Strict types for the entire application.

export type Role = "buyer" | "artisan" | "lgu";

export interface User {
  id: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  // Artisan-only
  workshopName?: string;
  verifiedArtisan?: boolean;
  // LGU-only
  stationName?: string;
}

export interface MaterialBatch {
  id: string;                // e.g. "HT-2026-8891"
  title: string;             // "Yi Peng Lantern Bamboo Scaffolding"
  materialType: string;
  weightKg: number;          // manually entered — never AI-inferred
  condition: "Excellent" | "Good" | "Fair";
  status: "available" | "reserved" | "claimed";
  gps: { lat: number; lng: number };
  scannedByOfficerId: string;
  reservedByArtisanId?: string;
  claimedByArtisanId?: string;
  releaseAgreementId: string;
  createdAt: string;
  txHash: string;            // mock tamper-evident hash
  festival: string;
  country: string;
  aiInferredMaterial?: string;
  aiInferredCondition?: string;
  aiConfidence?: number;
}

export interface ReleaseAgreement {
  id: string;
  title: string;
  status: "active" | "closed";
  allocatedKg: number;
  collectedKg: number;
  festival: string;
  country: string;
  organizerName: string;
  signedAt: string;
}

export interface EscrowSplit {
  artisanPct: number;   // 70
  platformPct: number;  // 20
  ngoPct: number;       // 10
  ngoFundName: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  artisanId: string;
  artisanName: string;
  artisanAvatar?: string;
  sourceBatchId: string;
  materialTags: string[];
  stock: number;
  split: EscrowSplit;
  festival: string;
  country: string;
  kgDiverted: number;
}

export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  purchasedAt: string;
  walletPassId?: string;
  product?: Product;
}

export interface WalletPass {
  id: string;
  orderId: string;
  serial: string;              // "HT-492-AX"
  kgDiverted: number;
  gps: { lat: number; lng: number };
  qrPayload: string;
  issuedAt: string;
  festivalName: string;
  artisanName: string;
  materialType: string;
  productName: string;
  donationAmount: number;
  ngoName: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatarUrl?: string;
  kgDiverted: number;
  itemsPurchased?: number;   // buyers
  itemsListed?: number;      // artisans
  batchesLogged?: number;    // lgu
  rank: number;
  role: Role;
}

export interface NgoDisbursement {
  id: string;
  ngoName: string;
  amount: number;
  date: string;
  txHash: string;
  festival: string;
}

export interface Festival {
  id: string;
  name: string;
  country: string;
  city: string;
  dates: string;
  materialType: string;
  estimatedWasteKg: number;
  gps: { lat: number; lng: number };
  description: string;
  emoji: string;
}

export interface AiScanResult {
  material: string;
  condition: "Excellent" | "Good" | "Fair";
  confidence: number;
  notes: string;
}
