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
];

/** Resmî metnin mevzuat.gov.tr adresi */
export const officialUrl = (l: Legislation) =>
  `https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=${l.number}&MevzuatTur=1&MevzuatTertip=5`;
