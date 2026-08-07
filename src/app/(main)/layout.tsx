import { BottomNav } from "@/components/heritech/BottomNav";
import type { Metadata } from "next";
import { Wifi, Signal, Battery } from "lucide-react";

export const metadata: Metadata = {
  title: "HeriTech — Mobile Prototype",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="app-shell-backdrop min-h-screen w-full flex items-center justify-center p-0 sm:px-4 sm:py-4"
    >
      <div
        className="w-full max-w-[430px] min-h-[100dvh] sm:min-h-[900px] sm:max-h-[94vh] flex flex-col relative overflow-hidden sm:rounded-[42px] soft-panel"
        style={{
          boxShadow:
            "0 28px 72px -18px rgba(37, 99, 235, 0.22), 0 18px 42px -18px rgba(15, 23, 42, 0.16), 0 0 0 10px rgba(255,255,255,0.7)",
        }}
      >
        <div className="w-full pt-3 px-5 pb-2 flex items-center justify-between z-50 select-none bg-white/25 backdrop-blur-md border-b border-white/40">
          <span className="text-[10px] font-extrabold tracking-[0.3em] text-slate-600 uppercase">
            Demo Mode
          </span>

          <div className="w-28 h-5 rounded-full bg-slate-950 flex items-center justify-center px-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.14)]">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/80 mr-1.5" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal size={12} strokeWidth={2.5} />
            <Wifi size={12} strokeWidth={2.5} />
            <Battery size={13} strokeWidth={2.5} className="fill-slate-700" />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto pb-28 relative bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.08))] scroll-smooth no-scrollbar">
          {children}
        </main>

        <div className="absolute bottom-0 left-0 right-0 z-50">
          <BottomNav />
          <div className="w-full pb-1 pt-1 flex justify-center bg-transparent">
            <div className="w-28 h-1 bg-slate-400/45 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
