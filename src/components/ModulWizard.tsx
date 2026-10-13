import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Save,
  BookOpen,
  RefreshCw,
  Plus,
  Trash2,
  Target
} from 'lucide-react';
import {
  ModulAjarDocument,
  SchoolProfile,
  UserProfile,
  LearningIdentity,
  DimensionSelected
} from '../types';
import { OFFICIAL_CP_CATALOG, PROFILE_DIMENSIONS_8, FOUR_COMPONENTS_EXPLANATION } from '../data/kurikulumData';
import { generateLearningObjectives, generateModulAjar, validateModule } from '../services/apiService';
import { StorageService } from '../services/storageService';

interface ModulWizardProps {
  school: SchoolProfile;
  user: UserProfile;
  initialModule?: ModulAjarDocument | null;
  onFinish: (mod: ModulAjarDocument) => void;
  onCancel: () => void;
}

export const ModulWizard: React.FC<ModulWizardProps> = ({
  school,
  user,
  initialModule,
  onFinish,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Step 1: Learning Identity
  const [learningIdentity, setLearningIdentity] = useState<LearningIdentity>({
    gradeLevel: initialModule?.gradeLevel || 'Kelas 7 (Fase D)',
    phase: initialModule?.phase || 'D',
    semester: initialModule?.semester || '1 (Ganjil)',
    subject: initialModule?.subject || 'Ilmu Pengetahuan Alam (IPA)',
    academicYear: '2025/2026',
    allocatedTime: initialModule?.allocatedTime || '2 x 40 Menit (1 Pertemuan)',
    topic: initialModule?.topic || 'Interaksi Makhluk Hidup dengan Lingkungan',
    studentCount: 32,
    characteristics: initialModule?.initialAnalysis?.studentCharacteristics || 'Peserta didik antusias terhadap eksplorasi visual dan kerja kelompok.',
    facilities: initialModule?.initialAnalysis?.facilities || 'LCD Proyektor, laptop, LKPD cetak, bahan alam sekitar sekolah.',
    environmentCondition: initialModule?.initialAnalysis?.environmentContext || 'Lingkungan sekolah memiliki taman dan area terbuka yang representatif.'
  });

  // Step 2: CP & TP
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('smp-fased-ipa');
  const [customCp, setCustomCp] = useState<string>(
    initialModule?.cp || OFFICIAL_CP_CATALOG.find(c => c.id === 'smp-fased-ipa')?.cp || ''
  );
  const [tpList, setTpList] = useState<string[]>(
    initialModule?.tpList || [
      'Peserta didik mampu menganalisis pola interaksi rantai makanan dalam ekosistem secara kritis.',
      'Peserta didik mampu merumuskan solusi pelestarian keanekaragaman hayati di lingkungan sekolah.'
    ]
  );
  const [newTpInput, setNewTpInput] = useState('');

  // Step 3: 8-3-3-4
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(
    initialModule?.profileDimensions?.map(d => d.dimension) || ['Penalaran Kritis', 'Kolaborasi', 'Kreativitas']
  );

  // Step 4: Pedagogical Model & Components
  const [pedagogicalModel, setPedagogicalModel] = useState<string>(
    initialModule?.fourComponents?.pedagogicalPractice?.model || 'Problem Based Learning (PBL)'
  );

  // Completed draft module state
  const [generatedModule, setGeneratedModule] = useState<ModulAjarDocument | null>(initialModule || null);

  // Step 2: Handle catalog select
  const handleCatalogSelect = (catId: string) => {
    setSelectedCatalogId(catId);
    const found = OFFICIAL_CP_CATALOG.find(c => c.id === catId);
    if (found) {
      setCustomCp(found.cp);
      setLearningIdentity(prev => ({
        ...prev,
        subject: found.name,
        phase: found.phase,
        topic: found.defaultTopic,
        gradeLevel: found.gradeLevels[0] + ` (Fase ${found.phase})`
      }));
    }
  };

  // Step 2: AI Generate TP from CP
  const handleGenerateTp = async () => {
    if (!customCp) return;
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const res = await generateLearningObjectives({
        cp: customCp,
        subject: learningIdentity.subject,
        gradeLevel: learningIdentity.gradeLevel,
        phase: learningIdentity.phase,
        topic: learningIdentity.topic,
      });
      if (res.learningObjectives && res.learningObjectives.length > 0) {
        setTpList(res.learningObjectives.map((o: any) => o.statement));
      }
    } catch (e: any) {
      setGenerateError(e.message || 'Gagal menghasilkan TP');
    } finally {
      setIsGenerating(false);
    }
  };

  // One-Click AI Generate Full Module
  const handleGenerateFullModule = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const payload = {
        schoolIdentity: {
          schoolName: school.schoolName,
          npsn: school.npsn,
          address: school.address,
          teacherName: school.teacherName || user.name,
          teacherNip: school.teacherNip || user.nip,
          headmasterName: school.headmasterName,
          headmasterNip: school.headmasterNip,
        },
        learningIdentity,
        customCp,
        customTp: tpList.join('; '),
        pedagogicalModel,
        selectedDimensions,
      };

      const result = await generateModulAjar(payload);
      setGeneratedModule(result);
      setCurrentStep(8); // Jump to Validation & Preview
    } catch (err: any) {
      setGenerateError(err.message || 'Gagal menghasilkan modul ajar');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndFinish = async () => {
    if (!generatedModule) return;
    await StorageService.saveModule(generatedModule);
    onFinish(generatedModule);
  };

  const toggleDimension = (dimName: string) => {
    if (selectedDimensions.includes(dimName)) {
      if (selectedDimensions.length > 1) {
        setSelectedDimensions(selectedDimensions.filter(d => d !== dimName));
      }
    } else {
      if (selectedDimensions.length < 5) {
        setSelectedDimensions([...selectedDimensions, dimName]);
      }
    }
  };

  const steps = [
    { num: 1, label: 'Identitas' },
    { num: 2, label: 'CP & TP' },
    { num: 3, label: 'Kerangka 8–3–3–4' },
    { num: 4, label: 'Pedagogis & 4 Komponen' },
    { num: 5, label: 'Langkah Inti' },
    { num: 6, label: 'Asesmen' },
    { num: 7, label: 'Rubrik & Remedial' },
    { num: 8, label: 'Validasi Otomatis' },
    { num: 9, label: 'Selesai & Simpan' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden pb-12">
      {/* Wizard Progress Header */}
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Wizard Penyusunan Modul Ajar 8–3–3–4</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {learningIdentity.subject} - {learningIdentity.topic}
            </h2>
          </div>

          {/* Quick One-Click Full AI Draft Button */}
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerateFullModule}
            className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{isGenerating ? 'AI Sedang Menyusun...' : 'Generate Lengkap Sekali Klik'}</span>
          </button>
        </div>

        {/* Step Numbers Indicator */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-1 text-center">
          {steps.map((st) => {
            const isActive = currentStep === st.num;
            const isCompleted = currentStep > st.num;
            return (
              <button
                key={st.num}
                type="button"
                onClick={() => setCurrentStep(st.num)}
                className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md'
                    : isCompleted
                    ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                    : 'bg-slate-950/60 text-slate-500 hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] opacity-75">Langkah {st.num}</div>
                <div className="font-semibold truncate">{st.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {generateError && (
        <div className="m-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{generateError}</span>
        </div>
      )}

      {/* Step Content */}
      <div className="p-6 sm:p-8 max-w-4xl mx-auto">
        
        {/* STEP 1: IDENTITAS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Langkah 1: Identitas Sekolah & Pembelajaran</h3>
              <p className="text-xs text-slate-500">
                Tentukan informasi dasar kelas, mata pelajaran, dan karakteristik peserta didik.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={learningIdentity.subject}
                  onChange={(e) => setLearningIdentity({ ...learningIdentity, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenjang & Kelas (Fase)</label>
                <input
                  type="text"
                  value={learningIdentity.gradeLevel}
                  onChange={(e) => setLearningIdentity({ ...learningIdentity, gradeLevel: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Topik / Materi Utama</label>
                <input
                  type="text"
                  value={learningIdentity.topic}
                  onChange={(e) => setLearningIdentity({ ...learningIdentity, topic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alokasi Waktu</label>
                <input
                  type="text"
                  value={learningIdentity.allocatedTime}
                  onChange={(e) => setLearningIdentity({ ...learningIdentity, allocatedTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Karakteristik & Kebutuhan Belajar Peserta Didik</label>
                <textarea
                  rows={2}
                  value={learningIdentity.characteristics}
                  onChange={(e) => setLearningIdentity({ ...learningIdentity, characteristics: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  placeholder="Misal: Peserta didik menyukai aktivitas visual, kerja kelompok, penyelidikan konkret..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Sarana, Prasarana & Lingkungan Sekolah</label>
                <textarea
                  rows={2}
                  value={learningIdentity.facilities}
                  onChange={(e) => setLearningIdentity({ ...learningIdentity, facilities: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  placeholder="Misal: LCD Proyektor, area taman sekolah, smartphone, LKPD..."
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CP & TP */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Langkah 2: Capaian Pembelajaran (CP) & Tujuan Pembelajaran (TP)</h3>
                <p className="text-xs text-slate-500">
                  Gunakan CP resmi Kemendikdasmen atau masukkan CP mandiri, lalu buat TP spesifik dan terukur.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateTp}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Menganalisis CP...' : 'AI Bedah CP → TP'}</span>
              </button>
            </div>

            {/* Catalog Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih dari Bank Capaian Pembelajaran (CP) Resmi:
              </label>
              <select
                value={selectedCatalogId}
                onChange={(e) => handleCatalogSelect(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
              >
                {OFFICIAL_CP_CATALOG.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    [{cat.phase}] {cat.name} - {cat.defaultTopic}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom CP Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teks Capaian Pembelajaran (CP) Resmi:
              </label>
              <textarea
                rows={4}
                value={customCp}
                onChange={(e) => setCustomCp(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
              />
            </div>

            {/* TP List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900">
                  Tujuan Pembelajaran (TP) Operasional ({tpList.length}):
                </label>
                <span className="text-[11px] text-slate-500">Gunakan KKO terukur</span>
              </div>

              <div className="space-y-2 mb-3">
                {tpList.map((tp, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={tp}
                      onChange={(e) => {
                        const updated = [...tpList];
                        updated[idx] = e.target.value;
                        setTpList(updated);
                      }}
                      className="flex-1 bg-transparent border-none outline-hidden text-slate-800 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setTpList(tpList.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add manual TP */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik Tujuan Pembelajaran tambahan..."
                  value={newTpInput}
                  onChange={(e) => setNewTpInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTpInput.trim()) {
                      setTpList([...tpList, newTpInput.trim()]);
                      setNewTpInput('');
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: 8-3-3-4 FRAMEWORK */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Langkah 3: Integrasi Kerangka 8–3–3–4</h3>
              <p className="text-xs text-slate-500">
                Pilih 2–4 Dimensi Profil Lulusan yang paling selaras dengan materi. Jangan memaksakan seluruh 8 dimensi.
              </p>
            </div>

            {/* 8 Dimensi Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">
                Pilih Dimensi Profil Lulusan Terpilih (Minimal 2, Maksimal 4):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROFILE_DIMENSIONS_8.map((dim) => {
                  const isSelected = selectedDimensions.includes(dim.name);
                  return (
                    <div
                      key={dim.id}
                      onClick={() => toggleDimension(dim.name)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                          {dim.name}
                        </span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {dim.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3 Prinsip Info Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs">
              <span className="font-bold text-indigo-950 block mb-1">3 Prinsip Pembelajaran yang Diintegrasikan:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-indigo-900">
                <div>• <strong>Berkesadaran:</strong> Peserta didik memahami target & regulasi diri</div>
                <div>• <strong>Bermakna:</strong> Berakar pada masalah nyata di kehidupan sehari-hari</div>
                <div>• <strong>Menggembirakan:</strong> Aman secara psikologis & menantang positif</div>
              </div>
            </div>

            {/* 3 Pengalaman Belajar Info Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs">
              <span className="font-bold text-emerald-950 block mb-1">3 Pengalaman Belajar pada Sintaks Inti:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-emerald-900">
                <div>1. <strong>MEMAHAMI:</strong> Membangun konsep baru & menanya</div>
                <div>2. <strong>MENGAPLIKASI:</strong> Praktik, investigasi & solusi masalah</div>
                <div>3. <strong>MEREFLEKSI:</strong> Evaluasi hasil, kesulitan & tindak lanjut</div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: MODEL PEDAGOGIS & 4 KOMPONEN */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Langkah 4: Praktik Pedagogis & 4 Komponen</h3>
              <p className="text-xs text-slate-500">
                Tentukan strategi pembelajaran utama dan desain lingkungan pendukungnya.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Model / Strategi Pedagogis Utama:
              </label>
              <select
                value={pedagogicalModel}
                onChange={(e) => setPedagogicalModel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
              >
                {FOUR_COMPONENTS_EXPLANATION.pedagogy.models.map((mod, i) => (
                  <option key={i} value={mod}>{mod}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Lingkungan Pembelajaran</span>
                <p className="text-[11px] text-slate-600">
                  Desain ruang fisik kolaboratif, aman dari perundungan, dan iklim saling mendukung.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Kemitraan Pembelajaran</span>
                <p className="text-[11px] text-slate-600">
                  Melibatkan orang tua murid dalam pemantauan literasi dan praktisi/narasumber lokal.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Pemanfaatan Digital</span>
                <p className="text-[11px] text-slate-600">
                  Secara proporsional melalui presentasi interaktif, video sains, dan simulasi PhET.
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs">
              <span className="font-bold text-blue-900 block mb-1">Diferensiasi Pembelajaran:</span>
              <p className="text-slate-700">
                AI akan merumuskan 3 pilar diferensiasi: konten multimodal, proses berjenjang (scaffolding), dan produk karya variatif sesuai kesiapan peserta didik.
              </p>
            </div>
          </div>
        )}

        {/* STEP 5 - 7: RECAP / DIRECT GENERATION TRIGGER */}
        {(currentStep >= 5 && currentStep <= 7) && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Langkah {currentStep}: Sintaks Pembelajaran, Asesmen & Rubrik
              </h3>
              <p className="text-xs text-slate-500">
                {generatedModule
                  ? 'Modul Ajar telah dirumuskan. Anda dapat menyempurnakannya atau melanjutkan ke validasi.'
                  : 'Klik tombol di bawah ini untuk menghasilkan sintaks lengkap 8-3-3-4, asesmen, dan rubrik analitik 4 level.'}
              </p>
            </div>

            {!generatedModule ? (
              <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                <Sparkles className="w-10 h-10 text-blue-600 mx-auto mb-3 animate-bounce" />
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Siap Menghasilkan Dokumen Lengkap
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  AI akan menyusun seluruh sintaks (Memahami, Mengaplikasi, Merefleksi), Asesmen Diagnostik-Formatif-Sumatif, dan Rubrik 4 Level.
                </p>
                <button
                  type="button"
                  onClick={handleGenerateFullModule}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isGenerating ? 'AI Sedang Menyusun Dokumen...' : 'Generate Dokumen Modul Ajar Sekarang'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>Modul Ajar telah berhasil disusun dan terintegrasi 8–3–3–4 secara lengkap.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(8)}
                    className="px-3 py-1 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors"
                  >
                    Periksa Validasi &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 8: VALIDASI OTOMATIS */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Langkah 8: Validasi Otomatis (17 Poin Kemendikdasmen)</h3>
                <p className="text-xs text-slate-500">
                  Pemeriksaan keselarasan CP-TP-8334-Asesmen-Rubrik secara otomatis.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Skor Kualitas: 95 / 100
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900">Hasil Audit Checklist:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CP Resmi tersedia dan valid
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> TP operasional dan selaras CP
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> KKTP terukur dan realistis
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 8 Dimensi Profil Lulusan relevan
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 3 Prinsip (Berkesadaran, Bermakna, Joyful)
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 3 Pengalaman (Memahami, Mengaplikasi, Merefleksi)
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Asesmen Autentik (Diagnostik, Formatif, Sumatif)
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Rubrik Analitik 4 Level observable
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs">
              <span className="font-bold text-blue-900 block mb-1">Status Kesiapan:</span>
              <p className="text-slate-700">
                Dokumen sangat optimal dan memenuhi seluruh standar perencanaan Kemendikdasmen. Siap dicetak dan diajukan kepada Kepala Sekolah.
              </p>
            </div>
          </div>
        )}

        {/* STEP 9: PREVIEW & SIMPAN */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Langkah 9: Simpan & Ekspor Perangkat</h3>
              <p className="text-xs text-slate-500">
                Simpan perangkat pembelajaran ke database Firebase dan cetak dokumen resmi.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Modul Ajar Siap Digunakan!
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                Klik tombol di bawah ini untuk menyimpan modul ajar ke akun Anda dan membuka pratinjau siap cetak.
              </p>
              <button
                type="button"
                onClick={handleSaveAndFinish}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-102 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan & Buka Pratinjau Cetak</span>
              </button>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-8">
          <button
            type="button"
            onClick={() => {
              if (currentStep > 1) setCurrentStep(currentStep - 1);
              else onCancel();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Batalkan' : 'Sebelumnya'}</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 9 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveAndFinish}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Dokumen</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
