"use client";

import React from "react";
import { DecarbonizationOption } from "@/types/tera";

interface CostEffectivenessChartProps {
  options: DecarbonizationOption[];
  onToggleOption?: (id: string) => void;
}

export default function CostEffectivenessChart({
  options,
  onToggleOption,
}: CostEffectivenessChartProps) {
  // Sort options with valid cost effectiveness in ascending order of MAC ratio
  const validOptions = [...options]
    .filter((o) => o.costEffectiveness !== null)
    .sort((a, b) => (a.costEffectiveness || 0) - (b.costEffectiveness || 0));

  const totalReduction = validOptions.reduce(
    (sum, o) => sum + (o.reductionTco2e || 0),
    0
  );

  return (
    <div className="w-full bg-white p-5 rounded-[12px] border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e5eeff]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
              Grafik efektivitas biaya
            </h3>
            <span className="text-[11px] font-bold bg-[#eff4ff] text-[#00675e] px-2.5 py-0.5 rounded-full border border-[#dce9ff]">
              Spesifikasi
            </span>
          </div>
          <p className="text-[12px] text-[#5c5e64] mt-0.5">
            —
          </p>
        </div>

        {/* Shadow Price Ceiling Indicator */}
        <div className="flex items-center gap-2 bg-[#fff1f2] border border-[#ffdad6] px-3 py-1.5 rounded-[8px] text-[11px]">
          <span className="w-2.5 h-0.5 bg-[#b80035] border-t-2 border-dashed border-[#b80035]" />
          <span className="text-[#5c5e64]">
            Batas harga karbon internal: <strong className="text-[#b80035]">—</strong>
          </span>
        </div>
      </div>

      {/* Visual Items */}
      <div className="space-y-3 pt-1">
        {validOptions.map((opt) => {
          const ratio = opt.costEffectiveness || 0;
          const isAboveCeiling = ratio > 350;
          const isNetNegative = ratio < 0;
          const widthPct = Math.min(
            100,
            Math.max(20, ((opt.reductionTco2e || 0) / totalReduction) * 100)
          );

          return (
            <div
              key={opt.id}
              onClick={() => onToggleOption && onToggleOption(opt.id)}
              className={`p-3.5 rounded-[10px] border transition-all cursor-pointer ${
                opt.selected
                  ? "bg-[#eff4ff]/60 border-[#b80035] shadow-sm ring-1 ring-[#b80035]/20"
                  : "bg-[#f8f9ff] border-[#e5eeff] opacity-60 hover:opacity-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3 h-3 rounded-[3px] border ${
                      opt.selected
                        ? "bg-[#b80035] border-[#b80035]"
                        : "bg-white border-[#c4c6cd]"
                    }`}
                  />
                  <span className="text-[13px] font-bold text-[#0b1c30]">
                    {opt.name}
                  </span>
                  <span className="text-[11px] font-semibold text-[#5c5e64] bg-[#eff4ff] px-2 py-0.5 rounded">
                    {opt.code}
                  </span>
                  {isNetNegative && (
                    <span className="text-[10px] font-bold bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full">
                      —
                    </span>
                  )}
                  {isAboveCeiling && (
                    <span className="text-[10px] font-bold bg-[#ffdad6] text-[#b80035] px-2 py-0.5 rounded-full">
                      —
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-right text-[12px]">
                  <div>
                    <span className="text-[#5c5e64]">MAC: </span>
                    <strong
                      className={
                        isNetNegative
                          ? "text-[#15803d]"
                          : isAboveCeiling
                          ? "text-[#b80035]"
                          : "text-[#0b1c30]"
                      }
                    >
                      —
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#5c5e64]">Volume: </span>
                    <strong className="text-[#00675e]">
                      —
                    </strong>
                  </div>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-[#dce9ff] h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    opt.selected
                      ? isNetNegative
                        ? "bg-[#00675e]"
                        : isAboveCeiling
                        ? "bg-[#ba1a1a]"
                        : "bg-[#b80035]"
                      : "bg-[#94a3b8]"
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* PRD Notice for Insufficient Data */}
        {options.some((o) => o.costEffectiveness === null) && (
          <div className="p-3 bg-[#fffbeb] border border-[#fef3c7] rounded-[8px] flex items-center justify-between text-[11px] text-[#78350f]">
            <span className="font-bold">
              —
            </span>
            <span>
              —
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
