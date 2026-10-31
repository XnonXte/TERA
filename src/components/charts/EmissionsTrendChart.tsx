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
  Legend,
} from "recharts";

const HISTORICAL_DATA = [
  { year: "2020", scope1: 210, scope2: 730, total: 940, target: null },
  { year: "2021", scope1: 225, scope2: 770, total: 995, target: null },
  { year: "2022", scope1: 238, scope2: 812, total: 1050, target: null },
  { year: "2023", scope1: 240, scope2: 840, total: 1080, target: null },
  { year: "2024", scope1: 256.7, scope2: 889.3, total: 1146.0, target: 1146.0 },
  { year: "2025", scope1: 264.2, scope2: 1020.0, total: 1284.2, target: 1050 },
  { year: "2026", scope1: null, scope2: null, total: null, target: 950 },
  { year: "2027", scope1: null, scope2: null, total: null, target: 860 },
  { year: "2028", scope1: null, scope2: null, total: null, target: 780 },
  { year: "2029", scope1: null, scope2: null, total: null, target: 715 },
  { year: "2030", scope1: null, scope2: null, total: null, target: 665 },
];

export default function EmissionsTrendChart() {
  return (
    <div className="w-full h-80 bg-white p-5 rounded-xl border border-[#e5eeff] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-bold text-[#0b1c30]">
            Emissions Trajectory & SBTi 2030 Pathway
          </h3>
          <p className="text-[12px] text-[#5c5e64]">
            Historical Scope 1 & 2 actuals (2020–2025) vs 1.5°C Paris aligned target (-42% by 2030)
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium text-[#5c5e64]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#0b1c30]" /> Scope 2 (Grid & DC)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#b80035]" /> Scope 1 (Direct Fuel & Ref.)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#00675e] border-t-2 border-dashed border-[#00675e]" /> SBTi Pathway
          </span>
        </div>
      </div>

      <div className="w-full h-[calc(100%-3rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={HISTORICAL_DATA}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
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
            <XAxis
              dataKey="year"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 1400]}
              tickFormatter={(v) => `${v} t`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#0b1c30] text-white p-3 rounded-lg shadow-xl text-[12px] space-y-1">
                      <div className="font-bold text-white border-b border-white/10 pb-1 mb-1">
                        Year {label}
                      </div>
                      {payload.map((entry, index) => {
                        if (entry.value === null) return null;
                        return (
                          <div
                            key={`item-${index}`}
                            className="flex items-center justify-between gap-4"
                          >
                            <span className="text-[#c4c6cd]">{entry.name}:</span>
                            <span className="font-semibold text-white">
                              {Number(entry.value).toLocaleString()} tCO₂e
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
              name="SBTi 2030 Target Pathway"
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
