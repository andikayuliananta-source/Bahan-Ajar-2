import React, { useState } from 'react';
import { Printer, Download, ArrowLeft, CheckCircle2, Copy, Check, Award, Sprout, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { KokurikulerProgramDocument } from '../types';

interface KokurikulerPreviewProps {
  program: KokurikulerProgramDocument;
  onBack: () => void;
}

export const KokurikulerPreview: React.FC<KokurikulerPreviewProps> = ({ program, onBack }) => {
  const [copied, setCopied] = useState(false);
  const [showCover, setShowCover] = useState(true);

  // Fallback / Defaults to ensure exact Kemendikdasmen structure matches PDF
  const schoolName = program.schoolName || 'Satuan Pendidikan Kemendikdasmen';
  const gradeFase = `${program.gradeLevel || 'Kelas V'} / ${program.phase || 'Fase C'}`;
  const totalJpText = program.allocatedTime || `${program.totalJp || 126} JP`;
  const locationText = program.location || 'Lingkungan satuan pendidikan, lingkungan rumah, Tempat Pengolahan Sampah Terpadu (TPST) / Bank Sampah / Komunitas Mitra';
  const shapeFormText = program.form || 'Kolaboratif Lintas Disiplin Ilmu';

  // Section D Stages
  const stagesList = program.pedagogicalPractice?.stages || ['Pengenalan', 'Kontekstualisasi', 'Aksi', 'Refleksi', 'Tindak lanjut'];
  const pedagogicalDesc = program.pedagogicalPractice?.description ||
    'Tahap pembelajaran diawali dengan pengenalan, di mana murid diajak mengenali permasalahan atau tema secara mendalam. Selanjutnya, pada tahap kontekstualisasi, Murid menggali permasalahan di lingkungan sekitar melalui kegiatan berbasis penyelidikan. Hasil dari tahap ini menjadi dasar bagi aksi, yaitu perumusan peran dan pelaksanaan aksi nyata. Tahap berikutnya adalah refleksi, yang bertujuan mengevaluasi dan berbagi hasil aksi. Proses diakhiri dengan tindak lanjut, yakni penyusunan langkah strategis berdasarkan hasil refleksi untuk pengembangan kegiatan selanjutnya.';

  // Section E Lingkungan
  const envDesc = program.learningEnvironment?.description ||
    'Lingkungan pembelajaran dalam kokurikuler ini dirancang untuk membangun budaya belajar kolaboratif, bernalar kritis, komunikatif, reflektif, dan eksploratif dalam memecahkan masalah nyata, sekaligus membiasakan sikap empati, inklusif, nyaman, serta saling menghargai. Murid diberi ruang untuk menyampaikan ide dan berdiskusi secara terbuka di ruang kelas, halaman satuan pendidikan, dan Tempat Pengolahan Sampah Terpadu (TPST), serta melalui ruang virtual (Zoom Meeting atau Google Meet) sebagai sarana pembelajaran digital.';

  // Section F Kemitraan
  const partnersList = program.learningPartnerships?.partners || [
    'Petugas kebersihan satuan pendidikan, dilibatkan dalam kegiatan penyelidikan (narasumber wawancara).',
    'Dinas Lingkungan Hidup / Instansi Pembina terkait, dilibatkan dalam sharing session pada tahap refleksi.',
    'Orang tua murid, dilibatkan saat proses penyelidikan di rumah dan saat kegiatan sosialisasi.',
    'Pegiat lingkungan / tokoh masyarakat setempat, dilibatkan menjadi narasumber.',
    'Narasumber ahli pembuatan media kreatif/kreator konten, dilibatkan dalam kegiatan lokakarya pembuatan media kreatif.'
  ];
  const partnerNote = program.learningPartnerships?.note || 'Apabila tidak memungkinkan menghadirkan narasumber dari luar, maka peran tersebut dapat digantikan oleh pendidik.';

  // Section G Pemanfaatan Digital
  const digitalList = program.digitalUtilization || [
    'Pencarian data melalui internet',
    'Ruang rapat virtual (Zoom Meeting atau Google Meet)',
    'Pembuatan media kreatif menggunakan aplikasi desain grafis dan video editing seperti Canva, Capcut, Kinemaster, dan lainnya',
    'Presentasi hasil projek dengan aplikasi bahan tayang seperti PowerPoint, Google Slides, dan Canva'
  ];

  // Section H Matrix Stages
  const matrixStages = program.matrixStages || [
    {
      stage: 'Pengenalan',
      guidingQuestion: '“Apa yang perlu kita tahu tentang permasalahan ini?”',
      activities: [
        { activityNumber: 'Aktivitas 1', duration: '4 JP', title: 'Membuka wawasan tentang materi dasar', summary: 'Eksplorasi wawasan dasar dan jenis masalah' },
        { activityNumber: 'Aktivitas 2', duration: '4 JP', title: 'Menganalisis dampak pengelolaan yang tidak baik', summary: 'Analisis sebab akibat' },
        { activityNumber: 'Aktivitas 3', duration: '8 JP', title: 'Mengamati pengelolaan melalui kunjungan lapangan', summary: 'Kunjungan belajar dan observasi' },
        { activityNumber: 'Aktivitas 4', duration: '6 JP', title: 'Mengenal berbagai praktik baik narasumber', summary: 'Diskusi narasumber ahli' },
        { activityNumber: 'Aktivitas 5', duration: '4 JP', title: 'Mengidentifikasi pengelolaan di lingkungan terdekat', summary: 'Observasi mandiri di rumah' }
      ]
    },
    {
      stage: 'Kontekstualisasi',
      guidingQuestion: '“Bagaimana permasalahan ini di lingkunganku?”',
      activities: [
        { activityNumber: 'Aktivitas 6', duration: '4 JP', title: 'Merancang persiapan penyelidikan masalah di sekolah', summary: 'Penyusunan instrumen' },
        { activityNumber: 'Aktivitas 7-8', duration: '8 JP', title: 'Memahami masalah melalui penyelidikan terstruktur', summary: 'Wawancara dan observasi' },
        { activityNumber: 'Aktivitas 9', duration: '4 JP', title: 'Menyajikan hasil pengamatan dalam tabel & diagram', summary: 'Visualisasi data' },
        { activityNumber: 'Aktivitas 10', duration: '6 JP', title: 'Melakukan persiapan presentasi data penyelidikan', summary: 'Penyusunan bahan tayang' },
        { activityNumber: 'Aktivitas 11', duration: '4 JP', title: 'Mempresentasikan hasil penyelidikan secara komunikatif', summary: 'Presentasi dan asesmen formatif' }
      ]
    },
    {
      stage: 'Aksi',
      guidingQuestion: '“Bagaimana caranya agar semua orang ambil bagian memberikan solusi?”',
      activities: [
        { activityNumber: 'Aktivitas 12-13', duration: '8 JP', title: 'Merumuskan solusi terbaik dan merancang media kreatif', summary: 'Diskusi berjenjang' },
        { activityNumber: 'Aktivitas 14', duration: '6 JP', title: 'Lokakarya pembuatan media kreatif bersama narasumber', summary: 'Pelatihan media' },
        { activityNumber: 'Aktivitas 15', duration: '12 JP', title: 'Proses pembuatan media kreatif dan produk nyata', summary: 'Produksi karya kelompok' },
        { activityNumber: 'Aktivitas 16-18', duration: '14 JP', title: 'Presentasi media kreatif, gallery walk, dan revisi', summary: 'Umpan balik dan revisi' },
        { activityNumber: 'Aktivitas 19', duration: '12 JP', title: 'Proses persiapan pameran dan kepanitiaan', summary: 'Gladi bersih pameran' },
        { activityNumber: 'Aktivitas 20', duration: '6 JP', title: 'Sosialisasi solusi dan pameran Gelar Karya ke warga sekolah', summary: 'Pameran terbuka' }
      ]
    },
    {
      stage: 'Refleksi dan Tindak Lanjut',
      guidingQuestion: '“Apa yang perlu menjadi komitmen bersama terkait masalah ini?”',
      activities: [
        { activityNumber: 'Aktivitas 21', duration: '4 JP', title: 'Merefleksikan pengalaman, keberhasilan, dan kendala sosialisasi', summary: 'Refleksi mendalam' },
        { activityNumber: 'Aktivitas 22', duration: '6 JP', title: 'Memperluas wawasan dialog langsung narasumber DLH/mitra', summary: 'Diskusi penguatan komitmen' },
        { activityNumber: 'Aktivitas 23', duration: '4 JP', title: 'Menyusun komitmen warga satuan pendidikan terkait keberlanjutan', summary: 'Pencanangan piagam komitmen' }
      ]
    }
  ];

  // Section H Detailed Activities
  const detailedStages = program.detailedActivities || [
    {
      stage: 'Tahap Pengenalan',
      activities: [
        {
          number: 'Aktivitas 1',
          title: 'Membuka wawasan tentang tema dan jenis-jenis permasalahan',
          duration: '4 JP',
          preparation: [
            'Pendidik menyiapkan bahan bacaan tentang isu dan pengelolaannya.',
            'Pendidik menyiapkan video pembelajaran inspiratif.'
          ],
          steps: [
            '1. Pendidik menampilkan video permasalahan dan pemantik diskusi kelas.',
            '2. Murid dan pendidik berdiskusi terkait fenomena dalam video.',
            '3. Murid membaca/mengamati sumber belajar yang diberikan pendidik kemudian mendiskusikan kategori masalah.',
            '4. Secara berkelompok murid membuat tabel pengelompokan data awal.',
            '5. Murid bersama kelompok mempresentasikan tabel dan menuliskan refleksinya dalam lembar kerja see-think-wonder.'
          ]
        },
        {
          number: 'Aktivitas 2',
          title: 'Menganalisis dampak pengelolaan yang tidak baik',
          duration: '4 JP',
          preparation: [
            'Pendidik menyiapkan gambar atau foto penumpukan masalah di lingkungan sekitar.',
            'Pendidik menyiapkan kertas kerja peta konsep.'
          ],
          steps: [
            '1. Pendidik menampilkan gambar atau video penumpukan masalah nyata.',
            '2. Pendidik memulai dengan pertanyaan pemantik: "Apa yang terjadi jika masalah dibiarkan menumpuk tanpa penanganan?"',
            '3. Dalam kelompok kecil, murid mencatat dampak yang ditemukan lalu membuat peta konsep sebab-akibat.',
            '4. Setiap kelompok menyampaikan hasil analisis peta konsepnya di depan kelas.',
            '5. Murid menuliskan satu hal penting yang mereka pelajari tentang akibat yang terjadi.'
          ]
        },
        {
          number: 'Aktivitas 3',
          title: 'Mengamati pengelolaan melalui kunjungan lapangan ke lokasi mitra (TPST / Bank Sampah)',
          duration: '8 JP',
          preparation: [
            'Pendidik berkoordinasi dengan pihak mitra terkait teknis kunjungan.',
            'Pendidik menyiapkan lembar observasi kunjungan lapangan.'
          ],
          steps: [
            '1. Pendidik membuka kegiatan dengan menjelaskan tujuan kunjungan belajar.',
            '2. Pendidik memandu keberangkatan menuju lokasi mitra.',
            '3. Pihak mitra memberikan pengantar alur kerja dilanjutkan dengan tanya jawab.',
            '4. Murid bersama kelompok mengamati proses pengelolaan dengan bimbingan pendidik menggunakan lembar observasi.',
            '5. Di akhir kunjungan, pendidik memandu refleksi singkat bersama murid mengenai temuan lapangan.'
          ]
        }
      ]
    },
    {
      stage: 'Tahap Kontekstualisasi',
      activities: [
        {
          number: 'Aktivitas 7 dan 8',
          title: 'Memahami masalah di sekolah melalui penyelidikan dan mencatatkan hasil secara terstruktur',
          duration: '8 JP',
          preparation: [
            'Pendidik menyiapkan panduan wawancara dan instrumen observasi kualitatif/kuantitatif.',
            'Pendidik membagi jadwal observasi dan wawancara narasumber sekolah.'
          ],
          steps: [
            '1. Setiap kelompok menyiapkan rencana penyelidikan yang sudah dibuat dan melakukan penyelidikan terpadu.',
            '2. Kelompok melaksanakan wawancara dengan narasumber terpilih (petugas kebersihan, penjaga sekolah, warga kantin).',
            '3. Murid mengumpulkan data kuantitatif (waktu timbulan, volume, kebiasaan warga) dan data kualitatif (alur proses).',
            '4. Murid mengerjakan lembar kerja penyelidikan yang memadukan data pengamatan dan wawancara sebagai alat asesmen formatif.'
          ],
          assessmentSnippet: {
            type: 'Formatif',
            dimension: 'Penalaran Kritis',
            purpose: 'Murid mampu mengidentifikasi masalah di lingkungan sekitar berdasarkan penyelidikan yang dilakukan (lewat observasi dan wawancara), mengumpulkan informasi yang relevan, dan mencatatkan kesimpulan penyelidikannya.',
            rubricRef: 'Asesmen Pembelajaran bagian Penalaran Kritis',
            instrument: 'Lembar Kerja Penyelidikan dan Catatan Pengamatan Pendidik'
          }
        },
        {
          number: 'Aktivitas 11',
          title: 'Mempresentasikan hasil penyelidikan dengan percaya diri dan komunikatif',
          duration: '4 JP',
          preparation: [
            'Pendidik menyediakan ruang/kelas untuk presentasi dan display.',
            'Pendidik menyiapkan rubrik penilaian presentasi.'
          ],
          steps: [
            '1. Pendidik mengatur urutan kelompok yang akan tampil presentasi.',
            '2. Murid dari tiap kelompok menyampaikan presentasi hasil penyelidikan menggunakan media tabel dan diagram.',
            '3. Pendidik melaksanakan asesmen formatif dimensi komunikasi dan penalaran kritis.',
            '4. Kelompok lain mendengarkan, mencatat poin penting, dan menyiapkan pertanyaan dalam sesi tanya jawab.',
            '5. Pendidik memberikan umpan balik penguatan.'
          ],
          assessmentSnippet: {
            type: 'Formatif',
            dimension: 'Komunikasi',
            purpose: 'Murid mampu mengomunikasikan hasil temuan penyelidikan terkait permasalahan di lingkungan sekitar secara lisan dengan runtut, artikulasi jelas, dan visualisasi data yang mudah dipahami.',
            rubricRef: 'Asesmen Pembelajaran bagian Komunikasi',
            instrument: 'Rubrik Penilaian Presentasi Lisan'
          }
        }
      ]
    },
    {
      stage: 'Tahap Aksi',
      activities: [
        {
          number: 'Aktivitas 12-13',
          title: 'Merumuskan solusi terbaik dan merancang media kreatif untuk mensosialisasikan solusi',
          duration: '8 JP',
          preparation: [
            'Pendidik menempel hasil penyelidikan di area kelas.',
            'Pendidik menyiapkan panduan diskusi berjenjang (individu, pasangan, kelompok kecil, pleno).'
          ],
          steps: [
            '1. Kelas melakukan diskusi berjenjang 4 tahapan untuk menghasilkan 3 solusi terbaik yang disepakati bersama.',
            '2. Pendidik melaksanakan asesmen sumatif penalaran kritis.',
            '3. Setiap kelompok menguji coba rancangan solusi dan memilih media komunikasi kreatif (digital / non-digital).'
          ],
          assessmentSnippet: {
            type: 'Sumatif',
            dimension: 'Penalaran Kritis',
            purpose: 'Murid mampu menyampaikan rumusan solusi yang relevan, kontekstual, dan berbasis data untuk menjawab masalah di lingkungan sekitar.',
            rubricRef: 'Asesmen Pembelajaran bagian Penalaran Kritis',
            instrument: 'Lembar Kerja Diskusi Berjenjang dan Catatan Diskusi Pleno'
          }
        },
        {
          number: 'Aktivitas 20',
          title: 'Sosialisasi solusi masalah menggunakan media kreatif kepada warga satuan pendidikan',
          duration: '6 JP',
          preparation: [
            'Pendidik dan murid menata stan pameran dan tempat sosialisasi.',
            'Memastikan media kreatif siap dipresentasikan.',
            'Mengundang Kepala Sekolah, guru, orang tua, dan perwakilan mitra.'
          ],
          steps: [
            '1. Murid menyampaikan sosialisasi solusi menggunakan media kreatif di stan pameran.',
            '2. Murid berinteraksi aktif dengan pengunjung melalui demonstrasi dan sesi tanya jawab.',
            '3. Pendidik melaksanakan asesmen sumatif dimensi komunikasi.',
            '4. Murid mendokumentasikan kegiatan sosialisasi untuk bahan evaluasi bersama.'
          ],
          assessmentSnippet: {
            type: 'Sumatif',
            dimension: 'Komunikasi',
            purpose: 'Murid mampu menggunakan media kreatif (digital dan non digital) sebagai alat komunikasi non lisan secara efektif, kontekstual, dan orisinal dalam menyampaikan pesan kepada audiens.',
            rubricRef: 'Asesmen Pembelajaran bagian Komunikasi',
            instrument: 'Penilaian Produk Media Kreatif & Pengamatan Unjuk Kerja Pameran'
          }
        }
      ]
    },
    {
      stage: 'Tahap Refleksi dan Tindak Lanjut',
      activities: [
        {
          number: 'Aktivitas 21',
          title: 'Merefleksikan pengalaman, keberhasilan, dan kendala dalam kegiatan sosialisasi',
          duration: '4 JP',
          preparation: [
            'Pendidik menyiapkan ruang diskusi reflektif.',
            'Pendidik menyediakan lembar refleksi sederhana.'
          ],
          steps: [
            '1. Pendidik membuka sesi diskusi reflektif pasca-gelar karya.',
            '2. Murid bersama kelompok mencatat keberhasilan yang dicapai dan kendala yang muncul.',
            '3. Murid secara bergiliran menyampaikan hasil diskusi disertai pengalaman dan rencana perbaikan.',
            '4. Murid menempelkan komitmen pribadi di majalah dinding kelas.'
          ]
        },
        {
          number: 'Aktivitas 23',
          title: 'Menyusun komitmen warga satuan pendidikan terkait keberlanjutan pembiasaan',
          duration: '4 JP',
          preparation: [
            'Pendidik menyiapkan format Lembar Komitmen Bersama.',
            'Pendidik berkoordinasi dengan para wali kelas lain.'
          ],
          steps: [
            '1. Murid melakukan sosialisasi ke kelas-kelas lain untuk menyepakati komitmen bersama.',
            '2. Setiap kelas (dipandu wali kelas) menandatangani lembar komitmen pembiasaan baru.',
            '3. Komitmen diserahkan kepada Kepala Sekolah dan dipajang di area publik sekolah.'
          ]
        }
      ]
    }
  ];

  // Section I Dimension Assessments
  const dimensionGroups = program.dimensionAssessments || (
    program.profileDimensions && program.profileDimensions.length > 0
      ? program.profileDimensions.map(pd => ({
          dimension: pd.dimension,
          subdimensions: ['penyampaian argumentasi', 'pengambilan keputusan', 'penyelesaian masalah'],
          assessments: [
            {
              title: `Asesmen Formatif (Aktivitas 7-8 / Penyelidikan)`,
              skillAssessed: `Identifikasi masalah di lingkungan sekitar berdasarkan pengamatan dan informasi yang relevan pada dimensi ${pd.dimension}`,
              berkembang: `Mampu menyebutkan 1 - 2 masalah namun belum mengaitkan dengan hasil observasi lingkungan sekitar secara mandiri.`,
              cakap: `Mampu menyebutkan 3 - 4 permasalahan dan mengaitkannya dengan hasil pengamatan serta data konkret di lingkungan.`,
              mahir: `Mampu menyebutkan lebih dari 4 masalah secara komprehensif, dilengkapi penjelasan mendalam dan informasi dari berbagai sumber belajar.`
            },
            {
              title: `Asesmen Sumatif (Aktivitas 12 / Perumusan Solusi)`,
              skillAssessed: `Merumuskan solusi terkait masalah di lingkungan sekitar berdasarkan data pada dimensi ${pd.dimension}`,
              berkembang: `Rumusan solusi yang disampaikan belum sesuai dengan data permasalahan lingkungan atau masih bersifat umum.`,
              cakap: `Rumusan solusi yang disampaikan kontekstual, sesuai data, dan mampu menjawab akar masalah di lingkungan terdekat secara logis.`,
              mahir: `Rumusan solusi yang disampaikan orisinil, aplikatif, berbasis data valid, dan diperkaya referensi narasumber serta studi pustaka.`
            }
          ]
        }))
      : [
          {
            dimension: 'Penalaran Kritis',
            subdimensions: ['penyampaian argumentasi', 'pengambilan keputusan', 'penyelesaian masalah'],
            assessments: [
              {
                title: 'Asesmen Formatif (Aktivitas 7-8)',
                skillAssessed: 'Identifikasi masalah sampah di lingkungan sekitar berdasarkan pengamatan dan informasi yang relevan',
                berkembang: 'Mampu menyebutkan 1 - 2 masalah sampah namun tidak mengaitkan dengan hasil observasi lingkungan sekitar',
                cakap: 'Mampu menyebutkan 3-4 permasalahan sampah dan mengaitkan dengan hasil dari pengamatan di lingkungan',
                mahir: 'Mampu menyebutkan lebih dari 4 masalah dan melengkapinya dengan penjelasan dan informasi dari berbagai sumber'
              },
              {
                title: 'Asesmen Formatif (Aktivitas 11)',
                skillAssessed: 'Penyajian data kuantitatif ke dalam bentuk diagram',
                berkembang: 'Menyajikan data mentah dan belum diubah ke bentuk diagram.',
                cakap: 'Mampu menyajikan data secara lengkap dari data mentah ke bentuk diagram.',
                mahir: 'Mampu menyajikan data secara lengkap dari data mentah ke bentuk diagram dengan visualisasi yang rapi, jelas, dan mudah dibaca.'
              },
              {
                title: 'Asesmen Sumatif (Aktivitas 12)',
                skillAssessed: 'Merumuskan solusi terkait masalah sampah di lingkungan sekitar berdasarkan data',
                berkembang: 'Rumusan solusi yang disampaikan belum sesuai dengan permasalahan sampah di lingkungan terdekat atau tidak sesuai dengan data yang disajikan',
                cakap: 'Rumusan solusi yang disampaikan kontekstual, sesuai data, dan mampu menjawab masalah sampah di lingkungan terdekat.',
                mahir: 'Rumusan solusi yang disampaikan orisinil, relevan dengan masalah sampah di sekitar, sesuai data. Ada tambahan penjelasan yang didapat dari sumber-sumber pembelajaran selama kegiatan (narasumber, internet, buku, dll)'
              }
            ]
          },
          {
            dimension: 'Komunikasi',
            subdimensions: ['menyampaikan pesan dengan jelas dan meyakinkan'],
            assessments: [
              {
                title: 'Asesmen Formatif (Aktivitas 11)',
                skillAssessed: 'Mengomunikasikan hasil penyelidikan terkait sampah di lingkungan sekitar secara lisan',
                berkembang: 'Penjelasan hasil penyelidikan kurang runtut, volume suara kurang jelas, pilihan kata tidak tepat/tidak cocok',
                cakap: 'Mampu menjelaskan hasil penyelidikan dengan runtut; volume suara sesuai kebutuhan ruangan; pilihan kata sesuai target audiens.',
                mahir: 'Mampu menjelaskan hasil penyelidikan dengan runtut, kosakata yang digunakan tepat, volume suara sesuai kebutuhan; disertai kontak mata, ekspresi wajah, dan gestur yang mendukung pesan. Penyampaian interaktif, sesuai target audiens.'
              },
              {
                title: 'Asesmen Sumatif (Aktivitas 20)',
                skillAssessed: 'Menggunakan media kreatif (digital dan non digital) sebagai alat komunikasi non lisan',
                berkembang: 'Tidak membuat media kreatif atau media kreatif yang dibuat tidak sesuai konteks.',
                cakap: 'Media kreatif yang dibuat sesuai konteks, mampu mengomunikasikan solusi terkait masalah sampah di lingkungan sekitar.',
                mahir: 'Media kreatif yang dibuat sesuai konteks, menjawab kebutuhan, kuat memunculkan orisinalitas (kekhasan murid), dan efektif menyampaikan pesan kepada audiens.'
              }
            ]
          }
        ]
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocx = () => {
    let docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${program.title}</title>
        <style>
          body { font-family: 'Calibri', 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; color: #111; margin: 20px; }
          h1.doc-title { font-size: 15pt; text-align: center; text-transform: uppercase; font-weight: bold; margin-bottom: 18px; margin-top: 10px; }
          .identity-table { width: 100%; border: none; margin-bottom: 16px; }
          .identity-table td { padding: 2px 4px; vertical-align: top; border: none; font-size: 11pt; }
          h2.section-header { font-size: 11.5pt; font-weight: bold; margin-top: 18px; margin-bottom: 6px; }
          p { margin: 4px 0 8px 0; text-align: justify; }
          ol, ul { margin: 4px 0 8px 20px; padding: 0; }
          li { margin-bottom: 4px; }
          table.data-table { width: 100%; border-collapse: collapse; margin: 10px 0 16px 0; }
          table.data-table th, table.data-table td { border: 1px solid #333; padding: 6px 8px; font-size: 10pt; vertical-align: top; }
          table.data-table th { background-color: #f2f2f2; font-weight: bold; }
          .activity-box { margin-bottom: 12px; border: 1px solid #666; padding: 8px; }
          .activity-title { font-weight: bold; background-color: #d1fae5; padding: 4px 6px; margin-bottom: 6px; }
          .rubric-header { font-weight: bold; background-color: #dbeafe; padding: 4px 6px; margin-top: 8px; }
          .diagram-box { text-align: center; font-weight: bold; margin: 12px 0; padding: 8px; border: 1px dashed #059669; }
        </style>
      </head>
      <body>
        <h1 class="doc-title">${(program.title || 'PERENCANAAN PEMBELAJARAN KOKURIKULER').toUpperCase()}</h1>

        <table class="identity-table">
          <tr><td style="width: 25%;">Nama satuan pendidikan</td><td style="width: 2%;">:</td><td>${schoolName}</td></tr>
          <tr><td>Kelas / Fase</td><td>:</td><td>${gradeFase}</td></tr>
          <tr><td>Bentuk</td><td>:</td><td>${shapeFormText}</td></tr>
          <tr><td>Alokasi Waktu</td><td>:</td><td>${totalJpText}</td></tr>
          <tr><td>Lokasi Kegiatan</td><td>:</td><td>${locationText}</td></tr>
        </table>

        <h2 class="section-header">A. Deskripsi Kokurikuler</h2>
        <p>${program.background}</p>

        <h2 class="section-header">B. Dimensi Profil Lulusan</h2>
        <ol>
          ${program.profileDimensions?.map(d => `<li>${d.dimension}</li>`).join('') || ''}
        </ol>

        <h2 class="section-header">C. Tujuan Pembelajaran</h2>
        <ol>
          ${program.objectives?.map(o => `<li>${o}</li>`).join('') || ''}
        </ol>

        <h2 class="section-header">D. Praktik Pedagogis</h2>
        <p>Praktik pedagogis dalam perencanaan ini menggunakan pembelajaran berbasis projek dengan tahapan sebagai berikut:</p>
        <div class="diagram-box">
          [ ${stagesList.join(' ] ➔ [ ')} ]
        </div>
        <p>${pedagogicalDesc}</p>

        <h2 class="section-header">E. Lingkungan Pembelajaran</h2>
        <p>${envDesc}</p>

        <h2 class="section-header">F. Kemitraan Pembelajaran</h2>
        <ol>
          ${partnersList.map(p => `<li>${p}</li>`).join('')}
        </ol>
        <p><em>Catatan: ${partnerNote}</em></p>

        <h2 class="section-header">G. Pemanfaatan Digital</h2>
        <ol>
          ${digitalList.map(d => `<li>${d}</li>`).join('')}
        </ol>

        <h2 class="section-header">H. Kegiatan Pembelajaran</h2>
        <p>Alur dan aktivitas dalam perencanaan ini bersifat referensi. Satuan pendidikan perlu menyesuaikan dengan konteks, kebutuhan, dan ketersediaan sarana pendukung. Bila ada aktivitas yang tidak memungkinkan untuk dilakukan, satuan pendidikan dapat menggantinya dengan aktivitas lain yang esensinya sama dan tetap kontekstual dengan topik. Berikut alur tahapan aktivitas dalam perencanaan kokurikuler.</p>

        <h3>Tabel Alur Tahapan Aktivitas</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 25%;">Tahapan</th>
              <th style="width: 25%;">Pertanyaan Pemantik</th>
              <th>Daftar Aktivitas & Alokasi JP</th>
            </tr>
          </thead>
          <tbody>
            ${matrixStages.map(ms => `
              <tr>
                <td><strong>${ms.stage}</strong></td>
                <td><em>${ms.guidingQuestion}</em></td>
                <td>
                  ${ms.activities?.map(a => `• <strong>${a.activityNumber} (${a.duration}):</strong> ${a.title}<br/>`).join('')}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3>Rincian Aktivitas Pembelajaran</h3>
        <p>Dari tabel alur tahapan aktivitas di atas, Ibu/Bapak dapat menggunakan referensi rincian tiap aktivitas berikut ini. Di setiap aktivitas, ada referensi sumber belajar dan Lembar Kerja yang dapat digunakan atau dimodifikasi sesuai kebutuhan.</p>

        ${detailedStages.map(ds => `
          <h4 style="font-weight: bold; margin-top: 12px; color: #065f46;">${ds.stage}</h4>
          ${ds.activities?.map(act => `
            <div class="activity-box">
              <div class="activity-title">${act.number}: ${act.title} (Durasi: ${act.duration})</div>
              <p><strong>Persiapan:</strong></p>
              <ul>${act.preparation?.map(prep => `<li>${prep}</li>`).join('')}</ul>
              <p><strong>Pelaksanaan:</strong></p>
              <ol>${act.steps?.map(step => `<li>${step}</li>`).join('')}</ol>
              ${act.assessmentSnippet ? `
                <div style="border-left: 3px solid #2563eb; background-color: #eff6ff; padding: 6px; margin-top: 6px;">
                  <strong>Asesmen ${act.assessmentSnippet.type} ${act.assessmentSnippet.dimension}:</strong><br/>
                  - Tujuan asesmen: ${act.assessmentSnippet.purpose}<br/>
                  - Rubrikasi asesmen dapat dilihat di bagian Asesmen Pembelajaran bagian ${act.assessmentSnippet.dimension}.<br/>
                  - Instrumen: ${act.assessmentSnippet.instrument}
                </div>
              ` : ''}
            </div>
          `).join('')}
        `).join('')}

        <h2 class="section-header">I. Asesmen Pembelajaran</h2>
        <p>Rubrik untuk kegiatan asesmen formatif dan sumatif mengacu pada dokumen Alur Perkembangan Kompetensi Dimensi Profil Lulusan (DPL). Untuk capaian DPL meliputi subdimensi penalaran kritis, komunikasi, dan dimensi terpilih lainnya.</p>
        <p><em>Catatan: Rubrik asesmen formatif dan sumatif berikut dapat dimodifikasi sesuai kebutuhan satuan pendidikan masing-masing.</em></p>

        ${dimensionGroups.map(dg => `
          <h3 style="font-weight: bold; margin-top: 14px; color: #1e3a8a;">Dimensi Profil Lulusan: ${dg.dimension}</h3>
          ${dg.assessments?.map(as => `
            <div class="rubric-header">${as.title}</div>
            <p><strong>Kemampuan yang dinilai:</strong><br/>${as.skillAssessed}</p>
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 33%;">Berkembang</th>
                  <th style="width: 33%;">Cakap</th>
                  <th style="width: 34%;">Mahir</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${as.berkembang}</td>
                  <td>${as.cakap}</td>
                  <td>${as.mahir}</td>
                </tr>
              </tbody>
            </table>
          `).join('')}
        `).join('')}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${program.title.replace(/[^a-zA-Z0-9]/g, '_')}_Kemendikdasmen.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    let fullText = `
${(program.title || 'PERENCANAAN PEMBELAJARAN KOKURIKULER').toUpperCase()}

Nama satuan pendidikan : ${schoolName}
Kelas / Fase           : ${gradeFase}
Bentuk                 : ${shapeFormText}
Alokasi Waktu          : ${totalJpText}
Lokasi Kegiatan        : ${locationText}

A. Deskripsi Kokurikuler
${program.background}

B. Dimensi Profil Lulusan
${program.profileDimensions?.map((d, i) => `${i + 1}. ${d.dimension}`).join('\n') || ''}

C. Tujuan Pembelajaran
${program.objectives?.map((o, i) => `${i + 1}. ${o}`).join('\n') || ''}

D. Praktik Pedagogis
Praktik pedagogis dalam perencanaan ini menggunakan pembelajaran berbasis projek dengan tahapan sebagai berikut:
[ ${stagesList.join(' ] ➔ [ ')} ]

${pedagogicalDesc}

E. Lingkungan Pembelajaran
${envDesc}

F. Kemitraan Pembelajaran
${partnersList.map((p, i) => `${i + 1}. ${p}`).join('\n')}
Catatan: ${partnerNote}

G. Pemanfaatan Digital
${digitalList.map((d, i) => `${i + 1}. ${d}`).join('\n')}

H. Kegiatan Pembelajaran
Alur dan aktivitas dalam perencanaan ini bersifat referensi. Satuan pendidikan perlu menyesuaikan dengan konteks, kebutuhan, dan ketersediaan sarana pendukung.

Rincian Aktivitas Pembelajaran:
${detailedStages.map(ds => `
## ${ds.stage}
${ds.activities?.map(act => `
* ${act.number}: ${act.title} (${act.duration})
Persiapan:
${act.preparation?.map(pr => `- ${pr}`).join('\n')}
Pelaksanaan:
${act.steps?.join('\n')}
${act.assessmentSnippet ? `Asesmen: ${act.assessmentSnippet.type} (${act.assessmentSnippet.dimension})\nTujuan: ${act.assessmentSnippet.purpose}` : ''}
`).join('\n')}
`).join('\n')}

I. Asesmen Pembelajaran
Rubrik untuk kegiatan asesmen formatif dan sumatif mengacu pada dokumen Alur Perkembangan Kompetensi Dimensi Profil Lulusan (DPL).
Catatan: Rubrik asesmen formatif dan sumatif berikut dapat dimodifikasi sesuai kebutuhan satuan pendidikan masing-masing.

${dimensionGroups.map(dg => `
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

  return (
    <div className="space-y-6 pb-20">
      {/* Top Floating Action Bar */}
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
            onClick={() => setShowCover(!showCover)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              showCover ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>{showCover ? 'Sembunyikan Cover' : 'Tampilkan Cover Resmi'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Dokumen'}</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Unduh DOCX (Resmi)</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF (A4)</span>
          </button>
        </div>
      </div>

      {/* Main Publication Container (A4 Printable Layout) */}
      <div className="bg-white max-w-4xl mx-auto p-6 sm:p-14 rounded-3xl border border-slate-300 shadow-xl print:border-none print:shadow-none print:p-0 print:m-0 text-slate-900 leading-relaxed font-sans">
        
        {/* OPTIONAL OFFICIAL COVER PAGE (Halaman 1-2 PDF Style) */}
        {showCover && (
          <div className="border-b-4 border-slate-200 pb-12 mb-12 print:break-after-page">
            <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-b from-emerald-800 via-teal-800 to-slate-900 text-white text-center shadow-lg relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 border border-white/20 text-xs font-bold mb-4">
                <Sprout className="w-4 h-4 text-amber-300" />
                <span>Kemendikdasmen • Pusat Kurikulum dan Pembelajaran</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-emerald-200 mb-2 font-semibold">
                Kokurikuler - Pembelajaran Kolaboratif Lintas Disiplin Ilmu
              </p>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wide my-4 text-white drop-shadow-md">
                “{program.topic || program.title}”
              </h1>
              <div className="inline-block mt-2 px-4 py-1.5 rounded-2xl bg-white text-emerald-950 font-black text-sm uppercase tracking-wider shadow-md">
                {program.gradeLevel || 'Kelas V'} {program.phase ? `(Fase ${program.phase})` : ''}
              </div>

              {/* Informational metadata / tim penyusun */}
              <div className="mt-10 pt-6 border-t border-white/20 text-[11px] text-emerald-100/90 text-left max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <strong className="block text-white">Satuan Pendidikan:</strong>
                  <span>{schoolName}</span>
                </div>
                <div>
                  <strong className="block text-white">Alokasi Waktu Total:</strong>
                  <span>{totalJpText}</span>
                </div>
                <div>
                  <strong className="block text-white">Tema Kokurikuler:</strong>
                  <span>{program.theme}</span>
                </div>
                <div>
                  <strong className="block text-white">Tahun Pelajaran:</strong>
                  <span>{program.academicYear}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            DOKUMEN UTAMA: SUSUNAN RESMI KEMENDIKDASMEN
            (SAMA PERSIS DENGAN FILE LAMPIRAN DARI JUDUL SAMPAI ASESMEN)
           ======================================================== */}
        <div className="space-y-7 text-xs sm:text-sm text-slate-900">
          
          {/* JUDUL UTAMA (ALL CAPS, BOLD, CENTER) */}
          <div className="text-center pt-2 pb-4">
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-950">
              {program.title || (program.topic || 'PERENCANAAN PEMBELAJARAN KOKURIKULER').toUpperCase()}
            </h1>
          </div>

          {/* IDENTITAS PROYEK */}
          <div className="py-2 text-xs sm:text-sm space-y-1.5 border-b border-slate-200 pb-5">
            <div className="grid grid-cols-[180px_16px_1fr] sm:grid-cols-[220px_20px_1fr] items-start">
              <span className="font-normal text-slate-800">Nama satuan pendidikan</span>
              <span>:</span>
              <span className="font-semibold text-slate-950">{schoolName}</span>
            </div>
            <div className="grid grid-cols-[180px_16px_1fr] sm:grid-cols-[220px_20px_1fr] items-start">
              <span className="font-normal text-slate-800">Kelas / Fase</span>
              <span>:</span>
              <span className="font-semibold text-slate-950">{gradeFase}</span>
            </div>
            <div className="grid grid-cols-[180px_16px_1fr] sm:grid-cols-[220px_20px_1fr] items-start">
              <span className="font-normal text-slate-800">Bentuk</span>
              <span>:</span>
              <span className="font-semibold text-slate-950">{shapeFormText}</span>
            </div>
            <div className="grid grid-cols-[180px_16px_1fr] sm:grid-cols-[220px_20px_1fr] items-start">
              <span className="font-normal text-slate-800">Alokasi Waktu</span>
              <span>:</span>
              <span className="font-semibold text-slate-950">{totalJpText}</span>
            </div>
            <div className="grid grid-cols-[180px_16px_1fr] sm:grid-cols-[220px_20px_1fr] items-start">
              <span className="font-normal text-slate-800">Lokasi Kegiatan</span>
              <span>:</span>
              <span className="font-semibold text-slate-950 leading-relaxed">{locationText}</span>
            </div>
          </div>

          {/* A. Deskripsi Kokurikuler */}
          <div className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-950">
              A. Deskripsi Kokurikuler
            </h2>
            <p className="text-slate-800 text-justify leading-relaxed">
              {program.background}
            </p>
          </div>

          {/* B. Dimensi Profil Lulusan */}
          <div className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-950">
              B. Dimensi Profil Lulusan
            </h2>
            <ol className="list-decimal pl-5 space-y-1 text-slate-800 font-medium">
              {program.profileDimensions && program.profileDimensions.length > 0 ? (
                program.profileDimensions.map((dim, i) => (
                  <li key={i}>{dim.dimension}</li>
                ))
              ) : (
                <>
                  <li>Penalaran Kritis</li>
                  <li>Komunikasi</li>
                </>
              )}
            </ol>
          </div>

          {/* C. Tujuan Pembelajaran */}
          <div className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-950">
              C. Tujuan Pembelajaran
            </h2>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-800 leading-relaxed">
              {program.objectives?.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ol>
          </div>

          {/* D. Praktik Pedagogis */}
          <div className="space-y-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-950">
              D. Praktik Pedagogis
            </h2>
            <p className="text-slate-800">
              Praktik pedagogis dalam perencanaan ini menggunakan pembelajaran berbasis projek dengan tahapan sebagai berikut:
            </p>

            {/* Visual 5-Stage Diagram matching page 4 of PDF */}
            <div className="py-2 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-[580px] justify-center">
                {stagesList.map((stageName, idx) => (
                  <React.Fragment key={idx}>
                    <div className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center shadow-xs border border-emerald-500 min-w-[100px]">
                      {stageName}
                    </div>
                    {idx < stagesList.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <p className="text-slate-800 text-justify leading-relaxed">
              {pedagogicalDesc}
            </p>
          </div>

          {/* E. Lingkungan Pembelajaran */}
          <div className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-950">
              E. Lingkungan Pembelajaran
            </h2>
            <p className="text-slate-800 text-justify leading-relaxed">
              {envDesc}
            </p>
          </div>

          {/* F. Kemitraan Pembelajaran */}
          <div className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-950">
              F. Kemitraan Pembelajaran
            </h2>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-800 leading-relaxed">
              {partnersList.map((partnerItem, idx) => (
                <li key={idx}>{partnerItem}</li>
              ))}
            </ol>
            <p className="text-slate-600 italic text-[11px] sm:text-xs mt-1">
              Catatan: {partnerNote}
            </p>
          </div>

          {/* G. Pemanfaatan Digital */}
          <div className="space-y-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-950">
              G. Pemanfaatan Digital
            </h2>
            <ol className="list-decimal pl-5 space-y-1 text-slate-800">
              {digitalList.map((dig, idx) => (
                <li key={idx}>{dig}</li>
              ))}
            </ol>
          </div>

          {/* H. Kegiatan Pembelajaran */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-950">
              H. Kegiatan Pembelajaran
            </h2>
            <p className="text-slate-800 text-justify leading-relaxed">
              Alur dan aktivitas dalam perencanaan ini bersifat referensi. Satuan pendidikan perlu menyesuaikan dengan konteks, kebutuhan, dan ketersediaan sarana pendukung. Bila ada aktivitas yang tidak memungkinkan untuk dilakukan, satuan pendidikan dapat menggantinya dengan aktivitas lain yang esensinya sama dan tetap kontekstual dengan topik. Berikut alur tahapan aktivitas dalam perencanaan kokurikuler.
            </p>

            {/* TABEL ALUR TAHAPAN AKTIVITAS (Page 5-6 PDF Grid Format) */}
            <div className="border border-slate-400 rounded-2xl overflow-hidden shadow-xs my-4">
              {matrixStages.map((stageGroup, sIdx) => (
                <div key={sIdx} className="border-b last:border-b-0 border-slate-300">
                  {/* Stage Heading with Guiding Question */}
                  <div className="bg-slate-100 p-3 border-b border-slate-300">
                    <h4 className="font-extrabold text-slate-950 text-xs sm:text-sm">
                      {stageGroup.stage}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-600 italic mt-0.5">
                      {stageGroup.guidingQuestion}
                    </p>
                  </div>

                  {/* Activity Columns Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-slate-300 bg-white">
                    {stageGroup.activities?.map((act, actIdx) => (
                      <div key={actIdx} className="p-3 text-[11px] flex flex-col justify-between">
                        <div>
                          <strong className="block font-bold text-emerald-950 mb-0.5">
                            {act.activityNumber}
                          </strong>
                          <span className="text-[10px] text-emerald-700 font-semibold block mb-1">
                            ({act.duration})
                          </span>
                          <p className="text-slate-700 leading-snug">
                            {act.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* RINCIAN AKTIVITAS PEMBELAJARAN (Page 6-17 PDF Format) */}
            <div className="pt-4 space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-950">
                  Rincian Aktivitas Pembelajaran
                </h3>
                <p className="text-slate-700 text-xs mt-1 leading-relaxed">
                  Dari tabel alur tahapan aktivitas di atas, Ibu/Bapak dapat menggunakan referensi rincian tiap aktivitas berikut ini. Di setiap aktivitas, ada referensi sumber belajar dan Lembar Kerja yang dapat digunakan atau dimodifikasi sesuai kebutuhan.
                </p>
              </div>

              {detailedStages.map((stageSection, stIdx) => (
                <div key={stIdx} className="space-y-4 pt-2">
                  <h4 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wide border-b-2 border-emerald-600 pb-1">
                    {stageSection.stage}
                  </h4>

                  <div className="space-y-4">
                    {stageSection.activities?.map((item, itIdx) => (
                      <div key={itIdx} className="p-4 rounded-2xl border border-slate-300 bg-slate-50/50 space-y-3">
                        {/* Green Title Header Bar */}
                        <div className="bg-emerald-100/90 text-emerald-950 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between font-bold text-xs sm:text-sm">
                          <span>{item.number}: {item.title}</span>
                          <span className="px-2 py-0.5 bg-emerald-700 text-white rounded-md text-[10px]">
                            Durasi: {item.duration}
                          </span>
                        </div>

                        {/* Persiapan */}
                        {item.preparation && item.preparation.length > 0 && (
                          <div className="text-xs space-y-1">
                            <strong className="text-slate-900 block font-bold">Persiapan:</strong>
                            <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
                              {item.preparation.map((prep, pIdx) => (
                                <li key={pIdx}>{prep}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Pelaksanaan */}
                        {item.steps && item.steps.length > 0 && (
                          <div className="text-xs space-y-1">
                            <strong className="text-slate-900 block font-bold">Pelaksanaan:</strong>
                            <div className="space-y-1 text-slate-800 leading-relaxed">
                              {item.steps.map((st, sIdx) => (
                                <p key={sIdx}>{st}</p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Asesmen Formatif / Sumatif Callout Box if applicable */}
                        {item.assessmentSnippet && (
                          <div className="p-3 bg-blue-50 rounded-xl border-l-4 border-blue-600 text-xs space-y-1">
                            <strong className="text-blue-950 font-bold block">
                              Asesmen {item.assessmentSnippet.type} {item.assessmentSnippet.dimension}:
                            </strong>
                            <p className="text-slate-700">
                              - <strong>Tujuan asesmen:</strong> {item.assessmentSnippet.purpose}
                            </p>
                            <p className="text-slate-700">
                              - <strong>Rubrikasi asesmen:</strong> dapat dilihat di bagian Asesmen Pembelajaran bagian {item.assessmentSnippet.dimension}.
                            </p>
                            <p className="text-slate-700">
                              - <strong>Instrumen / Lembar Kerja:</strong> {item.assessmentSnippet.instrument}.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* I. Asesmen Pembelajaran (Page 18-19 PDF Format) */}
          <div className="space-y-4 pt-4 border-t border-slate-300">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-950">
                I. Asesmen Pembelajaran
              </h2>
              <p className="text-slate-800 text-justify text-xs sm:text-sm mt-1 leading-relaxed">
                Rubrik untuk kegiatan asesmen formatif dan sumatif mengacu pada dokumen Alur Perkembangan Kompetensi Dimensi Profil Lulusan (DPL). Untuk capaian DPL meliputi penalaran kritis, komunikasi, dan dimensi terpilih lainnya sesuai alur tahapan projek.
              </p>
              <p className="text-slate-600 italic text-xs mt-1">
                Catatan: Rubrik asesmen formatif dan sumatif berikut dapat dimodifikasi sesuai kebutuhan satuan pendidikan masing-masing.
              </p>
            </div>

            {/* RUBRIK PER DIMENSI PROFIL LULUSAN (3 Kolom: Berkembang | Cakap | Mahir) */}
            <div className="space-y-6 pt-2">
              {dimensionGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-4">
                  <h3 className="text-sm font-extrabold text-blue-950 border-b border-blue-200 pb-1">
                    Dimensi Profil Lulusan: {group.dimension}
                  </h3>

                  {group.assessments?.map((rubricItem, rIdx) => (
                    <div key={rIdx} className="border border-slate-300 rounded-2xl overflow-hidden shadow-xs">
                      {/* Header Blue Card */}
                      <div className="bg-blue-100/90 text-blue-950 p-3 border-b border-slate-300">
                        <strong className="block text-xs sm:text-sm font-bold">
                          {rubricItem.title}
                        </strong>
                        <div className="text-xs text-slate-700 mt-1">
                          <span className="font-semibold text-blue-900">Kemampuan yang dinilai:</span><br/>
                          <span>{rubricItem.skillAssessed}</span>
                        </div>
                      </div>

                      {/* 3-Column Rubric Table: Berkembang | Cakap | Mahir */}
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                            <th className="p-2.5 text-left border-r border-slate-300 w-1/3 font-bold">
                              Berkembang
                            </th>
                            <th className="p-2.5 text-left border-r border-slate-300 w-1/3 font-bold">
                              Cakap
                            </th>
                            <th className="p-2.5 text-left w-1/3 font-bold">
                              Mahir
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="align-top">
                            <td className="p-3 border-r border-slate-300 text-slate-800 leading-relaxed bg-slate-50/40">
                              {rubricItem.berkembang}
                            </td>
                            <td className="p-3 border-r border-slate-300 text-slate-800 leading-relaxed">
                              {rubricItem.cakap}
                            </td>
                            <td className="p-3 text-slate-800 leading-relaxed bg-emerald-50/30 font-medium">
                              {rubricItem.mahir}
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

          {/* Pengesahan Resmi (Signatures) */}
          <div className="pt-10 border-t border-slate-300 mt-10 text-xs">
            <div className="flex justify-between items-start">
              <div className="text-center w-64">
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala Satuan Pendidikan</p>
                <div className="h-20 flex items-center justify-center text-slate-300 text-[10px] italic">
                  (Tanda Tangan & Cap Sekolah)
                </div>
                <p className="font-bold text-slate-950 underline">Kepala Sekolah, M.Pd.</p>
                <p className="text-slate-600">NIP. 19750812 199903 2 004</p>
              </div>

              <div className="text-center w-64">
                <p>Disusun di {schoolName.split(' ')[0] || 'Sekolah'}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="font-bold">Koordinator Tim Kokurikuler</p>
                <div className="h-20 flex items-center justify-center text-slate-300 text-[10px] italic">
                  (Tanda Tangan Koordinator)
                </div>
                <p className="font-bold text-slate-950 underline">Koordinator Kokurikuler, S.Pd.</p>
                <p className="text-slate-600">NIP. 19900514 201502 1 002</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
