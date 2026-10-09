// Claude artifact'larında hazırlanmış JSPS denemelerini uygulamanın soru formatına çevirir.
//
// Kullanım: node scripts/import-artifacts.mjs <artifact-html-klasörü>
// Çıktı:    src/data/exams/<id>.json ve src/data/exams/index.ts
//
// Artifact'larda beş farklı soru formatı kullanıldı; hepsi aşağıda tek tipe dönüştürülür.
import fs from 'node:fs';
import path from 'node:path';

const SRC = process.argv[2];
if (!SRC) {
  console.error('Kullanım: node scripts/import-artifacts.mjs <klasör>');
  process.exit(1);
}
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'src', 'data', 'exams');

// Başlığa göre deneme kimliği, adı ve sırası (yeniden eskiye).
const CATALOG = [
  ['JSPS Uzman Erbaş Denemesi 6', 'ue-6', 'Uzman Erbaş Denemesi 6'],
  ['JSPS Genel Tekrar Denemesi', 'genel-tekrar', 'Genel Tekrar Denemesi'],
  ['JSPS Uzman Erbaş Denemesi 5', 'ue-5', 'Uzman Erbaş Denemesi 5'],
  ['JSPS Uzman Erbaş Denemesi 4', 'ue-4', 'Uzman Erbaş Denemesi 4'],
  ['JSPS Uzman Erbaş Denemesi 3', 'ue-3', 'Uzman Erbaş Denemesi 3'],
  ['JSPS Uzman Erbaş Denemesi 2', 'ue-2', 'Uzman Erbaş Denemesi 2'],
  ['JSPS Uzman Erbaş Denemesi ·', 'ue-1', 'Uzman Erbaş Denemesi 1'],
  ['JSPS Deneme 15', 'deneme-15', 'Deneme 15'],
  ['JSPS Deneme 14', 'deneme-14', 'Deneme 14'],
  ['JSPS Deneme 13', 'deneme-13', 'Deneme 13'],
  ['JSPS Deneme 12', 'deneme-12', 'Deneme 12'],
  ['JSPS Deneme 11', 'deneme-11', 'Deneme 11'],
  ['JSPS Deneme 10', 'deneme-10', 'Deneme 10'],
  ['JSPS Deneme 9', 'deneme-9', 'Deneme 9'],
  ['JSPS Deneme 8', 'deneme-8', 'Deneme 8'],
  ['JSPS Deneme 3 — Anında Açıklamalı', 'deneme-3a', 'Deneme 3 (Açıklamalı)'],
  ['JSPS Deneme 3 — Anında Çözümlü', 'deneme-3b', 'Deneme 3 (Çözümlü)'],
  ['JSPS Deneme 2 — Anında Çözümlü', 'deneme-2', 'Deneme 2'],
  ['JSPS Deneme — Uzman Erbaş (Yeni Set)', 'yeni-set', 'Uzman Erbaş Yeni Set'],
  ['JSPS Mega Deneme 2', 'mega-2', 'Mega Deneme 2 · Kongreler ve Güncel'],
  ['JSPS Mega Kapsama Denemesi', 'mega-1', 'Mega Kapsama Denemesi'],
];

const SUBJECTS = ['Türkçe', 'Tarih', 'Anayasa', 'Güncel', 'Muhakeme', 'Mevzuat'];
const CODE = { tr: 'Türkçe', ta: 'Tarih', an: 'Anayasa', gu: 'Güncel', mu: 'Muhakeme', mm: 'Mevzuat', mb: 'Mevzuat' };

function subjectOf(raw) {
  const s = String(raw ?? '');
  if (CODE[s]) return CODE[s];
  if (s.startsWith('Türkçe')) return 'Türkçe';
  if (s.startsWith('Tarih') || s.startsWith('Atatürk')) return 'Tarih';
  if (s.startsWith('Anayasa')) return 'Anayasa';
  if (s.startsWith('Güncel')) return 'Güncel';
  if (s.startsWith('Muhakeme')) return 'Muhakeme';
  if (s.startsWith('Mevzuat') || s.startsWith('Meslek')) return 'Mevzuat';
  throw new Error(`Bilinmeyen konu: ${s}`);
}

// `const X=[...]` içindeki diziyi, dizgelerdeki köşeli parantezlere takılmadan çıkarır.
function extractArray(html) {
  const m = html.match(/const (Q|QS|D)=\[/);
  if (!m) throw new Error('Soru dizisi bulunamadı');
  let i = m.index + m[0].length - 1;
  const start = i;
  let depth = 0;
  let inStr = false;
  for (; i < html.length; i++) {
    const c = html[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === '[') depth++;
    else if (c === ']' && --depth === 0) break;
  }
  return JSON.parse(html.slice(start, i + 1));
}

const clean = (s) => (typeof s === 'string' && s.trim() ? s.trim() : undefined);

function normalize(raw) {
  // A: cat/stem/opts/ci/why/exp/src
  if ('stem' in raw) {
    return {
      subject: subjectOf(raw.cat),
      text: raw.stem,
      options: raw.opts,
      answerIndex: raw.ci,
      explanation: clean(raw.exp),
      optionNotes: raw.why,
      source: clean(raw.src),
    };
  }
  // C: b/m/q/o/w/d/a (d = doğru şık, a = açıklama)
  if ('d' in raw && 'b' in raw) {
    return {
      subject: SUBJECTS[raw.b],
      topic: clean(raw.m),
      text: raw.q,
      options: raw.o,
      answerIndex: raw.d,
      explanation: clean(raw.a),
      optionNotes: raw.w,
    };
  }
  // B: s(kod)/p/q/o/a/e/w/k
  if ('k' in raw) {
    return {
      subject: subjectOf(raw.s),
      passage: clean(raw.p),
      text: raw.q,
      options: raw.o,
      answerIndex: raw.a,
      explanation: clean(raw.e),
      optionNotes: raw.w,
      source: clean(raw.k),
    };
  }
  // E: s/q/o/w/a/r (açıklama doğru şıkkın notunda)
  if ('w' in raw && 'r' in raw) {
    return {
      subject: subjectOf(raw.s),
      text: raw.q,
      options: raw.o,
      answerIndex: raw.a,
      explanation: clean(raw.w[raw.a]),
      optionNotes: raw.w.map((n, i) => (i === raw.a ? '' : n)),
      source: clean(raw.r),
    };
  }
  // D: s/l?/q/o/a/e
  return {
    subject: subjectOf(raw.s),
    topic: clean(raw.l),
    text: raw.q,
    options: raw.o,
    answerIndex: raw.a,
    explanation: clean(raw.e),
  };
}

fs.mkdirSync(OUT, { recursive: true });
const found = new Map();
for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(SRC, file), 'utf8');
  const title = html.match(/<title>([^<]*)/)?.[1] ?? '';
  const entry = CATALOG.find(([prefix]) => title.startsWith(prefix));
  if (!entry) {
    console.warn(`Atlandı (katalogda yok): ${title}`);
    continue;
  }
  const [, id, name] = entry;
  const questions = extractArray(html).map((raw, i) => {
    const q = normalize(raw);
    if (!Array.isArray(q.options) || q.options.length !== 5) throw new Error(`${id} #${i + 1}: 5 şık yok`);
    if (!(q.answerIndex >= 0 && q.answerIndex < 5)) throw new Error(`${id} #${i + 1}: geçersiz cevap`);
    if (q.optionNotes) q.optionNotes = q.optionNotes.map((n) => n ?? '');
    return { id: `${id}-${i + 1}`, ...q };
  });
  found.set(id, { id, title: name, questions });
}

const exams = CATALOG.map(([, id]) => found.get(id)).filter(Boolean);
for (const e of exams) {
  // 100 soruya 120 dakika oranı korunur.
  const durationMinutes = Math.round((e.questions.length * 1.2) / 5) * 5;
  const exam = { id: e.id, title: e.title, durationMinutes, ranks: ['uzman-erbas'], questions: e.questions };
  fs.writeFileSync(path.join(OUT, `${e.id}.json`), JSON.stringify(exam, null, 1) + '\n');
}

const toIdent = (id) => id.replace(/-(\w)/g, (_, c) => c.toUpperCase()).replace(/^(\d)/, '_$1');
const index =
  '// Bu dosya scripts/import-artifacts.mjs tarafından üretilir; elle düzenlemeyin.\n' +
  "import type { PracticeExam } from '../types';\n\n" +
  exams.map((e) => `import ${toIdent(e.id)} from './${e.id}.json';`).join('\n') +
  '\n\nexport const importedExams = [\n' +
  exams.map((e) => `  ${toIdent(e.id)},`).join('\n') +
  '\n] as PracticeExam[];\n';
fs.writeFileSync(path.join(OUT, 'index.ts'), index);

for (const e of exams) console.log(`${e.id.padEnd(14)} ${String(e.questions.length).padStart(4)} soru`);
console.log(`Toplam: ${exams.length} deneme, ${exams.reduce((s, e) => s + e.questions.length, 0)} soru`);
