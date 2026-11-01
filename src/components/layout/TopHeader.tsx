"use client";

import React from "react";
import { Search, Bell, User } from "lucide-react";
import { useTeraStore } from "@/stores/useTeraStore";

export default function TopHeader() {
  const { globalSearchQuery, setGlobalSearchQuery, records } = useTeraStore();

  const openIssuesCount = records.filter(
    (r) => (r.validationStatus === "error" || r.validationStatus === "warning") && !r.resolved
  ).length;

  return (
    <header className="sticky top-0 h-16 bg-[#f8f9ff]/90 backdrop-blur-md border-b border-[#e5eeff] px-6 flex items-center justify-between z-20 shrink-0">
      {/* Left: Global Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#5c5e64] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder="Search records, findings, or scenarios..."
            className="w-full h-10 pl-9 pr-4 text-[13px] bg-white border border-[#c4c6cd]/50 rounded-lg text-[#0b1c30] placeholder:text-[#5c5e64] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 focus:border-[#b80035] transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Right: Notification & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          onClick={() =>
            alert(
              `Alerts Summary:\n• ${openIssuesCount} unresolved Data Quality items\n• 1 baseline pending review (v2025.0-Draft)\n• Threshold variance > 5.0% triggered`
            )
          }
          className="relative p-2 text-[#5c5e64] hover:text-[#0b1c30] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#e5eeff]"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-[#5c5e64]" />
          {openIssuesCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#b80035] ring-2 ring-white" />
          )}
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#b80035] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            <User className="w-4 h-4" />
          </div>
          <span className="text-[13px] font-semibold text-[#0b1c30]">
            ESG Team
          </span>
        </div>
      </div>
    </header>
  );
}
