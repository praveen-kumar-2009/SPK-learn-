export type SubjectTitle = 'Biology' | 'Bio-Botany' | 'Bio-Zoology';
export type SubjectId = 'biology' | 'bio-botany' | 'bio-zoology' | 'all';

export interface DiagramHotspot {
  id: string;
  name: string;
  tamilName?: string;
  tamilDescription?: string;
  description: string;
  function: string;
  examNote?: string;
}

export interface DiagramDefinition {
  id: string;
  title: string;
  tamilTitle?: string;
  type: 'ovule' | 'anther' | 'antibody' | 'sperm' | 'pbr322';
  caption: string;
  hotspots: DiagramHotspot[];
}

export interface ScientistInfo {
  name: string;
  discovery: string;
  year?: string;
  portraitSvgType?: 'mendel' | 'darwin' | 'watson_crick' | 'bolivar' | 'generic';
  caption?: string;
  attribution?: string;
  era?: string;
  title?: string;
  quote?: string;
}

export interface SlideImage {
  src?: string;
  alt: string;
  caption?: string;
  attribution?: string;
}

export interface SlideStep {
  title: string;
  explanation: string;
}

export interface SlideInteraction {
  type: 'reveal' | 'checkpoint' | 'diagram_explore';
  data?: any;
}

export type SlideKind =
  | 'title'
  | 'why_it_matters'
  | 'learning_objectives'
  | 'concept'
  | 'content'
  | 'steps'
  | 'process'
  | 'comparison'
  | 'diagram'
  | 'threed'
  | 'scientist'
  | 'scientist_profile'
  | 'experiment'
  | 'checkpoint'
  | 'recap'
  | 'conclusion'
  | 'image'
  | 'interactive';

export type ThreeDModelType =
  | 'dna'
  | 'chloroplast'
  | 'anther'
  | 'ovule'
  | 'antibody'
  | 'sperm'
  | 'pbr322'
  | 'bacteriophage'
  | 'mitochondria'
  | 'neuron'
  | 'cell'
  | 'chromosome'
  | 'virus'
  | 'human_reproduction'
  | 'embryo'
  | 'vegetative_propagule'
  | 'flower_pollination';

export interface ComparisonTableData {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface SourceReference {
  textbook: 'Bio-Botany' | 'Bio-Zoology';
  chapter: number;
  chapterTitle?: string;
  topicNumber?: string;
  pageNumber?: number;
  section?: string;
}

export interface Slide {
  id: string;
  title: string;
  tamilTitle?: string;
  kind: SlideKind;
  body: string;
  subtitle?: string;
  bullets?: string[];
  steps?: SlideStep[];
  images?: SlideImage[];
  scientist?: ScientistInfo;
  scientistProfile?: ScientistInfo;
  diagramType?: 'ovule' | 'anther' | 'antibody' | 'sperm' | 'pbr322';
  diagramTitle?: string;
  diagramHotspots?: {
    id: string;
    name: string;
    tamilName?: string;
    description: string;
    function: string;
    examNote?: string;
    x?: number;
    y?: number;
  }[];
  threeDModel?: ThreeDModelType;
  comparisonTable?: ComparisonTableData;
  doYouKnowFact?: string;
  keyTakeaways?: string[];
  sourceReference?: SourceReference;
  examTip?: string;
  notes?: string;
  speakerNotes?: string;
  tamilNotes?: string;
  checkpoint?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  revealCard?: {
    prompt: string;
    answer: string;
    examTip?: string;
  };
  keyTerms?: {
    term: string;
    definition: string;
  }[];
  illustrationType?: string;
  secondaryIllustrationType?: string;
}

export interface ImportantQuestion {
  id: string;
  marks: 1 | 2 | 3 | 5;
  question: string;
  tamilQuestion?: string;
  answer: string;
  sourceType: 'verified_textbook' | 'practice' | 'public_exam';
  category?: 'book_back' | 'public_exam' | 'high_yield';
  sourceExam?: string; // e.g. "Govt Public Exam Mar 2024", "SCERT Book-Back Q4"
  markingScheme?: string[];
  keyTerms?: string[];
}

export interface QuizOption {
  id: string;
  label: string;
  image?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'image_choice' | 'matching';
  question: string;
  tamilQuestion?: string;
  options: QuizOption[];
  correctOptionIds: string[];
  explanation: string;
  timeLimitSeconds?: number;
}

export interface Topic {
  id: string;
  number: string; // e.g. "1.4", "1.5", "6.3", "10.2"
  title: string;
  tamilTitle?: string;
  learningObjectives: string[];
  estimatedMinutes?: number;
  slides: Slide[];
  importantQuestions: ImportantQuestion[];
  quiz: QuizQuestion[];
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  tamilTitle?: string;
  syllabusReference?: string;
  description?: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  title: SubjectTitle;
  tamilTitle: string;
  description: string;
  themeColor: 'emerald' | 'blue';
  lessons: Lesson[];
}

export interface TimedExamResult {
  id: string;
  subjectId: string;
  score: number;
  total: number;
  accuracy: number;
  timeSpentSeconds: number;
  date: string;
}

export interface UserProgress {
  completedTopics: string[]; // topic IDs
  completedSlides: Record<string, number[]>; // topicId -> slideIndices
  quizAttempts: Record<
    string,
    {
      score: number;
      total: number;
      accuracy: number;
      timeSpent: number;
      date: string;
    }
  >;
  quizScores?: Record<string, { attempts: number; highscore: number }>;
  timedExamResults?: TimedExamResult[];
  streakDays: number;
  lastStudiedDate?: string;
}

export interface AIContext {
  subjectId?: string;
  subjectTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  topicId?: string;
  topicNumber?: string;
  topicTitle?: string;
  slideIndex?: number;
  slideTitle?: string;
  selectedDiagramPart?: string;
  quizScore?: { score: number; total: number; incorrectCount: number };
}

export interface StructuredAIAction {
  action: 'OPEN_SUBJECT' | 'OPEN_LESSON' | 'OPEN_TOPIC' | 'OPEN_SLIDE' | 'TAKE_QUIZ';
  subjectId?: string;
  lessonId?: string;
  topicId?: string;
  topicNumber?: string;
  slideIndex?: number;
}
