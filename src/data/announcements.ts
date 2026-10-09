import type { Announcement } from './types';

export const announcements: Announcement[] = [
  {
    id: 'hos-geldiniz',
    title: 'JSPS uygulamasına hoş geldiniz',
    date: '2026-10-09',
    body:
      'Mevzuat, denemeler, emsal kararlar, bilgi kartları ve yapay zekâ asistanı tek uygulamada. ' +
      'Çalışma bölümüne girdiğinizde rütbeniz sorulur ve içerikler buna göre düzenlenir.',
    important: true,
  },
  {
    id: 'icerik',
    title: 'İçerikler ekleniyor',
    date: '2026-10-09',
    body: 'Mevzuat metinleri, deneme soruları ve emsal kararlar kademeli olarak eklenecektir.',
  },
];
