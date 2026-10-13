import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  BookOpen,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { OFFICIAL_CP_CATALOG, SubjectCatalogItem } from '../data/kurikulumData';
import { generateLearningObjectives } from '../services/apiService';

interface CpTpManagerProps {
  onTransferToModule: (cp: string, tpList: string[]) => void;
}

export const CpTpManager: React.FC<CpTpManagerProps> = ({ onTransferToModule }) => {
  const [selectedItem, setSelectedItem] = useState<SubjectCatalogItem>(OFFICIAL_CP_CATALOG[6]); // SMP IPA
  const [customCp, setCustomCp] = useState<string>(OFFICIAL_CP_CATALOG[6].cp);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSelect = (item: SubjectCatalogItem) => {
    setSelectedItem(item);
    setCustomCp(item.cp);
    setGeneratedResult(null);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateLearningObjectives({
        cp: customCp,
        subject: selectedItem.name,
        gradeLevel: selectedItem.gradeLevels.join(', '),
        phase: selectedItem.phase,
        topic: selectedItem.defaultTopic,
      });
      setGeneratedResult(res);
    } catch (e) {
      console.warn('Error generating TP:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyTp = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Katalog CP Resmi & Generator TP Operasional
        </h2>
        <p className="text-xs text-slate-500">
          Analisis Capaian Pembelajaran resmi Kemendikdasmen menjadi Tujuan Pembelajaran terukur, KKTP, dan Profil Lulusan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Official CP Catalog */}
        <div className="lg:col-span-1 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3 h-[700px] flex flex-col">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 px-1">
            Pilih Mata Pelajaran & Fase:
          </h3>
          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
            {OFFICIAL_CP_CATALOG.map((cat) => {
              const isSelected = selectedItem.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelect(cat)}
                  className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 border-blue-600'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-0.5">
                    <span className={isSelected ? 'text-blue-100' : 'text-blue-600 font-semibold'}>
                      Fase {cat.phase} ({cat.gradeLevels.join(', ')})
                    </span>
                  </div>
                  <div className="text-xs font-bold truncate">{cat.name}</div>
                  <div className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                    {cat.defaultTopic}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: CP Text & AI Analysis */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  Fase {selectedItem.phase} • {selectedItem.gradeLevels.join(', ')}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedItem.name}</h3>
              </div>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>{isGenerating ? 'AI Sedang Menganalisis...' : 'Bedah CP → TP Otomatis'}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teks Capaian Pembelajaran (CP) Resmi:
              </label>
              <textarea
                rows={5}
                value={customCp}
                onChange={(e) => setCustomCp(e.target.value)}
                className="w-full p-3.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
              />
            </div>
          </div>

          {/* Results: TP Operasional */}
          {generatedResult && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Hasil Perumusan Tujuan Pembelajaran (TP)
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const tps = generatedResult.learningObjectives?.map((o: any) => o.statement) || [];
                    onTransferToModule(customCp, tps);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <span>Gunakan pada Modul Ajar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {generatedResult.learningObjectives?.map((tp: any, idx: number) => (
                  <div key={tp.id || idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 text-xs leading-snug">{tp.statement}</p>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Kompetensi: <strong>{tp.competency}</strong> • Lingkup: <strong>{tp.materialScope}</strong>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopyTp(tp.statement, idx)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors flex-shrink-0"
                        title="Salin TP ini"
                      >
                        {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* KKTP */}
                    {tp.kktp && (
                      <div className="pl-7">
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide block mb-1">
                          Indikator Ketercapaian (KKTP):
                        </span>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-600 text-[11px]">
                          {tp.kktp.map((k: string, i: number) => (
                            <li key={i}>{k}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommended Dimensions */}
                    {tp.recommendedDimensions && (
                      <div className="pl-7 pt-1 flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-semibold text-slate-500">Dimensi Selaras:</span>
                        {tp.recommendedDimensions.map((d: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-100 text-blue-800">
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
