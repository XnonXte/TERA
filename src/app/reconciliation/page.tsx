"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ChevronRight,
  FileSpreadsheet,
  Upload,
  ChevronDown,
} from "lucide-react";
import { useSeedStore } from "@/stores/useSeedStore";
import { sumberLaporan } from "@/lib/seed";
import { calculateDifference } from "@/lib/calculations";
import {
  VERSI,
  cariVersi,
  bandingkanVersi,
  variansScope,
  aksiTersedia,
  LABEL_STATUS,
  REVISI,
  TIDAK_DIREVISI,
  hitungJenisCatatan,
} from "@/lib/reconciliation";
import { SEED } from "@/lib/seed";
import { fmtAngka, fmtBertanda, fmtPersen, KOSONG } from "@/lib/format";

export default function ReconciliationPage() {
  const {
    versiA,
    versiB,
    setVersiA,
    setVersiB,
    statusVersi,
    baselineAktif,
    aksiPersetujuan,
    resetSimulasi,
  } = useSeedStore();

  // Nama asli dipertahankan; isinya dari seed.
  const activeBaselineId = versiA;
  const setActiveBaselineId = setVersiA;
  const compareBaselineId = versiB;
  const setCompareBaselineId = setVersiB;

  const [note, setNote] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Tiga versi baseline Scope 1+2 2023 (SR 2023/2024/2025)
  const baselines = VERSI.map((v) => ({
    id: v.versi,
    totalEmissionsTco2e: fmtAngka(v.nilai),
    status: LABEL_STATUS[statusVersi[v.versi]],
    sourceRef: v.sumber,
  }));
  const baseA = baselines.find((x) => x.id === activeBaselineId) || baselines[0];
  const baseB = baselines.find((x) => x.id === compareBaselineId) || baselines[1];

  const va = cariVersi(baseA.id)!;
  const vb = cariVersi(baseB.id)!;
  const diffTotal = bandingkanVersi(va, vb);
  const vs1 = variansScope("Scope 1", baseA.id, baseB.id);
  const vs2 = variansScope("Scope 2", baseA.id, baseB.id);
  const diffScope1 = vs1 ? vs1.beda : { absolute: NaN, percentage: null };
  const diffScope2 = vs2 ? vs2.beda : { absolute: NaN, percentage: null };
  const nilaiScope = (v: typeof vs1, sisi: "a" | "b") => (v ? fmtAngka(v[sisi].nilai) : KOSONG);

  // Alur persetujuan (simulasi) pada versi B
  const statusB = statusVersi[baseB.id];
  const aksi = aksiTersedia(statusB);
  const teksKiri = aksi.includes("tolak") ? "Tolak (simulasi)" : "Reset simulasi";
  const teksKanan = aksi.includes("ajukan")
    ? `Ajukan untuk review (${baseB.id})`
    : aksi.includes("setujui")
    ? `Setujui (simulasi) ${baseB.id}`
    : `${baseB.id}: ${LABEL_STATUS[statusB]}`;
  const kananNonaktif = aksi.length === 0;

  const tampilkan = (hasil: { ok: boolean; pesan: string }) => {
    if (hasil.ok) {
      setSuccessMsg(hasil.pesan);
      setErrorMsg("");
      setNote("");
    } else {
      setErrorMsg(hasil.pesan);
      setSuccessMsg("");
    }
  };

  const handleApprove = () => {
    if (aksi.includes("ajukan")) tampilkan(aksiPersetujuan(baseB.id, "ajukan", note));
    else if (aksi.includes("setujui")) tampilkan(aksiPersetujuan(baseB.id, "setujui", note));
  };

  const handleReject = () => {
    if (aksi.includes("tolak")) {
      tampilkan(aksiPersetujuan(baseB.id, "tolak", note));
    } else {
      resetSimulasi();
      setNote("");
      setErrorMsg("");
      setSuccessMsg("Simulasi direset. Semua versi kembali ke Draft; baseline aktif: belum ada.");
    }
  };

  // Revisi lintas laporan (18 revisi + 7 identik)
  const desimal = (x: number) => (Math.abs(x) < 1 ? 3 : 2);
  const items = [...REVISI, ...TIDAK_DIREVISI].map((r) => {
    const d = calculateDifference(r.nilaiLama, r.nilaiBaru);
    const [lamaLaporan, lamaHlm] = r.sumberLama.split(", ");
    const [baruLaporan, baruHlm] = r.sumberBaru.split(", ");
    const asal = [...SEED.revisi_18, ...SEED.tidak_direvisi_7].find(
      (x) => x.metrik === r.metrik && sumberLaporan(x.laporan_baru, x.hlm_baru) === r.sumberBaru
    );
    return {
      id: r.kunci,
      name: r.metrik,
      description: r.catatanJenis ?? KOSONG,
      scope: r.status,
      vA_emissions: fmtAngka(r.nilaiLama, 3),
      vA_activity: lamaLaporan,
      vA_ef: lamaHlm,
      vB_emissions: fmtAngka(r.nilaiBaru, 3),
      vB_activity: baruLaporan,
      vB_ef: baruHlm,
      diffEmissions: d.absolute,
      diffTeks: fmtBertanda(d.absolute, desimal(d.absolute)),
      diffPercent: r.persen,
      category: r.kodeAlasan,
      evidence: asal?.hlm_catatan ? sumberLaporan(asal.laporan_baru, asal.hlm_catatan) : KOSONG,
    };
  });
  const jenis = hitungJenisCatatan(REVISI);
  const jumlahRevisi = REVISI.length;

  const filteredItems = useMemo(() => {
    if (activeTab === "All") return items.filter((x) => x.scope === "Revisi");
    if (activeTab === "Boundary") return items;
    if (activeTab === "Factors") return items.filter((x) => x.description === "Catatan umum");
    if (activeTab === "Activity") return items.filter((x) => x.description === "Tidak ada catatan");
    return items;
  }, [items, activeTab]);

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-[12px] text-[#5c5e64]">
        <Link href="/overview" className="hover:text-[#0b1c30] transition-colors">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5c5e64]/60" />
        <span className="font-semibold text-[#0b1c30]">Baseline Reconciliation</span>
      </nav>

      {/* 2. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#0b1c30] tracking-[-0.8px] leading-[40px]">
            Baseline Reconciliation
          </h1>
          <p className="text-[14px] text-[#5c5e64] mt-1 leading-[20px]">
            Tiga laporan menuliskan angka berbeda untuk baseline Scope 1+2 tahun 2023.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#eff4ff] px-4 py-2.5 rounded-[8px] border border-[#dce9ff] shrink-0">
          <Lock className="w-4 h-4 text-[#00675e]" />
          <div className="text-[12px] font-medium text-[#5c5e64]">
            <span>Baseline aktif (simulasi): </span>
            <strong className="text-[#0b1c30]">{baselineAktif ?? "Belum ada"}</strong>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#00675e] ml-1" />
        </div>
      </div>

      {/* 3. Version Comparison Card (Side by Side) */}
      <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Baseline A Container (5 cols) */}
          <div className="md:col-span-5 bg-[#eff4ff] rounded-[10px] p-4 border border-[#dce9ff]">
            <div className="text-[11px] font-bold text-[#5c5e64] uppercase tracking-wider mb-2">
              Versi A (pembanding)
            </div>
            <div className="relative">
              <select
                value={activeBaselineId}
                onChange={(e) => setActiveBaselineId(e.target.value)}
                className="w-full appearance-none bg-white border border-[#c4c6cd]/50 rounded-[8px] px-3.5 py-2.5 text-[13px] font-bold text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 cursor-pointer"
              >
                {baselines.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} — {b.totalEmissionsTco2e} tCO₂e ({b.status.toUpperCase()})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#5c5e64] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#5c5e64] mt-2">
              Sumber: {baseA.sourceRef}
            </p>
          </div>

          {/* VS Divider (1 col) */}
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-[#0b1c30] text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>

          {/* Baseline B Container (5 cols) */}
          <div className="md:col-span-5 bg-[#eff4ff] rounded-[10px] p-4 border border-[#dce9ff]">
            <div className="text-[11px] font-bold text-[#5c5e64] uppercase tracking-wider mb-2">
              Versi B (dibandingkan)
            </div>
            <div className="relative">
              <select
                value={compareBaselineId}
                onChange={(e) => setCompareBaselineId(e.target.value)}
                className="w-full appearance-none bg-white border border-[#c4c6cd]/50 rounded-[8px] px-3.5 py-2.5 text-[13px] font-bold text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 cursor-pointer"
              >
                {baselines.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.id} — {b.totalEmissionsTco2e} tCO₂e ({b.status.toUpperCase()})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#5c5e64] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#5c5e64] mt-2">
              Sumber: {baseB.sourceRef}
            </p>
          </div>
        </div>

      </div>

      {/* 4. 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Scope 1 Variance */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Selisih Scope 1 (B − A)
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              {fmtBertanda(diffScope1.absolute)}
              {" "}tCO₂e
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            <span className="font-bold text-[#b80035]">
              {fmtPersen(diffScope1.percentage)}
            </span>{" "}
            terhadap A ({nilaiScope(vs1, "a")} → {nilaiScope(vs1, "b")} tCO₂e)
          </div>
        </div>

        {/* Card 2: Scope 2 Variance */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Selisih Scope 2 (B − A)
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              {fmtBertanda(diffScope2.absolute)}
              {" "}tCO₂e
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            <span className="font-bold text-[#b80035]">
              {fmtPersen(diffScope2.percentage)}
            </span>{" "}
            terhadap A ({nilaiScope(vs2, "a")} → {nilaiScope(vs2, "b")} tCO₂e)
          </div>
        </div>

        {/* Card 3: Net Recalculation Delta */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Selisih Scope 1+2 (B − A)
            </div>
            <div className="text-[30px] font-bold text-[#b80035] tracking-[-0.9px] leading-tight mt-1">
              {fmtBertanda(diffTotal.absolute)} tCO₂e
            </div>
          </div>
          <div className="text-[12px] text-[#b80035] font-semibold">
            {fmtPersen(diffTotal.percentage)} terhadap A
          </div>
        </div>

        {/* Card 4: Audit Requirement */}
        <div className="bg-white rounded-[12px] p-5 border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] flex flex-col justify-between h-[150px]">
          <div>
            <div className="text-[13px] font-medium text-[#5c5e64] tracking-[0.11px]">
              Kode alasan
            </div>
            <div className="text-[30px] font-bold text-[#0b1c30] tracking-[-0.9px] leading-tight mt-1">
              Unresolved
            </div>
          </div>
          <div className="text-[12px] text-[#5c5e64]">
            {jumlahRevisi} revisi lintas laporan
          </div>
        </div>
      </div>

      {/* 5. Material Variances & Reconciled Rows Table */}
      <div className="bg-white rounded-[12px] border border-[#e5eeff] shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Table Header with Tabs */}
        <div className="p-5 border-b border-[#e5eeff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
              Revisi lintas laporan
            </h3>
            <p className="text-[12px] text-[#5c5e64] mt-0.5">
              {jumlahRevisi} revisi: {jenis.umum} catatan umum, {jenis.tidakAda} tanpa catatan, {jenis.spesifik} catatan spesifik
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#eff4ff] p-1 rounded-[8px] border border-[#dce9ff] text-[12px]">
            <button
              type="button"
              onClick={() => setActiveTab("All")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                activeTab === "All"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Hanya revisi ({jumlahRevisi})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Boundary")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                activeTab === "Boundary"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Semua ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Factors")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                activeTab === "Factors"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Catatan umum ({jenis.umum})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Activity")}
              className={`px-3 py-1.5 rounded-[6px] font-semibold transition-colors ${
                activeTab === "Activity"
                  ? "bg-[#b80035] text-white shadow-sm"
                  : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Tidak ada catatan ({jenis.tidakAda})
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#dce9ff] text-[#5c5e64] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">METRIK</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">NILAI LAMA</th>
                <th className="py-3 px-4">NILAI BARU</th>
                <th className="py-3 px-4 text-right">Δ</th>
                <th className="py-3 px-4 text-right">% SELISIH</th>
                <th className="py-3 px-4">KODE ALASAN</th>
                <th className="py-3 px-4">SUMBER CATATAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8f9ff] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0b1c30]">{item.name}</div>
                    <div className="text-[11px] text-[#5c5e64]">{item.description}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#0b1c30] bg-[#e5eeff] px-2 py-0.5 rounded text-[11px]">
                      {item.scope}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#0b1c30]">
                      {item.vA_emissions}
                    </div>
                    <div className="text-[11px] text-[#5c5e64]">
                      {item.vA_activity} • {item.vA_ef}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#0b1c30]">
                      {item.vB_emissions}
                    </div>
                    <div className="text-[11px] text-[#5c5e64]">
                      {item.vB_activity} • {item.vB_ef}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`font-bold ${
                        item.diffEmissions > 0
                          ? "text-[#b80035]"
                          : item.diffEmissions < 0
                          ? "text-[#00675e]"
                          : "text-[#5c5e64]"
                      }`}
                    >
                      {item.diffTeks}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`font-bold text-[11px] px-2 py-0.5 rounded-full ${
                        item.scope === "Revisi"
                          ? "bg-[#ffdad6] text-[#b80035]"
                          : item.diffPercent > 0 && item.scope !== "Identik"
                          ? "bg-[#eff4ff] text-[#0b1c30]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {fmtPersen(item.diffPercent)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-semibold text-[#0b1c30] bg-[#eff4ff] px-2.5 py-1 rounded-[6px] border border-[#dce9ff]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-[#5c5e64] font-mono">
                    {item.evidence}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Reviewer Sign-off Form */}
      <div className="bg-white rounded-[12px] border border-[#e5eeff] p-6 shadow-[0px_4px_2.5px_rgba(0,0,0,0.03)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#b80035]" />
            <h3 className="text-[16px] font-bold text-[#0b1c30] tracking-[-0.16px]">
              Persetujuan (simulasi)
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#5c5e64]">
            Versi B: {LABEL_STATUS[statusB]} · Baseline aktif: {baselineAktif ?? "Belum ada"}
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 bg-[#fff1f2] border border-[#ffdad6] rounded-[8px] text-[13px] text-[#93000a] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#b80035]" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-[8px] text-[13px] text-[#065f46] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669]" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-bold text-[#0b1c30] block mb-1.5">
              Kode alasan
            </label>
            <div className="relative">
              <select
                value="Unresolved"
                disabled
                title="Kode alasan tetap Unresolved"
                onChange={() => undefined}
                className="w-full appearance-none bg-[#eff4ff] border border-[#dce9ff] rounded-[8px] p-2.5 text-[13px] font-medium text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 cursor-pointer"
              >
                <option value="Unresolved">Unresolved (tetap)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#5c5e64] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-bold text-[#0b1c30] block mb-1.5">
              Bukti pendukung
            </label>
            <div className="flex items-center gap-3 p-2 bg-[#eff4ff] border border-[#dce9ff] rounded-[8px]">
              <FileSpreadsheet className="w-5 h-5 text-[#00675e] shrink-0 ml-1" />
              <div className="flex-1 min-w-0 text-[12px]">
                <p className="font-semibold text-[#0b1c30] truncate">
                  —
                </p>
                <p className="text-[11px] text-[#5c5e64]">Spesifikasi</p>
              </div>
              <button
                type="button"
                disabled
                title="Spesifikasi"
                className="px-2.5 py-1 text-[11px] font-semibold text-[#0b1c30] bg-white rounded border border-[#c4c6cd]/40 hover:bg-gray-50"
              >
                Ganti
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-[12px] font-bold text-[#0b1c30] block mb-1.5">
            Alasan perubahan * (wajib)
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
            placeholder="Tulis alasan perubahan untuk versi B"
            className="w-full bg-[#eff4ff] border border-[#dce9ff] rounded-[8px] p-3 text-[13px] text-[#0b1c30] placeholder:text-[#5c5e64] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 resize-none"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#f1f5f9]">
          <button
            type="button"
            onClick={handleReject}
            className="px-5 py-2.5 rounded-[8px] bg-[#fff1f2] border border-[#ffdad6] text-[#b80035] hover:bg-[#ffe4e6] font-semibold text-[13px] transition-colors"
          >
            {teksKiri}
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={kananNonaktif}
            className="px-6 py-2.5 rounded-[8px] bg-[#b80035] hover:bg-[#9f002d] text-white font-semibold text-[13px] shadow transition-colors"
          >
            {teksKanan}
          </button>
        </div>
      </div>
    </div>
  );
}
