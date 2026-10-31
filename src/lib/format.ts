// Format angka Indonesia: pemisah ribuan titik, desimal koma. Nilai kosong ditampilkan "—".

export const KOSONG = "—";

export function fmtAngka(v: number | null | undefined, maxDesimal = 2, minDesimal = 0): string {
  if (v === null || v === undefined || Number.isNaN(v)) return KOSONG;
  return v.toLocaleString("id-ID", { minimumFractionDigits: minDesimal, maximumFractionDigits: maxDesimal });
}

export function fmtTetap(v: number | null | undefined, desimal = 2): string {
  // Hindari "-0,00" untuk selisih yang sangat kecil.
  if (typeof v === "number" && Math.abs(v) < 0.5 * Math.pow(10, -desimal)) v = 0;
  return fmtAngka(v, desimal, desimal);
}

/** Dengan tanda + untuk nilai positif. */
export function fmtBertanda(v: number | null | undefined, desimal = 2): string {
  if (v === null || v === undefined || Number.isNaN(v)) return KOSONG;
  const s = fmtTetap(v, desimal);
  return v > 0 && /[1-9]/.test(s) ? `+${s}` : s;
}

export function fmtPersen(v: number | null | undefined, desimal = 2, bertanda = true): string {
  if (v === null || v === undefined || Number.isNaN(v)) return KOSONG;
  return `${bertanda ? fmtBertanda(v, desimal) : fmtTetap(v, desimal)}%`;
}

export function fmtWaktu(iso: string | null): string {
  if (!iso) return KOSONG;
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
