"use client";

import React from "react";
import { DecarbonizationOption } from "@/types/tera";

interface AbatementMacChartProps {
  options: DecarbonizationOption[];
  onToggleOption?: (id: string) => void;
}

export default function AbatementMacChart({
  options,
  onToggleOption,
}: AbatementMacChartProps) {
  // Sort options with valid cost effectiveness in ascending order of MAC ratio
  const validOptions = options
    .filter((o) => o.costEffectiveness !== null)
    .sort((a, b) => (a.costEffectiveness || 0) - (b.costEffectiveness || 0));

  const totalReduction = validOptions.reduce(
    (sum, o) => sum + (o.estimatedReductionTco2e || 0),
    0
  );

  return (
    <div className="w-full bg-white p-5 rounded-xl border border-[#e5eeff] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-[#0b1c30]">
              Marginal Abatement Cost Curve (MACC)
            </h3>
            <span className="text-[11px] font-bold bg-[#ecfdf5] text-[#059669] px-2 py-0.5 rounded-full border border-[#a7f3d0]">
              Cost-Efficiency Optimized
            </span>
          </div>
          <p className="text-[12px] text-[#5c5e64]">
            Levelized Capex per tCO₂e abated (Rp M/t) vs annual decarbonization volume (tCO₂e/yr)
          </p>
        </div>
        <div className="text-[11px] text-[#5c5e64]">
          X-axis: Cumulative Reduction ({totalReduction.toFixed(1)} tCO₂e)
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {validOptions.map((opt) => {
          const widthPct = Math.min(
            100,
            Math.max(15, ((opt.estimatedReductionTco2e || 0) / totalReduction) * 100)
          );
          const ratio = opt.costEffectiveness;

          return (
            <div
              key={opt.id}
              onClick={() => onToggleOption && onToggleOption(opt.id)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                opt.selected
                  ? "bg-[#f8f9ff] border-[#b80035]/40 shadow-sm"
                  : "bg-gray-50/60 border-gray-200 opacity-60 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      opt.selected ? "bg-[#b80035]" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-[13px] font-bold text-[#0b1c30]">
                    {opt.name}
                  </span>
                  <span className="text-[11px] font-semibold text-[#5c5e64] bg-[#e5eeff] px-2 py-0.5 rounded">
                    {opt.code}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[11px] text-[#5c5e64]">Levelized Ratio: </span>
                    <span className="text-[13px] font-bold text-[#0b1c30]">
                      Rp {ratio?.toFixed(1)} M/t
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#5c5e64]">Volume: </span>
                    <span className="text-[13px] font-bold text-[#00675e]">
                      -{opt.estimatedReductionTco2e} tCO₂e
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar visualizing share of reduction */}
              <div className="w-full bg-[#e5eeff] h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    opt.selected ? "bg-[#0b1c30]" : "bg-gray-300"
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Insufficient data option note */}
        {options.some((o) => o.costEffectiveness === null) && (
          <div className="p-3 bg-[#fffbeb] border border-[#fef3c7] rounded-lg flex items-center justify-between text-[12px] text-[#78350f]">
            <span className="font-semibold">
              ⚠️ PRD Rule Notice: OPT-04 (Biofuel Genset Blending B50)
            </span>
            <span>
              Abatement ratio omitted: data insufficient (zero/uncertain reduction factor per Section 4.3).
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
