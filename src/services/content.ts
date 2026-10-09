// Tüm içerik erişimi bu dosyadan geçer. İleride sunucu/API'ye geçildiğinde
// yalnızca buradaki fonksiyonların içi değişir, ekranlar aynı kalır.
import { announcements } from '../data/announcements';
import { decisions } from '../data/decisions';
import { importedExams as exams } from '../data/exams';
import { decks } from '../data/flashcards';
import { legislation } from '../data/legislation';
import type { RankGroupId } from '../data/types';

function forRank<T extends { ranks?: RankGroupId[] }>(items: T[], group?: RankGroupId | null) {
  if (!group) return items;
  return items.filter((item) => !item.ranks || item.ranks.includes(group));
}

function matches(query: string, ...fields: (string | undefined)[]) {
  const q = query.trim().toLocaleLowerCase('tr');
  if (!q) return true;
  return fields.some((f) => f?.toLocaleLowerCase('tr').includes(q));
}

export const content = {
  legislation: (query = '', group?: RankGroupId | null) =>
    forRank(legislation, group).filter((l) => matches(query, l.title, l.number, l.summary)),
  legislationById: (id: string) => legislation.find((l) => l.id === id),

  decisions: (query = '', group?: RankGroupId | null) =>
    forRank(decisions, group).filter((d) => matches(query, d.court, d.topic, d.summary, ...d.tags)),
  decisionById: (id: string) => decisions.find((d) => d.id === id),

  announcements: () => [...announcements].sort((a, b) => b.date.localeCompare(a.date)),
  announcementById: (id: string) => announcements.find((a) => a.id === id),

  exams: (group?: RankGroupId | null) => forRank(exams, group),
  examById: (id: string) => exams.find((e) => e.id === id),

  decks: (group?: RankGroupId | null) => forRank(decks, group),
  deckById: (id: string) => decks.find((d) => d.id === id),
};
