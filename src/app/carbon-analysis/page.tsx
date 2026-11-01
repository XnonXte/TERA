"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  Info,
  Calculator,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Flame,
  Zap,
} from "lucide-react";
import WaterfallChart from "@/components/charts/WaterfallChart";
import { useTeraStore } from "@/stores/useTeraStore";
import { CarbonDriver } from "@/types/tera";

export default function CarbonAnalysisPage() {
  const { drivers } = useTeraStore();

  const [activeScopeFilter, setActiveScopeFilter] = useState("All");
  const [selectedDriver, setSelectedDriver] = useState<CarbonDriver>(drivers[3]); // default to +42 BTS Sites
  const [tableCategory, setTableCategory] = useState("All");

  // Breakdown metrics
  const anchorBase = 1146.0;
  const grossGrowth = 142.2;
  const opReductions = -4.0;
  const finalResult = 1284.2;

  // Filtered drivers for the registry table
  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      if (activeScopeFilter === "Scope 1" && d.scope !== "Scope 1") return false;
      if (activeScopeFilter === "Scope 2" && d.scope !== "Scope 2") return false;
      if (activeScopeFilter === "Material" && Math.abs(d.deltaTco2e) < 10) return false;

      if (tableCategory !== "All") {
        if (!d.category.toLowerCase().includes(tableCategory.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [drivers, activeScopeFilter, tableCategory]);

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#5c5e64]">
        <Link href="/overview" className="hover:text-[#0b1c30] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5c5e64]/60" />
        <span className="font-semibold text-[#0b1c30]">Carbon Driver Analysis</span>
      </nav>

      {/* 2. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#0b1c30] tracking-[-0.8px] leading-[40px]">
            Carbon Driver Analysis
          </h1>
          <p className="text-[14px] text-[#5c5e64] mt-1 leading-[20px]">
            Decompose YoY emissions growth and identify structural, operational, and grid factor drivers.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            alert("Attribution Driver Matrix exported to CSV/Excel (FY2025).")
          }
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#c4c6cd]/50 rounded-[8px] text-[13px] font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-sm shrink-0"
        >
          <Download className="w-4 h-4 text-[#5c5e64]" />
          <span>Export Attribution Matrix</span>
        </button>
      </div>

      {/* 3. Filter Chips / Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveScopeFilter("All")}
          className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-semibold transition-colors ${
            activeScopeFilter === "All"
              ? "bg-[#b80035] text-white shadow-sm"
              : "bg-white text-[#5c5e64] border border-[#e5eeff] hover:bg-[#f8f9ff]"
          }`}
        >
          All Drivers ({drivers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveScopeFilter("Scope 1")}
          className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-semibold transition-colors ${
            activeScopeFilter === "Scope 1"
              ? "bg-[#b80035] text-white shadow-sm"
              : "bg-white text-[#5c5e64] border border-[#e5eeff] hover:bg-[#f8f9ff]"
          }`}
        >
          Scope 1 Direct (3)
        </button>
        <button
          type="button"
          onClick={() => setActiveScopeFilter("Scope 2")}
          className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-semibold transition-colors ${
            activeScopeFilter === "Scope 2"
              ? "bg-[#b80035] text-white shadow-sm"
              : "bg-white text-[#5c5e64] border border-[#e5eeff] hover:bg-[#f8f9ff]"
          }`}
        >
          Scope 2 Electricity (5)
        </button>
        <button
          type="button"
          onClick={() => setActiveScopeFilter("Material")}
          className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-semibold transition-colors ${
            activeScopeFilter === "Material"
              ? "bg-[#b80035] text-white shadow-sm"
              : "bg-white text-[#5c5e64] border border-[#e5eeff] hover:bg-[#f8f9ff]"
          }`}
        >
          Material Drivers (&gt;10 tCO₂e)
        </button>
      </div>

      {/* 4. 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: 2024 Base Anchor */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              2024 Base Year Anchor
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              {anchorBase.toFixed(1)} tCO₂e
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            Audited base reference (v2024.1)
          </div>
        </div>

        {/* Card 2: Gross Structural Growth */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Gross Structural Growth
            </div>
            <div className="text-[30px] font-bold text-[#b80035] tracking-[-0.9px] leading-tight mt-1">
              +{grossGrowth.toFixed(1)} tCO₂e
            </div>
          </div>
          <div className="text-[12px] text-[#b80035] font-semibold">
            +12.4% vs base (activity &amp; grid factor)
          </div>
        </div>

        {/* Card 3: Operational Reductions */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Operational Reductions
            </div>
            <div className="text-[30px] font-bold text-[#00675e] tracking-[-0.9px] leading-tight mt-1">
              {opReductions.toFixed(1)} tCO₂e
            </div>
          </div>
          <div className="text-[12px] text-[#00675e] font-semibold">
            -0.35% savings (DC Chiller Inverter)
          </div>
        </div>

        {/* Card 4: 2025 Current Footprint */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              2025 Current Footprint
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              {finalResult.toFixed(1)} tCO₂e
            </div>
          </div>
          <div className="text-[12px] text-[#b80035] font-semibold">
            +138.2 tCO₂e net change (+12.06%)
          </div>
        </div>
      </div>

      {/* 5. Waterfall Chart Component */}
      <WaterfallChart
        drivers={drivers}
        selectedDriverId={selectedDriver.id}
        onSelectDriver={(d) => setSelectedDriver(d)}
      />

      {/* 6. Proportional Scope Contribution Section */}
      <div className="bg-white rounded-[12px] p-6 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
            Proportional Scope Contribution
          </h3>
          <span className="text-[11px] font-semibold text-[#5c5e64] bg-[#eff4ff] px-2.5 py-1 rounded-[6px]">
            Total: 1,284.2 tCO₂e
          </span>
        </div>

        {/* Visual Proportional Comparison Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-[12px] font-semibold text-[#0b1c30] mb-1.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#b80035]" />
                <span>Scope 2 (Indirect Electricity &amp; Regional Grids)</span>
              </div>
              <span className="text-[13px] font-bold">1,020.2 tCO₂e (79.4%)</span>
            </div>
            <div className="w-full bg-[#f1f5f9] h-3 rounded-full overflow-hidden">
              <div className="bg-[#b80035] h-full rounded-full" style={{ width: "79.4%" }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[12px] font-semibold text-[#0b1c30] mb-1.5">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#ffb3b6]" />
                <span>Scope 1 (Direct Fuel, Generators &amp; Fleet)</span>
              </div>
              <span className="text-[13px] font-bold">264.0 tCO₂e (20.6%)</span>
            </div>
            <div className="w-full bg-[#f1f5f9] h-3 rounded-full overflow-hidden">
              <div className="bg-[#ffb3b6] h-full rounded-full" style={{ width: "20.6%" }} />
            </div>
          </div>
        </div>

        {/* Analytical Finding Callout Box */}
        <div className="p-4 bg-[#eff4ff] border border-[#dce9ff] rounded-[10px] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#00675e] shrink-0 mt-0.5" />
          <div className="text-[12px] text-[#0b1c30] leading-relaxed">
            <span className="font-bold">Core Driver Finding: </span>
            <strong>79.4%</strong> of the emissions growth is driven by Scope 2 electricity consumption across regional data centers and 42 newly commissioned 5G BTS towers. Grid emission factor adjustments under MEMR #189 contributed an additional <strong>+45.8 tCO₂e</strong> without an increase in underlying energy consumption.
          </div>
        </div>
      </div>

      {/* 7. Driver Decomposition Registry Table */}
      <div className="bg-white rounded-[12px] border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-5 border-b border-[#e5eeff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
              Driver Decomposition Registry
            </h3>
            <p className="text-[12px] text-[#5c5e64] mt-0.5">
              Line-by-line attribution of factors contributing to the 2024–2025 net change
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#eff4ff] p-1 rounded-[8px] border border-[#dce9ff] text-[12px]">
            <button
              type="button"
              onClick={() => setTableCategory("All")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                tableCategory === "All"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              All Categories
            </button>
            <button
              type="button"
              onClick={() => setTableCategory("Boundary")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                tableCategory === "Boundary"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Boundary Expansion
            </button>
            <button
              type="button"
              onClick={() => setTableCategory("Grid")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                tableCategory === "Grid"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Grid Factor
            </button>
            <button
              type="button"
              onClick={() => setTableCategory("Operational")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                tableCategory === "Operational"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Efficiency
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#dce9ff] text-[#5c5e64] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">DRIVER ID</th>
                <th className="py-3 px-4">DRIVER DESCRIPTION</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">SCOPE</th>
                <th className="py-3 px-4 text-right">IMPACT (tCO₂e)</th>
                <th className="py-3 px-4 text-right">CONTRIBUTION</th>
                <th className="py-3 px-4">DATA CONFIDENCE</th>
                <th className="py-3 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredDrivers.map((driver) => {
                const isInc = driver.type === "increase";
                const isRed = driver.type === "reduction";
                const isUnres = driver.type === "unresolved";
                const isSelected = selectedDriver.id === driver.id;

                const contribPercent =
                  driver.type === "increase" || driver.type === "reduction"
                    ? ((driver.deltaTco2e / 138.2) * 100).toFixed(1)
                    : "—";

                return (
                  <tr
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-[#eff4ff]" : "hover:bg-[#f8f9ff]"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0b1c30]">
                      {driver.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0b1c30]">
                        {driver.name}
                      </div>
                      <div className="text-[11px] text-[#5c5e64]">
                        {driver.subLabel}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold text-[#0b1c30] bg-[#eff4ff] px-2 py-0.5 rounded-[4px]">
                        {driver.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#0b1c30] bg-[#e5eeff] px-2 py-0.5 rounded text-[11px]">
                        {driver.scope}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`font-bold ${
                          isInc
                            ? "text-[#b80035]"
                            : isRed
                            ? "text-[#00675e]"
                            : isUnres
                            ? "text-[#d97706]"
                            : "text-[#0b1c30]"
                        }`}
                      >
                        {isInc ? `+${driver.deltaTco2e.toFixed(1)}` : driver.deltaTco2e.toFixed(1)} t
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-semibold text-[#0b1c30]">
                      {contribPercent !== "—" ? `${contribPercent}%` : "—"}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          driver.uncertaintyStatus === "verified"
                            ? "bg-[#dcfce7] text-[#15803d]"
                            : driver.uncertaintyStatus === "estimated"
                            ? "bg-[#fef3c7] text-[#d97706]"
                            : "bg-[#ffdad6] text-[#b80035]"
                        }`}
                      >
                        {driver.uncertaintyStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDriver(driver);
                        }}
                        className="text-[12px] font-semibold text-[#b80035] hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
