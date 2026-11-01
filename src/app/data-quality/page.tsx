"use client";

import React, { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
import { useSeedStore } from "@/stores/useSeedStore";
import { SEED, namaLaporan, sumberLaporan } from "@/lib/seed";
import { HasilCek } from "@/lib/rules";
import { INFO_ATURAN, labelHasil, satuanCek } from "@/lib/dq";
import { fmtAngka, fmtTetap, fmtBertanda, KOSONG } from "@/lib/format";

function DataQualityContent() {
  const params = useSearchParams();
  const { hasilAturan, jalankanAturanDQ, bukaCek } = useSeedStore();
  const cek = SEED.cek_32;

  // Filter (bentuk asli dipertahankan; isinya dari seed)
  const [activeFilterScope, setFilterScope] = useState("All"); // aturan
  const [activeFilterStatus, setFilterStatus] = useState("All"); // hasil
  const [selectedFacility, setSelectedFacility] = useState("All"); // laporan
  const [activeFilterIssueType, setFilterIssueType] = useState("All"); // kelompok
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Aturan α/β dijalankan sekali di browser bila belum ada hasil.
  useEffect(() => {
    if (!hasilAturan) jalankanAturanDQ();
  }, [hasilAturan, jalankanAturanDQ]);

  // Tautan langsung: ?cek=19 membuka detail; ?q=... dari pencarian header.
  const paramCek = params.get("cek");
  const paramQ = params.get("q");
  useEffect(() => {
    const no = Number(paramCek);
    if (no && cek.some((c) => c.no === no)) bukaCek(no);
  }, [paramCek, cek, bukaCek]);
  useEffect(() => {
    if (paramQ !== null) {
      setSearch(paramQ);
      setCurrentPage(1);
    }
  }, [paramQ]);

  const hasilByNo = useMemo(() => {
    const m = new Map<number, HasilCek>();
    hasilAturan?.hasil.forEach((x) => m.set(x.no, x));
    return m;
  }, [hasilAturan]);
  const r = hasilAturan?.ringkasan;
  const laporanList = useMemo(() => Array.from(new Set(cek.map((c) => c.laporan))).sort(), [cek]);
  const kelompokList = useMemo(() => Array.from(new Set(cek.map((c) => c.kelompok))).sort(), [cek]);

  // Kartu ringkasan (dihitung aplikasi)
  const totalCount = cek.length;
  const healthRate = r ? String(r.tidakDitandai) : KOSONG;
  const criticalCount = r ? r.ditandai.length : KOSONG;
  const warningCount = r ? r.diLuarCakupan.length : KOSONG;
  const daftarNo = (xs: number[]) => xs.map((n) => `#${n}`).join(", ");

  // Baris tabel: pemeriksaan dari seed dipetakan ke field tampilan.
  const records = useMemo(
    () =>
      cek.map((c) => {
        const h = hasilByNo.get(c.no);
        const u = satuanCek(c);
        const jenis = labelHasil(c, h);
        return {
          no: c.no,
          id: `#${c.no}`,
          sourceRef: c.item,
          metric: sumberLaporan(c.laporan, c.halaman_cetak),
          scope: namaLaporan(c.laporan),
          period: `hlm ${c.halaman_cetak}`,
          value: c.nilai_tertulis as number | null,
          unit: h?.hitung != null ? `hitung ulang ${fmtTetap(h.hitung)} ${u.nilai}`.trim() : u.nilai || KOSONG,
          jenis,
          laporan: c.laporan,
          kelompok: c.kelompok,
          aturan: c.aturan_prototipe,
          issueTitle:
            c.aturan_prototipe === "di_luar_cakupan"
              ? "Di luar cakupan"
              : `${INFO_ATURAN[c.aturan_prototipe].simbol} ${INFO_ATURAN[c.aturan_prototipe].ruleId}`,
          ruleId: h?.selisih != null ? `selisih ${fmtBertanda(h.selisih)} ${u.selisih}` : "",
        };
      }),
    [cek, hasilByNo]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((x) => {
      if (activeFilterScope !== "All" && x.aturan !== activeFilterScope) return false;
      if (activeFilterStatus !== "All" && x.jenis !== activeFilterStatus) return false;
      if (selectedFacility !== "All" && x.laporan !== selectedFacility) return false;
      if (activeFilterIssueType !== "All" && x.kelompok !== activeFilterIssueType) return false;
      if (q && !`${x.id} ${x.sourceRef} ${x.metric}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [records, activeFilterScope, activeFilterStatus, selectedFacility, activeFilterIssueType, search]);

  const openDrawer = (record: { no: number }) => bukaCek(record.no);
  const runValidation = jalankanAturanDQ;

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
          Beranda
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
            32 pemeriksaan dari berkas D6 pada laporan keberlanjutan Telkomsel 2023–2025.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            disabled
            title="Spesifikasi"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#c4c6cd]/50 rounded-[8px] text-[13px] font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-[#5c5e64]" />
            <span>Ekspor laporan</span>
          </button>

          <button
            type="button"
            onClick={runValidation}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#b80035] rounded-[8px] text-[13px] font-semibold text-white hover:bg-[#9f002d] transition-colors shadow-sm"
          >
            <RotateCw className="w-4 h-4" />
            <span>Jalankan aturan</span>
          </button>
        </div>
      </div>

      {/* 3. 4 Metric Cards with Bottom Accent Lines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Records */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px] relative overflow-hidden">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Total pemeriksaan
            </div>
            <div className="text-[32px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              {totalCount}
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            {r ? `${r.tercakup} dalam cakupan aturan α/β` : KOSONG}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0b1c30]" />
        </div>

        {/* Card 2: Quality Health Rate */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px] relative overflow-hidden">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Tidak ditandai
            </div>
            <div className="text-[32px] font-bold text-[#00675e] tracking-[-0.9px] leading-tight mt-1">
              {healthRate}
            </div>
          </div>
          <div className="text-[12px] text-[#00675e] font-semibold flex items-center gap-1">
            <span>Dalam cakupan aturan α/β</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00675e]" />
        </div>

        {/* Card 3: Critical Violations */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px] relative overflow-hidden">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Ditandai
            </div>
            <div className="text-[32px] font-bold text-[#b80035] tracking-[-0.9px] leading-tight mt-1">
              {criticalCount}
            </div>
          </div>
          <div className="text-[12px] text-[#b80035] font-medium">
            {r ? `${daftarNo(r.ditandai)} · Warning` : KOSONG}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#b80035]" />
        </div>

        {/* Card 4: Warning Anomalies */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px] relative overflow-hidden">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Di luar cakupan
            </div>
            <div className="text-[32px] font-bold text-[#d97706] tracking-[-0.9px] leading-tight mt-1">
              {warningCount}
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            {r ? daftarNo(r.diLuarCakupan) : KOSONG}
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
            aria-label="Cari pemeriksaan"
            placeholder="Cari pemeriksaan…"
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
              <option value="All">Semua aturan</option>
              <option value="alpha">α (DQ-08)</option>
              <option value="beta">β (DQ-09)</option>
              <option value="di_luar_cakupan">Di luar cakupan</option>
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
              <option value="All">Semua hasil</option>
              <option value="ditandai">Ditandai · Warning</option>
              <option value="tidak">Tidak ditandai</option>
              <option value="luar">Di luar cakupan</option>
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
              <option value="All">Laporan: semua</option>
              {laporanList.map((l) => (
                <option key={l} value={l}>
                  {namaLaporan(l)}
                </option>
              ))}
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
              <option value="All">Semua kelompok</option>
              {kelompokList.map((k) => (
                <option key={k} value={k}>
                  Kelompok {k}
                </option>
              ))}
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
              Hapus filter
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
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">PEMERIKSAAN</th>
                <th className="py-3 px-4">LAPORAN</th>
                <th className="py-3 px-4">HALAMAN</th>
                <th className="py-3 px-4">TERTULIS</th>
                <th className="py-3 px-4">HASIL</th>
                <th className="py-3 px-4">ATURAN</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#5c5e64]">
                    Tidak ada pemeriksaan yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                paginated.map((record) => {
                  const isError = false;
                  const isWarn = record.jenis === "ditandai";
                  const isResolved = record.jenis === "luar";

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
                            ? KOSONG
                            : fmtAngka(record.value)}
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
                            ? "Di luar cakupan"
                            : isError
                            ? KOSONG
                            : isWarn
                            ? "Ditandai · Warning"
                            : "Tidak ditandai"}
                        </span>
                      </td>

                      {/* Violation Type */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-[12px] text-[#0b1c30] truncate font-medium">
                          {record.issueTitle || KOSONG}
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
                          {isResolved ? KOSONG : isWarn ? "Perlu review" : "Lolos"}
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
                          Lihat detail
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
            Menampilkan <strong className="text-[#0b1c30]">{filtered.length ? (currentPage - 1) * pageSize + 1 : 0}</strong>–
            <strong className="text-[#0b1c30]">
              {Math.min(currentPage * pageSize, filtered.length)}
            </strong>{" "}
            dari <strong className="text-[#0b1c30]">{filtered.length}</strong> pemeriksaan
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
            Temuan per jenis masalah
          </h3>

          <div className="space-y-3 pt-1 text-[12px]">
            <div>
              <div className="flex items-center justify-between text-[#0b1c30] font-medium mb-1">
                <span>Spesifikasi</span>
                <span className="font-bold">—</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#b80035] h-full" style={{ width: "0%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[#0b1c30] font-medium mb-1">
                <span>—</span>
                <span className="font-bold">—</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#d97706] h-full" style={{ width: "0%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[#0b1c30] font-medium mb-1">
                <span>—</span>
                <span className="font-bold">—</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#f59e0b] h-full" style={{ width: "0%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[#0b1c30] font-medium mb-1">
                <span>—</span>
                <span className="font-bold">—</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#facc15] h-full" style={{ width: "0%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[#0b1c30] font-medium mb-1">
                <span>—</span>
                <span className="font-bold">—</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                <div className="bg-[#94a3b8] h-full" style={{ width: "0%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Findings by Scope */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
              Temuan per scope
            </h3>

            {/* Scope Visual Breakdown */}
            <div className="my-5 flex items-center justify-center">
              <div className="relative w-36 h-36 rounded-full border-8 border-[#eff4ff] flex flex-col items-center justify-center shadow-inner">
                <div
                  className="absolute inset-0 rounded-full border-8 border-transparent border-t-[#b80035] border-r-[#b80035] border-b-[#b80035]"
                  style={{ transform: "rotate(45deg)" }}
                />
                <span className="text-[10px] font-bold text-[#5c5e64] uppercase tracking-wider">
                  —
                </span>
                <span className="text-[22px] font-bold text-[#0b1c30]">—</span>
                <span className="text-[10px] text-[#5c5e64]">Spesifikasi</span>
              </div>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between p-2 rounded-[8px] bg-[#eff4ff]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-[3px] bg-[#b80035]" />
                  <span className="font-medium text-[#0b1c30]">—</span>
                </div>
                <span className="font-bold text-[#0b1c30]">—</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-[8px] bg-[#eff4ff]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-[3px] bg-[#ffb3b6]" />
                  <span className="font-medium text-[#0b1c30]">—</span>
                </div>
                <span className="font-bold text-[#0b1c30]">—</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#5c5e64] pt-3 border-t border-[#f1f5f9]">
            —
          </div>
        </div>

        {/* Card 3: Recent Resolved Findings */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
                Temuan terselesaikan
              </h3>
              <FileCheck className="w-4 h-4 text-[#00675e]" />
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="p-2.5 rounded-[8px] bg-[#eff4ff]/60 border border-[#dce9ff]/60 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#0b1c30]">—</span>
                  <span className="text-[10px] text-[#5c5e64]">—</span>
                </div>
                <p className="text-[#0b1c30] font-medium mt-1">
                  Spesifikasi
                </p>
                <p className="text-[11px] text-[#5c5e64] mt-0.5">
                  —
                </p>
              </div>

              {/* Item 2 */}
              <div className="p-2.5 rounded-[8px] bg-[#eff4ff]/60 border border-[#dce9ff]/60 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#0b1c30]">—</span>
                  <span className="text-[10px] text-[#5c5e64]">—</span>
                </div>
                <p className="text-[#0b1c30] font-medium mt-1">
                  —
                </p>
                <p className="text-[11px] text-[#5c5e64] mt-0.5">
                  —
                </p>
              </div>

              {/* Item 3 */}
              <div className="p-2.5 rounded-[8px] bg-[#eff4ff]/60 border border-[#dce9ff]/60 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#0b1c30]">—</span>
                  <span className="text-[10px] text-[#5c5e64]">—</span>
                </div>
                <p className="text-[#0b1c30] font-medium mt-1">
                  —
                </p>
                <p className="text-[11px] text-[#5c5e64] mt-0.5">
                  —
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
            <span className="text-[#5c5e64]">—</span>
            <Link href="/governance" title="Spesifikasi" className="text-[#b80035] font-semibold hover:underline">
              Governance & Jejak Perubahan →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DataQualityPage() {
  return (
    <Suspense fallback={null}>
      <DataQualityContent />
    </Suspense>
  );
}
