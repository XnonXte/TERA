// Angka Dashboard dihitung dari SEED.dashboard (SR Telkomsel 2025, hlm 147).
import { SEED, NilaiTahun } from "@/lib/seed";
import { calculateDifference } from "@/lib/calculations";
import type { DifferenceResult } from "@/types/tera";

const D = SEED.dashboard;

export const SUMBER_DASHBOARD = D.sumber;
export const SATUAN = D.satuan;
export const TAHUN: string[] = Object.keys(D.tahun).sort();

/** "FY 2025" -> "2025"; tahun yang tidak ada di seed -> tahun terakhir. */
export function tahunDariPeriode(periode: string): string {
  const t = periode.replace(/\D/g, "");
  return TAHUN.includes(t) ? t : TAHUN[TAHUN.length - 1];
}

export function nilaiTahun(tahun: string): NilaiTahun | null {
  return D.tahun[tahun] ?? null;
}

/** Perubahan Scope 1+2 terhadap tahun sebelumnya; null bila tidak ada pembanding di seed. */
export function perubahanVsSebelumnya(tahun: string): DifferenceResult | null {
  const i = TAHUN.indexOf(tahun);
  if (i <= 0) return null;
  return calculateDifference(D.tahun[TAHUN[i - 1]].scope1_2, D.tahun[tahun].scope1_2);
}

/** Porsi Scope 1 dan Scope 2 terhadap Scope 1+2 (persen). */
export function komposisi(tahun: string) {
  const n = D.tahun[tahun];
  return {
    scope1: n.scope1,
    scope2: n.scope2,
    pctScope1: (n.scope1 / n.scope1_2) * 100,
    pctScope2: (n.scope2 / n.scope1_2) * 100,
  };
}

/** Kenaikan 2025 vs 2023 dihitung ulang dari tabel, dibandingkan dengan angka callout. */
export function kenaikanTerakhirVsAwal() {
  const awal = TAHUN[0];
  const akhir = TAHUN[TAHUN.length - 1];
  const hitung = calculateDifference(D.tahun[awal].scope1_2, D.tahun[akhir].scope1_2);
  return {
    awal,
    akhir,
    hitungUlangPct: hitung.percentage,
    calloutPct: D.kenaikan_2025_vs_2023.callout_pct,
    sumberTabel: D.kenaikan_2025_vs_2023.sumber_tabel,
    sumberCallout: D.kenaikan_2025_vs_2023.sumber_callout,
  };
}

export const LEVEL_TARGET = D.level_target;

export function deretTren() {
  return TAHUN.map((t) => ({
    year: t,
    scope1: D.tahun[t].scope1,
    scope2: D.tahun[t].scope2,
    target: D.level_target.nilai,
  }));
}
