import React from "react";
import { TEKS_HASIL, LabelHasil } from "@/lib/dq";

const WARNA_HASIL: Record<LabelHasil, string> = {
  ditandai: "bg-[#fffbeb] text-[#92400e] border-[#fde68a]",
  tidak: "bg-[#f1f5f9] text-[#334155] border-[#e2e8f0]",
  luar: "bg-white text-[#5c5e64] border-dashed border-[#c4c6cd]",
  belum: "bg-white text-[#5c5e64] border-[#e2e8f0]",
};

// Hasil aplikasi per pemeriksaan; teks selalu ada, warna bukan satu-satunya pembeda.
export default function HasilBadge({ jenis }: { jenis: LabelHasil }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold whitespace-nowrap ${WARNA_HASIL[jenis]}`}
    >
      {jenis === "ditandai" && (
        <span aria-hidden className="mr-1">
          ⚑
        </span>
      )}
      {TEKS_HASIL[jenis]}
    </span>
  );
}
