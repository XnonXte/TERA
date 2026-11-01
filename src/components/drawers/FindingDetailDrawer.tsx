"use client";

import React, { useState, useEffect } from "react";
import { X, AlertTriangle, CheckCircle2, Info, FileText } from "lucide-react";
import { useTeraStore } from "@/stores/useTeraStore";

export default function FindingDetailDrawer() {
  const {
    selectedRecord,
    isDrawerOpen,
    closeDrawer,
    resolveFinding,
    markAsReviewed,
  } = useTeraStore();

  const [note, setNote] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (selectedRecord) {
      setNote(selectedRecord.reviewerNote || "");
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [selectedRecord]);

  if (!isDrawerOpen || !selectedRecord) return null;

  const handleResolve = () => {
    if (!note || note.trim().length === 0) {
      setErrorMsg("Reviewer Note wajib diisi sebelum menyelesaikan temuan (PRD Rule).");
      return;
    }

    const success = resolveFinding(selectedRecord.id, note);
    if (success) {
      setSuccessMsg("Temuan berhasil diselesaikan dan dicatat ke Immutable Audit Trail.");
      setTimeout(() => {
        closeDrawer();
      }, 700);
    }
  };

  const handleMarkReviewed = () => {
    markAsReviewed(selectedRecord.id);
    closeDrawer();
  };

  const isCritical =
    selectedRecord.validationStatus === "error" && !selectedRecord.resolved;
  const isWarning =
    selectedRecord.validationStatus === "warning" && !selectedRecord.resolved;
  const isResolved = selectedRecord.resolved;

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
                Finding Detail
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
                ? "Resolved"
                : isCritical
                ? "Critical"
                : isWarning
                ? "Warning"
                : "Valid"}
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
                Record ID
              </div>
              <div className="text-[13px] font-bold text-[#0b1c30] mt-0.5">
                {selectedRecord.id}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Reporting Period
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5">
                {selectedRecord.period}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                GHG Scope
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5">
                {selectedRecord.scope}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Facility / Source
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5 truncate">
                {selectedRecord.sourceRef || selectedRecord.metric}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Telemetry Reading
              </div>
              <div
                className={`text-[13px] font-bold mt-0.5 ${
                  selectedRecord.value === null
                    ? "text-[#b80035]"
                    : "text-[#0b1c30]"
                }`}
              >
                {selectedRecord.value === null
                  ? "(Missing reading)"
                  : `${selectedRecord.value.toLocaleString()} ${selectedRecord.unit}`}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Validation Rule
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5 font-mono">
                {selectedRecord.ruleId || "DQ-01 Missing Data Threshold"}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Last Evaluated
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5">
                {selectedRecord.lastUpdated}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">
                Audit Status
              </div>
              <div className="text-[13px] font-semibold text-[#00675e] mt-0.5">
                {isResolved ? "Resolved & Signed Off" : "Open for Resolution"}
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-[#5c5e64] uppercase tracking-wider">
              Issue Description
            </div>
            <p className="text-[13px] text-[#0b1c30] leading-relaxed bg-[#f8f9ff] p-3 rounded-[8px] border border-[#e5eeff]">
              {selectedRecord.issueDescription ||
                "No rule violation detected for this record. All telemetry values pass sanity checks."}
            </p>
          </div>

          {/* Investigation & Ambiguity Callout (Amber Box) */}
          <div className="bg-[#fffbeb] border border-[#fef3c7] p-3.5 rounded-[8px] flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
            <div className="text-[12px] text-[#78350f] leading-relaxed">
              <span className="font-bold">Investigasi & Ambang Batas: </span>
              {selectedRecord.ambiguityNote ||
                "Pastikan konfirmasi dengan pengelola fasilitas atau cek transmisi IoT sebelum melakukan koreksi atau estimasi data pengganti."}
            </div>
          </div>

          {/* Suggested Remediation Action */}
          {selectedRecord.suggestedAction && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-[#5c5e64] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#5c5e64]" />
                <span>Suggested Action</span>
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
                <span>Reviewer Note</span>
                <span className="text-[#b80035]">*</span>
              </label>
              <span className="text-[11px] text-[#5c5e64]">
                (Wajib diisi untuk Resolve Finding)
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
              placeholder="Isi catatan verifikasi, nomor referensi invoice, atau metodologi imputasi..."
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
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMarkReviewed}
              className="px-4 py-2 rounded-[8px] bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30] font-semibold text-[13px] transition-colors"
            >
              Mark as Reviewed
            </button>
            <button
              type="button"
              onClick={handleResolve}
              className="px-5 py-2 rounded-[8px] bg-[#b80035] hover:bg-[#9f002d] text-white font-semibold text-[13px] shadow transition-colors"
            >
              Resolve Finding
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
