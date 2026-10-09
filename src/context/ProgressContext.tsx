import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const PROGRESS_KEY = 'jsps.progress.v1';

export type ExamResult = { correct: number; total: number; date: string };

/** Kaydedilen içerik anahtarı: "mevzuat:<id>" veya "karar:<id>" */
export type FavoriteKey = `${'mevzuat' | 'karar'}:${string}`;

type ProgressData = {
  examResults: Record<string, ExamResult[]>;
  knownCards: Record<string, string[]>;
  favorites: FavoriteKey[];
};

const empty: ProgressData = { examResults: {}, knownCards: {}, favorites: [] };

type ProgressState = ProgressData & {
  addExamResult: (examId: string, result: ExamResult) => void;
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
      addExamResult,
      setCardKnown,
      resetDeck,
      toggleFavorite,
      isFavorite: (key: FavoriteKey) => data.favorites.includes(key),
      clearProgress,
    }),
    [data, addExamResult, setCardKnown, resetDeck, toggleFavorite, clearProgress],
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
  const { examResults, knownCards } = useProgress();
  const all = Object.values(examResults).flat();
  const correct = all.reduce((s, r) => s + r.correct, 0);
  const total = all.reduce((s, r) => s + r.total, 0);
  return {
    examsTaken: all.length,
    successRate: total ? Math.round((correct / total) * 100) : null,
    cardsKnown: Object.values(knownCards).reduce((s, ids) => s + ids.length, 0),
  };
}
