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
    setHandoverResult(val === ARTISAN_QR_CODE ? "success" : "error");
  };

  const handleReset = () => {
    setScanPhase("idle");
    setAiResult(null);
    setMaterial("");
    setCondition("Good");
    setWeightKg("");
  };

  const TAB_ITEMS = [
    { id: "scan",        label: "📷 AI Scan"     },
    { id: "agreements",  label: "📜 Agreements"  },
    { id: "handover",    label: "📲 QR Audit"    },
  ];

  return (
    <div className="relative min-h-full">
      <div className="px-4 pt-5 pb-8 space-y-4">

        {/* ── HERO ── */}
        <div className="hero-panel relative overflow-hidden px-5 py-6" style={{ borderRadius: 24 }}>
          <div className="pointer-events-none absolute -top-10 -right-8 w-32 h-32 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-cyan-400/08 blur-3xl" />

          <div className="page-header">
            <div className="page-header-row">
              <div className="page-header-content">
                <div className="flex items-center gap-2">
                  <ScanLine size={15} className="text-amber-700" />
                  <p className="section-kicker" style={{ color: "#b45309" }}>LGU Officer Module</p>
                </div>
              </div>
              <span
                className="page-header-badge badge-pill text-[10px] font-bold"
                style={{ background: "rgba(245,158,11,0.08)", color: "#b45309", border: "1.5px solid rgba(245,158,11,0.2)" }}
              >
                🏛️ Admin Only
              </span>
            </div>

            <div className="mt-3">
              <h1 className="section-title">AI waste scanner</h1>
              <p className="section-copy">
                Scan festival waste, verify manual weights, & audit QR handovers.
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <div
            className="flex p-1 rounded-2xl relative z-10 mt-6"
            style={{ background: "rgba(241,245,249,0.8)", border: "1.5px solid rgba(226,232,240,0.8)" }}
          >
            {TAB_ITEMS.map((t) => (
              <button
                key={t.id}
                id={`scanner-tab-${t.id}`}
                onClick={() => setTab(t.id as Tab)}
                className="flex-1 py-2 text-[10px] font-extrabold rounded-[14px] transition-all duration-200 cursor-pointer leading-tight px-1"
                style={{
                  background: tab === t.id ? "#ffffff" : "transparent",
                  color:      tab === t.id ? "#b45309" : "#78350f",
                  boxShadow:  tab === t.id ? "0 2px 8px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.9)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB CONTENT ── */}
        <div className="section-panel px-5 py-5">

          {/* SCAN TAB */}
          {tab === "scan" && (
            <div className="flex flex-col gap-4">
              {/* Camera viewport */}
              <div className="scan-viewport rounded-[22px] border border-slate-700/30" style={{ minHeight: 200 }}>
                <div className="scan-corner scan-corner-tl" />
                <div className="scan-corner scan-corner-tr" />
                <div className="scan-corner scan-corner-bl" />
                <div className="scan-corner scan-corner-br" />
                {scanPhase !== "idle" && <div className="scan-line" />}

                <div className="text-center text-white px-6 py-8">
                  {scanPhase === "idle" && (
                    <div className="space-y-3">
                      <Camera size={36} className="mx-auto opacity-40" />
                      <p className="text-[12px] opacity-70 max-w-[200px] mx-auto leading-relaxed font-medium">
                        Point camera at waste batch to classify
                      </p>
                    </div>
                  )}
                  {scanPhase === "scanning" && (
                    <div className="space-y-3">
                      <div className="text-[32px] animate-bounce">📷</div>
                      <p className="text-[12px] font-bold text-cyan-300">Capturing photo…</p>
                    </div>
                  )}
                  {scanPhase === "inferring" && (
                    <div className="space-y-3">
                      <Loader2 size={34} className="mx-auto animate-spin text-cyan-400" />
                      <p className="text-[12px] font-bold text-cyan-300">Gemini Multimodal Vision Inferring…</p>
                    </div>
                  )}
                  {(scanPhase === "form" || scanPhase === "done") && aiResult && (
                    <div className="space-y-2">
                      <div className="text-[32px]">🎯</div>
                      <p className="font-extrabold text-[13px] text-cyan-300">Detected: {aiResult.material}</p>
                      <p className="text-[11px] opacity-60">Confidence: {(aiResult.confidence * 100).toFixed(0)}%</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Start scan button */}
              {scanPhase === "idle" && (
                <button
                  id="start-scan-btn"
                  onClick={handleStartScan}
                  className="clay-button-primary w-full text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer"
                  style={{ height: 50 }}
                >
                  <Camera size={16} />
                  Capture & Classify Waste Photo
                </button>
              )}

              {/* Form after scan */}
              {scanPhase === "form" && (
                <div className="clay-card px-5 py-5 flex flex-col gap-4">
                  {aiResult && (
                    <div
                      className="px-4 py-3.5 rounded-2xl"
                      style={{ background: "rgba(209,250,229,0.5)", border: "1.5px solid rgba(52,211,153,0.25)" }}
                    >
                      <p className="text-[11px] font-bold text-emerald-800 mb-1">🤖 Gemini AI Classification Result</p>
                      <p className="text-[12px] text-emerald-900 leading-relaxed font-medium">{aiResult.notes}</p>
                    </div>
                  )}

                  <ScanFormField label="Material Type (AI Suggested)">
                    <select
                      id="scan-material"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="clay-input-inset w-full px-4 text-[13px] font-medium"
                      style={{ height: 46 }}
                    >
                      {MATERIAL_TYPES_ARRAY.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </ScanFormField>

                  <ScanFormField label="Condition (AI Suggested)">
                    <div className="flex gap-2">
                      {CONDITIONS_ARRAY.map((c) => (
                        <button
                          key={c}
                          onClick={() => setCondition(c as "Excellent" | "Good" | "Fair")}
                          className="flex-1 py-2.5 rounded-full text-[12px] font-bold transition-all cursor-pointer"
                          style={{
                            background: condition === c ? "#2563eb" : "rgba(255,255,255,0.9)",
                            color:      condition === c ? "#ffffff"  : "#64748b",
                            border:     condition === c ? "none"     : "1.5px solid rgba(226,232,240,0.9)",
                            boxShadow:  condition === c ? "0 4px 12px rgba(37,99,235,0.2)" : "0 1px 3px rgba(15,23,42,0.04)",
                          }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </ScanFormField>

                  <ScanFormField label={<>Weight (kg) <span className="text-rose-500">* Manual Entry Required</span></>}>
                    <input
                      id="scan-weight"
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="Enter weight in kg (e.g. 45.5)"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value === "" ? "" : Number(e.target.value))}
                      className="clay-input-inset w-full px-4 text-[13px] font-bold"
                      style={{ height: 46, borderColor: "rgba(251,191,36,0.4)", background: "rgba(255,251,235,0.5)" }}
                    />
                  </ScanFormField>

                  <ScanFormField label="Material Release Agreement ID">
                    <select
                      id="scan-agreement"
                      value={agreementId}
                      onChange={(e) => setAgreementId(e.target.value)}
                      className="clay-input-inset w-full px-4 text-[13px] font-medium"
                      style={{ height: 46 }}
                    >
                      {RELEASE_AGREEMENTS.map((a) => (
                        <option key={a.id} value={a.id}>{a.id} — {a.festival}</option>
                      ))}
                    </select>
                  </ScanFormField>

                  <button
                    id="submit-batch-btn"
                    onClick={handleSubmitBatch}
                    className="clay-button-eco w-full text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer"
                    style={{ height: 50 }}
                  >
                    <CheckCircle size={16} />
                    Record Batch to {LEDGER_LABEL}
                  </button>
                </div>
              )}

              {/* Done state */}
              {scanPhase === "done" && (
                <div className="clay-card px-5 py-8 text-center">
                  <div className="text-[42px] mb-4">✅</div>
                  <h3 className="font-extrabold text-[16px] text-slate-900 mb-2">Batch Recorded Successfully!</h3>
                  <p className="text-[12.5px] text-slate-500 mb-6 leading-relaxed max-w-[260px] mx-auto font-medium">
                    Material batch pinned to map and logged with SHA-256 hash on {LEDGER_LABEL}.
                  </p>
                  <button
                    id="scan-again-btn"
                    onClick={handleReset}
                    className="clay-button-primary px-8 text-[13px] font-bold cursor-pointer"
                    style={{ height: 46 }}
                  >
                    Scan Another Batch
                  </button>
                </div>
              )}
            </div>
          )}

          {/* AGREEMENTS TAB */}
          {tab === "agreements" && (
            <div className="flex flex-col gap-4">
              <div
                className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
                style={{ background: "rgba(254,243,199,0.6)", border: "1.5px solid rgba(252,211,77,0.4)" }}
              >
                <FileCheck size={15} className="text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[12px] text-amber-900 leading-relaxed font-medium">
                  <strong>Step 0 Legal Framework:</strong> Formal Material Release Agreements signed between LGUs, municipalities, & temple committees before collection begins.
                </p>
              </div>

              {RELEASE_AGREEMENTS.map((ag) => (
                <div key={ag.id} className="clay-card px-5 py-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-[13.5px] text-slate-900 leading-snug flex-1">{ag.title}</h3>
                    <span className="badge-pill badge-eco shrink-0">{ag.status}</span>
                  </div>
                  <p className="text-[11.5px] text-slate-500 font-medium">
                    Partner: {ag.organizerName} ({ag.festival}, {ag.country})
                  </p>

                  {/* Progress bar */}
                  <div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(226,232,240,0.8)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (ag.collectedKg / ag.allocatedKg) * 100)}%`,
                          background: "linear-gradient(90deg, #f59e0b, #f97316)",
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10.5px] text-slate-500 font-bold pt-2">
                      <span>Collected: {ag.collectedKg} kg</span>
                      <span>Cap: {ag.allocatedKg} kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* HANDOVER TAB */}
          {tab === "handover" && (
            <div className="flex flex-col gap-4">
              <div
                className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
                style={{ background: "rgba(219,234,254,0.5)", border: "1.5px solid rgba(147,197,253,0.4)" }}
              >
                <AlertTriangle size={15} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[12px] text-blue-900 leading-relaxed font-medium">
                  <strong>Handover Protocol:</strong> LGU Officer scans Artisan's hardcoded QR code (<code className="font-bold text-blue-700">ART-12345</code>) to confirm physical custody transfer.
                </p>
              </div>

              {/* Scan viewport */}
              <div className="clay-card px-5 py-5 flex flex-col gap-4 text-center">
                <div className="scan-viewport rounded-[18px]" style={{ minHeight: 150 }}>
                  <div className="scan-corner scan-corner-tl" />
                  <div className="scan-corner scan-corner-tr" />
                  <div className="scan-corner scan-corner-bl" />
                  <div className="scan-corner scan-corner-br" />
                  <div className="scan-line" />
                  <div className="text-white text-center">
                    <QrCode size={28} className="mx-auto mb-1.5 opacity-40 animate-pulse" />
                    <p className="text-[10.5px] opacity-60 font-medium">Camera Viewport Scanning Artisan QR</p>
                  </div>
                </div>

                <div className="text-left">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.12em] mb-2">
                    Type or Paste Artisan QR Code:
                  </p>
                  <div className="flex gap-2">
                    <input
                      id="handover-qr-input"
                      type="text"
                      placeholder="e.g. ART-12345"
                      value={handoverInput}
                      onChange={(e) => setHandoverInput(e.target.value.toUpperCase())}
                      className="clay-input-inset flex-1 px-4 text-[13px] font-bold"
                      style={{ height: 46 }}
                    />
                    <button
                      id="handover-submit-btn"
                      onClick={handleHandoverSubmit}
                      className="clay-button-primary px-5 text-[13px] font-bold shrink-0 cursor-pointer"
                      style={{ height: 46 }}
                    >
                      Verify
                    </button>
                  </div>
                </div>

                {handoverResult === "success" && (
                  <div
                    className="flex items-start gap-3 px-4 py-3.5 rounded-2xl text-left"
                    style={{ background: "rgba(209,250,229,0.5)", border: "1.5px solid rgba(52,211,153,0.3)" }}
                  >
                    <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-[12.5px] text-emerald-900">✅ Artisan Handover Verified!</p>
                      <p className="text-[11.5px] text-emerald-700 font-medium mt-0.5 leading-snug">
                        Custody transferred to Priya Mehta. Logged to {LEDGER_LABEL}.
                      </p>
                    </div>
                  </div>
                )}

                {handoverResult === "error" && (
                  <div
                    className="flex items-start gap-3 px-4 py-3.5 rounded-2xl text-left"
                    style={{ background: "rgba(255,228,230,0.5)", border: "1.5px solid rgba(251,113,133,0.3)" }}
                  >
                    <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold text-[12.5px] text-rose-900">❌ Invalid QR Code</p>
                      <p className="text-[11.5px] text-rose-700 font-medium mt-0.5">
                        Test code is <code className="font-bold">ART-12345</code>.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Reference QR */}
              <div className="clay-card px-5 py-5 flex flex-col items-center gap-3">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.12em]">
                  Reference Artisan Test QR Code:
                </p>
                <div
                  className="w-[140px] h-[140px] flex items-center justify-center rounded-2xl border border-slate-200"
                  style={{ background: "#f8fafc", padding: 12 }}
                >
                  <QRCodeSVG value={ARTISAN_QR_CODE} size={116} />
                </div>
                <p className="mono-tech text-[10.5px] text-slate-400 select-all font-bold">{ARTISAN_QR_CODE}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="toast-container">
          <div className="toast">
            <span className="text-[12.5px] font-bold text-slate-800">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ScanFormField({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.12em]">{label}</label>
      {children}
    </div>
  );
}
