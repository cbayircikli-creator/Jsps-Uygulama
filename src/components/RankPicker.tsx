import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useProfile } from '../context/ProfileContext';
import { ranks } from '../data/ranks';
import { colors, font, fonts, radius, spacing } from '../theme';
import { Screen, text, type IconName } from './ui';

const RANK_INFO: Record<string, { icon: IconName; note: string }> = {
  'uzman-cavus': { icon: 'shield-half', note: 'Uzman çavuşluktan astsubaylığa geçiş' },
  astsubay: { icon: 'ribbon', note: 'Sözleşmeliden muvazzafa geçiş' },
  subay: { icon: 'star', note: 'Sözleşmeliden muvazzafa geçiş' },
};

export function RankPicker() {
  const { rank, setRank } = useProfile();

  return (
    <View style={{ gap: spacing.sm }}>
      {ranks.map((r) => {
        const selected = rank?.id === r.id;
        const info = RANK_INFO[r.id];
        return (
          <Pressable
            key={r.id}
            onPress={() => setRank(r.id)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={({ pressed }) => [styles.option, selected && styles.optionSelected, pressed && { opacity: 0.8 }]}
          >
            <View style={[styles.optionIcon, selected && { backgroundColor: 'rgba(255,255,255,0.16)' }]}>
              <Ionicons name={info.icon} size={22} color={selected ? colors.accentBright : colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.optionTitle, selected && { color: '#fff' }]}>{r.name}</Text>
              <Text style={[styles.optionNote, selected && { color: colors.textOnDarkMuted }]}>{info.note}</Text>
            </View>
            <Ionicons
              name={selected ? 'checkmark-circle' : 'ellipse-outline'}
              size={22}
              color={selected ? colors.accentBright : colors.border}
            />
          </Pressable>
        );
      })}
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
        <Text style={text.title}>Hangi sınava hazırlanıyorsun?</Text>
        <Text style={[text.body, { textAlign: 'center', color: colors.textMuted }]}>
          İçerikleri sana göre düzenleyebilmemiz için seç. Profil sekmesinden istediğin zaman değiştirebilirsin.
        </Text>
      </View>
      <RankPicker />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  intro: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.text },
  optionNote: { fontFamily: fonts.medium, fontSize: font.small, color: colors.textMuted },
});
