import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RankGate } from '../../components/RankPicker';
import { Button, Card, EmptyState, Screen, SectionTitle, text, type IconName } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';
import { useProgress, useProgressStats, type ExamMode } from '../../context/ProgressContext';
import { content } from '../../services/content';
import { SAVED_EXAM_ID } from '../../services/savedQuestions';
import { SUBJECTS, subjectQuestionCount, topicTests } from '../../services/topicTests';
import { colors, font, fonts, paletteColor, radius, shadow, spacing, subjectColor } from '../../theme';

const SUBJECT_ICONS: Record<string, IconName> = {
  Mevzuat: 'library',
  Anayasa: 'flag',
  Tarih: 'hourglass',
  Türkçe: 'chatbubbles',
  Muhakeme: 'bulb',
  Güncel: 'newspaper',
};

export default function Calis() {
  return (
    <RankGate>
      <StudyHome />
    </RankGate>
  );
}

function StudyHome() {
  const { rank } = useProfile();
  const { examResults, knownCards, wrongQuestions, drafts, savedQuestions } = useProgress();
  const { bySubject } = useProgressStats();
  const exams = content.exams(rank?.group);
  const decks = content.decks(rank?.group);
  const subjects = Object.entries(bySubject);

  const open = (id: string, mod: ExamMode) => router.push({ pathname: '/deneme/[id]', params: { id, mod } });

  return (
    <Screen>
      <View style={styles.rankRow}>
        <View style={styles.rankChip}>
          <Ionicons name="shield-checkmark" size={14} color={colors.primary} />
          <Text style={styles.rankText}>{rank?.name}</Text>
        </View>
        <Pressable onPress={() => router.push('/profil')} hitSlop={8}>
          <Text style={styles.link}>Değiştir</Text>
        </Pressable>
      </View>

      <SectionTitle>Konu Testleri</SectionTitle>
      <View style={styles.subjectGrid}>
        {SUBJECTS.map((s) => {
          const c = subjectColor(s.name);
          const count = subjectQuestionCount(s.key);
          return (
            <Pressable
              key={s.key}
              onPress={() => router.push({ pathname: '/konu/[ders]', params: { ders: s.key } })}
              style={({ pressed }) => [styles.subjectTile, pressed && styles.pressed]}
            >
              <LinearGradient colors={c.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.subjectFill}>
                <Ionicons name={SUBJECT_ICONS[s.name]} size={78} color="rgba(255,255,255,0.13)" style={styles.subjectGhost} />
                <Ionicons name={SUBJECT_ICONS[s.name]} size={22} color="#fff" />
                <Text style={styles.subjectName}>{s.name}</Text>
                <Text style={styles.subjectCount}>
                  {count} soru · {topicTests(s.key).length} test
                </Text>
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>

      {savedQuestions.length > 0 && (
        <Pressable
          onPress={() => open(SAVED_EXAM_ID, 'calisma')}
          style={({ pressed }) => [styles.savedRow, pressed && styles.pressed]}
        >
          <View style={styles.savedIcon}>
            <Ionicons name="bookmark" size={18} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={text.heading}>İşaretlediğim Sorular</Text>
            <Text style={text.muted}>{savedQuestions.length} soru tekrar için bekliyor</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
      )}

      <SectionTitle>Denemeler</SectionTitle>
      {exams.length === 0 && <EmptyState icon="document-text-outline" text="Henüz deneme eklenmedi." />}
      {exams.map((e, i) => {
        const results = examResults[e.id] ?? [];
        const last = results.at(-1);
        const best = results.reduce((m, r) => Math.max(m, Math.round((r.correct / r.total) * 100)), 0);
        const wrongCount = wrongQuestions[e.id]?.length ?? 0;
        const c = paletteColor(i);
        return (
          <Card key={e.id}>
            <View style={styles.examHead}>
              <LinearGradient colors={c.gradient} style={styles.examBadge}>
                <Text style={styles.examBadgeText}>{e.questions.length}</Text>
                <Text style={styles.examBadgeSub}>soru</Text>
              </LinearGradient>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={text.heading}>{e.title}</Text>
                <Text style={text.muted}>
                  {e.durationMinutes} dk
                  {last ? ` · Son: ${last.correct}/${last.total} · En iyi: %${best}` : ' · Henüz çözülmedi'}
                </Text>
              </View>
            </View>
            <View style={styles.actions}>
              <View style={{ flex: 1 }}>
                <Button title={drafts[`${e.id}:sinav`] ? 'Sınava devam' : 'Sınav'} onPress={() => open(e.id, 'sinav')} />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title={drafts[`${e.id}:calisma`] ? 'Çalışmaya devam' : 'Çalışma modu'}
                  variant="outline"
                  onPress={() => open(e.id, 'calisma')}
                />
              </View>
            </View>
            {wrongCount > 0 && (
              <Pressable
                onPress={() => open(e.id, 'yanlis')}
                style={({ pressed }) => [styles.reviewLink, pressed && { opacity: 0.6 }]}
              >
                <Ionicons name="refresh" size={14} color={colors.danger} />
                <Text style={styles.reviewText}>Yanlışlarımı tekrar çöz ({wrongCount})</Text>
              </Pressable>
            )}
          </Card>
        );
      })}

      <SectionTitle>Bilgi Kartları</SectionTitle>
      {decks.length === 0 && <EmptyState icon="albums-outline" text="Henüz kart destesi eklenmedi." />}
      <View style={styles.deckGrid}>
        {decks.map((d, i) => {
          const c = paletteColor(i);
          const known = knownCards[d.id]?.length ?? 0;
          return (
            <Pressable
              key={d.id}
              onPress={() => router.push(`/kartlar/${d.id}`)}
              style={({ pressed }) => [styles.deck, pressed && styles.pressed]}
            >
              <View style={[styles.deckStripe, { backgroundColor: c.main }]} />
              <Ionicons name="albums" size={20} color={c.main} />
              <Text style={styles.deckTitle}>{d.title}</Text>
              <View style={[styles.deckTrack, { backgroundColor: c.soft }]}>
                <View style={[styles.deckFill, { width: `${(known / d.cards.length) * 100}%`, backgroundColor: c.main }]} />
              </View>
              <Text style={text.muted}>
                {known} / {d.cards.length} kart
              </Text>
            </Pressable>
          );
        })}
      </View>

      {subjects.length > 0 && (
        <>
          <SectionTitle>Konu Bazlı Başarı</SectionTitle>
          <Card style={{ gap: spacing.md }}>
            {subjects.map(([subject, s]) => {
              const pct = Math.round((s.correct / s.total) * 100);
              const c = subjectColor(subject);
              return (
                <View key={subject} style={{ gap: 6 }}>
                  <View style={styles.subjectRow}>
                    <Text style={[styles.subjectLabel, { color: c.main }]}>{subject}</Text>
                    <Text style={text.muted}>
                      %{pct} · {s.correct}/{s.total}
                    </Text>
                  </View>
                  <View style={[styles.barTrack, { backgroundColor: c.soft }]}>
                    <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: c.main }]} />
                  </View>
                </View>
              );
            })}
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  link: { color: colors.primary, fontFamily: fonts.bold },
  rankRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rankChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  rankText: { color: colors.primary, fontFamily: fonts.bold, fontSize: font.small },

  subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  subjectTile: { flexBasis: '46%', flexGrow: 1, borderRadius: radius.lg, overflow: 'hidden', ...shadow.card },
  subjectFill: { padding: spacing.lg, gap: 4, minHeight: 112 },
  subjectName: { color: '#fff', fontFamily: fonts.display, fontSize: 24, marginTop: spacing.xs },
  subjectCount: { color: 'rgba(255,255,255,0.88)', fontFamily: fonts.semibold, fontSize: 12 },
  subjectGhost: { position: 'absolute', right: -10, bottom: -14 },

  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  savedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  examHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  examBadge: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  examBadgeText: { color: '#fff', fontFamily: fonts.display, fontSize: 22, lineHeight: 24 },
  examBadgeSub: { color: 'rgba(255,255,255,0.85)', fontFamily: fonts.semibold, fontSize: 10 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  reviewLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  reviewText: { color: colors.danger, fontSize: font.small, fontFamily: fonts.bold },

  deckGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  deck: {
    flexBasis: '46%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    paddingTop: spacing.lg + 4,
    gap: spacing.sm,
    overflow: 'hidden',
    ...shadow.card,
  },
  deckStripe: { position: 'absolute', top: 0, left: 0, right: 0, height: 4 },
  deckTitle: { fontFamily: fonts.bold, fontSize: font.body, color: colors.text, minHeight: 40 },
  deckTrack: { height: 6, borderRadius: radius.pill, overflow: 'hidden' },
  deckFill: { height: '100%', borderRadius: radius.pill },

  subjectRow: { flexDirection: 'row', justifyContent: 'space-between' },
  subjectLabel: { fontFamily: fonts.bold, fontSize: font.body },
  barTrack: { height: 8, borderRadius: radius.pill, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: radius.pill },
});
