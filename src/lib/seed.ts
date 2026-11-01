// Satu-satunya sumber data aplikasi: docs-tera/tera_seed.json (dihasilkan dari D6).
// Berkas diimpor apa adanya; tidak ada angka yang disalin ke komponen.
import rawSeed from "../../docs-tera/tera_seed.json";

export type AturanPrototipe = "alpha" | "beta" | "di_luar_cakupan";

export interface Cek {
  no: number;
  kelompok: string;
  laporan: string;
  dokumen: string;
  halaman_cetak: number;
  item: string;
  nilai_tertulis: number;
  input: number[];
  rumus_d6: string;
  nilai_hitung_d6: number;
  selisih_d6: number;
  toleransi_d6: number;
  hasil_d6: string;
  aturan_prototipe: AturanPrototipe;
  catatan_d6: string | null;
}

export interface NilaiTahun {
  scope1: number;
  scope2: number;
  scope1_2: number;
}

export interface VersiBaseline {
  versi: string;
  nilai: number;
  sumber: string;
  selisih_absolut_vs_sebelumnya?: number;
  selisih_pct_vs_sebelumnya?: number;
  kode_alasan: string | null;
  catatan_laporan?: string;
}

export interface BarisRevisi {
  no: number;
  metrik: string;
  laporan_lama: string;
  nilai_lama: number;
  hlm_lama: string;
  laporan_baru: string;
  nilai_baru: number;
  hlm_baru: string;
  persen_selisih: number;
  status: string;
  catatan_alasan_ringkas?: string | null;
  hlm_catatan?: string | null;
  kategori_alasan?: string | null;
  catatan_analis?: string | null;
}

export interface TeraSeed {
  meta: Record<string, string>;
  dashboard: {
    sumber: string;
    satuan: string;
    tahun: Record<string, NilaiTahun>;
    kenaikan_2025_vs_2023: {
      tabel_pct: number;
      sumber_tabel: string;
      callout_pct: number;
      sumber_callout: string;
      hitung_ulang_pct: number;
    };
    level_target: {
      nilai: number;
      gap_ke_target: number;
      label: string;
      status: string;
    };
  };
  baseline_scope1_2_2023: VersiBaseline[];
  revisi_18: BarisRevisi[];
  tidak_direvisi_7: BarisRevisi[];
  cek_32: Cek[];
  hasil_acuan: {
    di_luar_cakupan: number[];
    ditandai: number[];
    jumlah_tercakup: number;
    tercakup_tidak_ditandai: number;
    false_positive_pada_tercakup_lolos: number;
  };
}

export const SEED = rawSeed as unknown as TeraSeed;

/** "SR25" -> "SR Telkomsel 2025" */
export function namaLaporan(kode: string): string {
  const m = /^SR(\d{2})$/.exec(kode);
  return m ? `SR Telkomsel 20${m[1]}` : kode;
}

/** "SR Telkomsel 2025, hlm 147" */
export function sumberLaporan(kode: string, halaman: number | string): string {
  return `${namaLaporan(kode)}, hlm ${halaman}`;
}
