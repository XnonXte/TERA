"use client";

import React from "react";
import { useTeraStore } from "@/stores/useTeraStore";

export default function TopHeader() {
  const { activePeriod, setActivePeriod } = useTeraStore();

  return (
    <header className="sticky top-0 h-14 bg-[#f8f9ff]/90 backdrop-blur-md border-b border-[#e5eeff] px-6 flex items-center justify-between gap-4 z-20 shrink-0">
      <div className="flex items-center gap-2 bg-[#e5eeff] px-3 py-1.5 rounded-lg border border-[#dce9ff]">
        <label htmlFor="periode-aktif" className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
          Periode
        </label>
        <select
          id="periode-aktif"
          value={activePeriod}
          onChange={(e) => setActivePeriod(e.target.value)}
          className="bg-transparent text-[13px] font-semibold text-[#0b1c30] focus:outline-none cursor-pointer"
        >
          <option value="FY 2025">FY 2025</option>
          <option value="FY 2024">FY 2024</option>
          <option value="FY 2023">FY 2023</option>
        </select>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        <span className="px-2.5 py-1 rounded-full border border-[#ffdad6] bg-[#fff1f2] text-[11px] font-semibold text-[#b80035]">
          Data demo
        </span>
        <span className="px-2.5 py-1 rounded-full border border-[#fde68a] bg-[#fffbeb] text-[11px] font-semibold text-[#78350f]">
          Simulasi, bukan integrasi produksi
        </span>
      </div>
    </header>
  );
}
