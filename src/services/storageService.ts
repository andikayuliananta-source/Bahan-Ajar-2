import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../firebase';
import { ModulAjarDocument, KokurikulerProgramDocument, SchoolProfile, UserProfile } from '../types';

const LOCAL_STORAGE_KEY_MODULES = 'pendekar_modul_ajar_list';
const LOCAL_STORAGE_KEY_KOKU = 'pendekar_kokurikuler_list';
const LOCAL_STORAGE_KEY_SCHOOL = 'pendekar_school_profile';
const LOCAL_STORAGE_KEY_USER = 'pendekar_user_profile';

export const DEFAULT_SCHOOL: SchoolProfile = {
  id: 'school-default',
  schoolName: 'SMP Negeri 1 Pembelajaran Mendalam',
  npsn: '20104567',
  address: 'Jl. Merdeka Belajar No. 45',
  district: 'Cilandak',
  city: 'Jakarta Selatan',
  province: 'DKI Jakarta',
  headmasterName: 'Dr. Hj. Siti Nurhasanah, M.Pd.',
  headmasterNip: '19750812 199903 2 004',
  teacherName: 'Andika Yuliananta, S.Pd.',
  teacherNip: '19900514 201502 1 002'
};

export const DEFAULT_USER: UserProfile = {
  id: 'user-andika',
  name: 'Andika Yuliananta, S.Pd.',
  email: 'andika.yuliananta@gmail.com',
  role: 'guru',
  schoolId: 'school-default',
  schoolName: 'SMP Negeri 1 Pembelajaran Mendalam',
  nip: '19900514 201502 1 002',
  subject: 'Ilmu Pengetahuan Alam (IPA)'
};

// Seed sample module for initial experience
export const SAMPLE_MODULE: ModulAjarDocument = {
  id: 'modul-sample-01',
  title: 'Modul Ajar: Interaksi Antarmakhluk Hidup dan Keseimbangan Ekosistem',
  subject: 'Ilmu Pengetahuan Alam (IPA)',
  gradeLevel: 'Kelas 7 (Fase D)',
  phase: 'D',
  semester: '2 (Genap)',
  topic: 'Rantai Makanan dan Jaring-Jaring Kehidupan',
  allocatedTime: '2 x 40 Menit (1 Pertemuan)',
  status: 'approved',
  schoolInfo: {
    name: 'SMP Negeri 1 Pembelajaran Mendalam',
    npsn: '20104567',
    address: 'Jl. Merdeka Belajar No. 45',
    district: 'Cilandak',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    teacher: 'Andika Yuliananta, S.Pd.',
    teacherNip: '19900514 201502 1 002',
    headmaster: 'Dr. Hj. Siti Nurhasanah, M.Pd.',
    headmasterNip: '19750812 199903 2 004'
  },
  initialAnalysis: {
    studentCharacteristics: 'Peserta didik memiliki gaya belajar multimodal, 60% kinestetik dan visual. Senang melakukan penyelidikan langsung di luar kelas.',
    prerequisites: 'Peserta didik telah memahami komponen biotik dan abiotik pada materi sebelumnya.',
    learningReadiness: '80% siap dengan pemahaman konsep biotik/abiotik; 20% membutuhkan sedikit penguatan terminologi.',
    environmentContext: 'Sekolah memiliki taman keanekaragaman hayati dan kolam ikan yang representatif.',
    facilities: 'Kaca pembesar, lembar observasi taman, papan clipboard, LCD proyektor, tayangan video ekosistem sawah.'
  },
  cp: 'Pada akhir Fase D, peserta didik memahami konsep sistem organisasi kehidupan, interaksi antarmakhluk hidup dan lingkungannya, upaya mitigasi perubahan iklim global, serta menerapkan konsep-konsep ini dalam penyelidikan ilmiah untuk menghasilkan solusi masalah lingkungan.',
  tpList: [
    'Peserta didik mampu menganalisis pola interaksi rantai makanan dan jaring-jaring makanan dalam suatu ekosistem secara kritis.',
    'Peserta didik mampu memprediksi dampak kepunahan salah satu populasi organisme terhadap keseimbangan ekosistem dan merumuskan upaya pelestariannya.'
  ],
  kktp: [
    { indicator: 'Mengklasifikasikan peran produsen, konsumen primer, sekunder, tersier, dan dekomposer', target: 'Mampu menyebutkan minimal 4 peran secara tepat' },
    { indicator: 'Menyusun diagram jaring-jaring makanan dari hasil observasi taman sekolah', target: 'Diagram terstruktur dengan arah panah transfer energi yang benar' },
    { indicator: 'Menjelaskan dampak gangguan populasi terhadap rantai makanan', target: 'Penalaran sebab-akibat logis didukung argumen ilmiah' }
  ],
  profileDimensions: [
    {
      dimension: 'Penalaran Kritis',
      justification: 'Menganalisis hubungan sebab-akibat dalam jaring-jaring makanan saat salah satu komponen terganggu membutuhkan daya nalar analitis.',
      behavioralIndicator: 'Mengajukan hipotesis dampak intervensi manusia dan memvalidasi hipotesis dengan data pengamatan.'
    },
    {
      dimension: 'Kolaborasi',
      justification: 'Kegiatan observasi lapangan dilakukan secara beregu dengan pembagian tugas pengamat, pencatat, dan perumus kesimpulan.',
      behavioralIndicator: 'Aktif berdiskusi, saling mendengarkan temuan rekan, dan bertanggung jawab terhadap data tim.'
    },
    {
      dimension: 'Kreativitas',
      justification: 'Menyajikan diagram jaring-jaring makanan dan rancangan poster kampanye penyelamatan satwa lokal.',
      behavioralIndicator: 'Memvisualisasikan alur aliran energi menggunakan media infografis yang menarik dan mudah dipahami.'
    }
  ],
  threePrinciples: {
    conscious: 'Berkesadaran: Murid memahami bahwa kelangsungan hidup manusia bergantung pada keutuhan jaring-jaring ekosistem. Murid membuat peta pikiran target kompetensi hari ini.',
    meaningful: 'Bermakna: Studi kasus dihubungkan dengan merebaknya hama tikus di persawahan sekitar kota akibat perburuan burung hantu dan ular sawah.',
    joyful: 'Menggembirakan: Pembelajaran diawali simulasi peran jaring laba-laba benang wol (Web of Life Game) di mana setiap murid berperan sebagai satu organisme.'
  },
  threeExperiences: {
    understand: 'Peserta didik mengamati fenomena Web of Life game dan tayangan video, kemudian mengidentifikasi konsep produsen, konsumen, dan dekomposer.',
    apply: 'Peserta didik terjun ke taman sekolah dalam kelompok kecil untuk menginventarisasi organisme hidup dan memetakan jaring makanan lokal pada LKPD investigasi.',
    reflect: 'Peserta didik merefleksikan bagaimana tindakan kecil manusia (misal membuang plastik atau membunuh serangga predator) berdampak sistemik pada alam.'
  },
  fourComponents: {
    pedagogicalPractice: {
      model: 'Problem Based Learning (PBL)',
      strategyDescription: '5 Langkah sintaks: 1) Orientasi fenomena ledakan hama; 2) Pengorganisasian tim penyelidik; 3) Observasi taman & studi literatur; 4) Penyusunan diagram & poster solusi; 5) Evaluasi dan refleksi ekologis.'
    },
    learningEnvironment: {
      physical: 'Kombinasi ruang kelas yang sejuk dan area terbuka taman sekolah yang aman.',
      social: 'Iklim kerja sama gotong royong, saling melengkapi catatan observasi antar anggota regu.',
      psychologicalSafety: 'Suasana santai dan penuh apresiasi di mana setiap murid bebas berpendapat.'
    },
    learningPartnership: {
      stakeholders: ['Komite Sekolah / Orang Tua Petani', 'Dinas Kebersihan dan Pertamanan'],
      partnershipRole: 'Narasumber cerita praktik pengendalian hama alami dan pemeliharaan taman ramah serangga.'
    },
    digitalUtilization: {
      tools: ['Canva for Education', 'PhET Interactive Bio-Simulations', 'Google Lens (Identifikasi Spesies)'],
      implementation: 'Murid menggunakan Google Lens untuk mengidentifikasi nama serangga dan tanaman di taman sekolah.'
    }
  },
  differentiation: {
    content: 'Kelompok visual diberikan kartu gambar spesies; kelompok kinestetik mengamati langsung di taman; kelompok auditori mendengarkan rekaman wawancara petani.',
    process: 'Scaffolding terpandu dengan kartu bantu bagi kelompok berkembang; tantangan prediksi rantai makanan ekstrem bagi kelompok mahir.',
    product: 'Murid dapat memilih membuat diagram jaring makanan digital di Canva, miniatur diorama dari bahan daur ulang, atau narasi artikel pendek.'
  },
  learningSteps: {
    introduction: {
      duration: '10 Menit',
      activities: [
        {
          activity: 'Mindful Greeting & Doa',
          teacherAction: 'Menyapa peserta didik dengan senyum, memimpin doa, dan memeriksa kesiapan belajar serta kebersihan lingkungan.',
          studentAction: 'Menjawab salam, berdoa, dan memastikan meja serta sekitar tempat duduk bersih.'
        },
        {
          activity: 'Apersepsi: Web of Life Game',
          teacherAction: 'Mengajak 8 perwakilan murid membentuk lingkaran memegang gulungan benang wol yang saling menyilang mewakili hubungan makan-dimakan.',
          studentAction: 'Memegang benang wol dan merasakan tarikan ketika satu organisme (satu murid) ditarik keluar dari jaring.'
        },
        {
          activity: 'Penyampaian Tujuan & KKTP',
          teacherAction: 'Menjelaskan tujuan belajar hari ini dan mengajak murid menyepakati kriteria keberhasilan.',
          studentAction: 'Mencatat tujuan pembelajaran di buku catatan IPA.'
        }
      ]
    },
    core: {
      duration: '60 Menit',
      phases: [
        {
          phaseName: 'Fase 1: MEMAHAMI (Orientasi Masalah & Konseptualisasi)',
          experienceType: 'Memahami',
          principle: 'Berkesadaran dan Bermakna',
          dimension: 'Penalaran Kritis',
          teacherAction: 'Menayangkan berita singkat mengenai ledakan hama ulat bulu di pemukiman. Mengajukan pertanyaan: "Mengapa burung pemakan ulat tidak ada di sana?"',
          studentAction: 'Menganalisis artikel berita, mengajukan pertanyaan kritis tentang rantai makanan, dan mencatat konsep produsen-konsumen.',
          assessmentUsed: 'Pertanyaan lisan pemantik dan observasi pemahaman awal'
        },
        {
          phaseName: 'Fase 2: MENGAPLIKASI (Investigasi Lapangan Taman Sekolah)',
          experienceType: 'Mengaplikasi',
          principle: 'Menggembirakan dan Bermakna',
          dimension: 'Kolaborasi & Kreativitas',
          teacherAction: 'Mendampingi kelompok bergerak tertib di taman sekolah, memfasilitasi penggunaan Google Lens dan kaca pembesar.',
          studentAction: 'Mencatat minimal 6 organisme berbeda, menentukan perannya dalam ekosistem, dan menggambar draf jaring-jaring makanan pada LKPD.',
          assessmentUsed: 'Penilaian Kinerja Lapangan (Rubrik Pengamatan Ilmiah)'
        },
        {
          phaseName: 'Fase 3: MEREFLEKSI (Gelar Karya & Analisis Keseimbangan)',
          experienceType: 'Merefleksi',
          principle: 'Berkesadaran',
          dimension: 'Komunikasi & Kemandirian',
          teacherAction: 'Memandu sesi Gallery Walk: setiap kelompok memajang draf diagramnya di dinding kelas dan satu anggota bertugas sebagai presenter.',
          studentAction: 'Berkeliling memberikan stiker bintang dan catatan umpan balik membangun kepada karya kelompok lain.',
          assessmentUsed: 'Asesmen Formatif (Penilaian Antar-Teman / Peer Assessment)'
        }
      ]
    },
    closing: {
      duration: '10 Menit',
      activities: [
        {
          activity: 'Refleksi Berkesadaran 3-2-1',
          teacherAction: 'Memandu refleksi: 3 fakta baru yang ditemukan, 2 hal yang paling disyukuri dari alam, 1 komitmen menjaga ekosistem.',
          studentAction: 'Menuliskan refleksi pada lembar post-it dan menempelkannya di Pohon Refleksi Kelas.'
        },
        {
          activity: 'Penguatan & Tindak Lanjut',
          teacherAction: 'Menegaskan kembali pentingnya menjaga keanekaragaman hayati dan mengumumkan topik pertemuan berikutnya: Rantai Makanan di Laut.',
          studentAction: 'Menyimak dengan penuh minat dan bersiap merapikan perlengkapan.'
        },
        {
          activity: 'Doa Penutup & Salam',
          teacherAction: 'Menutup sesi dengan doa syukur atas anugerah alam semesta dan salam penutup.',
          studentAction: 'Berdoa bersama dan menjawab salam dengan santun.'
        }
      ]
    }
  },
  assessments: {
    diagnostic: {
      purpose: 'Mengetahui pemahaman prasyarat mengenai komponen abiotik dan biotik.',
      technique: 'Kuis lisan interaktif lempar bola.',
      instrument: 'Daftar pertanyaan apersepsi.',
      items: [
        'Sebutkan 3 benda abiotik di sekelilingmu yang mutlak dibutuhkan tumbuhan!',
        'Apa yang membedakan tumbuhan hijau dengan hewan dalam memperoleh makanan?'
      ],
      followUp: 'Mengelompokkan murid dengan kemampuan heterogen agar tutor sebaya berjalan optimal.'
    },
    formative: {
      purpose: 'Memantau keterampilan proses sains dan kerja sama saat investigasi taman.',
      technique: 'Lembar observasi unjuk kerja dan penilaian LKPD.',
      instrument: 'Rubrik analitik pengamatan ekologis.',
      indicators: [
        'Akurasi pengelompokan tingkat trofik',
        'Kerapian dan kelogisan alur panah transfer energi',
        'Kekompakan tim dalam menyelesaikan tugas lapangan'
      ]
    },
    summative: {
      technique: 'Tes Pilihan Ganda HOTS dan Evaluasi Studi Kasus',
      form: 'Tes tertulis 5 butir soal HOTS berbasis stimulus studi kasus ekologis.',
      blueprint: 'Mencakup C2 (Pengenalan peran), C4 (Analisis jaring makanan), dan C5 (Evaluasi dampak kepunahan).',
      scoringGuide: 'Skor maksimal 100 dengan batas ketuntasan minimal (KKTP) 75.'
    }
  },
  rubrics: [
    {
      aspect: 'Analisis Jaring-Jaring Makanan',
      weight: '40%',
      level4: 'Diagram sangat akurat, memuat lebih dari 8 interaksi organisme, aliran energi logis, dan penjelasan peran trofik sempurna.',
      level3: 'Diagram akurat, memuat 5-7 interaksi organisme, aliran energi benar dengan penjelasan yang memadai.',
      level2: 'Diagram memuat 3-4 organisme, terdapat 1-2 kesalahan arah panah aliran energi.',
      level1: 'Diagram belum menggambarkan jaring makanan yang saling terhubung dan memerlukan bimbingan penuh.'
    },
    {
      aspect: 'Kolaborasi & Keaktifan Tim',
      weight: '30%',
      level4: 'Semua anggota tim memiliki peran jelas, berkomunikasi positif, dan proaktif menyelesaikan observasi tepat waktu.',
      level3: 'Sebagian besar anggota tim bekerja dengan baik dan saling membantu saat menemukan kesulitan.',
      level2: 'Hanya 1-2 murid yang aktif bekerja, anggota lainnya pasif atau kurang fokus.',
      level1: 'Terjadi konflik internal atau anggota tim tidak mau bekerja sama menyelesaikan tugas.'
    },
    {
      aspect: 'Komunikasi & Presentasi Karya',
      weight: '30%',
      level4: 'Presentasi sangat jelas, artikulasi runtut, menggunakan istilah sains dengan tepat, dan mampu menjawab pertanyaan pengamat dengan percaya diri.',
      level3: 'Presentasi jelas dan menjawab sebagian besar pertanyaan pengamat dengan baik.',
      level2: 'Presentasi masih terbata-bata atau membaca catatan tanpa kontak mata dengan pengamat.',
      level1: 'Belum mampu mempresentasikan hasil karya kepada rekan lain.'
    }
  ],
  remedialAndEnrichment: {
    remedial: {
      diagnosis: 'Bagi murid yang belum mampu menyusun alur rantai makanan dengan arah transfer energi yang benar.',
      activity: 'Bimbingan khusus menggunakan kartu bergambar (flashcard) rantai makanan sederhana 3 trofik.',
      assessment: 'Menyusun kembali 3 rantai makanan baru secara mandiri.'
    },
    enrichment: {
      target: 'Bagi murid yang telah mencapai skor >= 85.',
      activity: 'Menganalisis studi kasus nyata: Dampak masuknya spesies invasif (seperti Ikan Iblis Merah / Red Devil di Danau Toba) terhadap ikan endemik.',
      challenge: 'Menuliskan opini singkat 200 kata mengenai solusi penanganan spesies invasif.'
    }
  },
  teacherReflection: [
    'Apakah permainan Web of Life efektif membangkitkan pemahaman Berkesadaran murid di awal?',
    'Apakah waktu observasi 20 menit di taman sekolah cukup memadai bagi seluruh kelompok?',
    'Bagaimana keterlibatan murid berkebutuhan khusus atau yang pendiam selama kerja tim berlangsung?',
    'Langkah apa yang perlu disempurnakan pada pertemuan berikutnya?'
  ],
  studentReflection: [
    'Hal paling menakjubkan apa yang baru kusadari tentang alam hari ini?',
    'Apa yang akan terjadi jika salah satu hewan kecil di taman sekolah punah?',
    'Bagian aktivitas mana yang paling menyenangkan bagiku?',
    'Apakah aku sudah menjadi rekan satu kelompok yang baik dan bertanggung jawab hari ini?'
  ],
  createdAt: '2026-03-01T08:00:00.000Z',
  updatedAt: '2026-03-01T08:00:00.000Z',
  createdBy: 'Andika Yuliananta, S.Pd.',
  authorName: 'Andika Yuliananta, S.Pd.',
  reviewNotes: 'Disetujui oleh Kepala Sekolah: Perangkat sangat lengkap, sintaks 8-3-3-4 tampak nyata dan kontekstual.'
};

export class StorageService {
  // Load User Profile
  static getUserProfile(): UserProfile {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading user profile:', e);
    }
    return DEFAULT_USER;
  }

  static saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(profile));
    // Also sync to firestore if logged in
    try {
      if (auth.currentUser) {
        setDoc(doc(db, 'users', auth.currentUser.uid), profile, { merge: true }).catch(() => {});
      }
    } catch (e) {}
  }

  // Load School Profile
  static getSchoolProfile(): SchoolProfile {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_SCHOOL);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading school profile:', e);
    }
    return DEFAULT_SCHOOL;
  }

  static saveSchoolProfile(school: SchoolProfile): void {
    localStorage.setItem(LOCAL_STORAGE_KEY_SCHOOL, JSON.stringify(school));
    try {
      if (auth.currentUser) {
        setDoc(doc(db, 'schools', school.id || 'default'), school, { merge: true }).catch(() => {});
      }
    } catch (e) {}
  }

  // Teaching Modules
  static async getModules(): Promise<ModulAjarDocument[]> {
    // Try from local storage first
    let localModules: ModulAjarDocument[] = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_MODULES);
      if (stored) {
        localModules = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Local storage error:', e);
    }

    if (localModules.length === 0) {
      localModules = [SAMPLE_MODULE];
      localStorage.setItem(LOCAL_STORAGE_KEY_MODULES, JSON.stringify(localModules));
    }

    // Try fetching from Firestore if user is authenticated
    try {
      if (auth.currentUser) {
        const querySnapshot = await getDocs(collection(db, 'teaching_modules'));
        const remoteDocs: ModulAjarDocument[] = [];
        querySnapshot.forEach((d) => {
          remoteDocs.push(d.data() as ModulAjarDocument);
        });
        if (remoteDocs.length > 0) {
          // Merge remote with local by ID
          const merged = [...remoteDocs];
          for (const loc of localModules) {
            if (!merged.some(m => m.id === loc.id)) {
              merged.push(loc);
            }
          }
          localStorage.setItem(LOCAL_STORAGE_KEY_MODULES, JSON.stringify(merged));
          return merged;
        }
      }
    } catch (err) {
      console.warn('Firestore load fallback to local:', err);
    }

    return localModules;
  }

  static async saveModule(module: ModulAjarDocument): Promise<void> {
    const modules = await this.getModules();
    const index = modules.findIndex(m => m.id === module.id);
    if (index >= 0) {
      modules[index] = module;
    } else {
      modules.unshift(module);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_MODULES, JSON.stringify(modules));

    // Persist to Firestore if user signed in
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'teaching_modules', module.id), {
          ...module,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (error) {
      console.warn('Firestore sync failed, saved locally:', error);
    }
  }

  static async deleteModule(id: string): Promise<void> {
    const modules = await this.getModules();
    const updated = modules.filter(m => m.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_MODULES, JSON.stringify(updated));

    try {
      if (auth.currentUser) {
        await deleteDoc(doc(db, 'teaching_modules', id));
      }
    } catch (e) {
      console.warn('Firestore delete failed:', e);
    }
  }

  // Kokurikuler Programs
  static async getKokurikulerPrograms(): Promise<KokurikulerProgramDocument[]> {
    let localPrograms: KokurikulerProgramDocument[] = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_KOKU);
      if (stored) {
        localPrograms = JSON.parse(stored);
      }
    } catch (e) {}

    try {
      if (auth.currentUser) {
        const snap = await getDocs(collection(db, 'kokurikuler_programs'));
        const remote: KokurikulerProgramDocument[] = [];
        snap.forEach(d => remote.push(d.data() as KokurikulerProgramDocument));
        if (remote.length > 0) {
          return remote;
        }
      }
    } catch (e) {}

    return localPrograms;
  }

  static async saveKokurikulerProgram(prog: KokurikulerProgramDocument): Promise<void> {
    const programs = await this.getKokurikulerPrograms();
    const index = programs.findIndex(p => p.id === prog.id);
    if (index >= 0) {
      programs[index] = prog;
    } else {
      programs.unshift(prog);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_KOKU, JSON.stringify(programs));

    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'kokurikuler_programs', prog.id), {
          ...prog,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore save kokurikuler error:', e);
    }
  }

  static async deleteKokurikulerProgram(id: string): Promise<void> {
    const programs = await this.getKokurikulerPrograms();
    const updated = programs.filter(p => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY_KOKU, JSON.stringify(updated));

    try {
      if (auth.currentUser) {
        await deleteDoc(doc(db, 'kokurikuler_programs', id));
      }
    } catch (e) {}
  }
}
