import { create } from "zustand";
import { BaselineVersion } from "@/types/tera";
import { INITIAL_BASELINES } from "@/lib/seedData";
import { SEED } from "@/lib/seed";
import { jalankanAturan, HasilCek, RingkasanAturan } from "@/lib/rules";

interface HasilJalan {
  hasil: HasilCek[];
  ringkasan: RingkasanAturan;
  waktu: string; // ISO, waktu eksekusi di browser
}

interface TeraState {
  activePeriod: string;
  activeBaselineId: string;
  compareBaselineId: string;
  scope2Methodology: "location" | "market";

  // Data Quality Center
  hasilAturan: HasilJalan | null;
  cekTerpilih: number | null;
  isDrawerOpen: boolean;

  // Baseline Reconciliation State
  baselines: BaselineVersion[];
  reconciliationReviewerNote: string;
  selectedReasonCategory: string;

  setActivePeriod: (period: string) => void;
  setScope2Methodology: (m: "location" | "market") => void;

  jalankanAturanDQ: () => void;
  bukaCek: (no: number) => void;
  closeDrawer: () => void;

  setActiveBaselineId: (id: string) => void;
  setCompareBaselineId: (id: string) => void;
  setReconciliationReviewerNote: (note: string) => void;
  setSelectedReasonCategory: (cat: string) => void;
  approveBaseline: (versionId: string, reviewerNote: string) => void;
  rejectBaseline: (versionId: string, reviewerNote: string) => void;
}

export const useTeraStore = create<TeraState>((set, get) => ({
  activePeriod: "FY 2025",
  activeBaselineId: "v2024.1",
  compareBaselineId: "v2025.0-Draft",
  scope2Methodology: "location",

  hasilAturan: null,
  cekTerpilih: null,
  isDrawerOpen: false,

  baselines: INITIAL_BASELINES,
  reconciliationReviewerNote: "",
  selectedReasonCategory: "Perubahan cakupan",

  setActivePeriod: (period) => set({ activePeriod: period }),
  setScope2Methodology: (m) => set({ scope2Methodology: m }),

  // Menjalankan aturan α dan β di sisi klien terhadap 32 pemeriksaan dari seed.
  jalankanAturanDQ: () => {
    const { hasil, ringkasan } = jalankanAturan(SEED.cek_32);
    set({ hasilAturan: { hasil, ringkasan, waktu: new Date().toISOString() } });
  },
  bukaCek: (no) => set({ cekTerpilih: no, isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  setActiveBaselineId: (id) => set({ activeBaselineId: id }),
  setCompareBaselineId: (id) => set({ compareBaselineId: id }),
  setReconciliationReviewerNote: (note) => set({ reconciliationReviewerNote: note }),
  setSelectedReasonCategory: (cat) => set({ selectedReasonCategory: cat }),

  approveBaseline: (versionId, reviewerNote) => {
    const { baselines } = get();
    if (!baselines.some((b) => b.id === versionId)) return;
    set({
      baselines: baselines.map((b) =>
        b.id === versionId ? { ...b, status: "approved" as const, reviewerNote } : b
      ),
      activeBaselineId: versionId,
      reconciliationReviewerNote: "",
    });
  },

  rejectBaseline: (versionId, reviewerNote) => {
    const { baselines } = get();
    if (!baselines.some((b) => b.id === versionId)) return;
    set({
      baselines: baselines.map((b) =>
        b.id === versionId ? { ...b, status: "rejected" as const, reviewerNote } : b
      ),
    });
  },
}));
