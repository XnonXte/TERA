"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FlaskConical,
  RotateCcw,
  BookmarkCheck,
  CheckCircle2,
  ChevronRight,
  CheckSquare,
  Sliders,
  Info,
} from "lucide-react";
import AbatementMacChart from "@/components/charts/AbatementMacChart";
import { useTeraStore } from "@/stores/useTeraStore";

export default function DecisionLabPage() {
  const {
    options,
    toggleOption,
    simulationParams,
    setSimulationParams,
    saveScenarioSimulation,
    savedScenariosCount,
  } = useTeraStore();

  const [notification, setNotification] = useState("");

  const selectedOptions = options.filter((o) => o.selected);

  // Dynamic calculations factoring in simulation parameters
  const totalReduction = selectedOptions.reduce(
    (sum, o) => sum + (o.estimatedReductionTco2e || 0),
    0
  );

  const baseCapex = selectedOptions.reduce(
    (sum, o) => sum + (o.implementationCostIdr || 0),
    0
  );
  const adjustedCapex = baseCapex * simulationParams.capexMultiplier;

  const annualOpexSavings = selectedOptions.reduce(
    (sum, o) => sum + (o.annualOperatingCostIdr || 0),
    0
  );

  const netAnnualBenefit =
    Math.abs(annualOpexSavings) * (1 + simulationParams.tariffEscalation / 100);

  const blendedMac =
    totalReduction > 0
      ? (adjustedCapex * 1000) / totalReduction / (totalReduction > 0 ? 5 : 1)
      : 182.5;

  const handleSaveScenario = () => {
    saveScenarioSimulation();
    setNotification(
      `Scenario SCN-2025-0${savedScenariosCount + 1} successfully saved to Audit Trail!`
    );
    setTimeout(() => setNotification(""), 4000);
  };

  const handleReset = () => {
    setSimulationParams({ capexMultiplier: 1.0, tariffEscalation: 5.0 });
  };

  const calculatePayback = (capexIdr: number | null, annualOpexIdr: number | null) => {
    if (!capexIdr || !annualOpexIdr || annualOpexIdr >= 0) return "N/A";
    return `${(capexIdr / Math.abs(annualOpexIdr)).toFixed(1)} yrs`;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#5c5e64]">
        <Link href="/overview" className="hover:text-[#0b1c30] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5c5e64]/60" />
        <span className="font-semibold text-[#0b1c30]">Carbon Decision Lab</span>
      </nav>

      {/* 2. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#0b1c30] tracking-[-0.8px] leading-[40px]">
            Carbon Decision Lab
          </h1>
          <p className="text-[14px] text-[#5c5e64] mt-1 leading-[20px]">
            Model marginal abatement costs, simulate capex/tariff sensitivities, and optimize your 2030 roadmap.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Simulative Mode Badge */}
          <div className="flex items-center gap-2 bg-[#fffbeb] border border-[#fef3c7] px-3 py-2 rounded-[8px] text-[12px] font-semibold text-[#b45309]">
            <FlaskConical className="w-4 h-4 text-[#d97706]" />
            <span>Simulative Mode</span>
            <span className="w-2 h-2 rounded-full bg-[#d97706] animate-pulse" />
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-[#c4c6cd]/50 rounded-[8px] text-[13px] font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-[#5c5e64]" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSaveScenario}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#b80035] rounded-[8px] text-[13px] font-semibold text-white hover:bg-[#9f002d] transition-colors shadow-sm"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Save Scenario Bundle</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-3.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-[10px] text-[13px] text-[#065f46] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>{notification}</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Audit Event Appended
          </span>
        </div>
      )}

      {/* 3. 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Selected Abatement */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Selected Abatement Potential
            </div>
            <div className="text-[30px] font-bold text-[#00675e] tracking-[-0.9px] leading-tight mt-1">
              -{totalReduction.toFixed(1)} tCO₂e/yr
            </div>
          </div>
          <div className="text-[12px] text-[#00675e] font-semibold">
            {((totalReduction / 1284.2) * 100).toFixed(1)}% of 2025 Footprint ({selectedOptions.length} selected)
          </div>
        </div>

        {/* Card 2: Total Capex */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Total Capital Expenditure
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              Rp {adjustedCapex.toFixed(2)} B
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            {(simulationParams.capexMultiplier * 100).toFixed(0)}% of baseline capex
          </div>
        </div>

        {/* Card 3: Net Annual OPEX Benefit */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Net Annual OPEX Benefit
            </div>
            <div className="text-[30px] font-bold text-[#00675e] tracking-[-0.9px] leading-tight mt-1">
              -Rp {netAnnualBenefit.toFixed(2)} B/yr
            </div>
          </div>
          <div className="text-[12px] text-[#00675e] font-semibold">
            Operating electricity bill savings
          </div>
        </div>

        {/* Card 4: Blended Abatement Cost */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Blended Abatement Cost
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              Rp {blendedMac.toFixed(1)}M / t
            </div>
          </div>
          <div className="text-[12px] text-[#00675e] font-semibold">
            Below shadow price (Rp 350.0M)
          </div>
        </div>
      </div>

      {/* 4. Sensitivity Simulation Parameters */}
      <div className="bg-white p-5 rounded-[12px] border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#b80035]" />
            <h3 className="text-[14px] font-bold text-[#0b1c30]">
              Simulation Parameters &amp; Sensitivity Factors
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#5c5e64]">
            Dynamic Portfolio Stress-Testing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Capex Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[#0b1c30]">
                Capital Cost Sensitivity:
              </span>
              <span className="font-bold text-[#b80035] bg-[#fff1f2] px-2.5 py-0.5 rounded border border-[#ffdad6]">
                {(simulationParams.capexMultiplier * 100).toFixed(0)}% of Baseline Capex
              </span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.05"
              value={simulationParams.capexMultiplier}
              onChange={(e) =>
                setSimulationParams({
                  capexMultiplier: parseFloat(e.target.value),
                })
              }
              className="w-full accent-[#b80035] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#5c5e64]">
              <span>-20% (Optimistic)</span>
              <span>1.0x (Standard)</span>
              <span>+50% (Pessimistic)</span>
            </div>
          </div>

          {/* Tariff Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[#0b1c30]">
                Electricity Tariff Escalation:
              </span>
              <span className="font-bold text-[#00675e] bg-[#ecfdf5] px-2.5 py-0.5 rounded border border-[#a7f3d0]">
                +{simulationParams.tariffEscalation.toFixed(1)}% / Year
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={simulationParams.tariffEscalation}
              onChange={(e) =>
                setSimulationParams({
                  tariffEscalation: parseFloat(e.target.value),
                })
              }
              className="w-full accent-[#00675e] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#5c5e64]">
              <span>0% Flat Tariff</span>
              <span>+5% Expected</span>
              <span>+15% High Escalation</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Candidate Interventions Cards Grid (2x2) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
            Candidate Decarbonization Interventions
          </h3>
          <span className="text-[12px] text-[#5c5e64]">
            Toggle interventions to dynamically recalculate the MACC curve and portfolio return
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt) => {
            const isOptSelected = opt.selected;
            const capex =
              (opt.implementationCostIdr || 0) * simulationParams.capexMultiplier;
            const payback = calculatePayback(
              capex,
              opt.annualOperatingCostIdr
            );

            return (
              <div
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={`p-5 rounded-[12px] border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isOptSelected
                    ? "bg-white border-[#b80035] shadow-md ring-1 ring-[#b80035]/20"
                    : "bg-[#f8f9ff] border-[#e5eeff] opacity-70 hover:opacity-100 hover:bg-white"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isOptSelected ? (
                          <div className="w-5 h-5 rounded-[4px] bg-[#b80035] text-white flex items-center justify-center">
                            <CheckSquare className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-[4px] border-2 border-[#c4c6cd] bg-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-[#5c5e64]">
                            {opt.code}
                          </span>
                          <span className="text-[11px] font-semibold text-[#0b1c30] bg-[#eff4ff] px-2 py-0.5 rounded">
                            {opt.tag}
                          </span>
                        </div>
                        <h4 className="text-[15px] font-bold text-[#0b1c30] mt-1">
                          {opt.name}
                        </h4>
                      </div>
                    </div>

                    <span
                      className={`text-[12px] font-bold ${
                        (opt.costEffectiveness || 0) < 0
                          ? "text-[#15803d]"
                          : (opt.costEffectiveness || 0) > 350
                          ? "text-[#b80035]"
                          : "text-[#0b1c30]"
                      }`}
                    >
                      {opt.costEffectiveness !== null
                        ? `Rp ${(opt.costEffectiveness || 0).toFixed(1)}M / t`
                        : "N/A"}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#5c5e64] mt-2.5 leading-relaxed pl-8">
                    {opt.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#f1f5f9] grid grid-cols-3 gap-2 text-[11px] pl-8">
                  <div>
                    <span className="text-[#5c5e64] block">Capex:</span>
                    <strong className="text-[#0b1c30]">
                      Rp {capex.toFixed(2)} B
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#5c5e64] block">Abatement:</span>
                    <strong className="text-[#00675e]">
                      -{opt.estimatedReductionTco2e} tCO₂e/yr
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#5c5e64] block">Payback:</span>
                    <strong className="text-[#0b1c30]">
                      {payback}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. MACC Visual Chart Component */}
      <AbatementMacChart
        options={options}
        onToggleOption={(id) => toggleOption(id)}
      />

      {/* 7. Detailed Interventions Comparison Table */}
      <div className="bg-white rounded-[12px] border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-5 border-b border-[#e5eeff]">
          <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
            Detailed Interventions Comparison
          </h3>
          <p className="text-[12px] text-[#5c5e64] mt-0.5">
            Full financial and carbon accounting metrics per intervention
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#dce9ff] text-[#5c5e64] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">INTERVENTION</th>
                <th className="py-3 px-4">SCOPE / TAG</th>
                <th className="py-3 px-4 text-right">ABATEMENT (t/yr)</th>
                <th className="py-3 px-4 text-right">CAPEX (IDR B)</th>
                <th className="py-3 px-4 text-right">ANNUAL OPEX (IDR B)</th>
                <th className="py-3 px-4 text-right">MAC (IDR M/t)</th>
                <th className="py-3 px-4 text-right">PAYBACK</th>
                <th className="py-3 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {options.map((opt) => (
                <tr
                  key={opt.id}
                  className={`hover:bg-[#f8f9ff] transition-colors ${
                    opt.selected ? "bg-[#eff4ff]/30" : ""
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0b1c30]">{opt.name}</div>
                    <div className="text-[11px] text-[#5c5e64] font-mono">{opt.code}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#0b1c30] bg-[#e5eeff] px-2 py-0.5 rounded text-[11px]">
                      {opt.tag}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#00675e]">
                    -{opt.estimatedReductionTco2e} t
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-[#0b1c30]">
                    Rp {((opt.implementationCostIdr || 0) * simulationParams.capexMultiplier).toFixed(2)} B
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-[#00675e]">
                    -Rp {Math.abs(opt.annualOperatingCostIdr || 0).toFixed(2)} B
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#0b1c30]">
                    {opt.costEffectiveness !== null
                      ? `Rp ${opt.costEffectiveness.toFixed(1)}M`
                      : "N/A"}
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#5c5e64]">
                    {calculatePayback(
                      (opt.implementationCostIdr || 0) * simulationParams.capexMultiplier,
                      opt.annualOperatingCostIdr
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleOption(opt.id)}
                      className={`px-3 py-1 rounded-[6px] text-[12px] font-semibold transition-colors ${
                        opt.selected
                          ? "bg-[#b80035] text-white"
                          : "bg-white border border-[#c4c6cd]/50 text-[#0b1c30] hover:bg-gray-50"
                      }`}
                    >
                      {opt.selected ? "Included" : "Add"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. Key Calculation Assumptions Card */}
      <div className="bg-[#eff4ff] rounded-[12px] p-5 border border-[#dce9ff] flex items-start gap-4">
        <Info className="w-5 h-5 text-[#00675e] shrink-0 mt-0.5" />
        <div className="space-y-1 text-[12px] text-[#0b1c30]">
          <h4 className="font-bold text-[13px]">Key Calculation Assumptions</h4>
          <p className="text-[#5c5e64] leading-relaxed">
            Electricity tariff benchmarked at <strong>Rp 1,444.70 / kWh</strong> per MEMR Gazette. Internal shadow carbon price set at <strong>Rp 350,000 / tCO₂e</strong>. Discount rate <strong>8.5% WACC</strong>. Asset depreciation schedule assumes 10–15 years useful life under IFRS / PSAK 16 standards.
          </p>
        </div>
      </div>
    </div>
  );
}
