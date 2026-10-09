import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, EmptyState, Screen, Tag, text } from '../../components/ui';
import { useProgress, type ExamMode, type SubjectScore } from '../../context/ProgressContext';
import type { PracticeExam, Question } from '../../data/types';
import { content } from '../../services/content';
import { colors, font, radius, spacing } from '../../theme';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

const MODE_TITLE: Record<ExamMode, string> = {
  sinav: 'Sınav modu',
  calisma: 'Çalışma modu',
  yanlis: 'Yanlışlarım',
};

export default function DenemeRunner() {
  const { id, mod } = useLocalSearchParams<{ id: string; mod?: string }>();
  // sinav: süreli, cevaplar sonda açılır · calisma: süresiz, her cevaptan sonra açıklama
  // yanlis: yalnızca daha önce yanlış/boş bırakılan sorular, çalışma modunda
  const mode: ExamMode = mod === 'calisma' || mod === 'yanlis' ? mod : 'sinav';
  const exam = content.examById(id);
  const { loaded } = useProgress();
  // "Baştan çöz" sayacı: değişince deneme sıfırdan kurulur.
  const [run, setRun] = useState(0);

  if (!exam) return <EmptyState icon="alert-circle-outline" text="Deneme bulunamadı." />;
  // Kayıtlı veri okunmadan başlarsak yarım kalan deneme kaybolur.
  if (!loaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }
  return <Runner key={`${exam.id}:${mode}:${run}`} exam={exam} mode={mode} onRestart={() => setRun((r) => r + 1)} />;
}

function Runner({ exam, mode, onRestart }: { exam: PracticeExam; mode: ExamMode; onRestart: () => void }) {
  const instant = mode !== 'sinav';
  const keepDraft = mode !== 'yanlis';
  const { wrongQuestions, drafts, saveDraft, addExamResult, updateWrongQuestions } = useProgress();
  const draftKey = `${exam.id}:${mode}`;

  // Soru listesi ve varsa yarım kalan deneme yalnızca açılışta okunur.
  const [initial] = useState(() => {
    const wrong = new Set(wrongQuestions[exam.id] ?? []);
    const ids = exam.questions.map((q) => q.id).filter((qid) => mode !== 'yanlis' || wrong.has(qid));
    return { ids, draft: keepDraft ? drafts[draftKey] : undefined };
  });
  const questionIds = initial.ids;
  const [answers, setAnswers] = useState<Record<string, number>>(initial.draft?.answers ?? {});
  const [index, setIndex] = useState(Math.min(initial.draft?.index ?? 0, Math.max(questionIds.length - 1, 0)));
  const [remaining, setRemaining] = useState(initial.draft?.remaining ?? exam.durationMinutes * 60);
  const [finished, setFinished] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  // Yanlışlıkla bitirmemek için "Bitir" iki dokunuş ister.
  const [confirming, setConfirming] = useState(false);
  const [lastResult, setLastResult] = useState<{ bySubject: Record<string, SubjectScore> } | null>(null);
  const finishedRef = useRef(false);
  const remainingRef = useRef(remaining);
  useEffect(() => {
    remainingRef.current = remaining;
  }, [remaining]);

  const questions = useMemo(() => {
    const byId = new Map(exam.questions.map((q) => [q.id, q]));
    return questionIds.map((qid) => byId.get(qid)).filter((q): q is Question => !!q);
  }, [exam, questionIds]);

  // Her cevapta kaldığı yer kaydedilir; uygulama kapansa da devam edilebilir.
  useEffect(() => {
    if (finished || !keepDraft) return;
    if (Object.keys(answers).length === 0 && index === 0) return;
    saveDraft(draftKey, { answers, index, remaining: mode === 'sinav' ? remainingRef.current : undefined });
  }, [answers, index, finished, keepDraft, draftKey, mode, saveDraft]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    // Sınavda boşlar yanlış sayılır; çalışma modunda yalnızca cevaplananlar değerlendirilir.
    const counted = mode === 'sinav' ? questions : questions.filter((q) => answers[q.id] !== undefined);
    const right = counted.filter((q) => answers[q.id] === q.answerIndex);
    const wrong = counted.filter((q) => answers[q.id] !== q.answerIndex);
    const bySubject: Record<string, SubjectScore> = {};
    for (const q of counted) {
      const cur = bySubject[q.subject] ?? { correct: 0, total: 0 };
      bySubject[q.subject] = {
        correct: cur.correct + (answers[q.id] === q.answerIndex ? 1 : 0),
        total: cur.total + 1,
      };
    }
    updateWrongQuestions(
      exam.id,
      wrong.map((q) => q.id),
      right.map((q) => q.id),
    );
    if (mode !== 'yanlis' && counted.length > 0) {
      addExamResult(exam.id, {
        correct: right.length,
        total: counted.length,
        date: new Date().toISOString(),
        bySubject,
      });
    }
    if (keepDraft) saveDraft(draftKey, null);
    setLastResult({ bySubject });
    setShowGrid(false);
    setFinished(true);
  }, [exam, mode, questions, answers, keepDraft, draftKey, addExamResult, updateWrongQuestions, saveDraft]);

  useEffect(() => {
    if (mode !== 'sinav' || finished) return;
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [mode, finished]);

  useEffect(() => {
    if (mode === 'sinav' && !finished && remaining === 0) finish();
  }, [mode, finished, remaining, finish]);

  const restart = () => {
    if (keepDraft) saveDraft(draftKey, null);
    onRestart();
  };

  if (questions.length === 0) {
    return (
      <Screen>
        <Stack.Screen options={{ title: MODE_TITLE[mode] }} />
        <EmptyState icon="checkmark-circle-outline" text="Bu denemede tekrar edilecek yanlış soru kalmadı." />
        <Button title="Geri Dön" variant="outline" onPress={() => router.back()} />
      </Screen>
    );
  }

  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;
  const correctCount = questions.filter((q) => answers[q.id] === q.answerIndex).length;

  if (finished && !reviewing) {
    const blank = questions.length - answeredCount;
    const wrongCount = answeredCount - correctCount;
    const base = mode === 'sinav' ? questions.length : answeredCount;
    const pct = base ? Math.round((correctCount / base) * 100) : 0;
    return (
      <Screen>
        <Stack.Screen options={{ title: exam.title, headerRight: undefined }} />
        <Card style={{ alignItems: 'center' }}>
          <Text style={text.muted}>{MODE_TITLE[mode]}</Text>
          <Text style={styles.score}>%{pct}</Text>
          <Text style={text.body}>
            {correctCount} doğru · {wrongCount} yanlış · {blank} boş
          </Text>
        </Card>
        {lastResult && Object.keys(lastResult.bySubject).length > 0 && (
          <Card>
            <Text style={text.heading}>Konulara göre</Text>
            {Object.entries(lastResult.bySubject).map(([subject, s]) => (
              <View key={subject} style={styles.subjectRow}>
                <Text style={text.body}>{subject}</Text>
                <Text style={text.muted}>
                  {s.correct}/{s.total}
                </Text>
              </View>
            ))}
          </Card>
        )}
        <View style={{ gap: spacing.sm }}>
          <Button
            title="Soruları ve açıklamaları incele"
            onPress={() => {
              setIndex(0);
              setReviewing(true);
            }}
          />
          {mode !== 'yanlis' && wrongCount + (mode === 'sinav' ? blank : 0) > 0 && (
            <Button
              title="Yanlışlarımı çöz"
              variant="outline"
              onPress={() => router.replace({ pathname: '/deneme/[id]', params: { id: exam.id, mod: 'yanlis' } })}
            />
          )}
          <Button title="Baştan çöz" variant="outline" onPress={restart} />
          <Button title="Denemelere dön" variant="outline" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  const q = questions[index];
  const picked = answers[q.id];
  const revealed = finished || (instant && picked !== undefined);

  const choose = (oi: number) => {
    if (finished || (instant && picked !== undefined)) return;
    setAnswers((a) => ({ ...a, [q.id]: oi }));
  };

  const confirmFinish = () => {
    if (confirming) return finish();
    setConfirming(true);
    setTimeout(() => setConfirming(false), 3000);
  };

  const go = (i: number) => {
    setIndex(Math.max(0, Math.min(questions.length - 1, i)));
    setShowGrid(false);
  };

  return (
    <View style={styles.page}>
      <Stack.Screen
        options={{
          title: exam.title,
          headerRight: finished
            ? () => (
                <Pressable onPress={() => setReviewing(false)} hitSlop={10}>
                  <Text style={styles.headerAction}>Sonuç</Text>
                </Pressable>
              )
            : () => (
                <Pressable onPress={confirmFinish} hitSlop={10} accessibilityRole="button">
                  <Text style={styles.headerAction}>{confirming ? 'Emin misiniz?' : 'Bitir'}</Text>
                </Pressable>
              ),
        }}
      />

      <View style={styles.topBar}>
        <Text style={styles.counter}>
          {index + 1}/{questions.length}
        </Text>
        <Tag label={q.topic ? `${q.subject} · ${q.topic}` : q.subject} />
        <View style={{ flex: 1 }} />
        {mode === 'sinav' && !finished ? (
          <Tag label={formatTime(remaining)} tone={remaining < 300 ? 'danger' : 'accent'} />
        ) : (
          <Tag label={MODE_TITLE[mode]} tone="accent" />
        )}
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(answeredCount / questions.length) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {showGrid && (
          <View style={styles.grid}>
            {questions.map((gq, gi) => {
              const a = answers[gq.id];
              const show = finished || (instant && a !== undefined);
              const tone =
                show && a !== undefined
                  ? a === gq.answerIndex
                    ? styles.cellRight
                    : styles.cellWrong
                  : a !== undefined
                    ? styles.cellDone
                    : null;
              return (
                <Pressable key={gq.id} onPress={() => go(gi)} style={[styles.cell, tone, gi === index && styles.cellCurrent]}>
                  <Text style={[styles.cellText, tone && tone !== styles.cellDone && { color: '#fff' }]}>{gi + 1}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {q.passage && (
          <View style={styles.passage}>
            <Text style={styles.passageText}>{q.passage}</Text>
          </View>
        )}
        <Text style={styles.question}>{q.text}</Text>

        {q.options.map((opt, oi) => {
          const isAnswer = oi === q.answerIndex;
          const tone = revealed
            ? isAnswer
              ? styles.right
              : picked === oi
                ? styles.wrong
                : null
            : picked === oi
              ? styles.picked
              : null;
          return (
            <Pressable key={oi} onPress={() => choose(oi)} disabled={revealed} style={[styles.option, tone]}>
              <View style={[styles.bubble, tone && styles.bubbleFilled, tone === styles.right && { backgroundColor: colors.success }, tone === styles.wrong && { backgroundColor: colors.danger }]}>
                <Text style={[styles.bubbleText, tone && { color: '#fff' }]}>{LETTERS[oi]}</Text>
              </View>
              <Text style={[text.body, { flex: 1 }]}>{opt}</Text>
            </Pressable>
          );
        })}

        {revealed && (
          <View style={[styles.feedback, picked === q.answerIndex ? styles.feedbackOk : styles.feedbackBad]}>
            <Text style={[styles.feedbackTitle, { color: picked === q.answerIndex ? colors.success : colors.danger }]}>
              {picked === undefined
                ? `Boş bıraktınız · Doğru cevap ${LETTERS[q.answerIndex]}`
                : picked === q.answerIndex
                  ? 'Doğru'
                  : `Yanlış · Doğru cevap ${LETTERS[q.answerIndex]}`}
            </Text>
            {picked !== undefined && picked !== q.answerIndex && q.optionNotes?.[picked] ? (
              <Text style={text.body}>
                {LETTERS[picked]} şıkkı: {q.optionNotes[picked]}
              </Text>
            ) : null}
            {q.explanation && <Text style={text.body}>{q.explanation}</Text>}
            {q.source && <Text style={text.muted}>Kaynak: {q.source}</Text>}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable onPress={() => go(index - 1)} disabled={index === 0} style={[styles.navBtn, index === 0 && { opacity: 0.4 }]}>
          <Ionicons name="chevron-back" size={20} color={colors.primary} />
          <Text style={styles.navText}>Önceki</Text>
        </Pressable>
        <Pressable onPress={() => setShowGrid((g) => !g)} style={styles.navBtn} accessibilityLabel="Soru listesi">
          <Ionicons name={showGrid ? 'close' : 'grid-outline'} size={20} color={colors.primary} />
        </Pressable>
        {index < questions.length - 1 ? (
          <Pressable onPress={() => go(index + 1)} style={[styles.navBtn, styles.navPrimary]}>
            <Text style={[styles.navText, { color: '#fff' }]}>Sonraki</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </Pressable>
        ) : finished ? (
          <Pressable onPress={() => setReviewing(false)} style={[styles.navBtn, styles.navPrimary]}>
            <Text style={[styles.navText, { color: '#fff' }]}>Sonuç</Text>
          </Pressable>
        ) : (
          <Pressable onPress={finish} style={[styles.navBtn, styles.navPrimary]}>
            <Text style={[styles.navText, { color: '#fff' }]}>Bitir</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  headerAction: { color: '#fff', fontWeight: '700', fontSize: font.body, paddingHorizontal: spacing.md },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  counter: { fontSize: font.body, fontWeight: '700', color: colors.text },
  progressTrack: { height: 4, backgroundColor: colors.border },
  progressFill: { height: '100%', backgroundColor: colors.accent },
  body: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxl },
  passage: {
    backgroundColor: colors.primarySoft,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  passageText: { fontSize: font.body, lineHeight: 23, color: colors.text },
  question: { fontSize: 17, lineHeight: 25, fontWeight: '600', color: colors.text, marginVertical: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  picked: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  right: { borderColor: colors.success, backgroundColor: '#E3F3E9' },
  wrong: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  bubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleFilled: { backgroundColor: colors.primary, borderColor: 'transparent' },
  bubbleText: { fontWeight: '700', color: colors.primary, fontSize: font.small },
  feedback: { borderRadius: radius.md, padding: spacing.md, gap: spacing.sm, borderLeftWidth: 4, marginTop: spacing.sm },
  feedbackOk: { backgroundColor: '#E3F3E9', borderLeftColor: colors.success },
  feedbackBad: { backgroundColor: colors.dangerSoft, borderLeftColor: colors.danger },
  feedbackTitle: { fontSize: font.body, fontWeight: '700' },
  bottomBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  navPrimary: { flex: 1, backgroundColor: colors.primary },
  navText: { fontWeight: '600', color: colors.primary, fontSize: font.body },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.md },
  cell: {
    width: 40,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  cellDone: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  cellRight: { backgroundColor: colors.success, borderColor: colors.success },
  cellWrong: { backgroundColor: colors.danger, borderColor: colors.danger },
  cellCurrent: { borderWidth: 2, borderColor: colors.accent },
  cellText: { fontSize: font.small, color: colors.text, fontWeight: '600' },
  score: { fontSize: 48, fontWeight: '800', color: colors.primary },
  subjectRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
