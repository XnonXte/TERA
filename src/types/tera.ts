export type DriverType = "anchor" | "increase" | "reduction" | "unresolved";
export type UncertaintyStatus = "terverifikasi" | "estimasi" | "unresolved" | "not_applicable";

export interface CarbonDriver {
  id: string;
  name: string;
  subLabel: string;
  category: string;
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
  reductionTco2e: number | null;
  implementationCostIdr: number | null; // In Billion IDR
  annualOperatingCostIdr: number | null; // In Billion IDR
  costEffectiveness: number | null; // IDR Million / tCO2e
  implementationMonths: number | null;
  feasibility: FeasibilityRating;
  evidenceStatus: "terverifikasi" | "estimasi" | "unresolved";
  assumptions: string[];
  sourceRefs: string[];
  selected: boolean;
  whySuperior?: string;
}

export type LogAction = "create" | "update" | "review" | "approve" | "reject" | "simulate";

export interface LogEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  actorInitials: string;
  action: LogAction;
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
