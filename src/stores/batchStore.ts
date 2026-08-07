// HeriTech — Batch Store
// CRUD for material waste batches.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MaterialBatch } from "@/lib/types";
import { MATERIAL_BATCHES } from "@/lib/mock-data";

interface BatchState {
  batches: MaterialBatch[];
  addBatch: (batch: MaterialBatch) => void;
  updateBatch: (id: string, updates: Partial<MaterialBatch>) => void;
  reserveBatch: (batchId: string, artisanId: string) => void;
  claimBatch: (batchId: string, artisanId: string) => void;
}

export const useBatchStore = create<BatchState>()(
  persist(
    (set) => ({
      batches: MATERIAL_BATCHES,

      addBatch: (batch) =>
        set((state) => ({ batches: [batch, ...state.batches] })),

      updateBatch: (id, updates) =>
        set((state) => ({
          batches: state.batches.map((b) =>
            b.id === id ? { ...b, ...updates } : b,
          ),
        })),

      reserveBatch: (batchId, artisanId) =>
        set((state) => ({
          batches: state.batches.map((b) =>
            b.id === batchId
              ? { ...b, status: "reserved", reservedByArtisanId: artisanId }
              : b,
          ),
        })),

      claimBatch: (batchId, artisanId) =>
        set((state) => ({
          batches: state.batches.map((b) =>
            b.id === batchId
              ? {
                  ...b,
                  status: "claimed",
                  claimedByArtisanId: artisanId,
                }
              : b,
          ),
        })),
    }),
    { name: "heritech-batches" },
  ),
);
