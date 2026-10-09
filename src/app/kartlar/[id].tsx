import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, EmptyState, Screen, text } from '../../components/ui';
import { useProgress } from '../../context/ProgressContext';
import { content } from '../../services/content';
import { colors, font, radius, spacing, fonts } from '../../theme';

export default function Kartlar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const deck = content.deckById(id);
  const { knownCards, setCardKnown, resetDeck } = useProgress();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!deck || deck.cards.length === 0) {
    return <EmptyState icon="alert-circle-outline" text="Kart destesi bulunamadı." />;
  }

  // Yalnızca henüz "biliyorum" denmemiş kartlar çalışılır.
  const known = new Set(knownCards[deck.id] ?? []);
  const queue = deck.cards.filter((c) => !known.has(c.id));

  if (queue.length === 0) {
    return (
      <Screen scroll={false}>
        <Stack.Screen options={{ title: deck.title }} />
        <View style={styles.wrap}>
          <View style={{ alignItems: 'center', gap: spacing.sm }}>
            <Ionicons name="trophy-outline" size={48} color={colors.accent} />
            <Text style={text.title}>Tebrikler!</Text>
            <Text style={text.muted}>Bu destedeki {deck.cards.length} kartın hepsini biliyorsunuz.</Text>
          </View>
          <Button
            title="Desteyi Baştan Çalış"
            onPress={() => {
              resetDeck(deck.id);
              setIndex(0);
            }}
          />
          <Button title="Geri Dön" variant="outline" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  const i = index % queue.length;
  const card = queue[i];

  const next = (markKnown: boolean) => {
    setFlipped(false);
    if (markKnown) {
      // Kart kuyruktan çıkacağı için aynı sıra numarası bir sonraki karta denk gelir.
      setCardKnown(deck.id, card.id, true);
      setIndex(i);
    } else {
      setIndex(i + 1);
    }
  };

  return (
    <Screen scroll={false}>
      <Stack.Screen options={{ title: deck.title }} />
      <View style={styles.wrap}>
        <Text style={text.muted}>
          Kalan {queue.length} / {deck.cards.length} · Çevirmek için karta dokunun
        </Text>
        <Pressable onPress={() => setFlipped((f) => !f)} style={[styles.card, flipped && styles.cardBack]}>
          <Text style={[styles.cardText, flipped && { color: '#fff' }]}>{flipped ? card.back : card.front}</Text>
        </Pressable>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Button title="Tekrar Göster" variant="outline" onPress={() => next(false)} />
          </View>
          <View style={{ flex: 1 }}>
            <Button title="Biliyorum" onPress={() => next(true)} />
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
  cardText: { fontSize: font.title, fontFamily: fonts.semibold, textAlign: 'center', color: colors.text },
  row: { flexDirection: 'row', gap: spacing.md },
});
