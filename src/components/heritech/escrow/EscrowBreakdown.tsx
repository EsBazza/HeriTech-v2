"use client";

import { ESCROW_SPLIT } from "@/lib/constants";
import {
  BarChart,
  Bar,
  XAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface EscrowBreakdownProps {
  price: number;
  ngoFundName?: string;
}

export function EscrowBreakdown({
  price,
  ngoFundName = "Environmental NGO Fund",
}: EscrowBreakdownProps) {
  const artisanAmount = +(price * ESCROW_SPLIT.ARTISAN).toFixed(2);
  const platformAmount = +(price * ESCROW_SPLIT.PLATFORM).toFixed(2);
  const ngoAmount = +(price * ESCROW_SPLIT.NGO).toFixed(2);

  const data = [
    {
      name: "Artisan",
      value: ESCROW_SPLIT.ARTISAN * 100,
      amount: artisanAmount,
      color: "#ff6b6b",
      label: "Artisan Payment",
    },
    {
      name: "Platform",
      value: ESCROW_SPLIT.PLATFORM * 100,
      amount: platformAmount,
      color: "#2563eb",
      label: "Platform Ops",
    },
    {
      name: "NGO",
      value: ESCROW_SPLIT.NGO * 100,
      amount: ngoAmount,
      color: "#f59e0b",
      label: ngoFundName,
    },
  ];

  return (
    <div className="clay-card p-4 border border-white/80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-extrabold text-sm" style={{ color: "var(--color-text-primary)" }}>
          Transparent Price Split
        </h3>
        <span className="badge-pill badge-primary bg-blue-50 text-[10px]">
          70 / 15 / 15
        </span>
      </div>

      <div className="flex rounded-full overflow-hidden h-4 mb-4 bg-slate-100">
        {data.map((d) => (
          <div
            key={d.name}
            style={{
              width: `${d.value}%`,
              background: d.color,
              transition: "width 0.4s ease",
            }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                style={{ background: d.color }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {d.label}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold mono-tech"
                style={{ color: d.color }}
              >
                {d.value}%
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                ${d.amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 68 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <XAxis type="number" hide domain={[0, 100]} />
            <Tooltip
              formatter={(value, name) => [`${value ?? 0}%`, String(name ?? "")] as [string, string]}
              contentStyle={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={12}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        className="text-center text-xs mt-2 font-semibold"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Total: ${price.toFixed(2)} USD
      </div>
    </div>
  );
}
