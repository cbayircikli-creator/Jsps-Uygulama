// Denemelerdeki soruları ilgili kanuna ve maddeye bağlar.
// Önce sorunun "Kaynak" alanına (ör. "CMK m.91", "4678 m.13"), yoksa metindeki
// "NNNN sayılı" ifadesine bakılır. Anayasa konulu sorular kaynaksız da olsa Anayasa'ya bağlanır.
import { allExams } from '../data/allExams';
import { legislation } from '../data/legislation';
import type { Legislation, PracticeExam, Question } from '../data/types';

export type LawQuestions = {
  questions: Question[];
  /** Madde numarasına göre, küçükten büyüğe */
  byArticle: { article: string; questions: Question[] }[];
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Hermes'te Unicode özellik kaçışlarına güvenmemek için harfler açıkça yazıldı.
const W = 'A-Za-z0-9ÇĞİÖŞÜçğıöşüÂÎÛâîû';
const notWord = `(?:^|[^${W}])`;
const endWord = `(?![${W}])`;

const matchers = legislation.map((law) => {
  const names = [law.number, ...(law.aliases ?? [])].filter((n): n is string => !!n).map(escape);
  // Kanunlarda metinde yalnızca "NNNN sayılı" ve büyük harfli kısaltmalar (CMK, TCK…) aranır;
  // yönetmelik adları zaten ayırt edicidir, hepsi aranır.
  const textNames =
    law.category === 'Yönetmelik'
      ? (law.aliases ?? []).map(escape)
      : [`${law.number} sayılı`, ...(law.aliases ?? []).filter((a) => /^[A-ZÇĞİÖŞÜ]{3,}$/.test(a)).map(escape)];
  return {
    law,
    source: new RegExp(`${notWord}(?:${names.join('|')})${endWord}`),
    text: new RegExp(`${notWord}(?:${textNames.join('|')})${endWord}`),
  };
});

const articleAfter = (s: string) => s.match(/^[^;:,()/·–+&]{0,40}?(?:^|[^A-Za-zÇĞİÖŞÜçğıöşü])(?:m|md|madde)\.?\s*(\d+)/i)?.[1];

function locate(q: Question): { law: Legislation; article?: string } | undefined {
  const find = (s: string | undefined, kind: 'source' | 'text') => {
    if (!s) return undefined;
    let best: { law: Legislation; index: number; end: number } | undefined;
    for (const m of matchers) {
      const r = m[kind].exec(s);
      if (!r) continue;
      const end = r.index + r[0].length;
      // En önce geçen kazanır; aynı yerde başlıyorsa uzun olan ("6284 Uyg. Yön." > "6284").
      if (!best || r.index < best.index || (r.index === best.index && end > best.end)) best = { law: m.law, index: r.index, end };
    }
    return best && { law: best.law, article: articleAfter(s.slice(best.end)) };
  };
  return (
    find(q.source, 'source') ??
    find(q.text, 'text') ??
    find(q.explanation, 'text') ??
    (q.subject === 'Anayasa' ? { law: legislation.find((l) => l.id === 'anayasa')! } : undefined)
  );
}

let index: Map<string, LawQuestions> | undefined;

function build() {
  const map = new Map<string, { questions: Question[]; articles: Map<string, Question[]> }>();
  const seen = new Set<string>();
  for (const exam of allExams) {
    for (const q of exam.questions) {
      // Aynı soru birden fazla denemede geçebilir.
      const key = q.text + '|' + q.options.join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      const hit = locate(q);
      if (!hit) continue;
      const entry = map.get(hit.law.id) ?? { questions: [] as Question[], articles: new Map<string, Question[]>() };
      entry.questions.push(q);
      if (hit.article) entry.articles.set(hit.article, [...(entry.articles.get(hit.article) ?? []), q]);
      map.set(hit.law.id, entry);
    }
  }
  const result = new Map<string, LawQuestions>();
  for (const [id, e] of map) {
    const byArticle = [...e.articles]
      .map(([article, questions]) => ({ article, questions }))
      .sort((a, b) => Number(a.article) - Number(b.article));
    result.set(id, { questions: e.questions, byArticle });
  }
  return result;
}

export function questionsForLaw(lawId: string): LawQuestions {
  index ??= build();
  return index.get(lawId) ?? { questions: [], byArticle: [] };
}

// Kanun soruları deneme ekranında "sanal deneme" olarak açılır:
// "kanun-<kanunId>" tüm sorular, "kanun-<kanunId>--m<madde>" tek madde.
const PREFIX = 'kanun-';

export const lawExamId = (lawId: string, article?: string) =>
  `${PREFIX}${lawId}${article ? `--m${article}` : ''}`;

export function lawExam(id: string): PracticeExam | undefined {
  if (!id.startsWith(PREFIX)) return undefined;
  const [lawId, article] = id.slice(PREFIX.length).split('--m');
  const law = legislation.find((l) => l.id === lawId);
  if (!law) return undefined;
  const lq = questionsForLaw(law.id);
  const questions = article ? lq.byArticle.find((a) => a.article === article)?.questions : lq.questions;
  if (!questions?.length) return undefined;
  const name =
    law.short ??
    (law.id === 'anayasa' ? 'Anayasa' : (law.aliases?.find((a) => /^[A-ZÇĞİÖŞÜ]{3,}$/.test(a)) ?? `${law.number} sayılı Kanun`));
  return {
    id,
    title: article ? `${name} md. ${article}` : `${name} soruları`,
    durationMinutes: Math.max(5, Math.round((questions.length * 1.2) / 5) * 5),
    questions,
  };
}
