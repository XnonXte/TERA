import { create } from "zustand";
import {
  EmissionRecord,
  BaselineVersion,
  CarbonDriver,
  DecarbonizationOption,
  AuditEvent,
} from "@/types/tera";
import {
  INITIAL_RECORDS,
  INITIAL_BASELINES,
  INITIAL_DRIVERS,
  INITIAL_OPTIONS,
  INITIAL_AUDIT_EVENTS,
} from "@/lib/seedData";
import { validateEmissionRecord } from "@/lib/validation";

interface SimulationParams {
  capexMultiplier: number; // default 1.0 (e.g. 0.8 - 1.4)
  tariffEscalation: number; // default 5.0% (e.g. 0 - 15%)
}

interface TeraState {
  // Navigation & global context
  activePeriod: string;
  activeBaselineId: string;
  compareBaselineId: string;
  scope2Methodology: "location" | "market";
  globalSearchQuery: string;

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

  // Carbon Drivers State
  drivers: CarbonDriver[];
  selectedDriver: CarbonDriver | null;

  // Decision Lab State
  options: DecarbonizationOption[];
  simulationParams: SimulationParams;
  savedScenariosCount: number;

  // Governance State
  auditEvents: AuditEvent[];

  // Actions
  setActivePeriod: (period: string) => void;
  setGlobalSearchQuery: (query: string) => void;
  setScope2Methodology: (m: "location" | "market") => void;

  // Drawer & DQ actions
  openDrawer: (record: EmissionRecord) => void;
  closeDrawer: () => void;
  resolveFinding: (recordId: string, reviewerNote: string) => boolean;
  markAsReviewed: (recordId: string) => void;
  runValidation: () => void;
  setFilterScope: (scope: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterIssueType: (issueType: string) => void;
  setFilterSource: (source: string) => void;

  // Baseline actions
  setActiveBaselineId: (id: string) => void;
  setCompareBaselineId: (id: string) => void;
  setReconciliationReviewerNote: (note: string) => void;
  setSelectedReasonCategory: (cat: string) => void;
  approveBaseline: (versionId: string, reviewerNote: string) => void;
  rejectBaseline: (versionId: string, reviewerNote: string) => void;

  // Decision Lab actions
  toggleOption: (optionId: string) => void;
  setSimulationParams: (params: Partial<SimulationParams>) => void;
  saveScenarioSimulation: () => void;

  // Audit actions
  addAuditEvent: (event: Omit<AuditEvent, "id" | "timestamp" | "hash">) => void;
}

export const useTeraStore = create<TeraState>((set, get) => ({
  activePeriod: "FY 2025",
  activeBaselineId: "v2024.1",
  compareBaselineId: "v2025.0-Draft",
  scope2Methodology: "location",
  globalSearchQuery: "",

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

  drivers: INITIAL_DRIVERS,
  selectedDriver: null,

  options: INITIAL_OPTIONS,
  simulationParams: {
    capexMultiplier: 1.0,
    tariffEscalation: 5.0,
  },
  savedScenariosCount: 1,

  auditEvents: INITIAL_AUDIT_EVENTS,

  setActivePeriod: (period) => set({ activePeriod: period }),
  setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),
  setScope2Methodology: (m) => set({ scope2Methodology: m }),

  openDrawer: (record) => set({ selectedRecord: record, isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  resolveFinding: (recordId, reviewerNote) => {
    if (!reviewerNote || reviewerNote.trim().length === 0) {
      return false; // PRD rule: note is strictly required
    }

    const { records, addAuditEvent } = get();
    const target = records.find((r) => r.id === recordId);
    if (!target) return false;

    const updatedRecords = records.map((r) => {
      if (r.id === recordId) {
        return {
          ...r,
          validationStatus: "valid" as const,
          resolved: true,
          reviewed: true,
          reviewerNote,
          lastUpdated: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        };
      }
      return r;
    });

    set({ records: updatedRecords, isDrawerOpen: false });

    // Add immutable audit log event
    addAuditEvent({
      actor: "ESG Team Controller",
      actorRole: "ESG Governance",
      actorInitials: "ET",
      action: "update",
      objectType: "record",
      objectId: recordId,
      objectTitle: `Resolved finding for ${target.metric} (${target.sourceRef})`,
      previousValue: target.validationStatus.toUpperCase(),
      newValue: "VALID (RESOLVED)",
      reason: reviewerNote,
      evidence: "Verified via Finding Resolution Drawer",
      statusBadge: "Resolved",
    });

    return true;
  },

  markAsReviewed: (recordId) => {
    const { records, addAuditEvent } = get();
    const target = records.find((r) => r.id === recordId);
    if (!target) return;

    const updatedRecords = records.map((r) => {
      if (r.id === recordId) {
        return { ...r, reviewed: true };
      }
      return r;
    });

    set({ records: updatedRecords });

    addAuditEvent({
      actor: "ESG Team Controller",
      actorRole: "ESG Governance",
      actorInitials: "ET",
      action: "review",
      objectType: "record",
      objectId: recordId,
      objectTitle: `Marked record ${recordId} as Reviewed`,
      previousValue: "Unreviewed",
      newValue: "Reviewed",
      reason: "Acknowledged for next reconciliation cycle",
      statusBadge: "Reviewed",
    });
  },

  runValidation: () => {
    const { records, addAuditEvent } = get();
    const updated = records.map((r) => {
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
    });

    set({ records: updated });

    addAuditEvent({
      actor: "Automated Rules Engine",
      actorRole: "System Bot",
      actorInitials: "DQ",
      action: "review",
      objectType: "record",
      objectId: "BATCH-RUN",
      objectTitle: `Run validation across ${records.length} active records`,
      previousValue: "Dirty State",
      newValue: "Evaluated (Rules DQ-01 to DQ-07)",
      reason: "User manually triggered Run Validation",
      statusBadge: "Verified",
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
    const { baselines, addAuditEvent } = get();
    const target = baselines.find((b) => b.id === versionId);
    if (!target) return;

    const updated = baselines.map((b) => {
      if (b.id === versionId) {
        return {
          ...b,
          status: "approved" as const,
          reviewerNote,
          approvedBy: "ESG Team Lead (Simulated)",
          approvedAt: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        };
      }
      return b;
    });

    set({
      baselines: updated,
      activeBaselineId: versionId, // Promote newly approved version to active baseline!
      reconciliationReviewerNote: "",
    });

    addAuditEvent({
      actor: "Bambang S. / ESG Lead",
      actorRole: "Executive Controller",
      actorInitials: "BS",
      action: "approve",
      objectType: "baseline",
      objectId: versionId,
      objectTitle: `Ratified baseline ${versionId} into Active Locked Footprint`,
      previousValue: "v2024.1 (1,146.0 tCO₂e)",
      newValue: `${versionId} (${target.totalEmissionsTco2e} tCO₂e)`,
      reason: reviewerNote || "Reconciliation review completed and board threshold approved.",
      evidence: "Formal Board Governance Ratification Docket",
      statusBadge: "Ratified",
    });
  },

  rejectBaseline: (versionId, reviewerNote) => {
    const { baselines, addAuditEvent } = get();
    const target = baselines.find((b) => b.id === versionId);
    if (!target) return;

    const updated = baselines.map((b) => {
      if (b.id === versionId) {
        return {
          ...b,
          status: "rejected" as const,
          reviewerNote,
        };
      }
      return b;
    });

    set({ baselines: updated });

    addAuditEvent({
      actor: "Hendra Wijaya",
      actorRole: "ESG Controller",
      actorInitials: "HW",
      action: "reject",
      objectType: "baseline",
      objectId: versionId,
      objectTitle: `Rejected baseline revision ${versionId}`,
      previousValue: "Under Review",
      newValue: "REJECTED (Baseline reverted)",
      reason: reviewerNote || "Missing supplementary telemetry evidence.",
      evidence: "CAPA Remediation Notice 2025",
      statusBadge: "Action Required",
    });
  },

  toggleOption: (optionId) => {
    const { options } = get();
    const updated = options.map((opt) => {
      if (opt.id === optionId) {
        return { ...opt, selected: !opt.selected };
      }
      return opt;
    });
    set({ options: updated });
  },

  setSimulationParams: (params) => {
    const current = get().simulationParams;
    set({ simulationParams: { ...current, ...params } });
  },

  saveScenarioSimulation: () => {
    const { options, simulationParams, addAuditEvent, savedScenariosCount } = get();
    const selected = options.filter((o) => o.selected);
    const totalReduction = selected.reduce((sum, o) => sum + (o.estimatedReductionTco2e || 0), 0);
    const totalCost = selected.reduce((sum, o) => sum + (o.implementationCostIdr || 0), 0) * simulationParams.capexMultiplier;

    set({ savedScenariosCount: savedScenariosCount + 1 });

    addAuditEvent({
      actor: "R. Pratama",
      actorRole: "Decarbonization Planner",
      actorInitials: "RP",
      action: "simulate",
      objectType: "scenario",
      objectId: `SCN-2025-0${savedScenariosCount + 1}`,
      objectTitle: `Saved candidate bundle (${selected.length} interventions, -${totalReduction.toFixed(1)} tCO₂e/yr)`,
      previousValue: "Draft Simulation",
      newValue: `${formatIdrBillion(totalCost)} / -${totalReduction.toFixed(1)} tCO₂e`,
      reason: `Capex adjusted by ${(simulationParams.capexMultiplier * 100).toFixed(0)}%, tariff escalation ${simulationParams.tariffEscalation}%.`,
      evidence: "Decision Lab Export Proposal",
      statusBadge: "Simulated",
    });
  },

  addAuditEvent: (eventData) => {
    const { auditEvents } = get();
    const newId = `AUD-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomHex = Math.random().toString(16).substring(2, 10);
    const newEvent: AuditEvent = {
      ...eventData,
      id: newId,
      timestamp: `Just now • ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`,
      hash: `0x${randomHex}c14e`,
    };
    set({ auditEvents: [newEvent, ...auditEvents] });
  },
}));

function formatIdrBillion(valInBillion: number): string {
  return `Rp ${valInBillion.toFixed(2)} B`;
}
