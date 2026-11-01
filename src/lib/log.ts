// Log peristiwa prototipe: hanya di memori browser, hilang saat halaman dimuat ulang.
// Tanpa impor supaya bisa diuji langsung dengan Node.

export type JenisPeristiwa = "aturan" | "ajukan" | "setujui" | "tolak" | "reset" | "skenario";

export const LABEL_PERISTIWA: Record<JenisPeristiwa, string> = {
  aturan: "Aturan dijalankan",
  ajukan: "Diajukan (simulasi)",
  setujui: "Disetujui (simulasi)",
  tolak: "Ditolak (simulasi)",
  reset: "Reset simulasi",
  skenario: "Skenario disimpan",
};

export const PELAKU = "Pengguna demo";
export const PERAN = "Peran disimulasikan";

export interface Peristiwa {
  id: string; // EVT-001, EVT-002, ...
  waktu: string; // string toISOString(), waktu browser
  pelaku: string;
  peran: string;
  aksi: JenisPeristiwa;
  objek: string;
  sebelum: string;
  sesudah: string;
  alasan: string;
  bukti: string;
}

export type MasukanPeristiwa = Omit<Peristiwa, "id" | "waktu" | "pelaku" | "peran">;

const LEBAR_ID = 3;

export function idPeristiwa(urutan: number): string {
  return `EVT-${String(urutan).padStart(LEBAR_ID, "0")}`;
}

/** Menambah peristiwa dengan id berurutan; daftar lama tidak diubah. */
export function tambahPeristiwa(daftar: Peristiwa[], masukan: MasukanPeristiwa, waktuIso: string): Peristiwa[] {
  const p: Peristiwa = {
    ...masukan,
    id: idPeristiwa(daftar.length + 1),
    waktu: waktuIso,
    pelaku: PELAKU,
    peran: PERAN,
  };
  return [...daftar, p];
}
