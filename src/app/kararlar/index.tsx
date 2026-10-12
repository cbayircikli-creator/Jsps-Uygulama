import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Card, ComingSoon, EmptyState, Screen, SearchBar, Tag, text } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';
import { content } from '../../services/content';
import { spacing } from '../../theme';

export default function KararList() {
  const [query, setQuery] = useState('');
  const { rank } = useProfile();
  const all = content.decisions('', rank?.group);
  const items = content.decisions(query, rank?.group);

  if (all.length === 0) {
    return (
      <Screen>
        <ComingSoon
          icon="hammer"
          title="Emsal kararlar hazırlanıyor"
          text="Yargıtay, Danıştay ve Anayasa Mahkemesi kararları; künyesi resmî kaynağından doğrulanarak ve sınav konularına göre özetlenerek eklenecek."
          action={{ title: 'Bu sırada kanunlara göre çalış', onPress: () => router.push('/mevzuat') }}
        />
      </Screen>
    );
  }

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
