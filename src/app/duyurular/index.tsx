import { router } from 'expo-router';
import { Text } from 'react-native';

import { Card, Screen, Tag, text } from '../../components/ui';
import { content } from '../../services/content';

export default function DuyuruList() {
  return (
    <Screen>
      {content.announcements().map((a) => (
        <Card key={a.id} onPress={() => router.push(`/duyurular/${a.id}`)}>
          {a.important && <Tag label="Önemli" tone="accent" />}
          <Text style={text.heading}>{a.title}</Text>
          <Text style={text.muted}>{a.date}</Text>
        </Card>
      ))}
    </Screen>
  );
}
