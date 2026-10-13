import React, { useState } from 'react';
import {
  FolderClosed,
  BookOpen,
  Sprout,
  CheckCircle2,
  Clock,
  Eye,
  Trash2,
  Edit,
  Printer,
  Search,
  Plus
} from 'lucide-react';
import { ModulAjarDocument, KokurikulerProgramDocument } from '../types';
import { StorageService } from '../services/storageService';

interface MyDocumentsViewProps {
  modules: ModulAjarDocument[];
  programs: KokurikulerProgramDocument[];
  onPreviewModule: (mod: ModulAjarDocument) => void;
  onPreviewProgram: (prog: KokurikulerProgramDocument) => void;
  onEditModule: (mod: ModulAjarDocument) => void;
  onNewModule: () => void;
  onNewProgram: () => void;
  onRefresh: () => void;
}

export const MyDocumentsView: React.FC<MyDocumentsViewProps> = ({
  modules,
  programs,
  onPreviewModule,
  onPreviewProgram,
  onEditModule,
  onNewModule,
  onNewProgram,
  onRefresh,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'modul' | 'kokurikuler'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleDeleteModule = async (id: string, title: string) => {
    if (window.confirm(`Hapus modul "${title}"?`)) {
      await StorageService.deleteModule(id);
      onRefresh();
    }
  };

  const handleDeleteProgram = async (id: string, title: string) => {
    if (window.confirm(`Hapus program "${title}"?`)) {
      await StorageService.deleteKokurikulerProgram(id);
      onRefresh();
    }
  };

  const filteredModules = modules.filter(m =>
    (filterType === 'all' || filterType === 'modul') &&
    (m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
     m.topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPrograms = programs.filter(p =>
    (filterType === 'all' || filterType === 'kokurikuler') &&
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderClosed className="w-6 h-6 text-blue-600" />
            Dokumen Saya
          </h2>
          <p className="text-xs text-slate-500">
            Arsip seluruh Modul Ajar dan Program Kokurikuler yang tersimpan di cloud & lokal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewModule}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Modul Ajar Baru</span>
          </button>
          <button
            onClick={onNewProgram}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Program Kokurikuler Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Semua ({modules.length + programs.length})
          </button>
          <button
            onClick={() => setFilterType('modul')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterType === 'modul' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Modul Ajar ({modules.length})
          </button>
          <button
            onClick={() => setFilterType('kokurikuler')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filterType === 'kokurikuler' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Kokurikuler ({programs.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari topik atau mapel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {/* Modul Ajar Items */}
          {filteredModules.map((mod) => (
            <div key={mod.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="p-1 rounded-md bg-blue-100 text-blue-700">
                    <BookOpen className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{mod.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    {mod.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                    {mod.gradeLevel}
                  </span>
                  {mod.status === 'approved' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Disetujui
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                      Draf
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-4 flex-wrap">
                  <span>Materi: <strong>{mod.topic}</strong></span>
                  <span>Alokasi: {mod.allocatedTime}</span>
                  <span>Update: {new Date(mod.updatedAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onPreviewModule(mod)}
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="Pratinjau & Cetak"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEditModule(mod)}
                  className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit Modul"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteModule(mod.id, mod.title)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Kokurikuler Items */}
          {filteredPrograms.map((prog) => (
            <div key={prog.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="p-1 rounded-md bg-emerald-100 text-emerald-700">
                    <Sprout className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{prog.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {prog.theme}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                    {prog.gradeLevel}
                  </span>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-4 flex-wrap">
                  <span>Topik: <strong>{prog.topic}</strong></span>
                  <span>Waktu: {prog.allocatedTime}</span>
                  <span>TP: {prog.academicYear}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onPreviewProgram(prog)}
                  className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  title="Pratinjau Program"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProgram(prog.id, prog.title)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredModules.length === 0 && filteredPrograms.length === 0 && (
            <div className="p-12 text-center text-xs text-slate-400">
              Tidak ada dokumen yang sesuai dengan pencarian.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
