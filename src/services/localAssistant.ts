// Çevrimdışı asistan: soruyu konu özetleri ve soru bankasında arayıp en ilgili bilgileri döndürür.
// Yapay zekâ sunucusu bağlı değilken asistan sekmesi bunu kullanır; uydurma cevap üretmez,
// yalnızca uygulamadaki doğrulanmış içerikten alıntı yapar.
import { summaries } from '../data/summaries';
import { questionPool } from './questionPool';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const STOP = new Set([
  'göre', 'nedir', 'kaç', 'hangi', 'hangisi', 'için', 'olan', 'ile', 'veya', 'gibi', 'nasıl', 'midir', 'mıdır',
  'mudur', 'müdür', 'neler', 'nelerdir', 'kadar', 'olarak', 'yapılır', 'edilir', 'bir', 'bu', 'şu', 've', 'de', 'da',
  'ne', 'mi', 'mı', 'mu', 'mü', 'sayılı', 'kanun', 'kanunu', 'kanuna', 'madde', 'maddesi', 'nelerdir',
]);

const norm = (s: string) => s.toLocaleLowerCase('tr');

/** Türkçe ekleri tolere etmek için kelimelerin ilk 5 harfi (kısa kelimeler ve sayılar olduğu gibi) */
function stems(query: string) {
  return [
    ...new Set(
      norm(query)
        .split(/[^a-zçğıöşüâîû0-9/]+/)
        .filter((w) => w.length >= 2 && !STOP.has(w))
        .map((w) => (/^\d/.test(w) ? w : w.slice(0, Math.min(w.length, 5)))),
    ),
  ];
}

const score = (hay: string, keys: string[]) => keys.filter((k) => hay.includes(k)).length;

export type LocalAnswer = { text: string; found: boolean };

export function answerLocally(question: string): LocalAnswer {
  const keys = stems(question);
  if (keys.length === 0) {
    return { found: false, text: 'Sorunu biraz daha açık yazar mısın? Örneğin "gözaltı süresi" ya da "HAGB denetim süresi".' };
  }
  const need = Math.max(1, Math.ceil(keys.length * 0.6));

  const rows = summaries
    .flatMap((s) => [
      ...s.groups.flatMap((g) => g.rows.map((r) => ({ title: s.title, line: `${r.label}: ${r.value}`, source: r.source }))),
      ...(s.traps ?? []).map((t) => ({ title: s.title, line: `${t.title} ${t.text}`, source: undefined })),
    ])
    .map((r) => ({ ...r, score: score(norm(r.line), keys) }))
    .filter((r) => r.score >= need)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const q = questionPool()
    .map((x) => ({ x, score: score(norm(`${x.text} ${x.options[x.answerIndex]} ${x.explanation ?? ''}`), keys) }))
    .filter((r) => r.score >= need)
    .sort((a, b) => b.score - a.score)[0]?.x;

  if (rows.length === 0 && !q) {
    return {
      found: false,
      text: 'Bununla ilgili bir bilgi bulamadım. Farklı kelimelerle dene ya da Soru Ara ekranında anahtar kelimeyle arat.',
    };
  }

  const parts: string[] = [];
  if (rows.length) {
    parts.push(
      'Konu özetlerinden:\n' + rows.map((r) => `• ${r.line}${r.source ? ` (${r.source})` : ''}`).join('\n'),
    );
  }
  if (q) {
    parts.push(
      `İlgili soru:\n${q.text}\nDoğru cevap: ${LETTERS[q.answerIndex]}) ${q.options[q.answerIndex]}` +
        (q.explanation ? `\n${q.explanation}` : '') +
        (q.source ? `\nKaynak: ${q.source}` : ''),
    );
  }
  return { found: true, text: parts.join('\n\n') };
}
