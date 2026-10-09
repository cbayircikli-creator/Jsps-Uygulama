import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Card, EmptyState, Screen, Tag, text } from '../../components/ui';
import { useProgress } from '../../context/ProgressContext';
import { content } from '../../services/content';
import { colors, font, radius, spacing } from '../../theme';

export default function DenemeRunner() {
  const { id, mod } = useLocalSearchParams<{ id: string; mod?: string }>();
  // "yanlis" modunda yalnızca daha önce yanlış/boş bırakılan sorular, süresiz çözülür.
  const review = mod === 'yanlis';
  const exam = content.examById(id);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const durationSec = review ? 0 : (exam?.durationMinutes ?? 0) * 60;
  const [remaining, setRemaining] = useState(durationSec);
  const { addExamResult, updateWrongQuestions, examResults, wrongQuestions, loaded } = useProgress();
  const previous = examResults[id] ?? [];

  // Tekrar modunda soru listesi başlangıçta sabitlenir; çözerken liste değişmesin.
  const [reviewIds, setReviewIds] = useState<string[] | null>(null);
  useEffect(() => {
    if (review && loaded && reviewIds === null) setReviewIds(wrongQuestions[id] ?? []);
  }, [review, loaded, reviewIds, wrongQuestions, id]);

  const questions = useMemo(() => {
    if (!exam) return [];
    if (!review) return exam.questions;
    return exam.questions.filter((q) => reviewIds?.includes(q.id));
  }, [exam, review, reviewIds]);

  const finish = useCallback(() => {
    if (!exam) return;
    setFinished(true);
    const right = questions.filter((q) => answers[q.id] === q.answerIndex).map((q) => q.id);
    const wrong = questions.filter((q) => answers[q.id] !== q.answerIndex).map((q) => q.id);
    updateWrongQuestions(exam.id, wrong, right);
    if (!review) {
      addExamResult(exam.id, { correct: right.length, total: questions.length, date: new Date().toISOString() });
    }
  }, [exam, questions, answers, review, addExamResult, updateWrongQuestions]);

  useEffect(() => {
    if (finished || !durationSec) return;
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [finished, durationSec]);

  useEffect(() => {
    if (durationSec && remaining === 0 && !finished) finish();
  }, [remaining, finished, durationSec, finish]);

  if (!exam) return <EmptyState icon="alert-circle-outline" text="Deneme bulunamadı." />;
  if (review && reviewIds?.length === 0) {
    return <EmptyState icon="checkmark-circle-outline" text="Bu denemede tekrar edilecek yanlış soru yok." />;
  }

  const answered = Object.keys(answers).length;
  const correct = questions.filter((q) => answers[q.id] === q.answerIndex).length;

  return (
    <Screen>
      <Stack.Screen options={{ title: review ? 'Yanlışlarım' : exam.title }} />

      {!finished && durationSec > 0 && (
        <View style={styles.timerRow}>
          <Tag label={`Kalan süre ${formatTime(remaining)}`} tone={remaining < 60 ? 'danger' : 'accent'} />
          {previous.length > 0 && (
            <Text style={text.muted}>
              Son sonuç: {previous[previous.length - 1].correct}/{previous[previous.length - 1].total}
            </Text>
          )}
        </View>
      )}

      {finished && (
        <Card style={{ backgroundColor: colors.primarySoft }}>
          <Text style={text.title}>
            {correct} / {questions.length} doğru
          </Text>
          <Text style={text.muted}>Boş: {questions.length - answered}</Text>
        </Card>
      )}

      {questions.map((q, qi) => (
        <Card key={q.id}>
          <Text style={text.heading}>
            {qi + 1}. {q.text}
          </Text>
          {q.options.map((opt, oi) => {
            const picked = answers[q.id] === oi;
            const isAnswer = oi === q.answerIndex;
            const tone = finished
              ? isAnswer
                ? styles.correct
                : picked
                  ? styles.wrong
                  : null
              : picked
                ? styles.picked
                : null;
            return (
              <Pressable
                key={oi}
                disabled={finished}
                onPress={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                style={[styles.option, tone]}
              >
                <Text style={styles.optionLetter}>{String.fromCharCode(65 + oi)})</Text>
                <Text style={[text.body, { flex: 1 }]}>{opt}</Text>
              </Pressable>
            );
          })}
          {finished && q.explanation && <Text style={text.muted}>Açıklama: {q.explanation}</Text>}
        </Card>
      ))}

      <View style={{ gap: spacing.sm }}>
        {finished ? (
          <>
            <Button
              title="Tekrar Çöz"
              onPress={() => {
                setAnswers({});
                setRemaining(durationSec);
                setReviewIds(null);
                setFinished(false);
              }}
            />
            <Button title="Geri Dön" variant="outline" onPress={() => router.back()} />
          </>
        ) : (
          <Button title={`Denemeyi Bitir (${answered}/${questions.length})`} onPress={finish} />
        )}
      </View>
    </Screen>
  );
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  timerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  option: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionLetter: { fontSize: font.body, fontWeight: '700', color: colors.textMuted },
  picked: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  correct: { borderColor: colors.success, backgroundColor: '#E3F3E9' },
  wrong: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
});
