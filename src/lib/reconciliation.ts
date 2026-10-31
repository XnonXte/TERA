// Logika Baseline Reconciliation: perbandingan versi, alur persetujuan (simulasi), dan tabel revisi.
import { calculateDifference } from "@/lib/calculations";
import { SEED, VersiBaseline, BarisRevisi, sumberLaporan } from "@/lib/seed";
import type { DifferenceResult } from "@/types/tera";

export const VERSI: VersiBaseline[] = SEED.baseline_scope1_2_2023;

export function cariVersi(versi: string): VersiBaseline | undefined {
  return VERSI.find((v) => v.versi === versi);
}

/** Selisih B − A dan persen terhadap A. */
export function bandingkanVersi(a: VersiBaseline, b: VersiBaseline): DifferenceResult {
  return calculateDifference(a.nilai, b.nilai);
}

// ---- Alur persetujuan (simulasi di browser) ----

export type StatusSimulasi = "draft" | "pending_review" | "approved" | "rejected";
export type AksiSimulasi = "ajukan" | "setujui" | "tolak";

export const LABEL_STATUS: Record<StatusSimulasi, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  approved: "Approved (simulasi)",
  rejected: "Rejected (simulasi)",
};

const TRANSISI: Record<StatusSimulasi, Partial<Record<AksiSimulasi, StatusSimulasi>>> = {
  draft: { ajukan: "pending_review" },
  pending_review: { setujui: "approved", tolak: "rejected" },
  approved: {},
  rejected: {},
};

/** Status berikutnya, atau null bila aksi tidak berlaku pada status ini. */
export function transisiStatus(status: StatusSimulasi, aksi: AksiSimulasi): StatusSimulasi | null {
  return TRANSISI[status][aksi] ?? null;
}

export function aksiTersedia(status: StatusSimulasi): AksiSimulasi[] {
  return Object.keys(TRANSISI[status]) as AksiSimulasi[];
}

export function alasanValid(alasan: string): boolean {
  return alasan.trim().length > 0;
}

export function statusAwal(): Record<string, StatusSimulasi> {
  return Object.fromEntries(VERSI.map((v) => [v.versi, "draft" as StatusSimulasi]));
}

// ---- Revisi lintas laporan ----

export interface BarisRevisiTampil {
  kunci: string;
  metrik: string;
  nilaiLama: number;
  sumberLama: string;
  nilaiBaru: number;
  sumberBaru: string;
  persen: number;
  status: "Revisi" | "Identik";
  catatanJenis: "Catatan umum" | "Tidak ada catatan" | "Catatan spesifik" | null;
  catatanLaporan: string | null;
  catatanAnalis: string | null;
  kodeAlasan: string;
}

const JENIS_CATATAN: Record<string, BarisRevisiTampil["catatanJenis"]> = {
  UMUM: "Catatan umum",
  "TIDAK ADA": "Tidak ada catatan",
  SPESIFIK: "Catatan spesifik",
};

function keTampil(r: BarisRevisi, kelompok: string): BarisRevisiTampil {
  const revisi = r.status === "REVISI";
  const hlmCatatan = r.hlm_catatan ? ` (hlm ${r.hlm_catatan})` : "";
  return {
    kunci: `${kelompok}-${r.no}`,
    metrik: r.metrik,
    nilaiLama: r.nilai_lama,
    sumberLama: sumberLaporan(r.laporan_lama, r.hlm_lama),
    nilaiBaru: r.nilai_baru,
    sumberBaru: sumberLaporan(r.laporan_baru, r.hlm_baru),
    persen: r.persen_selisih,
    status: revisi ? "Revisi" : "Identik",
    catatanJenis: r.kategori_alasan ? JENIS_CATATAN[r.kategori_alasan] ?? null : null,
    catatanLaporan: r.catatan_alasan_ringkas ? `${r.catatan_alasan_ringkas}${hlmCatatan}` : null,
    catatanAnalis: r.catatan_analis ?? null,
    // Panduan: kode alasan revisi "Unresolved" untuk semua (0 dari 18 revisi punya alasan spesifik di D6).
    kodeAlasan: revisi ? "Unresolved" : "—",
  };
}

export const REVISI: BarisRevisiTampil[] = SEED.revisi_18.map((r) => keTampil(r, "rev"));
export const TIDAK_DIREVISI: BarisRevisiTampil[] = SEED.tidak_direvisi_7.map((r) => keTampil(r, "idt"));

export function hitungJenisCatatan(rows: BarisRevisiTampil[]) {
  return {
    umum: rows.filter((r) => r.catatanJenis === "Catatan umum").length,
    tidakAda: rows.filter((r) => r.catatanJenis === "Tidak ada catatan").length,
    spesifik: rows.filter((r) => r.catatanJenis === "Catatan spesifik").length,
  };
}

// ---- Nilai per scope untuk satu versi baseline (dicari di tabel revisi seed, tidak dihitung) ----

export interface NilaiBersumber {
  nilai: number;
  sumber: string;
}

/** "SR 2024" -> "SR24" */
function kodeLaporan(versi: string): string | null {
  const m = /^SR (\d{2})(\d{2})$/.exec(versi);
  return m ? `SR${m[2]}` : null;
}

/**
 * Mencari nilai metrik (mis. "Scope 1 2023") yang dituliskan oleh laporan versi tertentu,
 * dari kolom lama/baru di revisi_18 dan tidak_direvisi_7. Null bila tidak ada atau tidak konsisten.
 */
export function nilaiMetrikVersi(metrik: string, versi: string): NilaiBersumber | null {
  const kode = kodeLaporan(versi);
  if (!kode) return null;
  const temuan: NilaiBersumber[] = [];
  for (const r of [...SEED.revisi_18, ...SEED.tidak_direvisi_7]) {
    if (r.metrik !== metrik) continue;
    if (r.laporan_lama === kode) temuan.push({ nilai: r.nilai_lama, sumber: sumberLaporan(r.laporan_lama, r.hlm_lama) });
    if (r.laporan_baru === kode) temuan.push({ nilai: r.nilai_baru, sumber: sumberLaporan(r.laporan_baru, r.hlm_baru) });
  }
  if (temuan.length === 0) return null;
  return temuan.every((t) => t.nilai === temuan[0].nilai) ? temuan[0] : null;
}

export interface VariansScope {
  a: NilaiBersumber;
  b: NilaiBersumber;
  beda: DifferenceResult;
}

/** Selisih per scope (B − A) bila seed memuat nilai scope itu untuk kedua versi; selain itu null. */
export function variansScope(scope: "Scope 1" | "Scope 2", versiA: string, versiB: string): VariansScope | null {
  const a = nilaiMetrikVersi(`${scope} 2023`, versiA);
  const b = nilaiMetrikVersi(`${scope} 2023`, versiB);
  if (!a || !b) return null;
  return { a, b, beda: calculateDifference(a.nilai, b.nilai) };
}
