import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, EmptyState, Screen, text } from '../../components/ui';
import { useProgress } from '../../context/ProgressContext';
import { content } from '../../services/content';
import { colors, font, fonts, gradients, paletteColor, radius, shadow, spacing } from '../../theme';

export default function Kartlar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const deck = content.deckById(id);
  const deckIndex = content.decks().findIndex((d) => d.id === id);
  const { knownCards, setCardKnown, resetDeck } = useProgress();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  // Çevirme açısı (0 ön yüz, 1 arka yüz); render boyunca aynı nesne kalır.
  const [spin] = useState(() => new Animated.Value(0));

  if (!deck || deck.cards.length === 0) {
    return <EmptyState icon="alert-circle-outline" text="Kart destesi bulunamadı." />;
  }

  const c = paletteColor(Math.max(0, deckIndex));

  // Yalnızca henüz "biliyorum" denmemiş kartlar çalışılır.
  const known = new Set(knownCards[deck.id] ?? []);
  const queue = deck.cards.filter((card) => !known.has(card.id));

  if (queue.length === 0) {
    return (
      <Screen scroll={false}>
        <Stack.Screen options={{ title: deck.title }} />
        <View style={styles.wrap}>
          <View style={{ alignItems: 'center', gap: spacing.md }}>
            <LinearGradient colors={gradients.gold} style={styles.trophy}>
              <Ionicons name="trophy" size={44} color="#fff" />
            </LinearGradient>
            <Text style={text.title}>Tebrikler!</Text>
            <Text style={[text.body, { textAlign: 'center', color: colors.textMuted }]}>
              Bu destedeki {deck.cards.length} kartın hepsini öğrendin.
            </Text>
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

  const flip = () => {
    Animated.spring(spin, { toValue: flipped ? 0 : 1, friction: 8, tension: 60, useNativeDriver: true }).start();
    setFlipped((f) => !f);
  };

  const next = (markKnown: boolean) => {
    spin.setValue(0);
    setFlipped(false);
    if (markKnown) {
      // Kart kuyruktan çıkacağı için aynı sıra numarası bir sonraki karta denk gelir.
      setCardKnown(deck.id, card.id, true);
      setIndex(i);
    } else {
      setIndex(i + 1);
    }
  };

  const frontRotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const learned = deck.cards.length - queue.length;

  return (
    <Screen scroll={false}>
      <Stack.Screen options={{ title: deck.title }} />
      <View style={styles.wrap}>
        <View style={{ gap: spacing.sm }}>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              {learned} / {deck.cards.length} öğrenildi
            </Text>
            <Text style={text.muted}>Kalan {queue.length}</Text>
          </View>
          <View style={[styles.track, { backgroundColor: c.soft }]}>
            <View style={[styles.fill, { width: `${(learned / deck.cards.length) * 100}%`, backgroundColor: c.main }]} />
          </View>
        </View>

        <Pressable onPress={flip} style={styles.cardArea} accessibilityRole="button" accessibilityLabel="Kartı çevir">
          <Animated.View style={[styles.face, { transform: [{ perspective: 1200 }, { rotateY: frontRotate }] }]}>
            <LinearGradient
              colors={['#FFFFFF', c.soft]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.faceFill, { borderColor: c.soft }]}
            >
              <Ionicons name="help-circle" size={150} color={c.main} style={styles.ghost} />
              <View style={[styles.label, { backgroundColor: c.main }]}>
                <Text style={styles.labelText}>SORU</Text>
              </View>
              <Text style={[styles.frontText, { color: colors.text }]}>{card.front}</Text>
              <View style={styles.hint}>
                <Ionicons name="sync" size={14} color={c.main} />
                <Text style={[styles.hintText, { color: c.main }]}>Cevabı görmek için dokun</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View style={[styles.face, { transform: [{ perspective: 1200 }, { rotateY: backRotate }] }]}>
            <LinearGradient colors={c.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.faceFill}>
              <Ionicons name="checkmark-circle" size={150} color="#fff" style={styles.ghost} />
              <View style={[styles.label, { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
                <Text style={styles.labelText}>CEVAP</Text>
              </View>
              <Text style={styles.backText}>{card.back}</Text>
              <Text style={styles.backFront} numberOfLines={2}>
                {card.front}
              </Text>
            </LinearGradient>
          </Animated.View>
        </Pressable>

        <View style={styles.row}>
          <Pressable
            onPress={() => next(false)}
            style={({ pressed }) => [styles.action, styles.again, pressed && styles.pressed]}
          >
            <Ionicons name="refresh" size={18} color={colors.danger} />
            <Text style={[styles.actionText, { color: colors.danger }]}>Tekrar Göster</Text>
          </Pressable>
          <Pressable
            onPress={() => next(true)}
            style={({ pressed }) => [styles.action, styles.know, pressed && styles.pressed]}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={[styles.actionText, { color: '#fff' }]}>Biliyorum</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: spacing.lg, gap: spacing.lg, justifyContent: 'center' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressText: { fontFamily: fonts.bold, fontSize: font.body, color: colors.text },
  track: { height: 8, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
  cardArea: { height: 340 },
  face: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backfaceVisibility: 'hidden' },
  faceFill: {
    flex: 1,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    overflow: 'hidden',
    ...shadow.raised,
  },
  ghost: { position: 'absolute', right: -30, bottom: -30, opacity: 0.12 },
  label: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  labelText: { color: '#fff', fontFamily: fonts.bold, fontSize: font.tiny, letterSpacing: 1.5 },
  frontText: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, textAlign: 'center' },
  hint: { position: 'absolute', bottom: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: 6 },
  hintText: { fontFamily: fonts.semibold, fontSize: font.small },
  backText: { color: '#fff', fontFamily: fonts.bold, fontSize: 21, lineHeight: 29, textAlign: 'center' },
  backFront: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    color: 'rgba(255,255,255,0.75)',
    fontFamily: fonts.medium,
    fontSize: font.small,
    textAlign: 'center',
  },
  row: { flexDirection: 'row', gap: spacing.md },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.md,
  },
  again: { backgroundColor: colors.dangerSoft },
  know: { backgroundColor: colors.success, ...shadow.raised },
  actionText: { fontFamily: fonts.bold, fontSize: font.body },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  trophy: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', ...shadow.raised },
});
