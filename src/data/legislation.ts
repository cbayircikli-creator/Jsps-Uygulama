import type { Legislation } from './types';

// Denemelerde geçen kanunlar. Adlar soru metinlerinde geçtiği hâliyle alındı.
// Madde metinleri uygulamaya kopyalanmaz; güncel resmî metin mevzuat.gov.tr'den açılır.
// `aliases`, soruların "Kaynak" alanındaki kısaltmalarla eşleştirmek içindir.
const law = (number: string, title: string, extra: Partial<Legislation> = {}): Legislation => ({
  id: number,
  number,
  title,
  category: 'Kanun',
  ...extra,
});

function reg(id: string, title: string, short: string, aliases: string[] = []): Legislation {
  return { id, title, short, category: 'Yönetmelik', aliases: [title, ...aliases] };
}

export const legislation: Legislation[] = [
  law('2709', 'Türkiye Cumhuriyeti Anayasası', { id: 'anayasa', aliases: ['1982 Anayasası', 'Anayasa', 'Any.'] }),
  law('2803', 'Jandarma Teşkilat, Görev ve Yetkileri Kanunu', { id: 'jandarma-teskilat' }),
  law('5237', 'Türk Ceza Kanunu', { id: 'tck', aliases: ['TCK'] }),
  law('5271', 'Ceza Muhakemesi Kanunu', { id: 'cmk', aliases: ['CMK'] }),
  law('2559', 'Polis Vazife ve Salahiyet Kanunu', { id: 'pvsk', aliases: ['PVSK'] }),
  law('6284', 'Ailenin Korunması ve Kadına Karşı Şiddetin Önlenmesine Dair Kanun'),
  law('6458', 'Yabancılar ve Uluslararası Koruma Kanunu'),
  law('7068', 'Genel Kolluk Disiplin Hükümleri Hakkında Kanun'),
  law('5326', 'Kabahatler Kanunu'),
  law('6698', 'Kişisel Verilerin Korunması Kanunu', { aliases: ['KVKK'] }),
  law('2918', 'Karayolları Trafik Kanunu'),
  law('5395', 'Çocuk Koruma Kanunu'),
  law('2911', 'Toplantı ve Gösteri Yürüyüşleri Kanunu'),
  law('5442', 'İl İdaresi Kanunu'),
  law('5188', 'Özel Güvenlik Hizmetlerine Dair Kanun'),
  law('6136', 'Ateşli Silahlar ve Bıçaklar ile Diğer Aletler Hakkında Kanun'),
  law('657', 'Devlet Memurları Kanunu'),
  law('2893', 'Türk Bayrağı Kanunu'),
  law('1774', 'Kimlik Bildirme Kanunu'),
  law('2935', 'Olağanüstü Hal Kanunu'),
  law('2863', 'Kültür ve Tabiat Varlıklarını Koruma Kanunu'),
  law('5070', 'Elektronik İmza Kanunu'),
  law('3713', 'Terörle Mücadele Kanunu'),
  law('4342', 'Mera Kanunu'),
  law('6222', 'Sporda Şiddet ve Düzensizliğin Önlenmesine Dair Kanun'),
  law('7201', 'Tebligat Kanunu'),
  law('4915', 'Kara Avcılığı Kanunu'),
  law('5199', 'Hayvanları Koruma Kanunu'),
  law('1380', 'Su Ürünleri Kanunu'),
  law('5816', 'Atatürk Aleyhine İşlenen Suçlar Hakkında Kanun'),
  law('3269', 'Uzman Erbaş Kanunu'),
  law('2860', 'Yardım Toplama Kanunu'),
  law('4207', 'Tütün Ürünlerinin Zararlarının Önlenmesi ve Kontrolü Hakkında Kanun'),
  law('4982', 'Bilgi Edinme Hakkı Kanunu'),
  law('4483', 'Memurlar ve Diğer Kamu Görevlilerinin Yargılanması Hakkında Kanun'),
  law('5607', 'Kaçakçılıkla Mücadele Kanunu'),
  law('6831', 'Orman Kanunu'),
  law('3298', 'Uyuşturucu Maddelerle İlgili Kanun'),
  law('6415', 'Terörizmin Finansmanının Önlenmesi Hakkında Kanun'),
  law('2872', 'Çevre Kanunu'),
  law('3091', 'Taşınmaz Mal Zilyetliğine Yapılan Tecavüz veya Müdahalelerin Önlenmesi Hakkında Kanun'),
  law('211', 'İç Hizmet Kanunu'),
  law('6413', 'Türk Silahlı Kuvvetleri Disiplin Kanunu'),
  law('5901', 'Türk Vatandaşlığı Kanunu'),
  law('7179', 'Askeralma Kanunu'),
  law('926', 'Türk Silahlı Kuvvetleri Personel Kanunu', { id: 'tsk-personel', ranks: ['astsubay', 'subay'] }),

  // Yönetmelikler: `aliases` hem tam adı hem kaynaklardaki kısaltmaları içerir.
  reg('jtgy', 'Jandarma Teşkilat, Görev ve Yetkileri Yönetmeliği', 'JTGY', ['JTGY']),
  reg('aramalar', 'Adli ve Önleme Aramaları Yönetmeliği', 'Aramalar Yön.', [
    'Adli ve Önleme Aramaları Yön.',
    'Aramalar Yön.',
    'Aramalar Yönetmeliği',
  ]),
  reg('yakalama', 'Yakalama, Gözaltına Alma ve İfade Alma Yönetmeliği', 'Yakalama Yön.', [
    'Yakalama Yön.',
    'Yakalama Yönetmeliği',
  ]),
  reg('trafik-yonetmeligi', 'Karayolları Trafik Yönetmeliği', 'Trafik Yön.'),
  reg('adli-kolluk', 'Adli Kolluk Yönetmeliği', 'Adli Kolluk Yön.', ['Adli Kolluk Yön.']),
  reg('personel-yonetmeligi', 'Jandarma Genel Komutanlığı ve Sahil Güvenlik Komutanlığı Personel Yönetmeliği', 'Personel Yön.', [
    'Personel Yön.',
    'Personel Yönetmeliği',
  ]),
  reg('atesli-silahlar-yonetmeligi', 'Ateşli Silahlar ve Bıçaklar ile Diğer Aletler Hakkında Yönetmelik', 'Ateşli Silahlar Yön.', [
    'Ateşli Silahlar Yön.',
    'Ateşli Silahlar Yönetmeliği',
  ]),
  reg('suc-esyasi', 'Suç Eşyası Yönetmeliği', 'Suç Eşyası Yön.', ['Suç Eşyası Yön.']),
  reg('izin', 'Jandarma Genel Komutanlığı İzin Yönetmeliği', 'İzin Yön.', ['JGK İzin Yön.']),
  reg(
    'beden-muayenesi',
    'Ceza Muhakemesinde Beden Muayenesi, Genetik İncelemeler ve Fizik Kimliğin Tespiti Hakkında Yönetmelik',
    'Beden Muayenesi Yön.',
    ['Beden Muayenesi Yön.', 'Beden Muayenesi Yönetmeliği'],
  ),
  reg('ses-gaz', 'Ses ve Gaz Fişeği Atabilen Silahlar Hakkında Yönetmelik', 'Ses ve Gaz Yön.', ['Ses ve Gaz Yön.']),
  reg('resmi-yazisma', 'Resmî Yazışmalarda Uygulanacak Usul ve Esaslar Hakkında Yönetmelik', 'Resmî Yazışma Yön.', [
    'Resmî Yazışma Yön.',
    'Resmî Yazışma Yönetmeliği',
  ]),
  reg('hizmet-esaslari', 'Jandarma ve Sahil Güvenlik Personelinin Hizmet Esasları Hakkında Yönetmelik', 'Hizmet Esasları Yön.', [
    'Hizmet Esasları Yön.',
    'Hizmet Esasları Yönetmeliği',
  ]),
  reg('isyeri-acma', 'İşyeri Açma ve Çalışma Ruhsatlarına İlişkin Yönetmelik', 'İşyeri Açma Yön.', ['İşyeri Açma Yön.']),
  reg('6284-uygulama', '6284 Sayılı Kanuna İlişkin Uygulama Yönetmeliği', '6284 Uyg. Yön.', [
    '6284 Uyg. Yön.',
    '6284 sayılı Kanuna İlişkin Uygulama Yönetmeliği',
  ]),
  reg(
    'veri-silme',
    'Kişisel Verilerin Silinmesi, Yok Edilmesi veya Anonim Hale Getirilmesi Hakkında Yönetmelik',
    'Silme Yön.',
    ['Silme Yön.', 'Silme Yönetmeliği'],
  ),
  reg('kum-cakil', 'Kum, Çakıl ve Benzeri Maddelerin Alınması, İşletilmesi ve Kontrolü Yönetmeliği', 'Kum-Çakıl Yön.', [
    'Kum-Çakıl Yön.',
    'Çakıl Yön.',
  ]),
];

/**
 * Resmî metnin adresi. Kanunlar numarasıyla doğrudan açılır; yönetmeliklerin
 * sistemdeki numarasını bilmediğimiz için mevzuat.gov.tr içinde adıyla aranır.
 */
export const officialUrl = (l: Legislation) =>
  l.number
    ? `https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=${l.number}&MevzuatTur=1&MevzuatTertip=5`
    : `https://www.google.com/search?q=${encodeURIComponent(`site:mevzuat.gov.tr "${l.title}"`)}`;
