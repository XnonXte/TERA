"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, ShieldCheck, ArrowRight, TrendingUp, RotateCw, Sliders } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import KpiCard from "@/components/ui/KpiCard";
import EmissionsTrendChart from "@/components/charts/EmissionsTrendChart";
import EmissionsDonutChart from "@/components/charts/EmissionsDonutChart";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTeraStore } from "@/stores/useTeraStore";
import {
  SUMBER_DASHBOARD,
  SATUAN,
  TAHUN,
  tahunDariPeriode,
  nilaiTahun,
  perubahanVsSebelumnya,
  komposisi,
  kenaikanTerakhirVsAwal,
  LEVEL_TARGET,
  deretTren,
} from "@/lib/dashboard";
import { SEED, sumberLaporan } from "@/lib/seed";
import { INFO_ATURAN, TEKS_HASIL } from "@/lib/dq";
import { REVISI } from "@/lib/reconciliation";
import { fmtAngka, fmtBertanda, fmtPersen, fmtWaktu, KOSONG } from "@/lib/format";

export default function OverviewPage() {
  const router = useRouter();
  const { activePeriod, hasilAturan, jalankanAturanDQ, bukaCek, baselineAktif } = useTeraStore();

  // Kartu dan daftar pemeriksaan memakai hasil aturan yang dijalankan di browser.
  useEffect(() => {
    if (!hasilAturan) jalankanAturanDQ();
  }, [hasilAturan, jalankanAturanDQ]);

  const tahun = tahunDariPeriode(activePeriod);
  const n = nilaiTahun(tahun);
  const ubah = perubahanVsSebelumnya(tahun);
  const tahunSebelum = TAHUN[TAHUN.indexOf(tahun) - 1];
  const komp = komposisi(tahun);
  const naik = kenaikanTerakhirVsAwal();
  const r = hasilAturan?.ringkasan;
  const cekDitandai = SEED.cek_32.filter((c) => r?.ditandai.includes(c.no));
  const kodeAlasan = Array.from(new Set(REVISI.map((x) => x.kodeAlasan))).join(", ");

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        badge="DASHBOARD"
        title="Ringkasan Emisi Scope 1 & 2"
        description={`FY ${tahun}: emisi Scope 1 dan 2, hasil pemeriksaan data, dan status rekonsiliasi baseline dari laporan keberlanjutan Telkomsel. Pilih periode di bagian atas untuk FY ${TAHUN.join(", ")}.`}
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

      {/* 4 Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label={`Scope 1+2 · FY ${tahun}`}
          value={fmtAngka(n?.scope1_2)}
          unit={SATUAN}
          delta={
            ubah
              ? { value: fmtPersen(ubah.percentage), isPositiveGood: false, label: `vs FY ${tahunSebelum}` }
              : { value: KOSONG, isNeutral: true, label: "tanpa pembanding" }
          }
          subtitle={ubah ? `${fmtBertanda(ubah.absolute)} ${SATUAN}` : "Tidak ada pembanding di seed"}
          footnote={`Sumber: ${SUMBER_DASHBOARD}`}
          icon={<Flame className="w-4 h-4 text-[#b80035]" />}
        />
        <KpiCard
          label="Pemeriksaan ditandai"
          value={r ? `${r.ditandai.length} dari ${r.tercakup}` : KOSONG}
          badge={{ text: "In-sample", variant: "amber" }}
          subtitle={
            r ? `${r.ditandai.map((x) => `#${x}`).join(", ")} · ${r.diLuarCakupan.length} di luar cakupan` : "Aturan belum dijalankan"
          }
          footnote={`Dalam cakupan aturan α/β. Dihitung aplikasi, ${fmtWaktu(hasilAturan?.waktu ?? null)}.`}
          onClick={() => router.push("/data-quality")}
          icon={<ShieldCheck className="w-4 h-4 text-[#00675e]" />}
        />
        <KpiCard
          label={`Kenaikan ${naik.akhir} vs ${naik.awal}`}
          value={fmtPersen(naik.hitungUlangPct)}
          subtitle="Dihitung ulang dari tabel"
          badge={{
            text: `Callout ${fmtPersen(naik.calloutPct, 2, false)}${r?.ditandai.includes(19) ? " · ditandai #19" : " · #19"}`,
            variant: "red",
          }}
          footnote={`Sumber: ${naik.sumberTabel} dan ${naik.sumberCallout}.`}
          onClick={() => router.push("/data-quality?cek=19")}
          icon={<TrendingUp className="w-4 h-4 text-[#0b1c30]" />}
        />
        <KpiCard
          label="Level target"
          value={fmtAngka(LEVEL_TARGET.nilai)}
          unit={SATUAN}
          badge={{ text: LEVEL_TARGET.status, variant: "amber" }}
          delta={{
            value: fmtAngka(LEVEL_TARGET.gap_ke_target),
            isNeutral: true,
            label: `gap FY ${TAHUN[TAHUN.length - 1]}`,
          }}
          footnote={`${LEVEL_TARGET.label}. Sumber: hitungan tim.`}
          icon={<Sliders className="w-4 h-4 text-[#b80035]" />}
        />
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EmissionsTrendChart data={deretTren()} satuan={SATUAN} sumber={SUMBER_DASHBOARD} />
        </div>
        <div className="lg:col-span-1">
          <EmissionsDonutChart
            tahun={tahun}
            scope1={komp.scope1}
            scope2={komp.scope2}
            pctScope1={komp.pctScope1}
            pctScope2={komp.pctScope2}
            total={n?.scope1_2 ?? 0}
            satuan={SATUAN}
            sumber={SUMBER_DASHBOARD}
          />
        </div>
      </div>

      {/* Bottom Row: Flagged Checks & Reconciliation Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flagged checks */}
        <div className="bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-bold text-[#0b1c30]">Pemeriksaan ditandai</h3>
              <p className="text-[12px] text-[#5c5e64]">
                Aturan α dan β · in-sample
              </p>
            </div>
            <Link
              href="/data-quality"
              className="text-[12px] font-semibold text-[#b80035] hover:underline flex items-center gap-1"
            >
              <span>Lihat semua ({SEED.cek_32.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {cekDitandai.map((c) => (
              <div
                key={c.no}
                onClick={() => bukaCek(c.no)}
                className="py-3 flex items-start justify-between gap-4 cursor-pointer hover:bg-[#f8f9ff] px-2 rounded-lg transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12px] font-bold text-[#0b1c30]">#{c.no}</span>
                    <span className="text-[11px] text-[#5c5e64]">
                      {c.aturan_prototipe !== "di_luar_cakupan" &&
                        `Aturan ${INFO_ATURAN[c.aturan_prototipe].simbol} (${INFO_ATURAN[c.aturan_prototipe].ruleId})`}
                    </span>
                    <StatusBadge status="warning" size="sm" label={TEKS_HASIL.ditandai} />
                  </div>
                  <div className="text-[13px] font-medium text-[#0b1c30]">{c.item}</div>
                  <div className="text-[11px] text-[#5c5e64]">Sumber: {sumberLaporan(c.laporan, c.halaman_cetak)}</div>
                </div>

                <button
                  type="button"
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#b80035] bg-[#fff1f2] rounded border border-[#ffdad6] hover:bg-[#ffe4e6] shrink-0"
                >
                  Lihat detail
                </button>
              </div>
            ))}
            {!r && <div className="py-3 px-2 text-[13px] text-[#5c5e64]">Aturan belum dijalankan.</div>}
          </div>
        </div>

        {/* Baseline Reconciliation Status */}
        <div className="bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[14px] font-bold text-[#0b1c30]">Baseline Reconciliation</h3>
              <StatusBadge
                status={baselineAktif ? "approved" : "pending_review"}
                label={baselineAktif ? "Approved (simulasi)" : "Simulasi"}
                size="sm"
              />
            </div>
            <p className="text-[12px] text-[#5c5e64]">
              Tiga versi baseline Scope 1+2 2023 dan revisi lintas laporan. Persetujuan disimulasikan.
            </p>

            <div className="mt-4 p-4 bg-[#eff4ff] rounded-xl border border-[#dce9ff] space-y-3">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#5c5e64]">Baseline aktif (simulasi):</span>
                <span className="font-bold text-[#0b1c30]">{baselineAktif ?? "Belum ada"}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#5c5e64]">Revisi lintas laporan:</span>
                <span className="font-bold text-[#b80035]">{REVISI.length} metrik</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#5c5e64]">Kode alasan revisi:</span>
                <span className="font-bold text-[#b80035]">{kodeAlasan}</span>
              </div>
              <div className="pt-2 border-t border-[#dce9ff] text-[11px] text-[#5c5e64]">
                Sumber: seed (tiga versi baseline 2023 dan revisi lintas laporan).
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <Link
              href="/reconciliation"
              className="w-full text-center px-4 py-2.5 rounded-lg bg-[#0b1c30] text-white font-semibold text-[13px] hover:bg-[#1a2d45] transition-colors flex items-center justify-center gap-2"
            >
              <span>Buka Baseline Reconciliation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Per-scope table (panduan 3.2) */}
      <div className="bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-[14px] font-bold text-[#0b1c30]">Emisi per scope ({SATUAN})</h3>
          <p className="text-[12px] text-[#5c5e64]">Sumber: {SUMBER_DASHBOARD}</p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-[#e5eeff]">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#eff4ff] text-[#5c5e64] text-[11px] uppercase tracking-wider font-semibold">
                <th className="px-4 py-3">Scope</th>
                {TAHUN.map((t) => (
                  <th key={t} className={`px-4 py-3 text-right ${t === tahun ? "text-[#0b1c30]" : ""}`}>
                    FY {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {(
                [
                  ["Scope 1", "scope1"],
                  ["Scope 2", "scope2"],
                  ["Scope 1+2", "scope1_2"],
                ] as const
              ).map(([label, k]) => (
                <tr key={k} className={`hover:bg-[#f8f9ff] ${k === "scope1_2" ? "font-semibold" : ""}`}>
                  <td className="px-4 py-3 text-[#0b1c30]">{label}</td>
                  {TAHUN.map((t) => (
                    <td key={t} className={`px-4 py-3 text-right ${t === tahun ? "bg-[#f8f9ff] font-semibold" : ""}`}>
                      {fmtAngka(nilaiTahun(t)?.[k])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {r?.ditandai.includes(1) && (
          <p className="text-[11px] text-[#5c5e64]">
            Scope 1 FY 2025 ditandai pada pemeriksaan #1 (jumlah komponen tidak sama dengan total tertulis).
          </p>
        )}
      </div>
    </div>
  );
}
