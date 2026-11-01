"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  FlaskConical,
  RotateCcw,
  BookmarkCheck,
  CheckCircle2,
  ChevronRight,
  CheckSquare,
  Sliders,
  Info,
} from "lucide-react";
import CostEffectivenessChart from "@/components/charts/CostEffectivenessChart";
import { DecarbonizationOption } from "@/types/tera";
import { useSeedStore } from "@/stores/useSeedStore";
import { hitungSkenario, urutkanSkenario, HasilSkenario } from "@/lib/hitung-keputusan";
import {
  BASELINE,
  GAP_AWAL,
  STATUS_TARGET,
  SUMBER_BASELINE,
  TAHUN_BASELINE,
  SATUAN,
  RENTANG,
  PENANDA,
  DURASI_NOTIFIKASI_MS,
  LABEL_HIPOTETIS,
} from "@/lib/keputusan";
import { fmtAngka, fmtPersen, KOSONG } from "@/lib/format";

const D = KOSONG;
const HIPOTETIS = LABEL_HIPOTETIS;
const persen = (x: number) => `${x}%`;
const ton = (x: number | null | undefined) => (x === null || x === undefined ? D : `${fmtAngka(x)} ${SATUAN}`);

export default function DecisionLabPage() {
  const { skenario, simpanSkenario, pilihSkenario } = useSeedStore();
  const [persenScope2, setPersenScope2] = useState(RENTANG.min);
  const [persenScope1, setPersenScope1] = useState(RENTANG.min);
  const [notification, setNotification] = useState("");

  // Hasil parameter yang sedang diatur di slider
  const hasil = hitungSkenario(BASELINE, { persenScope2, persenScope1, biaya: null, waktu: null });

  // Skenario tersimpan → bentuk kartu/tabel desain, diurutkan dari pengurangan hipotetis terbesar
  const daftar = useMemo(
    () =>
      urutkanSkenario(
        skenario.map((s) => ({
          s,
          hasil: hitungSkenario(BASELINE, { persenScope2: s.persenScope2, persenScope1: s.persenScope1, biaya: s.biaya, waktu: s.waktu }),
        }))
      ),
    [skenario]
  );
  const hasilById = new Map<string, HasilSkenario>(daftar.map((x) => [x.s.id, x.hasil]));
  const options: DecarbonizationOption[] = daftar.map(({ s, hasil: h }) => ({
    id: s.id,
    code: s.id,
    tag: HIPOTETIS,
    name: s.nama,
    description: `Scope 2 −${persen(s.persenScope2)} · Scope 1 −${persen(s.persenScope1)} dari baseline FY ${TAHUN_BASELINE}`,
    reductionTco2e: h.pengurangan,
    implementationCostIdr: s.biaya,
    annualOperatingCostIdr: null,
    costEffectiveness: h.biayaPerTon,
    implementationMonths: s.waktu,
    feasibility: "unknown",
    evidenceStatus: "unresolved",
    assumptions: [],
    sourceRefs: [SUMBER_BASELINE],
    selected: s.dipilih,
  }));
  const toggleOption = (id: string) => pilihSkenario(id);
  const handleSaveScenario = () => {
    const baru = simpanSkenario(persenScope2, persenScope1);
    setNotification(`${baru.id} disimpan: ${baru.nama}`);
    setTimeout(() => setNotification(""), DURASI_NOTIFIKASI_MS);
  };
  const handleReset = () => {
    setPersenScope2(RENTANG.min);
    setPersenScope1(RENTANG.min);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#5c5e64]">
        <Link href="/overview" className="hover:text-[#0b1c30] transition-colors">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5c5e64]/60" />
        <span className="font-semibold text-[#0b1c30]">Decision Lab</span>
      </nav>

      {/* 2. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#0b1c30] tracking-[-0.8px] leading-[40px]">
            Decision Lab
          </h1>
          <p className="text-[14px] text-[#5c5e64] mt-1 leading-[20px]">
            Kalkulator hipotetis di atas baseline FY {TAHUN_BASELINE} dari laporan; membandingkan skenario pengurangan emisi.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Simulative Mode Badge */}
          <div className="flex items-center gap-2 bg-[#fffbeb] border border-[#fef3c7] px-3 py-2 rounded-[8px] text-[12px] font-semibold text-[#b45309]">
            <FlaskConical className="w-4 h-4 text-[#d97706]" />
            <span>{HIPOTETIS}</span>
            <span className="w-2 h-2 rounded-full bg-[#d97706] animate-pulse" />
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-[#c4c6cd]/50 rounded-[8px] text-[13px] font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-[#5c5e64]" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleSaveScenario}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#b80035] rounded-[8px] text-[13px] font-semibold text-white hover:bg-[#9f002d] transition-colors shadow-sm"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Simpan skenario</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-3.5 bg-[#ecfdf5] border border-[#a7f3d0] rounded-[10px] text-[13px] text-[#065f46] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>{notification}</span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Tercatat di log
          </span>
        </div>
      )}

      {/* 3. 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Selected Abatement */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Pengurangan emisi ({SATUAN})
            </div>
            <div className="text-[30px] font-bold text-[#00675e] tracking-[-0.9px] leading-tight mt-1">
              {fmtAngka(hasil.pengurangan)}
            </div>
          </div>
          <div className="text-[12px] text-[#00675e] font-semibold">
            {HIPOTETIS} · Scope 2 −{persen(persenScope2)}, Scope 1 −{persen(persenScope1)}
          </div>
        </div>

        {/* Card 2: Biaya implementasi */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Emisi sesudah ({SATUAN})
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              {fmtAngka(hasil.emisiSesudah)}
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            Baseline FY {TAHUN_BASELINE}: {fmtAngka(BASELINE.total)} · {SUMBER_BASELINE}
          </div>
        </div>

        {/* Card 3: Net Annual OPEX Benefit */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Sisa gap terhadap level target
            </div>
            <div className="text-[30px] font-bold text-[#00675e] tracking-[-0.9px] leading-tight mt-1">
              {fmtAngka(hasil.sisaGap)}
            </div>
          </div>
          <div className="text-[12px] text-[#00675e] font-semibold">
            Level target {fmtAngka(BASELINE.target)} ({STATUS_TARGET}); gap awal {fmtAngka(GAP_AWAL)}
          </div>
        </div>

        {/* Card 4: Blended Abatement Cost */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Gap tertutup
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              {fmtPersen(hasil.persenGapTertutup, 1, false)}
            </div>
          </div>
          <div className="text-[12px] text-[#00675e] font-semibold">
            Biaya per {SATUAN}: {hasil.biayaPerTon === null ? D : fmtAngka(hasil.biayaPerTon)}
          </div>
        </div>
      </div>

      {/* 4. Sensitivity Simulation Parameters */}
      <div className="bg-white p-5 rounded-[12px] border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#b80035]" />
            <h3 className="text-[14px] font-bold text-[#0b1c30]">
              Parameter skenario
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#5c5e64]">
            {HIPOTETIS}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slider biaya */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[#0b1c30]">
                Pengurangan Scope 2:
              </span>
              <span className="font-bold text-[#b80035] bg-[#fff1f2] px-2.5 py-0.5 rounded border border-[#ffdad6]">
                −{persen(persenScope2)}
              </span>
            </div>
            <input
              type="range"
              min={RENTANG.min}
              max={RENTANG.max}
              step={RENTANG.langkah}
              value={persenScope2}
              aria-label="Pengurangan Scope 2 (%)"
              onChange={(e) => setPersenScope2(Number(e.target.value))}
              className="w-full accent-[#b80035] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#5c5e64]">
              <span>{persen(PENANDA[0])}</span>
              <span>{persen(PENANDA[1])}</span>
              <span>{persen(PENANDA[2])}</span>
            </div>
          </div>

          {/* Tariff Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-[#0b1c30]">
                Pengurangan Scope 1:
              </span>
              <span className="font-bold text-[#00675e] bg-[#ecfdf5] px-2.5 py-0.5 rounded border border-[#a7f3d0]">
                −{persen(persenScope1)}
              </span>
            </div>
            <input
              type="range"
              min={RENTANG.min}
              max={RENTANG.max}
              step={RENTANG.langkah}
              value={persenScope1}
              aria-label="Pengurangan Scope 1 (%)"
              onChange={(e) => setPersenScope1(Number(e.target.value))}
              className="w-full accent-[#00675e] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#5c5e64]">
              <span>{persen(PENANDA[0])}</span>
              <span>{persen(PENANDA[1])}</span>
              <span>{persen(PENANDA[2])}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Candidate Interventions Cards Grid (2x2) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
            Kartu skenario
          </h3>
          <span className="text-[12px] text-[#5c5e64]">
            Urutan berdasarkan pengurangan emisi hipotetis. Bukan rekomendasi.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt) => {
            const isOptSelected = opt.selected;
            const biaya = opt.implementationCostIdr === null ? D : fmtAngka(opt.implementationCostIdr);
            const waktu = opt.implementationMonths === null ? D : fmtAngka(opt.implementationMonths);

            return (
              <div
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={`p-5 rounded-[12px] border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isOptSelected
                    ? "bg-white border-[#b80035] shadow-md ring-1 ring-[#b80035]/20"
                    : "bg-[#f8f9ff] border-[#e5eeff] opacity-70 hover:opacity-100 hover:bg-white"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isOptSelected ? (
                          <div className="w-5 h-5 rounded-[4px] bg-[#b80035] text-white flex items-center justify-center">
                            <CheckSquare className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-[4px] border-2 border-[#c4c6cd] bg-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-[#5c5e64]">
                            {opt.code}
                          </span>
                          <span className="text-[11px] font-semibold text-[#0b1c30] bg-[#eff4ff] px-2 py-0.5 rounded">
                            {opt.tag}
                          </span>
                        </div>
                        <h4 className="text-[15px] font-bold text-[#0b1c30] mt-1">
                          {opt.name}
                        </h4>
                      </div>
                    </div>

                    <span
                      className={`text-[12px] font-bold ${
                        (opt.costEffectiveness || 0) < 0
                          ? "text-[#15803d]"
                          : (opt.costEffectiveness || 0) > 350
                          ? "text-[#b80035]"
                          : "text-[#0b1c30]"
                      }`}
                    >
                      {opt.costEffectiveness === null ? D : `${fmtAngka(opt.costEffectiveness)} / ${SATUAN}`}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#5c5e64] mt-2.5 leading-relaxed pl-8">
                    {opt.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#f1f5f9] grid grid-cols-3 gap-2 text-[11px] pl-8">
                  <div>
                    <span className="text-[#5c5e64] block">Biaya:</span>
                    <strong className="text-[#0b1c30]">
                      {biaya}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#5c5e64] block">Pengurangan:</span>
                    <strong className="text-[#00675e]">
                      {ton(opt.reductionTco2e)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#5c5e64] block">Waktu:</span>
                    <strong className="text-[#0b1c30]">
                      {waktu}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Grafik efektivitas biaya */}
      <CostEffectivenessChart
        options={options}
        onToggleOption={(id) => toggleOption(id)}
      />

      {/* 7. Detailed Interventions Comparison Table */}
      <div className="bg-white rounded-[12px] border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-5 border-b border-[#e5eeff]">
          <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
            Tabel perbandingan
          </h3>
          <p className="text-[12px] text-[#5c5e64] mt-0.5">
            {HIPOTETIS} · diurutkan dari pengurangan terbesar; bukan rekomendasi
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#dce9ff] text-[#5c5e64] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">INTERVENSI</th>
                <th className="py-3 px-4">LABEL</th>
                <th className="py-3 px-4 text-right">PENGURANGAN</th>
                <th className="py-3 px-4 text-right">EMISI SESUDAH</th>
                <th className="py-3 px-4 text-right">SISA GAP</th>
                <th className="py-3 px-4 text-right">BIAYA PER tCO₂e</th>
                <th className="py-3 px-4 text-right">WAKTU</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {options.map((opt) => (
                <tr
                  key={opt.id}
                  className={`hover:bg-[#f8f9ff] transition-colors ${
                    opt.selected ? "bg-[#eff4ff]/30" : ""
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0b1c30]">{opt.name}</div>
                    <div className="text-[11px] text-[#5c5e64] font-mono">{opt.code}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#0b1c30] bg-[#e5eeff] px-2 py-0.5 rounded text-[11px]">
                      {opt.tag}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#00675e]">
                    {fmtAngka(opt.reductionTco2e)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-[#0b1c30]">
                    {fmtAngka(hasilById.get(opt.id)?.emisiSesudah)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-[#00675e]">
                    {fmtAngka(hasilById.get(opt.id)?.sisaGap)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#0b1c30]">
                    {opt.costEffectiveness === null ? D : fmtAngka(opt.costEffectiveness)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#5c5e64]">
                    {opt.implementationMonths === null ? D : fmtAngka(opt.implementationMonths)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleOption(opt.id)}
                      className={`px-3 py-1 rounded-[6px] text-[12px] font-semibold transition-colors ${
                        opt.selected
                          ? "bg-[#b80035] text-white"
                          : "bg-white border border-[#c4c6cd]/50 text-[#0b1c30] hover:bg-gray-50"
                      }`}
                    >
                      {opt.selected ? "Dipilih" : "Pilih"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. Key Calculation Assumptions Card */}
      <div className="bg-[#eff4ff] rounded-[12px] p-5 border border-[#dce9ff] flex items-start gap-4">
        <Info className="w-5 h-5 text-[#00675e] shrink-0 mt-0.5" />
        <div className="space-y-1 text-[12px] text-[#0b1c30]">
          <h4 className="font-bold text-[13px]">Panel asumsi</h4>
          <p className="text-[#5c5e64] leading-relaxed">
            Baseline FY {TAHUN_BASELINE}: <strong>{fmtAngka(BASELINE.total)} {SATUAN}</strong> (Scope 1 {fmtAngka(BASELINE.scope1)}, Scope 2 {fmtAngka(BASELINE.scope2)}; {SUMBER_BASELINE}). Level target:{" "}
            <strong>{fmtAngka(BASELINE.target)} {SATUAN}</strong> ({STATUS_TARGET}). Parameter yang diatur:{" "}
            <strong>Scope 2 −{persen(persenScope2)}, Scope 1 −{persen(persenScope1)}</strong>; biaya dan waktu implementasi belum diisi.
          </p>
        </div>
      </div>
    </div>
  );
}
