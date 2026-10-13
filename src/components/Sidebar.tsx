import React from 'react';
import {
  Home,
  BookOpen,
  Target,
  Brain,
  FileCheck,
  BarChart2,
  RefreshCw,
  Sprout,
  Library,
  Bot,
  FolderClosed,
  UserCheck,
  Settings,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'modul_ajar'
  | 'cp_tp'
  | 'deep_learning'
  | 'asesmen'
  | 'rubrik'
  | 'remedial'
  | 'kokurikuler'
  | 'bank_template'
  | 'ai_generator'
  | 'my_documents'
  | 'supervisi'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  role: UserRole;
  moduleCount: number;
  kokuCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  role,
  moduleCount,
  kokuCount,
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      badge: null,
      description: 'Ikhtisar & ringkasan'
    },
    {
      id: 'modul_ajar',
      label: 'Modul Ajar',
      icon: BookOpen,
      badge: moduleCount > 0 ? moduleCount : null,
      description: 'Penyusunan Modul 8-3-3-4'
    },
    {
      id: 'cp_tp',
      label: 'CP & TP',
      icon: Target,
      badge: 'Resmi',
      description: 'Bank CP & Generator TP'
    },
    {
      id: 'deep_learning',
      label: 'Pembelajaran Mendalam',
      icon: Brain,
      badge: '8–3–3–4',
      description: 'Kerangka & dimensi profil'
    },
    {
      id: 'asesmen',
      label: 'Asesmen & Soal',
      icon: FileCheck,
      badge: 'HOTS',
      description: 'Diagnostik, Formatif, Sumatif'
    },
    {
      id: 'rubrik',
      label: 'Rubrik Penilaian',
      icon: BarChart2,
      badge: '4 Level',
      description: 'Rubrik analitik terukur'
    },
    {
      id: 'remedial',
      label: 'Remedial & Pengayaan',
      icon: RefreshCw,
      badge: null,
      description: 'Diagnosis & tindak lanjut'
    },
    {
      id: 'kokurikuler',
      label: 'Program Kokurikuler',
      icon: Sprout,
      badge: kokuCount > 0 ? kokuCount : null,
      description: 'Lintas mapel & 7 kebiasaan'
    },
    {
      id: 'bank_template',
      label: 'Bank Template',
      icon: Library,
      badge: 'SD/SMP/SMA',
      description: 'Perangkat siap adaptasi'
    },
    {
      id: 'ai_generator',
      label: 'AI Generator Cepat',
      icon: Bot,
      badge: 'AI Flash',
      description: 'Generator otomatis instan'
    },
    {
      id: 'my_documents',
      label: 'Dokumen Saya',
      icon: FolderClosed,
      badge: moduleCount + kokuCount,
      description: 'Arsip & status approval'
    },
    {
      id: 'supervisi',
      label: role === 'kepala_sekolah' ? 'Supervisi Kepala Sekolah' : 'Verifikasi Kepala Sekolah',
      icon: UserCheck,
      badge: role === 'kepala_sekolah' ? 'Kepsek' : null,
      description: 'Pemeriksaan & persetujuan'
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      icon: Settings,
      badge: null,
      description: 'Identitas sekolah & profil'
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col h-[calc(100vh-4rem)] border-r border-slate-800 print:hidden overflow-y-auto">
      {/* Sidebar header banner */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
            Menu Utama
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-200 border border-blue-700/50">
            v2.5 Kemendikdasmen
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as ActiveTab)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                <div className="truncate">
                  <div className="font-semibold truncate">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-semibold flex-shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-blue-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer info in sidebar */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/60">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">Sistem Perencanaan AI</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Terintegrasi Kurikulum Nasional, Pembelajaran Mendalam & Kokurikuler.
        </p>
      </div>
    </aside>
  );
};
