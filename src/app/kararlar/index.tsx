import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Card, EmptyState, Screen, SearchBar, Tag, text } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';
import { content } from '../../services/content';
import { spacing } from '../../theme';

export default function KararList() {
  const [query, setQuery] = useState('');
  const { rank } = useProfile();
  const items = content.decisions(query, rank?.group);

  return (
    <Screen>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Konu, mahkeme veya etiket ara" />
      {items.length === 0 && <EmptyState icon="search-outline" text="Sonuç bulunamadı." />}
      {items.map((d) => (
        <Card key={d.id} onPress={() => router.push(`/kararlar/${d.id}`)}>
          <Text style={text.muted}>{d.court}</Text>
          <Text style={text.heading}>{d.topic}</Text>
          <Text style={text.muted}>{d.reference}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
            {d.tags.map((t) => (
              <Tag key={t} label={t} />
            ))}
          </View>
        </Card>
      ))}
    </Screen>
  );
}
