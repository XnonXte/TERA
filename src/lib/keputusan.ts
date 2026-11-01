// Data Decision Lab: baseline FY terakhir dari seed + parameter hipotetis.
import { SEED } from "@/lib/seed";
import { TAHUN, nilaiTahun, LEVEL_TARGET, SUMBER_DASHBOARD } from "@/lib/dashboard";
import { Baseline } from "@/lib/hitung-keputusan";

export const TAHUN_BASELINE = TAHUN[TAHUN.length - 1];
const n = nilaiTahun(TAHUN_BASELINE)!;

export const BASELINE: Baseline = {
  scope1: n.scope1,
  scope2: n.scope2,
  total: n.scope1_2,
  target: LEVEL_TARGET.nilai,
};
export const GAP_AWAL = LEVEL_TARGET.gap_ke_target;
export const STATUS_TARGET = LEVEL_TARGET.status; // "Estimasi tim"
export const SUMBER_BASELINE = SUMBER_DASHBOARD;
export const SATUAN = SEED.dashboard.satuan;

// Rentang slider (% pengurangan) dan penanda di bawahnya.
export const RENTANG = { min: 0, max: 100, langkah: 1 };
export const PENANDA = [RENTANG.min, (RENTANG.min + RENTANG.max) / 2, RENTANG.max];

// Skenario awal — HIPOTETIS, hanya persentase bulat pengurangan Scope 2; biaya dan waktu kosong.
export const SKENARIO_AWAL_PERSEN_SCOPE2 = [5, 10, 20];

export const DURASI_NOTIFIKASI_MS = 4000;

export const LABEL_HIPOTETIS = "Hipotetis";

// Satuan isian pengguna di panel parameter.
export const SATUAN_BIAYA = "Rp";
export const SATUAN_WAKTU = "bulan";

// Seed tidak memuat batas harga karbon internal; null = tidak ada batas.
export const BATAS_BIAYA_PER_TON: number | null = null;
