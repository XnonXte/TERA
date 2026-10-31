"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Play, ArrowUpDown } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import HasilBadge from "@/components/ui/HasilBadge";
import { useTeraStore } from "@/stores/useTeraStore";
import { SEED, Cek, sumberLaporan, namaLaporan } from "@/lib/seed";
import { HasilCek } from "@/lib/rules";
import { INFO_ATURAN, labelHasil, satuanCek } from "@/lib/dq";
import { fmtAngka, fmtTetap, fmtBertanda, fmtWaktu, KOSONG } from "@/lib/format";

type KolomUrut = "no" | "item" | "sumber" | "tertulis" | "hitung" | "selisih" | "toleransi" | "aturan" | "hasil";

function Kartu({ label, nilai, ket }: { label: string; nilai: string; ket?: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#e5eeff] p-4 shadow-sm">
      <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">{label}</div>
      <div className="text-[26px] font-bold text-[#0b1c30] mt-1">{nilai}</div>
      {ket && <div className="text-[12px] text-[#5c5e64] mt-0.5">{ket}</div>}
    </div>
  );
}

const daftarNo = (xs: number[]) => (xs.length ? xs.map((n) => `#${n}`).join(", ") : KOSONG);

export default function DataQualityPage() {
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

  // Tautan langsung, mis. /data-quality?cek=19
  useEffect(() => {
    const no = Number(new URLSearchParams(window.location.search).get("cek"));
    if (no && cek.some((c) => c.no === no)) bukaCek(no);
  }, [cek, bukaCek]);

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

  const th = (k: KolomUrut, label: string, kanan = false) => (
    <th className={`px-3 py-2.5 font-semibold ${kanan ? "text-right" : "text-left"}`}>
      <button
        type="button"
        onClick={() => setUrut((u) => ({ kolom: k, naik: u.kolom === k ? !u.naik : true }))}
        className="inline-flex items-center gap-1 hover:text-[#0b1c30]"
      >
        {label}
        <ArrowUpDown className={`w-3 h-3 ${urut.kolom === k ? "text-[#b80035]" : "opacity-40"}`} />
      </button>
    </th>
  );

  const sel =
    "h-9 px-2.5 text-[13px] bg-white border border-[#c4c6cd]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b80035]/20";

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Data Quality Center"
        title="Pemeriksaan konsistensi angka laporan"
        description="32 pemeriksaan dari berkas D6 pada laporan keberlanjutan Telkomsel 2023-2025. Aplikasi menjalankan aturan α (DQ-08) dan β (DQ-09) di browser."
        actions={
          <button
            type="button"
            onClick={jalankanAturanDQ}
            className="flex items-center gap-2 px-4 py-2 bg-[#0b1c30] rounded-lg text-[13px] font-semibold text-white hover:bg-[#1a2d45] transition-colors shadow"
          >
            <Play className="w-4 h-4" />
            <span>Jalankan aturan</span>
          </button>
        }
      />

      {/* Pernyataan in-sample; semua angka dihitung aplikasi */}
      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 text-[13px] text-[#78350f] leading-relaxed">
        {r ? (
          <>
            <strong>Hasil in-sample.</strong> Aturan dan toleransi dirancang dari data yang sama. Dari {r.gagalD6}{" "}
            pemeriksaan yang gagal pada D6, {r.gagalD6Ditandai} ditandai aplikasi; {r.gagalD6DiLuarCakupan} lainnya di
            luar cakupan aturan. {r.falsePositive} dari {r.lolosTercakup} pemeriksaan yang lolos ditandai. Ini bukan bukti
            kinerja pada data lain.
          </>
        ) : (
          <>Aturan belum dijalankan.</>
        )}
        <div className="mt-1 text-[12px]">Waktu eksekusi terakhir: {fmtWaktu(hasilAturan?.waktu ?? null)}</div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Kartu label="Total pemeriksaan" nilai={String(cek.length)} ket={r ? `${r.tercakup} dalam cakupan aturan` : undefined} />
        <Kartu label="Ditandai" nilai={r ? String(r.ditandai.length) : KOSONG} ket={r ? daftarNo(r.ditandai) : undefined} />
        <Kartu label="Tidak ditandai" nilai={r ? String(r.tidakDitandai) : KOSONG} ket="Dalam cakupan aturan" />
        <Kartu label="False positive" nilai={r ? String(r.falsePositive) : KOSONG} ket="Ditandai padahal lolos pada D6" />
        <Kartu label="Di luar cakupan" nilai={r ? String(r.diLuarCakupan.length) : KOSONG} ket={r ? daftarNo(r.diLuarCakupan) : undefined} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(["alpha", "beta"] as const).map((a) => {
          const p = r?.perAturan[a];
          return (
            <div key={a} className="bg-white rounded-xl border border-[#e5eeff] p-4 shadow-sm text-[13px] space-y-1">
              <div className="font-bold text-[#0b1c30]">
                Aturan {INFO_ATURAN[a].simbol} ({INFO_ATURAN[a].ruleId})
              </div>
              <div className="text-[#5c5e64]">{INFO_ATURAN[a].nama}</div>
              <div>{p ? `#${p.dari}-#${p.sampai} · ${p.jumlah} pemeriksaan · ${p.ditandai} ditandai` : KOSONG}</div>
              <div className="text-[12px] text-[#5c5e64]">
                Ditandai bila |hitung − tertulis| &gt; toleransi pemeriksaan (dari D6).
              </div>
            </div>
          );
        })}
        <div className="bg-white rounded-xl border border-dashed border-[#c4c6cd] p-4 text-[13px] space-y-1">
          <div className="font-bold text-[#0b1c30]">Aturan {INFO_ATURAN.di_luar_cakupan.simbol}</div>
          <div className="text-[#5c5e64]">{INFO_ATURAN.di_luar_cakupan.nama}</div>
          <div>{r ? `${daftarNo(r.diLuarCakupan)} · Tidak dikerjakan` : "Tidak dikerjakan"}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select aria-label="Filter aturan" className={sel} value={fAturan} onChange={(e) => setFAturan(e.target.value)}>
          <option value="semua">Semua aturan</option>
          <option value="alpha">Aturan α (DQ-08)</option>
          <option value="beta">Aturan β (DQ-09)</option>
          <option value="di_luar_cakupan">Di luar cakupan</option>
        </select>
        <select aria-label="Filter hasil" className={sel} value={fHasil} onChange={(e) => setFHasil(e.target.value)}>
          <option value="semua">Semua hasil</option>
          <option value="ditandai">Ditandai</option>
          <option value="tidak">Tidak ditandai</option>
          <option value="luar">Di luar cakupan</option>
        </select>
        <select aria-label="Filter laporan" className={sel} value={fLaporan} onChange={(e) => setFLaporan(e.target.value)}>
          <option value="semua">Semua laporan</option>
          {laporanList.map((l) => (
            <option key={l} value={l}>
              {namaLaporan(l)}
            </option>
          ))}
        </select>
        <input
          type="search"
          aria-label="Cari pemeriksaan"
          placeholder="Cari…"
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          className={`${sel} w-56`}
        />
        <span className="text-[12px] text-[#5c5e64]">
          {baris.length} dari {cek.length} pemeriksaan
        </span>
      </div>

      <div className="bg-white rounded-xl border border-[#e5eeff] shadow-sm overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead className="bg-[#eff4ff] text-[12px] text-[#5c5e64]">
            <tr>
              {th("no", "#")}
              {th("item", "Pemeriksaan")}
              {th("sumber", "Sumber")}
              {th("tertulis", "Tertulis", true)}
              {th("hitung", "Hitung ulang", true)}
              {th("selisih", "Selisih", true)}
              {th("toleransi", "Toleransi", true)}
              {th("aturan", "Aturan")}
              {th("hasil", "Hasil aplikasi")}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {baris.map((c) => {
              const h = hasilByNo.get(c.no);
              const u = satuanCek(c);
              const jenis = labelHasil(c, h);
              return (
                <tr
                  key={c.no}
                  onClick={() => bukaCek(c.no)}
                  className={`cursor-pointer hover:bg-[#f8f9ff] ${jenis === "ditandai" ? "bg-[#fffdf5]" : ""}`}
                >
                  <td className="px-3 py-2.5 font-semibold">{c.no}</td>
                  <td className="px-3 py-2.5 min-w-[240px]">{c.item}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-[#5c5e64]">{sumberLaporan(c.laporan, c.halaman_cetak)}</td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    {fmtAngka(c.nilai_tertulis)} <span className="text-[#5c5e64] text-[11px]">{u.nilai}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    {h?.hitung != null ? fmtTetap(h.hitung) : KOSONG}
                  </td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    {h?.selisih != null ? (
                      <>
                        {fmtBertanda(h.selisih)} <span className="text-[#5c5e64] text-[11px]">{u.selisih}</span>
                      </>
                    ) : (
                      KOSONG
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right whitespace-nowrap">
                    {c.aturan_prototipe === "di_luar_cakupan" ? KOSONG : fmtAngka(c.toleransi_d6)}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    {c.aturan_prototipe === "di_luar_cakupan"
                      ? KOSONG
                      : `${INFO_ATURAN[c.aturan_prototipe].simbol} (${INFO_ATURAN[c.aturan_prototipe].ruleId})`}
                  </td>
                  <td className="px-3 py-2.5">
                    <HasilBadge jenis={jenis} />
                    {jenis === "luar" && <div className="text-[11px] text-[#5c5e64] mt-1">Keterangan D6: {c.hasil_d6}</div>}
                  </td>
                </tr>
              );
            })}
            {baris.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-[#5c5e64]">
                  Tidak ada pemeriksaan yang cocok dengan filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
