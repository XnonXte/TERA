"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  RotateCw,
  Download,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  FileCheck,
  Building,
} from "lucide-react";
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
  const [selectedFacility, setSelectedFacility] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Derived counts
  const totalCount = 1026; // Figma display count
  const criticalCount = records.filter(
    (r) => r.validationStatus === "error" && !r.resolved
  ).length;
  const warningCount = records.filter(
    (r) => r.validationStatus === "warning" && !r.resolved
  ).length;
  const resolvedCount = records.filter((r) => r.resolved).length;
  const healthRate = "85.0";

  // Filtered records
  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (activeFilterScope !== "All" && r.scope !== activeFilterScope)
        return false;
      if (
        activeFilterStatus === "Critical" &&
        (r.validationStatus !== "error" || r.resolved)
      )
        return false;
      if (
        activeFilterStatus === "Warning" &&
        (r.validationStatus !== "warning" || r.resolved)
      )
        return false;
      if (
        activeFilterStatus === "Valid" &&
        r.validationStatus !== "valid" &&
        !r.resolved
      )
        return false;
      if (activeFilterStatus === "Resolved" && !r.resolved) return false;

      if (
        activeFilterIssueType !== "All" &&
        r.issueType !== activeFilterIssueType
      )
        return false;

      if (selectedFacility !== "All") {
        if (!r.sourceRef?.toLowerCase().includes(selectedFacility.toLowerCase())) {
          return false;
        }
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchId = r.id.toLowerCase().includes(q);
        const matchMetric = r.metric.toLowerCase().includes(q);
        const matchSource = (r.sourceRef || "").toLowerCase().includes(q);
        const matchIssue = (r.issueTitle || "").toLowerCase().includes(q);
        if (!matchId && !matchMetric && !matchSource && !matchIssue)
          return false;
      }

      return true;
    });
  }, [
    records,
    activeFilterScope,
    activeFilterStatus,
    activeFilterIssueType,
    selectedFacility,
    search,
  ]);

  // Paginated records
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#5c5e64]">
        <Link href="/overview" className="hover:text-[#0b1c30] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5c5e64]/60" />
        <span className="font-semibold text-[#0b1c30]">Data Quality Center</span>
      </nav>

      {/* 2. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#0b1c30] tracking-[-0.8px] leading-[40px]">
            Data Quality Center
          </h1>
          <p className="text-[14px] text-[#5c5e64] mt-1 leading-[20px]">
            Validate, audit, and clean telemetry data before calculating your carbon baseline.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() =>
              alert("Data Quality Report (CSV/PDF) generated with 24 findings and 872 valid records.")
            }
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#c4c6cd]/50 rounded-[8px] text-[13px] font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-[#5c5e64]" />
            <span>Export Report</span>
          </button>

          <button
            type="button"
            onClick={runValidation}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#b80035] rounded-[8px] text-[13px] font-semibold text-white hover:bg-[#9f002d] transition-colors shadow-sm"
          >
            <RotateCw className="w-4 h-4" />
            <span>Run Validation (24)</span>
          </button>
        </div>
      </div>

      {/* 3. 4 Metric Cards with Bottom Accent Lines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Records */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px] relative overflow-hidden">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Total Telemetry Records
            </div>
            <div className="text-[32px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              {totalCount.toLocaleString()}
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            Across 4 business units
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0b1c30]" />
        </div>

        {/* Card 2: Quality Health Rate */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px] relative overflow-hidden">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Quality Health Rate
            </div>
            <div className="text-[32px] font-bold text-[#00675e] tracking-[-0.9px] leading-tight mt-1">
              {healthRate}%
            </div>
          </div>
          <div className="text-[12px] text-[#00675e] font-semibold flex items-center gap-1">
            <span>+2.4% vs last cycle</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00675e]" />
        </div>

        {/* Card 3: Critical Violations */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px] relative overflow-hidden">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Critical Violations
            </div>
            <div className="text-[32px] font-bold text-[#b80035] tracking-[-0.9px] leading-tight mt-1">
              {criticalCount}
            </div>
          </div>
          <div className="text-[12px] text-[#b80035] font-medium">
            Requires immediate action
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#b80035]" />
        </div>

        {/* Card 4: Warning Anomalies */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px] relative overflow-hidden">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Warning Anomalies
            </div>
            <div className="text-[32px] font-bold text-[#d97706] tracking-[-0.9px] leading-tight mt-1">
              {warningCount}
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            12 imputed, 4 variance
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d97706]" />
        </div>
      </div>

      {/* 4. Filter & Search Controls */}
      <div className="bg-white p-4 rounded-[12px] border border-[#e5eeff] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-[#5c5e64] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by facility, meter, or violation..."
            className="w-full h-10 pl-9 pr-4 text-[13px] bg-[#f8f9ff] border border-[#dce9ff] rounded-[8px] text-[#0b1c30] placeholder:text-[#5c5e64] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 focus:border-[#b80035] transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Scope Dropdown */}
          <div className="relative">
            <select
              value={activeFilterScope}
              onChange={(e) => {
                setFilterScope(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[12px] font-semibold pl-3 pr-8 py-2 rounded-[8px] focus:outline-none cursor-pointer"
            >
              <option value="All">All Scopes</option>
              <option value="Scope 1">Scope 1 (Direct)</option>
              <option value="Scope 2">Scope 2 (Indirect)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5c5e64] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Severity Dropdown */}
          <div className="relative">
            <select
              value={activeFilterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[12px] font-semibold pl-3 pr-8 py-2 rounded-[8px] focus:outline-none cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical (Error)</option>
              <option value="Warning">Warning</option>
              <option value="Valid">Valid</option>
              <option value="Resolved">Resolved</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5c5e64] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Facility Dropdown */}
          <div className="relative">
            <select
              value={selectedFacility}
              onChange={(e) => {
                setSelectedFacility(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[12px] font-semibold pl-3 pr-8 py-2 rounded-[8px] focus:outline-none cursor-pointer"
            >
              <option value="All">Facility: All</option>
              <option value="Jakarta">Jakarta Data Center</option>
              <option value="Surabaya">Surabaya Core Hub</option>
              <option value="Bandung">Bandung Facility</option>
              <option value="Tower">Tower Infrastructure</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5c5e64] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Rule Filter */}
          <div className="relative">
            <select
              value={activeFilterIssueType}
              onChange={(e) => {
                setFilterIssueType(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[12px] font-semibold pl-3 pr-8 py-2 rounded-[8px] focus:outline-none cursor-pointer"
            >
              <option value="All">All Violation Types</option>
              <option value="missing_data">DQ-01: Missing Data</option>
              <option value="unit_mismatch">DQ-02: Unit Mismatch</option>
              <option value="unusual_increase">DQ-06: High Spike</option>
              <option value="invalid_source">DQ-07: Invalid Source</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5c5e64] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset button */}
          {(activeFilterScope !== "All" ||
            activeFilterStatus !== "All" ||
            activeFilterIssueType !== "All" ||
            selectedFacility !== "All" ||
            search !== "") && (
            <button
              type="button"
              onClick={() => {
                setFilterScope("All");
                setFilterStatus("All");
                setFilterIssueType("All");
                setSelectedFacility("All");
                setSearch("");
                setCurrentPage(1);
              }}
              className="text-[12px] font-semibold text-[#b80035] hover:underline px-2 py-1"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* 5. Main Records Table */}
      <div className="bg-white rounded-[12px] border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#dce9ff] text-[#5c5e64] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">RECORD ID</th>
                <th className="py-3 px-4">FACILITY / ASSET</th>
                <th className="py-3 px-4">SCOPE</th>
                <th className="py-3 px-4">PERIOD</th>
                <th className="py-3 px-4">READING VALUE</th>
                <th className="py-3 px-4">SEVERITY</th>
                <th className="py-3 px-4">VIOLATION TYPE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#5c5e64]">
                    No telemetry records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((record) => {
                  const isError =
                    record.validationStatus === "error" && !record.resolved;
                  const isWarn =
                    record.validationStatus === "warning" && !record.resolved;
                  const isResolved = record.resolved;

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-[#f8f9ff] transition-colors cursor-pointer group"
                      onClick={() => openDrawer(record)}
                    >
                      {/* Record ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0b1c30]">
                        {record.id}
                      </td>

                      {/* Facility */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#0b1c30]">
                          {record.sourceRef || record.metric}
                        </div>
                        <div className="text-[11px] text-[#5c5e64]">
                          {record.metric}
                        </div>
                      </td>

                      {/* Scope */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#0b1c30] bg-[#e5eeff] px-2 py-0.5 rounded text-[11px]">
                          {record.scope}
                        </span>
                      </td>

                      {/* Period */}
                      <td className="py-3.5 px-4 text-[#5c5e64]">
                        {record.period}
                      </td>

                      {/* Reading Value */}
                      <td className="py-3.5 px-4">
                        <div
                          className={`font-bold ${
                            record.value === null
                              ? "text-[#b80035]"
                              : "text-[#0b1c30]"
                          }`}
                        >
                          {record.value === null
                            ? "(Missing)"
                            : record.value.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-[#5c5e64]">
                          {record.unit}
                        </div>
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isResolved
                              ? "bg-[#eff4ff] text-[#00675e] border border-[#dce9ff]"
                              : isError
                              ? "bg-[#ffdad6] text-[#b80035] border border-[#ffb4ab]"
                              : isWarn
                              ? "bg-[#fef3c7] text-[#d97706] border border-[#fde68a]"
                              : "bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]"
                          }`}
                        >
                          {isResolved
                            ? "Resolved"
                            : isError
                            ? "Critical"
                            : isWarn
                            ? "Warning"
                            : "Valid"}
                        </span>
                      </td>

                      {/* Violation Type */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-[12px] text-[#0b1c30] truncate font-medium">
                          {record.issueTitle || (isResolved ? "Resolved" : "Passes all tests")}
                        </div>
                        {record.ruleId && (
                          <div className="text-[11px] text-[#5c5e64] font-mono">
                            {record.ruleId}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="text-[12px] font-semibold text-[#0b1c30]">
                          {isResolved ? "Resolved" : isError ? "Open" : "Valid"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDrawer(record);
                          }}
                          className="px-3 py-1 rounded-[6px] text-[12px] font-semibold text-[#b80035] bg-[#fff1f2] border border-[#ffdad6] hover:bg-[#ffe4e6] transition-colors"
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

        {/* Table Pagination Footer */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#e5eeff] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#5c5e64]">
          <div>
            Showing <strong className="text-[#0b1c30]">{(currentPage - 1) * pageSize + 1}</strong>–
            <strong className="text-[#0b1c30]">
              {Math.min(currentPage * pageSize, filtered.length)}
            </strong>{" "}
            of <strong className="text-[#0b1c30]">{filtered.length}</strong> issues
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-[6px] border border-[#dce9ff] text-[#5c5e64] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-[6px] text-[12px] font-semibold transition-colors ${
                  currentPage === page
                    ? "bg-[#b80035] text-white"
                    : "text-[#5c5e64] hover:bg-white border border-transparent hover:border-[#dce9ff]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-[6px] border border-[#dce9ff] text-[#5c5e64] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. 3 Bottom Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Findings by Issue Type */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] space-y-3.5">
          <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
            Findings by Issue Type
          </h3>

          <div className="space-y-3 pt-1 text-[12px]">
            <div>
              <div className="flex items-center justify-between text-[#0b1c30] font-medium mb-1">
                <span>Missing Consumption Data</span>
                <span className="font-bold">8 (33%)</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#b80035] h-full" style={{ width: "33%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[#0b1c30] font-medium mb-1">
                <span>Factor Mismatch / Outdated</span>
                <span className="font-bold">6 (25%)</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#d97706] h-full" style={{ width: "25%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[#0b1c30] font-medium mb-1">
                <span>Unusual Spike (&gt;30% YoY)</span>
                <span className="font-bold">5 (21%)</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#f59e0b] h-full" style={{ width: "21%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[#0b1c30] font-medium mb-1">
                <span>Boundary Inconsistency</span>
                <span className="font-bold">3 (13%)</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#facc15] h-full" style={{ width: "13%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[#0b1c30] font-medium mb-1">
                <span>Duplicate Ingestion</span>
                <span className="font-bold">2 (8%)</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#94a3b8] h-full" style={{ width: "8%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Findings by Scope */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
              Findings by Scope
            </h3>

            {/* Scope Visual Breakdown */}
            <div className="my-5 flex items-center justify-center">
              <div className="relative w-36 h-36 rounded-full border-8 border-[#eff4ff] flex flex-col items-center justify-center shadow-inner">
                <div
                  className="absolute inset-0 rounded-full border-8 border-transparent border-t-[#b80035] border-r-[#b80035] border-b-[#b80035]"
                  style={{ transform: "rotate(45deg)" }}
                />
                <span className="text-[10px] font-bold text-[#5c5e64] uppercase tracking-wider">
                  TOTAL
                </span>
                <span className="text-[22px] font-bold text-[#0b1c30]">24</span>
                <span className="text-[10px] text-[#5c5e64]">Findings</span>
              </div>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between p-2 rounded-[8px] bg-[#eff4ff]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-[3px] bg-[#b80035]" />
                  <span className="font-medium text-[#0b1c30]">Scope 2 (Electricity)</span>
                </div>
                <span className="font-bold text-[#0b1c30]">18 (75%)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-[8px] bg-[#eff4ff]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-[3px] bg-[#ffb3b6]" />
                  <span className="font-medium text-[#0b1c30]">Scope 1 (Direct Fuel)</span>
                </div>
                <span className="font-bold text-[#0b1c30]">6 (25%)</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#5c5e64] pt-3 border-t border-[#f1f5f9]">
            75% of data quality risks stem from regional electricity utility telemetry.
          </div>
        </div>

        {/* Card 3: Recent Resolved Findings */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
                Recent Resolved Findings
              </h3>
              <FileCheck className="w-4 h-4 text-[#00675e]" />
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="p-2.5 rounded-[8px] bg-[#eff4ff]/60 border border-[#dce9ff]/60 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#0b1c30]">REC-2024-8841</span>
                  <span className="text-[10px] text-[#5c5e64]">2h ago</span>
                </div>
                <p className="text-[#0b1c30] font-medium mt-1">
                  Solar generation offset calibrated (+14.2 MWh)
                </p>
                <p className="text-[11px] text-[#5c5e64] mt-0.5">
                  Verified by M. Dewi • Ref: INV-2025-01
                </p>
              </div>

              {/* Item 2 */}
              <div className="p-2.5 rounded-[8px] bg-[#eff4ff]/60 border border-[#dce9ff]/60 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#0b1c30]">REC-2024-6019</span>
                  <span className="text-[10px] text-[#5c5e64]">5h ago</span>
                </div>
                <p className="text-[#0b1c30] font-medium mt-1">
                  Generator diesel invoice attached
                </p>
                <p className="text-[11px] text-[#5c5e64] mt-0.5">
                  Verified by A. Santoso • Ref: PO-GEN-899
                </p>
              </div>

              {/* Item 3 */}
              <div className="p-2.5 rounded-[8px] bg-[#eff4ff]/60 border border-[#dce9ff]/60 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#0b1c30]">REC-2024-4112</span>
                  <span className="text-[10px] text-[#5c5e64]">1d ago</span>
                </div>
                <p className="text-[#0b1c30] font-medium mt-1">
                  Grid factor updated to 0.761 kgCO₂e/kWh
                </p>
                <p className="text-[11px] text-[#5c5e64] mt-0.5">
                  Verified by System Automation (MEMR #189)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
            <span className="text-[#5c5e64]">Immutable log</span>
            <Link href="/governance" className="text-[#b80035] font-semibold hover:underline">
              View Audit Trail →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
