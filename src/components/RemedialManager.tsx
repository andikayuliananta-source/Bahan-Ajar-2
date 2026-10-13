import React, { useState } from 'react';
import { RefreshCw, Sparkles, CheckCircle2, Award, Printer, ArrowRight } from 'lucide-react';

export const RemedialManager: React.FC = () => {
  const [topic, setTopic] = useState('Sistem Pencernaan Manusia dan Gangguan Pola Makan');
  const [gradeLevel, setGradeLevel] = useState('SMP Kelas 8 (Fase D)');
  const [kktpScore, setKktpScore] = useState('75');

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <RefreshCw className="w-6 h-6 text-blue-600" />
          Program Remedial & Pengayaan Berbasis KKTP
        </h2>
        <p className="text-xs text-slate-500">
          Rancangan diagnosis klinis, tutor sebaya, latihan terpandu bagi remedial, serta tantangan kontekstual bagi pengayaan.
        </p>
      </div>

      {/* Input parameters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Materi / Topik Pembelajaran</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Jenjang & Kelas</label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kriteria Ketercapaian (KKTP / KKM)</label>
            <input
              type="number"
              value={kktpScore}
              onChange={(e) => setKktpScore(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Remedial Card */}
        <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <span className="font-bold text-sm text-amber-950 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-amber-600" />
              Program Remedial (Skor &lt; {kktpScore})
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              Intervensi Terfokus
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
              <strong className="text-amber-950 block mb-0.5">1. Diagnosis Kesulitan Belajar:</strong>
              <p className="text-slate-700">
                Peserta didik kesulitan membedakan fungsi enzim pencernaan kimiawi di lambung vs usus halus, serta membaca tabel nutrisi makanan.
              </p>
            </div>

            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
              <strong className="text-amber-950 block mb-0.5">2. Bentuk Kegiatan Pembelajaran Remedial:</strong>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Bimbingan individual terfokus dan pendampingan tutor sebaya dalam kelompok kecil.</li>
                <li>Pemanfaatan media konkret dan kartu alur pencernaan interaktif (flashcards).</li>
                <li>Penyederhanaan penjelasan materi menggunakan bagan visual berwarna.</li>
              </ul>
            </div>

            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
              <strong className="text-amber-950 block mb-0.5">3. Asesmen Ulang:</strong>
              <p className="text-slate-700">
                Mengerjakan 5 butir soal dengan tingkat kesukaran setara yang berfokus pada indikator yang belum tuntas.
              </p>
            </div>
          </div>
        </div>

        {/* Enrichment Card */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <span className="font-bold text-sm text-emerald-950 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Program Pengayaan (Skor &ge; {kktpScore})
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Eksplorasi Kontekstual
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
              <strong className="text-emerald-950 block mb-0.5">1. Target Peserta:</strong>
              <p className="text-slate-700">
                Bagi peserta didik yang telah mencapai atau melampaui seluruh indikator KKTP secara mandiri dan cepat.
              </p>
            </div>

            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
              <strong className="text-emerald-950 block mb-0.5">2. Bentuk Eksplorasi Kontekstual:</strong>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li>Melakukan audit komposisi gizi menu jajanan di kantin sekolah.</li>
                <li>Wawancara pengelola kantin mengenai keberadaan makanan berpengawet buatan atau tinggi gula.</li>
                <li>Menghitung indeks kalori harian remaja seusianya berdasarkan pedoman Isi Piringku Kemenkes.</li>
              </ul>
            </div>

            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
              <strong className="text-emerald-950 block mb-0.5">3. Tantangan Lanjutan (Output Produk):</strong>
              <p className="text-slate-700">
                Membuat poster infografis digital "Menu Sehat Bekal Sekolah Bergizi Seimbang" untuk dipublikasikan di mading dan media sosial sekolah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
