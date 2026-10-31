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

export interface DifferenceResult {
  absolute: number;
  percentage: number | null;
}
