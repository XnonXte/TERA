"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Lock,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCheck,
  Hash,
  ExternalLink,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTeraStore } from "@/stores/useTeraStore";

export default function GovernancePage() {
  const { auditEvents } = useTeraStore();

  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("All");
  const [filterObject, setFilterObject] = useState("All");

  const filteredEvents = auditEvents.filter((ev) => {
    if (filterAction !== "All" && ev.action !== filterAction) return false;
    if (filterObject !== "All" && ev.objectType !== filterObject) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchActor = ev.actor.toLowerCase().includes(q);
      const matchTitle = ev.objectTitle.toLowerCase().includes(q);
      const matchId = ev.objectId.toLowerCase().includes(q);
      const matchHash = (ev.hash || "").toLowerCase().includes(q);
      if (!matchActor && !matchTitle && !matchId && !matchHash) return false;
    }

    return true;
  });

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "approve":
        return "bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]";
      case "reject":
        return "bg-[#fff1f2] text-[#b80035] border-[#ffdad6]";
      case "simulate":
        return "bg-[#f5f3ff] text-[#7c3aed] border-[#ddd6fe]";
      default:
        return "bg-[#eff4ff] text-[#0b1c30] border-[#dce9ff]";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        badge="COMPLIANCE & GOVERNANCE"
        title="Governance & Audit Trail"
        description="Tamper-evident, immutable activity log tracking every data quality resolution, baseline approval, and decarbonization simulation under ISO 14064-1 compliance."
        actions={
          <button
            type="button"
            onClick={() =>
              alert("Formal ISO 14064-1 Audit Pack exported with SHA-256 verification docket (PDF).")
            }
            className="flex items-center gap-2 px-4 py-2 bg-[#0b1c30] rounded-lg text-[13px] font-semibold text-white hover:bg-[#1a2d45] transition-colors shadow"
          >
            <Download className="w-4 h-4" />
            <span>Export Formal Audit Pack</span>
          </button>
        }
      />

      {/* KPI Row (matching Frame 111:2393) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Audit Events"
          value="1,428"
          unit="Events"
          badge={{ text: "100% Cryptographic", variant: "green" }}
          subtitle="Real-time append-only ledger"
          icon={<History className="w-4 h-4 text-[#0b1c30]" />}
        />
        <KpiCard
          label="Baseline Ratifications"
          value="4"
          unit="Signed"
          subtitle="v2023.1, v2023.2, v2024.1, v2025.0-Draft"
          badge={{ text: "Formal ISO Stamp", variant: "default" }}
          icon={<ShieldCheck className="w-4 h-4 text-[#00675e]" />}
        />
        <KpiCard
          label="Decarbonization Simulations"
          value="12"
          unit="Scenarios"
          subtitle="Sensitivity stress tests recorded"
          icon={<FileCheck className="w-4 h-4 text-[#7c3aed]" />}
        />
        <KpiCard
          label="Integrity Verification"
          value="100%"
          unit="Intact"
          delta={{ value: "Valid", isPositiveGood: true, label: "Hash Chain" }}
          subtitle="Zero unauthorized restatements"
          icon={<Lock className="w-4 h-4 text-[#059669]" />}
        />
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#5c5e64] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Actor, Event, Hash or Object ID..."
            className="w-full h-9 pl-9 pr-3 text-[13px] bg-[#f8f9ff] border border-[#dce9ff] rounded-lg text-[#0b1c30] placeholder:text-[#5c5e64] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 focus:border-[#b80035]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Action Filter */}
          <div className="flex items-center gap-1.5 bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#dce9ff] text-[12px]">
            <span className="font-semibold text-[#5c5e64]">Action:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-transparent font-bold text-[#0b1c30] focus:outline-none cursor-pointer"
            >
              <option value="All">All Actions</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="update">Update</option>
              <option value="simulate">Simulate</option>
              <option value="review">Review</option>
            </select>
          </div>

          {/* Object Filter */}
          <div className="flex items-center gap-1.5 bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#dce9ff] text-[12px]">
            <span className="font-semibold text-[#5c5e64]">Object:</span>
            <select
              value={filterObject}
              onChange={(e) => setFilterObject(e.target.value)}
              className="bg-transparent font-bold text-[#0b1c30] focus:outline-none cursor-pointer"
            >
              <option value="All">All Objects</option>
              <option value="baseline">Baseline Version</option>
              <option value="record">Emission Record</option>
              <option value="scenario">Simulation Scenario</option>
            </select>
          </div>

          {(filterAction !== "All" || filterObject !== "All" || search !== "") && (
            <button
              type="button"
              onClick={() => {
                setFilterAction("All");
                setFilterObject("All");
                setSearch("");
              }}
              className="text-[12px] font-semibold text-[#b80035] hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Immutable Event Timeline & Ledger List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e5eeff] p-12 text-center text-[#5c5e64] shadow-sm">
            No audit trail events match the current filter criteria.
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm hover:border-[#b80035]/30 transition-all space-y-3"
            >
              {/* Event Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0b1c30] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {ev.actorInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-[#0b1c30]">
                        {ev.actor}
                      </span>
                      <span className="text-[11px] text-[#5c5e64]">
                        ({ev.actorRole})
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5c5e64]">
                      {ev.timestamp}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getActionBadgeColor(
                      ev.action
                    )}`}
                  >
                    {ev.action}
                  </span>
                  {ev.statusBadge && (
                    <span className="text-[11px] font-semibold bg-[#e5eeff] text-[#0b1c30] px-2.5 py-0.5 rounded-full">
                      {ev.statusBadge}
                    </span>
                  )}
                </div>
              </div>

              {/* Event Body */}
              <div className="space-y-1.5">
                <div className="text-[14px] font-semibold text-[#0b1c30]">
                  {ev.objectTitle}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px] bg-[#eff4ff] p-3 rounded-lg border border-[#dce9ff]">
                  <div>
                    <span className="text-[#5c5e64]">Previous State: </span>
                    <span className="font-semibold text-[#0b1c30]">
                      {ev.previousValue}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#5c5e64]">New State: </span>
                    <span className="font-bold text-[#b80035]">
                      {ev.newValue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Reason & Hash Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11.5px] text-[#5c5e64]">
                <div className="flex items-center gap-2 max-w-xl truncate">
                  <span className="font-bold text-[#0b1c30]">Justification:</span>
                  <span className="truncate">{ev.reason}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {ev.evidence && (
                    <span className="text-[#0b1c30] bg-[#f8f9ff] px-2 py-0.5 rounded border border-[#e5eeff] truncate max-w-xs">
                      {ev.evidence}
                    </span>
                  )}
                  <span className="flex items-center gap-1 font-mono text-[11px] text-[#5c5e64] bg-[#eff4ff] px-2 py-0.5 rounded">
                    <Hash className="w-3 h-3 text-[#5c5e64]" />
                    <span>{ev.hash}</span>
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
