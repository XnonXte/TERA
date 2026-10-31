"use client";

import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { fmtAngka } from "@/lib/format";

interface TitikTren {
  year: string;
  scope1: number;
  scope2: number;
  target: number;
}

interface Props {
  data: TitikTren[];
  satuan: string;
  sumber: string;
}

// Tren Scope 1 & 2 (area bertumpuk) dari seed; garis putus-putus = level target (estimasi tim).
export default function EmissionsTrendChart({ data, satuan, sumber }: Props) {
  return (
    <div className="w-full h-80 bg-white p-5 rounded-xl border border-[#e5eeff] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-bold text-[#0b1c30]">Tren emisi Scope 1 &amp; 2</h3>
          <p className="text-[12px] text-[#5c5e64]">
            FY {data[0]?.year}–{data[data.length - 1]?.year} · {satuan} · Sumber: {sumber}
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium text-[#5c5e64]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#0b1c30]" /> Scope 2
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#b80035]" /> Scope 1
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#00675e] border-t-2 border-dashed border-[#00675e]" /> Level target
            (estimasi tim)
          </span>
        </div>
      </div>

      <div className="w-full h-[calc(100%-3rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScope2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0b1c30" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0b1c30" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorScope1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b80035" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#b80035" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={64}
              domain={[0, "auto"]}
              tickFormatter={(v: number) => `${fmtAngka(v / 1_000_000, 1)} jt`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#0b1c30] text-white p-3 rounded-lg shadow-xl text-[12px] space-y-1">
                      <div className="font-bold text-white border-b border-white/10 pb-1 mb-1">FY {label}</div>
                      {payload.map((entry, index) => {
                        if (entry.value === null || entry.value === undefined) return null;
                        return (
                          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                            <span className="text-[#c4c6cd]">{entry.name}:</span>
                            <span className="font-semibold text-white">
                              {fmtAngka(Number(entry.value))} {satuan}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="scope2"
              name="Scope 2"
              stackId="1"
              stroke="#0b1c30"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorScope2)"
            />
            <Area
              type="monotone"
              dataKey="scope1"
              name="Scope 1"
              stackId="1"
              stroke="#b80035"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorScope1)"
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Level target (estimasi tim)"
              stroke="#00675e"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: "#00675e" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
