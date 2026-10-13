export type UserRole = 'guru' | 'kepala_sekolah' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  schoolName?: string;
  nip?: string;
  subject?: string;
}

export interface SchoolProfile {
  id: string;
  schoolName: string;
  npsn: string;
  address: string;
  district: string;
  city: string;
  province: string;
  headmasterName: string;
  headmasterNip: string;
  teacherName: string;
  teacherNip: string;
}

export interface LearningIdentity {
  gradeLevel: string; // e.g. "Kelas 4 (Fase B)"
  phase: string;      // "Fondasi", "A", "B", "C", "D", "E", "F"
  semester: string;   // "1 (Ganjil)" | "2 (Genap)"
  subject: string;
  academicYear: string;
  allocatedTime: string;
  topic: string;
  studentCount: number;
  characteristics: string;
  facilities: string;
  environmentCondition: string;
}

export interface KkTPItem {
  indicator: string;
  target: string;
}

export interface DimensionSelected {
  dimension: string;
  justification: string;
  behavioralIndicator: string;
}

export interface LearningActivity {
  activity: string;
  teacherAction: string;
  studentAction: string;
}

export interface CorePhase {
  phaseName: string;
  experienceType: 'Memahami' | 'Mengaplikasi' | 'Merefleksi';
  principle: string;
  dimension: string;
  teacherAction: string;
  studentAction: string;
  assessmentUsed: string;
}

export interface RubricLevel {
  aspect: string;
  weight?: string;
  level4: string; // Sangat Baik / Mahir (4)
  level3: string; // Baik / Cakap (3)
  level2: string; // Cukup / Layak (2)
  level1: string; // Perlu Bimbingan / Baru Berkembang (1)
}

export interface ModulAjarDocument {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  phase: string;
  semester: string;
  topic: string;
  allocatedTime: string;
  status: 'draft' | 'submitted' | 'approved' | 'revision';
  schoolInfo: {
    name: string;
    npsn: string;
    address: string;
    district?: string;
    city?: string;
    province?: string;
    teacher: string;
    teacherNip: string;
    headmaster: string;
    headmasterNip: string;
  };
  initialAnalysis: {
    studentCharacteristics: string;
    prerequisites: string;
    learningReadiness: string;
    environmentContext: string;
    facilities: string;
  };
  cp: string;
  tpList: string[];
  kktp: KkTPItem[];
  profileDimensions: DimensionSelected[];
  threePrinciples: {
    conscious: string;
    meaningful: string;
    joyful: string;
  };
  threeExperiences: {
    understand: string;
    apply: string;
    reflect: string;
  };
  fourComponents: {
    pedagogicalPractice: {
      model: string;
      strategyDescription: string;
    };
    learningEnvironment: {
      physical: string;
      social: string;
      psychologicalSafety: string;
    };
    learningPartnership: {
      stakeholders: string[];
      partnershipRole: string;
    };
    digitalUtilization: {
      tools: string[];
      implementation: string;
    };
  };
  differentiation: {
    content: string;
    process: string;
    product: string;
  };
  learningSteps: {
    introduction: {
      duration: string;
      activities: LearningActivity[];
    };
    core: {
      duration: string;
      phases: CorePhase[];
    };
    closing: {
      duration: string;
      activities: LearningActivity[];
    };
  };
  assessments: {
    diagnostic: {
      purpose: string;
      technique: string;
      instrument: string;
      items: string[];
      followUp: string;
    };
    formative: {
      purpose: string;
      technique: string;
      instrument: string;
      indicators: string[];
    };
    summative: {
      technique: string;
      form: string;
      blueprint: string;
      scoringGuide: string;
    };
  };
  rubrics: RubricLevel[];
  remedialAndEnrichment: {
    remedial: {
      diagnosis: string;
      activity: string;
      assessment: string;
    };
    enrichment: {
      target: string;
      activity: string;
      challenge: string;
    };
  };
  teacherReflection: string[];
  studentReflection: string[];
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  authorName?: string;
}

export interface QuestionOption {
  code: string;
  text: string;
}

export interface AssessmentItem {
  number: number;
  type: string;
  cognitiveLevel: string;
  stimulus?: string;
  question: string;
  options?: QuestionOption[];
  answerKey: string;
  explanation: string;
  score: number;
}

export interface QuestionBankDocument {
  id: string;
  assessmentTitle: string;
  subject: string;
  topic: string;
  gradeLevel: string;
  items: AssessmentItem[];
  createdAt: string;
  createdBy: string;
}

export interface KokurikulerActivityItem {
  activityNumber: string;
  duration: string;
  title: string;
  summary: string;
}

export interface KokurikulerStageMatrix {
  stage: string;
  guidingQuestion: string;
  activities: KokurikulerActivityItem[];
}

export interface DetailedActivityItem {
  number: string;
  title: string;
  duration: string;
  preparation: string[];
  steps: string[];
  assessmentSnippet?: {
    type: 'Formatif' | 'Sumatif';
    dimension: string;
    purpose: string;
    rubricRef: string;
    instrument: string;
  };
}

export interface DetailedStageActivities {
  stage: string;
  activities: DetailedActivityItem[];
}

export interface DimensionRubricEntry {
  title: string; // e.g. "Asesmen Formatif (Aktivitas 7-8)"
  skillAssessed: string;
  berkembang: string;
  cakap: string;
  mahir: string;
}

export interface DimensionAssessmentGroup {
  dimension: string;
  subdimensions?: string[];
  assessments: DimensionRubricEntry[];
}

export interface KokurikulerProgramDocument {
  id: string;
  title: string;
  theme: string;
  topic: string;
  phase?: string;
  gradeLevel: string;
  academicYear: string;
  allocatedTime: string;
  totalJp?: number;
  meetingCount?: number;
  finalProduct?: string;
  status: 'draft' | 'submitted' | 'approved' | 'active' | 'completed';
  schoolName: string;
  location?: string;
  form?: string;
  background: string;
  regulatoryBasis: string;
  objectives: string[];
  profileDimensions: { dimension: string; contribution: string }[];
  sevenHabitsIntegration: { habit: string; form: string }[];
  subjectContributions: { subject: string; contribution: string }[];
  pedagogicalPractice?: {
    description: string;
    stages: string[];
  };
  learningEnvironment?: {
    description: string;
    physical?: string;
    virtual?: string;
  };
  learningPartnerships?: {
    partners: string[];
    note?: string;
  };
  digitalUtilization?: string[];
  fiveStages: { stage: string; activities: string; duration: string }[];
  matrixStages?: KokurikulerStageMatrix[];
  detailedActivities?: DetailedStageActivities[];
  dimensionAssessments?: DimensionAssessmentGroup[];
  schedule: {
    meeting: string;
    activity: string;
    duration: string;
    facilitator: string;
    output: string;
  }[];
  teacherRoles: string[];
  studentRoles: string[];
  partnerships: string;
  facilities: string;
  assessments: {
    technique: string;
    rubrics: RubricLevel[];
  };
  reflection: string;
  followUp: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  authorName?: string;
}

export interface ValidationItem {
  item: string;
  passed: boolean;
  note: string;
}

export interface ValidationResult {
  totalScore: number;
  isOptimal: boolean;
  statusMessage: string;
  summary: string;
  checklist: ValidationItem[];
  recommendations: string[];
}
