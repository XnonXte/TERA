import React from "react";
import { FileText } from "lucide-react";

interface SpecScreenProps {
  title: string;
  purpose: string;
  extraNote?: string;
}

// Layar untuk halaman yang masih spesifikasi (belum dibangun pada prototipe).
export default function SpecScreen({ title, purpose, extraNote }: SpecScreenProps) {
  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-[#e5eeff]">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[26px] font-bold text-[#0b1c30] tracking-tight">{title}</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#dce9ff] bg-[#e5eeff] text-[12px] font-semibold text-[#0b1c30]">
            <FileText className="w-3.5 h-3.5" />
            Spesifikasi
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e5eeff] p-6 shadow-sm space-y-4 max-w-3xl">
        <p className="text-[15px] font-semibold text-[#0b1c30]">
          Masih spesifikasi; belum dibangun pada prototipe ini.
        </p>
        <div className="space-y-1">
          <div className="text-[12px] font-semibold text-[#5c5e64] uppercase tracking-wider">Tujuan</div>
          <p className="text-[14px] text-[#0b1c30] leading-relaxed">{purpose}</p>
        </div>
        {extraNote && (
          <p className="text-[14px] text-[#0b1c30] leading-relaxed bg-[#fffbeb] border border-[#fde68a] rounded-lg p-3">
            {extraNote}
          </p>
        )}
        <p className="text-[13px] text-[#5c5e64]">Lihat PRD, bagian halaman terkait.</p>
      </div>
    </div>
  );
}
