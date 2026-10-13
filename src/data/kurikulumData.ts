export interface SubjectCatalogItem {
  id: string;
  name: string;
  phase: string;
  gradeLevels: string[];
  defaultTopic: string;
  cp: string;
}

export const OFFICIAL_CP_CATALOG: SubjectCatalogItem[] = [
  // PAUD (Fase Fondasi)
  {
    id: 'paud-jati-diri',
    name: 'Jati Diri (PAUD)',
    phase: 'Fondasi',
    gradeLevels: ['TK A', 'TK B', 'KB'],
    defaultTopic: 'Aku Sayang Diri Sendiri dan Teman-Teman',
    cp: 'Anak mengenali, mengekspresikan, dan mengelola emosi diri serta membangun hubungan sosial secara sehat. Anak mengenal dan memiliki perilaku positif terhadap diri dan lingkungan (keluarga, sekolah, masyarakat, kebangsaan) serta rasa bangga sebagai anak Indonesia yang berlandaskan Pancasila.'
  },
  {
    id: 'paud-literasi-steam',
    name: 'Dasar-Dasar Literasi dan STEAM (PAUD)',
    phase: 'Fondasi',
    gradeLevels: ['TK A', 'TK B'],
    defaultTopic: 'Menjelajah Alam Sekitar Sekolah Melalui Eksplorasi Indra',
    cp: 'Anak menunjukkan kemampuan mengenali dan memahami berbagai informasi, mengomunikasikan perasaan dan pikiran secara lisan, tulisan, atau menggunakan berbagai media serta membangun percakapan. Anak menunjukkan rasa ingin tahu melalui observasi, eksplorasi, dan eksperimen dengan memanfaatkan teknologi ramah anak dan bahan sekitar.'
  },

  // SD (Fase A - Kelas 1-2)
  {
    id: 'sd-fasea-bindo',
    name: 'Bahasa Indonesia (Fase A - Kelas 1-2)',
    phase: 'A',
    gradeLevels: ['Kelas 1', 'Kelas 2'],
    defaultTopic: 'Mengenal Kosakata Baru dan Menyimak Cerita Bergambar',
    cp: 'Peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar, kepada teman sebaya dan orang dewasa di sekitar terkait diri dan lingkungan sekitarnya melalui berbagai bentuk teks (lisan, tulisan, visual). Peserta didik mampu menyimak instruksi sederhana, membaca kata-kata yang dikenali, dan menulis beberapa kalimat sederhana.'
  },
  {
    id: 'sd-fasea-mat',
    name: 'Matematika (Fase A - Kelas 1-2)',
    phase: 'A',
    gradeLevels: ['Kelas 1', 'Kelas 2'],
    defaultTopic: 'Penjumlahan dan Pengurangan Kontekstual sampai 20',
    cp: 'Pada akhir Fase A, peserta didik menunjukkan pemahaman dan intuisi bilangan (number sense) pada bilangan cacah sampai 100, dapat membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, serta melakukan komposisi (menyusun) dan dekomposisi (mengurai) bilangan cacah sampai 20 menggunakan benda konkret.'
  },

  // SD (Fase B - Kelas 3-4)
  {
    id: 'sd-faseb-ipas',
    name: 'IPAS (Fase B - Kelas 3-4)',
    phase: 'B',
    gradeLevels: ['Kelas 3', 'Kelas 4'],
    defaultTopic: 'Wujud Zat dan Perubahannya dalam Kehidupan Sehari-hari',
    cp: 'Pada akhir Fase B, peserta didik mengidentifikasi keterkaitan antara bentuk serta fungsi bagian tubuh pada manusia (pancaindra). Peserta didik dapat membuat simulasi menggunakan bagan/alat bantu sederhana tentang siklus hidup makhluk hidup, wujud zat dan perubahannya, serta mengidentifikasi proses perubahan wujud zat yang terjadi di lingkungan sekitar.'
  },
  {
    id: 'sd-faseb-pancasila',
    name: 'Pendidikan Pancasila (Fase B - Kelas 3-4)',
    phase: 'B',
    gradeLevels: ['Kelas 3', 'Kelas 4'],
    defaultTopic: 'Membangun Kebersamaan dalam Keberagaman di Sekolah',
    cp: 'Peserta didik mampu memahami dan menyajikan hubungan antarsila Pancasila dalam kehidupan sehari-hari; mengenali makna lambang Garuda Pancasila; mematuhi norma, aturan, dan hak serta kewajiban dalam keluarga dan sekolah; serta menghargai keragaman suku bangsa, sosial, dan budaya di lingkungan tempat tinggal.'
  },

  // SD (Fase C - Kelas 5-6)
  {
    id: 'sd-fasec-ipas',
    name: 'IPAS (Fase C - Kelas 5-6)',
    phase: 'C',
    gradeLevels: ['Kelas 5', 'Kelas 6'],
    defaultTopic: 'Harmoni dalam Ekosistem: Jaring-Jaring Makanan dan Dampak Manusia',
    cp: 'Peserta didik memahami sistem organ tubuh manusia yang dikaitkan dengan cara menjaga kesehatan tubuhnya; hubungan antarmakhluk hidup dan lingkungannya dalam ekosistem; keterkaitan antara kegiatan manusia dengan masalah lingkungan (pemanasan global, deforestasi, sampah plastik) serta upaya solusinya.'
  },
  {
    id: 'sd-fasec-mat',
    name: 'Matematika (Fase C - Kelas 5-6)',
    phase: 'C',
    gradeLevels: ['Kelas 5', 'Kelas 6'],
    defaultTopic: 'Operasi Hitung Pecahan dan Penerapannya dalam Masalah Nyata',
    cp: 'Peserta didik dapat menunjukkan pemahaman dan intuisi bilangan pada bilangan cacah sampai 1.000.000, melakukan operasi perkalian dan pembagian, serta membandingkan dan mengurutkan berbagai pecahan termasuk pecahan campuran, melakukan penjumlahan dan pengurangan pecahan, serta desimal dalam pemecahan masalah kontekstual.'
  },

  // SMP (Fase D - Kelas 7-9)
  {
    id: 'smp-fased-ipa',
    name: 'Ilmu Pengetahuan Alam (Fase D - Kelas 7-9)',
    phase: 'D',
    gradeLevels: ['Kelas 7', 'Kelas 8', 'Kelas 9'],
    defaultTopic: 'Interaksi Makhluk Hidup dengan Lingkungan dan Perubahan Iklim',
    cp: 'Pada akhir Fase D, peserta didik memahami konsep sistem organisasi kehidupan, interaksi antarmakhluk hidup dan lingkungannya, upaya mitigasi perubahan iklim global, pewarisan sifat, getaran, gelombang, cahaya, zat aditif, kelistrikan, kemagnetan, serta menerapkan konsep-konsep ini dalam penyelidikan ilmiah untuk menghasilkan solusi masalah lingkungan.'
  },
  {
    id: 'smp-fased-ips',
    name: 'Ilmu Pengetahuan Sosial (Fase D - Kelas 7-9)',
    phase: 'D',
    gradeLevels: ['Kelas 7', 'Kelas 8', 'Kelas 9'],
    defaultTopic: 'Kondisi Geografis dan Keberagaman Potensi Ekonomi Daerah',
    cp: 'Peserta didik memahami keberagaman kondisi geografis Indonesia, konektivitas antarruang, interaksi sosial, dinamika kebudayaan, serta aktivitas ekonomi masyarakat (produksi, distribusi, konsumsi) dalam rangka memenuhi kebutuhan hidup yang berkelanjutan.'
  },
  {
    id: 'smp-fased-bindo',
    name: 'Bahasa Indonesia (Fase D - Kelas 7-9)',
    phase: 'D',
    gradeLevels: ['Kelas 7', 'Kelas 8', 'Kelas 9'],
    defaultTopic: 'Menulis Teks Eksplanasi Fenomena Sosial dan Alam',
    cp: 'Peserta didik mampu menyimak, membaca, memirsa, berbicara, dan mempresentasikan gagasan, pesan, serta pendapat secara kritis dan kreatif dalam berbagai jenis teks (deskripsi, narasi, prosedur, eksplanasi, eksposisi, dan diskusi) untuk tujuan akademis dan sosial di era digital.'
  },
  {
    id: 'smp-fased-mat',
    name: 'Matematika (Fase D - Kelas 7-9)',
    phase: 'D',
    gradeLevels: ['Kelas 7', 'Kelas 8', 'Kelas 9'],
    defaultTopic: 'Persamaan Linear Satu Variabel dan Penerapannya',
    cp: 'Peserta didik dapat mengenali, memprediksi, dan menggeneralisasi pola dalam bentuk susunan benda dan bilangan. Mereka dapat menyatakan suatu situasi ke dalam bentuk aljabar dan menggunakan persamaan serta pertidaksamaan linear satu variabel untuk menyelesaikan masalah kehidupan sehari-hari.'
  },
  {
    id: 'smp-fased-binggris',
    name: 'Bahasa Inggris (Fase D - Kelas 7-9)',
    phase: 'D',
    gradeLevels: ['Kelas 7', 'Kelas 8', 'Kelas 9'],
    defaultTopic: 'Descriptive & Report Text about Local Cultural Heritage',
    cp: 'By the end of Phase D, students use English to interact and exchange ideas, experiences, and information in diverse contexts. They understand and produce oral and written texts (narrative, recount, descriptive, procedure) using simple and compound sentences with appropriate vocabulary and structures.'
  },
  {
    id: 'smp-fased-infor',
    name: 'Informatika (Fase D - Kelas 7-9)',
    phase: 'D',
    gradeLevels: ['Kelas 7', 'Kelas 8', 'Kelas 9'],
    defaultTopic: 'Berpikir Komputasional dan Pemecahan Masalah dengan Algoritma',
    cp: 'Peserta didik mampu menerapkan berpikir komputasional untuk menghasilkan solusi dari persoalan dengan data diskrit bervolume kecil; memanfaatkan perkakas TIK untuk berkomunikasi, mencari informasi, dan membuat karya digital secara etis dan aman.'
  },

  // SMA/SMK (Fase E - Kelas 10)
  {
    id: 'sma-fasee-biologi',
    name: 'Biologi (Fase E - Kelas 10)',
    phase: 'E',
    gradeLevels: ['Kelas 10'],
    defaultTopic: 'Keanekaragaman Hayati Indonesia dan Upaya Pelestariannya',
    cp: 'Pada akhir Fase E, peserta didik memiliki kemampuan mengamati, menanya, merencanakan dan melakukan penyelidikan, memproses, menganalisis data dan informasi, mengevaluasi dan refleksi, serta mengomunikasikan hasil penyelidikan terkait keanekaragaman hayati, virus, bioteknologi, ekosistem, dan perubahan lingkungan hidup.'
  },
  {
    id: 'sma-fasee-fisika',
    name: 'Fisika (Fase E - Kelas 10)',
    phase: 'E',
    gradeLevels: ['Kelas 10'],
    defaultTopic: 'Energi Terbarukan dan Pemanfaatannya dalam Kehidupan',
    cp: 'Peserta didik mampu memahami konsep pengukuran, energi alternatif dan perubahannya dalam kehidupan sehari-hari, menganalisis sumber-sumber energi terbarukan di Indonesia, serta merancang prototipe sederhana pemanfaatan energi ramah lingkungan.'
  },
  {
    id: 'sma-fasee-kimia',
    name: 'Kimia (Fase E - Kelas 10)',
    phase: 'E',
    gradeLevels: ['Kelas 10'],
    defaultTopic: 'Prinsip Kimia Hijau (Green Chemistry) dalam Pembangunan Berkelanjutan',
    cp: 'Peserta didik mampu memahami struktur atom, sistem periodik unsur, ikatan kimia, serta menerapkan 12 prinsip kimia hijau dalam kehidupan sehari-hari untuk mengurangi dampak pencemaran lingkungan.'
  },

  // SMA/SMK (Fase F - Kelas 11-12)
  {
    id: 'sma-fasef-ekonomi',
    name: 'Ekonomi (Fase F - Kelas 11-12)',
    phase: 'F',
    gradeLevels: ['Kelas 11', 'Kelas 12'],
    defaultTopic: 'Pendapatan Nasional, Pertumbuhan Ekonomi, dan APBN',
    cp: 'Peserta didik mampu menganalisis konsep pendapatan nasional, ketenagakerjaan, inflasi, kebijakan fiskal dan moneter, sistem pembayaran, serta perdagangan internasional dalam mendorong pembangunan ekonomi inklusif.'
  }
];

export const PROFILE_DIMENSIONS_8 = [
  {
    id: 'd1',
    name: 'Keimanan dan Ketakwaan terhadap Tuhan YME',
    shortName: 'Iman & Takwa',
    description: 'Menumbuhkan akhlak mulia dalam beragama, akhlak pribadi, akhlak kepada sesama manusia, alam, dan negara.',
    indicators: [
      'Menunjukkan rasa syukur atas ciptaan Tuhan dalam pembelajaran.',
      'Menjaga integritas, kejujuran akademis, dan etika berperilaku.',
      'Merawat lingkungan sekitar sebagai wujud tanggung jawab keimanan.'
    ]
  },
  {
    id: 'd2',
    name: 'Kewargaan',
    shortName: 'Kewargaan',
    description: 'Memahami hak dan kewajiban sebagai warga negara, berpartisipasi aktif dalam kebaikan bersama, dan menghargai keragaman bangsa.',
    indicators: [
      'Menunjukkan kepedulian terhadap permasalahan lingkungan lokal dan nasional.',
      'Menghargai keragaman budaya, agama, suku, dan pendapat teman.',
      'Berpartisipasi aktif dalam pengambilan keputusan kelas secara musyawarah.'
    ]
  },
  {
    id: 'd3',
    name: 'Penalaran Kritis',
    shortName: 'Penalaran Kritis',
    description: 'Mampu memproses informasi secara objektif, menganalisis argumentasi, mengevaluasi bukti, dan menarik kesimpulan rasional.',
    indicators: [
      'Mengidentifikasi dan membedakan fakta dengan opini.',
      'Mengajukan pertanyaan penyelidikan yang mendalam (mengapa & bagaimana).',
      'Mengevaluasi kelebihan dan kelemahan solusi yang diajukan.'
    ]
  },
  {
    id: 'd4',
    name: 'Kreativitas',
    shortName: 'Kreativitas',
    description: 'Mampu memodifikasi dan menghasilkan gagasan orisinal, karya inovatif, serta tindakan bermakna dan berdampak positif.',
    indicators: [
      'Menghasilkan ide-ide orisinal dalam memecahkan masalah kontekstual.',
      'Memodifikasi bahan atau metode yang sudah ada menjadi produk baru yang bernilai.',
      'Mengekspresikan gagasan melalui berbagai media karya yang menarik.'
    ]
  },
  {
    id: 'd5',
    name: 'Kolaborasi',
    shortName: 'Kolaborasi',
    description: 'Bekerja sama secara sinergis, saling mendukung, menghargai peran rekan, dan membangun kesepakatan bersama untuk mencapai tujuan tim.',
    indicators: [
      'Menjalankan peran dan tanggung jawab kelompok secara konsisten.',
      'Mendengarkan dan menghargai masukan teman dalam diskusi.',
      'Membantu rekan yang mengalami kesulitan dalam menyelesaikan tugas tim.'
    ]
  },
  {
    id: 'd6',
    name: 'Kemandirian',
    shortName: 'Kemandirian',
    description: 'Bertanggung jawab atas proses dan hasil belajarnya sendiri melalui regulasi diri, manajemen waktu, dan ketekunan.',
    indicators: [
      'Merencanakan tahapan penyelesaian tugas belajar secara mandiri.',
      'Mengelola waktu dan fokus tanpa harus selalu diingatkan.',
      'Menunjukkan ketekunan saat menghadapi rintangan belajar.'
    ]
  },
  {
    id: 'd7',
    name: 'Kesehatan',
    shortName: 'Kesehatan',
    description: 'Memiliki kesadaran dan kebiasaan menjaga kesehatan fisik, mental, serta kesejahteraan emosional diri dan lingkungan.',
    indicators: [
      'Menerapkan pola hidup bersih dan aman saat beraktivitas belajar.',
      'Mengelola stres dan emosi negatif secara positif.',
      'Mendukung terciptanya lingkungan belajar yang nyaman dan bebas perundungan.'
    ]
  },
  {
    id: 'd8',
    name: 'Komunikasi',
    shortName: 'Komunikasi',
    description: 'Mampu menyampaikan gagasan, perasaan, dan hasil pemikiran secara lisan, tulisan, dan visual dengan santun, jelas, dan persuasif.',
    indicators: [
      'Menyampaikan pendapat dengan bahasa yang santun dan artikulasi jelas.',
      'Menyajikan data atau laporan dengan visualisasi yang mudah dipahami pembaca.',
      'Menjadi pendengar aktif yang responsif terhadap pembicara.'
    ]
  }
];

export const THREE_PRINCIPLES_EXPLANATION = {
  conscious: {
    title: 'BERKESADARAN (Mindful)',
    description: 'Peserta didik memahami dengan jernih apa tujuan belajarnya, mengapa materi tersebut relevan bagi dirinya, bagaimana mengelola proses belajarnya sendiri (self-regulated learning), dan bagaimana mengukur keberhasilan belajarnya.'
  },
  meaningful: {
    title: 'BERMAKNA (Meaningful)',
    description: 'Pengetahuan baru tidak berdiri sendiri sebagai hafalan, melainkan dikaitkan erat dengan pengalaman hidup nyata peserta didik, lingkungan sosialnya, serta dimanfaatkan untuk memecahkan permasalahan nyata di sekitarnya.'
  },
  joyful: {
    title: 'MENGGEMBIRAKAN (Joyful)',
    description: 'Pembelajaran berlangsung dalam iklim kelas yang aman secara psikologis, membangkitkan rasa ingin tahu alami, menghadirkan tantangan yang menstimulasi tanpa menimbulkan frustrasi, serta menumbuhkan motivasi intrinsik.'
  }
};

export const THREE_EXPERIENCES_EXPLANATION = {
  understand: {
    title: 'MEMAHAMI (Membangun Konsep)',
    keywords: ['Mengamati', 'Menanya', 'Mengeksplorasi', 'Menghubungkan'],
    description: 'Peserta didik aktif membangun struktur pengetahuan barunya, mengamati fenomena, mengajukan hipotesis awal, dan mengaitkan pengetahuan prasyarat dengan konsep baru.'
  },
  apply: {
    title: 'MENGAPLIKASI (Praktik & Solusi)',
    keywords: ['Praktik Nyata', 'Investigasi', 'Karya Nyata', 'Problem Solving'],
    description: 'Peserta didik menggunakan pemahaman konsepnya untuk bertindak, memecahkan masalah kontekstual, membuat produk karya inovatif, atau melakukan penyelidikan terpandu.'
  },
  reflect: {
    title: 'MEREFLEKSI (Evaluasi Diri)',
    keywords: ['Evaluasi Proses', 'Identifikasi Kekuatan', 'Solusi Perbaikan', 'Metakognisi'],
    description: 'Peserta didik dan guru merefleksikan proses belajar: apa yang berhasil, kesulitan apa yang dialami, pemahaman apa yang berubah, dan apa rencana perbaikan selanjutnya.'
  }
};

export const FOUR_COMPONENTS_EXPLANATION = {
  pedagogy: {
    title: '1. Praktik Pedagogis',
    models: [
      'Problem Based Learning (PBL)',
      'Project Based Learning (PjBL)',
      'Inquiry-Based Learning',
      'Discovery Learning',
      'Contextual Teaching and Learning (CTL)',
      'Collaborative & Cooperative Learning',
      'Diferensiasi (Konten, Proses, Produk)',
      'Pendekatan STEM / STEAM',
      'Eksperimen & Permainan Edukatif'
    ]
  },
  environment: {
    title: '2. Lingkungan Pembelajaran',
    aspects: [
      'Lingkungan Fisik (tata ruang fleksibel, sirkulasi udara, pencahayaan, kerapian)',
      'Lingkungan Sosial (budaya saling menghargai, kerja sama, bebas diskriminasi)',
      'Lingkungan Psikologis (kebebasan berpendapat tanpa takut salah, aman dari perundungan)'
    ]
  },
  partnership: {
    title: '3. Kemitraan Pembelajaran',
    stakeholders: [
      'Orang Tua / Wali Murid (pendampingan kebiasaan belajar di rumah)',
      'Rekan Sejawat / Guru Lain (kolaborasi lintas disiplin & berbagi praktik baik)',
      'Masyarakat / Komunitas Lokal (narasumber kearifan lokal, bank sampah, seniman)',
      'Dunia Usaha & Industri / Lembaga Terkait (kunjungan edukatif & magang)'
    ]
  },
  digital: {
    title: '4. Pemanfaatan Digital',
    examples: [
      'Video Pembelajaran & Animasi Interaktif (YouTube Edukasi, Khan Academy)',
      'Platform Kolaborasi (Google Classroom, Google Drive, Google Docs)',
      'Asesmen Interaktif (Google Forms, Quizizz, Kahoot)',
      'Simulasi Virtual (PhET Interactive Simulations, GeoGebra)',
      'AI Asisten Belajar (eksplorasi ide dan pengayaan mandiri secara bertanggung jawab)'
    ]
  }
};

export const SEVEN_HABITS_INDONESIA = [
  { id: 'h1', name: 'Bangun Pagi', description: 'Disiplin waktu dan memulai hari dengan kesiapan fisik dan mental prima.' },
  { id: 'h2', name: 'Beribadah', description: 'Menjalankan kewajiban spiritual dan mensyukuri anugerah Tuhan YME.' },
  { id: 'h3', name: 'Berolahraga', description: 'Menjaga kebugaran jasmani dan ketahanan tubuh aktif bergerak.' },
  { id: 'h4', name: 'Gemar Membaca', description: 'Membangun literasi, rasa ingin tahu luas, dan kebiasaan mencari ilmu.' },
  { id: 'h5', name: 'Makan Makanan Sehat & Bergizi', description: 'Memilih asupan gizi seimbang untuk pertumbuhan dan konsentrasi belajar.' },
  { id: 'h6', name: 'Tolong Menolong & Gotong Royong', description: 'Memiliki kepekaan sosial, empati tinggi, dan senang membantu sesama.' },
  { id: 'h7', name: 'Istirahat Cukup', description: 'Menjaga keseimbangan ritme hidup untuk pemulihan energi dan kesehatan otak.' }
];

export const KOKURIKULER_PHASES = [
  { id: 'Fondasi', name: 'Fase Fondasi (PAUD / TK)', defaultGrade: 'TK A & TK B', recJp: 24, recMeetings: 6 },
  { id: 'A', name: 'Fase A (Kelas 1–2 SD)', defaultGrade: 'Kelas 1 & 2 SD', recJp: 30, recMeetings: 8 },
  { id: 'B', name: 'Fase B (Kelas 3–4 SD)', defaultGrade: 'Kelas 3 & 4 SD', recJp: 36, recMeetings: 8 },
  { id: 'C', name: 'Fase C (Kelas 5–6 SD)', defaultGrade: 'Kelas 5 & 6 SD', recJp: 36, recMeetings: 9 },
  { id: 'D', name: 'Fase D (Kelas 7–9 SMP)', defaultGrade: 'Kelas 7, 8, 9 SMP', recJp: 48, recMeetings: 10 },
  { id: 'E', name: 'Fase E (Kelas 10 SMA/SMK)', defaultGrade: 'Kelas 10 SMA/SMK', recJp: 54, recMeetings: 12 },
  { id: 'F', name: 'Fase F (Kelas 11–12 SMA/SMK)', defaultGrade: 'Kelas 11 & 12 SMA/SMK', recJp: 54, recMeetings: 12 },
];

export const STANDARD_SUBJECTS = [
  'IPAS / IPA',
  'Bahasa Indonesia',
  'Matematika',
  'Pendidikan Pancasila',
  'Prakarya',
  'Seni Rupa / Seni Budaya',
  'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)',
  'Informatika',
  'Bahasa Inggris',
  'Ilmu Pengetahuan Sosial (IPS)',
  'Pendidikan Agama & Budi Pekerti',
  'Muatan Lokal / Bahasa Daerah'
];

export const KOKURIKULER_THEMES = [
  { id: 't1', name: 'Gaya Hidup Berkelanjutan', description: 'Memahami dampak aktivitas manusia terhadap lingkungan dan aksi nyata pelestarian alam serta mitigasi iklim.' },
  { id: 't2', name: 'Kewirausahaan', description: 'Menumbuhkan jiwa inovatif, membaca peluang pasar, dan menciptakan nilai tambah ekonomi serta kemandirian.' },
  { id: 't3', name: 'Kearifan Lokal', description: 'Mengeksplorasi dan melestarikan budaya, tradisi, dan nilai-nilai luhur masyarakat setempat.' },
  { id: 't4', name: 'Hidup Sehat', description: 'Membangun kebiasaan pola makan bergizi, kebugaran jasmani, kebersihan diri, dan kesehatan mental.' },
  { id: 't5', name: 'Lingkungan Sekolah', description: 'Menata ekosistem sekolah yang asri, hijau, bersih, bebas sampah, dan nyaman untuk belajar.' },
  { id: 't6', name: 'Budaya Indonesia', description: 'Menghargai warisan seni, sejarah, adat istiadat, dan kekayaan identitas nusantara.' },
  { id: 't7', name: 'Teknologi dan Literasi Digital', description: 'Memanfaatkan perkakas digital, komputasi, dan kecerdasan artifisial secara etis, kreatif, dan bijak.' },
  { id: 't8', name: 'Kebersamaan', description: 'Mempererat tali persaudaraan, toleransi keberagaman, gotong royong, dan empati sosial antarwarga sekolah.' },
  { id: 't9', name: 'Kreativitas', description: 'Mengekspresikan gagasan baru, rekayasa karya inovatif, desain orisinal, dan solusi artistik.' },
  { id: 't10', name: 'Kemandirian', description: 'Melatih regulasi diri, manajemen waktu, inisiatif pribadi, dan tanggung jawab atas tugas mandiri.' },
  { id: 't11', name: 'Bhinneka Tunggal Ika', description: 'Membangun dialog toleransi, menghargai perbedaan latar belakang, dan merajut persatuan.' },
  { id: 't12', name: 'Bangunlah Jiwa dan Raganya', description: 'Menjaga kesehatan fisik dan mental serta pencegahan perundungan (anti-bullying) dan kekerasan.' },
  { id: 't13', name: 'Suara Demokrasi', description: 'Memahami proses musyawarah, pemilu siswa, dan penyampaian aspirasi secara santun dan bertanggung jawab.' },
  { id: 't14', name: 'Rekayasa dan Teknologi', description: 'Merancang dan membuat produk teknologi tepat guna untuk mengatasi permasalahan di lingkungan.' },
  { id: 't15', name: 'Kebekerjaan (SMK/SMA)', description: 'Membangun etos kerja profesional, pemahaman budaya industri, dan kesiapan karir masa depan.' },
  { id: 't_custom', name: 'Tema Lainnya (Kustom Guru)', description: 'Tema khusus yang ditentukan dan dirumuskan sendiri oleh guru sesuai konteks unik satuan pendidikan.' }
];
