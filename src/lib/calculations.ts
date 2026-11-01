import { DifferenceResult } from "@/types/tera";

/**
 * Selisih absolut dan persen antara nilai lama dan nilai baru.
 * Persen bernilai null bila nilai lama 0; tampilan menulisnya "—".
 */
export function calculateDifference(previous: number, current: number): DifferenceResult {
  const absolute = current - previous;
  return {
    absolute,
    percentage: previous === 0 ? null : (absolute / previous) * 100,
  };
}
