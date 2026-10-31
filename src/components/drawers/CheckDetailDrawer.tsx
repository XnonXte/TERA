"use client";

import React from "react";
import { X } from "lucide-react";
import { useTeraStore } from "@/stores/useTeraStore";
import { SEED, sumberLaporan } from "@/lib/seed";
import { INFO_ATURAN, labelHasil, satuanCek } from "@/lib/dq";
import { fmtAngka, fmtTetap, fmtBertanda, KOSONG } from "@/lib/format";
import HasilBadge from "@/components/ui/HasilBadge";

function Baris({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-3 py-2 border-b border-[#f1f5f9] text-[13px]">
      <div className="text-[#5c5e64]">{label}</div>
      <div className="text-[#0b1c30] break-words">{children}</div>
    </div>
  );
}

// Detail satu pemeriksaan: input, rumus, sumber, catatan D6.
export default function CheckDetailDrawer() {
  const { cekTerpilih, isDrawerOpen, closeDrawer, hasilAturan } = useTeraStore();
  if (!isDrawerOpen || cekTerpilih === null) return null;

  const c = SEED.cek_32.find((x) => x.no === cekTerpilih);
  if (!c) return null;
  const h = hasilAturan?.hasil.find((x) => x.no === c.no);
  const u = satuanCek(c);
  const luar = c.aturan_prototipe === "di_luar_cakupan";

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`Pemeriksaan #${c.no}`}>
      <div className="absolute inset-0 bg-[#0b1c30]/30" onClick={closeDrawer} />
      <div className="relative w-full max-w-lg h-full bg-white shadow-drawer overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#e5eeff] px-5 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">Pemeriksaan #{c.no}</div>
            <h2 className="text-[16px] font-bold text-[#0b1c30] mt-0.5">{c.item}</h2>
            <div className="mt-2">
              <HasilBadge jenis={labelHasil(c, h)} />
            </div>
          </div>
          <button type="button" onClick={closeDrawer} aria-label="Tutup" className="p-1.5 rounded-lg hover:bg-[#eff4ff]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          <Baris label="Sumber">
            {sumberLaporan(c.laporan, c.halaman_cetak)}
            <div className="text-[12px] text-[#5c5e64]">{c.dokumen}</div>
          </Baris>
          <Baris label="Aturan">
            {luar ? "Di luar cakupan aturan saat ini" : `${INFO_ATURAN[c.aturan_prototipe].simbol} (${INFO_ATURAN[c.aturan_prototipe].ruleId}) · ${INFO_ATURAN[c.aturan_prototipe].nama}`}
          </Baris>
          <Baris label="Input">
            <ol className="list-decimal pl-5 space-y-0.5">
              {c.input.map((v, i) => (
                <li key={i}>{fmtAngka(v, 6)}</li>
              ))}
            </ol>
          </Baris>
          <Baris label="Rumus (D6)">
            <code className="text-[12px]">{c.rumus_d6}</code>
          </Baris>
          <Baris label="Tertulis">
            {fmtAngka(c.nilai_tertulis)} {u.nilai}
          </Baris>
          <Baris label="Hitung ulang">{h?.hitung != null ? `${fmtTetap(h.hitung, 4)} ${u.nilai}` : KOSONG}</Baris>
          <Baris label="Selisih">{h?.selisih != null ? `${fmtBertanda(h.selisih, 4)} ${u.selisih}` : KOSONG}</Baris>
          <Baris label="Toleransi (D6)">{luar ? KOSONG : `${fmtAngka(c.toleransi_d6)} ${u.selisih}`}</Baris>
          <Baris label="Hasil D6">{c.hasil_d6}</Baris>
          <Baris label="Catatan D6">{c.catatan_d6 || KOSONG}</Baris>

          <p className="mt-4 text-[12px] text-[#5c5e64] leading-relaxed">
            Hasil aturan bersifat in-sample: aturan dan toleransi dirancang dari data yang sama. Tanda berarti angka perlu
            ditinjau, bukan kesimpulan bahwa angka laporan salah.
          </p>
        </div>
      </div>
    </div>
  );
}
