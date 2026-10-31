import React from "react";
import { FileText, Info } from "lucide-react";

// Kerangka halaman yang masih spesifikasi: bentuk kartu mengikuti desain asli,
// isinya hanya judul netral dari PRD dan label "Spesifikasi" (tanpa angka, tabel, atau grafik berisi data).

export function SpecPill() {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#e5eeff] text-[#0b1c30]">
      <FileText className="w-3 h-3" />
      Spesifikasi
    </span>
  );
}

/** Teks wajib panduan 3.5 dalam kotak keterangan bergaya asli. */
export function SpecNotice({ purpose, extraNote }: { purpose: string; extraNote?: string }) {
  return (
    <div className="bg-[#fffbeb] border border-[#fef3c7] p-4 rounded-xl flex items-start gap-2.5">
      <Info className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
      <div className="text-[13px] text-[#78350f] leading-relaxed space-y-1">
        <div className="font-bold">Masih spesifikasi; belum dibangun pada prototipe ini.</div>
        <div>
          <span className="font-semibold">Tujuan:</span> {purpose}
        </div>
        {extraNote && <div>{extraNote}</div>}
      </div>
    </div>
  );
}

/** Bingkai KpiCard asli tanpa nilai. */
export function SpecKpiCard({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">{label}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] flex items-center justify-center text-[#5c5e64] shrink-0">
            {icon}
          </div>
        )}
      </div>
      <div className="my-1">
        <SpecPill />
      </div>
      <div className="flex items-center flex-wrap gap-2 mt-3 pt-2 border-t border-[#f1f5f9]">
        <span className="text-[12px] text-[#5c5e64]">Belum dibangun pada prototipe ini</span>
      </div>
    </div>
  );
}

/** Bingkai kartu grafik/panel asli dengan keadaan kosong. */
export function SpecPanel({
  title,
  subtitle,
  icon,
  className = "",
  bodyHeight = "h-40",
  muted = false,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  bodyHeight?: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`${muted ? "bg-[#f8f9ff]" : "bg-white"} p-5 rounded-xl border border-[#e5eeff] shadow-sm space-y-4 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#e5eeff]">
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <h3 className="text-[14px] font-bold text-[#0b1c30]">{title}</h3>
            {subtitle && <p className="text-[12px] text-[#5c5e64]">{subtitle}</p>}
          </div>
        </div>
        <SpecPill />
      </div>
      <div
        className={`${bodyHeight} rounded-lg border border-dashed border-[#c4c6cd] bg-[#f8f9ff] flex flex-col items-center justify-center gap-1.5 text-center px-4`}
      >
        <FileText className="w-5 h-5 text-[#5c5e64]" />
        <span className="text-[12px] text-[#5c5e64]">Belum dibangun pada prototipe ini.</span>
      </div>
    </div>
  );
}
