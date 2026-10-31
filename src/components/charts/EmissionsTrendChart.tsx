"use client";

import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { fmtAngka } from "@/lib/format";

interface TitikTren {
  tahun: string;
  scope1_2: number;
  target: number;
}

interface Props {
  data: TitikTren[];
  tahunAktif: string;
  satuan: string;
  sumber: string;
}

// Tren Scope 1+2 dari seed; garis putus-putus = level target (estimasi tim).
export default function EmissionsTrendChart({ data, tahunAktif, satuan, sumber }: Props) {
  return (
    <div className="w-full bg-white p-5 rounded-xl border border-[#e5eeff] shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-[14px] font-bold text-[#0b1c30]">Tren Scope 1+2</h3>
          <p className="text-[12px] text-[#5c5e64]">
            {data[0]?.tahun}-{data[data.length - 1]?.tahun} · {satuan} · Sumber: {sumber}
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#5c5e64]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#b80035]" /> Scope 1+2
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 border-t-2 border-dashed border-[#5c5e64]" /> Level target (estimasi tim)
          </span>
        </div>
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="tahun" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={70}
              domain={[0, "auto"]}
              tickFormatter={(v: number) => fmtAngka(v, 0)}
            />
            <Tooltip
              formatter={(v) => `${fmtAngka(Number(v))} ${satuan}`}
              labelFormatter={(l) => `Tahun ${l}`}
            />
            <Line
              type="linear"
              dataKey="scope1_2"
              name="Scope 1+2"
              stroke="#b80035"
              strokeWidth={2}
              isAnimationActive={false}
              dot={(p: { cx?: number; cy?: number; payload?: TitikTren }) => (
                <circle
                  key={p.payload?.tahun}
                  cx={p.cx}
                  cy={p.cy}
                  r={p.payload?.tahun === tahunAktif ? 6 : 3.5}
                  fill="#b80035"
                  stroke="#fff"
                  strokeWidth={1.5}
                />
              )}
            />
            <Line
              type="linear"
              dataKey="target"
              name="Level target (estimasi tim)"
              stroke="#5c5e64"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
