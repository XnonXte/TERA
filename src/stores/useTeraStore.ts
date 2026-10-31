import { create } from "zustand";
import { EmissionRecord, BaselineVersion } from "@/types/tera";
import { INITIAL_RECORDS, INITIAL_BASELINES } from "@/lib/seedData";
import { validateEmissionRecord } from "@/lib/validation";

interface TeraState {
  // Navigation & global context
  activePeriod: string;
  activeBaselineId: string;
  compareBaselineId: string;
  scope2Methodology: "location" | "market";

  // Data Quality State
  records: EmissionRecord[];
  selectedRecord: EmissionRecord | null;
  isDrawerOpen: boolean;
  activeFilterScope: string;
  activeFilterStatus: string;
  activeFilterIssueType: string;
  activeFilterSource: string;

  // Baseline Reconciliation State
  baselines: BaselineVersion[];
  reconciliationReviewerNote: string;
  selectedReasonCategory: string;

  // Actions
  setActivePeriod: (period: string) => void;
  setScope2Methodology: (m: "location" | "market") => void;

  openDrawer: (record: EmissionRecord) => void;
  closeDrawer: () => void;
  resolveFinding: (recordId: string, reviewerNote: string) => boolean;
  markAsReviewed: (recordId: string) => void;
  runValidation: () => void;
  setFilterScope: (scope: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterIssueType: (issueType: string) => void;
  setFilterSource: (source: string) => void;

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

  records: INITIAL_RECORDS,
  selectedRecord: null,
  isDrawerOpen: false,
  activeFilterScope: "All",
  activeFilterStatus: "All",
  activeFilterIssueType: "All",
  activeFilterSource: "All",

  baselines: INITIAL_BASELINES,
  reconciliationReviewerNote: "",
  selectedReasonCategory: "Perubahan cakupan",

  setActivePeriod: (period) => set({ activePeriod: period }),
  setScope2Methodology: (m) => set({ scope2Methodology: m }),

  openDrawer: (record) => set({ selectedRecord: record, isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  resolveFinding: (recordId, reviewerNote) => {
    if (!reviewerNote || reviewerNote.trim().length === 0) return false;
    const { records } = get();
    if (!records.some((r) => r.id === recordId)) return false;
    set({
      records: records.map((r) =>
        r.id === recordId
          ? { ...r, validationStatus: "valid" as const, resolved: true, reviewed: true, reviewerNote }
          : r
      ),
      isDrawerOpen: false,
    });
    return true;
  },

  markAsReviewed: (recordId) => {
    const { records } = get();
    set({ records: records.map((r) => (r.id === recordId ? { ...r, reviewed: true } : r)) });
  },

  runValidation: () => {
    const { records } = get();
    set({
      records: records.map((r) => {
        const res = validateEmissionRecord(r, records);
        return {
          ...r,
          validationStatus: res.status,
          ruleId: res.ruleId || r.ruleId,
          issueType: res.issueType || r.issueType,
          issueTitle: res.issueTitle || r.issueTitle,
          issueDescription: res.issueDescription || r.issueDescription,
          suggestedAction: res.suggestedAction || r.suggestedAction,
          ambiguityNote: res.ambiguityNote || r.ambiguityNote,
        };
      }),
    });
  },

  setFilterScope: (scope) => set({ activeFilterScope: scope }),
  setFilterStatus: (status) => set({ activeFilterStatus: status }),
  setFilterIssueType: (issueType) => set({ activeFilterIssueType: issueType }),
  setFilterSource: (source) => set({ activeFilterSource: source }),

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
