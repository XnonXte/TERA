export type ValidationStatus = "valid" | "warning" | "error";

export type IssueType =
  | "missing_data"
  | "unit_mismatch"
  | "unusual_increase"
  | "incomplete_record"
  | "outlier_detected"
  | "invalid_source";

export interface EmissionRecord {
  id: string;
  period: string;
  scope: "Scope 1" | "Scope 2";
  metric: string;
  value: number | null;
  unit: string;
  sourceRef: string;
  baselineVersionId: string;
  validationStatus: ValidationStatus;
  issueType?: IssueType;
  issueTitle?: string;
  issueDescription?: string;
  suggestedAction?: string;
  ambiguityNote?: string;
  ruleId?: string;
  isDemoData: boolean;
  lastUpdated: string;
  reviewed?: boolean;
  resolved?: boolean;
  reviewerNote?: string;
}

export type BaselineStatus = "draft" | "pending_review" | "approved" | "rejected";

export interface BaselineItem {
  id: string;
  name: string;
  description: string;
  scope: "Scope 1" | "Scope 2";
  vA_activity: string;
  vA_ef: string;
  vA_emissions: number;
  vB_activity: string;
  vB_ef: string;
  vB_emissions: number;
  diffEmissions: number;
  diffPercent: number;
  category: string;
  evidence: string;
  notes?: string;
}

export interface BaselineVersion {
  id: string;
  label: string;
  year: number;
  totalEmissionsTco2e: number;
  scope1Tco2e: number;
  scope2Tco2e: number;
  sourceRef: string;
  status: BaselineStatus;
  reasonCode?: string;
  reviewerNote?: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  items: BaselineItem[];
}

export type DriverType = "anchor" | "increase" | "reduction" | "unresolved";
export type UncertaintyStatus = "verified" | "estimated" | "unresolved" | "not_applicable";

export interface CarbonDriver {
  id: string;
  name: string;
  subLabel: string;
  category: "Activity" | "Emission Factor" | "Boundary / Scope" | "Energy Efficiency" | "Telemetry Gap";
  scope: "Scope 1" | "Scope 2" | "Scope 1+2";
  deltaTco2e: number;
  type: DriverType;
  uncertaintyStatus: UncertaintyStatus;
  formula: string;
  source: string;
  baseVal?: number;
  runningVal: number;
}

export type FeasibilityRating = "high" | "medium" | "low" | "unknown";

export interface DecarbonizationOption {
  id: string;
  code: string; // e.g. "OPT-01"
  tag: string; // e.g. "Solar PPA"
  name: string;
  description: string;
  estimatedReductionTco2e: number | null;
  implementationCostIdr: number | null; // In Billion IDR
  annualOperatingCostIdr: number | null; // In Billion IDR
  costEffectiveness: number | null; // IDR Million / tCO2e
  implementationMonths: number | null;
  feasibility: FeasibilityRating;
  evidenceStatus: "verified" | "estimated" | "unresolved";
  assumptions: string[];
  sourceRefs: string[];
  selected: boolean;
  whySuperior?: string;
}

export type AuditAction = "create" | "update" | "review" | "approve" | "reject" | "simulate";

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  actorInitials: string;
  action: AuditAction;
  objectType: "baseline" | "record" | "scenario" | "factor";
  objectId: string;
  objectTitle: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  evidence?: string;
  hash?: string;
  statusBadge?: string;
}

export interface DifferenceResult {
  absolute: number;
  percentage: number | null;
}
