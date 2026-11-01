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
import { Peristiwa, MasukanPeristiwa, tambahPeristiwa } from "@/lib/log";
import { SKENARIO_AWAL_PERSEN_SCOPE2, LABEL_HIPOTETIS } from "@/lib/keputusan";

export interface Skenario {
  id: string;
  nama: string;
  persenScope2: number;
  persenScope1: number;
  biaya: number | null; // isian pengguna; null = belum diisi
  waktu: number | null;
  dipilih: boolean;
}

const LEBAR_ID_SKENARIO = 2;
const idSkenario = (i: number) => `S-${String(i).padStart(LEBAR_ID_SKENARIO, "0")}`;
const namaSkenario = (r2: number, r1: number) => `${LABEL_HIPOTETIS}: Scope 2 −${r2}%, Scope 1 −${r1}%`;
const SKENARIO_AWAL: Skenario[] = SKENARIO_AWAL_PERSEN_SCOPE2.map((r2, i) => ({
  id: idSkenario(i + 1),
  nama: namaSkenario(r2, 0),
  persenScope2: r2,
  persenScope1: 0,
  biaya: null,
  waktu: null,
  dipilih: false,
}));

interface HasilJalan {
  hasil: HasilCek[];
  ringkasan: RingkasanAturan;
  waktu: string; // string toISOString(), waktu eksekusi di browser
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

  // Log peristiwa (memori saja; hilang saat halaman dimuat ulang)
  peristiwa: Peristiwa[];
  catat: (m: MasukanPeristiwa) => void;

  // Decision Lab (hipotetis)
  skenario: Skenario[];
  simpanSkenario: (persenScope2: number, persenScope1: number, biaya: number | null, waktu: number | null) => Skenario;
  pilihSkenario: (id: string) => void;

  setActivePeriod: (period: string) => void;

  jalankanAturanDQ: (alasan?: string) => void;
  bukaCek: (no: number) => void;
  closeDrawer: () => void;

  setVersiA: (v: string) => void;
  setVersiB: (v: string) => void;
  tukarVersi: () => void;
  aksiPersetujuan: (versi: string, aksi: AksiSimulasi, alasan: string) => HasilAksi;
  resetSimulasi: () => void;
}

export const useSeedStore = create<TeraState>((set, get) => ({
  activePeriod: "FY 2025",

  hasilAturan: null,
  cekTerpilih: null,
  isDrawerOpen: false,

  versiA: VERSI[0].versi,
  versiB: VERSI[1].versi,
  statusVersi: statusAwal(),
  alasanVersi: {},
  baselineAktif: null,

  peristiwa: [],
  skenario: SKENARIO_AWAL,
  simpanSkenario: (r2, r1, biaya, waktu) => {
    const { skenario } = get();
    const baru: Skenario = {
      id: idSkenario(skenario.length + 1),
      nama: namaSkenario(r2, r1),
      persenScope2: r2,
      persenScope1: r1,
      biaya,
      waktu,
      dipilih: false,
    };
    set({ skenario: [...skenario, baru] });
    get().catat({
      aksi: "skenario",
      objek: `Skenario ${baru.id}`,
      sebelum: `${skenario.length} skenario`,
      sesudah: `${skenario.length + 1} skenario`,
      alasan: baru.nama,
      bukti: "—",
    });
    return baru;
  },
  pilihSkenario: (id) =>
    set((s) => ({ skenario: s.skenario.map((x) => (x.id === id ? { ...x, dipilih: !x.dipilih } : x)) })),
  catat: (m) => set((s) => ({ peristiwa: tambahPeristiwa(s.peristiwa, m, new Date().toISOString()) })),

  setActivePeriod: (period) => set({ activePeriod: period }),

  // Menjalankan aturan α dan β di sisi klien terhadap 32 pemeriksaan dari seed.
  jalankanAturanDQ: (alasan) => {
    const sebelum = get().hasilAturan;
    const { hasil, ringkasan } = jalankanAturan(SEED.cek_32);
    set({ hasilAturan: { hasil, ringkasan, waktu: new Date().toISOString() } });
    get().catat({
      aksi: "aturan",
      objek: `${SEED.cek_32.length} pemeriksaan (aturan α/β)`,
      sebelum: sebelum ? `${sebelum.ringkasan.ditandai.length} ditandai` : "Belum dijalankan",
      sesudah: `${ringkasan.ditandai.length} ditandai dari ${ringkasan.tercakup}`,
      alasan: typeof alasan === "string" ? alasan : "Dijalankan saat halaman dibuka",
      bukti: "Berkas pemeriksaan D6",
    });
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
    get().catat({
      aksi: aksi,
      objek: `Versi baseline ${versi}`,
      sebelum: LABEL_STATUS[sekarang],
      sesudah: LABEL_STATUS[berikut],
      alasan: alasan.trim(),
      bukti: VERSI.find((v) => v.versi === versi)?.sumber ?? "—",
    });
    const pesan =
      berikut === "approved"
        ? `${versi} disetujui (simulasi) dan ditetapkan sebagai baseline aktif (simulasi).`
        : berikut === "rejected"
        ? `${versi} ditolak (simulasi). Baseline aktif tidak berubah.`
        : `${versi} diajukan untuk review.`;
    return { ok: true, pesan };
  },

  resetSimulasi: () => {
    const { statusVersi, baselineAktif } = get();
    set({ statusVersi: statusAwal(), alasanVersi: {}, baselineAktif: null });
    get().catat({
      aksi: "reset",
      objek: `${VERSI.length} versi baseline`,
      sebelum: `${VERSI.map((v) => `${v.versi}: ${LABEL_STATUS[statusVersi[v.versi]]}`).join(", ")}; aktif: ${baselineAktif ?? "belum ada"}`,
      sesudah: "Semua Draft; aktif: belum ada",
      alasan: "Reset simulasi",
      bukti: "—",
    });
  },
}));
