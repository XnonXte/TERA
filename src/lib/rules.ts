// Aturan α (DQ-08) dan β (DQ-09). Acuan resmi: docs-tera/verify_seed.py.
// Berkas ini sengaja tidak mengimpor apa pun supaya bisa diuji langsung dengan Node.

export type Aturan = "alpha" | "beta" | "di_luar_cakupan";

export interface CekInput {
  no: number;
  aturan_prototipe: Aturan | string;
  input: number[];
  rumus_d6: string;
  nilai_tertulis: number;
  toleransi_d6: number;
  hasil_d6: string;
}

export interface HasilCek {
  no: number;
  aturan: Aturan;
  hitung: number | null; // null = di luar cakupan
  selisih: number | null; // hitung - tertulis
  toleransi: number;
  ditandai: boolean;
}

const RUMUS_BETA: Record<string, (i: number[]) => number> = {
  "(G/H-1)*100": (i) => (i[0] / i[1] - 1) * 100,
  "-((G/H)/(I/J)-1)*100": (i) => -((i[0] / i[1]) / (i[2] / i[3]) - 1) * 100,
  "G/H*100": (i) => (i[0] / i[1]) * 100,
};

const EPS = 1e-9; // sama dengan verify_seed.py

export function evaluasiCek(c: CekInput): HasilCek {
  let hitung: number;
  if (c.aturan_prototipe === "alpha") {
    hitung = c.input.reduce((a, b) => a + b, 0); // komponen = total
  } else if (c.aturan_prototipe === "beta") {
    const f = RUMUS_BETA[c.rumus_d6];
    if (!f) throw new Error(`Rumus tidak dikenal pada #${c.no}: ${c.rumus_d6}`);
    hitung = f(c.input); // persentase dihitung ulang
  } else {
    return { no: c.no, aturan: "di_luar_cakupan", hitung: null, selisih: null, toleransi: c.toleransi_d6, ditandai: false };
  }
  const selisih = hitung - c.nilai_tertulis;
  return {
    no: c.no,
    aturan: c.aturan_prototipe,
    hitung,
    selisih,
    toleransi: c.toleransi_d6,
    ditandai: Math.abs(selisih) > c.toleransi_d6 + EPS,
  };
}

export interface RingkasanAturan {
  total: number;
  tercakup: number;
  ditandai: number[];
  tidakDitandai: number;
  diLuarCakupan: number[];
  falsePositive: number; // ditandai padahal D6 LOLOS
  gagalD6: number;
  gagalD6Ditandai: number;
  gagalD6DiLuarCakupan: number;
  lolosTercakup: number;
  perAturan: Record<"alpha" | "beta", { jumlah: number; ditandai: number; dari: number; sampai: number }>;
}

export function jalankanAturan(cek: CekInput[]): { hasil: HasilCek[]; ringkasan: RingkasanAturan } {
  const hasil = cek.map(evaluasiCek);
  const byNo = new Map(cek.map((c) => [c.no, c]));
  const tercakup = hasil.filter((h) => h.aturan !== "di_luar_cakupan");
  const gagal = (no: number) => byNo.get(no)?.hasil_d6 === "GAGAL";

  const perAturan = (a: "alpha" | "beta") => {
    const xs = hasil.filter((h) => h.aturan === a);
    const nos = xs.map((h) => h.no);
    return {
      jumlah: xs.length,
      ditandai: xs.filter((h) => h.ditandai).length,
      dari: nos.length ? Math.min(...nos) : 0,
      sampai: nos.length ? Math.max(...nos) : 0,
    };
  };

  const ringkasan: RingkasanAturan = {
    total: hasil.length,
    tercakup: tercakup.length,
    ditandai: tercakup.filter((h) => h.ditandai).map((h) => h.no),
    tidakDitandai: tercakup.filter((h) => !h.ditandai).length,
    diLuarCakupan: hasil.filter((h) => h.aturan === "di_luar_cakupan").map((h) => h.no),
    falsePositive: tercakup.filter((h) => h.ditandai && !gagal(h.no)).length,
    gagalD6: hasil.filter((h) => gagal(h.no)).length,
    gagalD6Ditandai: tercakup.filter((h) => h.ditandai && gagal(h.no)).length,
    gagalD6DiLuarCakupan: hasil.filter((h) => h.aturan === "di_luar_cakupan" && gagal(h.no)).length,
    lolosTercakup: tercakup.filter((h) => !gagal(h.no)).length,
    perAturan: { alpha: perAturan("alpha"), beta: perAturan("beta") },
  };
  return { hasil, ringkasan };
}
