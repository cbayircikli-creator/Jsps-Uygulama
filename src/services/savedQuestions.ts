// "İşaretlediğim sorular": kullanıcının işaretlediği sorulardan oluşan test.
import { allExams } from '../data/allExams';
import type { PracticeExam, Question } from '../data/types';

export const SAVED_EXAM_ID = 'isaretli';

let byId: Map<string, Question> | undefined;

export function savedExam(ids: string[]): PracticeExam {
  byId ??= new Map(allExams.flatMap((e) => e.questions.map((q) => [q.id, q] as const)));
  const questions = ids.map((id) => byId!.get(id)).filter((q): q is Question => !!q);
  return {
    id: SAVED_EXAM_ID,
    title: 'İşaretlediğim Sorular',
    durationMinutes: Math.max(5, Math.round((questions.length * 1.2) / 5) * 5),
    questions,
  };
}
