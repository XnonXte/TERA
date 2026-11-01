# Panduan Seed dan Cek QA Prototipe TERA

31 Okt 2026 · untuk tim produk · disusun dari D6 (berkas 32 pemeriksaan, 6 gagal, 18 revisi)

## 1. Keputusan cakupan yang berlaku

| # | Keputusan |
| --- | --- |
| 1 | Cakupan: Dashboard, Baseline Reconciliation (termasuk persetujuan berlabel simulasi), Data Quality Center. Carbon Driver, Decision Lab, dan Audit Trail tetap spesifikasi. Log aktivitas (opsi B) hanya bila semua cek 1-10 lulus sebelum 10.00, berlabel simulasi |
| 2 | Aturan DQ baru: α (komponen = total) dan β (persentase dihitung ulang). γ (satuan dan basis) tidak dikerjakan |
| 3 | Jadwal (WIB, Minggu 1 Nov): go/no-go 10.00 (oleh Cah), bekukan 12.00, tangkapan layar 14.00, status dikunci 16.00, PDF final 18.00 |
| 4 | Toleransi: α 0,15 tCO2e, β 0,1 poin persentase (disetujui). Sembilan pemeriksaan memakai toleransi lain dari D6 (lihat bagian 4); ikuti D6, jangan diubah setelah melihat hasil |

## 2. Berkas

| Berkas | Isi |
| --- | --- |
| `tera_seed.json` | Dashboard, 3 versi baseline 2023, 18 revisi, 7 metrik tidak direvisi, 32 pemeriksaan beserta aturan dan hasil acuan |
| `cek_32.csv` | 32 pemeriksaan (input, rumus, toleransi, hasil, aturan prototipe, hasil yang diharapkan) |
| `revisi_18.csv` | 18 revisi lintas laporan dengan halaman sumber |
| `verify_seed.py` | Implementasi acuan aturan α dan β. Jalankan `python3 verify_seed.py tera_seed.json`; keluarannya harus `ditandai: [1, 19, 28]` |

Seed dihasilkan otomatis dari D6, tidak diketik ulang. Semua nilai bersumber dari halaman cetak laporan. Gunakan berkas ini apa adanya; bila perlu mengubah angka, kembali ke D6 dan beri tahu Cah.

## 3. Aturan DQ yang dikerjakan

| Aturan | Cakupan | Perhitungan | Ditandai bila | Hasil acuan |
| --- | --- | --- | --- | --- |
| α | Pemeriksaan #1-#17 (kelompok G1) | Jumlah input komponen dibandingkan dengan nilai tertulis | \|selisih\| > toleransi | Hanya #1 (komponen 14.357,37 vs total 14.360,3; selisih -2,93; SR 2025 hlm 147) |
| β | Pemeriksaan #18-#29 (kelompok G2) | Persentase dihitung ulang dari rumus pada input | \|selisih\| > toleransi | #19 (16,79% vs callout 19,35%; selisih 2,56 pp; hlm 147) dan #28 (10,82% vs 8,86%; selisih 1,96 pp; hlm 147) |
| Di luar cakupan | #30, #31, #32 | Satuan dan basis | - | Tampilkan sebagai "di luar cakupan aturan saat ini". Jangan disembunyikan dan jangan ditandai |

Untuk #28, teksnya "tidak cocok dengan basis 2023-2025", bukan "angka salah": basis 8,86% tidak diketahui (D6).

## 4. Catatan data

- **Level target** (1.189.331,67 tCO2e) dan gap (546.996,23) adalah hitungan tim: 80% × baseline 2023 versi SR 2025. Status Estimasi tim; label itu harus tampil. Bukan angka resmi Telkomsel.
- Kode alasan revisi di seed diisi `Unresolved`. D6 mencatat 0 dari 18 revisi punya alasan spesifik; jangan memilih kategori dari tujuh pilihan PRD.
- Toleransi bukan default pada 9 pemeriksaan: #11-#17 (satuan 1, energi dan Scope 3), #23 (0,5 pp, "+302%"), #29 (1,0 pp, "98%"). Nilainya ada di `toleransi_d6`.
- Hasil aturan pada data ini bersifat **in-sample**: aturan dan toleransi dirancang dari data yang sama. Dari 26 pemeriksaan yang lolos, 0 ditandai, tetapi itu bukan bukti kinerja di data lain.
- Hapus "Target Progress 50% from 2020" dan kategori "Others" dari data demo lama (tidak ada sumbernya).

## 5. Daftar cek QA (lulus semua sebelum 10.00 untuk go)

| # | Cek | Lulus bila | Hasil |
| --- | --- | --- | --- |
| 1 | Seed = D6 | Data di aplikasi identik dengan `tera_seed.json` (diff otomatis nol) | |
| 2 | Sumber tampil | Setiap angka menunjukkan nama laporan dan halaman cetak | |
| 3 | Pilih dua versi | Selisih sesuai: SR 2023→2024 +53.955,89 (3,85%); 2024→2025 +31.955,70 (2,20%) | |
| 4 | Alur persetujuan | Draft → Pending → Approved/Rejected; Rejected tidak menjadi baseline aktif; versi lama tetap terlihat; label "simulasi" dan "Approved ≠ diaudit independen" tampil | |
| 5 | Aturan α | Hanya #1 yang ditandai pada #1-#17 | |
| 6 | Aturan β | Hanya #19 dan #28 yang ditandai pada #18-#29 | |
| 7 | Tanpa false positive | 26 pemeriksaan yang lolos tidak ditandai | |
| 8 | Dapat diulang | Orang lain menjalankan dari repositori bersih dan hasilnya sama; `verify_seed.py` cocok dengan keluaran aplikasi | |
| 9 | Teks UI | Tidak ada "siap audit", "immutable", "maker-checker ditegakkan", "tahan manipulasi", "6 dari 6" | |
| 10 | Kebersihan | Tanpa logo institusi, tanpa catatan internal, label data demo tampak | |

**Opsi B (log aktivitas)** hanya dikerjakan bila cek 1-10 lulus sebelum 10.00. Label: "log disimulasikan di sisi klien, bukan jejak audit tahan manipulasi".

## 6. Status prototipe (dipilih pukul 16.00 dari hasil nyata)

| Hasil | Kalimat yang boleh ditulis |
| --- | --- |
| Cek 1-10 lulus | "Prototipe terbatas (tiga halaman) berjalan dengan data dari laporan keberlanjutan. Ia membandingkan tiga versi baseline 2023 dan menandai 3 dari 6 pemeriksaan gagal pada data yang sama (in-sample; 0 dari 26 pemeriksaan yang lolos ditandai). Persetujuan disimulasikan. Fungsi lain masih spesifikasi." |
| Reconciliation jalan, cek 5-7 tidak lulus | "Prototipe terbatas membandingkan versi baseline. Aturan pemeriksaan baru masih spesifikasi." |
| Go/no-go gagal | "Spesifikasi produk dan rancangan layar. Prototipe berfungsi belum tersedia." |

Fungsi hanya boleh ditulis berfungsi bila dijalankan dari awal sampai akhir dengan data seed, hasilnya cocok dengan perhitungan manual, dan tangkapan layarnya ada.
