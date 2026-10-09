import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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
  const { favorites, clearProgress, dailyGoal, setDailyGoal, examDate, setExamDate } = useProgress();
  const [dateText, setDateText] = useState(examDate ? examDate.split('-').reverse().join('.') : '');
  const [dateError, setDateError] = useState<string | null>(null);

  // "GG.AA.YYYY" biçimindeki tarihi kaydeder; boş bırakılırsa tarih silinir.
  const saveDate = () => {
    const t = dateText.trim();
    if (!t) {
      setExamDate(null);
      setDateError(null);
      return;
    }
    const m = t.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    const d = m && new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
    if (!m || !d || d.getDate() !== Number(m[1]) || d.getMonth() !== Number(m[2]) - 1) {
      setDateError('Tarihi GG.AA.YYYY biçiminde yaz, örneğin 15.03.2027.');
      return;
    }
    setDateError(null);
    setExamDate(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`);
    setDateText(`${m[1].padStart(2, '0')}.${m[2].padStart(2, '0')}.${m[3]}`);
  };
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

      <SectionTitle>Sınav tarihim</SectionTitle>
      <Card>
        <Text style={text.muted}>Tarihi girersen ana sayfada sınava kalan gün sayısı görünür.</Text>
        <View style={styles.dateRow}>
          <TextInput
            value={dateText}
            onChangeText={setDateText}
            onSubmitEditing={saveDate}
            placeholder="GG.AA.YYYY"
            placeholderTextColor={colors.textMuted}
            keyboardType="numbers-and-punctuation"
            style={styles.dateInput}
            maxLength={10}
            accessibilityLabel="Sınav tarihi"
          />
          <Pressable onPress={saveDate} style={styles.dateSave} accessibilityRole="button">
            <Text style={styles.dateSaveText}>Kaydet</Text>
          </Pressable>
        </View>
        {dateError && <Text style={[text.muted, { color: colors.danger }]}>{dateError}</Text>}
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
  dateRow: { flexDirection: 'row', gap: spacing.sm },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.semibold,
    fontSize: font.body,
    color: colors.text,
    backgroundColor: colors.surfaceAlt,
  },
  dateSave: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  dateSaveText: { color: '#fff', fontFamily: fonts.bold },
});
