import type { CourtDecision } from './types';

// İSKELET VERİ: Aşağıdaki kayıtlar yalnızca ekran tasarımı içindir, gerçek karar DEĞİLDİR.
// Gerçek emsal kararlar eklenirken künye (esas/karar no, tarih) mutlaka kaynağından doğrulanmalı.
export const decisions: CourtDecision[] = [
  {
    id: 'ornek-1',
    court: 'Yargıtay (örnek)',
    reference: 'E. 0000/000, K. 0000/000',
    date: '—',
    topic: 'Kolluk yetkileri – arama',
    summary: 'Örnek kayıt. Gerçek karar özeti eklenecek.',
    tags: ['CMK', 'Arama'],
  },
  {
    id: 'ornek-2',
    court: 'Danıştay (örnek)',
    reference: 'E. 0000/000, K. 0000/000',
    date: '—',
    topic: 'Disiplin işlemleri',
    summary: 'Örnek kayıt. Gerçek karar özeti eklenecek.',
    tags: ['Disiplin', 'İdare'],
    ranks: ['astsubay', 'subay'],
  },
  {
    id: 'ornek-3',
    court: 'Anayasa Mahkemesi (örnek)',
    reference: 'B. No: 0000/00000',
    date: '—',
    topic: 'Kişi özgürlüğü ve güvenliği',
    summary: 'Örnek kayıt. Gerçek karar özeti eklenecek.',
    tags: ['Bireysel başvuru'],
  },
];
