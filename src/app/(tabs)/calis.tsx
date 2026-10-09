import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RankGate } from '../../components/RankPicker';
import { Button, Card, EmptyState, Screen, SectionTitle, Tag, text } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';
import { useProgress, useProgressStats, type ExamMode } from '../../context/ProgressContext';
import { content } from '../../services/content';
import { colors, font, radius, spacing } from '../../theme';

export default function Calis() {
  return (
    <RankGate>
      <StudyHome />
    </RankGate>
  );
}

function StudyHome() {
  const { rank } = useProfile();
  const { examResults, knownCards, wrongQuestions, drafts } = useProgress();
  const { bySubject } = useProgressStats();
  const exams = content.exams(rank?.group);
  const decks = content.decks(rank?.group);
  const subjects = Object.entries(bySubject);

  const open = (id: string, mod: ExamMode) => router.push({ pathname: '/deneme/[id]', params: { id, mod } });

  return (
    <Screen>
      <Tag label={`Rütbe: ${rank?.name}`} tone="accent" />

      <SectionTitle>Denemeler</SectionTitle>
      {exams.length === 0 && <EmptyState icon="document-text-outline" text="Henüz deneme eklenmedi." />}
      {exams.map((e) => {
        const last = examResults[e.id]?.at(-1);
        const wrongCount = wrongQuestions[e.id]?.length ?? 0;
        return (
          <Card key={e.id}>
            <View style={styles.tags}>
              <Tag label={`${e.questions.length} soru · ${e.durationMinutes} dk`} />
              {last && <Tag label={`Son: ${last.correct}/${last.total}`} tone="accent" />}
            </View>
            <Text style={text.heading}>{e.title}</Text>
            <View style={styles.actions}>
              <View style={{ flex: 1 }}>
                <Button title={drafts[`${e.id}:sinav`] ? 'Sınava devam et' : 'Sınav'} onPress={() => open(e.id, 'sinav')} />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title={drafts[`${e.id}:calisma`] ? 'Çalışmaya devam et' : 'Çalışma modu'}
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
                <Text style={styles.reviewText}>Yanlışlarımı tekrar çöz ({wrongCount})</Text>
              </Pressable>
            )}
          </Card>
        );
      })}

      {subjects.length > 0 && (
        <>
          <SectionTitle>Konu Bazlı Başarı</SectionTitle>
          <Card>
            {subjects.map(([subject, s]) => {
              const pct = Math.round((s.correct / s.total) * 100);
              return (
                <View key={subject} style={{ gap: spacing.xs }}>
                  <View style={styles.subjectRow}>
                    <Text style={text.body}>{subject}</Text>
                    <Text style={text.muted}>
                      %{pct} · {s.correct}/{s.total}
                    </Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${pct}%` }]} />
                  </View>
                </View>
              );
            })}
          </Card>
        </>
      )}

      <SectionTitle>Bilgi Kartları</SectionTitle>
      {decks.length === 0 && <EmptyState icon="albums-outline" text="Henüz kart destesi eklenmedi." />}
      {decks.map((d) => (
        <Card key={d.id} onPress={() => router.push(`/kartlar/${d.id}`)}>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Tag label={d.subject} />
          </View>
          <Text style={text.heading}>{d.title}</Text>
          <Text style={text.muted}>
            {knownCards[d.id]?.length ?? 0} / {d.cards.length} kart öğrenildi
          </Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.sm },
  reviewLink: {
    alignSelf: 'flex-start',
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  reviewText: { color: colors.danger, fontSize: font.small, fontWeight: '600' },
  subjectRow: { flexDirection: 'row', justifyContent: 'space-between' },
  barTrack: { height: 8, borderRadius: radius.pill, backgroundColor: colors.primarySoft, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.primary },
});
