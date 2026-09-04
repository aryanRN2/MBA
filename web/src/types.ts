export type OptionKey = '1' | '2' | '3' | '4';

export type SectionName = 
  | 'Language Comprehension & Verbal Ability'
  | 'Quantitative Aptitude'
  | 'Logical & Analytical Reasoning'
  | 'Data Interpretation'
  | 'General Knowledge'
  | string;

export interface Question {
  year: number;
  paper_name: string;
  question_number: number;
  question_id: string;
  section: SectionName;
  question: string;
  question_en: string;
  question_hi?: string;
  options: Record<OptionKey, string>;
  correct_option: OptionKey | string;
  correct_answer: string;
  explanation: string;
  chart_image?: string;
}

export interface PaperMeta {
  id: string;
  filename: string;
  year: number;
  title: string;
  subtitle: string;
  questionCount: number;
  totalMarks: number;
  durationMinutes: number;
  isFeatured?: boolean;
}

export type TestMode = 'practice' | 'exam';
export type LanguageView = 'both' | 'en' | 'hi';
