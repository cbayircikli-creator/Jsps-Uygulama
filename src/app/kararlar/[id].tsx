import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Card, EmptyState, Screen, Tag, text } from '../../components/ui';
import { content } from '../../services/content';
import { spacing } from '../../theme';

export default function KararDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = content.decisionById(id);

  if (!item) return <EmptyState icon="alert-circle-outline" text="Karar bulunamadı." />;

  return (
    <Screen>
      <Text style={text.muted}>{item.court}</Text>
      <Text style={text.title}>{item.topic}</Text>
      <Card>
        <Text style={text.muted}>Künye</Text>
        <Text style={text.body}>{item.reference}</Text>
        <Text style={text.muted}>Tarih: {item.date}</Text>
      </Card>
      <Card>
        <Text style={text.heading}>Özet</Text>
        <Text style={text.body}>{item.summary}</Text>
      </Card>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
        {item.tags.map((t) => (
          <Tag key={t} label={t} />
        ))}
      </View>
    </Screen>
  );
}
