"""Acuan hasil aturan alpha dan beta TERA terhadap tera_seed.json (hanya pustaka standar).
Jalankan: python3 verify_seed.py tera_seed.json
Keluaran harus: ditandai = [1, 19, 28]; 26 pemeriksaan tercakup tidak ditandai.
Implementasi prototipe harus menghasilkan keluaran yang sama persis."""
import json, sys
FORMULAS = {
    "(G/H-1)*100": lambda i: (i[0] / i[1] - 1) * 100,
    "-((G/H)/(I/J)-1)*100": lambda i: -((i[0] / i[1]) / (i[2] / i[3]) - 1) * 100,
    "G/H*100": lambda i: i[0] / i[1] * 100,
}
d = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "tera_seed.json", encoding="utf-8"))
flagged, clean = [], []
for c in d["cek_32"]:
    rule = c["aturan_prototipe"]
    if rule == "alpha":
        calc = sum(c["input"])          # komponen = total
    elif rule == "beta":
        calc = FORMULAS[c["rumus_d6"]](c["input"])   # persentase hitung ulang
    else:
        continue                         # di luar cakupan (#30, #31, #32)
    diff = calc - c["nilai_tertulis"]
    (flagged if abs(diff) > c["toleransi_d6"] + 1e-9 else clean).append(c["no"])
    print(f'#{c["no"]:>2} {rule:5} hitung={calc:,.4f} tertulis={c["nilai_tertulis"]:,} selisih={diff:+.4f} tol={c["toleransi_d6"]}')
print("\nditandai:", flagged, "| tidak ditandai:", len(clean), "| di luar cakupan: [30, 31, 32]")
assert flagged == [1, 19, 28], flagged
assert len(clean) == 26
print("OK: sesuai hasil acuan")
