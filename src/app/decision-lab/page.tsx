"use client";

import React, { useState } from "react";
import {
  FlaskConical,
  Sliders,
  DollarSign,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  BookmarkCheck,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import AbatementMacChart from "@/components/charts/AbatementMacChart";
import StatusBadge from "@/components/ui/StatusBadge";
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

  const netAnnualBenefit = Math.abs(annualOpexSavings) * (1 + simulationParams.tariffEscalation / 100);
  const simplePayback =
    netAnnualBenefit > 0 ? (adjustedCapex / netAnnualBenefit).toFixed(1) : "N/A";

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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        badge="STRATEGIC PLANNING"
        title="Carbon Decision Lab"
        description="Interactive Marginal Abatement Cost Curve (MACC), Capex sensitivity simulation, and multi-intervention portfolio builder for TDC Summit Fest 2026."
        actions={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#c4c6cd]/50 rounded-lg text-[13px] font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4 text-[#5c5e64]" />
              <span>Reset Parameters</span>
            </button>
            <button
              type="button"
              onClick={handleSaveScenario}
              className="flex items-center gap-2 px-4 py-2 bg-[#b80035] rounded-lg text-[13px] font-semibold text-white hover:bg-[#9f002d] transition-colors shadow"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Save Scenario Bundle</span>
            </button>
          </div>
        }
      />

      {notification && (
        <div className="p-3.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl text-[13px] text-[#065f46] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>{notification}</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Audit Event Appended
          </span>
        </div>
      )}

      {/* Sensitivity Parameter Controls */}
      <div className="bg-white p-5 rounded-xl border border-[#e5eeff] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#b80035]" />
            <h3 className="text-[14px] font-bold text-[#0b1c30]">
              Simulation Parameters & Sensitivity Factors
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#5c5e64]">
            Dynamic Stress-Testing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Capex Sensitivity Multiplier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[#0b1c30]">
                Capital Cost Sensitivity:
              </span>
              <span className="font-bold text-[#b80035] bg-[#fff1f2] px-2 py-0.5 rounded border border-[#ffdad6]">
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
                setSimulationParams({ capexMultiplier: parseFloat(e.target.value) })
              }
              className="w-full accent-[#b80035] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#5c5e64]">
              <span>-20% (Optimistic)</span>
              <span>1.0x (Standard)</span>
              <span>+50% (Pessimistic)</span>
            </div>
          </div>

          {/* Electricity Tariff Escalation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[#0b1c30]">
                Electricity Tariff Escalation Rate:
              </span>
              <span className="font-bold text-[#00675e] bg-[#ecfdf5] px-2 py-0.5 rounded border border-[#a7f3d0]">
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
                setSimulationParams({ tariffEscalation: parseFloat(e.target.value) })
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

      {/* Dynamic Bundle Summary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Bundle Decarbonization"
          value={`-${totalReduction.toFixed(1)}`}
          unit="tCO₂e/yr"
          delta={{ value: `${((totalReduction / 1284.2) * 100).toFixed(1)}%`, isPositiveGood: true, label: "of footprint" }}
          subtitle={`${selectedOptions.length} of ${options.length} interventions selected`}
          icon={<TrendingDown className="w-4 h-4 text-[#00675e]" />}
        />
        <KpiCard
          label="Total Investment Capex"
          value={`Rp ${adjustedCapex.toFixed(2)}`}
          unit="Billion"
          badge={{ text: `${(simulationParams.capexMultiplier * 100).toFixed(0)}% Index`, variant: "default" }}
          subtitle={`Nominal base: Rp ${baseCapex.toFixed(2)} B`}
          icon={<DollarSign className="w-4 h-4 text-[#b80035]" />}
        />
        <KpiCard
          label="Net Annual OPEX Impact"
          value={`Rp ${annualOpexSavings.toFixed(2)}`}
          unit="B/yr"
          delta={{ value: "Savings", isPositiveGood: true }}
          subtitle="Utility bill electricity savings"
          icon={<Sparkles className="w-4 h-4 text-[#00675e]" />}
        />
        <KpiCard
          label="Simple Payback"
          value={simplePayback}
          unit="Years"
          badge={{ text: "Target < 5.0 yrs", variant: "green" }}
          subtitle="Factoring in tariff escalation"
          icon={<CheckCircle2 className="w-4 h-4 text-[#0b1c30]" />}
        />
      </div>

      {/* MACC Visualization */}
      <AbatementMacChart
        options={options}
        onToggleOption={(id) => toggleOption(id)}
      />

      {/* Candidate Interventions Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-[#0b1c30]">
            Candidate Decarbonization Interventions
          </h3>
          <span className="text-[12px] text-[#5c5e64]">
            Select or deselect interventions to dynamically recalculate portfolio performance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {options.map((opt) => {
            const isOptSelected = opt.selected;
            const capex = (opt.implementationCostIdr || 0) * simulationParams.capexMultiplier;

            return (
              <div
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isOptSelected
                    ? "bg-white border-[#b80035] shadow-md ring-1 ring-[#b80035]/20"
                    : "bg-[#f8f9ff] border-[#e5eeff] opacity-75 hover:opacity-100 hover:bg-white"
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isOptSelected}
                        onChange={() => {}} // handled by parent onClick
                        className="w-4 h-4 rounded text-[#b80035] accent-[#b80035] cursor-pointer"
                      />
                      <span className="text-[11px] font-bold bg-[#eff4ff] text-[#0b1c30] px-2 py-0.5 rounded border border-[#dce9ff]">
                        {opt.code}
                      </span>
                      <span className="text-[11px] font-semibold text-[#5c5e64]">
                        {opt.tag}
                      </span>
                    </div>

                    <StatusBadge
                      status={opt.evidenceStatus}
                      label={opt.evidenceStatus.toUpperCase()}
                      size="sm"
                    />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-[15px] font-bold text-[#0b1c30]">
                      {opt.name}
                    </h4>
                    <p className="text-[12px] text-[#5c5e64] mt-1 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#f1f5f9] text-[11px]">
                    <div className="bg-[#eff4ff] p-2 rounded">
                      <span className="text-[#5c5e64] block">Reduction:</span>
                      <span className="font-bold text-[#00675e] text-[13px]">
                        -{opt.estimatedReductionTco2e} tCO₂e
                      </span>
                    </div>
                    <div className="bg-[#eff4ff] p-2 rounded">
                      <span className="text-[#5c5e64] block">Capex:</span>
                      <span className="font-bold text-[#0b1c30] text-[13px]">
                        Rp {capex.toFixed(2)} B
                      </span>
                    </div>
                    <div className="bg-[#eff4ff] p-2 rounded">
                      <span className="text-[#5c5e64] block">OPEX Delta:</span>
                      <span className="font-bold text-[#0b1c30] text-[13px]">
                        {opt.annualOperatingCostIdr !== null
                          ? `${opt.annualOperatingCostIdr > 0 ? "+" : ""}Rp ${opt.annualOperatingCostIdr.toFixed(2)} B/yr`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="bg-[#eff4ff] p-2 rounded">
                      <span className="text-[#5c5e64] block">MACC Ratio:</span>
                      <span
                        className={`font-bold text-[13px] ${
                          opt.costEffectiveness === null
                            ? "text-[#b80035]"
                            : "text-[#0b1c30]"
                        }`}
                      >
                        {opt.costEffectiveness !== null
                          ? `Rp ${opt.costEffectiveness.toFixed(1)} M/t`
                          : "N/A (Omitted)"}
                      </span>
                    </div>
                  </div>

                  {/* Why Superior / Rationale */}
                  {opt.whySuperior && (
                    <div className="p-2.5 bg-[#f8f9ff] border border-[#e5eeff] rounded-lg text-[11.5px] text-[#0b1c30] flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#b80035] shrink-0 mt-0.5" />
                      <span>{opt.whySuperior}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] text-[#5c5e64]">
                  <span>Timeline: {opt.implementationMonths} months</span>
                  <span className="capitalize font-semibold text-[#0b1c30]">
                    Feasibility: {opt.feasibility}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
