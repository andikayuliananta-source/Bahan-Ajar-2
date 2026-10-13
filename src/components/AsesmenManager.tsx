import React, { useState } from 'react';
import {
  FileCheck,
  Sparkles,
  BarChart2,
  Copy,
  Check,
  Printer,
  Plus,
  Trash2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { generateSoalAsesmen, generateRubrik } from '../services/apiService';

export const AsesmenManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'soal' | 'rubrik'>('soal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Soal Generator State
  const [soalForm, setSoalForm] = useState({
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    topic: 'Jaring-Jaring Makanan dan Dampak Kerusakan Ekosistem',
    gradeLevel: 'Fase D (SMP Kelas 7)',
    count: 3,
    cognitiveLevel: 'HOTS (C4 - Menganalisis, C5 - Mengevaluasi)',
    questionTypes: ['Pilihan Ganda HOTS', 'Uraian Kontekstual']
  });

  const [generatedSoal, setGeneratedSoal] = useState<any>(null);

  // Rubrik Generator State
  const [rubrikForm, setRubrikForm] = useState({
    title: 'Rubrik Penilaian Proyek Penyelidikan Ekologi Sekolah',
    taskType: 'Penilaian Kinerja / Proyek',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    gradeLevel: 'Fase D (SMP)',
    aspects: 'Penalaran Kritis, Kualitas Data Lapangan, Kolaborasi Tim, Komunikasi Presentasi'
  });

  const [generatedRubrik, setGeneratedRubrik] = useState<any>(null);

  const handleGenerateSoal = async () => {
    setIsGenerating(true);
    try {
      const res = await generateSoalAsesmen(soalForm);
      setGeneratedSoal(res);
    } catch (e) {
      console.warn('Error generating soal:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateRubrik = async () => {
    setIsGenerating(true);
    try {
      const res = await generateRubrik({
        ...rubrikForm,
        aspects: rubrikForm.aspects.split(',').map(s => s.trim())
      });
      setGeneratedRubrik(res);
    } catch (e) {
      console.warn('Error generating rubrik:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Perangkat Asesmen & Rubrik Analitik</h2>
          <p className="text-xs text-slate-500">
            Penyusun butir soal HOTS berbasis stimulus nyata dan rubrik analitik 4 level observable.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('soal')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'soal'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Generator Soal HOTS
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('rubrik')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'rubrik'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Generator Rubrik 4 Level
          </button>
        </div>
      </div>

      {/* SUBTAB 1: GENERATOR SOAL */}
      {activeSubTab === 'soal' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={soalForm.subject}
                  onChange={(e) => setSoalForm({ ...soalForm, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenjang / Kelas</label>
                <input
                  type="text"
                  value={soalForm.gradeLevel}
                  onChange={(e) => setSoalForm({ ...soalForm, gradeLevel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tingkat Kognitif</label>
                <input
                  type="text"
                  value={soalForm.cognitiveLevel}
                  onChange={(e) => setSoalForm({ ...soalForm, cognitiveLevel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">Topik / Materi Pokok</label>
                <input
                  type="text"
                  value={soalForm.topic}
                  onChange={(e) => setSoalForm({ ...soalForm, topic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateSoal}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isGenerating ? 'Menyusun Soal...' : 'Generate Butir Soal HOTS'}</span>
              </button>
            </div>
          </div>

          {/* Result of Soal */}
          {generatedSoal && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{generatedSoal.assessmentTitle}</h3>
                  <span className="text-xs text-slate-500">Mata Pelajaran: {soalForm.subject} ({soalForm.gradeLevel})</span>
                </div>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors print:hidden"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Soal</span>
                </button>
              </div>

              <div className="space-y-6 text-xs text-slate-800">
                {generatedSoal.items?.map((item: any) => (
                  <div key={item.number} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 font-bold text-[10px]">
                        Nomor {item.number} • {item.type} ({item.cognitiveLevel})
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">Skor: {item.score} poin</span>
                    </div>

                    {item.stimulus && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 italic text-slate-700">
                        <strong className="block text-slate-900 not-italic text-[11px] mb-1">Stimulus Kontekstual:</strong>
                        "{item.stimulus}"
                      </div>
                    )}

                    <div className="font-semibold text-slate-900">
                      {item.question}
                    </div>

                    {item.options && item.options.length > 0 && (
                      <div className="space-y-1 pl-2">
                        {item.options.map((opt: any) => (
                          <div key={opt.code} className="flex items-start gap-2">
                            <span className="font-bold w-4 text-slate-700">{opt.code}.</span>
                            <span>{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 flex flex-col gap-1 text-[11px]">
                      <div className="text-emerald-800 font-bold">
                        Kunci Jawaban: {item.answerKey}
                      </div>
                      <div className="text-slate-600">
                        <strong>Pembahasan & Rubrik:</strong> {item.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: GENERATOR RUBRIK */}
      {activeSubTab === 'rubrik' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs print:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Tugas / Kegiatan</label>
                <input
                  type="text"
                  value={rubrikForm.title}
                  onChange={(e) => setRubrikForm({ ...rubrikForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Asesmen</label>
                <input
                  type="text"
                  value={rubrikForm.taskType}
                  onChange={(e) => setRubrikForm({ ...rubrikForm, taskType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Aspek-Aspek yang Dinilai (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={rubrikForm.aspects}
                  onChange={(e) => setRubrikForm({ ...rubrikForm, aspects: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateRubrik}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isGenerating ? 'Menyusun Rubrik...' : 'Generate Rubrik Analitik 4 Level'}</span>
              </button>
            </div>
          </div>

          {/* Result of Rubrik */}
          {generatedRubrik && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{generatedRubrik.title}</h3>
                  <span className="text-xs text-slate-500">Jenis Tugas: {generatedRubrik.taskType}</span>
                </div>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors print:hidden"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Rubrik</span>
                </button>
              </div>

              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="border border-slate-300 p-2 text-left w-1/5">Aspek Dinilai</th>
                    <th className="border border-slate-300 p-2 text-left w-1/5">Level 4 (Mahir / Sangat Baik)</th>
                    <th className="border border-slate-300 p-2 text-left w-1/5">Level 3 (Cakap / Baik)</th>
                    <th className="border border-slate-300 p-2 text-left w-1/5">Level 2 (Layak / Cukup)</th>
                    <th className="border border-slate-300 p-2 text-left w-1/5">Level 1 (Baru Berkembang)</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedRubrik.rubrics?.map((r: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">
                        {r.aspect}
                        {r.weight && <span className="block text-[10px] text-blue-700 font-normal">Bobot: {r.weight}</span>}
                      </td>
                      <td className="border border-slate-300 p-2">{r.level4}</td>
                      <td className="border border-slate-300 p-2">{r.level3}</td>
                      <td className="border border-slate-300 p-2">{r.level2}</td>
                      <td className="border border-slate-300 p-2">{r.level1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {generatedRubrik.categoryInterpretation && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-900">Rumus Penilaian & Interpretasi Nilai Akhir:</div>
                  <p className="text-slate-600 font-medium">{generatedRubrik.scoringFormula}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] mt-2">
                    {generatedRubrik.categoryInterpretation.map((cat: any, i: number) => (
                      <div key={i} className="p-2 bg-white rounded-lg border border-slate-200">
                        <strong className="text-blue-900 block">{cat.range} ({cat.predicate})</strong>
                        <span className="text-slate-500">{cat.recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
