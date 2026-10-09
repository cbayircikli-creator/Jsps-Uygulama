import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, EmptyState, Screen, text } from '../../components/ui';
import { content } from '../../services/content';
import { colors, font, radius, spacing } from '../../theme';

export default function Kartlar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const deck = content.deckById(id);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!deck || deck.cards.length === 0) {
    return <EmptyState icon="alert-circle-outline" text="Kart destesi bulunamadı." />;
  }

  const card = deck.cards[index];
  const go = (delta: number) => {
    setFlipped(false);
    setIndex((i) => (i + delta + deck.cards.length) % deck.cards.length);
  };

  return (
    <Screen scroll={false}>
      <Stack.Screen options={{ title: deck.title }} />
      <View style={styles.wrap}>
        <Text style={text.muted}>
          {index + 1} / {deck.cards.length} · Çevirmek için karta dokunun
        </Text>
        <Pressable onPress={() => setFlipped((f) => !f)} style={[styles.card, flipped && styles.cardBack]}>
          <Text style={[styles.cardText, flipped && { color: '#fff' }]}>{flipped ? card.back : card.front}</Text>
        </Pressable>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Button title="Önceki" variant="outline" onPress={() => go(-1)} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Sonraki" onPress={() => go(1)} />
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: spacing.lg, gap: spacing.lg, justifyContent: 'center' },
  card: {
    minHeight: 260,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  cardBack: { backgroundColor: colors.primary, borderColor: colors.primary },
  cardText: { fontSize: font.title, fontWeight: '600', textAlign: 'center', color: colors.text },
  row: { flexDirection: 'row', gap: spacing.md },
});
