import type { Legislation } from './types';

// İSKELET VERİ: Başlıklar gerçek mevzuatı gösterir, madde metinleri henüz eklenmedi.
// Resmî metinler mevzuat.gov.tr kaynağından alınıp buraya (veya ileride API'ye) taşınacak.
const placeholder = 'Madde metni eklenecek.';

export const legislation: Legislation[] = [
  {
    id: 'anayasa',
    title: 'Türkiye Cumhuriyeti Anayasası',
    number: '2709',
    category: 'Kanun',
    summary: 'Temel hak ve ödevler, devletin temel organları ve idarenin yapısı.',
    articles: [
      { no: '1', title: "Devletin şekli", text: placeholder },
      { no: '2', title: "Cumhuriyetin nitelikleri", text: placeholder },
    ],
  },
  {
    id: 'jandarma-teskilat',
    title: 'Jandarma Teşkilat, Görev ve Yetkileri Kanunu',
    number: '2803',
    category: 'Kanun',
    summary: 'Jandarma Genel Komutanlığının kuruluşu, görevleri ve yetkileri.',
    articles: [
      { no: '1', title: 'Amaç ve kapsam', text: placeholder },
      { no: '7', title: 'Görevler', text: placeholder },
    ],
  },
  {
    id: 'tck',
    title: 'Türk Ceza Kanunu',
    number: '5237',
    category: 'Kanun',
    summary: 'Suç ve cezaya ilişkin genel hükümler ile suç tipleri.',
    articles: [{ no: '1', title: 'Ceza Kanununun amacı', text: placeholder }],
  },
  {
    id: 'cmk',
    title: 'Ceza Muhakemesi Kanunu',
    number: '5271',
    category: 'Kanun',
    summary: 'Soruşturma ve kovuşturma işlemleri, koruma tedbirleri.',
    articles: [{ no: '1', title: 'Kanunun kapsamı', text: placeholder }],
  },
  {
    id: 'pvsk',
    title: 'Polis Vazife ve Salahiyet Kanunu',
    number: '2559',
    category: 'Kanun',
    summary: 'Kolluk görev ve yetkilerine ilişkin temel hükümler.',
    articles: [{ no: '1', title: 'Görev', text: placeholder }],
  },
  {
    id: 'tsk-personel',
    title: 'Türk Silahlı Kuvvetleri Personel Kanunu',
    number: '926',
    category: 'Kanun',
    summary: 'Subay ve astsubayların atanma, terfi ve özlük hakları.',
    ranks: ['astsubay', 'subay'],
    articles: [{ no: '1', title: 'Kapsam', text: placeholder }],
  },
];
