// "Karışık 20 soru": tüm denemelerden rastgele seçilen kısa test.
// Kimlikteki tohum sayesinde aynı test yeniden açıldığında aynı sorular gelir
// (yarım kalan test sürdürülebilir).
import { importedExams } from '../data/exams';
import type { PracticeExam, Question } from '../data/types';

const PREFIX = 'karisik-';
const SIZE = 20;

let pool: Question[] | undefined;

function getPool() {
  if (pool) return pool;
  const seen = new Set<string>();
  pool = [];
  for (const exam of importedExams) {
    for (const q of exam.questions) {
      // Parçası önceki soruda kalan devam soruları tek başına anlaşılmaz.
      if (!q.passage && /parça/i.test(q.text)) continue;
      const key = q.text + '|' + q.options.join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      pool.push(q);
    }
  }
  return pool;
}

// Küçük, tohumlu rastgele sayı üreteci (mulberry32)
function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const newQuickQuizId = () => `${PREFIX}${Math.floor(Math.random() * 1e9)}`;

export function quickQuiz(id: string): PracticeExam | undefined {
  if (!id.startsWith(PREFIX)) return undefined;
  const seed = Number(id.slice(PREFIX.length));
  if (!Number.isFinite(seed)) return undefined;
  const all = getPool();
  const rnd = random(seed);
  const picked = new Set<number>();
  while (picked.size < Math.min(SIZE, all.length)) picked.add(Math.floor(rnd() * all.length));
  return {
    id,
    title: `Karışık ${SIZE} Soru`,
    durationMinutes: Math.round((SIZE * 1.2) / 5) * 5,
    questions: [...picked].map((i) => all[i]),
  };
}
