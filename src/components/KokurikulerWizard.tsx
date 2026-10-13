import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
  BookOpen,
  Plus,
  Trash2,
  Clock,
  Layers,
  Wand2,
  Award,
  Lightbulb,
  Check,
  RefreshCw,
  FileText,
  Printer,
  Download,
  Copy,
  Users
} from 'lucide-react';
import { KokurikulerProgramDocument, SchoolProfile, UserProfile } from '../types';
import {
  KOKURIKULER_PHASES,
  KOKURIKULER_THEMES,
  STANDARD_SUBJECTS,
  PROFILE_DIMENSIONS_8
} from '../data/kurikulumData';
import {
  generateKokurikuler,
  generateSubjectContributions,
  generateKokurikulerContextAndProduct
} from '../services/apiService';
import { StorageService } from '../services/storageService';

interface KokurikulerWizardProps {
  school: SchoolProfile;
  user: UserProfile;
  onFinish: (program: KokurikulerProgramDocument) => void;
  onCancel: () => void;
}

export const KokurikulerWizard: React.FC<KokurikulerWizardProps> = ({
  school,
  user,
  onFinish,
  onCancel,
}) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [loadingSubject, setLoadingSubject] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // ==========================================
  // ALUR 1: FASE & TEMA KOKURIKULER
  // ==========================================
  const [selectedPhaseId, setSelectedPhaseId] = useState('D');
  const [selectedThemeId, setSelectedThemeId] = useState('t1'); // Gaya Hidup Berkelanjutan
  const [customThemeText, setCustomThemeText] = useState('');

  // ==========================================
  // ALUR 2: MAPEL TERINTEGRASI & KONTRIBUSI (AI)
  // ==========================================
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'IPAS / IPA',
    'Bahasa Indonesia',
    'Pendidikan Pancasila',
    'Prakarya'
  ]);
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [subjectContributions, setSubjectContributions] = useState<{ subject: string; contribution: string }[]>([
    { subject: 'IPAS / IPA', contribution: 'Penyelidikan sifat sampah organik dan anorganik serta rancangan pengomposan aerobik.' },
    { subject: 'Bahasa Indonesia', contribution: 'Penyusunan naskah narasi poster kampanye edukasi dan laporan refleksi mingguan.' },
    { subject: 'Pendidikan Pancasila', contribution: 'Penanaman nilai tanggung jawab sosial warga sekolah dan gotong royong memilah sampah.' },
    { subject: 'Prakarya', contribution: 'Perancangan dan pembuatan produk kreasi daur ulang (upcycling) bernilai guna.' }
  ]);

  // ==========================================
  // ALUR 3: TUJUAN, MASALAH KONTEKS & PRODUK AKHIR (AI)
  // ==========================================
  const [topic, setTopic] = useState('Pengelolaan Sampah Mandiri dan Gaya Hidup Minim Sampah di Sekolah');
  const [problemContext, setProblemContext] = useState(
    'Banyaknya timbulan sampah kemasan plastik sekali pakai di kantin dan minimnya pembiasaan memilah sampah organik dan anorganik oleh peserta didik.'
  );
  const [objectives, setObjectives] = useState<string[]>([
    'Membangun kesadaran kritis peserta didik mengenai dampak limbah terhadap lingkungan hidup.',
    'Melatih keterampilan kolaboratif dalam merancang karya daur ulang fungsional.',
    'Membiasakan aksi nyata ramah lingkungan dan gotong royong dalam kehidupan sehari-hari.'
  ]);
  const [newObjectiveInput, setNewObjectiveInput] = useState('');
  const [finalProduct, setFinalProduct] = useState(
    'Produk kerajinan fungsional daur ulang (ecobrick/kompos), poster kampanye digital, dan stand Gelar Karya pameran kokurikuler.'
  );

  // AI suggestions drawer in Step 3
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  // ==========================================
  // ALUR 4: MEMILIH 8 DIMENSI PROFIL LULUSAN
  // ==========================================
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([
    'Penalaran Kritis',
    'Kolaborasi',
    'Kreativitas',
    'Kemandirian'
  ]);

  // ==========================================
  // ALUR 5: ALOKASI JP & JUMLAH PERTEMUAN (SINKRON FASE)
  // ==========================================
  const currentPhaseObj = KOKURIKULER_PHASES.find(p => p.id === selectedPhaseId) || KOKURIKULER_PHASES[4];
  const [totalJp, setTotalJp] = useState<number>(currentPhaseObj.recJp);
  const [meetingCount, setMeetingCount] = useState<number>(currentPhaseObj.recMeetings);
  const [partners, setPartners] = useState('Komite Sekolah, Dinas Lingkungan Hidup, Komunitas Bank Sampah');
  const [facilities, setFacilities] = useState('Area taman sekolah, proyektor, kantong pilah sampah, bahan daur ulang');

  // ==========================================
  // ALUR 6: DOKUMEN HASIL LENGKAP & ASESMEN/RUBRIK
  // ==========================================
  const [generatedResult, setGeneratedResult] = useState<KokurikulerProgramDocument | null>(null);

  // Update recommendations when phase changes
  const handlePhaseChange = (phaseId: string) => {
    setSelectedPhaseId(phaseId);
    const p = KOKURIKULER_PHASES.find(item => item.id === phaseId);
    if (p) {
      setTotalJp(p.recJp);
      setMeetingCount(p.recMeetings);
    }
  };

  const getEffectiveTheme = () => {
    if (selectedThemeId === 't_custom') {
      return customThemeText.trim() ? customThemeText.trim() : 'Tema Kustom Satuan Pendidikan';
    }
    const found = KOKURIKULER_THEMES.find(t => t.id === selectedThemeId);
    return found ? found.name : 'Gaya Hidup Berkelanjutan';
  };

  // Reset JP & Pertemuan to standard recommendation
  const handleSyncToRecommendedJp = () => {
    setTotalJp(currentPhaseObj.recJp);
    setMeetingCount(currentPhaseObj.recMeetings);
  };

  // Step 2: Toggle subject selection
  const handleToggleSubject = (subjectName: string) => {
    if (selectedSubjects.includes(subjectName)) {
      if (selectedSubjects.length <= 1) return;
      setSelectedSubjects(selectedSubjects.filter(s => s !== subjectName));
      setSubjectContributions(subjectContributions.filter(sc => sc.subject !== subjectName));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectName]);
      setSubjectContributions([
        ...subjectContributions,
        {
          subject: subjectName,
          contribution: `Mata pelajaran ${subjectName} berkontribusi dalam mendukung eksplorasi, penerapan konsep, atau pembuatan produk pada tema ${getEffectiveTheme()}.`
        }
      ]);
    }
  };

  // Step 2: Bulk AI Generate Subject Contributions
  const handleAiGenerateSubjectContributions = async () => {
    setIsAiLoading(true);
    setErrorMsg(null);
    try {
      const res = await generateSubjectContributions({
        phase: selectedPhaseId,
        theme: getEffectiveTheme(),
        topic: topic || `Proyek Kokurikuler Tema ${getEffectiveTheme()}`,
        subjects: selectedSubjects,
        gradeLevel: currentPhaseObj.defaultGrade
      });
      if (res.contributions && res.contributions.length > 0) {
        setSubjectContributions(res.contributions);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Gagal menghasilkan kontribusi mapel dengan AI');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Step 2: Single Subject AI Generator
  const handleAiGenerateSingleSubject = async (subjectName: string) => {
    setLoadingSubject(subjectName);
    setErrorMsg(null);
    try {
      const res = await generateSubjectContributions({
        phase: selectedPhaseId,
        theme: getEffectiveTheme(),
        topic: topic || `Proyek Kokurikuler Tema ${getEffectiveTheme()}`,
        subjects: [subjectName],
        gradeLevel: currentPhaseObj.defaultGrade
      });
      if (res.contributions && res.contributions.length > 0) {
        const generatedContrib = res.contributions[0].contribution;
        setSubjectContributions(prev =>
          prev.map(sc => sc.subject === subjectName ? { ...sc, contribution: generatedContrib } : sc)
        );
      }
    } catch (e: any) {
      setErrorMsg(e.message || `Gagal menghasilkan ide untuk ${subjectName}`);
    } finally {
      setLoadingSubject(null);
    }
  };

  // Step 3: AI Generate Context, Objectives & Final Product Ideas
  const handleAiGenerateContextAndProduct = async () => {
    setIsAiLoading(true);
    setErrorMsg(null);
    try {
      const res = await generateKokurikulerContextAndProduct({
        phase: selectedPhaseId,
        theme: getEffectiveTheme(),
        gradeLevel: currentPhaseObj.defaultGrade,
        customTheme: selectedThemeId === 't_custom' ? customThemeText : undefined
      });
      setAiSuggestions(res);
      if (res.problemContext) setProblemContext(res.problemContext);
      if (res.objectives && res.objectives.length > 0) setObjectives(res.objectives);
      if (res.suggestedTopics && res.suggestedTopics.length > 0) setTopic(res.suggestedTopics[0].topic);
      if (res.finalProducts && res.finalProducts.length > 0) {
        setFinalProduct(`${res.finalProducts[0].productName}: ${res.finalProducts[0].description} (${res.finalProducts[0].utility})`);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Gagal menghasilkan ide konteks dengan AI');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Step 4: Toggle 8 Dimensions
  const handleToggleDimension = (dimName: string) => {
    if (selectedDimensions.includes(dimName)) {
      if (selectedDimensions.length > 1) {
        setSelectedDimensions(selectedDimensions.filter(d => d !== dimName));
      }
    } else {
      setSelectedDimensions([...selectedDimensions, dimName]);
    }
  };

  // Step 6: Generate Full Document with Assessments & Rubrics
  const handleGenerateFullKokurikuler = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const payload = {
        schoolName: school.schoolName || 'Satuan Pendidikan',
        phase: selectedPhaseId,
        gradeLevel: currentPhaseObj.defaultGrade,
        academicYear: '2025/2026',
        theme: getEffectiveTheme(),
        topic,
        problemContext,
        objectives,
        finalProduct,
        subjectContributions,
        selectedDimensions,
        totalJp,
        meetingCount,
        partners,
        facilities
      };

      const result = await generateKokurikuler(payload);
      setGeneratedResult(result);
      setStep(6);
    } catch (e: any) {
      setErrorMsg(e.message || 'Gagal menghasilkan dokumen kokurikuler lengkap');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProgram = async () => {
    if (!generatedResult) return;
    await StorageService.saveKokurikulerProgram(generatedResult);
    onFinish(generatedResult);
  };

  const handleCopyText = () => {
    if (!generatedResult) return;
    const schoolNameStr = generatedResult.schoolName || school.schoolName || 'Satuan Pendidikan';
    const gradeFaseStr = `${generatedResult.gradeLevel || 'Kelas V'} / ${generatedResult.phase || selectedPhaseId || 'Fase C'}`;
    const stagesListStr = generatedResult.pedagogicalPractice?.stages || ['Pengenalan', 'Kontekstualisasi', 'Aksi', 'Refleksi', 'Tindak lanjut'];

    const fullText = `
${(generatedResult.title || 'PERENCANAAN PEMBELAJARAN KOKURIKULER').toUpperCase()}

Nama satuan pendidikan : ${schoolNameStr}
Kelas / Fase           : ${gradeFaseStr}
Bentuk                 : ${generatedResult.form || 'Kolaboratif Lintas Disiplin Ilmu'}
Alokasi Waktu          : ${generatedResult.allocatedTime || `${totalJp} JP`}
Lokasi Kegiatan        : ${generatedResult.location || 'Lingkungan satuan pendidikan, lingkungan rumah, dan tempat mitra terkait'}

A. Deskripsi Kokurikuler
${generatedResult.background}

B. Dimensi Profil Lulusan
${generatedResult.profileDimensions?.map((d, i) => `${i + 1}. ${d.dimension}`).join('\n') || ''}

C. Tujuan Pembelajaran
${generatedResult.objectives?.map((o, i) => `${i + 1}. ${o}`).join('\n') || ''}

D. Praktik Pedagogis
Praktik pedagogis dalam perencanaan ini menggunakan pembelajaran berbasis projek dengan tahapan sebagai berikut:
[ ${stagesListStr.join(' ] ➔ [ ')} ]

${generatedResult.pedagogicalPractice?.description || 'Tahap pembelajaran diawali dengan pengenalan, di mana murid diajak mengenali permasalahan atau tema secara mendalam. Selanjutnya, pada tahap kontekstualisasi, Murid menggali permasalahan di lingkungan sekitar melalui kegiatan berbasis penyelidikan. Hasil dari tahap ini menjadi dasar bagi aksi, yaitu perumusan peran dan pelaksanaan aksi nyata. Tahap berikutnya adalah refleksi, yang bertujuan mengevaluasi dan berbagi hasil aksi. Proses diakhiri dengan tindak lanjut, yakni penyusunan langkah strategis berdasarkan hasil refleksi untuk pengembangan kegiatan selanjutnya.'}

E. Lingkungan Pembelajaran
${generatedResult.learningEnvironment?.description || 'Lingkungan pembelajaran dalam kokurikuler ini dirancang untuk membangun budaya belajar kolaboratif, bernalar kritis, komunikatif, reflektif, dan eksploratif dalam memecahkan masalah nyata, sekaligus membiasakan sikap empati, inklusif, nyaman, serta saling menghargai.'}

F. Kemitraan Pembelajaran
${(generatedResult.learningPartnerships?.partners || [
  'Petugas kebersihan satuan pendidikan, dilibatkan dalam kegiatan penyelidikan (narasumber wawancara).',
  'Dinas Lingkungan Hidup / Instansi Pembina terkait, dilibatkan dalam sharing session pada tahap refleksi.',
  'Orang tua murid, dilibatkan saat proses penyelidikan di rumah dan saat kegiatan sosialisasi.',
  'Pegiat lingkungan / tokoh masyarakat setempat, dilibatkan menjadi narasumber.',
  'Narasumber ahli pembuatan media kreatif/kreator konten, dilibatkan dalam kegiatan lokakarya pembuatan media kreatif.'
]).map((p, i) => `${i + 1}. ${p}`).join('\n')}
Catatan: ${generatedResult.learningPartnerships?.note || 'Apabila tidak memungkinkan menghadirkan narasumber dari luar, maka peran tersebut dapat digantikan oleh pendidik.'}

G. Pemanfaatan Digital
${(generatedResult.digitalUtilization || [
  'Pencarian data melalui internet',
  'Ruang rapat virtual (Zoom Meeting atau Google Meet)',
  'Pembuatan media kreatif menggunakan aplikasi desain grafis dan video editing seperti Canva, Capcut, Kinemaster, dan lainnya',
  'Presentasi hasil projek dengan aplikasi bahan tayang seperti PowerPoint, Google Slides, dan Canva'
]).map((d, i) => `${i + 1}. ${d}`).join('\n')}

H. Kegiatan Pembelajaran
Alur dan aktivitas dalam perencanaan ini bersifat referensi. Satuan pendidikan perlu menyesuaikan dengan konteks, kebutuhan, dan ketersediaan sarana pendukung.

I. Asesmen Pembelajaran
Rubrik untuk kegiatan asesmen formatif dan sumatif mengacu pada dokumen Alur Perkembangan Kompetensi Dimensi Profil Lulusan (DPL).
Catatan: Rubrik asesmen formatif dan sumatif berikut dapat dimodifikasi sesuai kebutuhan satuan pendidikan masing-masing.

${(generatedResult.dimensionAssessments || generatedResult.profileDimensions?.map(pd => ({
  dimension: pd.dimension,
  assessments: [
    {
      title: 'Asesmen Formatif (Aktivitas Penyelidikan)',
      skillAssessed: `Kemampuan mengidentifikasi permasalahan secara kritis pada dimensi ${pd.dimension}`,
      berkembang: 'Menunjukkan indikator pada tahap awal, informasi yang dikemukakan masih terbatas.',
      cakap: 'Mampu menunjukkan karakter secara kontekstual, data terstruktur dengan baik.',
      mahir: 'Sangat konsisten, analisis mendalam, orisinal, dan berbasis bukti akurat.'
    }
  ]
})) || []).map(dg => `
Dimensi Profil Lulusan: ${dg.dimension}
${dg.assessments?.map(as => `
- ${as.title}
Kemampuan yang dinilai: ${as.skillAssessed}
* Berkembang : ${as.berkembang}
* Cakap      : ${as.cakap}
* Mahir      : ${as.mahir}
`).join('\n')}
`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stepsHeader = [
    { num: 1, label: 'Fase & Tema' },
    { num: 2, label: 'Mapel & Kontribusi' },
    { num: 3, label: 'Masalah, Tujuan & Produk' },
    { num: 4, label: '8 Dimensi Profil' },
    { num: 5, label: 'Alokasi JP & Jadwal' },
    { num: 6, label: 'Dokumen & Rubrik Dimensi' }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden pb-12">
      {/* Top Header */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 border-b border-emerald-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-300" />
              <span>Sistem Rancang Program Kokurikuler Lintas Mata Pelajaran</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{getEffectiveTheme()}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-700/80 text-emerald-100 font-semibold">
                Fase {selectedPhaseId}
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Alur 6 Langkah Sistematis Kemendikdasmen: Sinkronisasi Lintas Mapel, 8 Dimensi & Rubrik Analitik 4 Level
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateFullKokurikuler}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{isGenerating ? 'AI Sedang Menyusun Dokumen...' : 'Generate Dokumen Kokurikuler'}</span>
            </button>
          </div>
        </div>

        {/* Steps Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
          {stepsHeader.map((st) => {
            const isActive = step === st.num;
            const isDone = step > st.num;
            return (
              <button
                key={st.num}
                type="button"
                onClick={() => setStep(st.num)}
                className={`p-2.5 rounded-xl text-xs transition-all cursor-pointer text-left sm:text-center ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/40 ring-2 ring-emerald-400'
                    : isDone
                    ? 'bg-slate-800 text-emerald-300 hover:bg-slate-750'
                    : 'bg-slate-950/60 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between sm:justify-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    Alur {st.num}
                  </span>
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </div>
                <div className="font-semibold truncate text-[11px] mt-0.5">{st.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {errorMsg && (
        <div className="m-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-rose-600 hover:text-rose-800 text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 max-w-4xl mx-auto">

        {/* ===================================================
            ALUR 1: PILIH FASE DAN TEMA KOKURIKULER
           =================================================== */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Alur 1: Pilih Fase dan Tema Kokurikuler
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tentukan fase sasaran dan pilih salah satu tema resmi (Gaya Hidup Berkelanjutan, Kewirausahaan, Kearifan Lokal, Hidup Sehat, Lingkungan Sekolah, Budaya Indonesia, Teknologi & Literasi Digital, Kebersamaan, Kreativitas, Kemandirian) atau buat tema kustom sendiri.
                </p>
              </div>
            </div>

            {/* 1. Fase Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                1. Pilih Fase Satuan Pendidikan:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {KOKURIKULER_PHASES.map((p) => {
                  const isSelected = selectedPhaseId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePhaseChange(p.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="text-[10px] opacity-80">{p.defaultGrade}</div>
                      <div className="text-xs font-bold truncate">Fase {p.id}</div>
                      <div className={`text-[10px] mt-1 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                        Standar: {p.recJp} JP ({p.recMeetings} Pertemuan)
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Tema Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-800">
                  2. Pilih Tema Kokurikuler (Daftar Tema Resmi & Kustom):
                </label>
                <span className="text-[11px] text-emerald-800 font-semibold">
                  Tema Aktif: {getEffectiveTheme()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {KOKURIKULER_THEMES.map((th) => {
                  const isSelected = selectedThemeId === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => setSelectedThemeId(th.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                          {th.name}
                        </span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                          isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        {th.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Theme Box */}
            {selectedThemeId === 't_custom' && (
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-300 space-y-2">
                <label className="block text-xs font-bold text-emerald-950">
                  Tuliskan Tema Kustom Satuan Pendidikan Anda:
                </label>
                <input
                  type="text"
                  placeholder="Misal: Sekolah Sehat Bebas Sampah, Harmoni Kebersamaan Nusantara, dll."
                  value={customThemeText}
                  onChange={(e) => setCustomThemeText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                />
                <p className="text-[11px] text-slate-500">
                  Tema ini akan digunakan oleh AI untuk menyusun seluruh ide kontribusi mapel, masalah konteks, tujuan, produk, dan rubrik penilaian.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===================================================
            ALUR 2: MAPEL TERINTEGRASI & KONTRIBUSI (DENGAN AI)
           =================================================== */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  Alur 2: Memilih Mata Pelajaran Terintegrasi & Menuliskan Kontribusinya
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pilih mapel yang berkolaborasi dengan tema <strong>{getEffectiveTheme()}</strong> pada <strong>Fase {selectedPhaseId}</strong>, lalu gunakan AI untuk merumuskan kontribusi konkret tiap mapel.
                </p>
              </div>

              {/* AI Bulk Generator Button */}
              <button
                type="button"
                disabled={isAiLoading || selectedSubjects.length === 0}
                onClick={handleAiGenerateSubjectContributions}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isAiLoading ? 'AI Merumuskan Kontribusi...' : 'Generate Ide Kontribusi Semua Mapel (AI)'}</span>
              </button>
            </div>

            {/* Theme & Phase Badge */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
              <div>
                Tema: <strong>{getEffectiveTheme()}</strong> • Sasaran: <strong>Fase {selectedPhaseId} ({currentPhaseObj.defaultGrade})</strong>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">
                {selectedSubjects.length} Mata Pelajaran Terpilih
              </span>
            </div>

            {/* Subject Selector Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Pilih Mata Pelajaran yang Terintegrasi:
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {STANDARD_SUBJECTS.map((sub) => {
                  const isChecked = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => handleToggleSubject(sub)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked && '✓ '}
                      {sub}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Subject */}
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="Tambah mata pelajaran lain..."
                  value={customSubjectInput}
                  onChange={(e) => setCustomSubjectInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customSubjectInput.trim()) {
                      handleToggleSubject(customSubjectInput.trim());
                      setCustomSubjectInput('');
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Tambah Mapel
                </button>
              </div>
            </div>

            {/* Detailed Contributions Form */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900">
                  Uraian Kontribusi Nyata Tiap Mata Pelajaran ({selectedSubjects.length} Mapel):
                </label>
                <span className="text-[11px] text-slate-500">
                  Klik tombol ✨ AI pada tiap mapel jika ingin meminta ide per mapel
                </span>
              </div>

              <div className="space-y-3">
                {subjectContributions.map((sc, idx) => (
                  <div key={sc.subject} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-emerald-950">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                        {sc.subject}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={loadingSubject === sc.subject}
                          onClick={() => handleAiGenerateSingleSubject(sc.subject)}
                          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>{loadingSubject === sc.subject ? 'Membuat ide...' : 'Bantuan Ide AI'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleSubject(sc.subject)}
                          className="text-slate-400 hover:text-rose-600 text-[11px]"
                          title="Hapus mapel ini"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={sc.contribution}
                      onChange={(e) => {
                        const updated = [...subjectContributions];
                        updated[idx].contribution = e.target.value;
                        setSubjectContributions(updated);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-hidden leading-relaxed font-normal"
                      placeholder={`Jelaskan kontribusi nyata ${sc.subject} terkait tema ${getEffectiveTheme()} untuk murid Fase ${selectedPhaseId}...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            ALUR 3: TUJUAN, MASALAH KONTEKS & RENCANA PRODUK AKHIR (AI)
           =================================================== */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  Alur 3: Menentukan Tujuan Program, Permasalahan Konteks & Rencana Produk Akhir
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dapatkan ide cepat dan mudah dengan bantuan AI untuk merumuskan masalah nyata di sekitar murid, tujuan pembelajaran terpadu, dan rencana produk akhir nyata.
                </p>
              </div>

              {/* AI Ideation Button */}
              <button
                type="button"
                disabled={isAiLoading}
                onClick={handleAiGenerateContextAndProduct}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                <span>{isAiLoading ? 'AI Menganalisis Ide...' : 'Bantuan Ide AI (Masalah, Tujuan & Produk)'}</span>
              </button>
            </div>

            {/* AI Suggestions Box (if available) */}
            {aiSuggestions && (
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-300 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    Pilihan Ide AI Terkait Tema {getEffectiveTheme()} (Klik untuk Terapkan):
                  </span>
                  <button
                    type="button"
                    onClick={() => setAiSuggestions(null)}
                    className="text-[10px] text-slate-400 hover:text-slate-600"
                  >
                    Tutup Saran
                  </button>
                </div>

                {/* Suggested Topics */}
                {aiSuggestions.suggestedTopics && (
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Rekomendasi Topik Kegiatan:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {aiSuggestions.suggestedTopics.map((st: any, i: number) => (
                        <div
                          key={i}
                          onClick={() => setTopic(st.topic)}
                          className="p-2.5 bg-white rounded-xl border border-emerald-200 hover:border-emerald-500 cursor-pointer transition-all hover:shadow-xs"
                        >
                          <strong className="text-emerald-900 block font-bold">{st.topic}</strong>
                          <span className="text-[10px] text-slate-500">{st.brief}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Final Products */}
                {aiSuggestions.finalProducts && (
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Rekomendasi Rencana Produk Akhir:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {aiSuggestions.finalProducts.map((fp: any, i: number) => (
                        <div
                          key={i}
                          onClick={() => setFinalProduct(`${fp.productName}: ${fp.description} (${fp.utility})`)}
                          className="p-2.5 bg-white rounded-xl border border-emerald-200 hover:border-emerald-500 cursor-pointer transition-all hover:shadow-xs"
                        >
                          <strong className="text-emerald-900 block font-bold">{fp.productName}</strong>
                          <span className="text-[10px] text-slate-500">{fp.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Form Inputs */}
            {/* 1. Topik */}
            <div className="space-y-1 text-xs">
              <label className="block font-bold text-slate-800">
                1. Topik Kegiatan Kokurikuler:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Pengelolaan Sampah Mandiri dan Gaya Hidup Minim Sampah"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
              />
            </div>

            {/* 2. Permasalahan Konteks */}
            <div className="space-y-1 text-xs">
              <label className="block font-bold text-slate-800">
                2. Permasalahan Konteks di Lingkungan Peserta Didik (Sesuai Tema & Fase):
              </label>
              <textarea
                rows={3}
                value={problemContext}
                onChange={(e) => setProblemContext(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden leading-relaxed"
                placeholder="Jelaskan permasalahan nyata di lingkungan sekolah atau masyarakat yang dihadapi peserta didik..."
              />
            </div>

            {/* 3. Rencana Produk Akhir */}
            <div className="space-y-1 text-xs">
              <label className="block font-bold text-slate-800">
                3. Rencana Produk Akhir Nyata (Bisa digunakan / dipamerkan pada Gelar Karya):
              </label>
              <textarea
                rows={2}
                value={finalProduct}
                onChange={(e) => setFinalProduct(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-hidden leading-relaxed font-medium text-emerald-950"
                placeholder="Contoh: Produk kerajinan daur ulang fungsional, buku saku panduan bergambar, stand pameran karya..."
              />
            </div>

            {/* 4. Tujuan Program */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-800">
                  4. Tujuan Program Kokurikuler:
                </label>
                <span className="text-[11px] text-slate-500">{objectives.length} Tujuan Dirumuskan</span>
              </div>

              <div className="space-y-2">
                {objectives.map((obj, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => {
                        const updated = [...objectives];
                        updated[i] = e.target.value;
                        setObjectives(updated);
                      }}
                      className="flex-1 bg-transparent border-none outline-hidden text-slate-800 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setObjectives(objectives.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-600"
                      title="Hapus tujuan ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Objective */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tambah tujuan program baru..."
                  value={newObjectiveInput}
                  onChange={(e) => setNewObjectiveInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newObjectiveInput.trim()) {
                      setObjectives([...objectives, newObjectiveInput.trim()]);
                      setNewObjectiveInput('');
                    }
                  }}
                  className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            ALUR 4: MEMILIH 8 DIMENSI PROFIL LULUSAN
           =================================================== */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                Alur 4: Memilih 8 Dimensi Profil Lulusan yang Diterapkan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih dimensi profil lulusan yang akan dibangun dalam program kokurikuler ini.
                <strong> Asesmen dan rubrik penilaian pada dokumen akhir (Alur 6) akan disusun secara presisi sesuai dengan dimensi yang Anda pilih di sini.</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {PROFILE_DIMENSIONS_8.map((dim) => {
                const isSelected = selectedDimensions.includes(dim.name);
                return (
                  <div
                    key={dim.id}
                    onClick={() => handleToggleDimension(dim.name)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-500 shadow-xs ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                        {dim.name}
                      </span>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug mb-2">
                      {dim.description}
                    </p>
                    <div className="text-[10px] text-emerald-800 font-medium">
                      Indikator Utama: {dim.indicators[0]}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Terpilih <strong>{selectedDimensions.length} Dimensi</strong>: {selectedDimensions.join(', ')}.
                </span>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold">
                Akan dibuat rubrik penilaian khusus
              </span>
            </div>
          </div>
        )}

        {/* ===================================================
            ALUR 5: JUMLAH JP & JUMLAH PERTEMUAN (SINKRON FASE & TEMA)
           =================================================== */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">5</span>
                  Alur 5: Isi Jumlah JP dan Jumlah Pertemuan (Sinkron Fase & Tema)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Alokasi waktu disinkronkan secara resmi dengan karakteristik proyek pada <strong>Fase {selectedPhaseId} ({currentPhaseObj.defaultGrade})</strong> dan tema <strong>{getEffectiveTheme()}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSyncToRecommendedJp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                title="Kembalikan ke standar rekomendasi Kemendikdasmen untuk fase ini"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sinkronkan ke Standar Fase</span>
              </button>
            </div>

            {/* Recommendation Banner */}
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <span className="font-bold block flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                Standar Rekomendasi Resmi Kemendikdasmen untuk Fase {selectedPhaseId}:
              </span>
              <p className="text-slate-700">
                Alokasi umum: <strong>{currentPhaseObj.recJp} Jam Pelajaran (JP)</strong> terbagi dalam <strong>{currentPhaseObj.recMeetings} Pertemuan</strong> (rata-rata {Math.round(currentPhaseObj.recJp / (currentPhaseObj.recMeetings || 1))} JP per pertemuan/minggu). Anda dapat menyesuaikan angka sesuai kalender pendidikan sekolah Anda.
              </p>
            </div>

            {/* JP and Meeting Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Total Jumlah Jam Pelajaran (JP):
                </label>
                <input
                  type="number"
                  min={12}
                  max={144}
                  value={totalJp}
                  onChange={(e) => setTotalJp(Number(e.target.value) || 36)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-900"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Standar Fase {selectedPhaseId}: {currentPhaseObj.recJp} JP
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Jumlah Pertemuan / Sesi Proyek:
                </label>
                <input
                  type="number"
                  min={4}
                  max={36}
                  value={meetingCount}
                  onChange={(e) => setMeetingCount(Number(e.target.value) || 8)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold text-slate-900"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Standar Fase {selectedPhaseId}: {currentPhaseObj.recMeetings} Pertemuan
                </span>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">
                  Mitra Eksternal / Masyarakat Terlibat:
                </label>
                <input
                  type="text"
                  value={partners}
                  onChange={(e) => setPartners(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  placeholder="Contoh: Komite Sekolah, Komunitas Bank Sampah, Puskesmas, Tokoh Budaya..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">
                  Sarana, Prasarana & Lokasi Pelaksanaan:
                </label>
                <input
                  type="text"
                  value={facilities}
                  onChange={(e) => setFacilities(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  placeholder="Contoh: Area taman sekolah, ruang kelas, proyektor, aula pameran..."
                />
              </div>
            </div>

            {/* Summary card before generating */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <strong className="text-slate-900 block">Rata-rata Distribusi Waktu:</strong>
                <span className="text-slate-600">
                  {Math.round(totalJp / (meetingCount || 1))} JP per sesi pertemuan ({meetingCount} pertemuan total)
                </span>
              </div>
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateFullKokurikuler}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2 flex-shrink-0"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isGenerating ? 'AI Sedang Menyusun Dokumen...' : 'Lanjut ke Alur 6 (Dokumen Hasil)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================
            ALUR 6: DOKUMEN HASIL LENGKAP & ASESMEN/RUBRIK DIMENSI
           =================================================== */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Alur 6: Dokumen Hasil Program Kokurikuler & Rubrik Penilaian Dimensi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dokumen hasil telah memuat Asesmen Autentik & Rubrik Analitik 4 Level yang diselaraskan secara spesifik dengan <strong>{selectedDimensions.length} Dimensi Profil Lulusan</strong> yang Anda pilih.
                </p>
              </div>

              {generatedResult && (
                <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveProgram}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan & Buka Pratinjau Cetak</span>
                  </button>
                </div>
              )}
            </div>

            {!generatedResult ? (
              <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                <Sprout className="w-12 h-12 text-emerald-600 mx-auto mb-3 animate-pulse" />
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Semua Data Alur 1–5 Telah Terisi Lengkap
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  Klik tombol di bawah ini untuk menghasilkan dokumen resmi program kokurikuler lengkap beserta instrumen asesmen dan rubrik penilaian analitik 4 level untuk <strong>{selectedDimensions.join(', ')}</strong>.
                </p>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateFullKokurikuler}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isGenerating ? 'AI Sedang Menyusun Dokumen...' : 'Generate Dokumen Program Kokurikuler'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6 text-xs sm:text-sm text-slate-900 bg-white p-6 sm:p-10 rounded-3xl border border-slate-300 shadow-md">
                {/* 1. JUDUL PROYEK (ALL CAPS, BOLD, CENTER) */}
                <div className="text-center pb-2 border-b border-slate-200">
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-950">
                    {generatedResult.title || (generatedResult.topic || 'PERENCANAAN PEMBELAJARAN KOKURIKULER').toUpperCase()}
                  </h2>
                </div>

                {/* 2. IDENTITAS PROYEK */}
                <div className="space-y-1.5 border-b border-slate-200 pb-4 text-xs">
                  <div className="grid grid-cols-[180px_16px_1fr] sm:grid-cols-[200px_20px_1fr] items-start">
                    <span className="text-slate-800">Nama satuan pendidikan</span>
                    <span>:</span>
                    <span className="font-semibold text-slate-950">{generatedResult.schoolName || school.schoolName || 'Satuan Pendidikan'}</span>
                  </div>
                  <div className="grid grid-cols-[180px_16px_1fr] sm:grid-cols-[200px_20px_1fr] items-start">
                    <span className="text-slate-800">Kelas / Fase</span>
                    <span>:</span>
                    <span className="font-semibold text-slate-950">{generatedResult.gradeLevel || 'Kelas V'} / {generatedResult.phase || selectedPhaseId || 'Fase C'}</span>
                  </div>
                  <div className="grid grid-cols-[180px_16px_1fr] sm:grid-cols-[200px_20px_1fr] items-start">
                    <span className="text-slate-800">Bentuk</span>
                    <span>:</span>
                    <span className="font-semibold text-slate-950">{generatedResult.form || 'Kolaboratif Lintas Disiplin Ilmu'}</span>
                  </div>
                  <div className="grid grid-cols-[180px_16px_1fr] sm:grid-cols-[200px_20px_1fr] items-start">
                    <span className="text-slate-800">Alokasi Waktu</span>
                    <span>:</span>
                    <span className="font-semibold text-slate-950">{generatedResult.allocatedTime || `${totalJp} JP`}</span>
                  </div>
                  <div className="grid grid-cols-[180px_16px_1fr] sm:grid-cols-[200px_20px_1fr] items-start">
                    <span className="text-slate-800">Lokasi Kegiatan</span>
                    <span>:</span>
                    <span className="font-semibold text-slate-950 leading-relaxed">{generatedResult.location || 'Lingkungan satuan pendidikan, lingkungan rumah, Tempat Pengolahan Sampah Terpadu (TPST) / Bank Sampah'}</span>
                  </div>
                </div>

                {/* A. Deskripsi Kokurikuler */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-950 text-xs sm:text-sm">
                    A. Deskripsi Kokurikuler
                  </h3>
                  <p className="text-slate-800 text-justify leading-relaxed">
                    {generatedResult.background}
                  </p>
                </div>

                {/* B. Dimensi Profil Lulusan */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-950 text-xs sm:text-sm">
                    B. Dimensi Profil Lulusan
                  </h3>
                  <ol className="list-decimal pl-5 space-y-0.5 text-slate-800 font-medium">
                    {generatedResult.profileDimensions && generatedResult.profileDimensions.length > 0 ? (
                      generatedResult.profileDimensions.map((dim, i) => (
                        <li key={i}>{dim.dimension}</li>
                      ))
                    ) : (
                      selectedDimensions.map((dim, i) => (
                        <li key={i}>{dim}</li>
                      ))
                    )}
                  </ol>
                </div>

                {/* C. Tujuan Pembelajaran */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-950 text-xs sm:text-sm">
                    C. Tujuan Pembelajaran
                  </h3>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-800 leading-relaxed">
                    {generatedResult.objectives?.map((ob, i) => (
                      <li key={i}>{ob}</li>
                    ))}
                  </ol>
                </div>

                {/* D. Praktik Pedagogis */}
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-950 text-xs sm:text-sm">
                    D. Praktik Pedagogis
                  </h3>
                  <p className="text-slate-800">
                    Praktik pedagogis dalam perencanaan ini menggunakan pembelajaran berbasis projek dengan tahapan sebagai berikut:
                  </p>
                  <div className="py-2 overflow-x-auto">
                    <div className="flex items-center gap-1.5 min-w-[500px] justify-center text-xs">
                      {['Pengenalan', 'Kontekstualisasi', 'Aksi', 'Refleksi', 'Tindak lanjut'].map((stName, idx) => (
                        <React.Fragment key={idx}>
                          <div className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-center">
                            {stName}
                          </div>
                          {idx < 4 && <ArrowRight className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-800 text-justify leading-relaxed">
                    {generatedResult.pedagogicalPractice?.description || 'Tahap pembelajaran diawali dengan pengenalan, di mana murid diajak mengenali permasalahan secara mendalam. Selanjutnya pada tahap kontekstualisasi, murid menggali permasalahan melalui penyelidikan. Hasilnya menjadi dasar bagi aksi nyata. Tahap berikutnya adalah refleksi untuk mengevaluasi hasil, dan diakhiri dengan tindak lanjut berupa komitmen berkelanjutan.'}
                  </p>
                </div>

                {/* E. Lingkungan Pembelajaran */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-950 text-xs sm:text-sm">
                    E. Lingkungan Pembelajaran
                  </h3>
                  <p className="text-slate-800 text-justify leading-relaxed">
                    {generatedResult.learningEnvironment?.description || 'Lingkungan pembelajaran dalam kokurikuler ini dirancang untuk membangun budaya belajar kolaboratif, bernalar kritis, komunikatif, reflektif, dan eksploratif dalam memecahkan masalah nyata, sekaligus membiasakan sikap empati, inklusif, nyaman, serta saling menghargai. Murid diberi ruang untuk menyampaikan ide dan berdiskusi secara terbuka di ruang kelas, halaman sekolah, dan lokasi mitra, serta melalui ruang virtual sebagai sarana pembelajaran digital.'}
                  </p>
                </div>

                {/* F. Kemitraan Pembelajaran */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-950 text-xs sm:text-sm">
                    F. Kemitraan Pembelajaran
                  </h3>
                  <ol className="list-decimal pl-5 space-y-0.5 text-slate-800">
                    {(generatedResult.learningPartnerships?.partners || [
                      'Petugas kebersihan satuan pendidikan, dilibatkan dalam kegiatan penyelidikan (narasumber wawancara).',
                      'Dinas Lingkungan Hidup / Instansi Pembina terkait, dilibatkan dalam sharing session pada tahap refleksi.',
                      'Orang tua murid, dilibatkan saat proses penyelidikan di rumah dan saat kegiatan sosialisasi.',
                      'Pegiat lingkungan / tokoh masyarakat setempat, dilibatkan menjadi narasumber.',
                      'Narasumber ahli pembuatan media kreatif/kreator konten, dilibatkan dalam kegiatan lokakarya pembuatan media kreatif.'
                    ]).map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ol>
                  <p className="text-slate-600 italic text-[11px] mt-1">
                    Catatan: {generatedResult.learningPartnerships?.note || 'Apabila tidak memungkinkan menghadirkan narasumber dari luar, maka peran tersebut dapat digantikan oleh pendidik.'}
                  </p>
                </div>

                {/* G. Pemanfaatan Digital */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-950 text-xs sm:text-sm">
                    G. Pemanfaatan Digital
                  </h3>
                  <ol className="list-decimal pl-5 space-y-0.5 text-slate-800">
                    {(generatedResult.digitalUtilization || [
                      'Pencarian data melalui internet',
                      'Ruang rapat virtual (Zoom Meeting atau Google Meet)',
                      'Pembuatan media kreatif menggunakan aplikasi desain grafis dan video editing seperti Canva, Capcut, Kinemaster, dan lainnya',
                      'Presentasi hasil projek dengan aplikasi bahan tayang seperti PowerPoint, Google Slides, dan Canva'
                    ]).map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ol>
                </div>

                {/* H. Kegiatan Pembelajaran */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-bold text-slate-950 text-xs sm:text-sm">
                    H. Kegiatan Pembelajaran
                  </h3>
                  <p className="text-slate-800 text-justify leading-relaxed">
                    Alur dan aktivitas dalam perencanaan ini bersifat referensi. Satuan pendidikan perlu menyesuaikan dengan konteks, kebutuhan, dan ketersediaan sarana pendukung. Bila ada aktivitas yang tidak memungkinkan untuk dilakukan, satuan pendidikan dapat menggantinya dengan aktivitas lain yang esensinya sama dan tetap kontekstual dengan topik. Berikut alur tahapan aktivitas dalam perencanaan kokurikuler.
                  </p>

                  {/* TABEL ALUR TAHAPAN AKTIVITAS */}
                  <div className="border border-slate-300 rounded-xl overflow-hidden my-3">
                    {(generatedResult.matrixStages || [
                      {
                        stage: 'Pengenalan',
                        guidingQuestion: '“Apa yang perlu kita tahu tentang permasalahan ini?”',
                        activities: [
                          { activityNumber: 'Aktivitas 1', duration: '4 JP', title: 'Membuka wawasan tentang materi dasar', summary: '' },
                          { activityNumber: 'Aktivitas 2', duration: '4 JP', title: 'Menganalisis dampak pengelolaan yang tidak baik', summary: '' },
                          { activityNumber: 'Aktivitas 3', duration: '8 JP', title: 'Mengamati pengelolaan melalui kunjungan lapangan ke mitra/TPST', summary: '' },
                          { activityNumber: 'Aktivitas 4', duration: '6 JP', title: 'Mengenal berbagai praktik baik narasumber', summary: '' },
                          { activityNumber: 'Aktivitas 5', duration: '4 JP', title: 'Mengidentifikasi pengelolaan di lingkungan terdekat', summary: '' }
                        ]
                      },
                      {
                        stage: 'Kontekstualisasi',
                        guidingQuestion: '“Bagaimana kondisi permasalahan di lingkungan sekolahku?”',
                        activities: [
                          { activityNumber: 'Aktivitas 6', duration: '4 JP', title: 'Merancang persiapan penyelidikan masalah di sekolah', summary: '' },
                          { activityNumber: 'Aktivitas 7-8', duration: '8 JP', title: 'Memahami masalah di sekolah melalui penyelidikan terstruktur', summary: '' },
                          { activityNumber: 'Aktivitas 9', duration: '4 JP', title: 'Menyajikan hasil pengamatan dalam tabel & diagram', summary: '' },
                          { activityNumber: 'Aktivitas 10', duration: '6 JP', title: 'Melakukan persiapan presentasi data hasil penyelidikan', summary: '' },
                          { activityNumber: 'Aktivitas 11', duration: '4 JP', title: 'Mempresentasikan hasil penyelidikan secara komunikatif', summary: '' }
                        ]
                      },
                      {
                        stage: 'Aksi',
                        guidingQuestion: '“Bagaimana caranya agar semua orang ambil bagian memberikan solusi?”',
                        activities: [
                          { activityNumber: 'Aktivitas 12-13', duration: '8 JP', title: 'Merumuskan solusi terbaik dan merancang media kreatif', summary: '' },
                          { activityNumber: 'Aktivitas 14', duration: '6 JP', title: 'Lokakarya pembuatan media kreatif bersama narasumber', summary: '' },
                          { activityNumber: 'Aktivitas 15', duration: '12 JP', title: 'Proses pembuatan media kreatif dan produk karya nyata', summary: '' },
                          { activityNumber: 'Aktivitas 16-18', duration: '14 JP', title: 'Presentasi media kreatif, gallery walk, dan revisi karya', summary: '' },
                          { activityNumber: 'Aktivitas 19', duration: '12 JP', title: 'Proses persiapan sosialisasi dan pameran panggung karya', summary: '' },
                          { activityNumber: 'Aktivitas 20', duration: '6 JP', title: 'Sosialisasi solusi dan pameran Gelar Karya ke warga sekolah', summary: '' }
                        ]
                      },
                      {
                        stage: 'Refleksi dan Tindak Lanjut',
                        guidingQuestion: '“Apa yang perlu menjadi komitmen bersama untuk keberlanjutan?”',
                        activities: [
                          { activityNumber: 'Aktivitas 21', duration: '4 JP', title: 'Merefleksikan pengalaman, keberhasilan, dan kendala sosialisasi', summary: '' },
                          { activityNumber: 'Aktivitas 22', duration: '6 JP', title: 'Memperluas wawasan dialog langsung narasumber DLH/mitra', summary: '' },
                          { activityNumber: 'Aktivitas 23', duration: '4 JP', title: 'Menyusun komitmen warga satuan pendidikan terkait keberlanjutan', summary: '' }
                        ]
                      }
                    ]).map((mg, mIdx) => (
                      <div key={mIdx} className="border-b last:border-b-0 border-slate-300">
                        <div className="bg-slate-100 p-2.5 border-b border-slate-300">
                          <strong className="text-slate-900 block font-bold text-xs">{mg.stage}</strong>
                          <span className="text-[11px] text-slate-600 italic">{mg.guidingQuestion}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-slate-300 bg-white">
                          {mg.activities?.map((ac, aIdx) => (
                            <div key={aIdx} className="p-2 text-[10px] sm:text-[11px]">
                              <strong className="block text-emerald-950 font-bold">{ac.activityNumber}</strong>
                              <span className="text-emerald-700 block text-[10px]">({ac.duration})</span>
                              <p className="text-slate-700 leading-tight mt-0.5">{ac.title}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* RINCIAN PER TAHAP */}
                  <div className="space-y-4 pt-2">
                    <h4 className="font-bold text-slate-950 text-xs sm:text-sm">Rincian Aktivitas Pembelajaran</h4>
                    {(generatedResult.detailedActivities || [
                      {
                        stage: 'Tahap Pengenalan',
                        activities: [
                          {
                            number: 'Aktivitas 1',
                            title: 'Membuka wawasan tentang tema dan jenis-jenis permasalahan',
                            duration: '4 JP',
                            preparation: ['Pendidik menyiapkan bahan bacaan dan artikel tentang tema.', 'Pendidik menyiapkan video inspiratif terkait isu nyata.'],
                            steps: ['1. Pendidik menampilkan video permasalahan dan pemantik diskusi.', '2. Murid dan pendidik berdiskusi terkait fenomena dalam video.', '3. Murid secara berkelompok membuat tabel pengelompokan data awal.']
                          },
                          {
                            number: 'Aktivitas 3',
                            title: 'Mengamati pengelolaan melalui kunjungan lapangan ke lokasi mitra (TPST/Bank Sampah)',
                            duration: '8 JP',
                            preparation: ['Pendidik berkoordinasi dengan pihak mitra.', 'Pendidik menyiapkan lembar observasi lapangan.'],
                            steps: ['1. Pendidik menjelaskan tujuan kunjungan.', '2. Murid mengamati alur pengelolaan dengan lembar observasi.']
                          }
                        ]
                      },
                      {
                        stage: 'Tahap Kontekstualisasi',
                        activities: [
                          {
                            number: 'Aktivitas 7 dan 8',
                            title: 'Memahami masalah di sekolah melalui penyelidikan dan pencatatan terstruktur',
                            duration: '8 JP',
                            preparation: ['Pendidik menyiapkan panduan wawancara dan instrumen observasi.'],
                            steps: ['1. Kelompok melaksanakan wawancara dan observasi lapangan di sekolah.', '2. Murid mencatat data kualitatif dan kuantitatif.'],
                            assessmentSnippet: {
                              type: 'Formatif',
                              dimension: 'Penalaran Kritis',
                              purpose: 'Murid mampu mengidentifikasi masalah di lingkungan sekitar berdasarkan penyelidikan, mengumpulkan informasi yang relevan, dan mencatat kesimpulan terstruktur.',
                              rubricRef: 'Asesmen Pembelajaran bagian Penalaran Kritis',
                              instrument: 'Lembar Kerja Hasil Penyelidikan'
                            }
                          }
                        ]
                      },
                      {
                        stage: 'Tahap Aksi',
                        activities: [
                          {
                            number: 'Aktivitas 12-13',
                            title: 'Merumuskan solusi terbaik melalui diskusi berjenjang dan perencanaan media',
                            duration: '8 JP',
                            preparation: ['Pendidik menyiapkan panduan diskusi berjenjang (individu, pasangan, kelompok kecil, pleno).'],
                            steps: ['1. Kelas melakukan diskusi berjenjang 4 tahap hingga menghasilkan 3 solusi terbaik.', '2. Pendidik melaksanakan asesmen sumatif penalaran kritis.'],
                            assessmentSnippet: {
                              type: 'Sumatif',
                              dimension: 'Penalaran Kritis',
                              purpose: 'Murid mampu menyampaikan rumusan solusi yang relevan, kontekstual, dan berbasis data.',
                              rubricRef: 'Asesmen Pembelajaran bagian Penalaran Kritis',
                              instrument: 'Lembar Kerja Solusi Berjenjang'
                            }
                          }
                        ]
                      },
                      {
                        stage: 'Tahap Refleksi dan Tindak Lanjut',
                        activities: [
                          {
                            number: 'Aktivitas 21',
                            title: 'Merefleksikan pengalaman, keberhasilan, dan kendala sosialisasi',
                            duration: '4 JP',
                            preparation: ['Pendidik menyiapkan lembar refleksi pengalaman belajar.'],
                            steps: ['1. Pendidik memandu diskusi reflektif.', '2. Murid merumuskan komitmen keberlanjutan.']
                          }
                        ]
                      }
                    ]).map((dSec, dsIdx) => (
                      <div key={dsIdx} className="space-y-3">
                        <strong className="block text-emerald-950 font-extrabold uppercase tracking-wide border-b border-emerald-600 pb-0.5 text-xs">
                          {dSec.stage}
                        </strong>
                        {dSec.activities?.map((actItem, actI) => (
                          <div key={actI} className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 space-y-2 text-xs">
                            <div className="bg-emerald-100/90 text-emerald-950 p-2 rounded-lg font-bold flex items-center justify-between">
                              <span>{actItem.number}: {actItem.title}</span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-700 text-white rounded">
                                Durasi: {actItem.duration}
                              </span>
                            </div>
                            {actItem.preparation && actItem.preparation.length > 0 && (
                              <div>
                                <strong className="font-bold text-slate-900">Persiapan:</strong>
                                <ul className="list-disc pl-5 text-slate-700 text-[11px]">
                                  {actItem.preparation.map((pr, pIdx) => <li key={pIdx}>{pr}</li>)}
                                </ul>
                              </div>
                            )}
                            {actItem.steps && actItem.steps.length > 0 && (
                              <div>
                                <strong className="font-bold text-slate-900">Pelaksanaan:</strong>
                                <div className="text-slate-800 text-[11px] space-y-0.5">
                                  {actItem.steps.map((st, sIdx) => <p key={sIdx}>{st}</p>)}
                                </div>
                              </div>
                            )}
                            {actItem.assessmentSnippet && (
                              <div className="p-2.5 bg-blue-50 rounded-lg border-l-4 border-blue-600 text-[11px] space-y-0.5">
                                <strong className="text-blue-950 font-bold block">
                                  Asesmen {actItem.assessmentSnippet.type} {actItem.assessmentSnippet.dimension}:
                                </strong>
                                <p>- <strong>Tujuan asesmen:</strong> {actItem.assessmentSnippet.purpose}</p>
                                <p>- <strong>Rubrikasi:</strong> dapat dilihat pada bagian Asesmen Pembelajaran bagian {actItem.assessmentSnippet.dimension}.</p>
                                <p>- <strong>Instrumen:</strong> {actItem.assessmentSnippet.instrument}.</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* I. Asesmen Pembelajaran (Page 18-19 PDF Format) */}
                <div className="space-y-4 pt-4 border-t border-slate-300">
                  <div>
                    <h3 className="font-bold text-slate-950 text-xs sm:text-sm">
                      I. Asesmen Pembelajaran
                    </h3>
                    <p className="text-slate-800 text-justify text-xs mt-1 leading-relaxed">
                      Rubrik untuk kegiatan asesmen formatif dan sumatif mengacu pada dokumen Alur Perkembangan Kompetensi Dimensi Profil Lulusan (DPL).
                    </p>
                    <p className="text-slate-600 italic text-[11px] mt-0.5">
                      Catatan: Rubrik asesmen formatif dan sumatif berikut dapat dimodifikasi sesuai kebutuhan satuan pendidikan masing-masing.
                    </p>
                  </div>

                  {/* RUBRIK 3 KOLOM: Berkembang | Cakap | Mahir */}
                  <div className="space-y-5 pt-1">
                    {(generatedResult.dimensionAssessments || (
                      generatedResult.profileDimensions && generatedResult.profileDimensions.length > 0
                        ? generatedResult.profileDimensions.map(pd => ({
                            dimension: pd.dimension,
                            assessments: [
                              {
                                title: `Asesmen Formatif (Aktivitas 7-8 / Penyelidikan)`,
                                skillAssessed: `Kemampuan mengidentifikasi permasalahan secara kritis dan menyajikan temuan sistematis pada dimensi ${pd.dimension}`,
                                berkembang: `Mampu menyebutkan 1 - 2 masalah namun tidak mengaitkan dengan hasil observasi lingkungan sekitar.`,
                                cakap: `Mampu menyebutkan 3 - 4 permasalahan dan mengaitkan dengan hasil dari pengamatan di lingkungan.`,
                                mahir: `Mampu menyebutkan lebih dari 4 masalah dan melengkapinya dengan penjelasan dan informasi dari berbagai sumber.`
                              },
                              {
                                title: `Asesmen Sumatif (Aktivitas 12 / Perumusan Solusi)`,
                                skillAssessed: `Merumuskan solusi terkait masalah di lingkungan sekitar berdasarkan data pada dimensi ${pd.dimension}`,
                                berkembang: `Rumusan solusi yang disampaikan belum sesuai dengan permasalahan di lingkungan terdekat atau belum berbasis data.`,
                                cakap: `Rumusan solusi yang disampaikan kontekstual, sesuai data, dan mampu menjawab masalah di lingkungan terdekat.`,
                                mahir: `Rumusan solusi yang disampaikan orisinil, relevan dengan masalah, sesuai data, dan dilengkapi rujukan sumber belajar.`
                              }
                            ]
                          }))
                        : [
                            {
                              dimension: 'Penalaran Kritis',
                              assessments: [
                                {
                                  title: 'Asesmen Formatif (Aktivitas 7-8)',
                                  skillAssessed: 'Identifikasi masalah sampah di lingkungan sekitar berdasarkan pengamatan dan informasi yang relevan',
                                  berkembang: 'Mampu menyebutkan 1 - 2 masalah sampah namun tidak mengaitkan dengan hasil observasi lingkungan sekitar',
                                  cakap: 'Mampu menyebutkan 3-4 permasalahan sampah dan mengaitkan dengan hasil dari pengamatan di lingkungan',
                                  mahir: 'Mampu menyebutkan lebih dari 4 masalah dan melengkapinya dengan penjelasan dan informasi dari berbagai sumber'
                                },
                                {
                                  title: 'Asesmen Sumatif (Aktivitas 12)',
                                  skillAssessed: 'Merumuskan solusi terkait masalah sampah di lingkungan sekitar berdasarkan data',
                                  berkembang: 'Rumusan solusi yang disampaikan belum sesuai dengan permasalahan sampah di lingkungan terdekat atau tidak sesuai dengan data yang disajikan',
                                  cakap: 'Rumusan solusi yang disampaikan kontekstual, sesuai data, dan mampu menjawab masalah sampah di lingkungan terdekat.',
                                  mahir: 'Rumusan solusi yang disampaikan orisinil, relevan dengan masalah sampah di sekitar, sesuai data.'
                                }
                              ]
                            }
                          ]
                    )).map((dimGroup, dgIdx) => (
                      <div key={dgIdx} className="space-y-3">
                        <strong className="block text-blue-950 font-extrabold border-b border-blue-200 pb-0.5 text-xs">
                          Dimensi Profil Lulusan: {dimGroup.dimension}
                        </strong>

                        {dimGroup.assessments?.map((asItem, asIdx) => (
                          <div key={asIdx} className="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
                            <div className="bg-blue-100/90 text-blue-950 p-2.5 border-b border-slate-300 text-xs">
                              <strong className="block font-bold">{asItem.title}</strong>
                              <p className="text-[11px] text-slate-700 mt-0.5">
                                <span className="font-semibold text-blue-900">Kemampuan yang dinilai:</span> {asItem.skillAssessed}
                              </p>
                            </div>
                            <table className="w-full border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                                  <th className="p-2 text-left border-r border-slate-300 w-1/3 font-bold">Berkembang</th>
                                  <th className="p-2 text-left border-r border-slate-300 w-1/3 font-bold">Cakap</th>
                                  <th className="p-2 text-left w-1/3 font-bold">Mahir</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="align-top">
                                  <td className="p-2.5 border-r border-slate-300 text-slate-700 bg-slate-50/40 text-[11px] leading-relaxed">
                                    {asItem.berkembang}
                                  </td>
                                  <td className="p-2.5 border-r border-slate-300 text-slate-700 text-[11px] leading-relaxed">
                                    {asItem.cakap}
                                  </td>
                                  <td className="p-2.5 text-slate-800 bg-emerald-50/40 text-[11px] font-medium leading-relaxed">
                                    {asItem.mahir}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-slate-500 text-[11px]">
                    Susunan dokumen telah sama persis dengan standar resmi Kemendikdasmen (A. Deskripsi s.d. I. Asesmen)
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveProgram}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan & Buka Pratinjau Cetak Resmi (A4)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-8">
          <button
            type="button"
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else onCancel();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Batalkan' : 'Sebelumnya'}</span>
          </button>

          <div className="flex items-center gap-2">
            {step < 5 && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>Lanjut ke Alur {step + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 5 && !generatedResult && (
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerateFullKokurikuler}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isGenerating ? 'AI Menyusun...' : 'Generate Dokumen Hasil (Alur 6)'}</span>
              </button>
            )}

            {step === 5 && generatedResult && (
              <button
                type="button"
                onClick={() => setStep(6)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>Lihat Dokumen Hasil (Alur 6)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
