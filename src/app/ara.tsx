import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState, Screen, SearchBar, SubjectTag, text } from '../components/ui';
import { useProgress } from '../context/ProgressContext';
import { questionPool } from '../services/questionPool';
import { colors, font, fonts, radius, shadow, spacing } from '../theme';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const LIMIT = 50;
const norm = (s: string) => s.toLocaleLowerCase('tr');

export default function SoruAra() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const { savedQuestions, toggleSavedQuestion } = useProgress();

  const results = useMemo(() => {
    const q = norm(query.trim());
    if (q.length < 3) return [];
    return questionPool().filter((x) =>
      [x.text, x.passage, x.explanation, x.source, x.topic, ...x.options].some((f) => f && norm(f).includes(q)),
    );
  }, [query]);

  return (
    <Screen>
      <SearchBar value={query} onChangeText={setQuery} placeholder="Ör. gözaltı, tutuklama, 2911, HAGB" />
      {query.trim().length < 3 ? (
        <EmptyState
          icon="search-outline"
          text={`${questionPool().length} soru içinde ara. Soru metninde, şıklarda, açıklamada ve kaynakta arar.`}
        />
      ) : results.length === 0 ? (
        <EmptyState icon="sad-outline" text="Bu kelimeyle eşleşen soru bulunamadı." />
      ) : (
        <Text style={text.muted}>
          {results.length} soru bulundu{results.length > LIMIT ? `, ilk ${LIMIT} tanesi gösteriliyor` : ''}.
        </Text>
      )}

      {results.slice(0, LIMIT).map((q) => {
        const expanded = open === q.id;
        const saved = savedQuestions.includes(q.id);
        return (
          <View key={q.id} style={[styles.item, expanded && styles.itemOpen]}>
            <View style={styles.head}>
              <SubjectTag subject={q.subject} detail={q.topic} />
              <Pressable
                onPress={() => toggleSavedQuestion(q.id)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={saved ? 'İşareti kaldır' : 'Soruyu işaretle'}
              >
                <Ionicons
                  name={saved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={saved ? colors.accent : colors.textMuted}
                />
              </Pressable>
            </View>
            {/* Yer imi ayrı dokunma alanında; iç içe dokunma alanı açma/kapamayı tetiklemesin */}
            <Pressable
              onPress={() => setOpen(expanded ? null : q.id)}
              style={{ gap: spacing.sm }}
              accessibilityRole="button"
              accessibilityState={{ expanded }}
            >
              <Text style={styles.question} numberOfLines={expanded ? undefined : 3}>
                {q.text}
              </Text>
              {expanded && (
                <View style={{ gap: spacing.xs }}>
                  {q.options.map((o, i) => (
                    <View key={i} style={[styles.option, i === q.answerIndex && styles.correct]}>
                      <Text style={[styles.letter, i === q.answerIndex && { color: colors.success }]}>{LETTERS[i]}</Text>
                      <Text style={[text.body, { flex: 1 }]}>{o}</Text>
                      {i === q.answerIndex && <Ionicons name="checkmark-circle" size={18} color={colors.success} />}
                    </View>
                  ))}
                  {q.explanation && <Text style={[text.body, styles.explanation]}>{q.explanation}</Text>}
                  {q.source && <Text style={text.muted}>Kaynak: {q.source}</Text>}
                </View>
              )}
              <Text style={styles.more}>{expanded ? 'Gizle' : 'Cevabı göster'}</Text>
            </Pressable>
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow.card,
  },
  itemOpen: { borderColor: colors.primary },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  question: { fontFamily: fonts.semibold, fontSize: font.body, lineHeight: 22, color: colors.text },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
  },
  correct: { backgroundColor: colors.successSoft },
  letter: { fontFamily: fonts.bold, fontSize: font.body, color: colors.textMuted, width: 16 },
  explanation: { backgroundColor: colors.primarySoft, borderRadius: radius.sm, padding: spacing.md, marginTop: spacing.xs },
  more: { fontFamily: fonts.bold, fontSize: font.small, color: colors.primary },
});
