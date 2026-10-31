import { EmissionRecord, ValidationStatus } from "@/types/tera";

export interface ValidationResult {
  status: ValidationStatus;
  ruleId?: string;
  issueType?: EmissionRecord["issueType"];
  issueTitle?: string;
  issueDescription?: string;
  suggestedAction?: string;
  ambiguityNote?: string;
}

const VALID_UNITS: Record<string, string[]> = {
  electricity: ["kwh", "mwh", "gwh"],
  fuel: ["liter", "liters", "l", "kl", "gj"],
  refrigerant: ["kg", "ton", "t"],
  gas: ["gj", "mmbtu", "m3"],
};

export function validateEmissionRecord(
  record: Partial<EmissionRecord>,
  allRecords: Partial<EmissionRecord>[] = []
): ValidationResult {
  // DQ-01: Nilai wajib terisi
  if (record.value === null || record.value === undefined) {
    return {
      status: "error",
      ruleId: "DQ-01",
      issueType: "missing_data",
      issueTitle: "Missing activity data",
      issueDescription: `Activity data is missing for one facility (${record.sourceRef || "Site A Sub-meter 04"}). Rule triggered: DQ-01: Value is required (Nilai wajib terisi).`,
      suggestedAction: `Check source utility file or contact ${record.sourceRef || "Site A"} facility manager to upload meter log.`,
      ambiguityNote:
        "Ambang anomali & investigasi: Jangan mengasumsikan data salah secara sepihak; periksa apakah ada penghentian operasi atau kendala transmisi telemetry sebelum mengoreksi.",
    };
  }

  // DQ-03: Periode wajib terisi
  if (!record.period || record.period.trim() === "") {
    return {
      status: "error",
      ruleId: "DQ-03",
      issueType: "incomplete_record",
      issueTitle: "Missing reporting period",
      issueDescription: "Reporting period is missing or empty. Rule triggered: DQ-03: Period is required.",
      suggestedAction: "Assign the appropriate fiscal quarter or calendar month to this record.",
    };
  }

  // DQ-04: Record ID tidak boleh duplikat
  if (record.id && allRecords.filter((r) => r.id === record.id).length > 1) {
    return {
      status: "error",
      ruleId: "DQ-04",
      issueType: "incomplete_record",
      issueTitle: "Duplicate Record ID detected",
      issueDescription: `Multiple records found with ID ${record.id}. Rule triggered: DQ-04: Unique ID required.`,
      suggestedAction: "Check pipeline ingestion logs for accidental duplicate batch pushes.",
    };
  }

  // DQ-05: Nilai negatif pada metrik energi/emisi
  if (record.value < 0) {
    return {
      status: "error",
      ruleId: "DQ-05",
      issueType: "outlier_detected",
      issueTitle: "Negative consumption value",
      issueDescription: `Consumption value ${record.value} cannot be negative. Rule triggered: DQ-05: Non-negative check.`,
      suggestedAction: "Verify if this is an inverted net-metering export or a logging sign error.",
    };
  }

  // DQ-02: Unit harus dikenali
  const metricLower = (record.metric || "").toLowerCase();
  const unitLower = (record.unit || "").toLowerCase();
  let expectedUnits: string[] = [];
  if (metricLower.includes("electric") || metricLower.includes("power")) {
    expectedUnits = VALID_UNITS.electricity;
  } else if (metricLower.includes("diesel") || metricLower.includes("fuel")) {
    expectedUnits = VALID_UNITS.fuel;
  } else if (metricLower.includes("refrigerant") || metricLower.includes("r-410a")) {
    expectedUnits = VALID_UNITS.refrigerant;
  }

  if (expectedUnits.length > 0 && !expectedUnits.includes(unitLower)) {
    return {
      status: "error",
      ruleId: "DQ-02",
      issueType: "unit_mismatch",
      issueTitle: "Metric unit mismatch",
      issueDescription: `Unit '${record.unit}' is incompatible with metric '${record.metric}'. Expected one of [${expectedUnits.join(", ")}].`,
      suggestedAction: "Apply standardized unit conversion factor before ingestion.",
    };
  }

  // DQ-07: Referensi sumber wajib tersedia
  if (!record.sourceRef || record.sourceRef.trim() === "") {
    return {
      status: "warning",
      ruleId: "DQ-07",
      issueType: "invalid_source",
      issueTitle: "Missing source document reference",
      issueDescription: "No evidence document or meter ID linked to this record. Rule triggered: DQ-07.",
      suggestedAction: "Attach PLN utility bill PDF or IoT telemetry stream identifier.",
    };
  }

  // DQ-06: Perubahan anomali / lonjakan tinggi
  if (record.value > 1000000 && !record.reviewed) {
    return {
      status: "warning",
      ruleId: "DQ-06",
      issueType: "unusual_increase",
      issueTitle: "High variance telemetry spike",
      issueDescription: `Record value of ${record.value} ${record.unit} exceeds regional 3-sigma baseline average (+38%).`,
      suggestedAction: "Compare against auxiliary generator backup logs during regional power outage.",
      ambiguityNote: "Unusual increase may reflect legitimate BTS network surge during holiday events.",
    };
  }

  return {
    status: "valid",
  };
}
