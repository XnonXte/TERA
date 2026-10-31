"use client";

import React, { useState } from "react";
import {
  ArrowLeftRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  HelpCircle,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTeraStore } from "@/stores/useTeraStore";
import { calculateDifference, isVarianceThresholdExceeded } from "@/lib/calculations";

export default function ReconciliationPage() {
  const {
    baselines,
    activeBaselineId,
    setActiveBaselineId,
    compareBaselineId,
    setCompareBaselineId,
    scope2Methodology,
    setScope2Methodology,
    approveBaseline,
    rejectBaseline,
  } = useTeraStore();

  const [note, setNote] = useState("");
  const [selectedReason, setSelectedReason] = useState("Perubahan cakupan");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const baseA = baselines.find((b) => b.id === activeBaselineId) || baselines[0];
  const baseB = baselines.find((b) => b.id === compareBaselineId) || baselines[1];

  const diffTotal = calculateDifference(
    baseA.totalEmissionsTco2e,
    baseB.totalEmissionsTco2e
  );

  const diffScope1 = calculateDifference(baseA.scope1Tco2e, baseB.scope1Tco2e);
  const diffScope2 = calculateDifference(baseA.scope2Tco2e, baseB.scope2Tco2e);

  const isThresholdTriggered = isVarianceThresholdExceeded(diffTotal.percentage);

  const handleApprove = () => {
    if (!note || note.trim().length === 0) {
      setErrorMsg("Reviewer Note wajib diisi sebelum meratifikasi baseline baru (PRD Section 4.3).");
      return;
    }

    approveBaseline(baseB.id, `${selectedReason}: ${note}`);
    setSuccessMsg(`Baseline ${baseB.id} berhasil diratifikasi dan ditetapkan sebagai Locked Active Footprint.`);
    setNote("");
    setErrorMsg("");
  };

  const handleReject = () => {
    if (!note || note.trim().length === 0) {
      setErrorMsg("Reviewer Note wajib diisi untuk alasan penolakan baseline.");
      return;
    }

    rejectBaseline(baseB.id, `${selectedReason}: ${note}`);
    setSuccessMsg(`Pengajuan baseline ${baseB.id} ditolak dan dikembalikan untuk revisi.`);
    setNote("");
    setErrorMsg("");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        badge="GOVERNANCE & RECONCILIATION"
        title="Baseline Reconciliation Engine"
        description="Side-by-side comparison between Active Baseline and Proposed Baseline Revision, ISO 14064-1 variance quantification, and audit sign-off workflow."
        actions={
          <div className="flex items-center gap-3">
            {/* Scope 2 Methodology Switch */}
            <div className="flex items-center bg-[#e5eeff] p-1 rounded-lg border border-[#dce9ff]">
              <button
                type="button"
                onClick={() => setScope2Methodology("location")}
                className={`px-3 py-1.5 rounded-md text-[12px] font-bold transition-all ${
                  scope2Methodology === "location"
                    ? "bg-[#0b1c30] text-white shadow-sm"
                    : "text-[#5c5e64] hover:text-[#0b1c30]"
                }`}
              >
                Location-based
              </button>
              <button
                type="button"
                onClick={() => setScope2Methodology("market")}
                className={`px-3 py-1.5 rounded-md text-[12px] font-bold transition-all ${
                  scope2Methodology === "market"
                    ? "bg-[#0b1c30] text-white shadow-sm"
                    : "text-[#5c5e64] hover:text-[#0b1c30]"
                }`}
              >
                Market-based (REC)
              </button>
            </div>
          </div>
        }
      />

      {/* Baseline Version Selection Card */}
      <div className="bg-white p-5 rounded-xl border border-[#e5eeff] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {/* Baseline A */}
            <div className="bg-[#eff4ff] p-3.5 rounded-lg border border-[#dce9ff]">
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider mb-1">
                Baseline A (Reference Baseline)
              </div>
              <select
                value={activeBaselineId}
                onChange={(e) => setActiveBaselineId(e.target.value)}
                className="w-full bg-white border border-[#dce9ff] rounded px-3 py-1.5 text-[13px] font-bold text-[#0b1c30] focus:outline-none"
              >
                {baselines.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} ({b.totalEmissionsTco2e} tCO₂e) - {b.status.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-[#5c5e64] mt-1.5">
                {baseA.sourceRef || "Locked audited footprint"}
              </div>
            </div>

            {/* Baseline B */}
            <div className="bg-[#eff4ff] p-3.5 rounded-lg border border-[#dce9ff]">
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider mb-1">
                Baseline B (Proposed Target Revision)
              </div>
              <select
                value={compareBaselineId}
                onChange={(e) => setCompareBaselineId(e.target.value)}
                className="w-full bg-white border border-[#dce9ff] rounded px-3 py-1.5 text-[13px] font-bold text-[#0b1c30] focus:outline-none"
              >
                {baselines.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} ({b.totalEmissionsTco2e} tCO₂e) - {b.status.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-[#5c5e64] mt-1.5">
                {baseB.sourceRef || "Under reconciliation review"}
              </div>
            </div>
          </div>
        </div>

        {/* Threshold Variance Callout */}
        {isThresholdTriggered && (
          <div className="p-4 bg-[#fff1f2] border border-[#ffdad6] rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#b80035] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-[13px] font-bold text-[#93000a]">
                Board Governance Variance Threshold Triggered (&gt; 5.00%)
              </div>
              <div className="text-[12px] text-[#93000a]/90 leading-relaxed">
                Total variance between {baseA.id} and {baseB.id} is{" "}
                <span className="font-bold">+{diffTotal.absolute.toFixed(1)} tCO₂e (+{diffTotal.percentage?.toFixed(2)}%)</span>.
                Under PRD Section 4.3 and Telkomsel ESG By-Laws, any baseline variance exceeding 5.0% mandates formal justification, documentation of changes (boundary expansion / emission factor adjustments), and board sign-off before ratification.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Variance KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          label="Scope 1 Variance"
          value={`${diffScope1.absolute >= 0 ? "+" : ""}${diffScope1.absolute.toFixed(1)}`}
          unit="tCO₂e"
          delta={{
            value: `${diffScope1.percentage && diffScope1.percentage >= 0 ? "+" : ""}${diffScope1.percentage?.toFixed(1)}%`,
            isPositiveGood: false,
            label: "vs base",
          }}
          subtitle={`${baseA.scope1Tco2e} → ${baseB.scope1Tco2e} tCO₂e`}
        />
        <KpiCard
          label="Scope 2 Variance"
          value={`${diffScope2.absolute >= 0 ? "+" : ""}${diffScope2.absolute.toFixed(1)}`}
          unit="tCO₂e"
          delta={{
            value: `${diffScope2.percentage && diffScope2.percentage >= 0 ? "+" : ""}${diffScope2.percentage?.toFixed(1)}%`,
            isPositiveGood: false,
            label: "vs base",
          }}
          subtitle={`${baseA.scope2Tco2e} → ${baseB.scope2Tco2e} tCO₂e`}
        />
        <KpiCard
          label="Net Emissions Delta"
          value={`${diffTotal.absolute >= 0 ? "+" : ""}${diffTotal.absolute.toFixed(1)}`}
          unit="tCO₂e"
          delta={{
            value: `${diffTotal.percentage && diffTotal.percentage >= 0 ? "+" : ""}${diffTotal.percentage?.toFixed(2)}%`,
            isPositiveGood: false,
            label: "Total Net Change",
          }}
          subtitle="Mandatory Board Threshold > 5.0%"
        />
      </div>

      {/* Line Item Comparison Table */}
      <div className="bg-white rounded-xl border border-[#e5eeff] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e5eeff] flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-bold text-[#0b1c30]">
              Line-Item Reconciliation Ledger
            </h3>
            <p className="text-[12px] text-[#5c5e64]">
              Granular breakdown of emission factors, activity adjustments, and boundary changes
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#5c5e64] bg-[#eff4ff] px-2.5 py-1 rounded-full">
            {baseA.items.length} Tracked Line Items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#dce9ff] text-[#5c5e64] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Emission Source</th>
                <th className="py-3 px-4">Scope</th>
                <th className="py-3 px-4">{baseA.id} (Base)</th>
                <th className="py-3 px-4">{baseB.id} (Target)</th>
                <th className="py-3 px-4 text-right">Δ Absolute</th>
                <th className="py-3 px-4 text-right">% Variance</th>
                <th className="py-3 px-4">Reason Category</th>
                <th className="py-3 px-4">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {baseA.items.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8f9ff] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0b1c30]">{item.name}</div>
                    <div className="text-[11px] text-[#5c5e64]">{item.description}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#0b1c30] bg-[#e5eeff] px-2 py-0.5 rounded text-[11px]">
                      {item.scope}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#0b1c30]">
                      {item.vA_emissions} tCO₂e
                    </div>
                    <div className="text-[11px] text-[#5c5e64]">
                      {item.vA_activity} • {item.vA_ef}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#0b1c30]">
                      {item.vB_emissions} tCO₂e
                    </div>
                    <div className="text-[11px] text-[#5c5e64]">
                      {item.vB_activity} • {item.vB_ef}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`font-bold ${
                        item.diffEmissions > 0
                          ? "text-[#b80035]"
                          : item.diffEmissions < 0
                          ? "text-[#00675e]"
                          : "text-[#5c5e64]"
                      }`}
                    >
                      {item.diffEmissions > 0 ? "+" : ""}
                      {item.diffEmissions.toFixed(1)} t
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`font-bold text-[12px] px-2 py-0.5 rounded ${
                        item.diffPercent > 5
                          ? "bg-[#fff1f2] text-[#b80035]"
                          : item.diffPercent > 0
                          ? "bg-[#eff4ff] text-[#0b1c30]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.diffPercent > 0 ? "+" : ""}
                      {item.diffPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[12px] font-medium text-[#0b1c30] bg-[#eff4ff] px-2 py-1 rounded border border-[#dce9ff]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-[#5c5e64] max-w-xs truncate">
                    {item.evidence}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formal Ratification & Sign-off Box */}
      <div className="bg-white rounded-xl border border-[#e5eeff] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#b80035]" />
            <h3 className="text-[16px] font-bold text-[#0b1c30]">
              Formal Baseline Ratification & Board Sign-off
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#5c5e64]">
            Action permanently appends to immutable Audit Trail
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#fff1f2] border border-[#ffdad6] rounded-lg text-[13px] text-[#93000a] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#b80035]" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-lg text-[13px] text-[#065f46] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669]" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[12px] font-semibold text-[#0b1c30] block mb-1">
              Primary Reason Category *
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-lg p-2.5 text-[13px] text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20"
            >
              <option value="Perubahan cakupan">Perubahan cakupan (Boundary Expansion)</option>
              <option value="Perubahan faktor emisi & aktivitas">Perubahan faktor emisi & aktivitas</option>
              <option value="Koreksi data aktivitas">Koreksi data aktivitas (Telemetry revision)</option>
              <option value="Perubahan metodologi akuntansi">Perubahan metodologi akuntansi</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-[12px] font-semibold text-[#0b1c30] block mb-1">
              Executive Reviewer Note * (Required for Ratification)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="e.g., Board ratified addition of 42 BTS towers and updated MEMR 2024 grid factor."
              className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-lg p-2.5 text-[13px] text-[#0b1c30] placeholder:text-[#5c5e64] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleReject}
            className="px-5 py-2.5 rounded-lg bg-[#fff1f2] border border-[#ffdad6] text-[#b80035] hover:bg-[#ffe4e6] font-semibold text-[13px] transition-colors"
          >
            Reject Baseline Revision
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="px-6 py-2.5 rounded-lg bg-[#b80035] hover:bg-[#9f002d] text-white font-semibold text-[13px] shadow transition-colors"
          >
            Approve & Ratify Baseline ({baseB.id})
          </button>
        </div>
      </div>
    </div>
  );
}
