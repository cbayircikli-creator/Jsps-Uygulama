import { Stack, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

import { FavoriteButton } from '../../components/FavoriteButton';
import { Card, EmptyState, Screen, Tag, text } from '../../components/ui';
import { content } from '../../services/content';

export default function MevzuatDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = content.legislationById(id);

  if (!item) return <EmptyState icon="alert-circle-outline" text="Mevzuat bulunamadı." />;

  return (
    <Screen>
      <Stack.Screen
        options={{
          title: item.number ? `${item.number} Sayılı` : item.category,
          headerRight: () => <FavoriteButton favKey={`mevzuat:${item.id}`} />,
        }}
      />
      <Tag label={item.category} />
      <Text style={text.title}>{item.title}</Text>
      <Text style={text.muted}>{item.summary}</Text>
      {item.articles.map((a) => (
        <Card key={a.no}>
          <Text style={text.heading}>
            Madde {a.no} – {a.title}
          </Text>
          <Text style={text.body}>{a.text}</Text>
        </Card>
      ))}
    </Screen>
  );
}
