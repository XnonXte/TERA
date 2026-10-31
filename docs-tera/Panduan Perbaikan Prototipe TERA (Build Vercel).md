# Panduan Perbaikan Prototipe TERA (Build Vercel)

Untuk tim dev · pemeriksa: Cah (keputusan go/no-go) · tautan: `tera-proto.vercel.app`

## 0. Ringkasan

Build di `tera-proto.vercel.app` dipakai sebagai prototipe resmi, **tetapi isinya sekarang tidak boleh dipublikasikan atau dicantumkan di paper**. Hampir semua angka, nama orang, sumber bukti, dan klaim di semua enam halamannya tidak berasal dari laporan Telkomsel dan melanggar batas klaim tim. Build localhost ("TERA · Prototipe Terbatas") sudah lulus sebagian besar cek QA dan menjadi rujukan tampilan, teks, dan logika.

| Hal | Keputusan |
| --- | --- |
| Target | Build Vercel lulus **uji kata nol-hasil** (bagian 6) dan **cek QA 1-10** (bagian 7) sebelum Cah memutuskan go/no-go |
| Bila gagal | Tautan Vercel **tidak dicantumkan** di paper. Paper memakai tangkapan layar dari build yang lulus. Prototipe ditulis sebagai spesifikasi |
| Cara kerja | Kerjakan sesuai urutan di bagian 2. Setiap langkah dideploy sendiri-sendiri, jadi situs makin aman di tiap langkah |
| Jangan | Menambah fitur, mengubah data seed, atau mengubah toleransi tanpa kabar ke Cah |

Berkas pendukung: `tera_seed.json`, `cek_32.csv`, `revisi_18.csv`, `verify_seed.py`, `Panduan Seed dan Cek QA Prototipe TERA.md`, `Perubahan PRD Siap Tempel - TERA.md`.

## 1. Prinsip

| # | Prinsip |
| --- | --- |
| 1 | **Tidak ada angka yang dikarang.** Setiap angka berasal dari `tera_seed.json` dan menampilkan nama laporan beserta halaman cetak (mis. "SR Telkomsel 2025, hlm 147"). Tidak ada di seed = tidak ditampilkan |
| 2 | **Tidak ada orang, jabatan, perusahaan, dokumen, atau dokumen sumber fiktif.** Bukan "demo", bukan "contoh" |
| 3 | **Yang belum dibangun ditulis spesifikasi.** Halaman tanpa data seed menampilkan layar spesifikasi, bukan data rekaan |
| 4 | **Simulasi harus terbaca sebagai simulasi.** Persetujuan di browser, tanpa login, bukan sistem audit. "Approved ≠ diaudit independen" |
| 5 | **Hasil aturan = in-sample.** Aturan dirancang dari data yang sama; bukan bukti kinerja di data lain |
| 6 | **Satu sumber data.** Semua halaman membaca dari satu berkas seed. Dilarang menaruh angka langsung di komponen |

## 2. Urutan kerja

Setiap langkah boleh dideploy terpisah. Setelah langkah 1, situs sudah **aman** walau masih kosong.

| Langkah | Pekerjaan | Hasil |
| --- | --- | --- |
| 1 | **Bersihkan.** Ganti Carbon Analysis, Decision Lab, dan Governance menjadi layar spesifikasi (bagian 3.5). Hapus semua nama orang, hash, stempel ISO, angka rekaan di tiga halaman itu | Konten paling berisiko hilang |
| 2 | **Global** (bagian 3.1): judul, label, header, hapus notifikasi dan pengguna fiktif, hapus tombol "Export …" | Kerangka bersih |
| 3 | **Data Quality** (bagian 3.3): 32 pemeriksaan dan aturan α/β | Fitur utama langkah 6 |
| 4 | **Reconciliation** (bagian 3.4): 3 versi, selisih, simulasi persetujuan | Fitur utama langkah 2-3 |
| 5 | **Overview** (bagian 3.2): angka dari seed | Fitur langkah 1 |
| 6 | Uji kata nol-hasil dan cek QA 1-10; kirim hasil ke Cah | Bukti |
| 7 | (Opsional, hanya bila 1-6 lulus penuh) Log aktivitas sederhana, berlabel simulasi | Opsi B |

Urutan 3, 4, 5 boleh dipertukarkan. Langkah 1 dan 2 wajib lebih dulu.

## 3. Perbaikan per halaman

Jika kode build localhost tersedia, **pindahkan halaman dan komponennya** ke repositori Vercel. Teks dan logikanya sudah teruji. Jangan menulis ulang dari nol.

### 3.1 Global (semua halaman)

| Elemen | Sekarang | Ubah menjadi |
| --- | --- | --- |
| Judul tab | "TERA \| Trusted ESG Reporting & Action - Telkomsel" | "TERA · Prototipe Terbatas" |
| Badge | "DEMO SANDBOX" | Dua badge: "Data demo" dan "Simulasi, bukan integrasi produksi" |
| Pengguna di sidebar | "ESG Team / Telkomsel (Demo)" | "Pengguna demo · Peran disimulasikan · tanpa login" |
| Sidebar | 6 halaman tampak berfungsi | Dashboard, Data Quality Center, Baseline Reconciliation (dibangun). Carbon Driver Analysis, Decision Lab, Governance & Audit Trail diberi label "Spek" dengan tooltip "Masih spesifikasi; belum dibangun pada prototipe ini" |
| Notifikasi (lonceng) | Notifikasi rekaan | Hapus |
| Kolom pencarian | Placeholder menyebut findings dan scenarios | "Cari…" atau hapus |
| Tombol "Export Briefing Pack", "Export Formal Audit Pack", "Export Attribution Matrix", "Save Scenario Bundle", "Import Telemetry" | Ada | Hapus |
| Banner data | Tidak ada | Pita di atas: "Data demo dari laporan keberlanjutan (SR 2023-2025). Angka disalin dari halaman cetak; setiap angka menunjukkan sumbernya." |
| `<meta>` (description, og:title), README, komentar kode, data mock | Mungkin memuat teks lama | Samakan atau hapus |
| Bahasa UI | Campuran Inggris dan Indonesia | Disarankan Bahasa Indonesia seperti build localhost. Bila tidak sempat, Inggris boleh asal lolos uji kata |

### 3.2 Overview

**Hapus:** "Total GHG footprint 1,284.2", "Data quality health 97.7% Auditable", "Active baseline v2024.1 (Locked)", "Decarbonization pipeline -120.7 / Capex / Payback", grafik "SBTi 2030 Pathway", daftar "Urgent Data Quality Findings" rekaan, kartu "Baseline Reconciliation Governance" dengan v2024.1/v2025.0, kalimat "under PRD Section 4.3".

**Tampilkan (dari `tera_seed.json`, `dashboard`):**

| Elemen | Isi | Sumber di UI |
| --- | --- | --- |
| Kartu Scope 1+2 (ikut selektor FY) | FY 2025 = 1.736.327,9 tCO2e · FY 2024 = 1.561.941,65 · FY 2023 = 1.486.664,59 | SR Telkomsel 2025, hlm 147 |
| Perubahan vs tahun sebelumnya | FY 2025: +174.386,25 (+11,16%). FY 2024: +75.277,06 (+5,06%). FY 2023: "—" (tidak ada pembanding di seed). Kolom kosong ditampilkan "—", bukan nol | hlm 147 |
| Kartu kenaikan 2025 vs 2023 | 16,79% (dihitung ulang dari tabel). Teks: "Callout menulis 19,35% (ditandai, pemeriksaan #19)" dengan tautan ke `/data-quality?cek=19` | hlm 51 dan hlm 147 |
| Kartu level target | 1.189.331,67 tCO2e; gap FY 2025 = 546.996,23 tCO2e. Badge "Estimasi tim". Teks: "Hitungan tim (80% x baseline 2023 versi SR 2025). Estimasi tim; bukan angka resmi Telkomsel" | Hitungan tim |
| Kartu pemeriksaan ditandai | 3 dari 29 pemeriksaan dalam cakupan aturan α/β (#1, #19, #28). 3 di luar cakupan. Badge "In-sample". Waktu eksekusi terakhir | Dihitung aplikasi |
| Grafik tren | Scope 1+2 2023-2025, garis putus-putus = level target "(estimasi tim)" | hlm 147 |
| Komposisi FY | FY 2025: Scope 2 1.721.967,7 (99,17%), Scope 1 14.360,3 (0,83%). FY 2024: 1.542.604,35 (98,76%) dan 19.337,3 (1,24%). FY 2023: 1.466.798,14 (98,66%) dan 19.866,45 (1,34%) | hlm 147 |
| Tabel per scope | Scope 1, Scope 2, Scope 1+2 untuk tiga tahun | hlm 147 |
| Kartu Rekonsiliasi | "Baseline aktif (simulasi): Belum ada", "Revisi lintas laporan: 18 metrik", "Kode alasan revisi: Unresolved". Tautan ke Reconciliation | Seed |
| Kolom "Validasi record" di tabel | Ganti nama menjadi "Kelengkapan" dengan isi "Lengkap", atau hapus. Jangan menampilkan "Valid" untuk Scope 1 2025 yang ditandai #1 | - |

**Penerimaan:** FY selector bekerja untuk tiga tahun; tidak ada angka di luar seed; semua kartu bersumber.

### 3.3 Data Quality Center

**Hapus:** 10 record (ELC-2025-001, FD-2025-014, REF-2025-007, dst.), kartu "Total records 10 / 100% Coverage", "Critical violations", "Variance warnings", "Quality pass rate 50.0% / Meets ISO 14064-1 audit standard", "Telkomsel GHG Data Quality Protocol", filter DQ-01/02/06/07 pada record rekaan, tombol "Import Telemetry", teks "Quality Assurance".

**Bangun (dari `cek_32.csv` atau `tera_seed.json`, `cek_32`):**

| Elemen | Isi |
| --- | --- |
| Pernyataan atas | "Hasil in-sample. Aturan dan toleransi dirancang dari data yang sama. Dari 6 pemeriksaan yang gagal pada D6, 3 ditandai aplikasi; 3 lainnya di luar cakupan aturan. 0 dari 26 pemeriksaan yang lolos ditandai. Ini bukan bukti kinerja pada data lain." (nilai dihitung aplikasi, bukan diketik) |
| Kartu ringkasan | Total 32 (29 dalam cakupan) · Ditandai 3 (#1, #19, #28) · Tidak ditandai 26 · False positive 0 · Di luar cakupan 3 (#30, #31, #32) |
| Panel aturan | Aturan α (#1-#17, 17 pemeriksaan, 1 ditandai); Aturan β (#18-#29, 12 pemeriksaan, 2 ditandai); Aturan γ (#30-#32, "Tidak dikerjakan") |
| Tabel 32 pemeriksaan | Kolom: #, Pemeriksaan, Sumber (laporan, hlm), Tertulis, Hitung ulang, Selisih, Toleransi, Aturan, Hasil aplikasi. Filter: aturan, hasil, laporan, cari. Urut per kolom |
| Detail baris (drawer) | Input, rumus, sumber, catatan D6 |
| Tombol "Jalankan aturan" | Menjalankan α dan β di sisi klien, memperbarui hitungan dan waktu eksekusi |
| #30-#32 | Tetap tampil dengan label "Di luar cakupan aturan saat ini". Hasil D6 boleh ditampilkan sebagai keterangan. Tidak ditandai aplikasi |

**Aturan (acuan resmi: `verify_seed.py`):**

| Aturan | Cakupan | Perhitungan | Ditandai bila |
| --- | --- | --- | --- |
| α | #1-#17 | Jumlah `input` dibandingkan `nilai_tertulis` | `\|hitung − tertulis\| > toleransi_d6` |
| β | #18-#29 | Rumus pada `input`: `(G/H-1)*100`, `-((G/H)/(I/J)-1)*100`, `G/H*100` | sama |

Toleransi per pemeriksaan **diambil dari `toleransi_d6`**, bukan diketik. Ada 9 pengecualian dari 0,15 dan 0,1: #11-#17 (1), #23 (0,5), #29 (1,0). Dilarang menyetel ulang toleransi setelah melihat hasil.

**Hasil yang harus muncul (uji penerimaan):**

| Pemeriksaan | Tertulis | Hitung ulang | Selisih | Hasil |
| --- | --- | --- | --- | --- |
| #1 Scope 1 2025 (hlm 147) | 14.360,3 | 14.357,37 | −2,93 tCO2e | Ditandai |
| #19 Kenaikan callout (hlm 147) | 19,35 | 16,79 | −2,56 pp | Ditandai |
| #28 Penurunan intensitas callout (hlm 147) | 8,86 | 10,82 | +1,96 pp | Ditandai |
| #4 (batas) | 1.736.327,9 | 1.736.328,00 | +0,10 | Tidak ditandai |
| #23 (batas) | 302 | 302,09 | +0,09 | Tidak ditandai |
| #29 (batas) | 98 | 98,74 | +0,74 | Tidak ditandai |
| 23 pemeriksaan lain di cakupan | | | | Tidak ditandai |

Catatan teks: #28 ditulis "tidak cocok dengan basis 2023-2025", bukan "angka salah"; basis 8,86% tidak diketahui. Tingkat keparahan (Error atau Warning) belum diputuskan: sementara tampilkan "Ditandai untuk review".

### 3.4 Baseline Reconciliation

**Hapus:** pemilih "Location-based / Market-based (REC)", empat versi (v2023.1 960, v2023.2 1080, v2024.1 1146, v2025.0-Draft 1284,2), "Telkomsel ESG Annual Audited Report 2024", peringatan ">5% mandatory board review under PRD Section 4.3 and Telkomsel ESG By-Laws", kartu varians Scope 1/Scope 2/Net, **seluruh ledger** (data center, fleet diesel, refrigerant, gas turbine, dan semua "evidence": PLN Official Gazette, Pertamina Fleet Card, PGN, Deed of Asset Acquisition), tombol "Approve & Ratify", teks "immutable Audit Trail".

(Catatan: ledger itu juga tidak konsisten secara internal. Jumlah barisnya sekitar 1.456,5 dan 1.590,4, bukan 1.146 dan 1.284,2.)

**Bangun (dari seed `baseline_scope1_2_2023` dan `revisi_18`):**

| Elemen | Isi |
| --- | --- |
| Tiga versi Scope 1+2 2023 | SR 2023: 1.400.753 (hlm 51). SR 2024: 1.454.708,89 (hlm 113), +53.955,89 (+3,85%). SR 2025: 1.486.664,59 (hlm 147), +31.955,70 (+2,20%). Semua versi tetap terlihat, termasuk yang tidak aktif |
| Kode alasan | `Unresolved` untuk semua. Catatan: "Catatan restatement bersifat umum (SR 2024 hlm 113); sebab dan besaran per angka tidak dirinci" dan "Tidak ada catatan restatement pada tabel (SR 2025 hlm 147)" |
| Bandingkan dua versi | Dua dropdown A (pembanding) dan B (dibandingkan), tombol tukar. Selisih = B − A, persen terhadap A. Hitungan oleh fungsi aplikasi, bukan komponen |
| Revisi lintas laporan | Tabel 18 baris (`Hanya revisi (18)`) dan `Semua (25)` (18 + 7 identik). Kolom: metrik, nilai lama (laporan, hlm), nilai baru (laporan, hlm), % selisih, status, catatan laporan, kode alasan. 13 "Catatan umum", 5 "Tidak ada catatan", 0 spesifik |
| Persetujuan (simulasi) | Alur Draft → Pending Review → Approved/Rejected. Aturan: alasan perubahan wajib diisi; Rejected tidak menjadi baseline aktif; Approved menetapkan baseline aktif (simulasi); versi lama tetap terlihat; kode alasan tetap Unresolved. Tombol "Reset simulasi" |
| Teks wajib | "Simulasi. Persetujuan disimulasikan di browser ini, tanpa login dan tanpa pemisahan peran. Approved ≠ diaudit independen." |

Penamaan tombol: "Setujui (simulasi)" dan "Tolak (simulasi)" menggantikan "Approve & Ratify" dan "Reject Baseline Revision". Jangan memakai kata "ratify", "sign-off", atau "board".

**Hasil yang harus muncul:** SR 2023 → 2024 = +53.955,89 (+3,85%); SR 2024 → 2025 = +31.955,70 (+2,20%); SR 2023 → 2025 = +85.911,59 (+6,13%).

### 3.5 Carbon Driver Analysis, Decision Lab, Governance & Audit Trail (layar spesifikasi)

Tidak ada data seed untuk ketiganya. **Seluruh isi diganti** dengan layar spesifikasi yang sama polanya:

| Elemen | Isi |
| --- | --- |
| Judul | Nama halaman + badge "Spesifikasi" |
| Pernyataan | "Masih spesifikasi; belum dibangun pada prototipe ini." |
| Tujuan | Satu kalimat dari PRD: Carbon Driver Analysis = memisahkan faktor penyebab perubahan emisi berdasarkan data yang tersedia. Decision Lab = membandingkan alternatif dekarbonisasi berdasarkan emisi, biaya, dan kelayakan. Governance & Audit Trail = mencatat aktivitas dan keputusan. Rujukan: "Lihat PRD, bagian halaman terkait" |
| Khusus Governance | Teks: "Log pada prototipe tidak tahan manipulasi. Jejak audit sungguhan membutuhkan backend dengan log append-only (spesifikasi produksi, belum dibangun)." |
| Dilarang | Angka, nama orang atau jabatan, hash, stempel ISO, tabel, grafik, kartu KPI, kata "Verified", "Signed", "Intact" |

**Hapus total di Governance:** "Bambang S. (Head of ESG)", "Rina Kartika (Lead Auditor)", "Hendra Wijaya (ESG Controller)", dan seluruh nama lain; "1.428 events", "100% Cryptographic", "Hash Chain Intact", "Zero unauthorized restatements", "Formal ISO Stamp", "PLN API Verified", "ISO 14064-1 compliance". Rekaman persetujuan oleh orang fiktif seolah-olah nyata adalah risiko terbesar di build ini.

## 4. Data dan implementasi

| Hal | Aturan |
| --- | --- |
| Sumber data | Impor `tera_seed.json` sebagai satu-satunya sumber. Jangan menyalin angka ke komponen |
| Format angka | Pemisah ribuan titik, desimal koma (id-ID), mis. 1.736.327,9 |
| Perhitungan | Selisih dan persen dihitung oleh fungsi terpisah dari komponen UI (PRD) |
| Uji | Jalankan logika α/β dan bandingkan dengan `python3 verify_seed.py tera_seed.json`. Keluaran harus `ditandai: [1, 19, 28]` |
| Routing | Jalur seperti `/overview`, `/data-quality`, `/reconciliation` harus tetap membuka langsung (SPA rewrite di Vercel) |
| Deployment lama | Deployment sebelumnya di Vercel biasanya tetap dapat diakses lewat URL uniknya. Periksa dan **hapus atau lindungi** deployment lama, supaya versi berisi data rekaan tidak tetap bisa diakses |
| Preview | Matikan atau lindungi preview deployment yang berisi build lama |

## 5. Yang tidak boleh ada di mana pun (tampilan, kode, data, README)

| Jenis | Contoh |
| --- | --- |
| Klaim audit atau kepatuhan | "Auditable", "audit standard", "assurance", "compliance", "ISO 14064", "Formal ISO Stamp", "Quality Assurance" |
| Klaim teknis yang tidak ada | "immutable", "tamper-evident", "cryptographic", "hash chain", "append-only ledger", "real-time", "PLN API Verified" |
| Klaim manfaat | "Capex", "Payback", "-120.7 tCO₂e/yr", "SBTi", "Paris", "1.5°C", "MACC" |
| Angka rekaan | `1,284`, `1284`, `1146`, `1,146`, `1080`, `960`, `v2024.1`, `v2025.0`, `v2023` |
| ID dan orang rekaan | `ELC-2025`, `FD-2025`, `REF-2025`, `STM-2025`, `Bambang`, `Rina Kartika`, `Hendra`, `Santoso`, `Dewi`, `Pratama` |
| Sumber dan institusi rekaan | `PLN`, `Pertamina`, `PGN`, `Deed of Asset`, `By-Laws`, `Board`, `Carrier BTS` |
| Label status rekaan | "VERIFIED" atau "ESTIMATED" pada data yang bukan dari seed |
| Ungkapan terlarang | "siap audit", "maker-checker ditegakkan", "tahan manipulasi", "6 dari 6" |
| Identitas institusi | Logo atau nama kampus, nama dosen |

## 6. Uji kata nol-hasil

Setelah semua perubahan, cari seluruh tampilan (teks halaman, judul, meta, atribut) dan seluruh repositori (termasuk README dan JSON mock) dengan daftar di bagian 5 (tanpa membedakan huruf besar kecil). **Hasil harus nol.** Kata "PRD" dan "TERA" boleh ada.

Contoh perintah di repositori:

```
grep -rniE "ISO 14064|audit|assurance|compliance|immutable|tamper|cryptographic|hash chain|ledger|capex|payback|sbti|macc|1,?284|1,?146|v2024|v2025|ELC-2025|FD-2025|REF-2025|STM-2025|Bambang|Kartika|Hendra|Santoso|Dewi|Pratama|PLN|Pertamina|PGN|By-Laws|\bBoard\b" src public README.md
```

Kata "audit" dan "Board" (kata utuh, bukan "Dashboard") boleh tersisa hanya dalam kalimat yang justru menyangkal klaim (mis. "tidak tahan manipulasi", "Approved ≠ diaudit independen"). Sebutkan setiap sisa kata itu dalam laporan ke Cah.

## 7. Cek QA yang harus dilaporkan

| # | Cek | Lulus bila |
| --- | --- | --- |
| 1 | Seed = D6 | Data di aplikasi identik dengan `tera_seed.json` (diff otomatis nol) |
| 2 | Sumber tampil | Setiap angka menunjukkan nama laporan dan halaman cetak |
| 3 | Pilih dua versi | SR 2023→2024 +53.955,89 (3,85%); 2024→2025 +31.955,70 (2,20%) |
| 4 | Alur persetujuan | Draft → Pending → Approved/Rejected; Rejected tidak menjadi baseline aktif; versi lama tetap terlihat; label simulasi tampak; Reset simulasi berfungsi |
| 5 | Aturan α | Hanya #1 ditandai pada #1-#17 |
| 6 | Aturan β | Hanya #19 dan #28 ditandai pada #18-#29 |
| 7 | Tanpa false positive | 26 pemeriksaan yang lolos tidak ditandai |
| 8 | Dapat diulang | Clone baru, jalankan, hasil sama; `verify_seed.py` cocok dengan aplikasi |
| 9 | Teks UI | Lolos uji kata nol-hasil (bagian 6) |
| 10 | Kebersihan | Tanpa logo atau nama institusi dan tanpa catatan internal |
| 11 | Situs publik | Judul tab benar; semua jalur terbuka langsung; tidak ada error di konsol; deployment lama sudah dihapus atau dilindungi |
| 12 | Selektor FY | FY 2023, 2024, 2025 menampilkan angka yang sesuai seed di Overview |

## 8. Laporan balik ke Cah

| Isi | Format |
| --- | --- |
| Hasil cek 1-12 | Tabel: lulus atau tidak per cek, catatan singkat |
| Hasil uji kata | Daftar sisa kata (atau "nol hasil") dan lokasinya |
| Versi | Tautan produksi dan nomor commit |
| Yang tidak sempat | Daftar jujur. Lebih baik ditulis "spesifikasi" daripada klaim berlebih |
| Keputusan tim dev | Tingkat keparahan DQ-08/09, dan bahasa UI yang dipakai |

## 9. Batas wewenang

| Boleh | Tidak boleh tanpa kabar ke Cah |
| --- | --- |
| Memindahkan komponen dari build localhost | Mengubah seed, toleransi, atau cakupan aturan |
| Merapikan tampilan | Menambah halaman atau fitur baru |
| Menghapus konten fiktif | Mengganti teks wajib di bagian 3 |
| Menandai halaman sebagai spesifikasi | Menulis klaim apa pun yang ada di bagian 5 |

## 10. Pertanyaan terbuka untuk tim dev

| # | Pertanyaan |
| --- | --- |
| 1 | Apakah build Vercel dan build localhost satu repositori? Bila ya, cabang mana yang dideploy? |
| 2 | Adakah data mock lain di kode (JSON, fixture, komentar) yang memuat angka atau nama fiktif? |
| 3 | Siapa yang punya akses deploy dan menghapus deployment lama? |
| 4 | Tingkat keparahan DQ-08/09: Error atau Warning? |
| 5 | Bahasa UI akhir: Indonesia atau Inggris? |
