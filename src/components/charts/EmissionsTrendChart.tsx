"use client";

import React from "react";
import Link from "next/link";
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
import { ArrowRight } from "lucide-react";

const TREND_DATA = [
  { year: "2020", actual: 800, target: 800 },
  { year: "2021", actual: 860, target: 765 },
  { year: "2022", actual: 940, target: 730 },
  { year: "2023", actual: 1010, target: 700 },
  { year: "2024", actual: 1146, target: 670 },
  { year: "2025", actual: 1284, target: 640 },
];

export default function EmissionsTrendChart() {
  return (
    <div className="w-full bg-white p-5 rounded-[12px] border border-[#e5eeff] shadow-[0px_4px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[420px]">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
              Emissions Trend (Scope 1+2)
            </h2>
            <span className="bg-[#e5eeff] text-[#5c5e64] text-[11px] font-semibold px-2 py-0.5 rounded-[4px] tracking-[0.22px]">
              2020 - 2025
            </span>
          </div>
          <p className="text-[11px] text-[#5c5e64] mt-1 tracking-[0.11px]">
            Historical GHG footprint trajectory measured against 2030 Science-Based Target.
          </p>
        </div>

        <Link
          href="/carbon-analysis"
          className="flex items-center gap-1 text-[13px] font-semibold text-[#b80035] hover:underline"
        >
          <span>View analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Interactive SVG Chart Area */}
      <div className="w-full h-[290px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={TREND_DATA}
            margin={{ top: 15, right: 25, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b80035" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#b80035" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f0f3f8" strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#5c5e64"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tick={(props) => {
                const is2025 = props.payload.value === "2025";
                return (
                  <text
                    x={props.x}
                    y={Number(props.y) + 12}
                    textAnchor="middle"
                    fill={is2025 ? "#e11d48" : "#0b1c30"}
                    fontWeight={is2025 ? "bold" : "normal"}
                    fontSize={12}
                  >
                    {props.payload.value}
                  </text>
                );
              }}
            />
            <YAxis
              stroke="#5c5e64"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              ticks={[0, 400, 800, 1200, 1600]}
              domain={[0, 1600]}
              tickFormatter={(v) => v.toLocaleString()}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#0b1c30] text-white p-2.5 rounded-lg shadow-xl text-[12px] space-y-1">
                      <div className="font-bold border-b border-white/10 pb-1">Year {label}</div>
                      <div className="flex justify-between gap-3 text-[#ffb3b6]">
                        <span>Actual:</span>
                        <span className="font-bold">{payload[0]?.value} tCO₂e</span>
                      </div>
                      <div className="flex justify-between gap-3 text-[#94a3b8]">
                        <span>Target:</span>
                        <span>{payload[1]?.value} tCO₂e</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#b80035"
              strokeWidth={2.5}
              fill="url(#trendGradient)"
              dot={(dotProps) => {
                const is2025 = dotProps.payload.year === "2025";
                return (
                  <circle
                    key={dotProps.index}
                    cx={dotProps.cx}
                    cy={dotProps.cy}
                    r={is2025 ? 5.5 : 4}
                    fill={is2025 ? "#b80035" : "#ffffff"}
                    stroke="#b80035"
                    strokeWidth={2}
                  />
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
