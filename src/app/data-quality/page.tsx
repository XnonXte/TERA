"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  RotateCw,
  Upload,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Eye,
  XCircle,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTeraStore } from "@/stores/useTeraStore";

export default function DataQualityPage() {
  const {
    records,
    openDrawer,
    runValidation,
    activeFilterScope,
    setFilterScope,
    activeFilterStatus,
    setFilterStatus,
    activeFilterIssueType,
    setFilterIssueType,
  } = useTeraStore();

  const [search, setSearch] = useState("");

  // Derived counts
  const totalCount = records.length;
  const criticalCount = records.filter((r) => r.validationStatus === "error" && !r.resolved).length;
  const warningCount = records.filter((r) => r.validationStatus === "warning" && !r.resolved).length;
  const resolvedCount = records.filter((r) => r.resolved).length;
  const healthRate = (((totalCount - criticalCount - warningCount) / totalCount) * 100).toFixed(1);

  // Filtered records
  const filtered = records.filter((r) => {
    if (activeFilterScope !== "All" && r.scope !== activeFilterScope) return false;
    if (activeFilterStatus === "Critical" && (r.validationStatus !== "error" || r.resolved)) return false;
    if (activeFilterStatus === "Warning" && (r.validationStatus !== "warning" || r.resolved)) return false;
    if (activeFilterStatus === "Valid" && r.validationStatus !== "valid" && !r.resolved) return false;
    if (activeFilterStatus === "Resolved" && !r.resolved) return false;

    if (activeFilterIssueType !== "All" && r.issueType !== activeFilterIssueType) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = r.id.toLowerCase().includes(q);
      const matchMetric = r.metric.toLowerCase().includes(q);
      const matchSource = r.sourceRef.toLowerCase().includes(q);
      const matchIssue = (r.issueTitle || "").toLowerCase().includes(q);
      if (!matchId && !matchMetric && !matchSource && !matchIssue) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        badge="QUALITY ASSURANCE"
        title="Data Quality & Anomaly Center"
        description="Pre-ingestion validation rules (DQ-01 to DQ-07), automated anomaly detection, and finding resolution workbench for Telkomsel GHG telemetry."
        actions={
          <>
            <button
              type="button"
              onClick={runValidation}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c4c6cd]/50 rounded-lg text-[13px] font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-sm"
            >
              <RotateCw className="w-4 h-4 text-[#5c5e64]" />
              <span>Run Validation Engine</span>
            </button>
            <button
              type="button"
              onClick={() => alert("Telemetry ingestion pipeline active: 4 API streams connected.")}
              className="flex items-center gap-2 px-4 py-2 bg-[#0b1c30] rounded-lg text-[13px] font-semibold text-white hover:bg-[#1a2d45] transition-colors shadow"
            >
              <Upload className="w-4 h-4" />
              <span>Import Telemetry</span>
            </button>
          </>
        }
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Records"
          value={totalCount}
          unit="Records"
          subtitle="Jan–Dec 2025 activity logs"
          badge={{ text: "100% Coverage", variant: "green" }}
        />
        <KpiCard
          label="Critical Violations"
          value={criticalCount}
          unit="Errors"
          delta={{ value: "DQ-01 / DQ-02", isNeutral: true, label: "blocking" }}
          subtitle="Requires immediate remediation"
          icon={<AlertCircle className="w-4 h-4 text-[#b80035]" />}
        />
        <KpiCard
          label="Variance Warnings"
          value={warningCount}
          unit="Warnings"
          subtitle="Spikes & boundary additions (DQ-06)"
          icon={<AlertTriangle className="w-4 h-4 text-[#d97706]" />}
        />
        <KpiCard
          label="Quality Pass Rate"
          value={`${healthRate}%`}
          unit="Compliant"
          badge={{ text: `${resolvedCount} Resolved`, variant: "green" }}
          subtitle="Meets ISO 14064-1 audit standard"
          icon={<CheckCircle2 className="w-4 h-4 text-[#00675e]" />}
        />
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#5c5e64] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Record ID, Facility, Metric..."
            className="w-full h-9 pl-9 pr-3 text-[13px] bg-[#f8f9ff] border border-[#dce9ff] rounded-lg text-[#0b1c30] placeholder:text-[#5c5e64] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 focus:border-[#b80035]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Scope Filter */}
          <div className="flex items-center gap-1.5 bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#dce9ff] text-[12px]">
            <span className="font-semibold text-[#5c5e64]">Scope:</span>
            <select
              value={activeFilterScope}
              onChange={(e) => setFilterScope(e.target.value)}
              className="bg-transparent font-bold text-[#0b1c30] focus:outline-none cursor-pointer"
            >
              <option value="All">All Scopes</option>
              <option value="Scope 1">Scope 1</option>
              <option value="Scope 2">Scope 2</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#dce9ff] text-[12px]">
            <span className="font-semibold text-[#5c5e64]">Status:</span>
            <select
              value={activeFilterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent font-bold text-[#0b1c30] focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Critical">Critical (Error)</option>
              <option value="Warning">Warning</option>
              <option value="Valid">Valid</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Issue Type Filter */}
          <div className="flex items-center gap-1.5 bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#dce9ff] text-[12px]">
            <span className="font-semibold text-[#5c5e64]">Rule:</span>
            <select
              value={activeFilterIssueType}
              onChange={(e) => setFilterIssueType(e.target.value)}
              className="bg-transparent font-bold text-[#0b1c30] focus:outline-none cursor-pointer"
            >
              <option value="All">All Rules</option>
              <option value="missing_data">DQ-01: Missing Value</option>
              <option value="unit_mismatch">DQ-02: Unit Mismatch</option>
              <option value="unusual_increase">DQ-06: High Variance</option>
              <option value="invalid_source">DQ-07: Missing Source</option>
            </select>
          </div>

          {/* Reset button */}
          {(activeFilterScope !== "All" ||
            activeFilterStatus !== "All" ||
            activeFilterIssueType !== "All" ||
            search !== "") && (
            <button
              type="button"
              onClick={() => {
                setFilterScope("All");
                setFilterStatus("All");
                setFilterIssueType("All");
                setSearch("");
              }}
              className="text-[12px] font-semibold text-[#b80035] hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl border border-[#e5eeff] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#dce9ff] text-[#5c5e64] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Scope</th>
                <th className="py-3 px-4">Metric & Facility</th>
                <th className="py-3 px-4">Value / Unit</th>
                <th className="py-3 px-4">Validation Status</th>
                <th className="py-3 px-4">Issue Description / Rule</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#5c5e64]">
                    No emission records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((record) => {
                  const isError = record.validationStatus === "error" && !record.resolved;
                  const isWarn = record.validationStatus === "warning" && !record.resolved;

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-[#f8f9ff] transition-colors cursor-pointer group"
                      onClick={() => openDrawer(record)}
                    >
                      <td className="py-3 px-4 font-bold text-[#0b1c30]">
                        {record.id}
                      </td>
                      <td className="py-3 px-4 text-[#5c5e64]">
                        {record.period}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#0b1c30] bg-[#e5eeff] px-2 py-0.5 rounded text-[11px]">
                          {record.scope}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0b1c30]">
                          {record.metric}
                        </div>
                        <div className="text-[11px] text-[#5c5e64] truncate max-w-xs">
                          {record.sourceRef || "(no source ref)"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div
                          className={`font-bold ${
                            record.value === null
                              ? "text-[#b80035]"
                              : "text-[#0b1c30]"
                          }`}
                        >
                          {record.value === null
                            ? "(missing)"
                            : record.value.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-[#5c5e64]">
                          {record.unit}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          status={
                            record.resolved
                              ? "resolved"
                              : record.validationStatus
                          }
                          label={
                            record.resolved
                              ? "Resolved"
                              : isError
                              ? "Critical"
                              : isWarn
                              ? "Warning"
                              : "Valid"
                          }
                          size="sm"
                        />
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-[12px] text-[#0b1c30] truncate font-medium">
                          {record.issueTitle || (record.resolved ? "Resolved with verified note" : "Valid record")}
                        </div>
                        {record.ruleId && (
                          <div className="text-[11px] text-[#5c5e64] font-mono">
                            Rule: {record.ruleId}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDrawer(record);
                          }}
                          className="px-3 py-1 rounded text-[12px] font-semibold text-[#b80035] bg-[#fff1f2] border border-[#ffdad6] hover:bg-[#ffe4e6] transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer count */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#e5eeff] flex items-center justify-between text-[12px] text-[#5c5e64]">
          <div>
            Showing <span className="font-bold text-[#0b1c30]">{filtered.length}</span> of{" "}
            <span className="font-bold text-[#0b1c30]">{records.length}</span> records
          </div>
          <div>All records evaluated against Telkomsel GHG Data Quality Protocol</div>
        </div>
      </div>
    </div>
  );
}
