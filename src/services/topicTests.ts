// Konu testleri: her dersin soruları 20'şerlik testlere bölünür.
// Kimlik biçimi: "konu-<dersAnahtarı>-<testNo>", ör. "konu-anayasa-3"
import type { PracticeExam, Subject } from '../data/types';
import { questionPool } from './questionPool';

export const SUBJECTS: { key: string; name: Subject }[] = [
  { key: 'mevzuat', name: 'Mevzuat' },
  { key: 'anayasa', name: 'Anayasa' },
  { key: 'tarih', name: 'Tarih' },
  { key: 'turkce', name: 'Türkçe' },
  { key: 'muhakeme', name: 'Muhakeme' },
  { key: 'guncel', name: 'Güncel' },
];

const SIZE = 20;
const PREFIX = 'konu-';

export const subjectByKey = (key: string) => SUBJECTS.find((s) => s.key === key);

function subjectQuestions(name: Subject) {
  return questionPool().filter((q) => q.subject === name);
}

/** n soruyu 20'şerlik testlere böler; 10'dan az artan soru son teste eklenir. */
function ranges(n: number) {
  let count = Math.ceil(n / SIZE);
  if (count > 1 && n % SIZE > 0 && n % SIZE < SIZE / 2) count -= 1;
  return Array.from({ length: count }, (_, i) => ({ start: i * SIZE, end: i === count - 1 ? n : (i + 1) * SIZE }));
}

export function topicTests(key: string) {
  const subject = subjectByKey(key);
  if (!subject) return [];
  return ranges(subjectQuestions(subject.name).length).map((r, i) => ({
    id: `${PREFIX}${key}-${i + 1}`,
    no: i + 1,
    count: r.end - r.start,
  }));
}

export const subjectQuestionCount = (key: string) => {
  const subject = subjectByKey(key);
  return subject ? subjectQuestions(subject.name).length : 0;
};

export function topicExam(id: string): PracticeExam | undefined {
  const m = id.match(/^konu-([a-z]+)-(\d+)$/);
  if (!m) return undefined;
  const subject = subjectByKey(m[1]);
  if (!subject) return undefined;
  const no = Number(m[2]);
  const all = subjectQuestions(subject.name);
  const r = ranges(all.length)[no - 1];
  if (!r) return undefined;
  const questions = all.slice(r.start, r.end);
  return {
    id,
    title: `${subject.name} Testi ${no}`,
    durationMinutes: Math.max(5, Math.round((questions.length * 1.2) / 5) * 5),
    questions,
  };
}
