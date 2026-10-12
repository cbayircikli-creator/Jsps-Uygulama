import type { Announcement } from './types';

export const announcements: Announcement[] = [
  {
    id: 'yeni-ozellikler',
    title: 'Yeni: konu testleri, istatistikler ve konu özetleri',
    date: '2026-10-12',
    body:
      'Her dersin soruları 20 soruluk konu testlerine ayrıldı. İstatistikler ekranında son 30 günlük ' +
      'çalışmanı ve derslere göre doğruluğunu görebilirsin. Konu Özetleri bölümünde sınavda en çok sorulan ' +
      'sayı, süre ve oranlar kaynak maddeleriyle birlikte yer alıyor.',
    important: true,
  },
  {
    id: 'soru-bankasi',
    title: '2.300\'ü aşkın soru, hepsi 5 şıklı ve açıklamalı',
    date: '2026-10-12',
    body:
      'Denemeler, konu testleri ve Sayılar ve Süreler Testi ile soru bankası büyüdü. Yanlışlarını ayrıca ' +
      'çözebilir, soruları işaretleyip sonra tekrar edebilirsin.',
  },
  {
    id: 'hos-geldiniz',
    title: 'JSPS Hazırlık uygulamasına hoş geldiniz',
    date: '2026-10-09',
    body:
      'Mevzuat, denemeler, bilgi kartları ve konu özetleri tek uygulamada. Tüm içerikler ücretsizdir ve ' +
      'internet bağlantısı olmadan da çalışır.',
  },
];
