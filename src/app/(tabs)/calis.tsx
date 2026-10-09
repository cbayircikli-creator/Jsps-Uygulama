import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RankGate } from '../../components/RankPicker';
import { Card, EmptyState, Screen, SectionTitle, Tag, text } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';
import { useProgress } from '../../context/ProgressContext';
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
  const { examResults, knownCards, wrongQuestions } = useProgress();
  const exams = content.exams(rank?.group);
  const decks = content.decks(rank?.group);

  // Konu bazlı başarı: her denemenin tüm sonuçları konusuna göre toplanır.
  const bySubject = new Map<string, { correct: number; total: number }>();
  for (const e of exams) {
    for (const r of examResults[e.id] ?? []) {
      const s = bySubject.get(e.subject) ?? { correct: 0, total: 0 };
      bySubject.set(e.subject, { correct: s.correct + r.correct, total: s.total + r.total });
    }
  }

  return (
    <Screen>
      <Tag label={`Rütbe: ${rank?.name}`} tone="accent" />

      <SectionTitle>Denemeler</SectionTitle>
      {exams.length === 0 && <EmptyState icon="document-text-outline" text="Henüz deneme eklenmedi." />}
      {exams.map((e) => {
        const last = examResults[e.id]?.at(-1);
        const wrongCount = wrongQuestions[e.id]?.length ?? 0;
        return (
          <Card key={e.id} onPress={() => router.push(`/deneme/${e.id}`)}>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <Tag label={e.subject} />
              {last && <Tag label={`Son: ${last.correct}/${last.total}`} tone="accent" />}
            </View>
            <Text style={text.heading}>{e.title}</Text>
            <Text style={text.muted}>
              {e.questions.length} soru · {e.durationMinutes} dk
            </Text>
            {wrongCount > 0 && (
              <Pressable
                onPress={() => router.push({ pathname: '/deneme/[id]', params: { id: e.id, mod: 'yanlis' } })}
                style={({ pressed }) => [styles.reviewLink, pressed && { opacity: 0.6 }]}
              >
                <Text style={styles.reviewText}>Yanlışlarımı tekrar çöz ({wrongCount})</Text>
              </Pressable>
            )}
          </Card>
        );
      })}

      {bySubject.size > 0 && (
        <>
          <SectionTitle>Konu Bazlı Başarı</SectionTitle>
          <Card>
            {[...bySubject].map(([subject, s]) => {
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
