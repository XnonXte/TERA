"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { fmtAngka, fmtPersen } from "@/lib/format";

interface Props {
  tahun: string;
  scope1: number;
  scope2: number;
  pctScope1: number;
  pctScope2: number;
  total: number;
  satuan: string;
  sumber: string;
}

// Komposisi Scope 1 vs Scope 2 untuk FY terpilih; semua nilai dari seed.
export default function EmissionsDonutChart({ tahun, scope1, scope2, pctScope1, pctScope2, total, satuan, sumber }: Props) {
  const DATA = [
    { name: "Scope 1", value: scope1, color: "#b80035", percent: fmtPersen(pctScope1, 2, false) },
    { name: "Scope 2", value: scope2, color: "#0b1c30", percent: fmtPersen(pctScope2, 2, false) },
  ];

  return (
    <div className="w-full h-80 bg-white p-5 rounded-xl border border-[#e5eeff] shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-[14px] font-bold text-[#0b1c30]">Komposisi Scope 1 vs Scope 2 · FY {tahun}</h3>
        <p className="text-[12px] text-[#5c5e64]">Sumber: {sumber}</p>
      </div>

      <div className="relative w-full h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
              {DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#0b1c30] text-white p-2.5 rounded-lg shadow-xl text-[12px]">
                      <div className="font-semibold text-white">{data.name}</div>
                      <div className="text-[13px] font-bold text-[#fff1f2] mt-0.5">
                        {fmtAngka(data.value)} {satuan} ({data.percent})
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[20px] font-extrabold text-[#0b1c30] tracking-tight">{fmtAngka(total / 1_000_000, 2)} jt</span>
          <span className="text-[10px] uppercase font-bold text-[#5c5e64] tracking-widest">{satuan} total</span>
        </div>
      </div>
      <div className="flex items-center justify-around pt-3 border-t border-[#f1f5f9] text-[12px]">
        {DATA.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <div>
              <div className="font-semibold text-[#0b1c30] leading-none">
                {fmtAngka(item.value)} ({item.percent})
              </div>
              <div className="text-[10px] text-[#5c5e64] mt-0.5">{item.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
