"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutGrid,
  BadgeCheck,
  ArrowLeftRight,
  CloudSun,
  FlaskConical,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Overview", href: "/overview", icon: LayoutGrid },
  { name: "Data Quality", href: "/data-quality", icon: BadgeCheck },
  { name: "Reconciliation", href: "/reconciliation", icon: ArrowLeftRight },
  { name: "Carbon Analysis", href: "/carbon-analysis", icon: CloudSun },
  { name: "Decision Lab", href: "/decision-lab", icon: FlaskConical },
  { name: "Audit Trail", href: "/governance", icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/overview" && (pathname === "/" || pathname === "/overview")) {
      return true;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-black text-[#c4c6cd] flex flex-col justify-between h-screen sticky top-0 shrink-0 border-r border-[#1f2937] z-30 select-none">
      {/* Top Section: Brand & Nav */}
      <div className="p-4 pt-6">
        {/* TERA Logo */}
        <div className="px-2 mb-6">
          <Link href="/overview" className="inline-block relative">
            <div className="relative w-[156px] h-[68px]">
              <Image
                src="/tera-logo.png"
                alt="TERA Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const active = isItemActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  active
                    ? "bg-[#b80035] text-[#ffffff] shadow-sm font-semibold"
                    : "text-[#c4c6cd] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    active ? "text-white" : "text-[#c4c6cd]"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Help & User Profile */}
      <div className="p-4 border-t border-[#1f2937]/80 space-y-3">
        <button
          type="button"
          onClick={() =>
            alert(
              "TERA ESG Documentation:\n• ISO 14064-1 Organizational Footprint Reconciliation\n• Telkomsel Scope 1 & 2 Methodology Gazette MEMR #189\n• Science Based Targets initiative (SBTi) 2030 Pathway"
            )
          }
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-[#c4c6cd] hover:text-white hover:bg-white/5 transition-colors"
        >
          <HelpCircle className="w-4 h-4 shrink-0 text-[#c4c6cd]" />
          <span>Help & Documentation</span>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.06] border border-white/5">
          <div className="w-8 h-8 rounded-full bg-[#b80035] text-[#fffaf9] flex items-center justify-center font-bold text-xs shrink-0 shadow">
            ET
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-medium text-white truncate leading-tight">
              ESG Team
            </span>
            <span className="text-[11px] text-[#c4c6cd] truncate leading-tight mt-0.5">
              Telkomsel (Demo)
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
