import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { FavoriteButton } from '../../components/FavoriteButton';
import { Button, Card, EmptyState, Screen, SectionTitle, Tag, text } from '../../components/ui';
import { useProgress, type ExamMode } from '../../context/ProgressContext';
import { officialUrl } from '../../data/legislation';
import { content } from '../../services/content';
import { lawExamId, questionsForLaw } from '../../services/lawIndex';
import { colors, font, radius, spacing } from '../../theme';

export default function MevzuatDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { wrongQuestions } = useProgress();
  const item = content.legislationById(id);

  if (!item) return <EmptyState icon="alert-circle-outline" text="Mevzuat bulunamadı." />;

  const { questions, byArticle } = questionsForLaw(item.id);
  const examId = lawExamId(item.id);
  const wrongCount = wrongQuestions[examId]?.length ?? 0;
  const open = (exam: string, mod: ExamMode) => router.push({ pathname: '/deneme/[id]', params: { id: exam, mod } });

  return (
    <Screen>
      <Stack.Screen
        options={{
          title: `${item.number} Sayılı`,
          headerRight: () => <FavoriteButton favKey={`mevzuat:${item.id}`} />,
        }}
      />
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Tag label={item.category} />
        <Tag label={`No: ${item.number}`} tone="accent" />
      </View>
      <Text style={text.title}>{item.title}</Text>

      <Card>
        <Text style={text.heading}>Resmî metin</Text>
        <Text style={text.muted}>
          {"Kanunun güncel ve resmî metni Mevzuat Bilgi Sistemi'nde yer alır. Değişiklikler en hızlı orada görünür."}
        </Text>
        <Button title="mevzuat.gov.tr'de aç" variant="outline" onPress={() => Linking.openURL(officialUrl(item))} />
      </Card>

      <SectionTitle>Bu kanundan sorular</SectionTitle>
      {questions.length === 0 ? (
        <EmptyState icon="document-text-outline" text="Denemelerde bu kanundan henüz soru yok." />
      ) : (
        <Card>
          <Text style={text.body}>Denemelerde bu kanundan {questions.length} soru var.</Text>
          <View style={styles.actions}>
            <View style={{ flex: 1 }}>
              <Button title="Çalışma modu" onPress={() => open(examId, 'calisma')} />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="Sınav" variant="outline" onPress={() => open(examId, 'sinav')} />
            </View>
          </View>
          {wrongCount > 0 && (
            <Pressable
              onPress={() => open(examId, 'yanlis')}
              style={({ pressed }) => [styles.reviewLink, pressed && { opacity: 0.6 }]}
            >
              <Text style={styles.reviewText}>Yanlışlarımı tekrar çöz ({wrongCount})</Text>
            </Pressable>
          )}
        </Card>
      )}

      {byArticle.length > 0 && (
        <>
          <SectionTitle>Maddelere göre</SectionTitle>
          <Text style={text.muted}>Bir maddeye dokunarak yalnızca o maddenin sorularını çalışabilirsin.</Text>
          <View style={styles.grid}>
            {byArticle.map((a) => (
              <Pressable
                key={a.article}
                onPress={() => open(lawExamId(item.id, a.article), 'calisma')}
                style={({ pressed }) => [styles.chip, pressed && { opacity: 0.6 }]}
              >
                <Text style={styles.chipTitle}>md. {a.article}</Text>
                <Text style={styles.chipCount}>{a.questions.length} soru</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: spacing.sm },
  reviewLink: {
    alignSelf: 'flex-start',
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  reviewText: { color: colors.danger, fontSize: font.small, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minWidth: 76,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  chipTitle: { color: colors.primary, fontWeight: '700', fontSize: font.body },
  chipCount: { color: colors.textMuted, fontSize: font.tiny },
});
