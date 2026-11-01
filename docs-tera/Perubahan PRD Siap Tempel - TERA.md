# Perubahan PRD Siap Tempel: TERA

31 Okt 2026 · untuk tim produk · terkait panduan seed dan cek QA prototipe

Lima perubahan teks pada PRD sebelum 1 Nov 2026. Tidak ada fitur baru. Perubahan 2 dikerjakan pukul 16.00 setelah hasil cek QA diketahui; sisanya bisa dikerjakan sekarang.

## 1. Hapus catatan internal

| Lokasi | Tindakan |
| --- | --- |
| Halaman Data Quality Center | Hapus baris "Point no 8 ga perlu dibuat," |

## 2. "Target deliverable" di halaman judul

Pilih satu pukul 16.00 sesuai hasil cek QA.

| Hasil | Teks |
| --- | --- |
| Semua cek lulus | `Proposal + prototipe terbatas (Dashboard, Data Quality Center, Baseline Reconciliation)` |
| Reconciliation jalan, aturan baru belum lulus | `Proposal + prototipe terbatas (Baseline Reconciliation)` |
| Go/no-go gagal | `Proposal + spesifikasi produk dan rancangan layar` |

## 3. Tabel aturan validasi: tambah DQ-08 dan DQ-09

| Rule ID | Rule | Hasil |
| --- | --- | --- |
| DQ-08 | Jumlah komponen harus sama dengan total tertulis pada laporan yang sama | Ditandai untuk review bila \|selisih\| melebihi toleransi (0,15 tCO2e untuk emisi; 1 untuk energi dan Scope 3) |
| DQ-09 | Persentase perubahan dihitung ulang dari angka mentah dan dibandingkan dengan persentase tertulis atau callout | Ditandai untuk review bila \|selisih\| melebihi 0,1 poin persentase (0,5 untuk "+302%"; 1,0 untuk "98%") |

Tambahkan paragraf di bawah tabel:

> DQ-08 dan DQ-09 dirancang dari 32 pemeriksaan pada laporan keberlanjutan 2023–2025 (in-sample). Toleransi dapat dikonfigurasi dan ditetapkan tim. Aturan ini belum menguji konsistensi satuan dan basis perhitungan; hal itu berada di luar cakupan versi ini.

Tingkat keparahan (Error atau Warning) untuk DQ-08 dan DQ-09 sengaja dibiarkan terbuka. Keputusan ada pada tim produk.

## 4. Business rule "immutable" (halaman Baseline Reconciliation, bagian E)

Ganti "Versi yang telah disetujui bersifat immutable dalam riwayat." dengan:

> Dalam riwayat, versi yang telah disetujui tidak ditimpa: setiap perubahan membuat versi baru. Pada prototipe, aturan ini disimulasikan di sisi klien (data lokal) dan tidak tahan manipulasi. Immutability sungguhan membutuhkan backend dengan log append-only (spesifikasi produksi, belum dibangun).

## 5. Bagian 1.2 (Tujuan MVP) dan tabel prioritas

Tambahkan satu kalimat di akhir bagian 1.2:

> Cakupan build untuk 1 November 2026: Dashboard, Data Quality Center, dan Baseline Reconciliation (persetujuan disimulasikan). Halaman lain berstatus spesifikasi.

Tambahkan kolom "Status 1 Nov" pada tabel prioritas:

| Item | Status 1 Nov |
| --- | --- |
| Design system dan app shell, Seed data dan tipe data, Data Quality Center, Baseline Reconciliation, Overview | Dibangun (terbatas) |
| Carbon Driver Analysis, Decision Lab, Governance & Audit Trail | Spesifikasi |
| AI-assisted anomaly explanations, Real system integration | Spesifikasi (tidak dibangun) |

"Dibangun (terbatas)" hanya berlaku bila fungsinya lulus cek QA. Fungsi yang gagal diturunkan menjadi Spesifikasi.

## Yang tidak diubah

Halaman Governance & Audit Trail sudah melarang demo menyebut log frontend sebagai sistem audit yang tahan manipulasi. Biarkan.

## Yang masih terbuka

| # | Hal | Siapa |
| --- | --- | --- |
| 1 | Tingkat keparahan DQ-08 dan DQ-09 | Tim produk |
| 2 | Cek tempat teks "Target Progress 50% from 2020" dan "Others" (tidak ada di teks PRD; mungkin di gambar atau data demo). Hapus bila ada. | Tim produk |
| 3 | Apakah PRD ikut dilampirkan ke paper. Bila ya, semua perubahan di atas wajib sebelum dilampirkan | Cah dan penulis |

## Aturan panduan yang berlaku pada lampiran

| Aturan | Dampak |
| --- | --- |
| Dilarang logo dan/atau identitas institusi | Tidak ada logo, nama kampus, atau nama dosen. Nama tim boleh (wajib di sampul). "Logo TERA" di PRD adalah logo produk, bukan institusi |
| Nama file `[NamaTim]_BCC_Semifinal_TSF 2026.pdf`, PDF maksimal 10 MB | Berlaku untuk paper final |
| Lampiran tidak dihitung dalam batas 25 halaman | PRD, panduan seed, dan tabel besar aman di lampiran |
