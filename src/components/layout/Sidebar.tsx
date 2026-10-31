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
  User,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  spec?: boolean;
}

const SPEC_TOOLTIP = "Masih spesifikasi; belum dibangun pada prototipe ini";

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/overview", icon: LayoutGrid },
  { name: "Data Quality Center", href: "/data-quality", icon: BadgeCheck },
  { name: "Baseline Reconciliation", href: "/reconciliation", icon: ArrowLeftRight },
  { name: "Carbon Driver Analysis", href: "/carbon-analysis", icon: CloudSun, spec: true },
  { name: "Decision Lab", href: "/decision-lab", icon: FlaskConical, spec: true },
  { name: "Governance & Audit Trail", href: "/governance", icon: ShieldCheck, spec: true },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/overview" && (pathname === "/" || pathname === "/overview")) return true;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-black text-[#c4c6cd] flex flex-col justify-between h-screen sticky top-0 shrink-0 border-r border-[#1f2937] z-30 select-none">
      <div className="p-4 pt-6">
        <div className="px-2 mb-6">
          <Link href="/overview" className="inline-block relative">
            <div className="relative w-[156px] h-[68px]">
              <Image src="/tera-logo.png" alt="TERA" fill className="object-contain object-left" priority />
            </div>
          </Link>
        </div>

        <nav className="space-y-1.5" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) => {
            const active = isItemActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={item.spec ? SPEC_TOOLTIP : undefined}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  active
                    ? "bg-[#b80035] text-[#ffffff] shadow-sm font-semibold"
                    : item.spec
                    ? "text-[#8b8d94] hover:text-white hover:bg-white/5"
                    : "text-[#c4c6cd] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 leading-tight">{item.name}</span>
                {item.spec && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border border-white/20">
                    Spek
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[#1f2937]/80">
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.06] border border-white/5">
          <div className="w-8 h-8 rounded-full bg-[#5c5e64] text-white flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-medium text-white leading-tight">Pengguna demo</span>
            <span className="text-[11px] text-[#c4c6cd] leading-tight mt-0.5">
              Peran disimulasikan · tanpa login
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
