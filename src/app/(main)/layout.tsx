import { BottomNav } from "@/components/heritech/BottomNav";
import type { Metadata } from "next";
import { Wifi, Signal, Battery } from "lucide-react";

export const metadata: Metadata = {
  title: "HeriTech — Mobile Prototype",
  description: "Heritage craft marketplace with verifiable provenance",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell-backdrop min-h-screen w-full flex items-center justify-center p-0 sm:px-4 sm:py-6">
      <div
        className="w-full max-w-[430px] min-h-[100dvh] sm:min-h-[900px] sm:max-h-[94vh] flex flex-col relative overflow-hidden sm:rounded-[44px] soft-panel"
        style={{
          boxShadow:
            "0 0 0 10px rgba(255,255,255,0.65), 0 24px 64px -16px rgba(37,99,235,0.20), 0 16px 40px -12px rgba(15,23,42,0.14)",
        }}
      >
        {/* ── Status Bar ── */}
        <div className="w-full pt-5 px-7 pb-2 flex items-center justify-between z-50 select-none shrink-0"
          style={{ 
            background: "rgba(255,255,255,0.8)", 
            backdropFilter: "blur(20px)", 
            borderBottom: "1px solid rgba(226,232,240,0.3)" 
          }}
        >
          <span className="text-[10px] font-bold tracking-[0.18em] text-slate-400 uppercase">
            Demo
          </span>

          {/* Dynamic island */}
          <div className="w-[88px] h-[22px] rounded-full bg-[#0a0a0a] flex items-center justify-center gap-2 px-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700 ring-1 ring-slate-800 flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-blue-400/70" />
            </div>
            <div className="w-3 h-3 rounded-full bg-slate-800 ring-1 ring-slate-700" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <Signal size={10} strokeWidth={2.5} />
            <Wifi size={10} strokeWidth={2.5} />
            <Battery size={12} strokeWidth={2.5} />
          </div>
        </div>

        {/* ── Main scrollable area ── */}
        <main className="flex-1 overflow-y-auto pb-24 relative no-scrollbar"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)" }}
        >
          {children}
        </main>

        {/* ── Bottom nav + home indicator ── */}
        <div className="absolute bottom-0 left-0 right-0 z-50">
          <BottomNav />
          <div className="w-full pb-2 pt-2 flex justify-center" style={{ background: "rgba(255,255,255,0.9)" }}>
            <div className="w-24 h-[4px] bg-slate-300/70 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
