export interface RegisterAnswers {
  nomor_surat: string;
  jenis_surat: string;
  tanggal: string;
  perihal: string;
  tujuan_tembusan: string;
  satuan_kerja_konseptor: string;
  keterangan: string;
}

export type QuestionType = 'short_text' | 'long_text' | 'date' | 'dropdown';

export interface Question {
  id: keyof RegisterAnswers;
  title: string;
  type: QuestionType;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface FormConfig {
  title: string;
  description: string;
  questions: Question[];
}

export interface RegisterEntry {
  id: string;
  created_at: string;
  answers: RegisterAnswers;
}
