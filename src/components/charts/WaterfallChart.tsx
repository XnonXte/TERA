"use client";

import React from "react";
import { CarbonDriver } from "@/types/tera";
import { skalaWaterfall, JUMLAH_GARIS_SUMBU } from "@/lib/hitung-carbon";
import { fmtBertanda, fmtJuta } from "@/lib/format";

const JUMLAH_GARIS = JUMLAH_GARIS_SUMBU;
const juta = fmtJuta;

interface WaterfallChartProps {
  drivers: CarbonDriver[];
  selectedDriverId?: string;
  onSelectDriver?: (driver: CarbonDriver) => void;
}

export default function WaterfallChart({
  drivers,
  selectedDriverId,
  onSelectDriver,
}: WaterfallChartProps) {
  // SVG coordinate calculations
  const maxYKosong = 0;
  const chartHeight = 260;
  const paddingBottom = 45;
  const paddingTop = 30;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  // Domain dihitung dari data yang ditampilkan
  const skala = skalaWaterfall(drivers.length ? drivers.map((d) => d.runningVal) : [maxYKosong], JUMLAH_GARIS);
  const minY = skala.bawah;
  const maxY = skala.atas;
  const rangeY = maxY - minY;

  const getY = (val: number) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return paddingTop + usableHeight - ((clamped - minY) / rangeY) * usableHeight;
  };

  return (
    <div className="w-full bg-white p-5 rounded-xl border border-[#e5eeff] shadow-sm select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-[#0b1c30]">
              Dekomposisi pendorong emisi
            </h3>
          </div>
          <p className="text-[12px] text-[#5c5e64]">
            {drivers.length ? `${drivers[0].name} → ${drivers[drivers.length - 1].name} · ${drivers[0].source}` : "—"}
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium text-[#5c5e64]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#0b1c30]" /> Awal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#b80035]" /> Kenaikan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#00675e]" /> Penurunan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#f59e0b] border border-dashed border-[#b45309]" /> Pembulatan
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 850 ${chartHeight}`}
          className="w-full h-auto min-w-[750px]"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Striped pattern for unresolved telemetry gap */}
            <pattern
              id="diagonalHatch"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45 0 0)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="#d97706"
                strokeWidth="2"
              />
            </pattern>
          </defs>

          {/* Grid lines */}
          {skala.garis.map((level) => {
            const y = getY(level);
            return (
              <g key={level}>
                <line
                  x1="50"
                  y1={y}
                  x2="830"
                  y2={y}
                  stroke="#f1f5f9"
                  strokeDasharray="4 4"
                />
                <text
                  x="42"
                  y={y + 3}
                  fontSize="10"
                  fill="#94a3b8"
                  textAnchor="end"
                  fontFamily="sans-serif"
                >
                  {juta(level)}
                </text>
              </g>
            );
          })}

          {/* Stepped Bars & Connecting Lines */}
          {drivers.map((driver, index) => {
            const colWidth = 64;
            const gap = 32;
            const x = 60 + index * (colWidth + gap);

            let barY: number;
            let barH: number;
            let fillColor: string;
            let valLabel: string;
            let prevVal: number;

            if (index === 0) {
              // 2024 Base Anchor
              barY = getY(driver.deltaTco2e);
              barH = chartHeight - paddingBottom - barY;
              fillColor = "#0b1c30";
              valLabel = juta(driver.deltaTco2e);
            } else if (index === drivers.length - 1) {
              // 2025 Result Anchor
              barY = getY(driver.deltaTco2e);
              barH = chartHeight - paddingBottom - barY;
              fillColor = "#0b1c30";
              valLabel = juta(driver.deltaTco2e);
            } else {
              prevVal = drivers[index - 1].runningVal;
              const curVal = driver.runningVal;

              if (driver.type === "increase") {
                barY = getY(curVal);
                barH = getY(prevVal) - getY(curVal);
                fillColor = "#b80035";
                valLabel = fmtBertanda(driver.deltaTco2e);
              } else if (driver.type === "reduction") {
                barY = getY(prevVal);
                barH = getY(curVal) - getY(prevVal);
                fillColor = "#00675e";
                valLabel = fmtBertanda(driver.deltaTco2e);
              } else {
                // Unresolved gap
                barY = getY(curVal) - 10;
                barH = 20;
                fillColor = "url(#diagonalHatch)";
                valLabel = fmtBertanda(driver.deltaTco2e);
              }
            }

            const isSelected = selectedDriverId === driver.id;

            return (
              <g
                key={driver.id}
                onClick={() => onSelectDriver && onSelectDriver(driver)}
                className="cursor-pointer transition-transform hover:opacity-95"
              >
                {/* Connecting dashed line to next bar */}
                {index < drivers.length - 1 && (
                  <line
                    x1={x + colWidth}
                    y1={getY(driver.runningVal)}
                    x2={x + colWidth + gap}
                    y2={getY(driver.runningVal)}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* The Bar */}
                <rect
                  x={x}
                  y={barY}
                  width={colWidth}
                  height={Math.max(4, barH)}
                  rx="4"
                  fill={fillColor}
                  stroke={isSelected ? "#b80035" : driver.type === "unresolved" ? "#d97706" : "none"}
                  strokeWidth={isSelected ? "2.5" : driver.type === "unresolved" ? "1.5" : "0"}
                  className="transition-all"
                />

                {/* Value Label above bar */}
                <text
                  x={x + colWidth / 2}
                  y={barY - 8}
                  fontSize="11"
                  fontWeight="bold"
                  fill={
                    driver.type === "increase"
                      ? "#b80035"
                      : driver.type === "reduction"
                      ? "#00675e"
                      : driver.type === "unresolved"
                      ? "#d97706"
                      : "#0b1c30"
                  }
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {valLabel}
                </text>

                {/* Sub-label at bottom */}
                <text
                  x={x + colWidth / 2}
                  y={chartHeight - paddingBottom + 16}
                  fontSize="11"
                  fontWeight="600"
                  fill={isSelected ? "#b80035" : "#0b1c30"}
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {driver.name}
                </text>

                <text
                  x={x + colWidth / 2}
                  y={chartHeight - paddingBottom + 30}
                  fontSize="9.5"
                  fill="#5c5e64"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {driver.subLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
