"use client";

import React, { useState, useEffect } from "react";
import { X, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useTeraStore } from "@/stores/useTeraStore";

export default function FindingDetailDrawer() {
  const { selectedRecord, isDrawerOpen, closeDrawer, resolveFinding, markAsReviewed } =
    useTeraStore();

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
      setSuccessMsg("Temuan berhasil diselesaikan dan dicatat ke Audit Trail.");
      setTimeout(() => {
        closeDrawer();
      }, 700);
    }
  };

  const handleMarkReviewed = () => {
    markAsReviewed(selectedRecord.id);
    closeDrawer();
  };

  const isCritical = selectedRecord.validationStatus === "error";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0b1c30]/40 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xl bg-white shadow-drawer h-full overflow-y-auto flex flex-col justify-between z-10 transition-transform">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#e5eeff]">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-[16px] font-semibold text-[#0b1c30] tracking-tight">
                  Finding Detail
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isCritical
                      ? "bg-[#fff1f2] text-[#be123c]"
                      : selectedRecord.validationStatus === "warning"
                      ? "bg-[#fffbeb] text-[#b45309]"
                      : "bg-[#ecfdf5] text-[#047857]"
                  }`}
                >
                  {isCritical ? "Critical" : selectedRecord.validationStatus === "warning" ? "Warning" : "Valid"}
                </span>
              </div>
              <h2 className="text-[22px] font-semibold text-[#0b1c30] tracking-tight leading-tight">
                {selectedRecord.issueTitle || selectedRecord.metric}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-[#5c5e64] hover:text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 bg-[#fff1f2] border border-[#ffdad6] rounded-lg text-[13px] text-[#93000a] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#b80035]" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-lg text-[13px] text-[#065f46] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Attributes Grid */}
          <div className="bg-[#eff4ff] p-4 rounded-xl grid grid-cols-2 gap-y-3.5 gap-x-4 border border-[#dce9ff]">
            <div>
              <div className="text-[11px] font-medium text-[#5c5e64] uppercase tracking-wider">
                Record ID
              </div>
              <div className="text-[13px] font-bold text-[#0b1c30] mt-0.5">
                {selectedRecord.id}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#5c5e64] uppercase tracking-wider">
                Period
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5">
                {selectedRecord.period}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#5c5e64] uppercase tracking-wider">
                Scope
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5">
                {selectedRecord.scope}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#5c5e64] uppercase tracking-wider">
                Metric
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5">
                {selectedRecord.metric}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#5c5e64] uppercase tracking-wider">
                Value
              </div>
              <div
                className={`text-[13px] font-bold mt-0.5 ${
                  selectedRecord.value === null ? "text-[#b80035]" : "text-[#0b1c30]"
                }`}
              >
                {selectedRecord.value === null ? "(missing)" : selectedRecord.value.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#5c5e64] uppercase tracking-wider">
                Unit
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5">
                {selectedRecord.unit}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#5c5e64] uppercase tracking-wider">
                Source
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5 truncate">
                {selectedRecord.sourceRef || "(no source linked)"}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#5c5e64] uppercase tracking-wider">
                Last Updated
              </div>
              <div className="text-[13px] font-medium text-[#0b1c30] mt-0.5">
                {selectedRecord.lastUpdated}
              </div>
            </div>
          </div>

          {/* Issue Description & Rules */}
          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider mb-1">
                ISSUE DESCRIPTION
              </div>
              <p className="text-[13px] text-[#0b1c30] leading-relaxed">
                {selectedRecord.issueDescription || "No rule violation detected for this record."}
              </p>
            </div>

            {/* Ambiguity / Investigation Box */}
            <div className="bg-[#fffbeb] border border-[#fef3c7] p-3 rounded-lg flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#78350f] leading-relaxed">
                <span className="font-bold">Ambang anomali & investigasi:</span>{" "}
                {selectedRecord.ambiguityNote ||
                  "Jangan mengasumsikan data salah secara sepihak; periksa apakah ada penghentian operasi atau kendala transmisi telemetry sebelum mengoreksi."}
              </div>
            </div>

            {/* Suggested Action */}
            {selectedRecord.suggestedAction && (
              <div>
                <div className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider mb-1">
                  SUGGESTED ACTION
                </div>
                <p className="text-[13px] text-[#5c5e64] leading-relaxed">
                  {selectedRecord.suggestedAction}
                </p>
              </div>
            )}
          </div>

          {/* Reviewer Note Section */}
          <div className="space-y-1.5 pt-2 border-t border-[#e5eeff]">
            <label
              htmlFor="reviewer-note"
              className="text-[13px] font-semibold text-[#0b1c30] flex items-center gap-1"
            >
              <span>Reviewer Note</span>
              <span className="text-[#b80035]">*</span>
              <span className="text-[11px] font-normal text-[#5c5e64] ml-1">
                (Wajib diisi untuk Resolve Finding)
              </span>
            </label>
            <textarea
              id="reviewer-note"
              rows={3}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="Isi catatan atau alasan sebelum menyelesaikan temuan (Wajib untuk Resolve Finding)..."
              className="w-full p-3 bg-[#eff4ff] border border-[#dce9ff] rounded-lg text-[13px] text-[#0b1c30] placeholder:text-[#5c5e64] focus:outline-none focus:ring-2 focus:ring-[#b80035]/20 focus:border-[#b80035] transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#f8f9ff] border-t border-[#e5eeff] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleMarkReviewed}
            className="px-5 py-2.5 rounded-lg bg-[#e5eeff] hover:bg-[#dce9ff] text-[#0b1c30] font-semibold text-[14px] transition-colors"
          >
            Mark as Reviewed
          </button>
          <button
            type="button"
            onClick={handleResolve}
            className="px-6 py-2.5 rounded-lg bg-[#b80035] hover:bg-[#9f002d] text-white font-semibold text-[14px] shadow transition-colors"
          >
            Resolve Finding
          </button>
        </div>
      </div>
    </div>
  );
}
