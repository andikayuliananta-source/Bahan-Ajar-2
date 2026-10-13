import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  Sparkles,
  Layers,
  Heart,
  Smile,
  Compass,
  Laptop,
  Users,
  Building
} from 'lucide-react';
import {
  PROFILE_DIMENSIONS_8,
  THREE_PRINCIPLES_EXPLANATION,
  THREE_EXPERIENCES_EXPLANATION,
  FOUR_COMPONENTS_EXPLANATION
} from '../data/kurikulumData';

export const DeepLearningGuide: React.FC = () => {
  const [selectedDimension, setSelectedDimension] = useState(PROFILE_DIMENSIONS_8[2]); // Penalaran Kritis

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 mb-2">
          <Brain className="w-4 h-4 text-blue-700" />
          <span>Kerangka Kebijakan Kemendikdasmen</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Pembelajaran Mendalam (Deep Learning 8–3–3–4)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Pembelajaran mendalam bukan sekadar menghafal konten, melainkan pengalaman belajar yang berkesadaran, bermakna, dan menggembirakan yang menumbuhkembangkan 8 dimensi profil lulusan melalui praktik pedagogis kontekstual.
        </p>
      </div>

      {/* 8 Dimensi Profil Lulusan */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                8
              </span>
              8 Dimensi Profil Lulusan
            </h3>
            <p className="text-xs text-slate-500">
              Pilih dimensi yang paling relevan dengan karakteristik materi dan aktivitas. (Jangan memaksakan seluruh 8 dimensi).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PROFILE_DIMENSIONS_8.map((dim) => {
            const isSelected = selectedDimension.id === dim.id;
            return (
              <button
                key={dim.id}
                onClick={() => setSelectedDimension(dim)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25 border-blue-600'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="text-[10px] opacity-80">{dim.shortName}</div>
                <div className="text-xs font-semibold truncate">{dim.name}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Dimension Detail Card */}
        <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-blue-950 text-sm">{selectedDimension.name}</h4>
            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-[10px]">
              Dimensi Profil
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed">{selectedDimension.description}</p>
          <div>
            <strong className="text-blue-900 block mb-1">Indikator Perilaku yang Teramati di Kelas:</strong>
            <ul className="list-disc pl-5 space-y-1 text-slate-800">
              {selectedDimension.indicators.map((ind, i) => (
                <li key={i}>{ind}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3 Prinsip Pembelajaran */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              3
            </span>
            3 Prinsip Pembelajaran
          </h3>
          <p className="text-xs text-slate-500">
            Prinsip yang mendasari iklim pembelajaran berpusat pada murid.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-950 text-sm">
              <Compass className="w-4 h-4 text-indigo-600" />
              1. BERKESADARAN
            </div>
            <p className="text-slate-700 leading-relaxed">
              {THREE_PRINCIPLES_EXPLANATION.conscious.description}
            </p>
            <div className="pt-2 text-[11px] text-indigo-900 font-semibold">
              Wujud kelas: Memulai dengan hening sejenak, menetapkan target mandiri, dan refleksi regulasi diri.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-950 text-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              2. BERMAKNA
            </div>
            <p className="text-slate-700 leading-relaxed">
              {THREE_PRINCIPLES_EXPLANATION.meaningful.description}
            </p>
            <div className="pt-2 text-[11px] text-blue-900 font-semibold">
              Wujud kelas: Materi dikaitkan isu nyata lokal, pemecahan masalah lingkungan, dan nilai guna langsung.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm">
              <Smile className="w-4 h-4 text-emerald-600" />
              3. MENGGEMBIRAKAN
            </div>
            <p className="text-slate-700 leading-relaxed">
              {THREE_PRINCIPLES_EXPLANATION.joyful.description}
            </p>
            <div className="pt-2 text-[11px] text-emerald-900 font-semibold">
              Wujud kelas: Tidak ada rasa takut salah, permainan edukatif, apresiasi positif, dan antusiasme tinggi.
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pengalaman Belajar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
              3
            </span>
            3 Pengalaman Belajar (Sintaks Inti)
          </h3>
          <p className="text-xs text-slate-500">
            Tiga tahapan pengalaman belajar yang wajib hadir secara runut dalam langkah pembelajaran inti.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900 text-sm block">A. MEMAHAMI (Membangun Konsep)</span>
              <p className="text-slate-600 mt-0.5">{THREE_EXPERIENCES_EXPLANATION.understand.description}</p>
            </div>
            <div className="flex flex-wrap gap-1 flex-shrink-0">
              {THREE_EXPERIENCES_EXPLANATION.understand.keywords.map((k, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-semibold">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900 text-sm block">B. MENGAPLIKASI (Praktik & Pemecahan Masalah)</span>
              <p className="text-slate-600 mt-0.5">{THREE_EXPERIENCES_EXPLANATION.apply.description}</p>
            </div>
            <div className="flex flex-wrap gap-1 flex-shrink-0">
              {THREE_EXPERIENCES_EXPLANATION.apply.keywords.map((k, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900 text-sm block">C. MEREFLEKSI (Evaluasi & Metakognisi)</span>
              <p className="text-slate-600 mt-0.5">{THREE_EXPERIENCES_EXPLANATION.reflect.description}</p>
            </div>
            <div className="flex flex-wrap gap-1 flex-shrink-0">
              {THREE_EXPERIENCES_EXPLANATION.reflect.keywords.map((k, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-semibold">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Komponen Kerangka */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
              4
            </span>
            4 Komponen Kerangka Pembelajaran
          </h3>
          <p className="text-xs text-slate-500">
            Unsur pendukung ekosistem belajar yang terpadu dan berkelanjutan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">1. Praktik Pedagogis</span>
            <p className="text-slate-600 mb-2">Pilih model pembelajaran inovatif yang relevan (Inquiry, PBL, PjBL, STEM).</p>
            <div className="flex flex-wrap gap-1">
              {FOUR_COMPONENTS_EXPLANATION.pedagogy.models.slice(0, 4).map((m, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px]">
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">2. Lingkungan Pembelajaran</span>
            <p className="text-slate-600 mb-2">Mencakup lingkungan fisik, sosial yang inklusif, dan psikologis yang aman dari bullying.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">3. Kemitraan Pembelajaran</span>
            <p className="text-slate-600 mb-2">Kolaborasi aktif dengan orang tua murid, rekan sejawat, dan narasumber komunitas lokal.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">4. Pemanfaatan Digital</span>
            <p className="text-slate-600 mb-2">Penggunaan teknologi secara terarah dan proporsional untuk memperkaya pengalaman belajar murid.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
