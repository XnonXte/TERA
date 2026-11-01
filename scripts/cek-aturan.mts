// Membandingkan aturan α/β aplikasi (src/lib/rules.ts) dengan hasil acuan verify_seed.py.
// Jalankan: node scripts/cek-aturan.mts   (Node 23.2+; tanpa dependensi tambahan)
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";

// package.json memakai "type": "commonjs", jadi rules.ts dimuat sebagai modul ES lewat data URL.
const kode = stripTypeScriptTypes(readFileSync(new URL("../src/lib/rules.ts", import.meta.url), "utf-8"));
const { jalankanAturan } = await import("data:text/javascript;base64," + Buffer.from(kode).toString("base64"));

const seed = JSON.parse(readFileSync(new URL("../docs-tera/tera_seed.json", import.meta.url), "utf-8"));
const { hasil, ringkasan } = jalankanAturan(seed.cek_32);

for (const h of hasil) {
  if (h.hitung === null) continue;
  console.log(`#${String(h.no).padStart(2)} ${h.aturan.padEnd(5)} hitung=${h.hitung.toFixed(4)} selisih=${h.selisih.toFixed(4)} tol=${h.toleransi} ${h.ditandai ? "DITANDAI" : ""}`);
}
console.log(`\nditandai: [${ringkasan.ditandai.join(", ")}] | tidak ditandai: ${ringkasan.tidakDitandai} | di luar cakupan: [${ringkasan.diLuarCakupan.join(", ")}] | false positive: ${ringkasan.falsePositive}`);

const acuan = seed.hasil_acuan;
const cocok =
  JSON.stringify(ringkasan.ditandai) === JSON.stringify(acuan.ditandai) &&
  ringkasan.tidakDitandai === acuan.tercakup_tidak_ditandai &&
  JSON.stringify(ringkasan.diLuarCakupan) === JSON.stringify(acuan.di_luar_cakupan) &&
  ringkasan.falsePositive === acuan.false_positive_pada_tercakup_lolos;
if (!cocok) {
  console.error("TIDAK COCOK dengan hasil acuan di seed");
  process.exit(1);
}
console.log("OK: sama dengan hasil acuan (verify_seed.py)");
