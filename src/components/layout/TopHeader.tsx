"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User } from "lucide-react";
import { useTeraStore } from "@/stores/useTeraStore";

export default function TopHeader() {
  const { activePeriod, setActivePeriod } = useTeraStore();
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Enter membuka Data Quality Center dengan kata kunci sebagai filter pencarian tabel.
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/data-quality?q=${encodeURIComponent(q)}` : "/data-quality");
  };

  return (
    <header className="sticky top-0 h-16 bg-[#f8f9ff]/90 backdrop-blur-md border-b border-[#e5eeff] px-6 flex items-center justify-between z-20 shrink-0">
      {/* Left: Global Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <form role="search" onSubmit={submitSearch} className="relative w-full">
          <Search className="w-4 h-4 text-[#5c5e64] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Cari pemeriksaan di Data Quality Center"
            placeholder="Cari pemeriksaan… (tekan Enter)"
            className="w-full h-9 pl-9 pr-4 text-[13px] bg-white border border-[#c4c6cd]/50 rounded-lg text-[#0b1c30] placeholder:text-[#5c5e64] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 focus:border-[#b80035] transition-all shadow-sm"
          />
        </form>
      </div>

      {/* Right: Period selector, Demo Tags & Profile */}
      <div className="flex items-center gap-4">
        {/* Active Period Dropdown */}
        <div className="flex items-center gap-2 bg-[#e5eeff] px-3 py-1.5 rounded-lg border border-[#dce9ff]">
          <label htmlFor="periode-aktif" className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
            Periode:
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

        {/* Demo Indicator Pills */}
        <div className="flex items-center gap-1.5 bg-[#fff1f2] border border-[#ffdad6] px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b80035] animate-pulse" />
          <span className="text-[11px] font-bold text-[#b80035] uppercase tracking-wider">Data demo</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#fff1f2] border border-[#ffdad6] px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#b80035] animate-pulse" />
          <span className="text-[11px] font-bold text-[#b80035] uppercase tracking-wider">
            Simulasi, bukan integrasi produksi
          </span>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#e5eeff]">
          <div className="w-7 h-7 rounded-full bg-[#b80035] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-[13px] font-semibold text-[#0b1c30] hidden md:inline-block">Pengguna demo</span>
        </div>
      </div>
    </header>
  );
}
