import type { Rank } from './types';

// Sınava girenler üç gruptur; rütbe ayrıntısı gerekmez.
export const ranks: Rank[] = [
  { id: 'uzman-cavus', name: 'Uzman Çavuş', group: 'uzman-cavus' },
  { id: 'astsubay', name: 'Astsubay', group: 'astsubay' },
  { id: 'subay', name: 'Subay', group: 'subay' },
];

// Eski sürümlerde kaydedilen ayrıntılı rütbeler yeni gruplara taşınır.
const LEGACY: Record<string, string> = {
  'uzman-erbas': 'uzman-cavus',
  'astsubay-cavus': 'astsubay',
  'kd-cavus': 'astsubay',
  ustcavus: 'astsubay',
  'kd-ustcavus': 'astsubay',
  bascavus: 'astsubay',
  'kd-bascavus': 'astsubay',
  astegmen: 'subay',
  tegmen: 'subay',
  ustegmen: 'subay',
  yuzbasi: 'subay',
  binbasi: 'subay',
  yarbay: 'subay',
  albay: 'subay',
};

export function findRank(id: string | null | undefined) {
  const key = id ? (LEGACY[id] ?? id) : id;
  return ranks.find((r) => r.id === key);
}
