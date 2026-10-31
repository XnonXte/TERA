"use client";

import React from "react";
import Link from "next/link";
import {
  Flame,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Download,
  RotateCw,
  Sliders,
  History,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import EmissionsTrendChart from "@/components/charts/EmissionsTrendChart";
import EmissionsDonutChart from "@/components/charts/EmissionsDonutChart";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTeraStore } from "@/stores/useTeraStore";

export default function OverviewPage() {
  const { records, baselines, options, openDrawer, runValidation } = useTeraStore();

  const activeBaseline = baselines.find((b) => b.id === "v2024.1") || baselines[0];
  const draftBaseline = baselines.find((b) => b.id === "v2025.0-Draft");

  const openIssues = records.filter(
    (r) => (r.validationStatus === "error" || r.validationStatus === "warning") && !r.resolved
  );

  const selectedOptions = options.filter((o) => o.selected);
  const totalReductionPlanned = selectedOptions.reduce(
    (sum, o) => sum + (o.estimatedReductionTco2e || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        badge="EXECUTIVE DASHBOARD"
        title="TERA Decarbonization Overview"
        description="FY 2025 Scope 1 & 2 operational footprint summary, data quality integrity assurance, and baseline reconciliation tracking for Telkomsel."
        actions={
          <>
            <button
              type="button"
              onClick={runValidation}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c4c6cd]/50 rounded-lg text-[13px] font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-sm"
            >
              <RotateCw className="w-4 h-4 text-[#5c5e64]" />
              <span>Run Validation</span>
            </button>
            <button
              type="button"
              onClick={() => alert("Board Briefing Summary Pack exported successfully (PDF).")}
              className="flex items-center gap-2 px-4 py-2 bg-[#b80035] rounded-lg text-[13px] font-semibold text-white hover:bg-[#9f002d] transition-colors shadow"
            >
              <Download className="w-4 h-4" />
              <span>Export Briefing Pack</span>
            </button>
          </>
        }
      />

      {/* 4 Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total GHG Footprint"
          value="1,284.2"
          unit="tCO₂e"
          delta={{ value: "+12.0%", isPositiveGood: false, label: "vs v2024.1" }}
          subtitle="Scope 1 (20.6%) + Scope 2 (79.4%)"
          icon={<Flame className="w-4 h-4 text-[#b80035]" />}
        />
        <KpiCard
          label="Data Quality Health"
          value="97.7%"
          unit="Auditable"
          badge={{ text: `${openIssues.length} Open Findings`, variant: "amber" }}
          subtitle="Evaluated against DQ-01 to DQ-07"
          icon={<ShieldCheck className="w-4 h-4 text-[#00675e]" />}
        />
        <KpiCard
          label="Active Baseline"
          value={activeBaseline.id}
          badge={{ text: "Locked (12 Feb 2025)", variant: "green" }}
          subtitle="1 draft baseline pending review"
          icon={<History className="w-4 h-4 text-[#0b1c30]" />}
        />
        <KpiCard
          label="Decarbonization Pipeline"
          value={`-${totalReductionPlanned.toFixed(1)}`}
          unit="tCO₂e/yr"
          badge={{ text: `${selectedOptions.length} Interventions`, variant: "blue" }}
          subtitle="Capex: Rp 35.7 B / Payback: 3.4 yrs"
          icon={<Sliders className="w-4 h-4 text-[#b80035]" />}
        />
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EmissionsTrendChart />
        </div>
        <div className="lg:col-span-1">
          <EmissionsDonutChart />
        </div>
      </div>

      {/* Bottom Row: Open Findings & Governance Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Data Quality Findings */}
        <div className="bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-bold text-[#0b1c30]">
                Urgent Data Quality Findings
              </h3>
              <p className="text-[12px] text-[#5c5e64]">
                Records triggering pre-ingestion validation errors or variance warnings
              </p>
            </div>
            <Link
              href="/data-quality"
              className="text-[12px] font-semibold text-[#b80035] hover:underline flex items-center gap-1"
            >
              <span>View all ({records.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {openIssues.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => openDrawer(item)}
                className="py-3 flex items-start justify-between gap-4 cursor-pointer hover:bg-[#f8f9ff] px-2 rounded-lg transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-[#0b1c30]">
                      {item.id}
                    </span>
                    <span className="text-[11px] text-[#5c5e64]">{item.period}</span>
                    <StatusBadge
                      status={item.validationStatus}
                      size="sm"
                      label={item.validationStatus === "error" ? "Critical" : "Warning"}
                    />
                  </div>
                  <div className="text-[13px] font-medium text-[#0b1c30]">
                    {item.issueTitle || item.metric}
                  </div>
                  <div className="text-[11px] text-[#5c5e64]">
                    Source: {item.sourceRef} • Scope: {item.scope}
                  </div>
                </div>

                <button
                  type="button"
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#b80035] bg-[#fff1f2] rounded border border-[#ffdad6] hover:bg-[#ffe4e6] shrink-0"
                >
                  Investigate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Baseline Reconciliation Governance Status */}
        <div className="bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[14px] font-bold text-[#0b1c30]">
                Baseline Reconciliation Governance
              </h3>
              <StatusBadge status="pending_review" label="Review Pending" size="sm" />
            </div>
            <p className="text-[12px] text-[#5c5e64]">
              Status of proposed baseline version comparison vs locked 2024 footprint
            </p>

            <div className="mt-4 p-4 bg-[#eff4ff] rounded-xl border border-[#dce9ff] space-y-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#5c5e64]">Active Locked Baseline:</span>
                <span className="font-bold text-[#0b1c30]">
                  {activeBaseline.id} ({activeBaseline.totalEmissionsTco2e} tCO₂e)
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#5c5e64]">Proposed Revision:</span>
                <span className="font-bold text-[#b80035]">
                  {draftBaseline ? draftBaseline.id : "v2025.0-Draft"} (1,284.2 tCO₂e)
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#5c5e64]">Net Variance:</span>
                <span className="font-bold text-[#b80035]">
                  +138.2 tCO₂e (+12.06%)
                </span>
              </div>
              <div className="pt-2 border-t border-[#dce9ff] text-[11px] text-[#78350f] bg-[#fffbeb] p-2.5 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0" />
                <span>
                  Threshold Alert: Variance &gt; 5.0% triggers mandatory ESG Committee and Board review under PRD Section 4.3.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <Link
              href="/reconciliation"
              className="w-full text-center px-4 py-2.5 rounded-lg bg-[#0b1c30] text-white font-semibold text-[13px] hover:bg-[#1a2d45] transition-colors flex items-center justify-center gap-2"
            >
              <span>Open Reconciliation Engine</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
