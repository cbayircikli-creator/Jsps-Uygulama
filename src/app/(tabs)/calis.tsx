import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { RankGate } from '../../components/RankPicker';
import { Card, EmptyState, Screen, SectionTitle, Tag, text } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';
import { useProgress } from '../../context/ProgressContext';
import { content } from '../../services/content';
import { spacing } from '../../theme';

export default function Calis() {
  return (
    <RankGate>
      <StudyHome />
    </RankGate>
  );
}

function StudyHome() {
  const { rank } = useProfile();
  const { examResults, knownCards } = useProgress();
  const exams = content.exams(rank?.group);
  const decks = content.decks(rank?.group);

  return (
    <Screen>
      <Tag label={`Rütbe: ${rank?.name}`} tone="accent" />

      <SectionTitle>Denemeler</SectionTitle>
      {exams.length === 0 && <EmptyState icon="document-text-outline" text="Henüz deneme eklenmedi." />}
      {exams.map((e) => {
        const last = examResults[e.id]?.at(-1);
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
          </Card>
        );
      })}

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
