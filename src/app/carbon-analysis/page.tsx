"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  Info,
  Calculator,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Flame,
  Zap,
} from "lucide-react";
import WaterfallChart from "@/components/charts/WaterfallChart";
import { CarbonDriver } from "@/types/tera";
import { SEED, sumberLaporan } from "@/lib/seed";
import { TAHUN, nilaiTahun, SUMBER_DASHBOARD } from "@/lib/dashboard";
import { dekomposisi, langkahWaterfall, persenTerhadap, lebarBatang } from "@/lib/hitung-carbon";
import { jalankanAturan } from "@/lib/rules";
import { REVISI } from "@/lib/reconciliation";
import { fmtAngka, fmtBertanda, fmtPersen, fmtPersenKontribusi, KOSONG } from "@/lib/format";

const SPESIFIKASI = "Spesifikasi";
const D = KOSONG;
const DARI_SEED = "Dihitung dari seed";

// Pasangan tahun dari seed: berurutan, lalu tahun pertama → terakhir.
const PASANGAN: [string, string][] = [
  ...TAHUN.slice(1).map((t, i): [string, string] => [TAHUN[i], t]),
  [TAHUN[0], TAHUN[TAHUN.length - 1]],
];
// Kunci chip asli dipakai sebagai indeks pasangan.
const KUNCI_CHIP = ["All", "Scope 1", "Scope 2"];
const label = (p?: [string, string]) => (p ? `${p[0]}→${p[1]}` : D);
// Hasil aturan dan revisi yang belum terselesaikan (dari seed, deterministik).
const ATURAN = jalankanAturan(SEED.cek_32).ringkasan;
const REVISI_UNRESOLVED = REVISI.filter((r) => r.kodeAlasan === "Unresolved").length;
const daftarNo = (xs: number[]) => xs.map((n) => `#${n}`).join(", ");

export default function CarbonAnalysisPage() {
  const [activeScopeFilter, setActiveScopeFilter] = useState(KUNCI_CHIP[PASANGAN.length - 1]);
  const [tableCategory, setTableCategory] = useState("All");
  const pasangan = PASANGAN[KUNCI_CHIP.indexOf(activeScopeFilter)] ?? PASANGAN[PASANGAN.length - 1];
  const [tAwal, tAkhir] = pasangan;
  const awal = nilaiTahun(tAwal)!;
  const akhir = nilaiTahun(tAkhir)!;
  const dk = dekomposisi(awal, akhir);
  const persenTotal = persenTerhadap(dk.deltaTotal, awal.scope1_2);
  const kontribusi = (x: number) => persenTerhadap(x, dk.deltaTotal);
  // Pemeriksaan α yang membandingkan komponen dengan total tertulis FY akhir (SR terbaru).
  const cekTotal = SEED.cek_32.find(
    (c) =>
      c.aturan_prototipe === "alpha" &&
      c.nilai_tertulis === akhir.scope1_2 &&
      sumberLaporan(c.laporan, c.halaman_cetak) === SUMBER_DASHBOARD
  );
  const dominan = Math.abs(dk.deltaScope2) >= Math.abs(dk.deltaScope1) ? "Scope 2" : "Scope 1";
  const lebar = lebarBatang;

  // Langkah waterfall → bentuk data yang dipakai grafik dan tabel desain.
  const drivers: CarbonDriver[] = useMemo(
    () =>
      langkahWaterfall(dk, tAwal, tAkhir).map((l) => ({
        id: l.id,
        name: l.nama,
        subLabel:
          l.id === "BULAT" && cekTotal ? `#${cekTotal.no}` : l.jenis === "anchor" ? "tertulis" : "akhir − awal",
        category: l.id === "BULAT" && cekTotal ? `${SUMBER_DASHBOARD} · pemeriksaan #${cekTotal.no}` : SUMBER_DASHBOARD,
        scope: l.id === "S1" ? "Scope 1" : l.id === "S2" ? "Scope 2" : "Scope 1+2",
        deltaTco2e: l.nilai,
        type: l.jenis,
        uncertaintyStatus: "terverifikasi",
        formula:
          l.id === "BULAT"
            ? "Total tertulis − (awal + Δ Scope 2 + Δ Scope 1)"
            : l.jenis === "anchor"
            ? "Total tertulis"
            : "FY akhir − FY awal",
        source: SUMBER_DASHBOARD,
        runningVal: l.kumulatif,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tAwal, tAkhir]
  );
  const [selectedDriver, setSelectedDriver] = useState<CarbonDriver | undefined>(undefined);


  // Filtered drivers for the registry table
  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      if (d.type === "anchor") return false; // tabel hanya berisi pendorong
      if (tableCategory === "Boundary" && d.id !== "S2") return false;
      if (tableCategory === "Grid" && d.id !== "S1") return false;
      if (tableCategory === "Operational" && d.id !== "BULAT") return false;

      return true;
    });
  }, [drivers, tableCategory]);

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#5c5e64]">
        <Link href="/overview" className="hover:text-[#0b1c30] transition-colors">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5c5e64]/60" />
        <span className="font-semibold text-[#0b1c30]">Carbon Driver Analysis</span>
      </nav>

      {/* 2. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#0b1c30] tracking-[-0.8px] leading-[40px]">
            Carbon Driver Analysis
          </h1>
          <p className="text-[14px] text-[#5c5e64] mt-1 leading-[20px]">
            Memisahkan perubahan Scope 1+2 menjadi Δ Scope 2, Δ Scope 1, dan pembulatan dari angka laporan.
          </p>
        </div>

        <button
          type="button"
          disabled
          title="Spesifikasi"
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#c4c6cd]/50 rounded-[8px] text-[13px] font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-sm shrink-0"
        >
          <Download className="w-4 h-4 text-[#5c5e64]" />
          <span>Ekspor matriks</span>
        </button>
      </div>

      {/* 3. Filter Chips / Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveScopeFilter("All")}
          title={DARI_SEED}
          className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-semibold transition-colors ${
            activeScopeFilter === "All"
              ? "bg-[#b80035] text-white shadow-sm"
              : "bg-white text-[#5c5e64] border border-[#e5eeff] hover:bg-[#f8f9ff]"
          }`}
        >
          FY {label(PASANGAN[0])}
        </button>
        <button
          type="button"
          onClick={() => setActiveScopeFilter("Scope 1")}
          title={DARI_SEED}
          className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-semibold transition-colors ${
            activeScopeFilter === "Scope 1"
              ? "bg-[#b80035] text-white shadow-sm"
              : "bg-white text-[#5c5e64] border border-[#e5eeff] hover:bg-[#f8f9ff]"
          }`}
        >
          FY {label(PASANGAN[1])}
        </button>
        <button
          type="button"
          onClick={() => setActiveScopeFilter("Scope 2")}
          title={DARI_SEED}
          className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-semibold transition-colors ${
            activeScopeFilter === "Scope 2"
              ? "bg-[#b80035] text-white shadow-sm"
              : "bg-white text-[#5c5e64] border border-[#e5eeff] hover:bg-[#f8f9ff]"
          }`}
        >
          FY {label(PASANGAN[2])}
        </button>
        <button
          type="button"
          onClick={() => setActiveScopeFilter("Material")}
          disabled
          title={SPESIFIKASI}
          className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-semibold transition-colors ${
            activeScopeFilter === "Material"
              ? "bg-[#b80035] text-white shadow-sm"
              : "bg-white text-[#5c5e64] border border-[#e5eeff] hover:bg-[#f8f9ff]"
          }`}
        >
          Pasangan lain ({D})
        </button>
      </div>

      {/* 4. 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: 2024 Base Anchor */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Scope 1+2 · FY {tAkhir}
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              {fmtAngka(akhir.scope1_2)}
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            FY {tAwal}: {fmtAngka(awal.scope1_2)} tCO₂e · {SUMBER_DASHBOARD}
          </div>
        </div>

        {/* Card 2: Gross Structural Growth */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Perubahan Scope 1+2 · FY {label(pasangan)}
            </div>
            <div className="text-[30px] font-bold text-[#b80035] tracking-[-0.9px] leading-tight mt-1">
              {fmtBertanda(dk.deltaTotal)}
            </div>
          </div>
          <div className="text-[12px] text-[#b80035] font-semibold">
            {fmtPersen(persenTotal)} terhadap FY {tAwal} · {DARI_SEED}
          </div>
        </div>

        {/* Card 3: Operational Reductions */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Kontribusi Scope 2 terhadap perubahan
            </div>
            <div className="text-[30px] font-bold text-[#00675e] tracking-[-0.9px] leading-tight mt-1">
              {fmtPersenKontribusi(dk.kontribusiScope2Pct)}
            </div>
          </div>
          <div className="text-[12px] text-[#00675e] font-semibold">
            Kontribusi Scope 1: {fmtPersenKontribusi(dk.kontribusiScope1Pct)} · {DARI_SEED}
          </div>
        </div>

        {/* Card 4: 2025 Current Footprint */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Pendorong belum terselesaikan
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              {REVISI_UNRESOLVED}
            </div>
          </div>
          <div className="text-[12px] text-[#b80035] font-semibold">
            revisi Unresolved · ditandai {daftarNo(ATURAN.ditandai)} · di luar cakupan {daftarNo(ATURAN.diLuarCakupan)}
          </div>
        </div>
      </div>

      {/* 5. Waterfall Chart Component */}
      <WaterfallChart
        drivers={drivers}
        selectedDriverId={selectedDriver?.id}
        onSelectDriver={(d) => setSelectedDriver(d)}
      />

      {/* 6. Proportional Scope Contribution Section */}
      <div className="bg-white rounded-[12px] p-6 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
            Kontribusi terhadap perubahan FY {label(pasangan)}
          </h3>
          <span className="text-[11px] font-semibold text-[#5c5e64] bg-[#eff4ff] px-2.5 py-1 rounded-[6px]">
            {DARI_SEED}
          </span>
        </div>

        {/* Visual Proportional Comparison Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-[12px] font-semibold text-[#0b1c30] mb-1.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#b80035]" />
                <span>Δ Scope 2</span>
              </div>
              <span className="text-[13px] font-bold">{fmtBertanda(dk.deltaScope2)} tCO₂e ({fmtPersenKontribusi(kontribusi(dk.deltaScope2))})</span>
            </div>
            <div className="w-full bg-[#f1f5f9] h-3 rounded-full overflow-hidden">
              <div className="bg-[#b80035] h-full rounded-full" style={{ width: lebar(dk.kontribusiScope2Pct) }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[12px] font-semibold text-[#0b1c30] mb-1.5">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#ffb3b6]" />
                <span>Δ Scope 1</span>
              </div>
              <span className="text-[13px] font-bold">{fmtBertanda(dk.deltaScope1)} tCO₂e ({fmtPersenKontribusi(kontribusi(dk.deltaScope1))})</span>
            </div>
            <div className="w-full bg-[#f1f5f9] h-3 rounded-full overflow-hidden">
              <div className="bg-[#ffb3b6] h-full rounded-full" style={{ width: lebar(dk.kontribusiScope1Pct) }} />
            </div>
          </div>
        </div>

        {/* Analytical Finding Callout Box */}
        <div className="p-4 bg-[#eff4ff] border border-[#dce9ff] rounded-[10px] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#00675e] shrink-0 mt-0.5" />
          <div className="text-[12px] text-[#0b1c30] leading-relaxed">
            <span className="font-bold">Temuan: </span>
            <strong>Perubahan {label(pasangan)}</strong> secara aritmetik didominasi <strong>{dominan}</strong>. Sebab perubahan tidak dinyatakan pada seed: Belum terbukti.
          </div>
        </div>
      </div>

      {/* 7. Driver Decomposition Registry Table */}
      <div className="bg-white rounded-[12px] border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-5 border-b border-[#e5eeff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
              Sumber dan rincian perhitungan
            </h3>
            <p className="text-[12px] text-[#5c5e64] mt-0.5">
              {DARI_SEED} · FY {label(pasangan)}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#eff4ff] p-1 rounded-[8px] border border-[#dce9ff] text-[12px]">
            <button
              type="button"
              onClick={() => setTableCategory("All")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                tableCategory === "All"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setTableCategory("Boundary")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                tableCategory === "Boundary"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Scope 2
            </button>
            <button
              type="button"
              onClick={() => setTableCategory("Grid")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                tableCategory === "Grid"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Scope 1
            </button>
            <button
              type="button"
              onClick={() => setTableCategory("Operational")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                tableCategory === "Operational"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Pembulatan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#dce9ff] text-[#5c5e64] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">PENDORONG / RUMUS</th>
                <th className="py-3 px-4">SUMBER</th>
                <th className="py-3 px-4">SCOPE</th>
                <th className="py-3 px-4 text-right">NILAI (tCO₂e)</th>
                <th className="py-3 px-4 text-right">KONTRIBUSI</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredDrivers.map((driver) => {
                const isInc = driver.type === "increase";
                const isRed = driver.type === "reduction";
                const isUnres = driver.type === "unresolved";
                const isSelected = selectedDriver?.id === driver.id;

                const contribPercent =
                  driver.type === "anchor"
                    ? D
                    : fmtPersenKontribusi(kontribusi(driver.deltaTco2e));

                return (
                  <tr
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-[#eff4ff]" : "hover:bg-[#f8f9ff]"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0b1c30]">
                      {driver.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0b1c30]">
                        {driver.name}
                      </div>
                      <div className="text-[11px] text-[#5c5e64]">
                        {driver.formula}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold text-[#0b1c30] bg-[#eff4ff] px-2 py-0.5 rounded-[4px]">
                        {driver.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#0b1c30] bg-[#e5eeff] px-2 py-0.5 rounded text-[11px]">
                        {driver.scope}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`font-bold ${
                          isInc
                            ? "text-[#b80035]"
                            : isRed
                            ? "text-[#00675e]"
                            : isUnres
                            ? "text-[#d97706]"
                            : "text-[#0b1c30]"
                        }`}
                      >
                        {fmtBertanda(driver.deltaTco2e)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-semibold text-[#0b1c30]">
                      {contribPercent}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          driver.uncertaintyStatus === "terverifikasi"
                            ? "bg-[#dcfce7] text-[#15803d]"
                            : driver.uncertaintyStatus === "estimasi"
                            ? "bg-[#fef3c7] text-[#d97706]"
                            : "bg-[#ffdad6] text-[#b80035]"
                        }`}
                      >
                        {driver.uncertaintyStatus === "terverifikasi" ? DARI_SEED : D}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDriver(driver);
                        }}
                        className="text-[12px] font-semibold text-[#b80035] hover:underline"
                      >
                        Lihat
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
