"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Flame,
  TrendingUp,
  LayoutGrid,
  ArrowLeftRight,
  ArrowRight,
  Clock,
  AlertTriangle,
  Target,
  FlaskConical,
} from "lucide-react";
import EmissionsTrendChart from "@/components/charts/EmissionsTrendChart";
import EmissionsDonutChart from "@/components/charts/EmissionsDonutChart";
import { useTeraStore } from "@/stores/useTeraStore";

export default function OverviewPage() {
  const { openDrawer, records } = useTeraStore();

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#0b1c30] tracking-[-0.8px] leading-[40px]">
            Good morning, ESG Team.
          </h1>
          <p className="text-[14px] text-[#5c5e64] mt-1 leading-[20px]">
            <span>Here&apos;s your ESG data overview for </span>
            <span className="font-semibold text-[#0b1c30]">2025</span>
            <span>. </span>
            <span className="text-[#5c5e64]/70">
              Reporting Period: FY2025 • Source: Automated Telemetry & Utility Invoices
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* GHG Protocol Compliant Badge */}
          <div className="flex items-center gap-2 bg-[#eff4ff] px-3.5 py-2 rounded-[8px] border border-[#dce9ff]">
            <ShieldCheck className="w-4 h-4 text-[#00675e]" />
            <div className="text-[11px] text-[#5c5e64] leading-tight font-medium">
              <p className="font-semibold text-[#0b1c30]">GHG Protocol</p>
              <p>Compliant</p>
            </div>
          </div>

          {/* View Reports Button */}
          <button
            type="button"
            onClick={() => alert("Report Export: ESG FY2025 Summary Pack (PDF) generated.")}
            className="flex items-center gap-2 bg-[#b80035] text-white text-[13px] font-medium px-4 py-2.5 rounded-[8px] hover:bg-[#9f002d] transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* 2. Key Performance Indicators (4 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Emissions */}
        <Link
          href="/carbon-analysis"
          className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] hover:border-[#b80035]/30 transition-all flex flex-col justify-between h-[180px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#b80035] flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Scope 1+2 Emissions
            </span>
          </div>

          <div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight">
              1,284
            </div>
          </div>

          <div className="text-[11px] text-[#5c5e64] tracking-[0.11px]">
            <span>Prior period: </span>
            <span className="font-bold text-[#0b1c30]">1,146</span>
            <span className="font-bold text-[#0b1c30]"> tCO₂e</span>
          </div>
        </Link>

        {/* Card 2: YoY Trajectory */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[180px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#b80035] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              YoY Trajectory
            </span>
          </div>

          <div>
            <div className="text-[30px] font-bold text-[#b80035] tracking-[-0.9px] leading-tight">
              +12.0%
            </div>
          </div>

          <div className="text-[11px] text-[#5c5e64] tracking-[0.11px] truncate">
            Driven by regional data center…
          </div>
        </div>

        {/* Card 3: Data Quality Findings */}
        <Link
          href="/data-quality"
          className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] hover:border-[#b80035]/30 transition-all flex flex-col justify-between h-[180px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#b80035] flex items-center justify-center shrink-0">
              <LayoutGrid className="w-4 h-4 text-white" />
            </div>
            <span className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Data Quality Findings
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight">
              24
            </span>
            <span className="text-[13px] font-medium text-[#5c5e64]">
              open items
            </span>
          </div>

          <div className="text-[11px] text-[#5c5e64] tracking-[0.11px]">
            Unresolved verification errors
          </div>
        </Link>

        {/* Card 4: Reconciliation Status */}
        <Link
          href="/reconciliation"
          className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] hover:border-[#b80035]/30 transition-all flex flex-col justify-between h-[180px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#b80035] flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-4 h-4 text-white" />
            </div>
            <span className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Reconciliation Status
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight">
              8
            </span>
            <span className="text-[13px] font-medium text-[#5c5e64]">
              pending changes
            </span>
          </div>

          <div className="text-[11px] text-[#5c5e64] tracking-[0.11px]">
            Locked 12 Feb 2025
          </div>
        </Link>
      </div>

      {/* 3. Section - Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <EmissionsTrendChart />
        </div>
        <div className="lg:col-span-4">
          <EmissionsDonutChart />
        </div>
      </div>

      {/* 4. Section - Operational Health (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card A: Data Quality Summary */}
        <Link
          href="/data-quality"
          className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2px_rgba(0,0,0,0.03)] hover:border-[#b80035]/30 transition-all flex flex-col justify-between h-[290px]"
        >
          <div>
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#b80035]" />
                <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
                  Data Quality Summary
                </h3>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#5c5e64]" />
            </div>

            <div className="flex items-center justify-between py-1 text-[13px]">
              <span className="text-[#5c5e64]">Total Telemetry Records</span>
              <span className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
                1,026
              </span>
            </div>

            {/* Segmented Quality Progress Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#dce9ff] mt-2 mb-3">
              <div className="bg-[#00675e] h-full" style={{ width: "85%" }} title="Valid: 85%" />
              <div className="bg-[#f59e0b] h-full" style={{ width: "11.5%" }} title="Warning: 11.5%" />
              <div className="bg-[#ba1a1a] h-full" style={{ width: "3.5%" }} title="Critical: 3.5%" />
            </div>

            {/* Detailed Row Status Indicators */}
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00675e]" />
                  <span className="text-[#5c5e64]">Valid &amp; Signed Off</span>
                </div>
                <span className="font-medium text-[#0b1c30]">872 records (85.0%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <span className="text-[#5c5e64]">Warning / Imputed Value</span>
                </div>
                <span className="font-medium text-[#0b1c30]">118 records (11.5%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
                  <span className="text-[#5c5e64]">Critical / Missing Factor</span>
                </div>
                <span className="font-bold text-[#ba1a1a]">36 records (3.5%)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
            <span className="text-[#5c5e64]">
              Confidence Score: <strong className="text-[#0b1c30]">94.2%</strong>
            </span>
            <span className="text-[#b80035] font-semibold flex items-center gap-1">
              Investigate →
            </span>
          </div>
        </Link>

        {/* Card B: Reconciliation Status */}
        <Link
          href="/reconciliation"
          className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2px_rgba(0,0,0,0.03)] hover:border-[#b80035]/30 transition-all flex flex-col justify-between h-[290px]"
        >
          <div>
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-[#b80035]" />
                <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
                  Reconciliation Status
                </h3>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#5c5e64]" />
            </div>

            <div className="space-y-2">
              <div className="bg-[#eff4ff] rounded-[8px] p-2.5 flex items-center justify-between text-[11px]">
                <span className="text-[#5c5e64]">Active Baseline</span>
                <span className="font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00675e]" />
                  v2024.1
                </span>
              </div>

              <div className="bg-[#eff4ff] rounded-[8px] p-2.5 flex items-center justify-between text-[11px]">
                <span className="text-[#5c5e64]">Pending Controller Review</span>
                <span className="font-bold text-[#b80035]">8 changes</span>
              </div>

              <div className="bg-[#eff4ff] rounded-[8px] p-2.5 flex items-center justify-between text-[11px]">
                <span className="text-[#5c5e64]">Resolved in 2025</span>
                <span className="font-bold text-[#0b1c30]">12 changes</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
            <span className="text-[#5c5e64]">
              Last audit lock: <strong className="text-[#0b1c30]">12 Feb 2025</strong>
            </span>
            <span className="text-[#b80035] font-semibold flex items-center gap-1">
              Adjust Baseline →
            </span>
          </div>
        </Link>

        {/* Card C: Priority Actions */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[290px]">
          <div>
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#b80035]" />
                <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
                  Priority Actions
                </h3>
              </div>
              <Link href="/data-quality" className="text-[11px] font-bold text-[#b80035] hover:underline">
                View all →
              </Link>
            </div>

            <div className="space-y-2 mt-2">
              {/* Action 1 */}
              <div
                onClick={() => {
                  const r = records.find((rec) => rec.id === "ELC-2025-001");
                  if (r) openDrawer(r);
                }}
                className="p-2 rounded-[8px] hover:bg-[#f8f9ff] cursor-pointer transition-colors flex items-center justify-between gap-2"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <AlertTriangle className="w-4 h-4 text-[#b80035] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-[#0b1c30] truncate leading-tight">
                      Review 3 critical data findings
                    </p>
                    <p className="text-[11px] text-[#5c5e64] leading-tight mt-0.5">
                      Data Quality Module
                    </p>
                  </div>
                </div>
                <span className="bg-[#ffdad6] text-[#b80035] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                  CRITICAL
                </span>
              </div>

              {/* Action 2 */}
              <Link
                href="/reconciliation"
                className="p-2 rounded-[8px] hover:bg-[#f8f9ff] transition-colors flex items-center justify-between gap-2"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <Target className="w-4 h-4 text-[#40000c] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-[#0b1c30] truncate leading-tight">
                      Validate 2025 electricity data
                    </p>
                    <p className="text-[11px] text-[#5c5e64] leading-tight mt-0.5">
                      Reconciliation Center
                    </p>
                  </div>
                </div>
                <span className="bg-[#ffdada] text-[#40000c] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                  HIGH
                </span>
              </Link>

              {/* Action 3 */}
              <Link
                href="/carbon-analysis"
                className="p-2 rounded-[8px] hover:bg-[#f8f9ff] transition-colors flex items-center justify-between gap-2"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <FlaskConical className="w-4 h-4 text-[#44474d] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-[#0b1c30] truncate leading-tight">
                      Assess impact of new emission factors
                    </p>
                    <p className="text-[11px] text-[#5c5e64] leading-tight mt-0.5">
                      Carbon Analysis
                    </p>
                  </div>
                </div>
                <span className="bg-[#dedfe7] text-[#44474d] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                  MEDIUM
                </span>
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
            <span className="text-[#5c5e64]">Required by Q1 filing cycle</span>
            <Link href="/data-quality" className="text-[#b80035] font-semibold hover:underline">
              Batch Resolve →
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Section - Recent Activity (Audit Trail) */}
      <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0b1c30]" />
            <h2 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
              Recent Activity
            </h2>
            <span className="bg-[#e5eeff] text-[#5c5e64] text-[11px] font-semibold px-2 py-0.5 rounded-[4px] tracking-[0.22px]">
              Immutable Audit Trail
            </span>
          </div>

          <Link
            href="/governance"
            className="flex items-center gap-1 text-[13px] font-semibold text-[#b80035] hover:underline"
          >
            <span>View all (Audit Trail)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Activity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Activity 1 */}
          <div className="bg-[#eff4ff]/50 rounded-[8px] p-3.5 border border-[#dce9ff]/60 shadow-[0px_2px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ffdada] text-[#40000c] flex items-center justify-center font-bold text-[11px] shrink-0">
                AS
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0b1c30] truncate">
                    A. Santoso
                  </span>
                  <span className="text-[10px] text-[#5c5e64]">2 hours ago</span>
                </div>
                <p className="text-[13px] font-medium text-[#0b1c30] mt-1 leading-tight">
                  Change submitted for review
                </p>
                <p className="text-[11px] text-[#5c5e64] mt-1 leading-tight">
                  Refrigerant (Scope 1 leak test 2025)
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#dce9ff]/50 flex items-center justify-between text-[11px]">
              <span className="text-[#5c5e64]/70">Ref: REV-2025-09</span>
              <Link href="/reconciliation" className="text-[#b80035] font-semibold hover:underline flex items-center gap-1">
                Inspect →
              </Link>
            </div>
          </div>

          {/* Activity 2 */}
          <div className="bg-[#eff4ff]/50 rounded-[8px] p-3.5 border border-[#dce9ff]/60 shadow-[0px_2px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#d3e4fe] text-[#0b1c30] flex items-center justify-center font-bold text-[11px] shrink-0">
                MD
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0b1c30] truncate">
                    M. Dewi
                  </span>
                  <span className="text-[10px] text-[#5c5e64]">5 hours ago</span>
                </div>
                <p className="text-[13px] font-medium text-[#0b1c30] mt-1 leading-tight">
                  Finding resolved
                </p>
                <p className="text-[11px] text-[#5c5e64] mt-1 leading-tight">
                  Electricity data (Jakarta Datacenter Jan 2025)
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#dce9ff]/50 flex items-center justify-between text-[11px]">
              <span className="text-[#5c5e64]/70">Ref: DQ-8841-FIX</span>
              <Link href="/governance" className="text-[#b80035] font-semibold hover:underline flex items-center gap-1">
                Inspect →
              </Link>
            </div>
          </div>

          {/* Activity 3 */}
          <div className="bg-[#eff4ff]/50 rounded-[8px] p-3.5 border border-[#dce9ff]/60 shadow-[0px_2px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#89f5e7] text-[#00201d] flex items-center justify-center font-bold text-[11px] shrink-0">
                RP
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0b1c30] truncate">
                    R. Pratama
                  </span>
                  <span className="text-[10px] text-[#5c5e64]">1 day ago</span>
                </div>
                <p className="text-[13px] font-medium text-[#0b1c30] mt-1 leading-tight">
                  Scenario saved
                </p>
                <p className="text-[11px] text-[#5c5e64] mt-1 leading-tight">
                  Site Solar Expansion Phase 2 (PPA simulation)
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#dce9ff]/50 flex items-center justify-between text-[11px]">
              <span className="text-[#5c5e64]/70">Ref: SCN-SOL-02</span>
              <Link href="/decision-lab" className="text-[#b80035] font-semibold hover:underline flex items-center gap-1">
                Inspect →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
