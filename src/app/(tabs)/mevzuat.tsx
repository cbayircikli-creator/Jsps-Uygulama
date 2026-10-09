import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, EmptyState, Screen, SearchBar, Tag, text } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';
import { content } from '../../services/content';
import { questionsForLaw } from '../../services/lawIndex';
import type { Legislation } from '../../data/types';
import { colors, font, radius, spacing, fonts } from '../../theme';

const FILTERS: { label: string; value: Legislation['category'] | null }[] = [
  { label: 'Tümü', value: null },
  { label: 'Kanunlar', value: 'Kanun' },
  { label: 'Yönetmelikler', value: 'Yönetmelik' },
];

export default function MevzuatList() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Legislation['category'] | null>(null);
  const { rank } = useProfile();
  // En çok soru çıkan kanun en üstte.
  const items = useMemo(
    () =>
      content
        .legislation(query, rank?.group)
        .filter((l) => !category || l.category === category)
        .map((l) => ({ ...l, count: questionsForLaw(l.id).questions.length }))
        .sort((a, b) => b.count - a.count),
    [query, category, rank?.group],
  );

  return (
    <Screen>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Kanun adı, numarası veya kısaltması" />
      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = f.value === category;
          return (
            <Pressable
              key={f.label}
              onPress={() => setCategory(f.value)}
              style={[styles.filter, active && styles.filterActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.filterText, active && { color: '#fff' }]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {items.length === 0 && <EmptyState icon="search-outline" text="Sonuç bulunamadı." />}
      {items.map((l) => (
        <Card key={l.id} onPress={() => router.push(`/mevzuat/${l.id}`)}>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {l.number ? <Tag label={`No: ${l.number}`} tone="accent" /> : <Tag label={l.category} />}
            {l.count > 0 && <Tag label={`${l.count} soru`} />}
          </View>
          <Text style={text.heading}>{l.title}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', gap: spacing.sm },
  filter: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.text, fontSize: font.small, fontFamily: fonts.semibold },
});
