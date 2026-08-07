// HeriTech — Mock AI Scan Utility
// Simulates Gemini multimodal classification for material photos.
// Swap in a real Gemini API call here for production.
// See: https://ai.google.dev/gemini-api/docs/vision

import type { AiScanResult } from "./types";

// Canned responses that cycle through different material types.
// In production: replace this entire function body with a Gemini Vision API call.
const MOCK_SCAN_RESULTS: AiScanResult[] = [
  {
    material: "Bamboo",
    condition: "Good",
    confidence: 0.94,
    notes: "Clean bamboo scaffolding with minor wax residue. Suitable for turning.",
  },
  {
    material: "Rice Paper",
    condition: "Excellent",
    confidence: 0.97,
    notes: "High-quality washi-style paper. Minimal contamination detected.",
  },
  {
    material: "Cotton Cloth",
    condition: "Good",
    confidence: 0.91,
    notes: "Traditional cotton weave, faded pigments. Structurally sound.",
  },
  {
    material: "Floral / Organic",
    condition: "Fair",
    confidence: 0.85,
    notes: "Mixed floral waste. Some decomposition present. Suitable for composting or incense.",
  },
];

let _scanIndex = 0;

/**
 * Mock AI classification of waste material from a photo.
 *
 * ⚠️ STUB: This returns pre-canned results for demo purposes.
 * To integrate real Gemini Vision:
 *   1. Import the @google/generative-ai SDK
 *   2. Pass the image as a base64 blob
 *   3. Use `model.generateContent([{ inlineData: { data, mimeType } }, prompt])`
 *   4. Parse the JSON response into AiScanResult
 */
export async function mockClassifyWaste(
  _imageDataUrl?: string,
): Promise<AiScanResult> {
  // Simulate network latency
  await new Promise<void>((resolve) => setTimeout(resolve, 1800));

  const result = MOCK_SCAN_RESULTS[_scanIndex % MOCK_SCAN_RESULTS.length];
  _scanIndex++;
  return result;
}
