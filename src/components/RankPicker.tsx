import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useProfile } from '../context/ProfileContext';
import { rankGroups, ranks } from '../data/ranks';
import { colors, font, radius, spacing } from '../theme';
import { Screen, text } from './ui';

export function RankPicker() {
  const { rank, setRank } = useProfile();

  return (
    <View style={{ gap: spacing.lg }}>
      {rankGroups.map((group) => (
        <View key={group.id} style={{ gap: spacing.sm }}>
          <Text style={text.muted}>{group.name.toLocaleUpperCase('tr')}</Text>
          <View style={styles.grid}>
            {ranks
              .filter((r) => r.group === group.id)
              .map((r) => {
                const selected = rank?.id === r.id;
                return (
                  <Pressable
                    key={r.id}
                    onPress={() => setRank(r.id)}
                    style={[styles.chip, selected && styles.chipSelected]}
                  >
                    {selected && <Ionicons name="checkmark" size={16} color="#fff" />}
                    <Text style={[styles.chipText, selected && { color: '#fff' }]}>{r.name}</Text>
                  </Pressable>
                );
              })}
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * Çalışma bölümlerini sarar: kullanıcı henüz rütbe seçmediyse önce rütbesini sorar,
 * seçtiyse içeriği gösterir. Uygulamaya ilk girişte rütbe sorulmaz.
 */
export function RankGate({ children }: { children: ReactNode }) {
  const { ready, rank } = useProfile();

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (rank) return <>{children}</>;

  return (
    <Screen>
      <View style={styles.intro}>
        <Ionicons name="ribbon-outline" size={40} color={colors.primary} />
        <Text style={text.title}>Rütbeniz nedir?</Text>
        <Text style={[text.body, { textAlign: 'center', color: colors.textMuted }]}>
          Denemeleri ve bilgi kartlarını rütbenize göre hazırlayabilmemiz için seçim yapın.
          Daha sonra Profil sekmesinden değiştirebilirsiniz.
        </Text>
      </View>
      <RankPicker />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  intro: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: font.body, color: colors.text },
});
