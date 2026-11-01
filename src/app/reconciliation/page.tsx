"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ChevronRight,
  FileSpreadsheet,
  Upload,
  ChevronDown,
} from "lucide-react";
import { useTeraStore } from "@/stores/useTeraStore";
import { calculateDifference, isVarianceThresholdExceeded } from "@/lib/calculations";

export default function ReconciliationPage() {
  const {
    baselines,
    activeBaselineId,
    setActiveBaselineId,
    compareBaselineId,
    setCompareBaselineId,
    approveBaseline,
    rejectBaseline,
  } = useTeraStore();

  const [note, setNote] = useState("");
  const [selectedReason, setSelectedReason] = useState("Boundary Expansion (Perubahan cakupan)");
  const [activeTab, setActiveTab] = useState("All");
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

  const filteredItems = useMemo(() => {
    if (activeTab === "All") return baseA.items;
    return baseA.items.filter((item) => {
      if (activeTab === "Boundary" && item.category.toLowerCase().includes("cakupan")) return true;
      if (activeTab === "Factors" && item.category.toLowerCase().includes("faktor")) return true;
      if (activeTab === "Activity" && item.category.toLowerCase().includes("aktivitas")) return true;
      return false;
    });
  }, [baseA.items, activeTab]);

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#5c5e64]">
        <Link href="/overview" className="hover:text-[#0b1c30] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5c5e64]/60" />
        <span className="font-semibold text-[#0b1c30]">Baseline Reconciliation</span>
      </nav>

      {/* 2. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#0b1c30] tracking-[-0.8px] leading-[40px]">
            Baseline Reconciliation
          </h1>
          <p className="text-[14px] text-[#5c5e64] mt-1 leading-[20px]">
            Compare proposed recalculations against your locked base year under ISO 14064-1 &amp; GHG Protocol.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#eff4ff] px-4 py-2.5 rounded-[8px] border border-[#dce9ff] shrink-0">
          <Lock className="w-4 h-4 text-[#00675e]" />
          <div className="text-[12px] font-medium text-[#5c5e64]">
            <span>Active Baseline: </span>
            <strong className="text-[#0b1c30]">{baseA.id} (Locked)</strong>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#00675e] ml-1" />
        </div>
      </div>

      {/* 3. Version Comparison Card (Side by Side) */}
      <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Baseline A Container (5 cols) */}
          <div className="md:col-span-5 bg-[#eff4ff] rounded-[10px] p-4 border border-[#dce9ff]">
            <div className="text-[11px] font-bold text-[#5c5e64] uppercase tracking-wider mb-2">
              Version A (Active Reference)
            </div>
            <div className="relative">
              <select
                value={activeBaselineId}
                onChange={(e) => setActiveBaselineId(e.target.value)}
                className="w-full appearance-none bg-white border border-[#c4c6cd]/50 rounded-[8px] px-3.5 py-2.5 text-[13px] font-bold text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 cursor-pointer"
              >
                {baselines.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} — {b.totalEmissionsTco2e} tCO₂e ({b.status.toUpperCase()})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#5c5e64] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#5c5e64] mt-2">
              Audited base year (ISO 14064-1 certified) • Locked 12 Feb 2024
            </p>
          </div>

          {/* VS Divider (1 col) */}
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-[#0b1c30] text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>

          {/* Baseline B Container (5 cols) */}
          <div className="md:col-span-5 bg-[#eff4ff] rounded-[10px] p-4 border border-[#dce9ff]">
            <div className="text-[11px] font-bold text-[#5c5e64] uppercase tracking-wider mb-2">
              Version B (Proposed Target Revision)
            </div>
            <div className="relative">
              <select
                value={compareBaselineId}
                onChange={(e) => setCompareBaselineId(e.target.value)}
                className="w-full appearance-none bg-white border border-[#c4c6cd]/50 rounded-[8px] px-3.5 py-2.5 text-[13px] font-bold text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 cursor-pointer"
              >
                {baselines.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} — {b.totalEmissionsTco2e} tCO₂e ({b.status.toUpperCase()})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#5c5e64] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#5c5e64] mt-2">
              Includes 42 new BTS towers &amp; updated MEMR grid factor • Pending Sign-off
            </p>
          </div>
        </div>

        {/* Material Variance Threshold Warning Banner */}
        {isThresholdTriggered && (
          <div className="p-4 bg-[#ffdad6]/40 border border-[#ffdad6] rounded-[10px] flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#b80035] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-[13px] font-bold text-[#b80035]">
                Material Variance Threshold Triggered (+{diffTotal.percentage?.toFixed(2)}% &gt; 5.00%)
              </div>
              <p className="text-[12px] text-[#40000c] leading-relaxed">
                Total variance between <strong>{baseA.id}</strong> and <strong>{baseB.id}</strong> is{" "}
                <span className="font-bold">+{diffTotal.absolute.toFixed(1)} tCO₂e (+{diffTotal.percentage?.toFixed(2)}%)</span>.
                Under ISO 14064-1 clause 5.4.2 and Telkomsel ESG Policy, any recalculation exceeding 5.0% requires formal board review, justification documentation, and sign-off before ratification.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Scope 1 Variance */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Scope 1 Variance
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              {diffScope1.absolute >= 0 ? "+" : ""}
              {diffScope1.absolute.toFixed(1)} tCO₂e
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            <span className="font-bold text-[#b80035]">
              {diffScope1.percentage && diffScope1.percentage >= 0 ? "+" : ""}
              {diffScope1.percentage?.toFixed(1)}%
            </span>{" "}
            vs base ({baseA.scope1Tco2e} → {baseB.scope1Tco2e} tCO₂e)
          </div>
        </div>

        {/* Card 2: Scope 2 Variance */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Scope 2 Variance
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              {diffScope2.absolute >= 0 ? "+" : ""}
              {diffScope2.absolute.toFixed(1)} tCO₂e
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            <span className="font-bold text-[#b80035]">
              {diffScope2.percentage && diffScope2.percentage >= 0 ? "+" : ""}
              {diffScope2.percentage?.toFixed(1)}%
            </span>{" "}
            vs base ({baseA.scope2Tco2e} → {baseB.scope2Tco2e} tCO₂e)
          </div>
        </div>

        {/* Card 3: Net Recalculation Delta */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Net Recalculation Delta
            </div>
            <div className="text-[30px] font-bold text-[#b80035] tracking-[-0.9px] leading-tight mt-1">
              +{diffTotal.absolute.toFixed(1)} tCO₂e
            </div>
          </div>
          <div className="text-[12px] text-[#b80035] font-semibold">
            +{diffTotal.percentage?.toFixed(2)}% Total Net Variance
          </div>
        </div>

        {/* Card 4: Audit Requirement */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Audit Requirement
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              Board Approval
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            Mandatory (&gt;5.0% threshold)
          </div>
        </div>
      </div>

      {/* 5. Material Variances & Reconciled Rows Table */}
      <div className="bg-white rounded-[12px] border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Table Header with Tabs */}
        <div className="p-5 border-b border-[#e5eeff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
              Material Variances &amp; Reconciled Rows
            </h3>
            <p className="text-[12px] text-[#5c5e64] mt-0.5">
              Classified by GHG Protocol recalculation policy categories
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#eff4ff] p-1 rounded-[8px] border border-[#dce9ff] text-[12px]">
            <button
              type="button"
              onClick={() => setActiveTab("All")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                activeTab === "All"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              All ({baseA.items.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Boundary")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                activeTab === "Boundary"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Boundary Expansion
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Factors")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                activeTab === "Factors"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Emission Factors
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Activity")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                activeTab === "Activity"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Activity Correction
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#dce9ff] text-[#5c5e64] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">EMISSION SOURCE</th>
                <th className="py-3 px-4">SCOPE</th>
                <th className="py-3 px-4">{baseA.id} (BASE)</th>
                <th className="py-3 px-4">{baseB.id} (TARGET)</th>
                <th className="py-3 px-4 text-right">Δ ABSOLUTE</th>
                <th className="py-3 px-4 text-right">% VARIANCE</th>
                <th className="py-3 px-4">JUSTIFICATION CATEGORY</th>
                <th className="py-3 px-4">EVIDENCE / REF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredItems.map((item) => (
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
                      className={`font-bold text-[11px] px-2 py-0.5 rounded-full ${
                        item.diffPercent > 5
                          ? "bg-[#ffdad6] text-[#b80035]"
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
                    <span className="text-[11px] font-semibold text-[#0b1c30] bg-[#eff4ff] px-2.5 py-1 rounded-[6px] border border-[#dce9ff]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-[#5c5e64] font-mono">
                    {item.evidence}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Reviewer Sign-off Form */}
      <div className="bg-white rounded-[12px] border border-[#e5eeff] p-6 shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#b80035]" />
            <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
              Reviewer Sign-off &amp; Formal Ratification
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#5c5e64]">
            Action permanently appends to immutable Audit Trail
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#fff1f2] border border-[#ffdad6] rounded-[8px] text-[13px] text-[#93000a] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#b80035]" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-[8px] text-[13px] text-[#065f46] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669]" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-bold text-[#0b1c30] block mb-1.5">
              Primary Justification Category *
            </label>
            <div className="relative">
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full appearance-none bg-[#eff4ff] border border-[#dce9ff] rounded-[8px] p-2.5 text-[13px] font-medium text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 cursor-pointer"
              >
                <option value="Boundary Expansion (Perubahan cakupan)">
                  Boundary Expansion (Perubahan cakupan 42 BTS Towers)
                </option>
                <option value="Emission Factor Adjustment (MEMR #189)">
                  Emission Factor Adjustment (MEMR #189 Gazette)
                </option>
                <option value="Activity Data Correction (Telemetry Ingestion)">
                  Activity Data Correction (Telemetry Ingestion)
                </option>
                <option value="Accounting Methodology Refinement">
                  Accounting Methodology Refinement
                </option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#5c5e64] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-bold text-[#0b1c30] block mb-1.5">
              Supporting Audit Evidence
            </label>
            <div className="flex items-center gap-3 p-2 bg-[#eff4ff] border border-[#dce9ff] rounded-[8px]">
              <FileSpreadsheet className="w-5 h-5 text-[#00675e] shrink-0 ml-1" />
              <div className="flex-1 min-w-0 text-[12px]">
                <p className="font-semibold text-[#0b1c30] truncate">
                  Baseline_Recalculation_Evidence_v2025.xlsx
                </p>
                <p className="text-[11px] text-[#5c5e64]">2.4 MB • SHA-256 Verified</p>
              </div>
              <button
                type="button"
                onClick={() => alert("File attachment verified and archived into audit repository.")}
                className="px-2.5 py-1 text-[11px] font-semibold text-[#0b1c30] bg-white rounded border border-[#c4c6cd]/40 hover:bg-gray-50"
              >
                Replace
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-[12px] font-bold text-[#0b1c30] block mb-1.5">
            Executive Reviewer Notes * (Mandatory for Ratification)
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
            placeholder="e.g., Board ratified addition of 42 BTS towers and updated MEMR 2024 grid factor. Net recalculation is audited per ISO 14064-1."
            className="w-full bg-[#eff4ff] border border-[#dce9ff] rounded-[8px] p-3 text-[13px] text-[#0b1c30] placeholder:text-[#5c5e64] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 resize-none"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#f1f5f9]">
          <button
            type="button"
            onClick={handleReject}
            className="px-5 py-2.5 rounded-[8px] bg-[#fff1f2] border border-[#ffdad6] text-[#b80035] hover:bg-[#ffe4e6] font-semibold text-[13px] transition-colors"
          >
            Reject Baseline Revision
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="px-6 py-2.5 rounded-[8px] bg-[#b80035] hover:bg-[#9f002d] text-white font-semibold text-[13px] shadow transition-colors"
          >
            Ratify Baseline {baseB.id}
          </button>
        </div>
      </div>
    </div>
  );
}
