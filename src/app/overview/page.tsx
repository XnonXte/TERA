"use client";

import React, { useEffect } from "react";
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
import { useSeedStore } from "@/stores/useSeedStore";
import { SEED, sumberLaporan } from "@/lib/seed";
import { TAHUN, nilaiTahun, perubahanVsSebelumnya, kenaikanTerakhirVsAwal, SUMBER_DASHBOARD } from "@/lib/dashboard";
import { REVISI, VERSI } from "@/lib/reconciliation";
import { TEKS_SIMULASI } from "@/lib/simulasi";
import { fmtAngka, fmtPersen, KOSONG } from "@/lib/format";

// Tautan yang belum dibangun: dinonaktifkan tanpa mengubah bentuk.
const tahanTautan = (e: React.MouseEvent) => e.preventDefault();

export default function OverviewPage() {
  const { hasilAturan, jalankanAturanDQ, bukaCek, baselineAktif } = useSeedStore();

  // Hasil aturan α/β dijalankan di browser bila belum ada.
  useEffect(() => {
    if (!hasilAturan) jalankanAturanDQ();
  }, [hasilAturan, jalankanAturanDQ]);

  const tahun = TAHUN[TAHUN.length - 1];
  const sebelum = TAHUN[TAHUN.length - 2];
  const n = nilaiTahun(tahun);
  const nPrev = nilaiTahun(sebelum);
  const ubah = perubahanVsSebelumnya(tahun);
  const naik = kenaikanTerakhirVsAwal();
  const r = hasilAturan?.ringkasan;
  const total = SEED.cek_32.length;
  const pct = (x: number) => `${((x / total) * 100).toFixed(1).replace(".", ",")}%`;
  const ditandai = SEED.cek_32.filter((c) => r?.ditandai.includes(c.no));
  const [c1, c2, c3] = ditandai;
  const kodeAlasan = Array.from(new Set(REVISI.map((x) => x.kodeAlasan))).join(", ");
  const [v1, v2, v3] = VERSI;

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#0b1c30] tracking-[-0.8px] leading-[40px]">
            Ringkasan emisi Scope 1 & 2
          </h1>
          <p className="text-[14px] text-[#5c5e64] mt-1 leading-[20px]">
            <span>Data emisi untuk </span>
            <span className="font-semibold text-[#0b1c30]">FY {tahun}</span>
            <span>. </span>
            <span className="text-[#5c5e64]/70">
              Sumber: {SUMBER_DASHBOARD}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Simulasi Badge */}
          <div className="flex items-center gap-2 bg-[#eff4ff] px-3.5 py-2 rounded-[8px] border border-[#dce9ff]" title={TEKS_SIMULASI}>
            <ShieldCheck className="w-4 h-4 text-[#00675e]" />
            <div className="text-[11px] text-[#5c5e64] leading-tight font-medium">
              <p className="font-semibold text-[#0b1c30]">Simulasi</p>
              <p>Prototipe terbatas</p>
            </div>
          </div>

          {/* View Reports Button */}
          <button
            type="button"
            disabled
            title="Spesifikasi"
            className="flex items-center gap-2 bg-[#b80035] text-white text-[13px] font-medium px-4 py-2.5 rounded-[8px] hover:bg-[#9f002d] transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Lihat laporan</span>
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
              Emisi Scope 1+2 · FY {tahun}
            </span>
          </div>

          <div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight">
              {fmtAngka(n?.scope1_2)}
            </div>
          </div>

          <div className="text-[11px] text-[#5c5e64] tracking-[0.11px]">
            <span>FY {sebelum}: </span>
            <span className="font-bold text-[#0b1c30]">{fmtAngka(nPrev?.scope1_2)}</span>
            <span className="font-bold text-[#0b1c30]"> tCO₂e ({fmtPersen(ubah?.percentage)})</span>
          </div>
        </Link>

        {/* Card 2: YoY Trajectory */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[180px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[8px] bg-[#b80035] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Kenaikan {naik.akhir} vs {naik.awal}
            </span>
          </div>

          <div>
            <div className="text-[30px] font-bold text-[#b80035] tracking-[-0.9px] leading-tight">
              {fmtPersen(naik.hitungUlangPct)}
            </div>
          </div>

          <div className="text-[11px] text-[#5c5e64] tracking-[0.11px] truncate">
            Sumber: {naik.sumberTabel} dan hlm 147
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
              Pemeriksaan ditandai
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight">
              {r ? r.ditandai.length : KOSONG}
            </span>
            <span className="text-[13px] font-medium text-[#5c5e64]">
              dari {r ? r.tercakup : KOSONG}
            </span>
          </div>

          <div className="text-[11px] text-[#5c5e64] tracking-[0.11px]">
            Aturan α/β · in-sample
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
              Status rekonsiliasi
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight">
              {baselineAktif ?? "Belum ada"}
            </span>
            <span className="text-[13px] font-medium text-[#5c5e64]">
              baseline aktif (simulasi)
            </span>
          </div>

          <div className="text-[11px] text-[#5c5e64] tracking-[0.11px]">
            {REVISI.length} revisi · kode alasan {kodeAlasan}
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
                  Ringkasan pemeriksaan data
                </h3>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#5c5e64]" />
            </div>

            <div className="flex items-center justify-between py-1 text-[13px]">
              <span className="text-[#5c5e64]">Total pemeriksaan</span>
              <span className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
                {total}
              </span>
            </div>

            {/* Segmented Quality Progress Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#dce9ff] mt-2 mb-3">
              <div className="bg-[#00675e] h-full" style={{ width: r ? pct(r.tidakDitandai) : "0%" }} title="Tidak ditandai" />
              <div className="bg-[#f59e0b] h-full" style={{ width: r ? pct(r.ditandai.length) : "0%" }} title="Ditandai · Warning" />
              <div className="bg-[#ba1a1a] h-full" style={{ width: r ? pct(r.diLuarCakupan.length) : "0%" }} title="Di luar cakupan" />
            </div>

            {/* Detailed Row Status Indicators */}
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00675e]" />
                  <span className="text-[#5c5e64]">Tidak ditandai</span>
                </div>
                <span className="font-medium text-[#0b1c30]">{r ? `${r.tidakDitandai} pemeriksaan (${pct(r.tidakDitandai)})` : KOSONG}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <span className="text-[#5c5e64]">Ditandai · Warning</span>
                </div>
                <span className="font-medium text-[#0b1c30]">{r ? `${r.ditandai.length} pemeriksaan (${pct(r.ditandai.length)})` : KOSONG}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a]" />
                  <span className="text-[#5c5e64]">Di luar cakupan</span>
                </div>
                <span className="font-bold text-[#ba1a1a]">{r ? `${r.diLuarCakupan.length} pemeriksaan (${pct(r.diLuarCakupan.length)})` : KOSONG}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
            <span className="text-[#5c5e64]">
              Dalam cakupan aturan: <strong className="text-[#0b1c30]">{r ? r.tercakup : KOSONG}</strong>
            </span>
            <span className="text-[#b80035] font-semibold flex items-center gap-1">
              Lihat →
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
                  Versi baseline Scope 1+2 2023
                </h3>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#5c5e64]" />
            </div>

            <div className="space-y-2">
              <div className="bg-[#eff4ff] rounded-[8px] p-2.5 flex items-center justify-between text-[11px]">
                <span className="text-[#5c5e64]">{v1.versi}</span>
                <span className="font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00675e]" />
                  {fmtAngka(v1.nilai)} tCO₂e
                </span>
              </div>

              <div className="bg-[#eff4ff] rounded-[8px] p-2.5 flex items-center justify-between text-[11px]">
                <span className="text-[#5c5e64]">{v2.versi}</span>
                <span className="font-bold text-[#b80035]">{fmtAngka(v2.nilai)} tCO₂e</span>
              </div>

              <div className="bg-[#eff4ff] rounded-[8px] p-2.5 flex items-center justify-between text-[11px]">
                <span className="text-[#5c5e64]">{v3.versi}</span>
                <span className="font-bold text-[#0b1c30]">{fmtAngka(v3.nilai)} tCO₂e</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
            <span className="text-[#5c5e64]">
              Baseline aktif (simulasi): <strong className="text-[#0b1c30]">{baselineAktif ?? "Belum ada"}</strong>
            </span>
            <span className="text-[#b80035] font-semibold flex items-center gap-1">
              Buka rekonsiliasi →
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
                  Pemeriksaan ditandai
                </h3>
              </div>
              <Link href="/data-quality" className="text-[11px] font-bold text-[#b80035] hover:underline">
                Lihat semua →
              </Link>
            </div>

            <div className="space-y-2 mt-2">
              {/* Action 1 */}
              <div
                onClick={() => c1 && bukaCek(c1.no)}
                className="p-2 rounded-[8px] hover:bg-[#f8f9ff] cursor-pointer transition-colors flex items-center justify-between gap-2"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <AlertTriangle className="w-4 h-4 text-[#b80035] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-[#0b1c30] truncate leading-tight">
                      {c1 ? `#${c1.no} ${c1.item}` : KOSONG}
                    </p>
                    <p className="text-[11px] text-[#5c5e64] leading-tight mt-0.5">
                      {c1 ? sumberLaporan(c1.laporan, c1.halaman_cetak) : KOSONG}
                    </p>
                  </div>
                </div>
                <span className="bg-[#ffdad6] text-[#b80035] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                  Warning
                </span>
              </div>

              {/* Action 2 */}
              <Link
                href={c2 ? `/data-quality?cek=${c2.no}` : "/data-quality"}
                className="p-2 rounded-[8px] hover:bg-[#f8f9ff] transition-colors flex items-center justify-between gap-2"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <Target className="w-4 h-4 text-[#40000c] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-[#0b1c30] truncate leading-tight">
                      {c2 ? `#${c2.no} ${c2.item}` : KOSONG}
                    </p>
                    <p className="text-[11px] text-[#5c5e64] leading-tight mt-0.5">
                      {c2 ? sumberLaporan(c2.laporan, c2.halaman_cetak) : KOSONG}
                    </p>
                  </div>
                </div>
                <span className="bg-[#ffdad6] text-[#b80035] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                  Warning
                </span>
              </Link>

              {/* Action 3 */}
              <Link
                href={c3 ? `/data-quality?cek=${c3.no}` : "/data-quality"}
                className="p-2 rounded-[8px] hover:bg-[#f8f9ff] transition-colors flex items-center justify-between gap-2"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <FlaskConical className="w-4 h-4 text-[#44474d] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-[#0b1c30] truncate leading-tight">
                      {c3 ? `#${c3.no} ${c3.item}` : KOSONG}
                    </p>
                    <p className="text-[11px] text-[#5c5e64] leading-tight mt-0.5">
                      {c3 ? sumberLaporan(c3.laporan, c3.halaman_cetak) : KOSONG}
                    </p>
                  </div>
                </div>
                <span className="bg-[#ffdad6] text-[#b80035] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                  Warning
                </span>
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
            <span className="text-[#5c5e64]">{r ? `${r.ditandai.length} dari ${r.tercakup} pemeriksaan ditandai` : KOSONG}</span>
            <Link href="/data-quality" title="Spesifikasi" aria-disabled="true" onClick={tahanTautan} className="text-[#b80035] font-semibold hover:underline">
              Spesifikasi →
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Section - Recent Activity */}
      <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0b1c30]" />
            <h2 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
              Aktivitas terbaru
            </h2>
            <span className="bg-[#e5eeff] text-[#5c5e64] text-[11px] font-semibold px-2 py-0.5 rounded-[4px] tracking-[0.22px]">
              Spesifikasi
            </span>
          </div>

          <Link
            href="/governance"
            title="Spesifikasi"
            className="flex items-center gap-1 text-[13px] font-semibold text-[#b80035] hover:underline"
          >
            <span>Governance & Jejak Perubahan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Activity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Activity 1 */}
          <div className="bg-[#eff4ff]/50 rounded-[8px] p-3.5 border border-[#dce9ff]/60 shadow-[0px_2px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ffdada] text-[#40000c] flex items-center justify-center font-bold text-[11px] shrink-0">
                —
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0b1c30] truncate">
                    —
                  </span>
                  <span className="text-[10px] text-[#5c5e64]">—</span>
                </div>
                <p className="text-[13px] font-medium text-[#0b1c30] mt-1 leading-tight">
                  Spesifikasi
                </p>
                <p className="text-[11px] text-[#5c5e64] mt-1 leading-tight">
                  —
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#dce9ff]/50 flex items-center justify-between text-[11px]">
              <span className="text-[#5c5e64]/70">—</span>
              <Link href="/reconciliation" title="Spesifikasi" aria-disabled="true" onClick={tahanTautan} className="text-[#b80035] font-semibold hover:underline flex items-center gap-1">
                —
              </Link>
            </div>
          </div>

          {/* Activity 2 */}
          <div className="bg-[#eff4ff]/50 rounded-[8px] p-3.5 border border-[#dce9ff]/60 shadow-[0px_2px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#d3e4fe] text-[#0b1c30] flex items-center justify-center font-bold text-[11px] shrink-0">
                —
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0b1c30] truncate">
                    —
                  </span>
                  <span className="text-[10px] text-[#5c5e64]">—</span>
                </div>
                <p className="text-[13px] font-medium text-[#0b1c30] mt-1 leading-tight">
                  —
                </p>
                <p className="text-[11px] text-[#5c5e64] mt-1 leading-tight">
                  —
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#dce9ff]/50 flex items-center justify-between text-[11px]">
              <span className="text-[#5c5e64]/70">—</span>
              <Link href="/governance" title="Spesifikasi" aria-disabled="true" onClick={tahanTautan} className="text-[#b80035] font-semibold hover:underline flex items-center gap-1">
                —
              </Link>
            </div>
          </div>

          {/* Activity 3 */}
          <div className="bg-[#eff4ff]/50 rounded-[8px] p-3.5 border border-[#dce9ff]/60 shadow-[0px_2px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#89f5e7] text-[#00201d] flex items-center justify-center font-bold text-[11px] shrink-0">
                —
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0b1c30] truncate">
                    —
                  </span>
                  <span className="text-[10px] text-[#5c5e64]">—</span>
                </div>
                <p className="text-[13px] font-medium text-[#0b1c30] mt-1 leading-tight">
                  —
                </p>
                <p className="text-[11px] text-[#5c5e64] mt-1 leading-tight">
                  —
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#dce9ff]/50 flex items-center justify-between text-[11px]">
              <span className="text-[#5c5e64]/70">—</span>
              <Link href="/decision-lab" title="Spesifikasi" aria-disabled="true" onClick={tahanTautan} className="text-[#b80035] font-semibold hover:underline flex items-center gap-1">
                —
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
