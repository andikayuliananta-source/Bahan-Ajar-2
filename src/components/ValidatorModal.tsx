import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Sparkles,
  ArrowRight,
  Award
} from 'lucide-react';
import { ModulAjarDocument, ValidationResult } from '../types';
import { validateModule } from '../services/apiService';

interface ValidatorModalProps {
  document: ModulAjarDocument;
  onClose: () => void;
  onRefineWithPrompt: (prompt: string) => void;
}

export const ValidatorModal: React.FC<ValidatorModalProps> = ({
  document,
  onClose,
  onRefineWithPrompt,
}) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ValidationResult | null>(null);

  useEffect(() => {
    async function runValidation() {
      setLoading(true);
      try {
        const res = await validateModule(document);
        setResult(res);
      } catch (e) {
        console.warn('Validation error:', e);
      } finally {
        setLoading(false);
      }
    }
    runValidation();
  }, [document]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Audit Validator Otomatis (17 Poin)</h3>
              <p className="text-xs text-slate-400">Standar Kualitas Pembelajaran Mendalam Kemendikdasmen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <div className="text-sm font-bold text-slate-900">Menganalisis Kualitas Perangkat...</div>
              <p className="text-xs text-slate-500">Memeriksa keselarasan CP, TP, 8-3-3-4, Asesmen, dan Rubrik.</p>
            </div>
          ) : result ? (
            <>
              {/* Score Indicator Banner */}
              <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                result.isOptimal
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-xs ${
                    result.isOptimal ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {result.totalScore}%
                  </div>
                  <div>
                    <div className="font-bold text-sm">
                      {result.isOptimal ? 'Dokumen Sangat Baik dan Optimal' : 'Dokumen Belum Optimal'}
                    </div>
                    <p className="text-xs opacity-80 mt-0.5">{result.summary}</p>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
                  Pemeriksaan 17 Indikator Kualitas:
                </h4>
                <div className="space-y-1.5 text-xs">
                  {result.checklist?.map((chk, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                        chk.passed ? 'bg-slate-50/70 border-slate-200 text-slate-800' : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {chk.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        )}
                        <span className="font-semibold">{chk.item}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 italic">{chk.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs text-blue-950">
                  <span className="font-bold block mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-700" />
                    Rekomendasi Penyempurnaan AI:
                  </span>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {result.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>

                  {!result.isOptimal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onRefineWithPrompt('Sempurnakan seluruh indikator yang belum optimal pada dokumen sesuai rekomendasi validator.');
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span>Perbaiki Otomatis dengan AI</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Tidak ada hasil validasi.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
