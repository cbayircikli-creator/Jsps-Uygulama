import type { Rank, RankGroupId } from './types';

export const rankGroups: { id: RankGroupId; name: string }[] = [
  { id: 'uzman-erbas', name: 'Uzman Erbaş' },
  { id: 'astsubay', name: 'Astsubay' },
  { id: 'subay', name: 'Subay' },
];

// Liste ihtiyaca göre güncellenebilir; içerik filtrelemesi `group` alanına göre yapılır.
export const ranks: Rank[] = [
  { id: 'uzman-erbas', name: 'Uzman Erbaş', group: 'uzman-erbas' },

  { id: 'astsubay-cavus', name: 'Astsubay Çavuş', group: 'astsubay' },
  { id: 'kd-cavus', name: 'Kıdemli Çavuş', group: 'astsubay' },
  { id: 'ustcavus', name: 'Üstçavuş', group: 'astsubay' },
  { id: 'kd-ustcavus', name: 'Kıdemli Üstçavuş', group: 'astsubay' },
  { id: 'bascavus', name: 'Başçavuş', group: 'astsubay' },
  { id: 'kd-bascavus', name: 'Kıdemli Başçavuş', group: 'astsubay' },

  { id: 'astegmen', name: 'Asteğmen', group: 'subay' },
  { id: 'tegmen', name: 'Teğmen', group: 'subay' },
  { id: 'ustegmen', name: 'Üsteğmen', group: 'subay' },
  { id: 'yuzbasi', name: 'Yüzbaşı', group: 'subay' },
  { id: 'binbasi', name: 'Binbaşı', group: 'subay' },
  { id: 'yarbay', name: 'Yarbay', group: 'subay' },
  { id: 'albay', name: 'Albay', group: 'subay' },
];

export function findRank(id: string | null | undefined) {
  return ranks.find((r) => r.id === id);
}
