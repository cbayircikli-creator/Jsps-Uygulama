import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Card, EmptyState, Screen, Tag, text } from '../../components/ui';
import { useProgress } from '../../context/ProgressContext';
import { content } from '../../services/content';
import { colors, font, radius, spacing } from '../../theme';

export default function DenemeRunner() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exam = content.examById(id);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const durationSec = (exam?.durationMinutes ?? 0) * 60;
  const [remaining, setRemaining] = useState(durationSec);
  const { addExamResult, examResults } = useProgress();
  const previous = examResults[id] ?? [];

  const finish = useCallback(() => {
    if (!exam) return;
    setFinished(true);
    const correct = exam.questions.filter((q) => answers[q.id] === q.answerIndex).length;
    addExamResult(exam.id, { correct, total: exam.questions.length, date: new Date().toISOString() });
  }, [exam, answers, addExamResult]);

  useEffect(() => {
    if (finished || !durationSec) return;
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [finished, durationSec]);

  useEffect(() => {
    if (durationSec && remaining === 0 && !finished) finish();
  }, [remaining, finished, durationSec, finish]);

  if (!exam) return <EmptyState icon="alert-circle-outline" text="Deneme bulunamadı." />;

  const answered = Object.keys(answers).length;
  const correct = exam.questions.filter((q) => answers[q.id] === q.answerIndex).length;

  return (
    <Screen>
      <Stack.Screen options={{ title: exam.title }} />

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
            {correct} / {exam.questions.length} doğru
          </Text>
          <Text style={text.muted}>Boş: {exam.questions.length - answered}</Text>
        </Card>
      )}

      {exam.questions.map((q, qi) => (
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
                setFinished(false);
              }}
            />
            <Button title="Geri Dön" variant="outline" onPress={() => router.back()} />
          </>
        ) : (
          <Button title={`Denemeyi Bitir (${answered}/${exam.questions.length})`} onPress={finish} />
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
