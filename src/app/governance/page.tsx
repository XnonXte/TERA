"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Download,
  Lock,
  ChevronRight,
  CheckCircle2,
  Award,
  FileCheck,
  Clock,
  ChevronDown,
  Hash,
  ExternalLink,
} from "lucide-react";
import { AuditEvent } from "@/types/tera";

// Halaman spesifikasi: belum ada log aktivitas di prototipe ini.
const SPESIFIKASI = "Spesifikasi";
const D = "—";

export default function GovernancePage() {
  const auditEvents: AuditEvent[] = [];

  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("All");
  const [filterObject, setFilterObject] = useState("All");
  const [filterDate, setFilterDate] = useState("FY2025");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    return auditEvents.filter((ev) => {
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
  }, [auditEvents, filterAction, filterObject, search]);

  const copyToClipboard = (hash?: string) => {
    if (!hash) return;
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#5c5e64]">
        <Link href="/overview" className="hover:text-[#0b1c30] transition-colors">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5c5e64]/60" />
        <span className="font-semibold text-[#0b1c30]">Governance &amp; Jejak Perubahan</span>
      </nav>

      {/* 2. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#0b1c30] tracking-[-0.8px] leading-[40px]">
            Governance &amp; Jejak Perubahan
          </h1>
          <p className="text-[14px] text-[#5c5e64] mt-1 leading-[20px]">
            Mencatat aktivitas dan keputusan.
          </p>
        </div>

        {/* 3 Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            disabled
            title={SPESIFIKASI}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-[#c4c6cd]/50 rounded-[8px] text-[12px] font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-sm"
          >
            <Lock className="w-4 h-4 text-[#00675e]" />
            <span>Verifikasi</span>
          </button>

          <button
            type="button"
            disabled
            title={SPESIFIKASI}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-[#c4c6cd]/50 rounded-[8px] text-[12px] font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-sm"
          >
            <Award className="w-4 h-4 text-[#5c5e64]" />
            <span>Sertifikat</span>
          </button>

          <button
            type="button"
            disabled
            title={SPESIFIKASI}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#b80035] rounded-[8px] text-[13px] font-semibold text-white hover:bg-[#9f002d] transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor</span>
          </button>
        </div>
      </div>

      {/* 3. 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Events */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Total peristiwa
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              {D}
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            {SPESIFIKASI}
          </div>
        </div>

        {/* Card 2: Baseline Ratifications */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Menunggu review
            </div>
            <div className="text-[30px] font-bold text-[#00675e] tracking-[-0.9px] leading-tight mt-1">
              {D}
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64] truncate">
            {SPESIFIKASI}
          </div>
        </div>

        {/* Card 3: Decarbonization Simulations */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Perubahan disetujui
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              {D}
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            {SPESIFIKASI}
          </div>
        </div>

        {/* Card 4: Integrity Verification */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Riwayat persetujuan
            </div>
            <div className="text-[30px] font-bold text-[#00675e] tracking-[-0.9px] leading-tight mt-1">
              {D}
            </div>
          </div>
          <div className="text-[12px] text-[#00675e] font-semibold">
            {SPESIFIKASI}
          </div>
        </div>
      </div>

      {/* 4. Filter & Search Bar */}
      <div className="bg-white p-4 rounded-[12px] border border-[#e5eeff] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-[#5c5e64] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled
            title={SPESIFIKASI}
            placeholder="Cari…"
            className="w-full h-10 pl-9 pr-4 text-[13px] bg-[#f8f9ff] border border-[#dce9ff] rounded-[8px] text-[#0b1c30] placeholder:text-[#5c5e64] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 focus:border-[#b80035] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Action Filter */}
          <div className="relative">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              disabled
              title={SPESIFIKASI}
              className="appearance-none bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[12px] font-semibold pl-3 pr-8 py-2 rounded-[8px] focus:outline-none cursor-pointer"
            >
              <option value="All">Semua jenis peristiwa</option>
              <option value="approve">Setujui</option>
              <option value="reject">Tolak</option>
              <option value="update">Perbarui</option>
              <option value="simulate">Simulasi</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5c5e64] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Object Filter */}
          <div className="relative">
            <select
              value={filterObject}
              onChange={(e) => setFilterObject(e.target.value)}
              disabled
              title={SPESIFIKASI}
              className="appearance-none bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[12px] font-semibold pl-3 pr-8 py-2 rounded-[8px] focus:outline-none cursor-pointer"
            >
              <option value="All">Semua objek</option>
              <option value="baseline">Versi baseline</option>
              <option value="record">Pemeriksaan</option>
              <option value="scenario">Skenario</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5c5e64] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              disabled
              title={SPESIFIKASI}
              className="appearance-none bg-[#eff4ff] border border-[#dce9ff] text-[#0b1c30] text-[12px] font-semibold pl-3 pr-8 py-2 rounded-[8px] focus:outline-none cursor-pointer"
            >
              <option value="FY2025">Tanggal: {D}</option>
              <option value="Q1">{D}</option>
              <option value="Q2">{D}</option>
              <option value="Q3">{D}</option>
              <option value="Q4">{D}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5c5e64] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {(filterAction !== "All" || filterObject !== "All" || search !== "") && (
            <button
              type="button"
              onClick={() => {
                setFilterAction("All");
                setFilterObject("All");
                setSearch("");
              }}
              className="text-[12px] font-semibold text-[#b80035] hover:underline px-2 py-1"
            >
              Hapus filter
            </button>
          )}
        </div>
      </div>

      {/* 5. Main 2-Column Content: Audit Log Ledger + Approval Chain */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Audit Log Ledger Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-[12px] border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-5 border-b border-[#e5eeff] flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
                Tabel log aktivitas
              </h3>
              <p className="text-[12px] text-[#5c5e64] mt-0.5">
                {SPESIFIKASI}
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#5c5e64] bg-[#eff4ff] px-2.5 py-1 rounded-[6px]">
              {D} peristiwa
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#eff4ff] border-b border-[#dce9ff] text-[#5c5e64] text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">WAKTU</th>
                  <th className="py-3 px-4">PELAKU &amp; PERAN</th>
                  <th className="py-3 px-4">AKSI</th>
                  <th className="py-3 px-4">OBJEK / ALASAN</th>
                  <th className="py-3 px-4">REFERENSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#f8f9ff] transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-[#5c5e64] text-[12px] whitespace-nowrap">
                      {ev.timestamp}
                    </td>

                    {/* Actor */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#0b1c30] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {ev.actorInitials}
                        </div>
                        <div>
                          <div className="font-semibold text-[#0b1c30] text-[12px]">
                            {ev.actor}
                          </div>
                          <div className="text-[10px] text-[#5c5e64]">
                            {ev.actorRole}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          ev.action === "approve"
                            ? "bg-[#dcfce7] text-[#15803d]"
                            : ev.action === "reject"
                            ? "bg-[#ffdad6] text-[#b80035]"
                            : ev.action === "simulate"
                            ? "bg-[#eff4ff] text-[#00675e]"
                            : "bg-[#e5eeff] text-[#0b1c30]"
                        }`}
                      >
                        {ev.action}
                      </span>
                    </td>

                    {/* Object & Details */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-[#0b1c30] text-[12px] truncate">
                        {ev.objectTitle}
                      </div>
                      <div className="text-[11px] text-[#5c5e64] truncate mt-0.5">
                        {ev.reason}
                      </div>
                    </td>

                    {/* Hash */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(ev.hash)}
                        title="Salin referensi"
                        className="font-mono text-[11px] text-[#5c5e64] hover:text-[#b80035] bg-[#eff4ff] px-2 py-1 rounded border border-[#dce9ff] flex items-center gap-1.5 transition-colors"
                      >
                        <Hash className="w-3 h-3 text-[#5c5e64]" />
                        <span>{ev.hash ? `${ev.hash.slice(0, 10)}…` : D}</span>
                        {copiedHash === ev.hash && (
                          <span className="text-[9px] text-[#00675e] font-bold">Tersalin</span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Approval Sign-off Chain (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Sign-off Chain Container */}
          <div className="bg-white rounded-[12px] border border-[#e5eeff] p-5 shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
              <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
                Riwayat persetujuan
              </h3>
              <ShieldCheck className="w-4 h-4 text-[#00675e]" />
            </div>

            {/* Vertical Stepper Timeline */}
            <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#dce9ff]">
              {/* Step 1 */}
              <div className="flex items-start gap-3.5 relative">
                <div className="w-7 h-7 rounded-full bg-[#00675e] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-[#eff4ff]/60 p-3 rounded-[8px] border border-[#dce9ff]/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0b1c30]">
                      {SPESIFIKASI}
                    </span>
                    <span className="text-[10px] text-[#00675e] font-semibold">{D}</span>
                  </div>
                  <p className="text-[12px] text-[#0b1c30] mt-1 font-medium">{D}</p>
                  <p className="text-[10px] text-[#5c5e64] mt-0.5">{D}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3.5 relative">
                <div className="w-7 h-7 rounded-full bg-[#00675e] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-[#eff4ff]/60 p-3 rounded-[8px] border border-[#dce9ff]/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0b1c30]">
                      {D}
                    </span>
                    <span className="text-[10px] text-[#00675e] font-semibold">{D}</span>
                  </div>
                  <p className="text-[12px] text-[#0b1c30] mt-1 font-medium">{D}</p>
                  <p className="text-[10px] text-[#5c5e64] mt-0.5">{D}</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3.5 relative">
                <div className="w-7 h-7 rounded-full bg-[#00675e] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-[#eff4ff]/60 p-3 rounded-[8px] border border-[#dce9ff]/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0b1c30]">
                      {D}
                    </span>
                    <span className="text-[10px] text-[#00675e] font-semibold">{D}</span>
                  </div>
                  <p className="text-[12px] text-[#0b1c30] mt-1 font-medium">{D}</p>
                  <p className="text-[10px] text-[#5c5e64] mt-0.5">{D}</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3.5 relative">
                <div className="w-7 h-7 rounded-full bg-[#d97706] text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-[#fffbeb] p-3 rounded-[8px] border border-[#fef3c7]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#78350f]">
                      {D}
                    </span>
                    <span className="text-[10px] text-[#d97706] font-bold">{D}</span>
                  </div>
                  <p className="text-[12px] text-[#0b1c30] mt-1 font-medium">{D}</p>
                  <p className="text-[10px] text-[#5c5e64] mt-0.5">{D}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active ISO Certification Box */}
          <div className="bg-[#eff4ff] rounded-[12px] p-5 border border-[#dce9ff] space-y-2">
            <div className="flex items-center gap-2 text-[#0b1c30]">
              <Award className="w-4 h-4 text-[#00675e]" />
              <h4 className="text-[13px] font-bold">
                Ringkasan peran dan izin
              </h4>
            </div>
            <p className="text-[11px] text-[#5c5e64] leading-relaxed">
              {SPESIFIKASI}: <strong>{D}</strong> {D}
            </p>
            <div className="text-[10px] text-[#5c5e64] pt-2 border-t border-[#dce9ff] flex items-center justify-between">
              <span>{D}</span>
              <span className="text-[#00675e] font-semibold">{D}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
