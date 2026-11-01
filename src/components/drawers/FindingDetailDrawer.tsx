"use client";

import React, { useState } from "react";
import { X, AlertTriangle, CheckCircle2, Info, FileText } from "lucide-react";
import { useSeedStore } from "@/stores/useSeedStore";
import { SEED, namaLaporan } from "@/lib/seed";
import { INFO_ATURAN, labelHasil, satuanCek } from "@/lib/dq";
import { fmtAngka, fmtTetap, fmtBertanda, KOSONG } from "@/lib/format";

export default function FindingDetailDrawer() {
  const { cekTerpilih, isDrawerOpen, closeDrawer, hasilAturan } = useSeedStore();

  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg] = useState("");

  const cek = SEED.cek_32.find((c) => c.no === cekTerpilih);
  if (!isDrawerOpen || !cek) return null;

  // Data pemeriksaan dari seed, dipetakan ke nama field yang dipakai tampilan.
  const h = hasilAturan?.hasil.find((x) => x.no === cek.no);
  const u = satuanCek(cek);
  const jenis = labelHasil(cek, h);
  const aturan =
    cek.aturan_prototipe === "di_luar_cakupan"
      ? "Di luar cakupan"
      : `${INFO_ATURAN[cek.aturan_prototipe].simbol} (${INFO_ATURAN[cek.aturan_prototipe].ruleId})`;
  const selectedRecord = {
    id: `#${cek.no}`,
    issueTitle: cek.item,
    metric: cek.item,
    period: namaLaporan(cek.laporan),
    scope: `hlm ${cek.halaman_cetak}`,
    sourceRef: aturan,
    value: cek.nilai_tertulis as number | null,
    unit: u.nilai,
    ruleId: h?.hitung != null ? `${fmtTetap(h.hitung)} ${u.nilai}` : KOSONG,
    lastUpdated: h?.selisih != null ? `${fmtBertanda(h.selisih)} ${u.selisih}` : KOSONG,
    issueDescription: `${cek.rumus_d6} · Input: ${cek.input.map((v) => fmtAngka(v, 6)).join("; ")} · Sumber: ${cek.dokumen}, hlm ${cek.halaman_cetak}`,
    ambiguityNote: cek.catatan_d6 || KOSONG,
    suggestedAction: undefined as string | undefined,
  };

  const handleResolve = () => setErrorMsg("");
  const handleMarkReviewed = () => setErrorMsg("");

  const isCritical = false;
  const isWarning = jenis === "ditandai";
  const isResolved = jenis === "luar";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Centered Modal Window (Matching Figma Frame 69-416) */}
      <div className="relative w-full max-w-2xl bg-white rounded-[16px] shadow-2xl border border-[#e5eeff] overflow-hidden z-10 transition-all my-8">
        {/* Header */}
        <div className="p-6 border-b border-[#e5eeff] bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-[#5c5e64] uppercase tracking-wider">
                Detail pemeriksaan
              </span>
              <span className="text-[#c4c6cd]">•</span>
              <span className="text-[12px] font-mono font-semibold text-[#0b1c30]">
                {selectedRecord.id}
              </span>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-[#5c5e64] hover:text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
              title="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-start justify-between gap-4 mt-2">
            <h2 className="text-[20px] font-bold text-[#0b1c30] tracking-[-0.2px] leading-tight">
              {selectedRecord.issueTitle || selectedRecord.metric}
            </h2>
            <span
              className={`shrink-0 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                isResolved
                  ? "bg-[#eff4ff] text-[#00675e] border border-[#dce9ff]"
                  : isCritical
                  ? "bg-[#ffdad6] text-[#b80035] border border-[#ffb4ab]"
                  : isWarning
                  ? "bg-[#fef3c7] text-[#d97706] border border-[#fde68a]"
                  : "bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]"
              }`}
            >
              {isResolved
                ? "Di luar cakupan"
                : isCritical
                ? KOSONG
                : isWarning
                ? "Ditandai · Warning"
                : "Tidak ditandai"}
            </span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-5 max-h-[calc(85vh-160px)] overflow-y-auto">
          {/* Feedback messages */}
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

          {/* 2-Column Info Grid Box */}
          <div className="bg-[#eff4ff] rounded-[10px] p-4 border border-[#dce9ff] grid grid-cols-2 gap-y-3.5 gap-x-6 text-[12px]">
            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Pemeriksaan
              </div>
              <div className="text-[13px] font-bold text-[#0b1c30] mt-0.5">
                {selectedRecord.id}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Laporan
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5">
                {selectedRecord.period}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Halaman cetak
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5">
                {selectedRecord.scope}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Aturan
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5 truncate">
                {selectedRecord.sourceRef || selectedRecord.metric}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Tertulis
              </div>
              <div
                className={`text-[13px] font-bold mt-0.5 ${
                  selectedRecord.value === null
                    ? "text-[#b80035]"
                    : "text-[#0b1c30]"
                }`}
              >
                {selectedRecord.value === null
                  ? KOSONG
                  : `${fmtAngka(selectedRecord.value)} ${selectedRecord.unit}`}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Hitung ulang
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5 font-mono">
                {selectedRecord.ruleId || KOSONG}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Selisih
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5">
                {selectedRecord.lastUpdated}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Hasil D6 · toleransi
              </div>
              <div className="text-[13px] font-semibold text-[#00675e] mt-0.5">
                {`${cek.hasil_d6} · ${cek.aturan_prototipe === "di_luar_cakupan" ? KOSONG : `${fmtAngka(cek.toleransi_d6)} ${u.selisih}`}`}
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-[#5c5e64] uppercase tracking-wider">
              Rumus, input, dan sumber
            </div>
            <p className="text-[13px] text-[#0b1c30] leading-relaxed bg-[#f8f9ff] p-3 rounded-[8px] border border-[#e5eeff]">
              {selectedRecord.issueDescription ||
                KOSONG}
            </p>
          </div>

          {/* Investigation & Ambiguity Callout (Amber Box) */}
          <div className="bg-[#fffbeb] border border-[#fef3c7] p-3.5 rounded-[8px] flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
            <div className="text-[12px] text-[#78350f] leading-relaxed">
              <span className="font-bold">Keterangan D6: </span>
              {selectedRecord.ambiguityNote ||
                KOSONG}
            </div>
          </div>

          {/* Suggested Remediation Action */}
          {selectedRecord.suggestedAction && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-[#5c5e64] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#5c5e64]" />
                <span>Saran tindakan</span>
              </div>
              <p className="text-[12px] text-[#5c5e64] leading-relaxed bg-[#eff4ff]/60 p-3 rounded-[8px] border border-[#dce9ff]">
                {selectedRecord.suggestedAction}
              </p>
            </div>
          )}

          {/* Reviewer Note (Mandatory for resolution) */}
          <div className="space-y-1.5 pt-2 border-t border-[#e5eeff]">
            <div className="flex items-center justify-between">
              <label
                htmlFor="reviewer-note"
                className="text-[13px] font-bold text-[#0b1c30] flex items-center gap-1"
              >
                <span>Catatan peninjau</span>
                <span className="text-[#b80035]">*</span>
              </label>
              <span className="text-[11px] text-[#5c5e64]">
                (Spesifikasi)
              </span>
            </div>
            <textarea
              id="reviewer-note"
              rows={3}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              disabled
              title="Spesifikasi"
              placeholder="—"
              className="w-full p-3 bg-[#eff4ff] border border-[#dce9ff] rounded-[8px] text-[13px] text-[#0b1c30] placeholder:text-[#5c5e64] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 focus:border-[#b80035] transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-[#f8f9ff] border-t border-[#e5eeff] flex items-center justify-between">
          <button
            type="button"
            onClick={closeDrawer}
            className="px-4 py-2 rounded-[8px] text-[13px] font-semibold text-[#5c5e64] hover:text-[#0b1c30] hover:bg-white transition-colors"
          >
            Tutup
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMarkReviewed}
              disabled
              title="Spesifikasi"
              className="px-4 py-2 rounded-[8px] bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30] font-semibold text-[13px] transition-colors"
            >
              Tandai ditinjau
            </button>
            <button
              type="button"
              onClick={handleResolve}
              disabled
              title="Spesifikasi"
              className="px-5 py-2 rounded-[8px] bg-[#b80035] hover:bg-[#9f002d] text-white font-semibold text-[13px] shadow transition-colors"
            >
              Selesaikan temuan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
