import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Card, EmptyState, Screen, text } from '../../components/ui';
import { summaries, summaryById } from '../../data/summaries';
import { factExam } from '../../data/factQuestions';
import { colors, font, fonts, paletteColor, radius, spacing } from '../../theme';

export default function OzetDetay() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = summaryById(id);
  if (!s) return <EmptyState icon="alert-circle-outline" text="Özet bulunamadı." />;
  const c = paletteColor(summaries.indexOf(s));

  return (
    <Screen>
      <Stack.Screen options={{ title: s.title }} />
      {s.intro && <Text style={text.body}>{s.intro}</Text>}

      {s.groups.map((g, gi) => (
        <Card key={gi} style={{ gap: 0, paddingVertical: spacing.sm }}>
          {g.title && <Text style={[styles.groupTitle, { color: c.main }]}>{g.title.toLocaleUpperCase('tr')}</Text>}
          {g.rows.map((r, ri) => (
            <View key={ri} style={[styles.row, ri > 0 && styles.divider]}>
              <Text style={styles.label}>{r.label}</Text>
              <Text style={styles.value}>{r.value}</Text>
              {r.source && (
                <View style={[styles.source, { backgroundColor: c.soft }]}>
                  <Text style={[styles.sourceText, { color: c.main }]}>{r.source}</Text>
                </View>
              )}
            </View>
          ))}
        </Card>
      ))}

      {s.traps?.map((t) => (
        <View key={t.title} style={styles.trap}>
          <Ionicons name="alert-circle" size={20} color={colors.accent} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.trapTitle}>{t.title}</Text>
            <Text style={text.body}>{t.text}</Text>
          </View>
        </View>
      ))}

      <Button
        title="Bu bilgilerle soru çöz"
        onPress={() => router.push({ pathname: '/deneme/[id]', params: { id: factExam.id, mod: 'calisma' } })}
      />
      <Text style={[text.muted, { textAlign: 'center' }]}>
        Kaynak: JSPS Sayılar ve Süreler notu. Güncel değişiklikler için Mevzuat sekmesinden resmî metne bakın.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  groupTitle: { fontFamily: fonts.bold, fontSize: font.tiny, letterSpacing: 1.2, paddingTop: spacing.sm, paddingBottom: 4 },
  row: { paddingVertical: spacing.md, gap: 4 },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  label: { fontFamily: fonts.semibold, fontSize: font.small, color: colors.textMuted },
  value: { fontFamily: fonts.bold, fontSize: font.body, lineHeight: 22, color: colors.text },
  source: { alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2, marginTop: 2 },
  sourceText: { fontFamily: fonts.bold, fontSize: font.tiny },
  trap: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  trapTitle: { fontFamily: fonts.bold, fontSize: font.body, color: colors.text },
});
