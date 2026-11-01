// Dekomposisi perubahan emisi Scope 1+2 dari nilai seed (tanpa impor supaya bisa diuji langsung dengan Node).

export interface NilaiScope {
  scope1: number;
  scope2: number;
  scope1_2: number; // total tertulis pada laporan
}

export interface Dekomposisi {
  awal: number;
  akhir: number;
  deltaTotal: number; // total tertulis akhir − awal
  deltaScope2: number; // FY akhir − FY awal
  deltaScope1: number;
  pembulatan: number; // total tertulis akhir − (awal + Δ Scope 2 + Δ Scope 1)
  kontribusiScope2Pct: number | null; // Δ scope / Δ total × 100
  kontribusiScope1Pct: number | null;
}

export function dekomposisi(awal: NilaiScope, akhir: NilaiScope): Dekomposisi {
  const deltaScope2 = akhir.scope2 - awal.scope2;
  const deltaScope1 = akhir.scope1 - awal.scope1;
  const deltaTotal = akhir.scope1_2 - awal.scope1_2;
  const pembulatan = akhir.scope1_2 - (awal.scope1_2 + deltaScope2 + deltaScope1);
  const persen = (x: number) => (deltaTotal === 0 ? null : (x / deltaTotal) * 100);
  return {
    awal: awal.scope1_2,
    akhir: akhir.scope1_2,
    deltaTotal,
    deltaScope2,
    deltaScope1,
    pembulatan,
    kontribusiScope2Pct: persen(deltaScope2),
    kontribusiScope1Pct: persen(deltaScope1),
  };
}

export type JenisLangkah = "anchor" | "increase" | "reduction" | "unresolved";

export interface LangkahWaterfall {
  id: string;
  nama: string;
  jenis: JenisLangkah;
  nilai: number; // nilai bar (total untuk anchor, delta untuk lainnya)
  kumulatif: number; // posisi setelah langkah ini
}

/** Total awal → Δ Scope 2 → Δ Scope 1 → Pembulatan → total akhir. */
export function langkahWaterfall(d: Dekomposisi, tahunAwal: string, tahunAkhir: string): LangkahWaterfall[] {
  const s2 = d.awal + d.deltaScope2;
  const s1 = s2 + d.deltaScope1;
  const jenis = (x: number): JenisLangkah => (x >= 0 ? "increase" : "reduction");
  return [
    { id: "AWAL", nama: `FY ${tahunAwal}`, jenis: "anchor", nilai: d.awal, kumulatif: d.awal },
    { id: "S2", nama: "Δ Scope 2", jenis: jenis(d.deltaScope2), nilai: d.deltaScope2, kumulatif: s2 },
    { id: "S1", nama: "Δ Scope 1", jenis: jenis(d.deltaScope1), nilai: d.deltaScope1, kumulatif: s1 },
    { id: "BULAT", nama: "Pembulatan", jenis: "unresolved", nilai: d.pembulatan, kumulatif: s1 + d.pembulatan },
    { id: "AKHIR", nama: `FY ${tahunAkhir}`, jenis: "anchor", nilai: d.akhir, kumulatif: d.akhir },
  ];
}

/** Skala sumbu Y dari data: batas bawah/atas dan garis bantu (tanpa angka tetap). */
export function skalaWaterfall(nilai: number[], jumlahGaris: number) {
  const min = Math.min(...nilai);
  const max = Math.max(...nilai);
  const rentang = max - min || Math.abs(max) || 1;
  const bawah = min - rentang;
  const atas = max + rentang / jumlahGaris;
  const garis = Array.from({ length: jumlahGaris }, (_, i) => bawah + ((atas - bawah) * i) / jumlahGaris);
  return { bawah, atas, garis };
}

const PERSEN = 100;

/** Persen perubahan terhadap nilai awal; null bila awal 0. */
export function persenTerhadap(delta: number, dasar: number): number | null {
  return dasar === 0 ? null : (delta / dasar) * PERSEN;
}

/** Lebar batang (CSS) dari persen kontribusi: nilai mutlak, dibatasi 100%. */
export function lebarBatang(persen: number | null): string {
  return `${Math.min(Math.abs(persen ?? 0), PERSEN)}%`;
}

export const JUMLAH_GARIS_SUMBU = 4;
