// Memeriksa fungsi hitung halaman Carbon Analysis, Decision Lab, dan log Governance terhadap seed.
// Jalankan: node scripts/cek-hitung.mts   (Node 23.2+; tanpa dependensi tambahan)
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";

async function muat(rel: string) {
  const kode = stripTypeScriptTypes(readFileSync(new URL(rel, import.meta.url), "utf-8"));
  return import("data:text/javascript;base64," + Buffer.from(kode).toString("base64"));
}

const { dekomposisi, langkahWaterfall } = await muat("../src/lib/hitung-carbon.ts");
const { hitungSkenario } = await muat("../src/lib/hitung-keputusan.ts");
const { tambahPeristiwa } = await muat("../src/lib/log.ts");
const seed = JSON.parse(readFileSync(new URL("../docs-tera/tera_seed.json", import.meta.url), "utf-8"));

let gagal = 0;
const TOL = 1e-6;
function cek(nama: string, nyata: number | null, harap: number, tol = TOL) {
  const ok = nyata !== null && Math.abs(nyata - harap) <= tol;
  if (!ok) gagal++;
  console.log(`${ok ? "OK   " : "GAGAL"} ${nama}: ${nyata} (harap ${harap})`);
}
function cekSama(nama: string, nyata: unknown, harap: unknown) {
  const ok = JSON.stringify(nyata) === JSON.stringify(harap);
  if (!ok) gagal++;
  console.log(`${ok ? "OK   " : "GAGAL"} ${nama}: ${JSON.stringify(nyata)} (harap ${JSON.stringify(harap)})`);
}

// 1) Dekomposisi Carbon 2023 → 2025
const t = seed.dashboard.tahun;
const d = dekomposisi(t["2023"], t["2025"]);
cek("Δ Scope 2 2023→2025", d.deltaScope2, 255169.56);
cek("Δ Scope 1 2023→2025", d.deltaScope1, -5506.15);
cek("Pembulatan (pemeriksaan #4)", d.pembulatan, -0.1);
cek("Δ total 2023→2025", d.deltaTotal, 249663.31);
cek("Kontribusi Scope 2 (%) dibulatkan 1 desimal", Math.round(d.kontribusiScope2Pct * 10) / 10, 102.2);
cek("Kontribusi Scope 1 (%) dibulatkan 1 desimal", Math.round(d.kontribusiScope1Pct * 10) / 10, -2.2);
const w = langkahWaterfall(d, "2023", "2025");
cek("Waterfall: kumulatif akhir = total tertulis 2025", w[w.length - 1].kumulatif, t["2025"].scope1_2);
cek("Waterfall: langkah pembulatan berakhir di total tertulis", w[3].kumulatif, t["2025"].scope1_2);

// 2) Kalkulator Decision Lab pada parameter 0%
const lt = seed.dashboard.level_target;
const b = { scope1: t["2025"].scope1, scope2: t["2025"].scope2, total: t["2025"].scope1_2, target: lt.nilai };
const h0 = hitungSkenario(b, { persenScope2: 0, persenScope1: 0, biaya: null, waktu: null });
cek("Kalkulator 0%: emisi sesudah", h0.emisiSesudah, 1736327.9);
cek("Kalkulator 0%: sisa gap = gap seed", h0.sisaGap, lt.gap_ke_target, 1e-6);
cek("Kalkulator 0%: pengurangan", h0.pengurangan, 0);
cekSama("Kalkulator 0%: biaya per tCO2e tanpa biaya", h0.biayaPerTon, null);
const h10 = hitungSkenario(b, { persenScope2: 10, persenScope1: 0, biaya: null, waktu: null });
cek("Kalkulator Scope 2 −10%: pengurangan = 10% × Scope 2", h10.pengurangan, t["2025"].scope2 * 0.1);

// 3) Log peristiwa setelah urutan aksi
const aksi = ["aturan", "ajukan", "tolak", "ajukan", "setujui", "reset", "skenario", "aturan"];
let log: unknown[] = [];
for (const a of aksi) {
  log = tambahPeristiwa(log as never, { aksi: a, objek: "x", sebelum: "", sesudah: "", alasan: "", bukti: "—" }, "2026-01-01T00:00:00.000Z");
}
cek("Jumlah peristiwa setelah 8 aksi", log.length, aksi.length);
cekSama("ID berurutan", (log as { id: string }[]).map((p) => p.id), aksi.map((_, i) => `EVT-${String(i + 1).padStart(3, "0")}`));

if (gagal) {
  console.error(`\n${gagal} pemeriksaan GAGAL`);
  process.exit(1);
}
console.log("\nOK: semua pemeriksaan hitung lulus");
