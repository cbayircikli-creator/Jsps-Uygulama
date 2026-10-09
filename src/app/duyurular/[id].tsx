import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

import { EmptyState, Screen, text } from '../../components/ui';
import { content } from '../../services/content';

export default function DuyuruDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = content.announcementById(id);

  if (!item) return <EmptyState icon="alert-circle-outline" text="Duyuru bulunamadı." />;

  return (
    <Screen>
      <Text style={text.muted}>{item.date}</Text>
      <Text style={text.title}>{item.title}</Text>
      <Text style={text.body}>{item.body}</Text>
    </Screen>
  );
}
