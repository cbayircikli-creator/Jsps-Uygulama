import type { FlashcardDeck } from './types';

export const decks: FlashcardDeck[] = [
  {
    id: 'kanun-numaralari',
    title: 'Kanun Numaraları',
    subject: 'Mevzuat',
    cards: [
      { id: 'c1', front: '2803', back: 'Jandarma Teşkilat, Görev ve Yetkileri Kanunu' },
      { id: 'c2', front: '5237', back: 'Türk Ceza Kanunu' },
      { id: 'c3', front: '5271', back: 'Ceza Muhakemesi Kanunu' },
      { id: 'c4', front: '2559', back: 'Polis Vazife ve Salahiyet Kanunu' },
      { id: 'c5', front: '3713', back: 'Terörle Mücadele Kanunu' },
      { id: 'c6', front: '2911', back: 'Toplantı ve Gösteri Yürüyüşleri Kanunu' },
      { id: 'c7', front: '657', back: 'Devlet Memurları Kanunu' },
      { id: 'c8', front: '926', back: 'Türk Silahlı Kuvvetleri Personel Kanunu' },
    ],
  },
];
