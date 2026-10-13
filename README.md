# PENDEKAR MODUL AJAR DAN KOKURIKULER AI
### AI Teacher Planning Assistant — Kemendikdasmen RI

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6+-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-Apache_2.0-green.svg)](LICENSE)

**PENDEKAR MODUL AJAR DAN KOKURIKULER AI** adalah aplikasi asisten perencanaan pembelajaran cerdas yang dirancang khusus untuk guru di Indonesia (jenjang PAUD, SD, SMP, SMA, dan SMK). Aplikasi ini membantu pendidik menyusun perangkat pembelajaran yang sistematis, kontekstual, terukur, dan selaras dengan kebijakan pendidikan nasional terbaru dari Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen).

- **Pengembang:** Andika Yuliananta, S.Pd.
- **Landasan Pedagogis:** Kerangka Pembelajaran Mendalam **8–3–3–4** Kemendikdasmen RI

---

## 🌟 Fitur Utama

### 1. Generator Modul Ajar Berbasis Pembelajaran Mendalam (8–3–3–4)
Menghasilkan modul ajar dengan alur logis yang utuh dan saling terintegrasi:
- **8 Dimensi Profil Lulusan:** Pemilihan dimensi relevan dengan rasionalisasi pedagogis terukur.
- **3 Prinsip Pembelajaran:** Berkesadaran, Bermakna, dan Menggembirakan.
- **3 Pengalaman Belajar:** Memahami, Mengaplikasi, dan Merefleksi.
- **4 Desain Praktik Pedagogis:** Pilihan model pembelajaran autentik (Inkuiri, PBL, PjBL, Diferensiasi).
- **Komponen Lengkap:** Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), Kriteria Ketercapaian (KKTP), Asesmen Awal, Formatif, Sumatif, Instrumen & Rubrik, Diferensiasi, hingga Lembar Refleksi Guru & Murid.
- **Fleksibilitas Format:** Pilihan output format Ringkas (1–2 halaman) atau Lengkap Resmi (A4).

### 2. Rancang Program Kokurikuler Lintas Mata Pelajaran (Alur 6 Langkah)
Menyusun program kokurikuler kolaboratif lintas disiplin ilmu yang terstruktur dari Judul hingga Asesmen sesuai format dokumen resmi Kemendikdasmen:
1. **Alur 1:** Pemilihan Fase (Fase Fondasi s.d. Fase F) dan Tema resmi (Gaya Hidup Berkelanjutan, Kewirausahaan, Kearifan Lokal, Hidup Sehat, dll., atau tema kustom).
2. **Alur 2:** Integrasi Mata Pelajaran & Bantuan AI untuk ide kontribusi masing-masing mapel.
3. **Alur 3:** Penentuan Masalah Kontekstual, Tujuan Program, dan Produk Akhir Nyata (dengan rekomendasi cerdas AI).
4. **Alur 4:** Pemilihan Dimensi Profil Lulusan yang dituju.
5. **Alur 5:** Alokasi Total JP, Jumlah Pertemuan, Kemitraan, dan Pemanfaatan Digital.
6. **Alur 6:** Dokumen Lengkap memuat:
   - Identitas Proyek Resmi
   - Deskripsi Kokurikuler
   - Diagram Alur Tahapan (*Pengenalan ➔ Kontekstualisasi ➔ Aksi ➔ Refleksi ➔ Tindak Lanjut*)
   - Matriks Alur & Rincian Aktivitas (Persiapan, Pelaksanaan, Cuplikan Asesmen)
   - Tabel Rubrik Penilaian Dimensi 3 Tingkat (*Berkembang*, *Cakap*, *Mahir*).

### 3. Ekspor & Manajemen Dokumen
- **Download Dokumen Microsoft Word (.doc)** dengan tabel rubrik dan format rapi siap edit.
- **Pratinjau Cetak / Cetak Langsung (A4)** terstandar dokumen dinas sekolah.
- **Salin Teks Format** untuk kemudahan pemindahan dokumen ke Google Docs/aplikasi lain.
- **Penyimpanan Cloud Database** berbasis Firebase Firestore untuk menyimpan dan mengelola riwayat modul ajar dan program kokurikuler yang telah dibuat.

---

## 🛠️ Arsitektur & Teknologi

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React Icons, Motion.
- **Backend:** Express.js, TypeScript via `tsx`.
- **Kecerdasan Buatan (AI):** `@google/genai` (Google Gemini API).
- **Database:** Google Cloud Firebase Firestore.

---

## 🚀 Panduan Memulai (Quick Start)

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18 atau versi LTS terbaru.
- `npm` atau `yarn` / `pnpm` / `bun`.

### 1. Kloning Repositori
```bash
git clone https://github.com/USERNAME_ANDA/NAMA_REPOSITORY.git
cd NAMA_REPOSITORY
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka `.env` dan masukkan API Key Gemini Anda:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

> **Catatan:** Anda dapat memperoleh API Key Gemini secara gratis di [Google AI Studio](https://aistudio.google.com/).

### 4. Jalankan Aplikasi di Lingkungan Lokal
```bash
npm run dev
```
Aplikasi akan aktif di `http://localhost:3000`.

---

## 📦 Skrip yang Tersedia

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server backend Express dan frontend Vite development |
| `npm run build` | Melakukan kompilasi aset produksi dengan Vite |
| `npm run start` | Menjalankan server produksi |
| `npm run lint` | Melakukan pemeriksaan tipe TypeScript (`tsc --noEmit`) |
| `npm run clean` | Membersihkan folder build `dist` |

---

## 📤 Langkah Menghubungkan & Push ke GitHub

Jika Anda ingin mengunggah proyek ini ke akun GitHub Anda:

1. **Buat repositori baru di GitHub:**
   - Masuk ke [github.com/new](https://github.com/new).
   - Beri nama repositori (contoh: `pendekar-modul-ajar-ai`).
   - Pilih *Public* atau *Private*. Jangan centang *"Add a README file"* karena berkas README sudah tersedia.

2. **Jalankan perintah Git di terminal/komputer lokal:**
   ```bash
   # Inisialisasi Git (jika belum)
   git init

   # Tambahkan semua berkas ke staging
   git add .

   # Buat commit pertama
   git commit -m "feat: inisialisasi aplikasi Pendekar Modul Ajar dan Kokurikuler AI"

   # Ubah branch utama menjadi main
   git branch -M main

   # Tambahkan URL repositori remote GitHub Anda
   git remote add origin https://github.com/USERNAME_ANDA/pendekar-modul-ajar-ai.git

   # Unggah ke GitHub
   git push -u origin main
   ```

---

## 📜 Lisensi & Atribusi

Dikembangkan oleh **Andika Yuliananta, S.Pd.**  
Didistribusikan di bawah lisensi Apache License 2.0. Silakan gunakan dan kembangkan untuk kemajuan pendidikan di Indonesia.
