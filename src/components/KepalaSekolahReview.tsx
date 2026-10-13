import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  Eye,
  AlertCircle,
  Award,
  BookOpen,
  Sprout
} from 'lucide-react';
import { ModulAjarDocument, KokurikulerProgramDocument } from '../types';
import { StorageService } from '../services/storageService';

interface KepalaSekolahReviewProps {
  modules: ModulAjarDocument[];
  programs: KokurikulerProgramDocument[];
  onPreviewModule: (mod: ModulAjarDocument) => void;
  onPreviewProgram: (prog: KokurikulerProgramDocument) => void;
  onRefresh: () => void;
}

export const KepalaSekolahReview: React.FC<KepalaSekolahReviewProps> = ({
  modules,
  programs,
  onPreviewModule,
  onPreviewProgram,
  onRefresh,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const handleApproveModule = async (mod: ModulAjarDocument) => {
    const updated: ModulAjarDocument = {
      ...mod,
      status: 'approved',
      reviewNotes: noteText || 'Disetujui oleh Kepala Sekolah: Perangkat sangat baik dan memenuhi kerangka 8-3-3-4.',
      updatedAt: new Date().toISOString()
    };
    await StorageService.saveModule(updated);
    setSelectedDocId(null);
    setNoteText('');
    onRefresh();
  };

  const handleRequestRevisionModule = async (mod: ModulAjarDocument) => {
    const updated: ModulAjarDocument = {
      ...mod,
      status: 'revision',
      reviewNotes: noteText || 'Perlu perbaikan pada indikator KKTP dan rubrik penilaian.',
      updatedAt: new Date().toISOString()
    };
    await StorageService.saveModule(updated);
    setSelectedDocId(null);
    setNoteText('');
    onRefresh();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-indigo-600" />
          Dashboard Supervisi & Verifikasi Kepala Sekolah
        </h2>
        <p className="text-xs text-slate-500">
          Pemeriksaan perangkat pembelajaran guru, pemberian umpan balik supervisi, dan persetujuan resmi.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900">{modules.length}</div>
            <div className="text-xs text-slate-500">Total Modul Ajar Masuk</div>
          </div>
          <BookOpen className="w-8 h-8 text-blue-500" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {modules.filter(m => m.status === 'approved').length}
            </div>
            <div className="text-xs text-slate-500">Telah Disetujui (Approved)</div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {modules.filter(m => m.status === 'draft' || m.status === 'revision').length}
            </div>
            <div className="text-xs text-slate-500">Perlu Verifikasi / Draf</div>
          </div>
          <Clock className="w-8 h-8 text-amber-500" />
        </div>
      </div>

      {/* Modules to Review */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Daftar Modul Ajar Guru yang Diajukan
          </h3>
          <span className="text-xs text-slate-500">{modules.length} Dokumen</span>
        </div>

        <div className="divide-y divide-slate-100">
          {modules.map((mod) => (
            <div key={mod.id} className="p-5 hover:bg-slate-50 transition-colors space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-slate-900 text-sm">{mod.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                      {mod.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                      {mod.gradeLevel}
                    </span>
                    {mod.status === 'approved' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Disetujui
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                        Menunggu Supervisi
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span>Guru: <strong>{mod.schoolInfo?.teacher || mod.createdBy}</strong></span>
                    <span>NIP: {mod.schoolInfo?.teacherNip || '-'}</span>
                    <span>Topik: <strong>{mod.topic}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPreviewModule(mod)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg border border-slate-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Rincian</span>
                  </button>

                  <button
                    onClick={() => setSelectedDocId(selectedDocId === mod.id ? null : mod.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Beri Catatan / Status</span>
                  </button>
                </div>
              </div>

              {mod.reviewNotes && (
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900">
                  <strong className="block text-blue-950 text-[11px] mb-0.5">Catatan Supervisi Terakhir:</strong>
                  {mod.reviewNotes}
                </div>
              )}

              {/* Review Drawer Form */}
              {selectedDocId === mod.id && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300 space-y-3 mt-2 text-xs">
                  <label className="block font-bold text-slate-800">
                    Catatan Supervisi Kepala Sekolah:
                  </label>
                  <textarea
                    rows={2}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Tuliskan catatan perbaikan atau apresiasi terhadap integrasi 8-3-3-4..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white outline-hidden"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleRequestRevisionModule(mod)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold cursor-pointer"
                    >
                      Minta Revisi
                    </button>
                    <button
                      onClick={() => handleApproveModule(mod)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer"
                    >
                      Setujui Dokumen (Approve)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
