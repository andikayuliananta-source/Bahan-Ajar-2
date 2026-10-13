import React from 'react';
import {
  BookOpen,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Target,
  FileCheck,
  Eye,
  Printer,
  Edit,
  Clock,
  Award,
  Layers,
  Heart,
  Smile,
  Zap,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { ModulAjarDocument, KokurikulerProgramDocument, UserRole } from '../types';

interface DashboardProps {
  modules: ModulAjarDocument[];
  programs: KokurikulerProgramDocument[];
  role: UserRole;
  onNavigate: (tab: any) => void;
  onPreviewModule: (mod: ModulAjarDocument) => void;
  onPreviewProgram: (prog: KokurikulerProgramDocument) => void;
  onNewModule: () => void;
  onNewProgram: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  modules,
  programs,
  role,
  onNavigate,
  onPreviewModule,
  onPreviewProgram,
  onNewModule,
  onNewProgram,
}) => {
  const approvedCount = modules.filter(m => m.status === 'approved').length + programs.filter(p => p.status === 'approved').length;
  const draftCount = modules.filter(m => m.status === 'draft').length + programs.filter(p => p.status === 'draft').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Official Kemendikdasmen Regulatory Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold block text-sm text-amber-950 mb-0.5">
            Pemberitahuan Landasan Kebijakan & Regulasi Resmi
          </span>
          Aplikasi ini dirancang selaras dengan regulasi dan panduan resmi Kemendikdasmen RI terbaru berbasis{' '}
          <strong className="font-semibold">Pembelajaran Mendalam 8–3–3–4</strong>. Seluruh CP, dimensi profil lulusan, dan prinsip pembelajaran bersumber dari acuan resmi pemerintah.
          <p className="mt-1 font-semibold text-amber-800 italic">
            "Verifikasi kembali regulasi terbaru melalui dokumen resmi Kemendikdasmen/JDIH sebelum digunakan sebagai dokumen resmi sekolah."
          </p>
        </div>
      </div>

      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Teacher Planning Assistant • Pendekar Modul Ajar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-snug">
            Merancang Pembelajaran Mendalam, Menyusun Perangkat Lebih Mudah.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
            Bantu guru PAUD, SD, SMP, SMA, dan SMK menghasilkan Modul Ajar berbasis 8–3–3–4, Asesmen Autentik, Rubrik Analitik 4 Level, dan Program Kokurikuler Lintas Mata Pelajaran secara presisi dan siap cetak.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onNewModule}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-102 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Modul Ajar Baru</span>
            </button>

            <button
              onClick={onNewProgram}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-102 cursor-pointer"
            >
              <Sprout className="w-4 h-4" />
              <span>Susun Program Kokurikuler</span>
            </button>

            <button
              onClick={() => onNavigate('deep_learning')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all"
            >
              <span>Pelajari Kerangka 8–3–3–4</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{modules.length}</div>
            <div className="text-xs font-medium text-slate-500">Modul Ajar Tersimpan</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{programs.length}</div>
            <div className="text-xs font-medium text-slate-500">Program Kokurikuler</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{approvedCount}</div>
            <div className="text-xs font-medium text-slate-500">Disetujui Kepala Sekolah</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">100%</div>
            <div className="text-xs font-medium text-slate-500">Kesesuaian 8–3–3–4</div>
          </div>
        </div>
      </div>

      {/* 8-3-3-4 Framework Visual Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              Kerangka Pembelajaran Mendalam (8–3–3–4)
            </h3>
            <p className="text-xs text-slate-500">
              Setiap modul yang dihasilkan secara otomatis mengintegrasikan empat pilar kurikulum mendalam:
            </p>
          </div>
          <button
            onClick={() => onNavigate('deep_learning')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            Lihat Panduan Lengkap <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 8 Dimensi */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-900">8 Dimensi Profil Lulusan</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-md">8 Dimensi</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed mb-3">
              Iman-Takwa, Kewargaan, Penalaran Kritis, Kreativitas, Kolaborasi, Kemandirian, Kesehatan, Komunikasi.
            </p>
            <div className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-blue-600" /> AI memilih 2–4 dimensi paling selaras dengan materi.
            </div>
          </div>

          {/* 3 Prinsip */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-900">3 Prinsip Pembelajaran</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded-md">3 Prinsip</span>
            </div>
            <ul className="text-[11px] text-indigo-900 space-y-1 mb-2 font-medium">
              <li>• <strong>Berkesadaran</strong>: regulasi diri & target sukses</li>
              <li>• <strong>Bermakna</strong>: kontekstual kehidupan nyata</li>
              <li>• <strong>Menggembirakan</strong>: aman psikologis & menantang</li>
            </ul>
            <div className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-indigo-600" /> Diterjemahkan konkret ke aktivitas guru & murid.
            </div>
          </div>

          {/* 3 Pengalaman */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900">3 Pengalaman Belajar</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-md">3 Pengalaman</span>
            </div>
            <ul className="text-[11px] text-emerald-900 space-y-1 mb-2 font-medium">
              <li>1. <strong>Memahami</strong>: bangun konsep baru</li>
              <li>2. <strong>Mengaplikasi</strong>: praktik / solusi masalah</li>
              <li>3. <strong>Merefleksi</strong>: evaluasi proses & metakognisi</li>
            </ul>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Jadi struktur fase inti langkah pembelajaran.
            </div>
          </div>

          {/* 4 Komponen */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900">4 Komponen Kerangka</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-600 text-white rounded-md">4 Komponen</span>
            </div>
            <ul className="text-[11px] text-amber-950 space-y-1 mb-2 font-medium">
              <li>• <strong>Praktik Pedagogis</strong> (PBL, Inquiry, STEM)</li>
              <li>• <strong>Lingkungan Belajar</strong> (Aman & Kondusif)</li>
              <li>• <strong>Kemitraan</strong> (Orang tua & Mitra lokal)</li>
              <li>• <strong>Pemanfaatan Digital</strong> (Tepat guna)</li>
            </ul>
            <div className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-amber-700" /> Ekosistem belajar terpadu holistik.
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tool Launchers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('cp_tp')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Target className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Bank CP & Generator TP</h4>
          <p className="text-xs text-slate-500">
            Analisis CP resmi PAUD s.d SMA/SMK menjadi Tujuan Pembelajaran operasional dan KKTP terukur.
          </p>
        </div>

        <div
          onClick={() => onNavigate('asesmen')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <FileCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Generator Soal HOTS</h4>
          <p className="text-xs text-slate-500">
            Susun butir soal berbasis stimulus nyata (PG, uraian, menjodohkan) dengan kunci dan pembahasan.
          </p>
        </div>

        <div
          onClick={() => onNavigate('rubrik')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Rubrik Analitik 4 Level</h4>
          <p className="text-xs text-slate-500">
            Buat rubrik penilaian observasi observable untuk proyek, kinerja, presentasi, dan portofolio.
          </p>
        </div>

        <div
          onClick={() => onNavigate('bank_template')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Template Siap Pakai</h4>
          <p className="text-xs text-slate-500">
            Kloning modul ajar teladan dan contoh program kokurikuler untuk adaptasi instan ke sekolah Anda.
          </p>
        </div>
      </div>

      {/* Recent Teaching Modules List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Perangkat Pembelajaran Terbaru
            </h3>
            <p className="text-xs text-slate-500">
              Daftar modul ajar yang telah dibuat dan status verifikasinya:
            </p>
          </div>
          <button
            onClick={() => onNavigate('my_documents')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            Lihat Semua Dokumen <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {modules.map((mod) => (
            <div key={mod.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">{mod.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                    {mod.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                    {mod.gradeLevel}
                  </span>
                  {mod.status === 'approved' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Disetujui Kepala Sekolah
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Draf / Siap Verifikasi
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-4 flex-wrap">
                  <span>Materi: <strong className="text-slate-700">{mod.topic}</strong></span>
                  <span>Guru: <strong className="text-slate-700">{mod.schoolInfo?.teacher || mod.createdBy}</strong></span>
                  <span>Alokasi: <strong className="text-slate-700">{mod.allocatedTime}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onPreviewModule(mod)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
                  title="Lihat Pratinjau & Cetak Dokumen"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Preview / Cetak</span>
                </button>
              </div>
            </div>
          ))}

          {modules.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              Belum ada modul ajar yang dibuat. Klik tombol "Buat Modul Ajar Baru" di atas untuk memulai!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
