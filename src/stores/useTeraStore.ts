import { create } from "zustand";
import { SEED } from "@/lib/seed";
import { jalankanAturan, HasilCek, RingkasanAturan } from "@/lib/rules";
import {
  VERSI,
  StatusSimulasi,
  AksiSimulasi,
  transisiStatus,
  alasanValid,
  statusAwal,
  LABEL_STATUS,
} from "@/lib/reconciliation";

interface HasilJalan {
  hasil: HasilCek[];
  ringkasan: RingkasanAturan;
  waktu: string; // ISO, waktu eksekusi di browser
}

export interface HasilAksi {
  ok: boolean;
  pesan: string;
}

interface TeraState {
  activePeriod: string;

  // Data Quality Center
  hasilAturan: HasilJalan | null;
  cekTerpilih: number | null;
  isDrawerOpen: boolean;

  // Baseline Reconciliation (persetujuan disimulasikan di browser)
  versiA: string;
  versiB: string;
  statusVersi: Record<string, StatusSimulasi>;
  alasanVersi: Record<string, string>;
  baselineAktif: string | null;

  setActivePeriod: (period: string) => void;

  jalankanAturanDQ: () => void;
  bukaCek: (no: number) => void;
  closeDrawer: () => void;

  setVersiA: (v: string) => void;
  setVersiB: (v: string) => void;
  tukarVersi: () => void;
  aksiPersetujuan: (versi: string, aksi: AksiSimulasi, alasan: string) => HasilAksi;
  resetSimulasi: () => void;
}

export const useTeraStore = create<TeraState>((set, get) => ({
  activePeriod: "FY 2025",

  hasilAturan: null,
  cekTerpilih: null,
  isDrawerOpen: false,

  versiA: VERSI[0].versi,
  versiB: VERSI[1].versi,
  statusVersi: statusAwal(),
  alasanVersi: {},
  baselineAktif: null,

  setActivePeriod: (period) => set({ activePeriod: period }),

  // Menjalankan aturan α dan β di sisi klien terhadap 32 pemeriksaan dari seed.
  jalankanAturanDQ: () => {
    const { hasil, ringkasan } = jalankanAturan(SEED.cek_32);
    set({ hasilAturan: { hasil, ringkasan, waktu: new Date().toISOString() } });
  },
  bukaCek: (no) => set({ cekTerpilih: no, isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  setVersiA: (v) => set({ versiA: v }),
  setVersiB: (v) => set({ versiB: v }),
  tukarVersi: () => set((s) => ({ versiA: s.versiB, versiB: s.versiA })),

  // Status, baseline aktif, dan alasan diperbarui dalam satu alur (PRD 4.5).
  aksiPersetujuan: (versi, aksi, alasan) => {
    const { statusVersi, alasanVersi, baselineAktif } = get();
    const sekarang = statusVersi[versi];
    if (!sekarang) return { ok: false, pesan: `Versi ${versi} tidak ditemukan.` };
    if (!alasanValid(alasan)) return { ok: false, pesan: "Alasan perubahan wajib diisi." };
    const berikut = transisiStatus(sekarang, aksi);
    if (!berikut) {
      return { ok: false, pesan: `Aksi tidak berlaku untuk status ${LABEL_STATUS[sekarang]}.` };
    }
    set({
      statusVersi: { ...statusVersi, [versi]: berikut },
      alasanVersi: { ...alasanVersi, [versi]: alasan.trim() },
      // Hanya Approved yang menetapkan baseline aktif; Rejected tidak mengubahnya.
      baselineAktif: berikut === "approved" ? versi : baselineAktif,
    });
    const pesan =
      berikut === "approved"
        ? `${versi} disetujui (simulasi) dan ditetapkan sebagai baseline aktif (simulasi).`
        : berikut === "rejected"
        ? `${versi} ditolak (simulasi). Baseline aktif tidak berubah.`
        : `${versi} diajukan untuk review.`;
    return { ok: true, pesan };
  },

  resetSimulasi: () => set({ statusVersi: statusAwal(), alasanVersi: {}, baselineAktif: null }),
}));
