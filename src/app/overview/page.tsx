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

export default function OverviewPage() {

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        badge="EXECUTIVE DASHBOARD"
        title="TERA Decarbonization Overview"
        description="FY 2025 Scope 1 & 2 operational footprint summary, data quality integrity assurance, and baseline reconciliation tracking for Telkomsel."
        actions={
          <>
          </>
        }
      />

      {/* 4 Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          label="Total GHG Footprint"
          value="1,284.2"
          unit="tCO₂e"
          delta={{ value: "+12.0%", isPositiveGood: false, label: "vs v2024.1" }}
          subtitle="Scope 1 (20.6%) + Scope 2 (79.4%)"
          icon={<Flame className="w-4 h-4 text-[#b80035]" />}
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
    </div>
  );
}
