// Kalkulator skenario hipotetis di atas baseline seed (tanpa impor supaya bisa diuji langsung dengan Node).

export interface Baseline {
  scope1: number;
  scope2: number;
  total: number; // total tertulis pada laporan
  target: number; // level target (estimasi tim)
}

export interface ParameterSkenario {
  persenScope2: number; // pengurangan Scope 2 (%)
  persenScope1: number; // pengurangan Scope 1 (%)
  biaya: number | null; // isian pengguna; null = belum diisi
  waktu: number | null;
}

export interface HasilSkenario {
  pengurangan: number;
  emisiSesudah: number;
  sisaGap: number;
  persenGapTertutup: number | null;
  biayaPerTon: number | null;
}

const PERSEN = 100;

/**
 * Pengurangan = S1×r1 + S2×r2. Emisi sesudah = total tertulis − pengurangan
 * (setara S1×(1−r1) + S2×(1−r2), tetapi memakai total tertulis sehingga pada 0% sama dengan laporan).
 */
export function hitungSkenario(b: Baseline, p: ParameterSkenario): HasilSkenario {
  const pengurangan = b.scope1 * (p.persenScope1 / PERSEN) + b.scope2 * (p.persenScope2 / PERSEN);
  const emisiSesudah = b.total - pengurangan;
  const gapAwal = b.total - b.target;
  const sisaGap = emisiSesudah - b.target;
  return {
    pengurangan,
    emisiSesudah,
    sisaGap,
    persenGapTertutup: gapAwal === 0 ? null : (pengurangan / gapAwal) * PERSEN,
    biayaPerTon: p.biaya !== null && pengurangan > 0 ? p.biaya / pengurangan : null,
  };
}

/** Urutan murni berdasarkan pengurangan hipotetis (terbesar dulu); bukan rekomendasi. */
export function urutkanSkenario<T extends { hasil: HasilSkenario }>(xs: T[]): T[] {
  return [...xs].sort((a, b) => b.hasil.pengurangan - a.hasil.pengurangan);
}

/** Isian angka pengguna: kosong, bukan angka, atau negatif → null. */
export function bacaIsian(s: string): number | null {
  if (s.trim() === "") return null;
  const x = Number(s);
  return Number.isFinite(x) && x >= 0 ? x : null;
}

/** Lebar batang (%) dari porsi pengurangan terhadap total, dibatasi 0–100. */
export function porsiBatang(x: number | null, total: number): number {
  if (x === null || total <= 0) return 0;
  return Math.min(PERSEN, Math.max(0, (x / total) * PERSEN));
}

/** Benar hanya bila ada batas; tanpa batas (null) selalu salah. */
export function diAtasBatas(x: number | null, batas: number | null): boolean {
  return batas !== null && x !== null && x > batas;
}
