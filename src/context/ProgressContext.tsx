import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const PROGRESS_KEY = 'jsps.progress.v1';

export type SubjectScore = { correct: number; total: number };

export type ExamResult = {
  correct: number;
  total: number;
  date: string;
  /** Konu bazlı doğru/toplam */
  bySubject?: Record<string, SubjectScore>;
};

export type ExamMode = 'sinav' | 'calisma' | 'yanlis';

/** Yarım bırakılan denemenin kaldığı yer */
export type ExamDraft = { answers: Record<string, number>; index: number; remaining?: number; updatedAt?: string };

/** Yerel saate göre "YYYY-AA-GG" */
export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Kaydedilen içerik anahtarı: "mevzuat:<id>" veya "karar:<id>" */
export type FavoriteKey = `${'mevzuat' | 'karar'}:${string}`;

type ProgressData = {
  examResults: Record<string, ExamResult[]>;
  knownCards: Record<string, string[]>;
  favorites: FavoriteKey[];
  /** Deneme başına, en son yanlış/boş bırakılan ve henüz doğru çözülmeyen soru id'leri */
  wrongQuestions: Record<string, string[]>;
  /** "<denemeId>:<mod>" anahtarıyla yarım kalan denemeler */
  drafts: Record<string, ExamDraft>;
  /** Gün başına çözülen soru sayısı */
  activity: Record<string, number>;
  dailyGoal: number;
};

const empty: ProgressData = {
  examResults: {},
  knownCards: {},
  favorites: [],
  wrongQuestions: {},
  drafts: {},
  activity: {},
  dailyGoal: 30,
};

type ProgressState = ProgressData & {
  /** Kayıtlı veri okundu mu */
  loaded: boolean;
  addExamResult: (examId: string, result: ExamResult) => void;
  updateWrongQuestions: (examId: string, wrongIds: string[], correctIds: string[]) => void;
  saveDraft: (key: string, draft: ExamDraft | null) => void;
  /** Bir soru ilk kez cevaplandığında çağrılır (günlük hedef ve seri için). */
  recordAnswer: () => void;
  setDailyGoal: (goal: number) => void;
  setCardKnown: (deckId: string, cardId: string, known: boolean) => void;
  resetDeck: (deckId: string) => void;
  toggleFavorite: (key: FavoriteKey) => void;
  isFavorite: (key: FavoriteKey) => boolean;
  clearProgress: () => void;
};

const ProgressContext = createContext<ProgressState | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProgressData>(empty);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PROGRESS_KEY)
      .then((raw) => raw && setData({ ...empty, ...JSON.parse(raw) }))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // Yükleme bitmeden yazarsak kayıtlı veriyi boş veriyle ezeriz.
  useEffect(() => {
    if (loaded) AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(data)).catch(() => {});
  }, [data, loaded]);

  const addExamResult = useCallback((examId: string, result: ExamResult) => {
    setData((d) => ({
      ...d,
      examResults: { ...d.examResults, [examId]: [...(d.examResults[examId] ?? []), result] },
    }));
  }, []);

  const updateWrongQuestions = useCallback((examId: string, wrongIds: string[], correctIds: string[]) => {
    setData((d) => {
      const set = new Set(d.wrongQuestions[examId] ?? []);
      wrongIds.forEach((q) => set.add(q));
      correctIds.forEach((q) => set.delete(q));
      return { ...d, wrongQuestions: { ...d.wrongQuestions, [examId]: [...set] } };
    });
  }, []);

  const saveDraft = useCallback((key: string, draft: ExamDraft | null) => {
    setData((d) => {
      const drafts = { ...d.drafts };
      if (draft) drafts[key] = { ...draft, updatedAt: new Date().toISOString() };
      else delete drafts[key];
      return { ...d, drafts };
    });
  }, []);

  const recordAnswer = useCallback(() => {
    setData((d) => {
      const today = dayKey();
      return { ...d, activity: { ...d.activity, [today]: (d.activity[today] ?? 0) + 1 } };
    });
  }, []);

  const setDailyGoal = useCallback((dailyGoal: number) => setData((d) => ({ ...d, dailyGoal })), []);

  const setCardKnown = useCallback((deckId: string, cardId: string, known: boolean) => {
    setData((d) => {
      const current = new Set(d.knownCards[deckId] ?? []);
      if (known) current.add(cardId);
      else current.delete(cardId);
      return { ...d, knownCards: { ...d.knownCards, [deckId]: [...current] } };
    });
  }, []);

  const resetDeck = useCallback((deckId: string) => {
    setData((d) => ({ ...d, knownCards: { ...d.knownCards, [deckId]: [] } }));
  }, []);

  const toggleFavorite = useCallback((key: FavoriteKey) => {
    setData((d) => ({
      ...d,
      favorites: d.favorites.includes(key) ? d.favorites.filter((f) => f !== key) : [...d.favorites, key],
    }));
  }, []);

  const clearProgress = useCallback(() => setData(empty), []);

  const value = useMemo(
    () => ({
      ...data,
      loaded,
      addExamResult,
      updateWrongQuestions,
      saveDraft,
      recordAnswer,
      setDailyGoal,
      setCardKnown,
      resetDeck,
      toggleFavorite,
      isFavorite: (key: FavoriteKey) => data.favorites.includes(key),
      clearProgress,
    }),
    [data, loaded, addExamResult, updateWrongQuestions, saveDraft, recordAnswer, setDailyGoal, setCardKnown, resetDeck, toggleFavorite, clearProgress],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress, ProgressProvider içinde kullanılmalı');
  return ctx;
}

/** Ana sayfa ve profil için özet istatistikler. */
export function useProgressStats() {
  const { examResults, knownCards, activity, dailyGoal } = useProgress();
  const all = Object.values(examResults).flat();
  const correct = all.reduce((s, r) => s + r.correct, 0);
  const total = all.reduce((s, r) => s + r.total, 0);
  const bySubject: Record<string, SubjectScore> = {};
  for (const r of all) {
    for (const [subject, sc] of Object.entries(r.bySubject ?? {})) {
      const cur = bySubject[subject] ?? { correct: 0, total: 0 };
      bySubject[subject] = { correct: cur.correct + sc.correct, total: cur.total + sc.total };
    }
  }
  return {
    bySubject,
    examsTaken: all.length,
    successRate: total ? Math.round((correct / total) * 100) : null,
    cardsKnown: Object.values(knownCards).reduce((s, ids) => s + ids.length, 0),
    today: activity[dayKey()] ?? 0,
    dailyGoal,
    streak: streakOf(activity),
    /** Son 7 gün, eskiden yeniye */
    week: lastDays(7).map((d) => ({ day: d, count: activity[dayKey(d)] ?? 0 })),
  };
}

function lastDays(n: number) {
  const days: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

/** Üst üste çalışılan gün sayısı. Bugün henüz çalışılmadıysa seri dünden sayılır, bozulmaz. */
function streakOf(activity: Record<string, number>) {
  const d = new Date();
  if (!activity[dayKey(d)]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (activity[dayKey(d)]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
