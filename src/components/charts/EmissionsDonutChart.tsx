"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const DATA = [
  { name: "Scope 2", value: 1020, percent: "79%", color: "#b80035" },
  { name: "Scope 1", value: 264, percent: "21%", color: "#ffb3b6" },
];

export default function EmissionsDonutChart() {
  return (
    <div className="w-full bg-white p-5 rounded-[12px] border border-[#e5eeff] shadow-[0px_4px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[420px]">
      {/* Title */}
      <div>
        <h2 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
          Emissions Breakdown
        </h2>
      </div>

      {/* Middle row: Donut + Legend */}
      <div className="flex items-center justify-between gap-2 my-auto">
        {/* Donut Chart */}
        <div className="relative w-[150px] h-[150px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DATA}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={68}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#0b1c30] text-white p-2 rounded shadow-lg text-[11px]">
                        <span className="font-semibold">{d.name}: </span>
                        <span>{d.value} tCO₂e ({d.percent})</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-semibold text-[#5c5e64] tracking-[0.55px] uppercase leading-none">
              TOTAL
            </span>
            <span className="text-[20px] font-bold text-[#0b1c30] tracking-[-0.33px] leading-tight mt-0.5">
              1,284
            </span>
          </div>
        </div>

        {/* Legend Items */}
        <div className="flex-1 space-y-2">
          {/* Scope 2 */}
          <div className="bg-[rgba(239,244,255,0.6)] rounded-[8px] p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-[3px] bg-[#b80035] shrink-0" />
              <span className="text-[12px] font-medium text-[#0b1c30]">Scope 2</span>
            </div>
            <span className="text-[12px] font-bold text-[#0b1c30]">
              1,020 (79%)
            </span>
          </div>

          {/* Scope 1 */}
          <div className="bg-[rgba(239,244,255,0.6)] rounded-[8px] p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-[3px] bg-[#ffb3b6] shrink-0" />
              <span className="text-[12px] font-medium text-[#0b1c30]">Scope 1</span>
            </div>
            <span className="text-[12px] font-bold text-[#0b1c30]">
              264 (21%)
            </span>
          </div>
        </div>
      </div>

      {/* Target Pathway Progress Card */}
      <div className="bg-[#eff4ff]/60 border border-[#e5eeff] rounded-[8px] p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-[#0b1c30] tracking-[0.11px]">
            Decarbonization Plan 2030
          </span>
          <span className="font-bold text-[#b80035] tracking-[0.24px]">
            64% Achieved
          </span>
        </div>
        <div className="w-full bg-[#d3e4fe] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#b80035] h-full rounded-full transition-all"
            style={{ width: "64%" }}
          />
        </div>
        <p className="text-[11px] text-[#5c5e64] leading-[15px]">
          On track for 50% absolute emission cut (baseline 2020: 710 tCO₂e).
        </p>
      </div>
    </div>
  );
}
