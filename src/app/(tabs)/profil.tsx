import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RankPicker } from '../../components/RankPicker';
import { Button, Card, EmptyState, Screen, SectionTitle, Tag, text } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';
import { useProgress, type FavoriteKey } from '../../context/ProgressContext';
import { content } from '../../services/content';
import { colors, font, fonts, radius, spacing } from '../../theme';

const GOALS = [10, 20, 30, 50, 100];

function resolveFavorite(key: FavoriteKey) {
  const [type, id] = key.split(':') as ['mevzuat' | 'karar', string];
  if (type === 'mevzuat') {
    const l = content.legislationById(id);
    return l && { label: 'Mevzuat', title: l.title, href: `/mevzuat/${id}` as const };
  }
  const d = content.decisionById(id);
  return d && { label: 'Emsal Karar', title: d.topic, href: `/kararlar/${id}` as const };
}

export default function Profil() {
  const { rank, setRank } = useProfile();
  const { favorites, clearProgress, dailyGoal, setDailyGoal } = useProgress();
  // Tüm ilerlemeyi silmek iki dokunuş ister.
  const [confirmReset, setConfirmReset] = useState(false);
  const saved = favorites.map(resolveFavorite).filter((f) => !!f);

  return (
    <Screen>
      <Card>
        <Text style={text.muted}>Seçili rütbe</Text>
        <Text style={text.title}>{rank?.name ?? 'Seçilmedi'}</Text>
        {rank && <Button title="Rütbe seçimini temizle" variant="outline" onPress={() => setRank(null)} />}
      </Card>

      <SectionTitle>Günlük hedef</SectionTitle>
      <Card>
        <Text style={text.muted}>Her gün kaç soru çözmek istiyorsun?</Text>
        <View style={styles.goals}>
          {GOALS.map((g) => {
            const active = g === dailyGoal;
            return (
              <Pressable
                key={g}
                onPress={() => setDailyGoal(g)}
                style={[styles.goal, active && styles.goalActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.goalText, active && { color: '#fff' }]}>{g}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <SectionTitle>Kaydedilenler</SectionTitle>
      {saved.length === 0 && (
        <EmptyState icon="star-outline" text="Mevzuat veya karar sayfasındaki yıldıza dokunarak kaydedin." />
      )}
      {saved.map((f) => (
        <Card key={f.href} onPress={() => router.push(f.href)}>
          <Tag label={f.label} />
          <Text style={text.heading}>{f.title}</Text>
        </Card>
      ))}

      <SectionTitle>Rütbe değiştir</SectionTitle>
      <RankPicker />

      <SectionTitle>Veriler</SectionTitle>
      <Button
        title={confirmReset ? 'Emin misin? Tüm ilerleme silinecek' : 'İlerlemeyi sıfırla'}
        variant="outline"
        onPress={() => {
          if (!confirmReset) {
            setConfirmReset(true);
            setTimeout(() => setConfirmReset(false), 4000);
            return;
          }
          clearProgress();
          setConfirmReset(false);
        }}
      />

      <Text style={[text.muted, { textAlign: 'center' }]}>Sürüm {Constants.expoConfig?.version}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  goals: { flexDirection: 'row', gap: spacing.sm },
  goal: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  goalActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  goalText: { fontFamily: fonts.display, fontSize: font.heading + 3, color: colors.text },
});
