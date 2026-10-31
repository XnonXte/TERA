"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const DATA = [
  { name: "Scope 1 (Direct)", value: 264.2, color: "#b80035", percent: "20.6%" },
  { name: "Scope 2 (Indirect)", value: 1020.0, color: "#0b1c30", percent: "79.4%" },
];

export default function EmissionsDonutChart() {
  return (
    <div className="w-full h-80 bg-white p-5 rounded-xl border border-[#e5eeff] shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-[14px] font-bold text-[#0b1c30]">
          2025 Scope 1 vs Scope 2 Breakdown
        </h3>
        <p className="text-[12px] text-[#5c5e64]">
          Operational emissions profile for current reporting year
        </p>
      </div>

      <div className="relative w-full h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DATA}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
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
                        {data.value} tCO₂e ({data.percent})
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
          <span className="text-[20px] font-extrabold text-[#0b1c30] tracking-tight">
            1,284.2
          </span>
          <span className="text-[10px] uppercase font-bold text-[#5c5e64] tracking-widest">
            tCO₂e Total
          </span>
        </div>
      </div>

      <div className="flex items-center justify-around pt-3 border-t border-[#f1f5f9] text-[12px]">
        {DATA.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div>
              <div className="font-semibold text-[#0b1c30] leading-none">
                {item.value} t ({item.percent})
              </div>
              <div className="text-[10px] text-[#5c5e64] mt-0.5">{item.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
