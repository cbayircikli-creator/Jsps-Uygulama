import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { findRank } from '../data/ranks';
import type { Rank } from '../data/types';

const RANK_KEY = 'jsps.rankId';

type ProfileState = {
  /** AsyncStorage'dan okuma tamamlandı mı */
  ready: boolean;
  rank: Rank | undefined;
  setRank: (rankId: string | null) => Promise<void>;
};

const ProfileContext = createContext<ProfileState | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [rankId, setRankId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(RANK_KEY)
      .then(setRankId)
      .catch(() => setRankId(null))
      .finally(() => setReady(true));
  }, []);

  const setRank = useCallback(async (id: string | null) => {
    setRankId(id);
    if (id) await AsyncStorage.setItem(RANK_KEY, id);
    else await AsyncStorage.removeItem(RANK_KEY);
  }, []);

  const value = useMemo(() => ({ ready, rank: findRank(rankId), setRank }), [ready, rankId, setRank]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile, ProfileProvider içinde kullanılmalı');
  return ctx;
}
