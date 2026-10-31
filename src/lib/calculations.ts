import { DifferenceResult, EmissionRecord } from "@/types/tera";

/**
 * Calculates absolute and percentage difference between previous and current values.
 * Returns null for percentage if previous is 0, which should be displayed as "N/A".
 */
export function calculateDifference(previous: number, current: number): DifferenceResult {
  const absolute = current - previous;
  return {
    absolute,
    percentage: previous === 0 ? null : (absolute / previous) * 100,
  };
}

/**
 * Checks if percentage variance exceeds the board review threshold (default: > 5.0%).
 */
export function isVarianceThresholdExceeded(percentage: number | null | undefined, threshold = 5.0): boolean {
  if (percentage === null || percentage === undefined || isNaN(percentage)) return false;
  return Math.abs(percentage) > threshold;
}

/**
 * Formats a number with comma thousand separators and fixed decimals.
 */
export function formatNumber(val: number | null | undefined, decimals = 1): string {
  if (val === null || val === undefined) return "N/A";
  return val.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats percentage with sign and % symbol, or N/A.
 */
export function formatPercentage(val: number | null | undefined, includeSign = true): string {
  if (val === null || val === undefined || isNaN(val)) return "N/A";
  const sign = includeSign && val > 0 ? "+" : "";
  return `${sign}${val.toFixed(1)}%`;
}

/**
 * Formats currency in IDR (Billion or Million).
 */
export function formatIdrBillion(valInBillion: number | null | undefined): string {
  if (valInBillion === null || valInBillion === undefined) return "N/A";
  return `Rp ${valInBillion.toFixed(2)} B`;
}

/**
 * Computes levelized abatement cost ratio in IDR Million / tCO2e.
 * PRD Rule: Do not compute if reduction is 0, null, or unresolved.
 */
export function calculateAbatementRatio(
  capexIdrBillion: number | null,
  annualReductionTco2e: number | null
): number | null {
  if (!capexIdrBillion || !annualReductionTco2e || annualReductionTco2e <= 0) {
    return null;
  }
  // (Capex in Billion * 1,000 Million) / Reduction tCO2e
  return (capexIdrBillion * 1000) / annualReductionTco2e;
}

/**
 * Aggregates emissions by Scope from a list of records.
 */
export function calculateScopeEmissions(records: EmissionRecord[]) {
  let scope1 = 0;
  let scope2 = 0;

  for (const r of records) {
    if (r.value !== null && r.validationStatus === "valid") {
      if (r.scope === "Scope 1") scope1 += r.value;
      if (r.scope === "Scope 2") scope2 += r.value;
    }
  }

  return {
    scope1,
    scope2,
    total: scope1 + scope2,
  };
}
