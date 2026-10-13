import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, Wand2, CheckCircle2 } from 'lucide-react';
import { ModulAjarDocument } from '../types';
import { refineDocument } from '../services/apiService';
import { StorageService } from '../services/storageService';

interface AIRefineModalProps {
  document: ModulAjarDocument;
  onClose: () => void;
  onUpdate: (updatedDoc: ModulAjarDocument) => void;
}

export const AIRefineModal: React.FC<AIRefineModalProps> = ({
  document,
  onClose,
  onUpdate,
}) => {
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const quickPrompts = [
    'Buat lebih kontekstual dengan isu lingkungan sekitar.',
    'Sesuaikan bahasa dan aktivitas agar lebih konkret.',
    'Buat aktivitas lebih menyenangkan dan menggembirakan.',
    'Tambahkan tantangan HOTS pada asesmen dan pertanyaan pemantik.',
    'Perbaiki rubrik agar deskripsi perilaku lebih observable pada level 1 s.d 4.',
    'Sederhanakan bahasa agar ramah bagi peserta didik.',
    'Tambahkan aktivitas kolaboratif gotong royong.',
    'Kurangi penggunaan teknologi dan maksimalkan bahan konkret di sekitar sekolah.',
    'Buat lebih realistis untuk kondisi sekolah dengan sarana terbatas.'
  ];

  const handleApplyRefine = async (customPrompt?: string) => {
    const promptToUse = customPrompt || instruction;
    if (!promptToUse.trim()) return;

    setIsProcessing(true);
    setSuccessMsg(null);
    try {
      const refined = await refineDocument(document, promptToUse);
      await StorageService.saveModule(refined);
      onUpdate(refined);
      setSuccessMsg('Dokumen berhasil diperbaiki dengan AI!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (e: any) {
      console.warn('Refinement error:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-600 to-indigo-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Prompt Builder: Perbaiki Modul</h3>
              <p className="text-xs text-amber-100">Penyempurnaan cerdas terarah tanpa mengubah struktur valid</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Pilih Cepat Instruksi Perbaikan:
            </label>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInstruction(qp)}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg border border-slate-200 transition-colors text-left"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Instruksi Khusus dari Anda:
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Contoh: Tambahkan studi kasus mengenai daur ulang sampah di perkotaan dan perjelas rubrik presentasi..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
            />
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-[11px] text-blue-900 leading-relaxed">
            AI akan mempertahankan identitas dan komponen yang sudah benar, serta hanya menyempurnakan bagian yang Anda minta secara presisi.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Batal
          </button>
          <button
            disabled={isProcessing || !instruction.trim()}
            onClick={() => handleApplyRefine()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Wand2 className="w-4 h-4" />
            <span>{isProcessing ? 'AI Menyempurnakan...' : 'Terapkan Perbaikan AI'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
