"use client";

import React from "react";
import { X, Info } from "lucide-react";
import { useTeraStore } from "@/stores/useTeraStore";
import { SEED, namaLaporan } from "@/lib/seed";
import { INFO_ATURAN, TEKS_HASIL, labelHasil, satuanCek, LabelHasil } from "@/lib/dq";
import { fmtAngka, fmtTetap, fmtBertanda, KOSONG } from "@/lib/format";

const WARNA_PILL: Record<LabelHasil, string> = {
  ditandai: "bg-[#fffbeb] text-[#b45309]",
  tidak: "bg-[#ecfdf5] text-[#047857]",
  luar: "bg-[#f1f5f9] text-[#5c5e64]",
  belum: "bg-[#f1f5f9] text-[#5c5e64]",
};

function Atribut({ label, children, tebal }: { label: string; children: React.ReactNode; tebal?: boolean }) {
  return (
    <div>
      <div className="text-[11px] font-medium text-[#5c5e64] uppercase tracking-wider">{label}</div>
      <div className={`text-[13px] ${tebal ? "font-bold" : "font-medium"} text-[#0b1c30] mt-0.5`}>{children}</div>
    </div>
  );
}

// Detail satu pemeriksaan (data seed saja): input, rumus, sumber, catatan D6.
export default function CheckDetailDrawer() {
  const { cekTerpilih, isDrawerOpen, closeDrawer, hasilAturan } = useTeraStore();
  if (!isDrawerOpen || cekTerpilih === null) return null;

  const c = SEED.cek_32.find((x) => x.no === cekTerpilih);
  if (!c) return null;
  const h = hasilAturan?.hasil.find((x) => x.no === c.no);
  const u = satuanCek(c);
  const jenis = labelHasil(c, h);
  const luar = c.aturan_prototipe === "di_luar_cakupan";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" role="dialog" aria-modal="true" aria-label={`Pemeriksaan #${c.no}`}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#0b1c30]/40 backdrop-blur-sm transition-opacity" onClick={closeDrawer} aria-hidden="true" />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-white shadow-drawer h-full overflow-y-auto flex flex-col justify-between z-10 transition-transform">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#e5eeff]">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <span className="text-[16px] font-semibold text-[#0b1c30] tracking-tight">Pemeriksaan #{c.no}</span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${WARNA_PILL[jenis]}`}>
                  {TEKS_HASIL[jenis]}
                </span>
              </div>
              <h2 className="text-[22px] font-semibold text-[#0b1c30] tracking-tight leading-tight">{c.item}</h2>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-[#5c5e64] hover:text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
              title="Tutup"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Attributes Grid */}
          <div className="bg-[#eff4ff] p-4 rounded-xl grid grid-cols-2 gap-y-3.5 gap-x-4 border border-[#dce9ff]">
            <Atribut label="Laporan" tebal>
              {namaLaporan(c.laporan)}
            </Atribut>
            <Atribut label="Halaman cetak">hlm {c.halaman_cetak}</Atribut>
            <Atribut label="Aturan">
              {luar ? "Di luar cakupan" : `${INFO_ATURAN[c.aturan_prototipe].simbol} (${INFO_ATURAN[c.aturan_prototipe].ruleId})`}
            </Atribut>
            <Atribut label="Toleransi (D6)">{luar ? KOSONG : `${fmtAngka(c.toleransi_d6)} ${u.selisih}`}</Atribut>
            <Atribut label="Tertulis" tebal>
              {fmtAngka(c.nilai_tertulis)} {u.nilai}
            </Atribut>
            <Atribut label="Hitung ulang" tebal>
              {h?.hitung != null ? `${fmtTetap(h.hitung, 4)} ${u.nilai}` : KOSONG}
            </Atribut>
            <Atribut label="Selisih">{h?.selisih != null ? `${fmtBertanda(h.selisih, 4)} ${u.selisih}` : KOSONG}</Atribut>
            <Atribut label="Hasil D6">{c.hasil_d6}</Atribut>
          </div>

          {/* Formula & Inputs */}
          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider mb-1">Rumus (D6)</div>
              <p className="text-[13px] text-[#0b1c30] leading-relaxed font-mono">{c.rumus_d6}</p>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider mb-1">Input</div>
              <ol className="text-[13px] text-[#0b1c30] leading-relaxed list-decimal pl-5">
                {c.input.map((v, i) => (
                  <li key={i}>{fmtAngka(v, 6)}</li>
                ))}
              </ol>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider mb-1">Sumber</div>
              <p className="text-[13px] text-[#0b1c30] leading-relaxed">
                {c.dokumen}, hlm {c.halaman_cetak}
              </p>
            </div>

            {/* D6 note box */}
            <div className="bg-[#fffbeb] border border-[#fef3c7] p-3 rounded-lg flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#78350f] leading-relaxed">
                <span className="font-bold">Keterangan D6:</span> {c.catatan_d6 || KOSONG}
                <div className="mt-1">
                  Hasil aturan bersifat in-sample: aturan dan toleransi dirancang dari data yang sama. Tanda berarti angka
                  perlu ditinjau, bukan kesimpulan bahwa angka laporan salah.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#f8f9ff] border-t border-[#e5eeff] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeDrawer}
            className="px-5 py-2.5 rounded-lg bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30] font-semibold text-[14px] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
