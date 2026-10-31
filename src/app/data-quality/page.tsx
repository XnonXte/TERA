"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  RotateCw,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ListChecks,
  ArrowUpDown,
  Info,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTeraStore } from "@/stores/useTeraStore";
import { SEED, Cek, sumberLaporan, namaLaporan } from "@/lib/seed";
import { HasilCek } from "@/lib/rules";
import { INFO_ATURAN, TEKS_HASIL, labelHasil, satuanCek, LabelHasil } from "@/lib/dq";
import { fmtAngka, fmtTetap, fmtBertanda, fmtWaktu, KOSONG } from "@/lib/format";

type KolomUrut = "no" | "item" | "sumber" | "tertulis" | "hitung" | "selisih" | "toleransi" | "aturan" | "hasil";

// Hasil aplikasi memakai StatusBadge asli: Warning (ditandai), Valid (tidak ditandai), abu (di luar cakupan).
const STATUS_BADGE: Record<LabelHasil, string> = {
  ditandai: "warning",
  tidak: "valid",
  luar: "luar",
  belum: "belum",
};

const daftarNo = (xs: number[]) => (xs.length ? xs.map((n) => `#${n}`).join(", ") : KOSONG);

function DataQualityContent() {
  const params = useSearchParams();
  const { hasilAturan, jalankanAturanDQ, bukaCek } = useTeraStore();
  const cek = SEED.cek_32;

  const [fAturan, setFAturan] = useState("semua");
  const [fHasil, setFHasil] = useState("semua");
  const [fLaporan, setFLaporan] = useState("semua");
  const [cari, setCari] = useState("");
  const [urut, setUrut] = useState<{ kolom: KolomUrut; naik: boolean }>({ kolom: "no", naik: true });

  // Aturan dijalankan sekali saat halaman pertama dibuka (di browser).
  useEffect(() => {
    if (!hasilAturan) jalankanAturanDQ();
  }, [hasilAturan, jalankanAturanDQ]);

  // Tautan langsung: /data-quality?cek=19 membuka detail; ?q=... dari pencarian header mengisi kolom cari.
  const paramCek = params.get("cek");
  const paramQ = params.get("q");
  useEffect(() => {
    const no = Number(paramCek);
    if (no && cek.some((c) => c.no === no)) bukaCek(no);
  }, [paramCek, cek, bukaCek]);
  useEffect(() => {
    if (paramQ !== null) setCari(paramQ);
  }, [paramQ]);

  const hasilByNo = useMemo(() => {
    const m = new Map<number, HasilCek>();
    hasilAturan?.hasil.forEach((h) => m.set(h.no, h));
    return m;
  }, [hasilAturan]);

  const laporanList = useMemo(() => Array.from(new Set(cek.map((c) => c.laporan))).sort(), [cek]);
  const r = hasilAturan?.ringkasan;

  const baris = useMemo(() => {
    const q = cari.trim().toLowerCase();
    const xs = cek.filter((c) => {
      const h = hasilByNo.get(c.no);
      if (fAturan !== "semua" && c.aturan_prototipe !== fAturan) return false;
      if (fHasil !== "semua" && labelHasil(c, h) !== fHasil) return false;
      if (fLaporan !== "semua" && c.laporan !== fLaporan) return false;
      if (q && !`#${c.no} ${c.item} ${namaLaporan(c.laporan)} hlm ${c.halaman_cetak}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const nilai = (c: Cek): number | string => {
      const h = hasilByNo.get(c.no);
      switch (urut.kolom) {
        case "no": return c.no;
        case "item": return c.item;
        case "sumber": return `${c.laporan}-${String(c.halaman_cetak).padStart(4, "0")}`;
        case "tertulis": return c.nilai_tertulis;
        case "hitung": return h?.hitung ?? -Infinity;
        case "selisih": return h?.selisih ?? -Infinity;
        case "toleransi": return c.toleransi_d6;
        case "aturan": return c.aturan_prototipe;
        case "hasil": return labelHasil(c, h);
      }
    };
    return [...xs].sort((a, b) => {
      const va = nilai(a);
      const vb = nilai(b);
      const d = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return urut.naik ? d : -d;
    });
  }, [cek, hasilByNo, fAturan, fHasil, fLaporan, cari, urut]);

  const adaFilter = fAturan !== "semua" || fHasil !== "semua" || fLaporan !== "semua" || cari !== "";

  const th = (k: KolomUrut, label: string, kanan = false) => (
    <th className={`py-3 px-4 ${kanan ? "text-right" : ""}`}>
      <button
        type="button"
        onClick={() => setUrut((u) => ({ kolom: k, naik: u.kolom === k ? !u.naik : true }))}
        className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-[#0b1c30]"
      >
        {label}
        <ArrowUpDown className={`w-3 h-3 ${urut.kolom === k ? "text-[#b80035]" : "opacity-40"}`} />
      </button>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        badge="DATA QUALITY CENTER"
        title="Pemeriksaan konsistensi angka laporan"
        description="32 pemeriksaan dari berkas D6 pada laporan keberlanjutan Telkomsel 2023-2025. Aplikasi menjalankan aturan α (DQ-08) dan β (DQ-09) di browser."
        actions={
          <button
            type="button"
            onClick={jalankanAturanDQ}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c4c6cd]/50 rounded-lg text-[13px] font-semibold text-[#0b1c30] hover:bg-[#eff4ff] transition-colors shadow-sm"
          >
            <RotateCw className="w-4 h-4 text-[#5c5e64]" />
            <span>Jalankan aturan</span>
          </button>
        }
      />

      {/* In-sample statement (values computed by the app) */}
      <div className="bg-[#fffbeb] border border-[#fef3c7] p-4 rounded-xl flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
        <div className="text-[13px] text-[#78350f] leading-relaxed">
          {r ? (
            <>
              <span className="font-bold">Hasil in-sample.</span> Aturan dan toleransi dirancang dari data yang sama. Dari{" "}
              {r.gagalD6} pemeriksaan yang gagal pada D6, {r.gagalD6Ditandai} ditandai aplikasi; {r.gagalD6DiLuarCakupan}{" "}
              lainnya di luar cakupan aturan. {r.falsePositive} dari {r.lolosTercakup} pemeriksaan yang lolos ditandai. Ini
              bukan bukti kinerja pada data lain.
            </>
          ) : (
            <>Aturan belum dijalankan.</>
          )}
          <div className="text-[12px] mt-1">Waktu eksekusi terakhir: {fmtWaktu(hasilAturan?.waktu ?? null)}</div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="Total"
          value={cek.length}
          unit="pemeriksaan"
          badge={{ text: r ? `${r.tercakup} dalam cakupan` : KOSONG, variant: "blue" }}
          subtitle="Berkas pemeriksaan D6"
          icon={<ListChecks className="w-4 h-4 text-[#0b1c30]" />}
        />
        <KpiCard
          label="Ditandai"
          value={r ? r.ditandai.length : KOSONG}
          unit="pemeriksaan"
          badge={{ text: "Warning", variant: "amber" }}
          subtitle={r ? daftarNo(r.ditandai) : undefined}
          icon={<AlertTriangle className="w-4 h-4 text-[#d97706]" />}
        />
        <KpiCard
          label="Tidak ditandai"
          value={r ? r.tidakDitandai : KOSONG}
          unit="pemeriksaan"
          subtitle="Dalam cakupan aturan"
          icon={<CheckCircle2 className="w-4 h-4 text-[#00675e]" />}
        />
        <KpiCard
          label="False positive"
          value={r ? r.falsePositive : KOSONG}
          unit="pemeriksaan"
          footnote="Ditandai padahal lolos pada D6"
          icon={<ShieldCheck className="w-4 h-4 text-[#00675e]" />}
        />
        <KpiCard
          label="Luar cakupan"
          value={r ? r.diLuarCakupan.length : KOSONG}
          unit="pemeriksaan"
          subtitle={r ? daftarNo(r.diLuarCakupan) : undefined}
          icon={<AlertCircle className="w-4 h-4 text-[#5c5e64]" />}
        />
      </div>

      {/* Rule panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["alpha", "beta"] as const).map((a) => {
          const p = r?.perAturan[a];
          return (
            <div key={a} className="bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[14px] font-bold text-[#0b1c30]">
                  Aturan {INFO_ATURAN[a].simbol} ({INFO_ATURAN[a].ruleId})
                </h3>
                {p && <StatusBadge status={p.ditandai > 0 ? "warning" : "valid"} size="sm" label={`${p.ditandai} ditandai`} />}
              </div>
              <p className="text-[12px] text-[#5c5e64]">{INFO_ATURAN[a].nama}</p>
              <p className="text-[13px] text-[#0b1c30]">{p ? `#${p.dari}-#${p.sampai} · ${p.jumlah} pemeriksaan` : KOSONG}</p>
              <p className="text-[11px] text-[#5c5e64]">Ditandai bila |hitung − tertulis| &gt; toleransi pemeriksaan (dari D6).</p>
            </div>
          );
        })}
        <div className="bg-white rounded-xl border border-dashed border-[#c4c6cd] p-5 space-y-1.5">
          <h3 className="text-[14px] font-bold text-[#0b1c30]">Aturan {INFO_ATURAN.di_luar_cakupan.simbol}</h3>
          <p className="text-[12px] text-[#5c5e64]">{INFO_ATURAN.di_luar_cakupan.nama}</p>
          <p className="text-[13px] text-[#0b1c30]">{r ? `${daftarNo(r.diLuarCakupan)} · Tidak dikerjakan` : "Tidak dikerjakan"}</p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#5c5e64] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            aria-label="Cari pemeriksaan"
            placeholder="Cari…"
            className="w-full h-9 pl-9 pr-3 text-[13px] bg-[#f8f9ff] border border-[#dce9ff] rounded-lg text-[#0b1c30] placeholder:text-[#5c5e64] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 focus:border-[#b80035]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#dce9ff] text-[12px]">
            <span className="font-semibold text-[#5c5e64]">Aturan:</span>
            <select
              aria-label="Filter aturan"
              value={fAturan}
              onChange={(e) => setFAturan(e.target.value)}
              className="bg-transparent font-bold text-[#0b1c30] focus:outline-none cursor-pointer"
            >
              <option value="semua">Semua aturan</option>
              <option value="alpha">α (DQ-08)</option>
              <option value="beta">β (DQ-09)</option>
              <option value="di_luar_cakupan">Di luar cakupan</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#dce9ff] text-[12px]">
            <span className="font-semibold text-[#5c5e64]">Hasil:</span>
            <select
              aria-label="Filter hasil"
              value={fHasil}
              onChange={(e) => setFHasil(e.target.value)}
              className="bg-transparent font-bold text-[#0b1c30] focus:outline-none cursor-pointer"
            >
              <option value="semua">Semua hasil</option>
              <option value="ditandai">Ditandai</option>
              <option value="tidak">Tidak ditandai</option>
              <option value="luar">Di luar cakupan</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#dce9ff] text-[12px]">
            <span className="font-semibold text-[#5c5e64]">Laporan:</span>
            <select
              aria-label="Filter laporan"
              value={fLaporan}
              onChange={(e) => setFLaporan(e.target.value)}
              className="bg-transparent font-bold text-[#0b1c30] focus:outline-none cursor-pointer"
            >
              <option value="semua">Semua laporan</option>
              {laporanList.map((l) => (
                <option key={l} value={l}>
                  {namaLaporan(l)}
                </option>
              ))}
            </select>
          </div>

          {adaFilter && (
            <button
              type="button"
              onClick={() => {
                setFAturan("semua");
                setFHasil("semua");
                setFLaporan("semua");
                setCari("");
              }}
              className="text-[12px] font-semibold text-[#b80035] hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Checks Table */}
      <div className="bg-white rounded-xl border border-[#e5eeff] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#eff4ff] border-b border-[#dce9ff] text-[#5c5e64] text-[11px] font-bold uppercase tracking-wider">
                {th("no", "#")}
                {th("item", "Pemeriksaan")}
                {th("sumber", "Sumber")}
                {th("tertulis", "Tertulis", true)}
                {th("hitung", "Hitung ulang", true)}
                {th("selisih", "Selisih", true)}
                {th("toleransi", "Toleransi", true)}
                {th("aturan", "Aturan")}
                {th("hasil", "Hasil aplikasi")}
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {baris.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#5c5e64]">
                    Tidak ada pemeriksaan yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                baris.map((c) => {
                  const h = hasilByNo.get(c.no);
                  const u = satuanCek(c);
                  const jenis = labelHasil(c, h);
                  const luar = c.aturan_prototipe === "di_luar_cakupan";
                  return (
                    <tr
                      key={c.no}
                      className="hover:bg-[#f8f9ff] transition-colors cursor-pointer group"
                      onClick={() => bukaCek(c.no)}
                    >
                      <td className="py-3 px-4 font-bold text-[#0b1c30]">{c.no}</td>
                      <td className="py-3 px-4 min-w-[220px]">
                        <div className="font-semibold text-[#0b1c30]">{c.item}</div>
                      </td>
                      <td className="py-3 px-4 text-[#5c5e64] whitespace-nowrap">
                        {sumberLaporan(c.laporan, c.halaman_cetak)}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="font-bold text-[#0b1c30]">{fmtAngka(c.nilai_tertulis)}</div>
                        <div className="text-[11px] text-[#5c5e64]">{u.nilai}</div>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap text-[#0b1c30]">
                        {h?.hitung != null ? fmtTetap(h.hitung) : KOSONG}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className={`font-bold ${jenis === "ditandai" ? "text-[#b80035]" : "text-[#0b1c30]"}`}>
                          {h?.selisih != null ? fmtBertanda(h.selisih) : KOSONG}
                        </div>
                        {h?.selisih != null && <div className="text-[11px] text-[#5c5e64]">{u.selisih}</div>}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap text-[#5c5e64]">
                        {luar ? KOSONG : fmtAngka(c.toleransi_d6)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {luar ? (
                          KOSONG
                        ) : (
                          <span className="font-semibold text-[#0b1c30] bg-[#e5eeff] px-2 py-0.5 rounded text-[11px]">
                            {INFO_ATURAN[c.aturan_prototipe].simbol} {INFO_ATURAN[c.aturan_prototipe].ruleId}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={STATUS_BADGE[jenis]} label={TEKS_HASIL[jenis]} size="sm" showIcon={jenis !== "luar"} />
                        {luar && <div className="text-[11px] text-[#5c5e64] mt-1">Keterangan D6: {c.hasil_d6}</div>}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            bukaCek(c.no);
                          }}
                          className="px-3 py-1 rounded text-[12px] font-semibold text-[#b80035] bg-[#fff1f2] border border-[#ffdad6] hover:bg-[#ffe4e6] transition-colors whitespace-nowrap"
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

        {/* Table footer count */}
        <div className="p-4 bg-[#f8f9ff] border-t border-[#e5eeff] flex items-center justify-between text-[12px] text-[#5c5e64]">
          <div>
            Menampilkan <span className="font-bold text-[#0b1c30]">{baris.length}</span> dari{" "}
            <span className="font-bold text-[#0b1c30]">{cek.length}</span> pemeriksaan
          </div>
          <div>Sumber: berkas pemeriksaan D6 (tera_seed.json)</div>
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
