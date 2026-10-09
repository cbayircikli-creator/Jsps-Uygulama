import type { PracticeExam } from './types';

// Örnek deneme: gerçek soru bankası eklendiğinde bu dosya (veya API) doldurulacak.
export const exams: PracticeExam[] = [
  {
    id: 'genel-mevzuat-1',
    title: 'Genel Mevzuat – Deneme 1',
    subject: 'Mevzuat',
    durationMinutes: 10,
    questions: [
      {
        id: 'q1',
        text: '2803 sayılı Kanun aşağıdakilerden hangisinin teşkilat, görev ve yetkilerini düzenler?',
        options: ['Emniyet Genel Müdürlüğü', 'Jandarma Genel Komutanlığı', 'Sahil Güvenlik Komutanlığı', 'Milli Savunma Bakanlığı'],
        answerIndex: 1,
        explanation: '2803 sayılı Kanun, Jandarma Teşkilat, Görev ve Yetkileri Kanunudur.',
      },
      {
        id: 'q2',
        text: '5271 sayılı Kanunun adı aşağıdakilerden hangisidir?',
        options: ['Türk Ceza Kanunu', 'Ceza Muhakemesi Kanunu', 'Devlet Memurları Kanunu', 'Terörle Mücadele Kanunu'],
        answerIndex: 1,
      },
      {
        id: 'q3',
        text: 'Jandarma Genel Komutanlığı hangi bakanlığa bağlıdır?',
        options: ['Milli Savunma Bakanlığı', 'Adalet Bakanlığı', 'İçişleri Bakanlığı', 'Dışişleri Bakanlığı'],
        answerIndex: 2,
      },
      {
        id: 'q4',
        text: 'Yürürlükteki Türkiye Cumhuriyeti Anayasası hangi yıl kabul edilmiştir?',
        options: ['1961', '1971', '1982', '1924'],
        answerIndex: 2,
      },
    ],
  },
  {
    id: 'personel-1',
    title: 'Personel Mevzuatı – Deneme 1',
    subject: 'Personel',
    durationMinutes: 5,
    ranks: ['astsubay', 'subay'],
    questions: [
      {
        id: 'p1',
        text: '926 sayılı Kanunun adı aşağıdakilerden hangisidir?',
        options: [
          'Türk Silahlı Kuvvetleri Personel Kanunu',
          'Devlet Memurları Kanunu',
          'Askeri Ceza Kanunu',
          'Jandarma Teşkilat, Görev ve Yetkileri Kanunu',
        ],
        answerIndex: 0,
      },
    ],
  },
];
