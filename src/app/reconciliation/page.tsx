"use client";

import React, { useMemo, useState } from "react";
import { ArrowLeftRight, RotateCcw, Info } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { useTeraStore, HasilAksi } from "@/stores/useTeraStore";
import {
  VERSI,
  cariVersi,
  bandingkanVersi,
  aksiTersedia,
  LABEL_STATUS,
  StatusSimulasi,
  AksiSimulasi,
  REVISI,
  TIDAK_DIREVISI,
  hitungJenisCatatan,
} from "@/lib/reconciliation";
import { fmtAngka, fmtBertanda, fmtPersen, KOSONG } from "@/lib/format";

const TEKS_SIMULASI =
  "Simulasi. Persetujuan disimulasikan di browser ini, tanpa login dan tanpa pemisahan peran. Approved ≠ diaudit independen.";

const WARNA_STATUS: Record<StatusSimulasi, string> = {
  draft: "bg-[#f1f5f9] text-[#334155] border-[#e2e8f0]",
  pending_review: "bg-[#fffbeb] text-[#92400e] border-[#fde68a]",
  approved: "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]",
  rejected: "bg-[#fff1f2] text-[#9f1239] border-[#ffdad6]",
};

const LABEL_AKSI: Record<AksiSimulasi, string> = {
  ajukan: "Ajukan untuk review",
  setujui: "Setujui (simulasi)",
  tolak: "Tolak (simulasi)",
};

function BadgeStatus({ status }: { status: StatusSimulasi }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full border text-[11px] font-semibold ${WARNA_STATUS[status]}`}>
      {LABEL_STATUS[status]}
    </span>
  );
}

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

  const statusB = statusVersi[versiB];
  const aksi = statusB ? aksiTersedia(statusB) : [];

  const baris = useMemo(() => (tampilSemua ? [...REVISI, ...TIDAK_DIREVISI] : REVISI), [tampilSemua]);
  const jenis = hitungJenisCatatan(REVISI);

  const jalankan = (x: AksiSimulasi) => {
    const hasil = aksiPersetujuan(versiB, x, alasan);
    setUmpanBalik(hasil);
    if (hasil.ok) setAlasan("");
  };

  const sel =
    "h-9 px-2.5 text-[13px] bg-white border border-[#c4c6cd]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b80035]/20";

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Baseline Reconciliation"
        title="Versi baseline Scope 1+2 tahun 2023"
        description="Tiga laporan menuliskan angka berbeda untuk baseline yang sama. Semua versi tetap terlihat, termasuk yang tidak aktif."
      />

      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 text-[13px] text-[#78350f] flex gap-2">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>{TEKS_SIMULASI}</span>
      </div>

      {/* Tiga versi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {VERSI.map((v) => (
          <div
            key={v.versi}
            className={`bg-white rounded-xl border p-4 shadow-sm space-y-2 ${
              baselineAktif === v.versi ? "border-[#059669] ring-1 ring-[#059669]" : "border-[#e5eeff]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="font-bold text-[#0b1c30]">{v.versi}</div>
              <BadgeStatus status={statusVersi[v.versi]} />
            </div>
            <div className="text-[22px] font-bold text-[#0b1c30]">
              {fmtAngka(v.nilai)} <span className="text-[12px] font-medium text-[#5c5e64]">tCO2e</span>
            </div>
            <div className="text-[12px] text-[#5c5e64]">Sumber: {v.sumber}</div>
            <div className="text-[12px]">
              Vs versi sebelumnya:{" "}
              {v.selisih_absolut_vs_sebelumnya != null ? (
                <strong>
                  {fmtBertanda(v.selisih_absolut_vs_sebelumnya)} ({fmtPersen(v.selisih_pct_vs_sebelumnya)})
                </strong>
              ) : (
                KOSONG
              )}
            </div>
            <div className="text-[12px]">
              Kode alasan: <strong>{v.kode_alasan ?? KOSONG}</strong>
            </div>
            {v.catatan_laporan && <div className="text-[12px] text-[#5c5e64]">{v.catatan_laporan}</div>}
            {baselineAktif === v.versi && (
              <div className="text-[12px] font-semibold text-[#065f46]">Baseline aktif (simulasi)</div>
            )}
          </div>
        ))}
      </div>

      {/* Bandingkan dua versi */}
      <div className="bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm space-y-4">
        <h2 className="text-[16px] font-bold text-[#0b1c30]">Bandingkan dua versi</h2>
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-[12px] text-[#5c5e64] space-y-1">
            <div>A (pembanding)</div>
            <select className={sel} value={versiA} onChange={(e) => setVersiA(e.target.value)}>
              {VERSI.map((v) => (
                <option key={v.versi} value={v.versi}>
                  {v.versi}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={tukarVersi}
            className="h-9 px-3 rounded-lg border border-[#c4c6cd]/60 bg-white text-[13px] inline-flex items-center gap-1.5 hover:bg-[#eff4ff]"
          >
            <ArrowLeftRight className="w-4 h-4" /> Tukar
          </button>
          <label className="text-[12px] text-[#5c5e64] space-y-1">
            <div>B (dibandingkan)</div>
            <select className={sel} value={versiB} onChange={(e) => setVersiB(e.target.value)}>
              {VERSI.map((v) => (
                <option key={v.versi} value={v.versi}>
                  {v.versi}
                </option>
              ))}
            </select>
          </label>
        </div>
        {a && b && beda && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[13px]">
            <div className="p-3 rounded-lg bg-[#eff4ff]">
              <div className="text-[#5c5e64]">A · {a.versi}</div>
              <div className="font-bold text-[16px]">{fmtAngka(a.nilai)} tCO2e</div>
              <div className="text-[12px] text-[#5c5e64]">{a.sumber}</div>
            </div>
            <div className="p-3 rounded-lg bg-[#eff4ff]">
              <div className="text-[#5c5e64]">B · {b.versi}</div>
              <div className="font-bold text-[16px]">{fmtAngka(b.nilai)} tCO2e</div>
              <div className="text-[12px] text-[#5c5e64]">{b.sumber}</div>
            </div>
            <div className="p-3 rounded-lg bg-[#0b1c30] text-white">
              <div className="text-[#c4c6cd]">Selisih B − A</div>
              <div className="font-bold text-[16px]">{fmtBertanda(beda.absolute)} tCO2e</div>
              <div className="text-[12px] text-[#c4c6cd]">{fmtPersen(beda.percentage)} terhadap A</div>
            </div>
          </div>
        )}
      </div>

      {/* Persetujuan (simulasi) */}
      <div className="bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[16px] font-bold text-[#0b1c30]">Persetujuan (simulasi)</h2>
          <button
            type="button"
            onClick={() => {
              resetSimulasi();
              setAlasan("");
              setUmpanBalik({ ok: true, pesan: "Simulasi direset. Semua versi kembali ke Draft; baseline aktif: belum ada." });
            }}
            className="h-9 px-3 rounded-lg border border-[#c4c6cd]/60 bg-white text-[13px] inline-flex items-center gap-1.5 hover:bg-[#eff4ff]"
          >
            <RotateCcw className="w-4 h-4" /> Reset simulasi
          </button>
        </div>
        <p className="text-[12px] text-[#5c5e64]">{TEKS_SIMULASI}</p>
        <p className="text-[13px]">
          Alur: Draft → Pending Review → Approved/Rejected. Aksi berlaku untuk versi B (<strong>{versiB}</strong>,
          status <BadgeStatus status={statusB} />). Baseline aktif (simulasi):{" "}
          <strong>{baselineAktif ?? "Belum ada"}</strong>. Kode alasan tetap Unresolved.
        </p>

        {aksi.length > 0 ? (
          <div className="space-y-3">
            <label className="block text-[12px] text-[#5c5e64]">
              Alasan perubahan (wajib)
              <textarea
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                rows={2}
                className="mt-1 w-full p-2.5 text-[13px] border border-[#c4c6cd]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b80035]/20"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {aksi.map((x) => (
                <button
                  key={x}
                  type="button"
                  onClick={() => jalankan(x)}
                  className={`h-9 px-4 rounded-lg text-[13px] font-semibold ${
                    x === "tolak"
                      ? "bg-white border border-[#b80035] text-[#b80035] hover:bg-[#fff1f2]"
                      : "bg-[#0b1c30] text-white hover:bg-[#1a2d45]"
                  }`}
                >
                  {LABEL_AKSI[x]}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-[#5c5e64]">
            Versi ini sudah {LABEL_STATUS[statusB]}. Pilih versi B lain atau tekan Reset simulasi.
          </p>
        )}

        {umpanBalik && (
          <div
            role="status"
            className={`text-[13px] p-3 rounded-lg border ${
              umpanBalik.ok ? "bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]" : "bg-[#fff1f2] border-[#ffdad6] text-[#9f1239]"
            }`}
          >
            {umpanBalik.pesan}
          </div>
        )}

        <table className="w-full text-[13px]">
          <thead className="text-[12px] text-[#5c5e64] text-left">
            <tr>
              <th className="py-2">Versi</th>
              <th className="py-2">Status</th>
              <th className="py-2">Alasan perubahan</th>
              <th className="py-2">Baseline aktif</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {VERSI.map((v) => (
              <tr key={v.versi}>
                <td className="py-2 font-semibold">{v.versi}</td>
                <td className="py-2">
                  <BadgeStatus status={statusVersi[v.versi]} />
                </td>
                <td className="py-2">{alasanVersi[v.versi] ?? KOSONG}</td>
                <td className="py-2">{baselineAktif === v.versi ? "Ya (simulasi)" : "Tidak"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Revisi lintas laporan */}
      <div className="bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-bold text-[#0b1c30]">Revisi lintas laporan</h2>
            <p className="text-[12px] text-[#5c5e64]">
              {REVISI.length} revisi: {jenis.umum} catatan umum, {jenis.tidakAda} tanpa catatan, {jenis.spesifik} catatan
              spesifik.
            </p>
          </div>
          <div className="inline-flex rounded-lg border border-[#c4c6cd]/60 overflow-hidden text-[13px]">
            <button
              type="button"
              onClick={() => setTampilSemua(false)}
              className={`px-3 h-9 ${!tampilSemua ? "bg-[#0b1c30] text-white" : "bg-white"}`}
            >
              Hanya revisi ({REVISI.length})
            </button>
            <button
              type="button"
              onClick={() => setTampilSemua(true)}
              className={`px-3 h-9 ${tampilSemua ? "bg-[#0b1c30] text-white" : "bg-white"}`}
            >
              Semua ({REVISI.length + TIDAK_DIREVISI.length})
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead className="bg-[#eff4ff] text-[12px] text-[#5c5e64] text-left">
              <tr>
                <th className="px-3 py-2.5">Metrik</th>
                <th className="px-3 py-2.5 text-right">Nilai lama</th>
                <th className="px-3 py-2.5 text-right">Nilai baru</th>
                <th className="px-3 py-2.5 text-right">% selisih</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5">Catatan laporan</th>
                <th className="px-3 py-2.5">Kode alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] align-top">
              {baris.map((r) => (
                <tr key={r.kunci}>
                  <td className="px-3 py-2.5 font-medium min-w-[160px]">{r.metrik}</td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    {fmtAngka(r.nilaiLama, 3)}
                    <div className="text-[11px] text-[#5c5e64]">{r.sumberLama}</div>
                  </td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    {fmtAngka(r.nilaiBaru, 3)}
                    <div className="text-[11px] text-[#5c5e64]">{r.sumberBaru}</div>
                  </td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">{fmtPersen(r.persen)}</td>
                  <td className="px-3 py-2.5">{r.status}</td>
                  <td className="px-3 py-2.5 min-w-[280px]">
                    {r.catatanJenis && <div className="font-semibold text-[12px]">{r.catatanJenis}</div>}
                    {r.catatanLaporan && <div className="text-[12px] text-[#5c5e64]">{r.catatanLaporan}</div>}
                    {r.catatanAnalis && (
                      <div className="text-[12px] text-[#5c5e64] mt-1">Catatan analis: {r.catatanAnalis}</div>
                    )}
                    {!r.catatanJenis && !r.catatanLaporan && KOSONG}
                  </td>
                  <td className="px-3 py-2.5">{r.kodeAlasan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
