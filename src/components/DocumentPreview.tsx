import React, { useRef } from 'react';
import {
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  ShieldCheck,
  Edit,
  AlertCircle
} from 'lucide-react';
import { ModulAjarDocument } from '../types';

interface DocumentPreviewProps {
  document: ModulAjarDocument;
  onBack: () => void;
  onOpenAIRefine: () => void;
  onOpenValidator: () => void;
  onEdit: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  onBack,
  onOpenAIRefine,
  onOpenValidator,
  onEdit,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDoc = () => {
    // Generate clean HTML file for Word/Google Docs
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${document.title}</title>
        <style>
          body { font-family: 'Calibri', 'Times New Roman', serif; font-size: 11pt; line-height: 1.4; color: #111; }
          h1 { font-size: 14pt; text-align: center; text-transform: uppercase; font-weight: bold; margin-bottom: 4px; }
          h2 { font-size: 12pt; text-align: center; font-weight: normal; margin-top: 0; }
          h3 { font-size: 11pt; font-weight: bold; margin-top: 18px; margin-bottom: 6px; border-bottom: 1px solid #333; padding-bottom: 2px; }
          h4 { font-size: 11pt; font-weight: bold; margin-top: 10px; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 12px; }
          th, td { border: 1px solid #333; padding: 6px 8px; font-size: 10pt; vertical-align: top; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 16px; }
          .kop h2 { font-size: 14pt; font-weight: bold; margin: 0; }
          .kop p { font-size: 9pt; margin: 2px 0; }
        </style>
      </head>
      <body>
        <div class="kop">
          <h2>${document.schoolInfo?.name || 'SATUAN PENDIDIKAN'}</h2>
          <p>NPSN: ${document.schoolInfo?.npsn || '-'} | Alamat: ${document.schoolInfo?.address || '-'}</p>
        </div>
        <h1>MODUL AJAR PEMBELAJARAN MENDALAM (8–3–3–4)</h1>
        <h2>Mata Pelajaran: ${document.subject} - ${document.gradeLevel}</h2>
        ${document.cp ? `<p><strong>Capaian Pembelajaran:</strong> ${document.cp}</p>` : ''}
        <h3>I. TUJUAN PEMBELAJARAN</h3>
        <ul>${document.tpList?.map(tp => `<li>${tp}</li>`).join('')}</ul>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.title.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    const text = `
# ${document.title}
Sekolah: ${document.schoolInfo?.name}
Guru: ${document.schoolInfo?.teacher} (NIP: ${document.schoolInfo?.teacherNip})
Mata Pelajaran: ${document.subject} | ${document.gradeLevel} | Alokasi: ${document.allocatedTime}

## CAPAIAN PEMBELAJARAN (CP)
${document.cp}

## TUJUAN PEMBELAJARAN (TP)
${document.tpList?.map(tp => `- ${tp}`).join('\n')}

## 8 DIMENSI PROFIL LULUSAN
${document.profileDimensions?.map(d => `- **${d.dimension}**: ${d.justification} (Indikator: ${d.behavioralIndicator})`).join('\n')}

## 3 PRINSIP PEMBELAJARAN
- **Berkesadaran**: ${document.threePrinciples?.conscious}
- **Bermakna**: ${document.threePrinciples?.meaningful}
- **Menggembirakan**: ${document.threePrinciples?.joyful}

## 3 PENGALAMAN BELAJAR
- **Memahami**: ${document.threeExperiences?.understand}
- **Mengaplikasi**: ${document.threeExperiences?.apply}
- **Merefleksi**: ${document.threeExperiences?.reflect}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Action Header (Hidden in Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenValidator}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Audit Validasi 17 Poin</span>
          </button>

          <button
            onClick={onOpenAIRefine}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl border border-amber-300 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Perbaiki Modul (AI Refine)</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Salin Rangkuman Teks"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          <button
            onClick={handleDownloadDoc}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download DOCX</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Official Indonesian Administrative Document Container (A4 layout) */}
      <div className="bg-white max-w-4xl mx-auto p-6 sm:p-12 rounded-3xl border border-slate-300 shadow-xl print:border-none print:shadow-none print:p-0 print:m-0 text-slate-900 text-sm leading-relaxed">
        
        {/* Formal School Kop Surat */}
        <div className="border-b-4 border-double border-slate-900 pb-3 mb-6 text-center">
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">
            {document.schoolInfo?.name || 'SATUAN PENDIDIKAN KEMENDIKDASMEN'}
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            NPSN: {document.schoolInfo?.npsn || '-'} • Alamat: {document.schoolInfo?.address || '-'}
            {document.schoolInfo?.district ? `, Kec. ${document.schoolInfo.district}` : ''}
            {document.schoolInfo?.city ? `, ${document.schoolInfo.city}` : ''}
          </p>
        </div>

        {/* Title & Document Badge */}
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-blue-100 text-blue-900 uppercase border border-blue-200 mb-2">
            Perangkat Kurikulum Nasional • Pembelajaran Mendalam
          </span>
          <h1 className="text-lg sm:text-xl font-extrabold uppercase text-slate-950 tracking-tight">
            MODUL AJAR (DEEP LEARNING 8–3–3–4)
          </h1>
          <p className="text-xs font-semibold text-slate-600 mt-1">
            Mata Pelajaran: {document.subject} • {document.gradeLevel} (Semester {document.semester})
          </p>
        </div>

        {/* SECTION 1: IDENTITAS & INFORMASI UMUM */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/80 px-3 py-1.5 rounded-lg border-l-4 border-blue-600 mb-3">
            I. IDENTITAS & INFORMASI UMUM
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs bg-slate-50/60 p-4 rounded-xl border border-slate-200">
            <div><span className="text-slate-500 w-32 inline-block">Nama Sekolah:</span> <strong>{document.schoolInfo?.name}</strong></div>
            <div><span className="text-slate-500 w-32 inline-block">Nama Guru:</span> <strong>{document.schoolInfo?.teacher}</strong></div>
            <div><span className="text-slate-500 w-32 inline-block">Mata Pelajaran:</span> <strong>{document.subject}</strong></div>
            <div><span className="text-slate-500 w-32 inline-block">NIP Guru:</span> <strong>{document.schoolInfo?.teacherNip || '-'}</strong></div>
            <div><span className="text-slate-500 w-32 inline-block">Fase / Kelas:</span> <strong>{document.phase} / {document.gradeLevel}</strong></div>
            <div><span className="text-slate-500 w-32 inline-block">Topik / Materi:</span> <strong>{document.topic}</strong></div>
            <div><span className="text-slate-500 w-32 inline-block">Semester / TP:</span> <strong>{document.semester} / 2025-2026</strong></div>
            <div><span className="text-slate-500 w-32 inline-block">Alokasi Waktu:</span> <strong>{document.allocatedTime}</strong></div>
          </div>
        </div>

        {/* SECTION 2: ANALISIS AWAL PESERTA DIDIK */}
        {document.initialAnalysis && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/80 px-3 py-1.5 rounded-lg border-l-4 border-blue-600 mb-3">
              II. ANALISIS AWAL PESERTA DIDIK & LINGKUNGAN
            </h3>
            <div className="space-y-2 text-xs text-slate-800 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
              <p>• <strong>Karakteristik Murid:</strong> {document.initialAnalysis.studentCharacteristics}</p>
              <p>• <strong>Pengetahuan Prasyarat:</strong> {document.initialAnalysis.prerequisites}</p>
              <p>• <strong>Kesiapan Belajar:</strong> {document.initialAnalysis.learningReadiness}</p>
              <p>• <strong>Sarana & Prasarana:</strong> {document.initialAnalysis.facilities}</p>
              <p>• <strong>Konteks Lingkungan:</strong> {document.initialAnalysis.environmentContext}</p>
            </div>
          </div>
        )}

        {/* SECTION 3: CAPAIAN PEMBELAJARAN & TUJUAN PEMBELAJARAN */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/80 px-3 py-1.5 rounded-lg border-l-4 border-blue-600 mb-3">
            III. CAPAIAN PEMBELAJARAN (CP) & TUJUAN PEMBELAJARAN (TP)
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-blue-50/40 rounded-xl border border-blue-200">
              <span className="font-bold text-blue-950 block mb-1">Capaian Pembelajaran (CP) Resmi:</span>
              <p className="text-slate-800 italic leading-relaxed">"{document.cp}"</p>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1.5">Tujuan Pembelajaran (TP) Operasional:</span>
              <ul className="list-decimal pl-5 space-y-1 text-slate-800 font-medium">
                {document.tpList?.map((tp, i) => (
                  <li key={i}>{tp}</li>
                ))}
              </ul>
            </div>

            {document.kktp && document.kktp.length > 0 && (
              <div className="mt-3">
                <span className="font-bold text-slate-900 block mb-1.5">Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):</span>
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800">
                      <th className="border border-slate-300 p-2 text-left w-12">No</th>
                      <th className="border border-slate-300 p-2 text-left">Indikator Ketercapaian</th>
                      <th className="border border-slate-300 p-2 text-left">Target / Bukti Ketercapaian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {document.kktp.map((k, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-2 font-semibold text-center">{idx + 1}</td>
                        <td className="border border-slate-300 p-2">{k.indicator}</td>
                        <td className="border border-slate-300 p-2 font-medium text-blue-900">{k.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: INTEGRASI KERANGKA 8-3-3-4 */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/80 px-3 py-1.5 rounded-lg border-l-4 border-blue-600 mb-3">
            IV. INTEGRASI KERANGKA PEMBELAJARAN MENDALAM (8–3–3–4)
          </h3>

          <div className="space-y-4 text-xs">
            {/* 8 Dimensi Terpilih */}
            <div>
              <span className="font-bold text-slate-900 block mb-1.5">A. Dimensi Profil Lulusan Terpilih (dari 8 Dimensi):</span>
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="border border-slate-300 p-2 text-left w-1/4">Dimensi Terpilih</th>
                    <th className="border border-slate-300 p-2 text-left w-3/8">Alasan / Relevansi Pemilihan</th>
                    <th className="border border-slate-300 p-2 text-left w-3/8">Indikator Perilaku Murid</th>
                  </tr>
                </thead>
                <tbody>
                  {document.profileDimensions?.map((dim, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="border border-slate-300 p-2 font-bold text-blue-900">{dim.dimension}</td>
                      <td className="border border-slate-300 p-2">{dim.justification}</td>
                      <td className="border border-slate-300 p-2 italic">{dim.behavioralIndicator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 3 Prinsip */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1.5">B. Bentuk Penerapan 3 Prinsip Pembelajaran:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-blue-800 block text-[11px] mb-1">1. BERKESADARAN</span>
                  <p className="text-[11px] text-slate-700">{document.threePrinciples?.conscious}</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-indigo-800 block text-[11px] mb-1">2. BERMAKNA</span>
                  <p className="text-[11px] text-slate-700">{document.threePrinciples?.meaningful}</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="font-bold text-emerald-800 block text-[11px] mb-1">3. MENGGEMBIRAKAN</span>
                  <p className="text-[11px] text-slate-700">{document.threePrinciples?.joyful}</p>
                </div>
              </div>
            </div>

            {/* 3 Pengalaman Belajar */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1.5">C. Desain 3 Pengalaman Belajar:</span>
              <div className="space-y-1.5 text-[11px]">
                <p>• <strong>MEMAHAMI (Membangun Konsep):</strong> {document.threeExperiences?.understand}</p>
                <p>• <strong>MENGAPLIKASI (Praktik & Solusi):</strong> {document.threeExperiences?.apply}</p>
                <p>• <strong>MEREFLEKSI (Evaluasi Diri):</strong> {document.threeExperiences?.reflect}</p>
              </div>
            </div>

            {/* 4 Komponen Kerangka */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1.5">D. Integrasi 4 Komponen Kerangka:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <strong>1. Praktik Pedagogis:</strong>
                  <p className="text-slate-700">{document.fourComponents?.pedagogicalPractice?.model} - {document.fourComponents?.pedagogicalPractice?.strategyDescription}</p>
                </div>
                <div>
                  <strong>2. Lingkungan Pembelajaran:</strong>
                  <p className="text-slate-700">Fisik: {document.fourComponents?.learningEnvironment?.physical}</p>
                </div>
                <div>
                  <strong>3. Kemitraan Pembelajaran:</strong>
                  <p className="text-slate-700">Mitra: {document.fourComponents?.learningPartnership?.stakeholders?.join(', ')} ({document.fourComponents?.learningPartnership?.partnershipRole})</p>
                </div>
                <div>
                  <strong>4. Pemanfaatan Digital:</strong>
                  <p className="text-slate-700">Tools: {document.fourComponents?.digitalUtilization?.tools?.join(', ')} ({document.fourComponents?.digitalUtilization?.implementation})</p>
                </div>
              </div>
            </div>

            {/* Diferensiasi */}
            {document.differentiation && (
              <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-200 text-xs">
                <span className="font-bold text-blue-950 block mb-1">E. Strategi Pembelajaran Berdiferensiasi:</span>
                <p>• <strong>Diferensiasi Konten:</strong> {document.differentiation.content}</p>
                <p>• <strong>Diferensiasi Proses:</strong> {document.differentiation.process}</p>
                <p>• <strong>Diferensiasi Produk:</strong> {document.differentiation.product}</p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 5: LANGKAH-LANGKAH PEMBELAJARAN */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/80 px-3 py-1.5 rounded-lg border-l-4 border-blue-600 mb-3">
            V. LANGKAH-LANGKAH PEMBELAJARAN TERPERINCI
          </h3>

          {/* Pendahuluan */}
          <div className="mb-4">
            <div className="flex items-center justify-between font-bold text-xs bg-slate-200/80 p-2 rounded-t-lg">
              <span>A. KEGIATAN PENDAHULUAN</span>
              <span>{document.learningSteps?.introduction?.duration || '10 Menit'}</span>
            </div>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2 text-left w-1/3">Aktivitas</th>
                  <th className="border border-slate-300 p-2 text-left w-1/3">Peran Guru</th>
                  <th className="border border-slate-300 p-2 text-left w-1/3">Aktivitas Peserta Didik</th>
                </tr>
              </thead>
              <tbody>
                {document.learningSteps?.introduction?.activities?.map((act, idx) => (
                  <tr key={idx}>
                    <td className="border border-slate-300 p-2 font-medium">{act.activity}</td>
                    <td className="border border-slate-300 p-2">{act.teacherAction}</td>
                    <td className="border border-slate-300 p-2">{act.studentAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inti (Memahami, Mengaplikasi, Merefleksi) */}
          <div className="mb-4">
            <div className="flex items-center justify-between font-bold text-xs bg-slate-200/80 p-2 rounded-t-lg">
              <span>B. KEGIATAN INTI (MEMAHAMI – MENGAPLIKASI – MEREFLEKSI)</span>
              <span>{document.learningSteps?.core?.duration || '60 Menit'}</span>
            </div>
            <div className="space-y-3 mt-2">
              {document.learningSteps?.core?.phases?.map((phase, pIdx) => (
                <div key={pIdx} className="border border-slate-300 rounded-xl p-3 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-blue-900">{phase.phaseName}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                      Pengalaman: {phase.experienceType}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-2">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-700 block">Aktivitas Guru:</span>
                      <p className="text-slate-800">{phase.teacherAction}</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-700 block">Aktivitas Peserta Didik:</span>
                      <p className="text-slate-800">{phase.studentAction}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-slate-600 flex-wrap">
                    <span>Prinsip: <strong>{phase.principle}</strong></span>
                    <span>Dimensi: <strong>{phase.dimension}</strong></span>
                    <span>Asesmen: <strong className="text-blue-900">{phase.assessmentUsed}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Penutup */}
          <div>
            <div className="flex items-center justify-between font-bold text-xs bg-slate-200/80 p-2 rounded-t-lg">
              <span>C. KEGIATAN PENUTUP</span>
              <span>{document.learningSteps?.closing?.duration || '10 Menit'}</span>
            </div>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2 text-left w-1/3">Aktivitas</th>
                  <th className="border border-slate-300 p-2 text-left w-1/3">Peran Guru</th>
                  <th className="border border-slate-300 p-2 text-left w-1/3">Aktivitas Peserta Didik</th>
                </tr>
              </thead>
              <tbody>
                {document.learningSteps?.closing?.activities?.map((act, idx) => (
                  <tr key={idx}>
                    <td className="border border-slate-300 p-2 font-medium">{act.activity}</td>
                    <td className="border border-slate-300 p-2">{act.teacherAction}</td>
                    <td className="border border-slate-300 p-2">{act.studentAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 6: ASESMEN PEMBELAJARAN */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/80 px-3 py-1.5 rounded-lg border-l-4 border-blue-600 mb-3">
            VI. ASESMEN PEMBELAJARAN AUTENTIK
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">1. Asesmen Diagnostik</span>
              <p>• <strong>Tujuan:</strong> {document.assessments?.diagnostic?.purpose}</p>
              <p>• <strong>Teknik & Instrumen:</strong> {document.assessments?.diagnostic?.technique} ({document.assessments?.diagnostic?.instrument})</p>
              {document.assessments?.diagnostic?.items && (
                <div className="mt-1">
                  <span className="font-semibold">Contoh Pertanyaan:</span>
                  <ul className="list-disc pl-4 italic text-slate-700">
                    {document.assessments.diagnostic.items.map((it, idx) => <li key={idx}>{it}</li>)}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">2. Asesmen Formatif</span>
              <p>• <strong>Tujuan:</strong> {document.assessments?.formative?.purpose}</p>
              <p>• <strong>Teknik & Instrumen:</strong> {document.assessments?.formative?.technique} ({document.assessments?.formative?.instrument})</p>
              {document.assessments?.formative?.indicators && (
                <div className="mt-1">
                  <span className="font-semibold">Indikator Observasi:</span>
                  <ul className="list-disc pl-4 text-slate-700">
                    {document.assessments.formative.indicators.map((ind, idx) => <li key={idx}>{ind}</li>)}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">3. Asesmen Sumatif</span>
              <p>• <strong>Teknik:</strong> {document.assessments?.summative?.technique}</p>
              <p>• <strong>Bentuk:</strong> {document.assessments?.summative?.form}</p>
              <p>• <strong>Kisi-kisi:</strong> {document.assessments?.summative?.blueprint}</p>
              <p>• <strong>Penskoran:</strong> {document.assessments?.summative?.scoringGuide}</p>
            </div>
          </div>
        </div>

        {/* SECTION 7: RUBRIK PENILAIAN ANALITIK */}
        {document.rubrics && document.rubrics.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/80 px-3 py-1.5 rounded-lg border-l-4 border-blue-600 mb-3">
              VII. RUBRIK PENILAIAN ANALITIK (4 TINGKAT KEMAMPUAN)
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 p-2 text-left w-1/5">Aspek Penilaian</th>
                  <th className="border border-slate-300 p-2 text-left w-1/5">Level 4 (Mahir / Sangat Baik)</th>
                  <th className="border border-slate-300 p-2 text-left w-1/5">Level 3 (Cakap / Baik)</th>
                  <th className="border border-slate-300 p-2 text-left w-1/5">Level 2 (Layak / Cukup)</th>
                  <th className="border border-slate-300 p-2 text-left w-1/5">Level 1 (Baru Berkembang)</th>
                </tr>
              </thead>
              <tbody>
                {document.rubrics.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="border border-slate-300 p-2 font-bold text-slate-900">
                      {r.aspect}
                      {r.weight && <span className="block text-[10px] text-blue-700 font-normal">Bobot: {r.weight}</span>}
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-800">{r.level4}</td>
                    <td className="border border-slate-300 p-2 text-slate-800">{r.level3}</td>
                    <td className="border border-slate-300 p-2 text-slate-800">{r.level2}</td>
                    <td className="border border-slate-300 p-2 text-slate-800">{r.level1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SECTION 8: REMEDIAL & PENGAYAAN */}
        {document.remedialAndEnrichment && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/80 px-3 py-1.5 rounded-lg border-l-4 border-blue-600 mb-3">
              VIII. PROGRAM REMEDIAL DAN PENGAYAAN
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-950 block mb-1">A. Kegiatan Remedial</span>
                <p>• <strong>Diagnosis:</strong> {document.remedialAndEnrichment.remedial.diagnosis}</p>
                <p>• <strong>Bentuk Pembelajaran:</strong> {document.remedialAndEnrichment.remedial.activity}</p>
                <p>• <strong>Asesmen Ulang:</strong> {document.remedialAndEnrichment.remedial.assessment}</p>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-950 block mb-1">B. Kegiatan Pengayaan</span>
                <p>• <strong>Target Peserta:</strong> {document.remedialAndEnrichment.enrichment.target}</p>
                <p>• <strong>Bentuk Eksplorasi:</strong> {document.remedialAndEnrichment.enrichment.activity}</p>
                <p>• <strong>Tantangan Lanjutan:</strong> {document.remedialAndEnrichment.enrichment.challenge}</p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 9: REFLEKSI GURU & PESERTA DIDIK */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/80 px-3 py-1.5 rounded-lg border-l-4 border-blue-600 mb-3">
            IX. REFLEKSI GURU DAN PESERTA DIDIK
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1.5">Refleksi Pendidik:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                {document.teacherReflection?.map((ref, idx) => <li key={idx}>{ref}</li>)}
              </ul>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1.5">Refleksi Peserta Didik:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                {document.studentReflection?.map((ref, idx) => <li key={idx}>{ref}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* OFFICIAL SIGNATURE BLOCK */}
        <div className="pt-6 border-t border-slate-300 mt-8 break-inside-avoid">
          <div className="flex justify-between items-start text-xs text-slate-800">
            <div className="text-center w-64">
              <p>Mengetahui,</p>
              <p className="font-bold">Kepala Sekolah</p>
              <div className="h-20 flex items-center justify-center text-slate-300 text-[10px] italic">
                (Tanda Tangan & Cap Sekolah)
              </div>
              <p className="font-bold text-slate-950 underline">{document.schoolInfo?.headmaster || 'Kepala Sekolah, M.Pd.'}</p>
              <p className="text-slate-600">NIP. {document.schoolInfo?.headmasterNip || '-'}</p>
            </div>

            <div className="text-center w-64">
              <p>Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-bold">Guru Mata Pelajaran</p>
              <div className="h-20 flex items-center justify-center text-slate-300 text-[10px] italic">
                (Tanda Tangan Guru)
              </div>
              <p className="font-bold text-slate-950 underline">{document.schoolInfo?.teacher || 'Guru Pengampu, S.Pd.'}</p>
              <p className="text-slate-600">NIP. {document.schoolInfo?.teacherNip || '-'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
