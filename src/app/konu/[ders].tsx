import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState, Screen, text } from '../../components/ui';
import { useProgress, type ExamMode } from '../../context/ProgressContext';
import { subjectByKey, topicTests } from '../../services/topicTests';
import { colors, font, fonts, radius, shadow, spacing, subjectColor } from '../../theme';

export default function KonuTestleri() {
  const { ders } = useLocalSearchParams<{ ders: string }>();
  const subject = subjectByKey(ders);
  const { examResults, drafts } = useProgress();

  if (!subject) return <EmptyState icon="alert-circle-outline" text="Ders bulunamadı." />;

  const c = subjectColor(subject.name);
  const tests = topicTests(subject.key);
  const solved = tests.filter((t) => examResults[t.id]?.length).length;
  const open = (id: string, mod: ExamMode) => router.push({ pathname: '/deneme/[id]', params: { id, mod } });

  return (
    <Screen>
      <Stack.Screen options={{ title: subject.name }} />
      <LinearGradient colors={c.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <Text style={styles.heroTitle}>{subject.name} Testleri</Text>
        <Text style={styles.heroSub}>
          {tests.length} test · {solved} tamamlandı
        </Text>
        <View style={styles.heroTrack}>
          <View style={[styles.heroFill, { width: `${tests.length ? (solved / tests.length) * 100 : 0}%` }]} />
        </View>
        <Text style={styles.heroNote}>Testler çalışma modunda açılır; her cevaptan sonra açıklama görünür.</Text>
      </LinearGradient>

      <View style={styles.grid}>
        {tests.map((t) => {
          const last = examResults[t.id]?.at(-1);
          const inProgress = !!drafts[`${t.id}:calisma`];
          const pct = last ? Math.round((last.correct / last.total) * 100) : null;
          return (
            <Pressable
              key={t.id}
              onPress={() => open(t.id, 'calisma')}
              onLongPress={() => open(t.id, 'sinav')}
              style={({ pressed }) => [styles.test, last && { borderColor: c.main }, pressed && styles.pressed]}
            >
              <Text style={[styles.testNo, { color: c.main }]}>{t.no}</Text>
              <Text style={text.muted}>{t.count} soru</Text>
              {pct !== null ? (
                <View style={[styles.badge, { backgroundColor: c.soft }]}>
                  <Ionicons name="checkmark-circle" size={12} color={c.main} />
                  <Text style={[styles.badgeText, { color: c.main }]}>%{pct}</Text>
                </View>
              ) : inProgress ? (
                <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
                  <Ionicons name="play" size={11} color={colors.accent} />
                  <Text style={[styles.badgeText, { color: colors.accent }]}>Devam</Text>
                </View>
              ) : (
                <View style={[styles.badge, { backgroundColor: colors.surfaceAlt }]}>
                  <Text style={[styles.badgeText, { color: colors.textMuted }]}>Yeni</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
      <Text style={[text.muted, { textAlign: 'center' }]}>Süreli sınav olarak çözmek için teste basılı tut.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  hero: { borderRadius: radius.lg, padding: spacing.xl, gap: spacing.xs, ...shadow.raised },
  heroTitle: { color: '#fff', fontFamily: fonts.display, fontSize: 30, lineHeight: 34 },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontFamily: fonts.semibold, fontSize: font.body },
  heroTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  heroFill: { height: '100%', borderRadius: radius.pill, backgroundColor: '#fff' },
  heroNote: { color: 'rgba(255,255,255,0.85)', fontFamily: fonts.medium, fontSize: 12, marginTop: spacing.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  test: {
    width: '31.5%',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.card,
  },
  testNo: { fontFamily: fonts.display, fontSize: 30, lineHeight: 32 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 3, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontFamily: fonts.bold, fontSize: 11 },
});
