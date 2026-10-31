"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import EmissionsTrendChart from "@/components/charts/EmissionsTrendChart";
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
import { REVISI } from "@/lib/reconciliation";
import { fmtAngka, fmtBertanda, fmtPersen, fmtWaktu, KOSONG } from "@/lib/format";

function Kartu({
  judul,
  children,
  sumber,
  badge,
}: {
  judul: string;
  children: React.ReactNode;
  sumber: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider">{judul}</span>
        {badge && (
          <span className="shrink-0 px-2 py-0.5 rounded-full border border-[#fde68a] bg-[#fffbeb] text-[11px] font-semibold text-[#78350f]">
            {badge}
          </span>
        )}
      </div>
      <div className="flex-1 space-y-1">{children}</div>
      <div className="text-[11px] text-[#5c5e64] pt-2 border-t border-[#f1f5f9]">Sumber: {sumber}</div>
    </div>
  );
}

export default function OverviewPage() {
  const { activePeriod, hasilAturan, jalankanAturanDQ, baselineAktif } = useTeraStore();

  // Kartu pemeriksaan memakai hasil aturan yang dijalankan di browser.
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
  const cek19Ditandai = r?.ditandai.includes(19);

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Dashboard"
        title="Ringkasan emisi Scope 1 dan 2"
        description={`Angka FY ${tahun} dari laporan keberlanjutan Telkomsel. Pilih periode di bagian atas untuk FY ${TAHUN.join(", ")}.`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Kartu judul={`Scope 1+2 · FY ${tahun}`} sumber={SUMBER_DASHBOARD}>
          <div className="text-[26px] font-bold text-[#0b1c30]">
            {fmtAngka(n?.scope1_2)} <span className="text-[13px] font-medium text-[#5c5e64]">{SATUAN}</span>
          </div>
          <div className="text-[13px]">
            {tahunSebelum ? `Vs FY ${tahunSebelum}: ` : "Vs tahun sebelumnya: "}
            <strong>{ubah ? `${fmtBertanda(ubah.absolute)} (${fmtPersen(ubah.percentage)})` : KOSONG}</strong>
          </div>
          {!ubah && <div className="text-[12px] text-[#5c5e64]">Tidak ada pembanding di seed.</div>}
        </Kartu>

        <Kartu
          judul={`Kenaikan ${naik.akhir} vs ${naik.awal}`}
          sumber={`${naik.sumberTabel} dan ${naik.sumberCallout}`}
        >
          <div className="text-[26px] font-bold text-[#0b1c30]">{fmtPersen(naik.hitungUlangPct)}</div>
          <div className="text-[12px] text-[#5c5e64]">Dihitung ulang dari tabel.</div>
          <div className="text-[13px]">
            Callout menulis {fmtPersen(naik.calloutPct, 2, false)}
            {cek19Ditandai ? " (ditandai, pemeriksaan #19)" : " (pemeriksaan #19)"}.{" "}
            <Link href="/data-quality?cek=19" className="text-[#b80035] font-semibold hover:underline">
              Lihat #19
            </Link>
          </div>
        </Kartu>

        <Kartu judul="Level target" sumber="Hitungan tim" badge={LEVEL_TARGET.status}>
          <div className="text-[26px] font-bold text-[#0b1c30]">
            {fmtAngka(LEVEL_TARGET.nilai)} <span className="text-[13px] font-medium text-[#5c5e64]">{SATUAN}</span>
          </div>
          <div className="text-[13px]">
            Gap FY {TAHUN[TAHUN.length - 1]}: <strong>{fmtAngka(LEVEL_TARGET.gap_ke_target)} {SATUAN}</strong>
          </div>
          <div className="text-[12px] text-[#5c5e64]">{LEVEL_TARGET.label}</div>
        </Kartu>

        <Kartu judul="Pemeriksaan ditandai" sumber="Dihitung aplikasi (aturan α dan β)" badge="In-sample">
          <div className="text-[26px] font-bold text-[#0b1c30]">
            {r ? `${r.ditandai.length} dari ${r.tercakup}` : KOSONG}
          </div>
          <div className="text-[13px]">
            {r
              ? `pemeriksaan dalam cakupan aturan α/β (${r.ditandai.map((x) => `#${x}`).join(", ")}). ${r.diLuarCakupan.length} di luar cakupan.`
              : "Aturan belum dijalankan."}
          </div>
          <div className="text-[12px] text-[#5c5e64]">Waktu eksekusi terakhir: {fmtWaktu(hasilAturan?.waktu ?? null)}</div>
          <Link href="/data-quality" className="text-[12px] text-[#b80035] font-semibold hover:underline">
            Buka Data Quality Center
          </Link>
        </Kartu>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <EmissionsTrendChart data={deretTren()} tahunAktif={tahun} satuan={SATUAN} sumber={SUMBER_DASHBOARD} />
        </div>

        <Kartu judul={`Komposisi · FY ${tahun}`} sumber={SUMBER_DASHBOARD}>
          <div className="flex h-3 rounded-full overflow-hidden bg-[#f1f5f9] my-2" aria-hidden>
            <div className="bg-[#0b1c30]" style={{ width: `${komp.pctScope2}%` }} />
            <div className="bg-[#b80035]" style={{ width: `${komp.pctScope1}%` }} />
          </div>
          <div className="text-[13px] flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0b1c30]" /> Scope 2
            </span>
            <span>
              <strong>{fmtAngka(komp.scope2)}</strong> ({fmtPersen(komp.pctScope2, 2, false)})
            </span>
          </div>
          <div className="text-[13px] flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#b80035]" /> Scope 1
            </span>
            <span>
              <strong>{fmtAngka(komp.scope1)}</strong> ({fmtPersen(komp.pctScope1, 2, false)})
            </span>
          </div>
          <div className="text-[12px] text-[#5c5e64]">Satuan {SATUAN}.</div>
        </Kartu>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm">
          <h3 className="text-[14px] font-bold text-[#0b1c30]">Emisi per scope ({SATUAN})</h3>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-[13px]">
              <thead className="text-[12px] text-[#5c5e64] text-left bg-[#eff4ff]">
                <tr>
                  <th className="px-3 py-2">Scope</th>
                  {TAHUN.map((t) => (
                    <th key={t} className={`px-3 py-2 text-right ${t === tahun ? "text-[#0b1c30]" : ""}`}>
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
                  <tr key={k} className={k === "scope1_2" ? "font-semibold" : ""}>
                    <td className="px-3 py-2">{label}</td>
                    {TAHUN.map((t) => (
                      <td key={t} className={`px-3 py-2 text-right ${t === tahun ? "bg-[#f8f9ff]" : ""}`}>
                        {fmtAngka(nilaiTahun(t)?.[k])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-[#5c5e64] mt-3">
            Sumber: {SUMBER_DASHBOARD}.
            {r?.ditandai.includes(1) &&
              " Scope 1 FY 2025 ditandai pada pemeriksaan #1 (jumlah komponen tidak sama dengan total tertulis)."}
          </div>
        </div>

        <Kartu judul="Rekonsiliasi" sumber="Seed (tiga versi baseline 2023 dan revisi lintas laporan)">
          <div className="text-[13px] flex justify-between gap-2">
            <span className="text-[#5c5e64]">Baseline aktif (simulasi)</span>
            <strong>{baselineAktif ?? "Belum ada"}</strong>
          </div>
          <div className="text-[13px] flex justify-between gap-2">
            <span className="text-[#5c5e64]">Revisi lintas laporan</span>
            <strong>{REVISI.length} metrik</strong>
          </div>
          <div className="text-[13px] flex justify-between gap-2">
            <span className="text-[#5c5e64]">Kode alasan revisi</span>
            <strong>{Array.from(new Set(REVISI.map((x) => x.kodeAlasan))).join(", ")}</strong>
          </div>
          <Link
            href="/reconciliation"
            className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-[#b80035] hover:underline"
          >
            Buka Baseline Reconciliation <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Kartu>
      </div>
    </div>
  );
}
