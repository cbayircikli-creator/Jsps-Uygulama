import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { RankGate } from '../../components/RankPicker';
import { Card, EmptyState, Screen, SectionTitle, Tag, text } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';
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
  const exams = content.exams(rank?.group);
  const decks = content.decks(rank?.group);

  return (
    <Screen>
      <Tag label={`Rütbe: ${rank?.name}`} tone="accent" />

      <SectionTitle>Denemeler</SectionTitle>
      {exams.length === 0 && <EmptyState icon="document-text-outline" text="Henüz deneme eklenmedi." />}
      {exams.map((e) => (
        <Card key={e.id} onPress={() => router.push(`/deneme/${e.id}`)}>
          <Tag label={e.subject} />
          <Text style={text.heading}>{e.title}</Text>
          <Text style={text.muted}>
            {e.questions.length} soru · {e.durationMinutes} dk
          </Text>
        </Card>
      ))}

      <SectionTitle>Bilgi Kartları</SectionTitle>
      {decks.length === 0 && <EmptyState icon="albums-outline" text="Henüz kart destesi eklenmedi." />}
      {decks.map((d) => (
        <Card key={d.id} onPress={() => router.push(`/kartlar/${d.id}`)}>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Tag label={d.subject} />
          </View>
          <Text style={text.heading}>{d.title}</Text>
          <Text style={text.muted}>{d.cards.length} kart</Text>
        </Card>
      ))}
    </Screen>
  );
}
