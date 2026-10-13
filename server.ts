import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('GEMINI_API_KEY environment variable is not set!');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION_8334 = `
Anda adalah "AI Teacher Planning Assistant" profesional (Pendekar Modul Ajar dan Kokurikuler AI) karya Andika Yuliananta, S.Pd.
Tugas Anda adalah menghasilkan dokumen perencanaan pembelajaran (Modul Ajar, Asesmen, Rubrik, Program Kokurikuler) yang selaras dengan kebijakan Kemendikdasmen RI terbaru berbasis Pembelajaran Mendalam (Deep Learning) 8–3–3–4:

1. 8 DIMENSI PROFIL LULUSAN:
   1) Keimanan dan Ketakwaan terhadap Tuhan YME
   2) Kewargaan
   3) Penalaran Kritis
   4) Kreativitas
   5) Kolaborasi
   6) Kemandirian
   7) Kesehatan
   8) Komunikasi
   (Pilih 2-4 dimensi paling relevan, jangan paksakan semua, sertakan alasan & keterkaitannya).

2. 3 PRINSIP PEMBELAJARAN:
   - BERKESADARAN: peserta didik paham tujuan, regulasi diri, paham indikator keberhasilan.
   - BERMAKNA: dikaitkan kehidupan nyata peserta didik, penyelesaian masalah kontekstual.
   - MENGGEMBIRAKAN: aman secara psikologis, menantang sesuai level, memicu rasa ingin tahu, aktif & termotivasi.

3. 3 PENGALAMAN BELAJAR:
   - MEMAHAMI: membangun pengetahuan, menanya, mengeksplorasi konsep awal.
   - MENGAPLIKASI: praktik, investigasi, pemecahan masalah, menghasilkan karya nyata.
   - MEREFLEKSI: evaluasi proses & hasil belajar, identifikasi kekuatan & kendala, penetapan tindak lanjut.

4. 4 KOMPONEN KERANGKA:
   - Praktik Pedagogis (Problem Based Learning, Inquiry, Project Based Learning, Contextual, Discovery, STEM, dll.)
   - Lingkungan Pembelajaran (Fisik, sosial, psikologis yang aman dan mendukung)
   - Kemitraan Pembelajaran (Orang tua, rekan sejawat, narasumber, lingkungan sekitar)
   - Pemanfaatan Digital (Secara bermakna, video/simulasi/Google Workspace/aplikasi interaktif)

ATURAN KETAT:
- Jangan mengarang nomor regulasi palsu atau CP palsu. Gunakan regulasi resmi Kemendikdasmen terbaru.
- Selalu hasilkan output dalam format JSON valid sesuai skema yang diminta.
- Gunakan Bahasa Indonesia baku, profesional, operasional, dan mudah dipraktikkan guru di kelas nyata.
`;

// 1. Generate TP from CP
app.post('/api/gemini/generate-tp', async (req, res) => {
  try {
    const { cp, subject, gradeLevel, phase, topic } = req.body;

    const prompt = `
Berdasarkan Capaian Pembelajaran (CP) berikut:
- Mata Pelajaran: ${subject || 'Umum'}
- Jenjang / Kelas: ${gradeLevel || 'SD/SMP/SMA'} (Fase ${phase || '-'})
- Topik / Materi: ${topic || '-'}
- Teks CP: "${cp}"

Susunlah 3-5 Tujuan Pembelajaran (TP) yang:
1. Spesifik, terukur, dan operasional (menggunakan Kata Kerja Operasional yang tepat).
2. Memuat kompetensi dan konten materi secara terpadu.
3. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) yang terukur.
4. Pemilihan 2-3 Dimensi Profil Lulusan yang paling selaras beserta indikator perilakunya.

Kembalikan HANYA JSON murni dengan format:
{
  "learningObjectives": [
    {
      "id": "tp-1",
      "statement": "Deskripsi TP...",
      "competency": "Kompetensi yang dicapai...",
      "materialScope": "Lingkup materi...",
      "kktp": ["Kriteria 1", "Kriteria 2", "Kriteria 3"],
      "recommendedDimensions": ["Penalaran Kritis", "Kolaborasi"],
      "dimensionReason": "Alasan singkat pemilihan..."
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_8334,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error generating TP:', error);
    res.status(500).json({ error: error.message || 'Gagal menghasilkan TP' });
  }
});

// 2. Generate Full Modul Ajar (8-3-3-4)
app.post('/api/gemini/generate-module', async (req, res) => {
  try {
    const {
      schoolIdentity,
      learningIdentity,
      customCp,
      customTp,
      pedagogicalModel,
      selectedDimensions,
      specialNeeds,
      differentiationOptions,
    } = req.body;

    const prompt = `
Buatlah Dokumen MODUL AJAR LENGKAP BERBASIS PEMBELAJARAN MENDALAM 8–3–3–4 KEMENDIKDASMEN untuk:

Identitas:
- Sekolah: ${schoolIdentity?.schoolName || 'SD/SMP/SMA Negeri'}
- Guru: ${schoolIdentity?.teacherName || 'Guru Pengampu, S.Pd.'} (NIP: ${schoolIdentity?.teacherNip || '-'})
- Kepala Sekolah: ${schoolIdentity?.headmasterName || 'Kepala Sekolah, M.Pd.'} (NIP: ${schoolIdentity?.headmasterNip || '-'})
- Mata Pelajaran: ${learningIdentity?.subject || 'Ilmu Pengetahuan Alam'}
- Jenjang/Kelas: ${learningIdentity?.gradeLevel || 'Fase D / Kelas 7'}
- Alokasi Waktu: ${learningIdentity?.allocatedTime || '2 x 40 menit (1 Pertemuan)'}
- Topik / Materi: ${learningIdentity?.topic || 'Ekosistem dan Keanekaragaman Hayati'}
- Jumlah Murid: ${learningIdentity?.studentCount || '32 orang'}
- Karakteristik & Kondisi Lingkungan: ${learningIdentity?.characteristics || 'Peserta didik menyukai aktivitas visual dan investigasi langsung.'}
- Sarana Prasarana: ${learningIdentity?.facilities || 'LCD proyektor, lingkungan taman sekolah, smartphone'}
- Model Pembelajaran: ${pedagogicalModel || 'Problem Based Learning'}
- CP: ${customCp || 'Sesuai kurikulum nasional resmi'}
- TP: ${customTp || 'Dianalisis dari CP'}
- Dimensi Terpilih: ${selectedDimensions?.join(', ') || 'Penalaran Kritis, Kolaborasi, Kreativitas'}

Sertakan seluruh komponen wajib:
1. Identitas Sekolah & Pembelajaran
2. Analisis Awal (Karakteristik peserta didik, pengetahuan prasyarat, kesiapan belajar)
3. Capaian Pembelajaran (CP) Resmi
4. Tujuan Pembelajaran (TP) Spesifik & Operasional
5. Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
6. 8 Dimensi Profil Lulusan (Alasan pemilihan dan indikator perilaku)
7. 3 Prinsip Pembelajaran (Bentuk konkret: Berkesadaran, Bermakna, Menggembirakan)
8. 3 Pengalaman Belajar (Memahami, Mengaplikasi, Merefleksi)
9. 4 Komponen Kerangka (Praktik Pedagogis dengan sintaks jelas, Lingkungan Belajar kondusif, Kemitraan Belajar yang relevan, Pemanfaatan Digital terarah)
10. Diferensiasi Pembelajaran (Konten, Proses, Produk)
11. Langkah Pembelajaran Rinci (Pendahuluan, Inti [Memahami, Mengaplikasi, Merefleksi], Penutup) dengan alokasi menit, aktivitas guru, dan aktivitas murid
12. Asesmen Autentik:
    - Diagnostik (Non-kognitif & kognitif)
    - Formatif (Observasi, LKPD, jurnal)
    - Sumatif (Teknik, bentuk, rubrik/kisi-kisi)
13. Rubrik Penilaian Analitik (4 Tingkat: Mahir/Sangat Baik, Cakap/Baik, Layak/Cukup, Baru Berkembang/Perlu Bimbingan)
14. Program Remedial & Pengayaan
15. Refleksi Guru & Refleksi Peserta Didik

KEMBALIKAN HANYA JSON MURNI dengan struktur berikut:
{
  "title": "Modul Ajar...",
  "subject": "${learningIdentity?.subject || ''}",
  "gradeLevel": "${learningIdentity?.gradeLevel || ''}",
  "phase": "${learningIdentity?.phase || ''}",
  "semester": "${learningIdentity?.semester || '1'}",
  "topic": "${learningIdentity?.topic || ''}",
  "allocatedTime": "${learningIdentity?.allocatedTime || ''}",
  "schoolInfo": {
    "name": "${schoolIdentity?.schoolName || ''}",
    "npsn": "${schoolIdentity?.npsn || ''}",
    "address": "${schoolIdentity?.address || ''}",
    "teacher": "${schoolIdentity?.teacherName || ''}",
    "teacherNip": "${schoolIdentity?.teacherNip || ''}",
    "headmaster": "${schoolIdentity?.headmasterName || ''}",
    "headmasterNip": "${schoolIdentity?.headmasterNip || ''}"
  },
  "initialAnalysis": {
    "studentCharacteristics": "...",
    "prerequisites": "...",
    "learningReadiness": "...",
    "environmentContext": "...",
    "facilities": "..."
  },
  "cp": "Teks lengkap CP...",
  "tpList": ["TP 1...", "TP 2..."],
  "kktp": [
    { "indicator": "...", "target": "..." }
  ],
  "profileDimensions": [
    {
      "dimension": "Penalaran Kritis",
      "justification": "Mengapa dipilih...",
      "behavioralIndicator": "Perilaku murid..."
    }
  ],
  "threePrinciples": {
    "conscious": "Bentuk penerapan Berkesadaran...",
    "meaningful": "Bentuk penerapan Bermakna...",
    "joyful": "Bentuk penerapan Menggembirakan..."
  },
  "threeExperiences": {
    "understand": "Langkah pengalaman Memahami...",
    "apply": "Langkah pengalaman Mengaplikasi...",
    "reflect": "Langkah pengalaman Merefleksi..."
  },
  "fourComponents": {
    "pedagogicalPractice": {
      "model": "${pedagogicalModel || 'Problem Based Learning'}",
      "strategyDescription": "Penjelasan sintaks..."
    },
    "learningEnvironment": {
      "physical": "...",
      "social": "...",
      "psychologicalSafety": "..."
    },
    "learningPartnership": {
      "stakeholders": ["Orang tua", "Masyarakat", "Rekan Sejawat"],
      "partnershipRole": "..."
    },
    "digitalUtilization": {
      "tools": ["Google Classroom", "YouTube Edu", "Simulasi interaktif"],
      "implementation": "..."
    }
  },
  "differentiation": {
    "content": "...",
    "process": "...",
    "product": "..."
  },
  "learningSteps": {
    "introduction": {
      "duration": "10 Menit",
      "activities": [
        { "activity": "Orientasi dan Pembiasaan Positif...", "teacherAction": "...", "studentAction": "..." },
        { "activity": "Apersepsi & Motivasi Bermakna...", "teacherAction": "...", "studentAction": "..." },
        { "activity": "Penyampaian Tujuan & Kriteria Sukses (Berkesadaran)...", "teacherAction": "...", "studentAction": "..." }
      ]
    },
    "core": {
      "duration": "60 Menit",
      "phases": [
        {
          "phaseName": "Fase 1: MEMAHAMI (Membangun Konsep)",
          "experienceType": "Memahami",
          "principle": "Berkesadaran & Bermakna",
          "dimension": "Penalaran Kritis",
          "teacherAction": "...",
          "studentAction": "...",
          "assessmentUsed": "Observasi pemahaman awal"
        },
        {
          "phaseName": "Fase 2: MENGAPLIKASI (Praktik / Investigasi / Pemecahan Masalah)",
          "experienceType": "Mengaplikasi",
          "principle": "Menggembirakan & Bermakna",
          "dimension": "Kolaborasi & Kreativitas",
          "teacherAction": "...",
          "studentAction": "...",
          "assessmentUsed": "Penilaian Kinerja / LKPD"
        },
        {
          "phaseName": "Fase 3: MEREFLEKSI (Evaluasi & Pengolahan Temuan)",
          "experienceType": "Merefleksi",
          "principle": "Berkesadaran",
          "dimension": "Komunikasi & Kemandirian",
          "teacherAction": "...",
          "studentAction": "...",
          "assessmentUsed": "Lembar refleksi diri"
        }
      ]
    },
    "closing": {
      "duration": "10 Menit",
      "activities": [
        { "activity": "Refleksi dan Penarikan Kesimpulan...", "teacherAction": "...", "studentAction": "..." },
        { "activity": "Umpan Balik dan Tindak Lanjut...", "teacherAction": "...", "studentAction": "..." },
        { "activity": "Penguatan Moral & Penutupan Doa...", "teacherAction": "...", "studentAction": "..." }
      ]
    }
  },
  "assessments": {
    "diagnostic": {
      "purpose": "...",
      "technique": "Tanya jawab lisan & kuesioner minat",
      "instrument": "Daftar pertanyaan diagnostik",
      "items": ["Pertanyaan 1...", "Pertanyaan 2..."],
      "followUp": "..."
    },
    "formative": {
      "purpose": "Memantau perkembangan belajar...",
      "technique": "Observasi & LKPD kelompok",
      "instrument": "Lembar Observasi & Rubrik Kinerja",
      "indicators": ["Indikator 1...", "Indikator 2..."]
    },
    "summative": {
      "technique": "Tes Tertulis / Penilaian Produk",
      "form": "Pilihan Ganda HOTS & Uraian Kontekstual",
      "blueprint": "Kisi-kisi soal...",
      "scoringGuide": "Panduan penskoran..."
    }
  },
  "rubrics": [
    {
      "aspect": "Penguasaan Konsep & Penalaran",
      "level4": "Menjelaskan konsep sangat mendalam...",
      "level3": "Menjelaskan konsep dengan tepat...",
      "level2": "Menjelaskan konsep sebagian...",
      "level1": "Belum mampu menjelaskan konsep..."
    },
    {
      "aspect": "Kolaborasi & Partisipasi Kelompok",
      "level4": "Sangat proaktif berbagi ide dan membantu rekan...",
      "level3": "Bekerja sama secara baik dengan kelompok...",
      "level2": "Kurang aktif berkontribusi...",
      "level1": "Pasif atau mengganggu kerja tim..."
    },
    {
      "aspect": "Kualitas Produk / Solusi Masalah",
      "level4": "Solusi sangat kreatif, kontekstual, dan rapi...",
      "level3": "Solusi tepat dan sesuai kriteria...",
      "level2": "Solusi kurang lengkap...",
      "level1": "Solusi tidak selesai..."
    }
  ],
  "remedialAndEnrichment": {
    "remedial": {
      "diagnosis": "Bagi peserta didik yang belum mencapai KKTP...",
      "activity": "Tutor sebaya dan bimbingan terfokus pada konsep dasar...",
      "assessment": "Mengerjakan kembali soal/tugas dengan tingkat kesulitan setara"
    },
    "enrichment": {
      "target": "Bagi peserta didik yang telah melampaui KKTP...",
      "activity": "Eksplorasi studi kasus lanjutan di lingkungan lokal...",
      "challenge": "Membuat infografis atau mini-project..."
    }
  },
  "teacherReflection": [
    "Apakah seluruh peserta didik aktif terlibat dalam tahap Mengaplikasi?",
    "Apakah alokasi waktu untuk tahap Merefleksi mencukupi?",
    "Kendala apa yang dihadapi selama proses inquiry?",
    "Bagaimana efektivitas asesmen formatif dalam mendeteksi miskonsepsi?"
  ],
  "studentReflection": [
    "Bagian mana dari pelajaran hari ini yang paling menarik bagiku?",
    "Apa hal baru yang baru kupahami hari ini?",
    "Kesulitan apa yang kualami saat bekerja bersama teman?",
    "Apa yang ingin kupelajari lebih lanjut?"
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_8334,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error generating module:', error);
    res.status(500).json({ error: error.message || 'Gagal menghasilkan modul ajar' });
  }
});

// 3. Generate Soal Asesmen (HOTS, Stimulus, dll.)
app.post('/api/gemini/generate-soal', async (req, res) => {
  try {
    const { subject, topic, gradeLevel, count, questionTypes, cognitiveLevel } = req.body;

    const prompt = `
Susunlah ${count || 5} butir soal asesmen untuk:
- Mata Pelajaran: ${subject}
- Topik: ${topic}
- Jenjang: ${gradeLevel}
- Tingkat Kognitif: ${cognitiveLevel || 'HOTS (C4-C6)'}
- Jenis Soal: ${questionTypes?.join(', ') || 'Pilihan Ganda, Uraian'}

Setiap butir soal HARUS:
1. Memiliki Stimulus kontekstual nyata (cerita kasus, data grafik, situasi kehidupan sehari-hari murid).
2. Pertanyaan yang jelas, tidak ambigu, dan berbasis penalaran tinggi.
3. Kunci jawaban yang tepat.
4. Level kognitif (C1-C6).
5. Pembahasan rasional dan mendalam.
6. Pedoman skor penskoran.

Kembalikan HANYA JSON murni:
{
  "assessmentTitle": "Asesmen ${topic}...",
  "items": [
    {
      "number": 1,
      "type": "Pilihan Ganda",
      "cognitiveLevel": "C4 (Menganalisis)",
      "stimulus": "Teks stimulus kontekstual...",
      "question": "Berdasarkan teks di atas, kesimpulan yang paling tepat adalah...",
      "options": [
        { "code": "A", "text": "Pilihan A..." },
        { "code": "B", "text": "Pilihan B..." },
        { "code": "C", "text": "Pilihan C..." },
        { "code": "D", "text": "Pilihan D..." }
      ],
      "answerKey": "B",
      "explanation": "Pembahasan rinci mengapa B benar...",
      "score": 20
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_8334,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: error.message || 'Gagal menghasilkan butir soal' });
  }
});

// 4. Generate Rubrik Analitik 4 Level
app.post('/api/gemini/generate-rubrik', async (req, res) => {
  try {
    const { title, taskType, subject, gradeLevel, aspects } = req.body;

    const prompt = `
Buatlah Rubrik Penilaian Analitik 4 Level yang terukur, dapat diamati (observable), dan objektif untuk:
- Judul Tugas/Kegiatan: ${title || 'Presentasi Proyek Investigasi'}
- Jenis Tugas: ${taskType || 'Kinerja / Proyek / Presentasi'}
- Mata Pelajaran: ${subject || 'Umum'}
- Jenjang: ${gradeLevel || 'Fase D'}
- Aspek yang dinilai: ${aspects?.join(', ') || 'Kualitas Isi, Kolaborasi, Kreativitas, Komunikasi'}

Struktur Rubrik harus analitik 4 level:
- Level 4: Mahir / Sangat Baik (Skor 4)
- Level 3: Cakap / Baik (Skor 3)
- Level 2: Layak / Cukup (Skor 2)
- Level 1: Baru Berkembang / Perlu Bimbingan (Skor 1)

Kembalikan HANYA JSON murni:
{
  "title": "${title}",
  "taskType": "${taskType}",
  "rubrics": [
    {
      "aspect": "Nama aspek...",
      "weight": "25%",
      "level4": "Deskripsi perilaku observable level 4...",
      "level3": "Deskripsi perilaku observable level 3...",
      "level2": "Deskripsi perilaku observable level 2...",
      "level1": "Deskripsi perilaku observable level 1..."
    }
  ],
  "scoringFormula": "Nilai Akhir = (Total Skor / Skor Maksimal) x 100",
  "categoryInterpretation": [
    { "range": "86 - 100", "predicate": "Sangat Baik (A)", "recommendation": "Diberikan tantangan pengayaan." },
    { "range": "71 - 85", "predicate": "Baik (B)", "recommendation": "Tercapai optimal." },
    { "range": "56 - 70", "predicate": "Cukup (C)", "recommendation": "Pendampingan pada indikator tertentu." },
    { "range": "< 56", "predicate": "Perlu Bimbingan (D)", "recommendation": "Remedial terfokus." }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_8334,
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error generating rubric:', error);
    res.status(500).json({ error: error.message || 'Gagal menghasilkan rubrik' });
  }
});

// 5. Kokurikuler AI Assistant Endpoints

// 5a. Generate Subject Contributions for Kokurikuler
app.post('/api/gemini/kokurikuler-subject-contributions', async (req, res) => {
  try {
    const { phase, theme, topic, subjects, gradeLevel } = req.body;

    const prompt = `
Anda adalah konsultan kurikulum Kemendikdasmen RI untuk Program Kokurikuler.
Berdasarkan data berikut:
- Fase / Jenjang: ${phase || 'Fase D'} (${gradeLevel || 'SMP'})
- Tema Kokurikuler: ${theme || 'Gaya Hidup Berkelanjutan'}
- Topik / Fokus: ${topic || 'Pengelolaan Sampah dan Lingkungan'}
- Mata Pelajaran Terpilih: ${(subjects || []).join(', ')}

Berikan ide kontribusi konkret, aplikatif, dan sesuai fase perkembangan anak untuk MASING-MASING mata pelajaran terpilih tersebut dalam menyukseskan program kokurikuler ini.

Kembalikan HANYA JSON murni dengan format:
{
  "contributions": [
    {
      "subject": "Nama Mata Pelajaran",
      "contribution": "Deskripsi kontribusi konkret dan peran materi mata pelajaran ini dalam proyek kokurikuler (2-3 kalimat jelas dan aplikatif)..."
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_8334,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error generating subject contributions:', error);
    res.status(500).json({ error: error.message || 'Gagal menghasilkan kontribusi mapel' });
  }
});

// 5b. Generate Context, Objectives, and Final Products for Kokurikuler
app.post('/api/gemini/kokurikuler-context-product', async (req, res) => {
  try {
    const { phase, theme, gradeLevel, customTheme } = req.body;
    const activeTheme = customTheme || theme || 'Gaya Hidup Berkelanjutan';

    const prompt = `
Anda adalah perancang program kokurikuler Kemendikdasmen RI.
Berdasarkan:
- Fase / Jenjang: ${phase || 'Fase D'} (${gradeLevel || 'SMP'})
- Tema Kokurikuler: ${activeTheme}

Rancanglah:
1. 3 pilihan Topik Kegiatan Kokurikuler yang menarik, kontekstual, dan menggembirakan bagi murid di fase ini.
2. Deskripsi Permasalahan / Isu Nyata di lingkungan sekolah atau masyarakat yang mendasari proyek ini.
3. 3-4 Tujuan Program yang spesifik dan berpusat pada murid.
4. 3 pilihan Rencana Produk Akhir nyata yang bernilai guna, dapat dipamerkan/digunakan, dan cocok dengan kemampuan murid fase ini.

Kembalikan HANYA JSON murni:
{
  "suggestedTopics": [
    {
      "topic": "Judul Topik Menarik...",
      "brief": "Deskripsi singkat 1 kalimat..."
    }
  ],
  "problemContext": "Uraian permasalahan kontekstual di sekitar murid...",
  "objectives": [
    "Tujuan 1...",
    "Tujuan 2...",
    "Tujuan 3..."
  ],
  "finalProducts": [
    {
      "productName": "Nama Produk Akhir...",
      "description": "Deskripsi bentuk karya/produk...",
      "utility": "Manfaat atau dampak nyata produk bagi sekolah/lingkungan..."
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_8334,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error generating context and product ideas:', error);
    res.status(500).json({ error: error.message || 'Gagal menghasilkan ide konteks & produk' });
  }
});

// 5c. Generate Full Program Kokurikuler Lengkap dengan Asesmen & Rubrik per Dimensi
app.post('/api/gemini/generate-kokurikuler', async (req, res) => {
  try {
    const {
      schoolName,
      phase,
      gradeLevel,
      academicYear,
      theme,
      topic,
      problemContext,
      objectives,
      finalProduct,
      subjectContributions,
      selectedDimensions,
      totalJp,
      meetingCount,
      partners,
      facilities
    } = req.body;

    const dimensionsList = (selectedDimensions && selectedDimensions.length > 0)
      ? selectedDimensions.join(', ')
      : 'Penalaran Kritis, Kolaborasi, Kreativitas, Kemandirian';

    const prompt = `
Anda adalah perancang program kokurikuler Kemendikdasmen RI.
Susunlah DOKUMEN PERENCANAAN PEMBELAJARAN KOKURIKULER resmi yang SAMA PERSIS SUSUNANNYA dari JUDUL sampai ASESMEN dengan format standar resmi Kemendikdasmen:

Data Masukan:
- Satuan Pendidikan: ${schoolName || 'Satuan Pendidikan'}
- Kelas / Fase: ${gradeLevel || 'Kelas V'} / ${phase || 'Fase C'}
- Alokasi Waktu: ${totalJp || 126} JP (${meetingCount || 10} Pertemuan)
- Tema: ${theme || 'Gaya Hidup Berkelanjutan'}
- Topik / Judul: ${topic || 'Pengelolaan Sampah Mandiri dan Gaya Hidup Hijau'}
- Masalah Konteks: ${problemContext || 'Banyaknya timbulan sampah di lingkungan sekolah dan minimnya pemilahan'}
- Rencana Produk Akhir: ${finalProduct || 'Produk daur ulang bernilai guna, media kampanye kreatif, dan pameran panggung karya'}
- Mata Pelajaran Terintegrasi & Kontribusi:
${(subjectContributions || []).map((s: any) => `  * ${s.subject}: ${s.contribution}`).join('\n')}
- Dimensi Profil Lulusan Terpilih (DPL): ${dimensionsList}
- Mitra Terkait: ${partners || 'Petugas kebersihan, Dinas Lingkungan Hidup, Orang tua murid, Komunitas pengolah sampah'}
- Lokasi: Lingkungan satuan pendidikan, lingkungan rumah, dan tempat mitra terkait

SUSUNAN DOKUMEN HARUS BERURUTAN SAMA PERSIS SEPERTI STRUKTUR RESMI:
1. JUDUL PROYEK (ALL CAPS, Bold)
2. IDENTITAS PROYEK:
   - Nama satuan pendidikan : ${schoolName || 'Satuan Pendidikan'}
   - Kelas / Fase : ${gradeLevel || 'V'} / ${phase || 'C'}
   - Bentuk : Kolaboratif Lintas Disiplin Ilmu
   - Alokasi Waktu : ${totalJp || 126} JP
   - Lokasi Kegiatan : Lingkungan satuan pendidikan, lingkungan rumah, Tempat Pengolahan Sampah Terpadu (TPST)/Bank Sampah/Mitra
3. A. Deskripsi Kokurikuler (paragraf naratif mendalam: masalah nyata, urgensi kompetensi DPL ${dimensionsList}, tema kolaboratif, serta ringkasan alur 5 tahapan: pengenalan, kontekstualisasi, aksi, refleksi, dan tindak lanjut).
4. B. Dimensi Profil Lulusan (daftar bernomor 1, 2, dst. dari dimensi yang dipilih).
5. C. Tujuan Pembelajaran (daftar bernomor tujuan pembelajaran terpadu, WAJIB mencantumkan nama mata pelajaran di dalam kurung di akhir kalimat, misal: "... (Ilmu Pengetahuan Alam dan Sosial)").
6. D. Praktik Pedagogis (narasi model berbasis projek + tahapan: pengenalan, kontekstualisasi, aksi, refleksi, tindak lanjut).
7. E. Lingkungan Pembelajaran (narasi budaya belajar, ruang fisik kelas/luar kelas/masyarakat, dan ruang virtual Zoom/Meet).
8. F. Kemitraan Pembelajaran (daftar 4-5 mitra nyata + catatan peran pendidik).
9. G. Pemanfaatan Digital (daftar 4 pemanfaatan digital: internet, ruang pertemuan virtual, canva/capcut, bahan tayang ppt/slides).
10. H. Kegiatan Pembelajaran:
    - Paragraf pengantar referensi
    - Tabel Alur Tahapan Aktivitas (4 blok: Pengenalan, Kontekstualisasi, Aksi, Refleksi dan Tindak Lanjut; masing-masing dengan Pertanyaan Pemantik dan deretan aktivitas bernomor beserta alokasi JP).
    - Rincian Aktivitas Pembelajaran per tahap:
      * Setiap aktivitas memuat: Nomor & Judul Aktivitas, Durasi JP, Persiapan, dan Pelaksanaan (langkah-langkah konkret).
      * Pada aktivitas tertentu yang menjadi titik asesmen, sertakan kotak "Asesmen Formatif / Sumatif [Nama Dimensi]" lengkap dengan tujuan dan referensi instrumen/LK.
11. I. Asesmen Pembelajaran:
    - Narasi pengantar capaian DPL & subdimensi
    - Catatan rubrik
    - Rincian untuk SETIAP Dimensi Profil Lulusan yang dipilih guru (${dimensionsList}):
      * Judul: "Dimensi Profil Lulusan: [Nama Dimensi]"
      * Judul Asesmen: "Asesmen Formatif (Aktivitas X)" / "Asesmen Sumatif (Aktivitas Y)"
      * "Kemampuan yang dinilai: [uraian kemampuan spesifik]"
      * Rubrik 3 Kategori Perkembangan:
        - "berkembang": deskripsi perilaku kategori Berkembang
        - "cakap": deskripsi perilaku kategori Cakap
        - "mahir": deskripsi perilaku kategori Mahir

Kembalikan HANYA JSON murni dengan format:
{
  "title": "${(topic || 'PROGRAM KOKURIKULER').toUpperCase()}",
  "theme": "${theme}",
  "topic": "${topic}",
  "phase": "${phase}",
  "gradeLevel": "${gradeLevel}",
  "academicYear": "${academicYear}",
  "form": "Kolaboratif Lintas Disiplin Ilmu",
  "allocatedTime": "${totalJp || 126} JP",
  "totalJp": ${Number(totalJp) || 126},
  "meetingCount": ${Number(meetingCount) || 10},
  "location": "Lingkungan satuan pendidikan, lingkungan rumah, Tempat Pengolahan Sampah Terpadu (TPST) / Bank Sampah / Komunitas Mitra",
  "finalProduct": "${finalProduct || 'Karya nyata, media kreatif, dan Gelar Karya'}",
  "background": "Permasalahan di lingkungan satuan pendidikan...",
  "regulatoryBasis": "Keputusan Kepala BSKAP Kemendikdasmen RI tentang Panduan Pembelajaran dan Asesmen Kokurikuler.",
  "profileDimensions": [
    ${(selectedDimensions || ['Penalaran Kritis', 'Komunikasi']).map((dim: string) => `{ "dimension": "${dim}", "contribution": "Mengembangkan kemampuan ${dim} peserta didik..." }`).join(',\n    ')}
  ],
  "objectives": [
    "Murid mampu mengidentifikasi masalah lingkungan sekitar dan merumuskan solusi yang dapat diterapkan (Ilmu Pengetahuan Alam dan Sosial)",
    "Murid mampu melakukan analisis dan menyajikan data hasil penyelidikan (Matematika)",
    "Murid mampu mengomunikasikan hasil temuan penyelidikan secara lisan dan non lisan menggunakan berbagai media kreatif (Bahasa Indonesia)"
  ],
  "pedagogicalPractice": {
    "description": "Praktik pedagogis dalam perencanaan ini menggunakan pembelajaran berbasis projek dengan tahapan pembelajaran diawali dengan pengenalan, di mana murid diajak mengenali permasalahan secara mendalam. Selanjutnya pada tahap kontekstualisasi, murid menggali permasalahan melalui penyelidikan. Hasilnya menjadi dasar bagi aksi nyata. Tahap berikutnya adalah refleksi untuk mengevaluasi hasil, dan diakhiri dengan tindak lanjut berupa komitmen berkelanjutan.",
    "stages": ["Pengenalan", "Kontekstualisasi", "Aksi", "Refleksi", "Tindak lanjut"]
  },
  "learningEnvironment": {
    "description": "Lingkungan pembelajaran dalam kokurikuler ini dirancang untuk membangun budaya belajar kolaboratif, bernalar kritis, komunikatif, reflektif, dan eksploratif dalam memecahkan masalah nyata, sekaligus membiasakan sikap empati, inklusif, nyaman, serta saling menghargai. Murid diberi ruang untuk menyampaikan ide dan berdiskusi secara terbuka di ruang kelas, halaman sekolah, dan lokasi mitra, serta melalui ruang virtual sebagai sarana pembelajaran digital.",
    "physical": "Ruang kelas fleksibel, halaman sekolah, dan lokasi mitra",
    "virtual": "Platform konferensi video (Zoom Meeting atau Google Meet)"
  },
  "learningPartnerships": {
    "partners": [
      "Petugas kebersihan/sarpras satuan pendidikan, dilibatkan dalam kegiatan penyelidikan (narasumber wawancara).",
      "Dinas Lingkungan Hidup / Puskesmas / Instansi mitra, dilibatkan dalam sharing session pada tahap refleksi.",
      "Orang tua murid, dilibatkan saat proses penyelidikan di rumah dan saat kegiatan sosialisasi.",
      "Pegiat lingkungan / tokoh masyarakat setempat, dilibatkan menjadi narasumber.",
      "Narasumber ahli media kreatif / kreator konten, dilibatkan dalam kegiatan lokakarya pembuatan media kreatif."
    ],
    "note": "Apabila tidak memungkinkan menghadirkan narasumber dari luar, maka peran tersebut dapat digantikan oleh pendidik."
  },
  "digitalUtilization": [
    "Pencarian data dan referensi melalui internet",
    "Ruang rapat / pertemuan virtual",
    "Pembuatan media kreatif menggunakan aplikasi desain grafis dan video editing seperti Canva, Capcut, Kinemaster, dan lainnya",
    "Presentasi hasil projek dengan aplikasi bahan tayang seperti PowerPoint, Google Slides, dan Canva"
  ],
  "matrixStages": [
    {
      "stage": "Pengenalan",
      "guidingQuestion": "Apa yang perlu kita tahu tentang permasalahan ini?",
      "activities": [
        { "activityNumber": "Aktivitas 1", "duration": "4 JP", "title": "Membuka wawasan tentang materi dasar dan jenis-jenis persoalan", "summary": "Eksplorasi wawasan dasar dan jenis masalah" },
        { "activityNumber": "Aktivitas 2", "duration": "4 JP", "title": "Menganalisis dampak dari permasalahan yang terjadi", "summary": "Analisis dampak permasalahan lingkungan" },
        { "activityNumber": "Aktivitas 3", "duration": "8 JP", "title": "Mengamati pengelolaan melalui kunjungan lapangan ke lokasi mitra", "summary": "Kunjungan belajar dan observasi langsung" },
        { "activityNumber": "Aktivitas 4", "duration": "6 JP", "title": "Mengenal berbagai praktik baik melalui dialog narasumber", "summary": "Diskusi interaktif narasumber ahli" },
        { "activityNumber": "Aktivitas 5", "duration": "4 JP", "title": "Mengidentifikasi pengelolaan di lingkungan terdekat melalui observasi mandiri", "summary": "Observasi terpandu di rumah/sekitar" }
      ]
    },
    {
      "stage": "Kontekstualisasi",
      "guidingQuestion": "Bagaimana kondisi permasalahan di lingkungan sekolah dan sekitarku?",
      "activities": [
        { "activityNumber": "Aktivitas 6", "duration": "4 JP", "title": "Merancang persiapan penyelidikan masalah di satuan pendidikan", "summary": "Penyusunan instrumen dan kelompok penyelidikan" },
        { "activityNumber": "Aktivitas 7-8", "duration": "8 JP", "title": "Memahami masalah di sekolah melalui penyelidikan dan pencatatan terstruktur", "summary": "Wawancara narasumber dan observasi lapangan" },
        { "activityNumber": "Aktivitas 9", "duration": "4 JP", "title": "Menyajikan hasil pengamatan dan wawancara dalam tabel dan diagram", "summary": "Pengolahan data kualitatif dan kuantitatif" },
        { "activityNumber": "Aktivitas 10", "duration": "6 JP", "title": "Melakukan persiapan presentasi data hasil penyelidikan", "summary": "Penyusunan bahan tayang presentasi" },
        { "activityNumber": "Aktivitas 11", "duration": "4 JP", "title": "Mempresentasikan hasil penyelidikan dengan percaya diri dan komunikatif", "summary": "Presentasi kelompok dan umpan balik" }
      ]
    },
    {
      "stage": "Aksi",
      "guidingQuestion": "Bagaimana caranya agar semua orang ambil bagian memberikan solusi?",
      "activities": [
        { "activityNumber": "Aktivitas 12-13", "duration": "8 JP", "title": "Merumuskan solusi terbaik dan merancang media kreatif", "summary": "Diskusi berjenjang solusi dan perencanaan media" },
        { "activityNumber": "Aktivitas 14", "duration": "6 JP", "title": "Lokakarya pembuatan media kreatif bersama narasumber", "summary": "Pelatihan pembuatan karya/media" },
        { "activityNumber": "Aktivitas 15", "duration": "12 JP", "title": "Proses pembuatan karya nyata dan media kreatif", "summary": "Produksi karya dan pendampingan fasilitator" },
        { "activityNumber": "Aktivitas 16-18", "duration": "14 JP", "title": "Gallery walk, diskusi reflektif untuk masukan, dan proses revisi", "summary": "Uji coba karya, pameran kelas, dan perbaikan" },
        { "activityNumber": "Aktivitas 19", "duration": "12 JP", "title": "Proses persiapan sosialisasi dan pameran panggung karya", "summary": "Pembentukan kepanitiaan dan gladi kotor" },
        { "activityNumber": "Aktivitas 20", "duration": "6 JP", "title": "Sosialisasi solusi dan pameran Gelar Karya kepada warga sekolah", "summary": "Gelar karya dan presentasi terbuka" }
      ]
    },
    {
      "stage": "Refleksi dan Tindak Lanjut",
      "guidingQuestion": "Apa yang perlu menjadi komitmen bersama untuk keberlanjutan?",
      "activities": [
        { "activityNumber": "Aktivitas 21", "duration": "4 JP", "title": "Merefleksikan pengalaman, keberhasilan, dan kendala sosialisasi", "summary": "Refleksi mendalam pengalaman belajar" },
        { "activityNumber": "Aktivitas 22", "duration": "6 JP", "title": "Memperluas wawasan melalui dialog evaluasi bersama mitra/DLH", "summary": "Dialog penguatan komitmen lanjutan" },
        { "activityNumber": "Aktivitas 23", "duration": "4 JP", "title": "Menyusun lembar komitmen warga satuan pendidikan", "summary": "Penandatanganan komitmen pembiasaan baru" }
      ]
    }
  ],
  "detailedActivities": [
    {
      "stage": "Tahap Pengenalan",
      "activities": [
        {
          "number": "Aktivitas 1",
          "title": "Membuka wawasan tentang tema dan jenis-jenis permasalahan",
          "duration": "4 JP",
          "preparation": [
            "Pendidik menyiapkan bahan bacaan dan artikel tentang tema.",
            "Pendidik menyiapkan video inspiratif terkait isu nyata."
          ],
          "steps": [
            "1. Pendidik menampilkan video permasalahan dan pemantik diskusi.",
            "2. Murid dan pendidik berdiskusi terkait fenomena dalam video.",
            "3. Murid membaca sumber belajar yang diberikan kemudian mengidentifikasi fakta penting.",
            "4. Secara berkelompok murid membuat tabel pengelompokan data awal.",
            "5. Murid bersama kelompok mempresentasikan temuan awal dan mengisi lembar kerja refleksi see-think-wonder."
          ]
        },
        {
          "number": "Aktivitas 2",
          "title": "Menganalisis dampak permasalahan di lingkungan sekitar",
          "duration": "4 JP",
          "preparation": [
            "Pendidik menyiapkan gambar/foto dokumentasi isu lingkungan.",
            "Pendidik menyiapkan kertas kerja peta konsep."
          ],
          "steps": [
            "1. Pendidik menampilkan dokumentasi penumpukan masalah di lingkungan.",
            "2. Pendidik mengajukan pertanyaan pemantik: 'Apa yang terjadi jika masalah ini dibiarkan terus menerus?'",
            "3. Dalam kelompok kecil, murid membuat peta konsep sebab-akibat.",
            "4. Setiap kelompok menyampaikan hasil analisis peta konsepnya di depan kelas.",
            "5. Murid menuliskan satu kesimpulan penting tentang dampak yang paling mendesak diatasi."
          ]
        },
        {
          "number": "Aktivitas 3",
          "title": "Mengamati pengelolaan melalui kunjungan lapangan ke lokasi mitra",
          "duration": "8 JP",
          "preparation": [
            "Pendidik berkoordinasi dengan pihak pengelola lokasi kunjungan.",
            "Pendidik menyiapkan lembar observasi kunjungan lapangan dan panduan keselamatan."
          ],
          "steps": [
            "1. Pendidik menjelaskan tujuan kunjungan belajar dan memandu keberangkatan.",
            "2. Pihak narasumber lokasi memberikan paparan alur pengelolaan dan tanya jawab.",
            "3. Murid bersama kelompok mengamati proses kerja nyata dengan bimbingan lembar observasi.",
            "4. Di akhir kunjungan, pendidik memandu refleksi singkat mengenai temuan lapangan."
          ]
        }
      ]
    },
    {
      "stage": "Tahap Kontekstualisasi",
      "activities": [
        {
          "number": "Aktivitas 7-8",
          "title": "Memahami masalah di sekolah melalui penyelidikan dan mencatatkan hasil secara terstruktur",
          "duration": "8 JP",
          "preparation": [
            "Pendidik menyiapkan panduan wawancara dan instrumen observasi.",
            "Pendidik membagi jadwal observasi dan wawancara narasumber."
          ],
          "steps": [
            "1. Kelompok melaksanakan observasi lapangan dan wawancara dengan narasumber terpilih.",
            "2. Murid mencatat data kualitatif dan kuantitatif mengenai alur permasalahan di sekolah.",
            "3. Murid mengerjakan lembar kerja penyelidikan yang memadukan data pengamatan dan wawancara.",
            "4. Pendidik mengobservasi proses penalaran kritis murid."
          ],
          "assessmentSnippet": {
            "type": "Formatif",
            "dimension": "Penalaran Kritis",
            "purpose": "Murid mampu mengidentifikasi masalah di lingkungan sekitar berdasarkan penyelidikan, mengumpulkan informasi yang relevan, dan mencatat kesimpulan terstruktur.",
            "rubricRef": "Asesmen Pembelajaran bagian Penalaran Kritis",
            "instrument": "Lembar Kerja Penyelidikan dan Catatan Pengamatan Pendidik"
          }
        },
        {
          "number": "Aktivitas 11",
          "title": "Mempresentasikan hasil penyelidikan dengan percaya diri dan komunikatif",
          "duration": "4 JP",
          "preparation": [
            "Pendidik menyediakan ruang presentasi dan sarana display.",
            "Pendidik menyiapkan rubrik penilaian presentasi."
          ],
          "steps": [
            "1. Murid dari tiap kelompok menyampaikan presentasi hasil penyelidikan menggunakan media tabel/diagram.",
            "2. Pendidik melaksanakan asesmen formatif dimensi komunikasi dan penalaran kritis.",
            "3. Kelompok lain mendengarkan, mencatat poin penting, dan mengajukan pertanyaan.",
            "4. Pendidik memberikan umpan balik konstruktif."
          ],
          "assessmentSnippet": {
            "type": "Formatif",
            "dimension": "Komunikasi",
            "purpose": "Murid mampu mengomunikasikan hasil temuan penyelidikan secara lisan dengan bahasa santun, volume jelas, dan didukung visual diagram yang mudah dipahami.",
            "rubricRef": "Asesmen Pembelajaran bagian Komunikasi",
            "instrument": "Rubrik Penilaian Presentasi"
          }
        }
      ]
    },
    {
      "stage": "Tahap Aksi",
      "activities": [
        {
          "number": "Aktivitas 12-13",
          "title": "Merumuskan solusi terbaik melalui diskusi berjenjang dan perencanaan karya",
          "duration": "8 JP",
          "preparation": [
            "Pendidik menyiapkan lembar diskusi berjenjang (individu, pasangan, kelompok, pleno).",
            "Pendidik memajang data hasil penyelidikan sebelumnya."
          ],
          "steps": [
            "1. Murid melakukan diskusi berjenjang dari mandiri hingga pleno kelas untuk menyepakati 3 solusi terbaik.",
            "2. Pendidik melaksanakan asesmen sumatif penalaran kritis.",
            "3. Kelompok merencanakan pengujian dan pemilihan media kreatif yang akan dibuat (digital/non digital)."
          ],
          "assessmentSnippet": {
            "type": "Sumatif",
            "dimension": "Penalaran Kritis",
            "purpose": "Murid mampu menyampaikan rumusan solusi yang relevan, kontekstual, dan berbasis data untuk memecahkan masalah di lingkungan sekitar.",
            "rubricRef": "Asesmen Pembelajaran bagian Penalaran Kritis",
            "instrument": "Lembar Kerja Solusi Berjenjang dan Pengamatan Diskusi Pleno"
          }
        },
        {
          "number": "Aktivitas 20",
          "title": "Sosialisasi solusi dan pameran Gelar Karya kepada warga satuan pendidikan",
          "duration": "6 JP",
          "preparation": [
            "Pendidik dan panitia murid menata tata ruang pameran.",
            "Memastikan media kreatif dan produk karya siap dipamerkan.",
            "Mengundang warga sekolah, orang tua, dan perwakilan mitra."
          ],
          "steps": [
            "1. Murid menyampaikan sosialisasi solusi dan mendemonstrasikan produk karya kepada audiens.",
            "2. Murid berinteraksi aktif dalam sesi tanya jawab.",
            "3. Pendidik melaksanakan asesmen sumatif komunikasi.",
            "4. Murid mendokumentasikan kegiatan pameran untuk bahan evaluasi bersama."
          ],
          "assessmentSnippet": {
            "type": "Sumatif",
            "dimension": "Komunikasi",
            "purpose": "Murid mampu menggunakan media kreatif sebagai alat komunikasi non lisan secara efektif, kontekstual, orisinal, dan persuasif bagi warga sekolah.",
            "rubricRef": "Asesmen Pembelajaran bagian Komunikasi",
            "instrument": "Penilaian Produk Karya & Observasi Unjuk Kerja Sosialisasi"
          }
        }
      ]
    },
    {
      "stage": "Tahap Refleksi dan Tindak Lanjut",
      "activities": [
        {
          "number": "Aktivitas 21",
          "title": "Merefleksikan pengalaman, keberhasilan, dan kendala kegiatan",
          "duration": "4 JP",
          "preparation": [
            "Pendidik menyiapkan lembar refleksi pengalaman belajar.",
            "Menyiapkan ruang diskusi melingkar."
          ],
          "steps": [
            "1. Pendidik membuka sesi diskusi reflektif.",
            "2. Murid bersama kelompok mencatat keberhasilan yang dicapai dan kendala yang dihadapi.",
            "3. Setiap kelompok berbagi refleksi dan mendapatkan penguatan apresiasi dari pendidik."
          ]
        },
        {
          "number": "Aktivitas 23",
          "title": "Menyusun dan menandatangani komitmen bersama warga sekolah",
          "duration": "4 JP",
          "preparation": [
            "Pendidik menyiapkan format lembar komitmen bersama.",
            "Berkoordinasi dengan para wali kelas lain."
          ],
          "steps": [
            "1. Murid mensosialisasikan piagam komitmen ke tiap kelas.",
            "2. Perwakilan kelas menyusun dan menandatangani komitmen kebiasaan baru.",
            "3. Komitmen diserahkan kepada Kepala Sekolah dan dipajang di mading utama sekolah."
          ]
        }
      ]
    }
  ],
  "dimensionAssessments": [
    ${(selectedDimensions || ['Penalaran Kritis', 'Komunikasi']).map((dim: string) => `{
      "dimension": "${dim}",
      "subdimensions": ["pemrosesan informasi", "pengambilan keputusan", "refleksi dan evaluasi"],
      "assessments": [
        {
          "title": "Asesmen Formatif (Aktivitas Penyelidikan & Observasi)",
          "skillAssessed": "Kemampuan mengidentifikasi permasalahan secara kritis dan menyajikan temuan secara sistematis pada dimensi ${dim}",
          "berkembang": "Menunjukkan indikator ${dim} pada tahap awal, informasi yang dikemukakan masih terbatas dan belum mengaitkan bukti lapangan.",
          "cakap": "Mampu menunjukkan karakter ${dim} secara kontekstual, data terstruktur dengan baik, dan menghubungkan hasil temuan dengan kondisi nyata.",
          "mahir": "Sangat konsisten menerapkan ${dim}, analisis mendalam, orisinal, dan mampu memberikan argumentasi logis berbasis bukti yang akurat."
        },
        {
          "title": "Asesmen Sumatif (Aktivitas Solusi & Unjuk Karya)",
          "skillAssessed": "Kemampuan menghasilkan karya solutif dan mengomunikasikan dampak nyata proyek pada dimensi ${dim}",
          "berkembang": "Solusi atau karya yang dihasilkan belum sepenuhnya menjawab masalah atau memerlukan pendampingan intensif pendidik.",
          "cakap": "Solusi dan karya yang dihasilkan kontekstual, menjawab permasalahan dengan tepat, dan menunjukkan penguasaan karakter ${dim} secara optimal.",
          "mahir": "Menghasilkan karya yang sangat orisinal, bernilai guna tinggi, menunjukkan karakter ${dim} secara mandiri dan menginspirasi seluruh warga sekolah."
        }
      ]
    }`).join(',\n    ')}
  ],
  "reflection": "Peserta didik menyadari bahwa partisipasi aktif dan tanggung jawab pribadi mampu membawa perubahan nyata bagi lingkungan sekolah. Pendidik merefleksikan pentingnya memfasilitasi otonomi murid.",
  "followUp": "Pencanangan komitmen bersama jangka panjang di lingkungan satuan pendidikan yang dipantau melalui jurnal pembiasaan mingguan murid."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_8334,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error generating kokurikuler program:', error);
    res.status(500).json({ error: error.message || 'Gagal menghasilkan program kokurikuler' });
  }
});

// 6. AI Document Refinement ("Perbaiki Modul")
app.post('/api/gemini/refine-document', async (req, res) => {
  try {
    const { document, instruction } = req.body;

    const prompt = `
Anda diberikan dokumen Modul Ajar atau Program Kokurikuler berikut (format JSON):
${JSON.stringify(document, null, 2)}

Instruksi Perbaikan dari Guru:
"${instruction}"

ATURAN PENTING:
- Pertahankan struktur dan komponen yang sudah benar.
- Ubah HANYA bagian yang terkait dengan instruksi guru secara presisi dan bermakna.
- Jangan menghapus data sekolah, guru, atau identitas utama kecuali jika diminta.
- Pastikan logika keterpaduan CP-TP-8334-Asesmen tetap terjaga utuh.

Kembalikan HANYA dokumen JSON yang telah diperbaiki dalam format JSON murni.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_8334,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error refining document:', error);
    res.status(500).json({ error: error.message || 'Gagal memperbaiki dokumen' });
  }
});

// 7. Automated Validator for 8-3-3-4 & Kemendikdasmen Alignment
app.post('/api/gemini/validate-module', async (req, res) => {
  try {
    const { document } = req.body;

    const prompt = `
Lakukan audit dan validasi kualitas komprehensif terhadap dokumen Modul Ajar berikut:
${JSON.stringify(document, null, 2)}

Periksa 17 indikator kualitas:
1. CP tersedia dan sesuai regulasi resmi.
2. TP selaras dengan CP.
3. TP dapat diukur (memiliki indikator operasional).
4. Dimensi Profil Lulusan relevan dan disertai alasan.
5. Prinsip Berkesadaran muncul jelas dalam aktivitas.
6. Prinsip Bermakna muncul jelas dalam aktivitas.
7. Prinsip Menggembirakan muncul jelas dalam aktivitas.
8. Pengalaman MEMAHAMI tersedia dalam sintaks.
9. Pengalaman MENGAPLIKASI tersedia dalam sintaks.
10. Pengalaman MEREFLEKSI tersedia dalam sintaks.
11. Praktik pedagogis sesuai karakteristik materi.
12. Lingkungan pembelajaran aman dan kondusif.
13. Kemitraan pembelajaran dilibatkan secara wajar.
14. Pemanfaatan digital tepat guna dan proporsional.
15. Aktivitas pembelajaran selaras dengan TP.
16. Asesmen (diagnostik, formatif, sumatif) selaras dengan TP.
17. Rubrik penilaian analitik 4 level objektif dan observable.
18. Program remedial dan pengayaan tersedia realistis.
19. Lembar refleksi guru dan peserta didik tersedia.

Kembalikan HANYA JSON murni:
{
  "totalScore": 95, // 0 - 100
  "isOptimal": true, // true jika skor >= 85
  "statusMessage": "Dokumen Sangat Baik dan Siap Digunakan", // atau "Dokumen belum optimal"
  "summary": "Ringkasan kualitas dokumen...",
  "checklist": [
    { "item": "CP tersedia & resmi", "passed": true, "note": "CP lengkap" },
    { "item": "TP selaras dengan CP", "passed": true, "note": "TP spesifik" },
    { "item": "TP dapat diukur", "passed": true, "note": "Menggunakan KKO terukur" },
    { "item": "Dimensi Profil Lulusan relevan", "passed": true, "note": "Dimensi logis" },
    { "item": "Prinsip Pembelajaran (3 Prinsip) muncul", "passed": true, "note": "Berkesadaran, Bermakna, Menggembirakan tercermin" },
    { "item": "Pengalaman Belajar (3 Pengalaman) lengkap", "passed": true, "note": "Memahami, Mengaplikasi, Merefleksi ada di inti" },
    { "item": "Praktik Pedagogis tepat", "passed": true, "note": "Model pembelajaran jelas" },
    { "item": "Lingkungan Pembelajaran tersedia", "passed": true, "note": "Keamanan fisik & psikologis terencana" },
    { "item": "Kemitraan Pembelajaran dilibatkan", "passed": true, "note": "Melibatkan orang tua / rekan" },
    { "item": "Pemanfaatan Digital terencana", "passed": true, "note": "Tepat guna" },
    { "item": "Aktivitas selaras TP", "passed": true, "note": "Alur runut" },
    { "item": "Asesmen (Diagnostik, Formatif, Sumatif) lengkap", "passed": true, "note": "Lengkap" },
    { "item": "Rubrik 4 Level analitik", "passed": true, "note": "Observable" },
    { "item": "Remedial & Pengayaan tersedia", "passed": true, "note": "Konkret" },
    { "item": "Refleksi guru & murid ada", "passed": true, "note": "Sesuai jenjang" }
  ],
  "recommendations": [
    "Saran perbaikan 1...",
    "Saran perbaikan 2..."
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_8334,
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error validating module:', error);
    res.status(500).json({ error: error.message || 'Gagal memvalidasi dokumen' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Teacher Planning Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
