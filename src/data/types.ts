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
  number?: string;
  category: 'Kanun' | 'Yönetmelik' | 'Yönerge' | 'Genelge' | 'Diğer';
  summary: string;
  articles: { no: string; title: string; text: string }[];
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

export type Question = {
  id: string;
  text: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
};

export type PracticeExam = RankScoped & {
  id: string;
  title: string;
  subject: string;
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
