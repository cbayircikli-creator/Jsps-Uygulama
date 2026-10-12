import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState, Screen, text } from '../../components/ui';
import { categories, documentsIn, type DocCategory } from '../../data/documents';
import { colors, fonts, radius, shadow, spacing } from '../../theme';

export default function BelgeListesi() {
  const { tur } = useLocalSearchParams<{ tur: string }>();
  const cat = categories.find((c) => c.id === tur);
  if (!cat) return <EmptyState icon="alert-circle-outline" text="Bölüm bulunamadı." />;
  const docs = documentsIn(cat.id as DocCategory);

  return (
    <Screen>
      <Stack.Screen options={{ title: cat.title }} />
      <View style={styles.note}>
        <Ionicons name="information-circle" size={18} color={colors.tintInk.slate} />
        <Text style={[text.muted, { flex: 1 }]}>
          Bunlar biçim örnekleridir. Birliğinizin kullandığı resmî form ve güncel mevzuat esas alınmalıdır.
        </Text>
      </View>
      {docs.map((d) => (
        <Pressable
          key={d.id}
          onPress={() => router.push(`/belge/${d.id}`)}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
        >
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={text.heading}>{d.title}</Text>
            <Text style={text.muted}>{d.summary}</Text>
            {d.basis && <Text style={styles.basis}>{d.basis}</Text>}
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.tint.slate,
    borderRadius: radius.md,
    padding: spacing.md,
  },
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
  basis: { fontFamily: fonts.semibold, fontSize: 11, color: colors.primary },
});
