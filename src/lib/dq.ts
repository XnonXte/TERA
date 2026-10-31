import type { Cek } from "@/lib/seed";
import type { HasilCek } from "@/lib/rules";

// Nama aturan pada PRD (Perubahan PRD, bagian 3) dan tingkat keparahan yang diputuskan tim.
export const INFO_ATURAN = {
  alpha: { simbol: "α", ruleId: "DQ-08", nama: "Jumlah komponen = total tertulis" },
  beta: { simbol: "β", ruleId: "DQ-09", nama: "Persentase dihitung ulang" },
  di_luar_cakupan: { simbol: "γ", ruleId: "—", nama: "Satuan dan basis" },
} as const;

export const KEPARAHAN = "Warning";

export type LabelHasil = "ditandai" | "tidak" | "luar" | "belum";

export function labelHasil(c: Cek, h: HasilCek | undefined): LabelHasil {
  if (c.aturan_prototipe === "di_luar_cakupan") return "luar";
  if (!h) return "belum";
  return h.ditandai ? "ditandai" : "tidak";
}

export const TEKS_HASIL: Record<LabelHasil, string> = {
  ditandai: `Ditandai untuk review · ${KEPARAHAN}`,
  tidak: "Tidak ditandai",
  luar: "Di luar cakupan aturan saat ini",
  belum: "Belum dijalankan",
};

/** Satuan nilai tertulis: β = persen; α = GJ bila item menyebut GJ, selain itu tCO2e. */
export function satuanCek(c: Cek): { nilai: string; selisih: string } {
  if (c.aturan_prototipe === "beta") return { nilai: "%", selisih: "pp" };
  if (c.aturan_prototipe === "alpha") {
    const u = /\bGJ\b/.test(c.item) ? "GJ" : "tCO2e";
    return { nilai: u, selisih: u };
  }
  return { nilai: "", selisih: "" };
}
