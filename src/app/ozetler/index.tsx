import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen, text } from '../../components/ui';
import { summaries } from '../../data/summaries';
import { colors, fonts, paletteColor, radius, shadow, spacing } from '../../theme';

export default function Ozetler() {
  return (
    <Screen>
      <Text style={text.muted}>
        Sınavda en çok soru gelen sayı, süre ve oranlar tek yerde. Her satırın yanında kaynağı yazar.
      </Text>
      {summaries.map((s, i) => {
        const c = paletteColor(i);
        const count = s.groups.reduce((n, g) => n + g.rows.length, 0) + (s.traps?.length ?? 0);
        return (
          <Pressable
            key={s.id}
            onPress={() => router.push(`/ozetler/${s.id}`)}
            style={({ pressed }) => [styles.row, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}
          >
            <View style={[styles.icon, { backgroundColor: c.soft }]}>
              <Ionicons name={s.icon} size={22} color={c.main} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={text.heading}>{s.title}</Text>
              <Text style={text.muted}>{count} bilgi</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.card,
  },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.bold },
});
