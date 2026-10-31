"use client";

import React, { useState } from "react";
import {
  CloudSun,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  Download,
  Info,
  Activity,
  Calculator,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import WaterfallChart from "@/components/charts/WaterfallChart";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTeraStore } from "@/stores/useTeraStore";
import { CarbonDriver } from "@/types/tera";

export default function CarbonAnalysisPage() {
  const { drivers } = useTeraStore();
  const [selectedDriver, setSelectedDriver] = useState<CarbonDriver>(drivers[3]); // default to +42 BTS Sites

  // Breakdown metrics
  const anchorBase = drivers.find((d) => d.id === "DRV-01")?.deltaTco2e || 1146;
  const increases = drivers
    .filter((d) => d.type === "increase")
    .reduce((sum, d) => sum + d.deltaTco2e, 0);
  const reductions = drivers
    .filter((d) => d.type === "reduction")
    .reduce((sum, d) => sum + d.deltaTco2e, 0);
  const finalResult = drivers.find((d) => d.id === "DRV-08")?.deltaTco2e || 1284.2;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        badge="ATTRIBUTION MODELLING"
        title="Carbon Driver Analysis"
        description="Granular decomposition of year-on-year emissions growth, grid emission factor shocks, boundary expansion, and efficiency savings."
        actions={
          <button
            type="button"
            onClick={() => alert("Attribution Driver Matrix exported to CSV/Excel.")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c4c6cd]/50 rounded-lg text-[13px] font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-[#5c5e64]" />
            <span>Export Attribution Matrix</span>
          </button>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="2024 Base Anchor"
          value={anchorBase.toFixed(1)}
          unit="tCO₂e"
          subtitle="Locked reference footprint"
          badge={{ text: "Baseline Anchor", variant: "default" }}
        />
        <KpiCard
          label="Gross Driver Increase"
          value={`+${increases.toFixed(1)}`}
          unit="tCO₂e"
          delta={{ value: "+12.4%", isPositiveGood: false, label: "Gross" }}
          subtitle="Activity, grid factor & BTS towers"
          icon={<ArrowUpRight className="w-4 h-4 text-[#b80035]" />}
        />
        <KpiCard
          label="Efficiency Reductions"
          value={`${reductions.toFixed(1)}`}
          unit="tCO₂e"
          delta={{ value: "-0.4%", isPositiveGood: true, label: "Savings" }}
          subtitle="DC Chiller Inverter retrofit"
          icon={<ArrowDownRight className="w-4 h-4 text-[#00675e]" />}
        />
        <KpiCard
          label="2025 Current Footprint"
          value={finalResult.toFixed(1)}
          unit="tCO₂e"
          delta={{ value: "+138.2 t", isPositiveGood: false, label: "Net" }}
          subtitle="1,146.0 → 1,284.2 tCO₂e (+12.1%)"
          icon={<Activity className="w-4 h-4 text-[#0b1c30]" />}
        />
      </div>

      {/* Waterfall Visualization Component */}
      <WaterfallChart
        drivers={drivers}
        selectedDriverId={selectedDriver.id}
        onSelectDriver={(d) => setSelectedDriver(d)}
      />

      {/* Driver Inspector & Attribution Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Driver Cards List */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
            <h3 className="text-[14px] font-bold text-[#0b1c30]">
              Attribution Drivers
            </h3>
            <span className="text-[11px] font-semibold text-[#5c5e64]">
              {drivers.length} Factors
            </span>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {drivers.map((drv) => {
              const isSelected = selectedDriver.id === drv.id;
              const isInc = drv.type === "increase";
              const isRed = drv.type === "reduction";
              const isUnres = drv.type === "unresolved";

              return (
                <div
                  key={drv.id}
                  onClick={() => setSelectedDriver(drv)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#eff4ff] border-[#b80035] shadow-sm"
                      : "bg-[#f8f9ff] border-[#e5eeff] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-[#0b1c30]">
                      {drv.name}
                    </span>
                    <span
                      className={`text-[12px] font-bold ${
                        isInc
                          ? "text-[#b80035]"
                          : isRed
                          ? "text-[#00675e]"
                          : isUnres
                          ? "text-[#d97706]"
                          : "text-[#0b1c30]"
                      }`}
                    >
                      {isInc ? `+${drv.deltaTco2e.toFixed(1)}` : drv.deltaTco2e.toFixed(1)} t
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-[#5c5e64]">
                    <span>{drv.category}</span>
                    <span>{drv.scope}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Inspection Details */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5eeff] p-6 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Inspector Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#e5eeff]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono font-bold text-[#5c5e64]">
                    {selectedDriver.id}
                  </span>
                  <StatusBadge
                    status={
                      selectedDriver.uncertaintyStatus === "verified"
                        ? "verified"
                        : selectedDriver.uncertaintyStatus === "estimated"
                        ? "estimated"
                        : "unresolved"
                    }
                    size="sm"
                  />
                  <span className="text-[11px] font-semibold text-[#0b1c30] bg-[#e5eeff] px-2 py-0.5 rounded">
                    {selectedDriver.scope}
                  </span>
                </div>
                <h2 className="text-[20px] font-bold text-[#0b1c30]">
                  {selectedDriver.name} {selectedDriver.subLabel}
                </h2>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold text-[#5c5e64] uppercase">
                  Attributed Impact
                </div>
                <div
                  className={`text-[24px] font-extrabold ${
                    selectedDriver.type === "increase"
                      ? "text-[#b80035]"
                      : selectedDriver.type === "reduction"
                      ? "text-[#00675e]"
                      : "text-[#0b1c30]"
                  }`}
                >
                  {selectedDriver.type === "increase" ? "+" : ""}
                  {selectedDriver.deltaTco2e.toFixed(1)} tCO₂e
                </div>
              </div>
            </div>

            {/* Formula / Calculation Breakdown */}
            <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#dce9ff] space-y-2">
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#0b1c30]">
                <Calculator className="w-4 h-4 text-[#b80035]" />
                <span>Attribution Formula & Mathematics</span>
              </div>
              <div className="font-mono text-[13px] bg-white p-3 rounded border border-[#dce9ff] text-[#0b1c30]">
                {selectedDriver.formula}
              </div>
              <p className="text-[11px] text-[#5c5e64]">
                Mathematical attribution separating volume activity variance from grid emission factor changes under GHG Protocol Scope 2 Guidance.
              </p>
            </div>

            {/* Evidence & Source Attribution */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Source Document Reference & Telemetry Origin
              </div>
              <div className="p-3 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-[13px] text-[#0b1c30]">
                {selectedDriver.source}
              </div>
            </div>

            {/* Telemetry Gap Special Notice */}
            {selectedDriver.type === "unresolved" && (
              <div className="p-4 bg-[#fffbeb] border border-[#fde68a] rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5" />
                <div className="space-y-1 text-[12px] text-[#78350f]">
                  <div className="font-bold">
                    Telemetry Gap Indicator (+0.0* tCO₂e)
                  </div>
                  <div>
                    Site D facility meter logs are unresolved (Rule DQ-01). As mandated by PRD Section 4.3, unresolved telemetry gaps are preserved visually with striped textures rather than hidden, preventing artificial under-reporting of organizational emissions.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#e5eeff] flex items-center justify-between text-[12px] text-[#5c5e64]">
            <span>Cumulative running balance at this step:</span>
            <span className="font-bold text-[#0b1c30] text-[14px]">
              {(selectedDriver.runningVal ?? 0).toFixed(1)} tCO₂e
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
