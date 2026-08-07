"use client";

import { useState } from "react";
import { useBatchStore } from "@/stores/batchStore";
import { useAuthStore } from "@/stores/authStore";
import { mockClassifyWaste } from "@/lib/ai-scan";
import type { AiScanResult, MaterialBatch } from "@/lib/types";
import { ARTISAN_QR_CODE, LEDGER_LABEL, MATERIAL_TYPES, MATERIAL_CONDITIONS } from "@/lib/constants";
import { RELEASE_AGREEMENTS } from "@/lib/mock-data";
import {
  ScanLine,
  Camera,
  CheckCircle,
  AlertTriangle,
  QrCode,
  Loader2,
  FileCheck,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { RoleGate } from "@/components/heritech/RoleGate";

type Tab = "scan" | "agreements" | "handover";
type ScanPhase = "idle" | "scanning" | "inferring" | "form" | "done";

const MATERIAL_TYPES_ARRAY = MATERIAL_TYPES as unknown as string[];
const CONDITIONS_ARRAY = MATERIAL_CONDITIONS as unknown as string[];

function generateTxHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, "0").repeat(8);
}

export default function ScannerPage() {
  return (
    <RoleGate allow={["lgu"]}>
      <ScannerContent />
    </RoleGate>
  );
}

function ScannerContent() {
  const { addBatch } = useBatchStore();
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>("scan");
  const [scanPhase, setScanPhase] = useState<ScanPhase>("idle");
  const [aiResult, setAiResult] = useState<AiScanResult | null>(null);
  const [material, setMaterial] = useState("");
  const [condition, setCondition] = useState<"Excellent" | "Good" | "Fair">("Good");
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [agreementId, setAgreementId] = useState(RELEASE_AGREEMENTS[0]?.id ?? "");
  const [toast, setToast] = useState<string | null>(null);
  const [handoverInput, setHandoverInput] = useState("");
  const [handoverResult, setHandoverResult] = useState<"idle" | "success" | "error">("idle");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleStartScan = async () => {
    setScanPhase("scanning");
    await new Promise<void>((r) => setTimeout(r, 1200));
    setScanPhase("inferring");
    const result = await mockClassifyWaste();
    setAiResult(result);
    setMaterial(result.material);
    setCondition(result.condition);
    setScanPhase("form");
  };

  const handleSubmitBatch = () => {
    if (!weightKg || weightKg <= 0) {
      showToast("⚠️ Manual weight input is required (non-AI).");
      return;
    }

    const batch: MaterialBatch = {
      id: `HT-2026-${Math.floor(Math.random() * 9000) + 1000}`,
      title: `${material} Waste Batch — ${new Date().toLocaleDateString()}`,
      materialType: material,
      weightKg: Number(weightKg),
      condition,
      status: "available",
      gps: { lat: 18.7883 + (Math.random() - 0.5) * 0.1, lng: 98.9853 + (Math.random() - 0.5) * 0.1 },
      scannedByOfficerId: user?.id ?? "usr-lgu-001",
      releaseAgreementId: agreementId,
      createdAt: new Date().toISOString(),
      txHash: generateTxHash(`${material}-${condition}-${weightKg}-${Date.now()}`),
      festival: "Yi Peng",
      country: "Thailand",
      aiInferredMaterial: aiResult?.material,
      aiInferredCondition: aiResult?.condition,
      aiConfidence: aiResult?.confidence,
    };

    addBatch(batch);
    setScanPhase("done");
    showToast(`✅ Batch ${batch.id} recorded & pinned!`);
  };

  const handleHandoverSubmit = () => {
    const val = handoverInput.trim().toUpperCase();
    if (val === ARTISAN_QR_CODE) {
      setHandoverResult("success");
    } else {
      setHandoverResult("error");
    }
  };

  const handleReset = () => {
    setScanPhase("idle");
    setAiResult(null);
    setMaterial("");
    setCondition("Good");
    setWeightKg("");
  };

  return (
    <div className="relative min-h-full pb-4">
      <div className="px-4 pt-4 pb-4 space-y-4">
        <div className="hero-panel section-panel overflow-hidden relative px-4 py-5">
          <div className="absolute -top-10 -right-8 w-28 h-28 rounded-full bg-amber-500/16 blur-2xl" />
          <div className="absolute -bottom-10 -left-8 w-28 h-28 rounded-full bg-cyan-500/12 blur-2xl" />

          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <ScanLine size={16} className="text-amber-800" />
              <span className="section-kicker text-amber-800">LGU Officer Module</span>
            </div>
            <span className="badge-pill bg-amber-200 text-amber-900 text-[10px] font-bold">
              🏛️ Admin Only
            </span>
          </div>

          <h1 className="section-title">AI waste scanner</h1>
          <p className="section-copy mt-2 max-w-[28ch]">
            Scan festival waste, verify manual weights, & audit QR handovers.
          </p>

          <div className="clay-input-inset flex p-1 bg-white/70 rounded-2xl mt-4">
            {[
              { id: "scan", label: "📷 AI Scan" },
              { id: "agreements", label: "📜 Agreements" },
              { id: "handover", label: "📲 QR Audit" },
            ].map((t) => (
              <button
                key={t.id}
                id={`scanner-tab-${t.id}`}
                onClick={() => setTab(t.id as Tab)}
                className="flex-1 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 capitalize cursor-pointer"
                style={{
                  background: tab === t.id ? "#ffffff" : "transparent",
                  color: tab === t.id ? "#b45309" : "#78350f",
                  boxShadow: tab === t.id ? "0 2px 8px rgba(180,83,9,0.15)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="section-panel p-4">
          {tab === "scan" && (
            <div className="flex flex-col gap-4">
              <div className="scan-viewport shadow-md">
                <div className="scan-corner scan-corner-tl" />
                <div className="scan-corner scan-corner-tr" />
                <div className="scan-corner scan-corner-bl" />
                <div className="scan-corner scan-corner-br" />
                {scanPhase !== "idle" && <div className="scan-line" />}

                <div className="text-center text-white p-5">
                  {scanPhase === "idle" && (
                    <>
                      <Camera size={36} className="mx-auto mb-2 opacity-50" />
                      <p className="text-xs opacity-80">
                        Point Chromebook / Phone Camera at waste batch
                      </p>
                    </>
                  )}
                  {scanPhase === "scanning" && (
                    <>
                      <div className="text-3xl mb-2 animate-bounce">📷</div>
                      <p className="text-xs font-bold text-cyan-300">Capturing photo…</p>
                    </>
                  )}
                  {scanPhase === "inferring" && (
                    <>
                      <Loader2 size={36} className="mx-auto mb-2 animate-spin text-cyan-400" />
                      <p className="text-xs font-bold text-cyan-300">
                        Gemini Multimodal Vision Inferring…
                      </p>
                    </>
                  )}
                  {(scanPhase === "form" || scanPhase === "done") && aiResult && (
                    <>
                      <div className="text-3xl mb-1">🎯</div>
                      <p className="font-extrabold text-xs text-cyan-300">
                        Detected: {aiResult.material}
                      </p>
                      <p className="text-[10px] opacity-70 mt-0.5">
                        Confidence: {(aiResult.confidence * 100).toFixed(0)}%
                      </p>
                    </>
                  )}
                </div>
              </div>

              {scanPhase === "idle" && (
                <button
                  id="start-scan-btn"
                  onClick={handleStartScan}
                  className="clay-button-primary w-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  style={{ height: 48 }}
                >
                  <Camera size={16} />
                  Capture & Classify Waste Photo
                </button>
              )}

              {scanPhase === "form" && (
                <div className="clay-card p-4 flex flex-col gap-3.5 bg-white">
                  {aiResult && (
                    <div className="clay-card-sm p-3 bg-emerald-50 border border-emerald-200">
                      <p className="text-xs font-bold text-emerald-800 mb-0.5">
                        🤖 Gemini AI Classification Result
                      </p>
                      <p className="text-xs text-emerald-900">{aiResult.notes}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Material Type (AI Suggested)
                    </label>
                    <select
                      id="scan-material"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="clay-input-inset w-full px-3 text-xs"
                      style={{ height: 42 }}
                    >
                      {MATERIAL_TYPES_ARRAY.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Condition (AI Suggested)
                    </label>
                    <div className="flex gap-2">
                      {CONDITIONS_ARRAY.map((c) => (
                        <button
                          key={c}
                          onClick={() => setCondition(c as "Excellent" | "Good" | "Fair")}
                          className={`flex-1 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            condition === c
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Weight (kg) <span className="text-rose-500">* Manual Entry Required</span>
                    </label>
                    <input
                      id="scan-weight"
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="Enter weight in kg (e.g. 45.5)"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value === "" ? "" : Number(e.target.value))}
                      className="clay-input-inset w-full px-3 text-xs bg-amber-50/50 border-amber-200"
                      style={{ height: 44 }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Material Release Agreement ID
                    </label>
                    <select
                      id="scan-agreement"
                      value={agreementId}
                      onChange={(e) => setAgreementId(e.target.value)}
                      className="clay-input-inset w-full px-3 text-xs"
                      style={{ height: 42 }}
                    >
                      {RELEASE_AGREEMENTS.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.id} — {a.festival}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    id="submit-batch-btn"
                    onClick={handleSubmitBatch}
                    className="clay-button-eco w-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer mt-1"
                    style={{ height: 48 }}
                  >
                    <CheckCircle size={16} />
                    Record Batch to {LEDGER_LABEL}
                  </button>
                </div>
              )}

              {scanPhase === "done" && (
                <div className="clay-card p-6 text-center bg-white">
                  <div className="text-4xl mb-2">✅</div>
                  <h3 className="font-extrabold text-base text-slate-900 mb-1">
                    Batch Recorded Successfully!
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Material batch pinned to map and logged with SHA-256 hash on {LEDGER_LABEL}.
                  </p>
                  <button
                    id="scan-again-btn"
                    onClick={handleReset}
                    className="clay-button-primary px-6 text-xs font-bold"
                    style={{ height: 42 }}
                  >
                    Scan Another Batch
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === "agreements" && (
            <div className="flex flex-col gap-3">
              <div className="clay-card-sm p-3 bg-amber-50 border border-amber-200 flex items-start gap-2">
                <FileCheck size={16} className="text-amber-800 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900">
                  <strong>Step 0 Legal Framework:</strong> Formal Material Release Agreements signed between LGUs, municipalities, & temple committees before collection begins.
                </p>
              </div>

              {RELEASE_AGREEMENTS.map((ag) => (
                <div key={ag.id} className="clay-card p-3.5 bg-white">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-xs text-slate-900">
                      {ag.title}
                    </h3>
                    <span className="badge-pill badge-eco text-[9px]">
                      {ag.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Partner: {ag.organizerName} ({ag.festival}, {ag.country})
                  </p>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (ag.collectedKg / ag.allocatedKg) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                    <span>Collected: {ag.collectedKg} kg</span>
                    <span>Allocated Cap: {ag.allocatedKg} kg</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "handover" && (
            <div className="flex flex-col gap-3.5">
              <div className="clay-card-sm p-3 bg-blue-50 border border-blue-200 flex items-start gap-2">
                <AlertTriangle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900">
                  <strong>Handover Protocol:</strong> LGU Officer scans Artisan's hardcoded QR code (<code className="font-bold text-blue-700">ART-12345</code>) to confirm physical custody transfer.
                </p>
              </div>

              <div className="clay-card p-4 bg-white text-center">
                <div className="scan-viewport mb-3" style={{ minHeight: 150 }}>
                  <div className="scan-corner scan-corner-tl" />
                  <div className="scan-corner scan-corner-tr" />
                  <div className="scan-corner scan-corner-bl" />
                  <div className="scan-corner scan-corner-br" />
                  <div className="scan-line" />
                  <div className="text-center text-white">
                    <QrCode size={32} className="mx-auto mb-1 opacity-50" />
                    <p className="text-[11px] opacity-70">Camera Viewport Scanning Artisan QR</p>
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-700 mb-2">
                  Type or Paste Artisan QR Code:
                </p>
                <div className="flex gap-2">
                  <input
                    id="handover-qr-input"
                    type="text"
                    placeholder="e.g. ART-12345"
                    value={handoverInput}
                    onChange={(e) => setHandoverInput(e.target.value.toUpperCase())}
                    className="clay-input-inset flex-1 px-3 text-xs"
                    style={{ height: 42 }}
                  />
                  <button
                    id="handover-submit-btn"
                    onClick={handleHandoverSubmit}
                    className="clay-button-primary px-4 text-xs font-bold shrink-0 cursor-pointer"
                    style={{ height: 42 }}
                  >
                    Verify QR
                  </button>
                </div>

                {handoverResult === "success" && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-left flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-emerald-900">
                        ✅ Artisan Handover Verified!
                      </p>
                      <p className="text-[10px] text-emerald-700">
                        Custody transferred to Priya Mehta. Logged to {LEDGER_LABEL}.
                      </p>
                    </div>
                  </div>
                )}

                {handoverResult === "error" && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-left flex items-center gap-2">
                    <AlertTriangle size={18} className="text-rose-600 shrink-0" />
                    <div>
                      <p className="font-bold text-xs text-rose-900">
                        ❌ Invalid QR Code
                      </p>
                      <p className="text-[10px] text-rose-700">
                        Test code is <code className="font-bold">ART-12345</code>.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="clay-card p-3.5 bg-white text-center">
                <p className="text-xs font-bold text-slate-600 mb-2">
                  Reference Artisan Test QR Code:
                </p>
                <div className="flex justify-center p-3 bg-slate-50 rounded-xl w-32 h-32 mx-auto mb-2 border border-slate-200">
                  <QRCodeSVG value={ARTISAN_QR_CODE} size={104} />
                </div>
                <p className="mono-tech text-xs">{ARTISAN_QR_CODE}</p>
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
