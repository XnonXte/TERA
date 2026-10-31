"use client";

import React, { useMemo, useState } from "react";
import { ArrowLeftRight, ShieldCheck, AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTeraStore, HasilAksi } from "@/stores/useTeraStore";
import {
  VERSI,
  cariVersi,
  bandingkanVersi,
  aksiTersedia,
  variansScope,
  LABEL_STATUS,
  AksiSimulasi,
  REVISI,
  TIDAK_DIREVISI,
  hitungJenisCatatan,
} from "@/lib/reconciliation";
import { fmtAngka, fmtBertanda, fmtPersen, KOSONG } from "@/lib/format";

const LABEL_AKSI: Record<AksiSimulasi, string> = {
  ajukan: "Ajukan untuk review",
  setujui: "Setujui (simulasi)",
  tolak: "Tolak (simulasi)",
};

export default function ReconciliationPage() {
  const {
    versiA,
    versiB,
    setVersiA,
    setVersiB,
    tukarVersi,
    statusVersi,
    alasanVersi,
    baselineAktif,
    aksiPersetujuan,
    resetSimulasi,
  } = useTeraStore();

  const [alasan, setAlasan] = useState("");
  const [umpanBalik, setUmpanBalik] = useState<HasilAksi | null>(null);
  const [tampilSemua, setTampilSemua] = useState(false);

  const a = cariVersi(versiA);
  const b = cariVersi(versiB);
  const beda = a && b ? bandingkanVersi(a, b) : null;
  const vScope1 = variansScope("Scope 1", versiA, versiB);
  const vScope2 = variansScope("Scope 2", versiA, versiB);

  const statusB = statusVersi[versiB];
  const aksi = statusB ? aksiTersedia(statusB) : [];

  const baris = useMemo(() => (tampilSemua ? [...REVISI, ...TIDAK_DIREVISI] : REVISI), [tampilSemua]);
  const jenis = hitungJenisCatatan(REVISI);

  const jalankan = (x: AksiSimulasi) => {
    const hasil = aksiPersetujuan(versiB, x, alasan);
    setUmpanBalik(hasil);
    if (hasil.ok) setAlasan("");
  };

  const kartuVarians = (label: string, v: ReturnType<typeof variansScope>) =>
    v ? (
      <KpiCard
        label={label}
        value={fmtBertanda(v.beda.absolute)}
        unit="tCO2e"
        delta={{ value: fmtPersen(v.beda.percentage), isPositiveGood: false, label: "terhadap A" }}
        subtitle={`${fmtAngka(v.a.nilai)} → ${fmtAngka(v.b.nilai)} tCO2e`}
        footnote={`Sumber: ${v.a.sumber} → ${v.b.sumber}`}
      />
    ) : (
      <KpiCard label={label} value={KOSONG} unit="tCO2e" subtitle="Nilai tidak ada di seed untuk kedua versi" />
    );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        badge="BASELINE RECONCILIATION"
        title="Versi baseline Scope 1+2 tahun 2023"
        description="Tiga laporan menuliskan angka berbeda untuk baseline yang sama. Semua versi tetap terlihat, termasuk yang tidak aktif."
      />

      {/* Baseline Version Selection Card */}
      <div className="bg-white p-5 rounded-xl border border-[#e5eeff] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {/* Baseline A */}
            <div className="bg-[#eff4ff] p-3.5 rounded-lg border border-[#dce9ff]">
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider mb-1">
                Baseline A (pembanding)
              </div>
              <select
                aria-label="Baseline A"
                value={versiA}
                onChange={(e) => setVersiA(e.target.value)}
                className="w-full bg-white border border-[#dce9ff] rounded px-3 py-1.5 text-[13px] font-bold text-[#0b1c30] focus:outline-none"
              >
                {VERSI.map((v) => (
                  <option key={v.versi} value={v.versi}>
                    {v.versi} ({fmtAngka(v.nilai)} tCO2e) - {LABEL_STATUS[statusVersi[v.versi]].toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-[#5c5e64] mt-1.5">Sumber: {a?.sumber ?? KOSONG}</div>
            </div>

            {/* Baseline B */}
            <div className="bg-[#eff4ff] p-3.5 rounded-lg border border-[#dce9ff]">
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider mb-1">
                Baseline B (dibandingkan)
              </div>
              <select
                aria-label="Baseline B"
                value={versiB}
                onChange={(e) => setVersiB(e.target.value)}
                className="w-full bg-white border border-[#dce9ff] rounded px-3 py-1.5 text-[13px] font-bold text-[#0b1c30] focus:outline-none"
              >
                {VERSI.map((v) => (
                  <option key={v.versi} value={v.versi}>
                    {v.versi} ({fmtAngka(v.nilai)} tCO2e) - {LABEL_STATUS[statusVersi[v.versi]].toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-[#5c5e64] mt-1.5">Sumber: {b?.sumber ?? KOSONG}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={tukarVersi}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#c4c6cd]/50 rounded-lg text-[13px] font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-sm shrink-0"
          >
            <ArrowLeftRight className="w-4 h-4 text-[#5c5e64]" />
            <span>Tukar A ↔ B</span>
          </button>
        </div>
      </div>

      {/* Variance KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kartuVarians("Selisih Scope 1 (B − A)", vScope1)}
        {kartuVarians("Selisih Scope 2 (B − A)", vScope2)}
        <KpiCard
          label="Selisih Scope 1+2 (B − A)"
          value={beda ? fmtBertanda(beda.absolute) : KOSONG}
          unit="tCO2e"
          delta={beda ? { value: fmtPersen(beda.percentage), isPositiveGood: false, label: "terhadap A" } : undefined}
          subtitle={a && b ? `${fmtAngka(a.nilai)} → ${fmtAngka(b.nilai)} tCO2e` : undefined}
          footnote={a && b ? `Sumber: ${a.sumber} → ${b.sumber}` : undefined}
        />
      </div>

      {/* Cross-report Revision Table */}
      <div className="bg-white rounded-xl border border-[#e5eeff] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e5eeff] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-[14px] font-bold text-[#0b1c30]">Revisi lintas laporan</h3>
            <p className="text-[12px] text-[#5c5e64]">
              {REVISI.length} revisi: {jenis.umum} catatan umum, {jenis.tidakAda} tanpa catatan, {jenis.spesifik} catatan
              spesifik.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-full text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setTampilSemua(false)}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                !tampilSemua ? "bg-white text-[#0b1c30] shadow-sm" : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Hanya revisi ({REVISI.length})
            </button>
            <button
              type="button"
              onClick={() => setTampilSemua(true)}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                tampilSemua ? "bg-white text-[#0b1c30] shadow-sm" : "text-[#5c5e64] hover:text-[#0b1c30]"
              }`}
            >
              Semua ({REVISI.length + TIDAK_DIREVISI.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#dce9ff] text-[#5c5e64] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Metrik</th>
                <th className="py-3 px-4">Nilai lama</th>
                <th className="py-3 px-4">Nilai baru</th>
                <th className="py-3 px-4 text-right">% Selisih</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Catatan laporan</th>
                <th className="py-3 px-4">Kode alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {baris.map((r) => (
                <tr key={r.kunci} className="hover:bg-[#f8f9ff] transition-colors align-top">
                  <td className="py-3.5 px-4 min-w-[150px]">
                    <div className="font-bold text-[#0b1c30]">{r.metrik}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-[#0b1c30]">{fmtAngka(r.nilaiLama, 3)}</div>
                    <div className="text-[11px] text-[#5c5e64]">{r.sumberLama}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-[#0b1c30]">{fmtAngka(r.nilaiBaru, 3)}</div>
                    <div className="text-[11px] text-[#5c5e64]">{r.sumberBaru}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span
                      className={`font-bold text-[12px] px-2 py-0.5 rounded ${
                        r.status === "Revisi" ? "bg-[#fff1f2] text-[#b80035]" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {fmtPersen(r.persen)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#0b1c30] bg-[#e5eeff] px-2 py-0.5 rounded text-[11px]">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 min-w-[280px] max-w-md">
                    {r.catatanJenis && (
                      <span className="text-[12px] font-medium text-[#0b1c30] bg-[#eff4ff] px-2 py-1 rounded border border-[#dce9ff]">
                        {r.catatanJenis}
                      </span>
                    )}
                    {r.catatanLaporan && <div className="text-[11px] text-[#5c5e64] mt-1.5">{r.catatanLaporan}</div>}
                    {r.catatanAnalis && (
                      <div className="text-[11px] text-[#5c5e64] mt-1">Catatan analis: {r.catatanAnalis}</div>
                    )}
                    {!r.catatanJenis && !r.catatanLaporan && <span className="text-[#5c5e64]">{KOSONG}</span>}
                  </td>
                  <td className="py-3.5 px-4 text-[12px] font-semibold text-[#0b1c30]">{r.kodeAlasan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval (simulation) Box */}
      <div className="bg-white rounded-xl border border-[#e5eeff] p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#b80035]" />
            <h3 className="text-[16px] font-bold text-[#0b1c30]">Persetujuan (simulasi)</h3>
          </div>
        </div>

        <p className="text-[13px] text-[#0b1c30]">
          Alur: Draft → Pending Review → Approved/Rejected. Aksi berlaku untuk Baseline B (<strong>{versiB}</strong>,
          status{" "}
          <StatusBadge
            status={statusB === "draft" ? "draft" : statusB}
            label={LABEL_STATUS[statusB]}
            size="sm"
            showIcon={statusB !== "draft"}
          />
          ). Baseline aktif (simulasi): <strong>{baselineAktif ?? "Belum ada"}</strong>.
        </p>

        {umpanBalik && !umpanBalik.ok && (
          <div role="status" className="p-3 bg-[#fff1f2] border border-[#ffdad6] rounded-lg text-[13px] text-[#93000a] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#b80035]" />
            <span>{umpanBalik.pesan}</span>
          </div>
        )}
        {umpanBalik && umpanBalik.ok && (
          <div role="status" className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-lg text-[13px] text-[#065f46] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669]" />
            <span>{umpanBalik.pesan}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-[12px] font-semibold text-[#0b1c30] block mb-1">Kode alasan</div>
            <div className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-lg p-2.5 text-[13px] text-[#0b1c30]">
              Unresolved (tetap)
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="alasan-perubahan" className="text-[12px] font-semibold text-[#0b1c30] block mb-1">
              Alasan perubahan * (wajib)
            </label>
            <input
              id="alasan-perubahan"
              type="text"
              value={alasan}
              disabled={aksi.length === 0}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Tulis alasan perubahan untuk versi B"
              className="w-full bg-[#f8f9ff] border border-[#dce9ff] rounded-lg p-2.5 text-[13px] text-[#0b1c30] placeholder:text-[#5c5e64] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              resetSimulasi();
              setAlasan("");
              setUmpanBalik({ ok: true, pesan: "Simulasi direset. Semua versi kembali ke Draft; baseline aktif: belum ada." });
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30] font-semibold text-[13px] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset simulasi
          </button>

          <div className="flex items-center gap-3">
            {aksi.length === 0 && (
              <span className="text-[12px] text-[#5c5e64]">
                Versi B sudah {LABEL_STATUS[statusB]}. Pilih versi lain atau reset simulasi.
              </span>
            )}
            {aksi.includes("tolak") && (
              <button
                type="button"
                onClick={() => jalankan("tolak")}
                className="px-5 py-2.5 rounded-lg bg-[#fff1f2] border border-[#ffdad6] text-[#b80035] hover:bg-[#ffe4e6] font-semibold text-[13px] transition-colors"
              >
                {LABEL_AKSI.tolak}
              </button>
            )}
            {aksi.includes("ajukan") && (
              <button
                type="button"
                onClick={() => jalankan("ajukan")}
                className="px-6 py-2.5 rounded-lg bg-[#b80035] hover:bg-[#9f002d] text-white font-semibold text-[13px] shadow transition-colors"
              >
                {LABEL_AKSI.ajukan} ({versiB})
              </button>
            )}
            {aksi.includes("setujui") && (
              <button
                type="button"
                onClick={() => jalankan("setujui")}
                className="px-6 py-2.5 rounded-lg bg-[#b80035] hover:bg-[#9f002d] text-white font-semibold text-[13px] shadow transition-colors"
              >
                {LABEL_AKSI.setujui} ({versiB})
              </button>
            )}
          </div>
        </div>

        {/* All versions stay visible */}
        <div className="overflow-x-auto rounded-lg border border-[#e5eeff]">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#dce9ff] text-[#5c5e64] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Versi</th>
                <th className="py-3 px-4">Scope 1+2 2023</th>
                <th className="py-3 px-4">Vs versi sebelumnya</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Alasan perubahan</th>
                <th className="py-3 px-4">Kode alasan</th>
                <th className="py-3 px-4">Baseline aktif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {VERSI.map((v) => {
                const st = statusVersi[v.versi];
                return (
                  <tr key={v.versi} className={`transition-colors align-top ${baselineAktif === v.versi ? "bg-[#ecfdf5]" : "hover:bg-[#f8f9ff]"}`}>
                    <td className="py-3.5 px-4 font-bold text-[#0b1c30]">{v.versi}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-[#0b1c30]">{fmtAngka(v.nilai)} tCO2e</div>
                      <div className="text-[11px] text-[#5c5e64]">{v.sumber}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {v.selisih_absolut_vs_sebelumnya != null ? (
                        <span className="font-semibold text-[#0b1c30]">
                          {fmtBertanda(v.selisih_absolut_vs_sebelumnya)} ({fmtPersen(v.selisih_pct_vs_sebelumnya)})
                        </span>
                      ) : (
                        KOSONG
                      )}
                      {v.catatan_laporan && <div className="text-[11px] text-[#5c5e64] mt-1 whitespace-normal max-w-xs">{v.catatan_laporan}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={st} label={LABEL_STATUS[st]} size="sm" showIcon={st !== "draft"} />
                    </td>
                    <td className="py-3.5 px-4 text-[12px] text-[#0b1c30]">{alasanVersi[v.versi] ?? KOSONG}</td>
                    <td className="py-3.5 px-4 text-[12px] font-semibold text-[#0b1c30]">{v.kode_alasan ?? KOSONG}</td>
                    <td className="py-3.5 px-4 text-[12px] text-[#0b1c30]">
                      {baselineAktif === v.versi ? "Ya (simulasi)" : "Tidak"}
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
