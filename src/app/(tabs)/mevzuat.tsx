import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { Card, EmptyState, Screen, SearchBar, Tag, text } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';
import { content } from '../../services/content';
import { questionsForLaw } from '../../services/lawIndex';
import { spacing } from '../../theme';

export default function MevzuatList() {
  const [query, setQuery] = useState('');
  const { rank } = useProfile();
  // En çok soru çıkan kanun en üstte.
  const items = useMemo(
    () =>
      content
        .legislation(query, rank?.group)
        .map((l) => ({ ...l, count: questionsForLaw(l.id).questions.length }))
        .sort((a, b) => b.count - a.count),
    [query, rank?.group],
  );

  return (
    <Screen>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Kanun adı, numarası veya kısaltması" />
      {items.length === 0 && <EmptyState icon="search-outline" text="Sonuç bulunamadı." />}
      {items.map((l) => (
        <Card key={l.id} onPress={() => router.push(`/mevzuat/${l.id}`)}>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Tag label={`No: ${l.number}`} tone="accent" />
            {l.count > 0 && <Tag label={`${l.count} soru`} />}
          </View>
          <Text style={text.heading}>{l.title}</Text>
        </Card>
      ))}
    </Screen>
  );
}
