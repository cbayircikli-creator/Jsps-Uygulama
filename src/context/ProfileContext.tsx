import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { findRank } from '../data/ranks';
import type { Rank } from '../data/types';

const RANK_KEY = 'jsps.rankId';
const ONBOARDED_KEY = 'jsps.onboarded';

type ProfileState = {
  /** AsyncStorage'dan okuma tamamlandı mı */
  ready: boolean;
  rank: Rank | undefined;
  setRank: (rankId: string | null) => Promise<void>;
  /** Karşılama ekranları görüldü mü */
  onboarded: boolean;
  completeOnboarding: () => Promise<void>;
};

const ProfileContext = createContext<ProfileState | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [rankId, setRankId] = useState<string | null>(null);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet([RANK_KEY, ONBOARDED_KEY])
      .then(([[, rank], [, seen]]) => {
        setRankId(rank);
        // Önceki sürümlerde rütbe seçmiş olanlar karşılamayı tekrar görmez.
        setOnboarded(seen === '1' || !!rank);
      })
      .catch(() => setRankId(null))
      .finally(() => setReady(true));
  }, []);

  const completeOnboarding = useCallback(async () => {
    setOnboarded(true);
    await AsyncStorage.setItem(ONBOARDED_KEY, '1').catch(() => {});
  }, []);

  const setRank = useCallback(async (id: string | null) => {
    setRankId(id);
    if (id) await AsyncStorage.setItem(RANK_KEY, id);
    else await AsyncStorage.removeItem(RANK_KEY);
  }, []);

  const value = useMemo(
    () => ({ ready, rank: findRank(rankId), setRank, onboarded, completeOnboarding }),
    [ready, rankId, setRank, onboarded, completeOnboarding],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile, ProfileProvider içinde kullanılmalı');
  return ctx;
}
