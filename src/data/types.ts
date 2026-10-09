/** Rütbe grubu: içerikler bu gruplara göre filtrelenir. */
export type RankGroupId = 'uzman-erbas' | 'astsubay' | 'subay';

export type Rank = {
  id: string;
  name: string;
  group: RankGroupId;
};

/**
 * Rütbeye özel içeriklerde `ranks` alanı doldurulur.
 * Boş bırakılırsa içerik herkese gösterilir.
 */
type RankScoped = { ranks?: RankGroupId[] };

export type Legislation = RankScoped & {
  id: string;
  title: string;
  number: string;
  category: 'Kanun' | 'Yönetmelik' | 'Yönerge' | 'Genelge' | 'Diğer';
  /** Soru kaynaklarında geçen kısaltmalar, ör. "CMK" */
  aliases?: string[];
};

export type CourtDecision = RankScoped & {
  id: string;
  court: string;
  reference: string;
  date: string;
  topic: string;
  summary: string;
  tags: string[];
};

export type Announcement = {
  id: string;
  title: string;
  date: string;
  body: string;
  important?: boolean;
};

export type Subject = 'Türkçe' | 'Tarih' | 'Anayasa' | 'Güncel' | 'Muhakeme' | 'Mevzuat';

/** JSPS soruları her zaman 5 şıklıdır (A–E). */
export type Options = [string, string, string, string, string];

export type Question = {
  id: string;
  subject: Subject;
  topic?: string;
  /** Birden fazla soruya ait ortak okuma parçası */
  passage?: string;
  text: string;
  options: Options;
  answerIndex: number;
  explanation?: string;
  /** Her şık için neden yanlış/doğru olduğuna dair kısa not */
  optionNotes?: string[];
  /** Kaynak madde, ör. "5271 sayılı Kanun md. 91" */
  source?: string;
};

export type PracticeExam = RankScoped & {
  id: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
};

export type Flashcard = { id: string; front: string; back: string };

export type FlashcardDeck = RankScoped & {
  id: string;
  title: string;
  subject: string;
  cards: Flashcard[];
};
