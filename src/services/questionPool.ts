// Tüm denemelerdeki sorular, tekrarlar ayıklanmış hâliyle.
import { allExams } from '../data/allExams';
import type { Question } from '../data/types';

let pool: Question[] | undefined;

export function questionPool() {
  if (pool) return pool;
  const seen = new Set<string>();
  pool = [];
  for (const exam of allExams) {
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
