import React from 'react';
import { Library, Sparkles, BookOpen, ArrowRight, Copy, Check } from 'lucide-react';
import { ModulAjarDocument } from '../types';
import { SAMPLE_MODULE } from '../services/storageService';

interface TemplateBankProps {
  onUseTemplate: (tpl: ModulAjarDocument) => void;
}

export const TemplateBank: React.FC<TemplateBankProps> = ({ onUseTemplate }) => {
  const templates: {
    id: string;
    level: string;
    phase: string;
    subject: string;
    title: string;
    pedagogy: string;
    dimensions: string[];
    description: string;
    data: ModulAjarDocument;
  }[] = [
    {
      id: 'tpl-smp-ipa',
      level: 'SMP (Kelas 7)',
      phase: 'Fase D',
      subject: 'Ilmu Pengetahuan Alam (IPA)',
      title: 'Interaksi Ekosistem & Web of Life Game',
      pedagogy: 'Problem Based Learning (PBL)',
      dimensions: ['Penalaran Kritis', 'Kolaborasi', 'Kreativitas'],
      description: 'Penyelidikan rantai makanan melalui observasi taman sekolah dan simulasi benang jaring ekologis.',
      data: SAMPLE_MODULE
    },
    {
      id: 'tpl-sd-ipas',
      level: 'SD (Kelas 4)',
      phase: 'Fase B',
      subject: 'IPAS',
      title: 'Wujud Zat dan Perubahannya di Sekitar Kita',
      pedagogy: 'Inquiry-Based Learning',
      dimensions: ['Penalaran Kritis', 'Kreativitas', 'Kemandirian'],
      description: 'Eksperimen mencair, membeku, dan menguap menggunakan lilin, es batu, dan air hangat dengan prinsip menggembirakan.',
      data: {
        ...SAMPLE_MODULE,
        id: 'modul-sd-ipas-01',
        title: 'Modul Ajar: Wujud Zat dan Perubahannya di Sekitar Kita',
        subject: 'IPAS',
        gradeLevel: 'Kelas 4 (Fase B)',
        phase: 'B',
        topic: 'Eksperimen Perubahan Wujud Zat',
        allocatedTime: '2 x 35 Menit'
      }
    },
    {
      id: 'tpl-sma-bio',
      level: 'SMA (Kelas 10)',
      phase: 'Fase E',
      subject: 'Biologi',
      title: 'Keanekaragaman Hayati dan Mitigasi Pencemaran',
      pedagogy: 'Project Based Learning (PjBL)',
      dimensions: ['Kewargaan', 'Penalaran Kritis', 'Kolaborasi'],
      description: 'Proyek audit keanekaragaman flora lokal dan perancangan mini-herbarium digital terpadu.',
      data: {
        ...SAMPLE_MODULE,
        id: 'modul-sma-bio-01',
        title: 'Modul Ajar: Keanekaragaman Hayati dan Mitigasi Pencemaran',
        subject: 'Biologi',
        gradeLevel: 'Kelas 10 (Fase E)',
        phase: 'E',
        topic: 'Pelestarian Spesies Endemik Nusantara',
        allocatedTime: '2 x 45 Menit'
      }
    },
    {
      id: 'tpl-smp-mat',
      level: 'SMP (Kelas 8)',
      phase: 'Fase D',
      subject: 'Matematika',
      title: 'Persamaan Linear dan Pemecahan Masalah Nyata',
      pedagogy: 'Contextual Teaching and Learning (CTL)',
      dimensions: ['Penalaran Kritis', 'Kemandirian', 'Komunikasi'],
      description: 'Menghitung anggaran belanja kantin sehat dan perbandingan harga komoditas pasar lokal.',
      data: {
        ...SAMPLE_MODULE,
        id: 'modul-smp-mat-01',
        title: 'Modul Ajar: Persamaan Linear dalam Konteks Ekonomi Pasar',
        subject: 'Matematika',
        gradeLevel: 'Kelas 8 (Fase D)',
        phase: 'D',
        topic: 'Persamaan Linear Satu Variabel',
        allocatedTime: '2 x 40 Menit'
      }
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Library className="w-6 h-6 text-blue-600" />
          Bank Template Perangkat Pembelajaran Teladan
        </h2>
        <p className="text-xs text-slate-500">
          Koleksi modul ajar berstandar tinggi yang telah tervalidasi 8–3–3–4 Kemendikdasmen untuk diadaptasi langsung ke sekolah Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  {tpl.level} • {tpl.phase}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{tpl.pedagogy}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">{tpl.title}</h3>
              <p className="text-xs text-slate-500 mb-3">{tpl.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {tpl.dimensions.map((d, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => onUseTemplate(tpl.data)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>Gunakan & Sesuaikan Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
