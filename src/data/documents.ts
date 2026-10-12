// Tutanak, dilekçe ve üst yazı örnekleri.
// Bunlar biçim örneğidir; birliğin kullandığı resmî form ve güncel mevzuat esas alınmalıdır.
// Metindeki {{alan}} yer tutucuları belge ekranındaki formdan doldurulur.

export type DocCategory = 'tutanak' | 'dilekce' | 'ustyazi';

export type DocField = {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  /** Varsayılan değer: bugünün tarihi, şimdiki saat veya kayıtlı kullanıcı bilgisi */
  auto?: 'date' | 'time' | 'officerName' | 'officerRank' | 'officerUnit';
};

export type DocTemplate = {
  id: string;
  category: DocCategory;
  title: string;
  summary: string;
  basis?: string;
  fields: DocField[];
  body: string;
  notes?: string[];
};

export const categories: { id: DocCategory; title: string; icon: 'document-text' | 'create' | 'mail'; summary: string }[] = [
  { id: 'tutanak', title: 'Tutanaklar', icon: 'document-text', summary: 'İfade, bilgi alma, yakalama, arama ve diğer tutanaklar' },
  { id: 'dilekce', title: 'Dilekçeler', icon: 'create', summary: 'İzin, şikâyet, bilgi edinme ve talep dilekçeleri' },
  { id: 'ustyazi', title: 'Üst Yazılar', icon: 'mail', summary: 'Resmî yazışma biçiminde gönderme ve talep yazıları' },
];

// Sık kullanılan alanlar
const tarih: DocField = { key: 'tarih', label: 'Tarih', auto: 'date' };
const saat: DocField = { key: 'saat', label: 'Saat', auto: 'time' };
const yer: DocField = { key: 'yer', label: 'Yer', placeholder: 'Ör. Merkez Jandarma Karakol Komutanlığı' };
const duzenleyen: DocField = { key: 'duzenleyen', label: 'Düzenleyen (ad soyad)', auto: 'officerName' };
const rutbe: DocField = { key: 'rutbe', label: 'Düzenleyenin rütbesi / unvanı', auto: 'officerRank' };
const duzenleyen2: DocField = { key: 'duzenleyen2', label: 'İkinci görevli (ad soyad, rütbe)' };
const birlik: DocField = { key: 'birlik', label: 'Birlik / kurum', auto: 'officerUnit' };

const imzalar = `
Düzenleyen                         Düzenleyen
{{duzenleyen}}                     {{duzenleyen2}}
{{rutbe}}`;

export const documents: DocTemplate[] = [
  // ---------------------------------------------------------------- Tutanaklar
  {
    id: 'ifade-tutanagi',
    category: 'tutanak',
    title: 'Şüpheli İfade Tutanağı',
    summary: 'Kollukta şüphelinin ifadesi alınırken düzenlenir.',
    basis: 'CMK md. 147 (ifade ve sorguda uyulacak hususlar), md. 148 (yasak usuller); Yakalama, Gözaltına Alma ve İfade Alma Yönetmeliği',
    fields: [
      tarih,
      saat,
      yer,
      { key: 'supheli', label: 'Şüphelinin adı soyadı' },
      { key: 'tc', label: 'T.C. kimlik no' },
      { key: 'kimlik', label: 'Baba adı, ana adı, doğum yeri ve tarihi', multiline: true },
      { key: 'adres', label: 'Adresi ve telefonu', multiline: true },
      { key: 'suc', label: 'İsnat edilen suç' },
      { key: 'mudafi', label: 'Müdafi bilgisi', placeholder: 'Ör. Av. ... (baro tarafından görevlendirildi) / Müdafi istemedi' },
      { key: 'haber', label: 'Yakalandığından haberdar edilen yakını', placeholder: 'Ad soyad, yakınlık, telefon' },
      { key: 'beyan', label: 'Şüphelinin beyanı', multiline: true },
      duzenleyen,
      rutbe,
      duzenleyen2,
    ],
    body: `ŞÜPHELİ İFADE TUTANAĞI

Tarih: {{tarih}}      Saat: {{saat}}
Yer: {{yer}}

Şüphelinin
Adı soyadı : {{supheli}}
T.C. kimlik no : {{tc}}
Kimlik bilgileri : {{kimlik}}
Adresi / telefonu : {{adres}}

İsnat edilen suç : {{suc}}

Şüpheliye ifadesine başlanmadan önce;
1. Hakkındaki suçlamanın ne olduğu anlatıldı,
2. Müdafi seçme hakkının bulunduğu, müdafi seçecek durumda değilse ve isterse baro tarafından müdafi görevlendirileceği bildirildi,
3. Yakınlarından istediğine yakalandığının bildirileceği söylendi,
4. Yasal olarak suçlamaya karşı açıklamada bulunmamasının (susma) hakkı olduğu hatırlatıldı,
5. Şüpheden kurtulması için somut delillerin toplanmasını isteyebileceği, aleyhine olan şüphe sebeplerini ortadan kaldırma ve lehine olan hususları ileri sürme imkânının bulunduğu bildirildi,
6. Kişisel ve ekonomik durumu hakkında bilgi istendi.

Müdafi : {{mudafi}}
Haber verilen yakını : {{haber}}

Şüphelinin beyanı:
{{beyan}}

İfade, şüpheliye okundu / okuması için verildi; söylediklerinin aynen yazıldığını beyan etmesi üzerine birlikte imza altına alındı.

İfade Veren                        İfadeyi Alan                      İfadeyi Alan
{{supheli}}                        {{duzenleyen}}                    {{duzenleyen2}}
                                   {{rutbe}}
Müdafi
{{mudafi}}`,
    notes: [
      'Kötü davranma, işkence, ilaç verme, yorma, aldatma, cebir veya tehdit gibi iradeyi bozan yasak usuller uygulanamaz; bu yollarla alınan ifade rıza olsa bile delil olarak kullanılamaz (CMK md. 148).',
      'Müdafi hazır bulunmadan kollukta alınan ifade, hâkim veya mahkeme önünde doğrulanmadıkça hükme esas alınamaz.',
      'İfade, kanunda belirtilen hâllerde ses ve görüntü kayıt cihazıyla kayda alınabilir.',
    ],
  },
  {
    id: 'bilgi-alma',
    category: 'tutanak',
    title: 'Bilgi Alma Tutanağı',
    summary: 'Şüpheli sıfatı olmayan tanık, mağdur veya bilgi sahibinden bilgi alınırken düzenlenir.',
    basis: 'Yakalama, Gözaltına Alma ve İfade Alma Yönetmeliği; CMK',
    fields: [
      tarih,
      saat,
      yer,
      { key: 'kisi', label: 'Bilgi veren kişinin adı soyadı' },
      { key: 'tc', label: 'T.C. kimlik no' },
      { key: 'sifat', label: 'Sıfatı', placeholder: 'Tanık / mağdur / müşteki / bilgi sahibi' },
      { key: 'adres', label: 'Adresi ve telefonu', multiline: true },
      { key: 'olay', label: 'Konu olan olay', multiline: true },
      { key: 'beyan', label: 'Beyanı', multiline: true },
      duzenleyen,
      rutbe,
      duzenleyen2,
    ],
    body: `BİLGİ ALMA TUTANAĞI

Tarih: {{tarih}}      Saat: {{saat}}
Yer: {{yer}}

Bilgi verenin
Adı soyadı : {{kisi}}
T.C. kimlik no : {{tc}}
Sıfatı : {{sifat}}
Adresi / telefonu : {{adres}}

Konu: {{olay}}

Yukarıda kimliği yazılı kişiye konu olay hakkında bilgisine başvurulacağı anlatıldı. Kendisinin şüpheli olmadığı, bildiklerini doğru olarak anlatması gerektiği hatırlatıldı. Sorulması üzerine;

Beyanı:
{{beyan}}

Beyanı kendisine okundu, söylediklerinin aynen yazıldığını beyan etmesi üzerine birlikte imza altına alındı.

Bilgi Veren                        Bilgi Alan                        Bilgi Alan
{{kisi}}                           {{duzenleyen}}                    {{duzenleyen2}}
                                   {{rutbe}}`,
    notes: [
      'Bilgi alınırken kişinin şüpheli konumuna geçtiği anlaşılırsa işleme son verilir ve şüpheli hakları hatırlatılarak ifade alma usulüne geçilir.',
      'Tanıklıktan çekinme hakkı bulunan yakınlar (CMK md. 45) bu haklarını kullanabilir.',
    ],
  },
  {
    id: 'yakalama-gozalti',
    category: 'tutanak',
    title: 'Yakalama ve Gözaltına Alma Tutanağı',
    summary: 'Kişi yakalandığında ve gözaltına alındığında olayın ve hakların bildirildiğini gösterir.',
    basis: 'CMK md. 90 (yakalama), md. 91 (gözaltı), md. 95 (yakınlara haber verme); Yakalama, Gözaltına Alma ve İfade Alma Yönetmeliği',
    fields: [
      tarih,
      saat,
      yer,
      { key: 'supheli', label: 'Yakalanan kişinin adı soyadı' },
      { key: 'tc', label: 'T.C. kimlik no' },
      { key: 'suc', label: 'Yakalamaya neden olan suç' },
      { key: 'olay', label: 'Yakalama olayının anlatımı', multiline: true },
      { key: 'savci', label: 'Bilgi verilen Cumhuriyet savcısı ve talimatı', multiline: true },
      { key: 'haber', label: 'Haber verilen yakını', placeholder: 'Ad soyad, yakınlık, telefon, saat' },
      duzenleyen,
      rutbe,
      duzenleyen2,
    ],
    body: `YAKALAMA VE GÖZALTINA ALMA TUTANAĞI

Tarih: {{tarih}}      Saat: {{saat}}
Yer: {{yer}}

Yakalanan kişi : {{supheli}}
T.C. kimlik no : {{tc}}
Suç : {{suc}}

Olay:
{{olay}}

Yukarıda kimliği yazılı şahıs yakalanmış, yakalama nedeni ve kanuni hakları derhâl kendisine bildirilmiş, "Şüpheli ve Sanık Hakları Formu" verilmiştir. Kişinin üzerinde güvenlik araması yapılmıştır.

Olaydan Cumhuriyet savcısına bilgi verilmiş olup talimatı:
{{savci}}

Yakalandığı ve gözaltına alındığı yakınına bildirilmiştir: {{haber}}

İşbu tutanak olay yerinde / birlikte düzenlenerek imza altına alınmıştır.

Yakalanan                          Düzenleyen                        Düzenleyen
{{supheli}}                        {{duzenleyen}}                    {{duzenleyen2}}
                                   {{rutbe}}`,
    notes: [
      'Gözaltı süresi yakalama anından itibaren 24 saati geçemez; toplu suçlarda savcının yazılı emriyle her defasında 1 gün, en fazla 3 gün uzatılabilir (CMK md. 91).',
      'Yakalanan kişi imzadan kaçınırsa bu durum ve nedeni tutanağa yazılır.',
    ],
  },
  {
    id: 'arama-elkoyma',
    category: 'tutanak',
    title: 'Arama ve Elkoyma Tutanağı',
    summary: 'Hâkim kararı veya savcının yazılı emriyle yapılan aramada ele geçen eşyayı kayda geçirir.',
    basis: 'CMK md. 116–119 (arama), md. 123 ve devamı (elkoyma), md. 127 (elkoymada yetki); Adli ve Önleme Aramaları Yönetmeliği',
    fields: [
      tarih,
      saat,
      yer,
      { key: 'karar', label: 'Arama kararı / yazılı emir', placeholder: 'Ör. ... Sulh Ceza Hâkimliğinin ... tarih ve ... D. İş sayılı kararı' },
      { key: 'aranan', label: 'Aranan kişi / yer / araç' },
      { key: 'hazir', label: 'Aramada hazır bulunanlar', multiline: true, placeholder: 'Konut sahibi, ihtiyar heyetinden veya komşulardan iki kişi vb.' },
      { key: 'esya', label: 'Ele geçen eşya (cins, miktar, özellik)', multiline: true },
      { key: 'aciklama', label: 'Ek açıklama', multiline: true },
      duzenleyen,
      rutbe,
      duzenleyen2,
    ],
    body: `ARAMA VE ELKOYMA TUTANAĞI

Tarih: {{tarih}}      Saat: {{saat}}
Yer: {{yer}}

Dayanak : {{karar}}
Aranan : {{aranan}}

Aramada hazır bulunanlar:
{{hazir}}

Dayanak karar / emir ilgiliye gösterilerek arama işlemine başlanmıştır. Arama sonucunda aşağıda yazılı eşya ele geçirilerek el konulmuş ve muhafaza altına alınmıştır:

{{esya}}

Açıklama:
{{aciklama}}

Ele geçen eşyanın listesi ilgiliye verilmiştir. İşbu tutanak hazır bulunanlarla birlikte imza altına alınmıştır.

Hazır Bulunanlar                   Düzenleyen                        Düzenleyen
                                   {{duzenleyen}}                    {{duzenleyen2}}
                                   {{rutbe}}`,
    notes: [
      'Konut araması hâkim kararıyla, gecikmesinde sakınca bulunan hâlde Cumhuriyet savcısının yazılı emriyle yapılır; kolluk amiri konutta arama emri veremez (CMK md. 119).',
      'Cumhuriyet savcısı bulunmadan yapılan konut, işyeri ve kapalı alan aramasında o yer ihtiyar heyetinden veya komşulardan iki kişi bulundurulur (CMK md. 119/4).',
      'Hâkim kararı olmadan yapılan elkoyma 24 saat içinde hâkim onayına sunulur; hâkim 48 saat içinde karar verir (CMK md. 127).',
    ],
  },
  {
    id: 'olay-yeri',
    category: 'tutanak',
    title: 'Olay Yeri Tespit Tutanağı',
    summary: 'Olay yerine ilk ulaşan ekibin gördüğü durumu ve yaptığı işlemleri kaydeder.',
    fields: [
      tarih,
      saat,
      yer,
      { key: 'ihbar', label: 'İhbarın şekli ve saati', placeholder: 'Ör. 112 Acil Çağrı Merkezinden saat 14.20’de' },
      { key: 'varis', label: 'Olay yerine varış saati' },
      { key: 'durum', label: 'Olay yerinde görülen durum', multiline: true },
      { key: 'islem', label: 'Yapılan işlemler', multiline: true, placeholder: 'Olay yeri koruma altına alındı, savcıya bilgi verildi...' },
      duzenleyen,
      rutbe,
      duzenleyen2,
    ],
    body: `OLAY YERİ TESPİT TUTANAĞI

Tarih: {{tarih}}      Saat: {{saat}}
Olay yeri: {{yer}}

İhbar : {{ihbar}}
Olay yerine varış : {{varis}}

Olay yerinde yapılan incelemede:
{{durum}}

Yapılan işlemler:
{{islem}}

Olay yeri, delillerin bozulmaması için koruma altına alınmıştır. İşbu tutanak olay yerinde düzenlenerek imza altına alınmıştır.
${imzalar}`,
    notes: [
      'Olay yerine giriş çıkış kontrol altında tutulur; delillere dokunulmadan önce fotoğraf ve kroki ile tespit yapılır.',
      'Cumhuriyet savcısına derhâl bilgi verilir ve talimatı doğrultusunda hareket edilir.',
    ],
  },
  {
    id: 'teslim-tesellum',
    category: 'tutanak',
    title: 'Teslim Tesellüm Tutanağı',
    summary: 'Eşya, belge veya kişinin bir görevliden diğerine teslim edildiğini gösterir.',
    fields: [
      tarih,
      saat,
      yer,
      { key: 'teslimEden', label: 'Teslim eden (ad soyad, unvan)' },
      { key: 'teslimAlan', label: 'Teslim alan (ad soyad, unvan)' },
      { key: 'konu', label: 'Teslim edilen eşya / belge / kişi', multiline: true },
      { key: 'aciklama', label: 'Açıklama', multiline: true },
    ],
    body: `TESLİM TESELLÜM TUTANAĞI

Tarih: {{tarih}}      Saat: {{saat}}
Yer: {{yer}}

Aşağıda cinsi ve miktarı yazılı eşya / belge / kişi, eksiksiz olarak teslim edilmiş ve teslim alınmıştır:

{{konu}}

Açıklama:
{{aciklama}}

İşbu tutanak iki nüsha olarak düzenlenerek birlikte imza altına alınmıştır.

Teslim Eden                        Teslim Alan
{{teslimEden}}                     {{teslimAlan}}`,
  },
  {
    id: 'kimlik-tespit',
    category: 'tutanak',
    title: 'Kimlik Tespit Tutanağı',
    summary: 'Durdurulan ve kimliği sorulan kişinin kimliğinin tespit edildiğini kaydeder.',
    basis: 'PVSK md. 4/A (durdurma ve kimlik sorma); 5326 sayılı Kabahatler Kanunu (kimliği bildirmeme)',
    fields: [
      tarih,
      saat,
      yer,
      { key: 'kisi', label: 'Kişinin adı soyadı' },
      { key: 'tc', label: 'T.C. kimlik no' },
      { key: 'sebep', label: 'Durdurma sebebi', multiline: true, placeholder: 'Makul sebebin somut olarak açıklaması' },
      { key: 'sonuc', label: 'Tespit sonucu', multiline: true },
      duzenleyen,
      rutbe,
      duzenleyen2,
    ],
    body: `KİMLİK TESPİT TUTANAĞI

Tarih: {{tarih}}      Saat: {{saat}}
Yer: {{yer}}

Görev sırasında aşağıda belirtilen sebeple durdurulan kişiye durdurma sebebi bildirilerek kimliği soruldu.

Durdurma sebebi:
{{sebep}}

Kişinin adı soyadı : {{kisi}}
T.C. kimlik no : {{tc}}

Tespit sonucu:
{{sonuc}}

İşbu tutanak olay yerinde düzenlenerek imza altına alınmıştır.

İlgili                             Düzenleyen                        Düzenleyen
{{kisi}}                           {{duzenleyen}}                    {{duzenleyen2}}
                                   {{rutbe}}`,
    notes: [
      'Durdurma için somut olgulara dayanan makul bir sebep gerekir; durdurma süresi bu sebebin gerektirdiği süreden uzun olamaz (PVSK md. 4/A).',
    ],
  },
  {
    id: 'gorgu-tespit',
    category: 'tutanak',
    title: 'Görgü ve Tespit Tutanağı',
    summary: 'Görevlilerin bizzat gördüğü bir durumu kayda geçirmek için düzenlenir.',
    fields: [
      tarih,
      saat,
      yer,
      { key: 'konu', label: 'Konu' },
      { key: 'tespit', label: 'Görülen ve tespit edilen hususlar', multiline: true },
      duzenleyen,
      rutbe,
      duzenleyen2,
    ],
    body: `GÖRGÜ VE TESPİT TUTANAĞI

Tarih: {{tarih}}      Saat: {{saat}}
Yer: {{yer}}
Konu: {{konu}}

Yukarıda belirtilen tarih, saat ve yerde görevli olarak bulunduğumuz sırada;

{{tespit}}

hususları görülmüş ve tespit edilmiştir. İşbu tutanak görgümüze dayanılarak düzenlenmiş ve imza altına alınmıştır.
${imzalar}`,
  },

  // ---------------------------------------------------------------- Dilekçeler
  {
    id: 'yillik-izin',
    category: 'dilekce',
    title: 'Yıllık İzin Talep Dilekçesi',
    summary: 'Birlik komutanlığına yıllık izin talebi.',
    fields: [
      { key: 'makam', label: 'Dilekçenin verileceği makam', placeholder: 'Ör. ... İlçe Jandarma Komutanlığına' },
      { key: 'yil', label: 'İzin yılı', placeholder: 'Ör. 2026' },
      { key: 'gun', label: 'İzin süresi (gün)' },
      { key: 'baslangic', label: 'İzin başlangıç tarihi' },
      { key: 'adres', label: 'İzinde bulunacağı adres ve telefon', multiline: true },
      tarih,
      duzenleyen,
      rutbe,
      { key: 'sicil', label: 'Sicil no' },
      birlik,
    ],
    body: `{{makam}}

Birliğinizde {{rutbe}} olarak görev yapmaktayım. {{yil}} yılına ait yıllık iznimden {{baslangic}} tarihinden itibaren {{gun}} gün izin kullanmak istiyorum.

İzinde bulunacağım adres ve telefon bilgilerim aşağıdadır.

Gereğini bilgilerinize arz ederim.

                                                    {{tarih}}
                                                    {{duzenleyen}}
                                                    {{rutbe}}
                                                    Sicil: {{sicil}}

Birlik: {{birlik}}
İzin adresi / telefon: {{adres}}`,
  },
  {
    id: 'mazeret-izni',
    category: 'dilekce',
    title: 'Mazeret İzni Talep Dilekçesi',
    summary: 'Evlilik, doğum, ölüm veya zorunlu bir hâl nedeniyle mazeret izni talebi.',
    fields: [
      { key: 'makam', label: 'Dilekçenin verileceği makam' },
      { key: 'mazeret', label: 'Mazeret', multiline: true, placeholder: 'Ör. ... tarihinde evleneceğimden' },
      { key: 'gun', label: 'İzin süresi (gün)' },
      { key: 'baslangic', label: 'İzin başlangıç tarihi' },
      { key: 'ek', label: 'Ekler', placeholder: 'Ör. Evlilik cüzdanı / doğum raporu fotokopisi' },
      tarih,
      duzenleyen,
      rutbe,
      { key: 'sicil', label: 'Sicil no' },
    ],
    body: `{{makam}}

{{mazeret}} {{baslangic}} tarihinden itibaren {{gun}} gün mazeret izni kullanmak istiyorum.

Gereğini bilgilerinize arz ederim.

                                                    {{tarih}}
                                                    {{duzenleyen}}
                                                    {{rutbe}}
                                                    Sicil: {{sicil}}

EK: {{ek}}`,
  },
  {
    id: 'sikayet',
    category: 'dilekce',
    title: 'Şikâyet Dilekçesi',
    summary: 'Cumhuriyet Başsavcılığına suç duyurusu / şikâyet.',
    basis: 'CMK md. 158 (ihbar ve şikâyet)',
    fields: [
      { key: 'makam', label: 'Başsavcılık', placeholder: 'Ör. ... CUMHURİYET BAŞSAVCILIĞINA' },
      { key: 'musteki', label: 'Müşteki (ad soyad, T.C. kimlik no)' },
      { key: 'adres', label: 'Müştekinin adresi ve telefonu', multiline: true },
      { key: 'supheli', label: 'Şüpheli (biliniyorsa)' },
      { key: 'suc', label: 'Suç' },
      { key: 'suctarihi', label: 'Suç tarihi' },
      { key: 'aciklama', label: 'Açıklamalar', multiline: true },
      { key: 'delil', label: 'Deliller', multiline: true },
      tarih,
    ],
    body: `{{makam}}

MÜŞTEKİ      : {{musteki}}
ADRES        : {{adres}}
ŞÜPHELİ      : {{supheli}}
SUÇ          : {{suc}}
SUÇ TARİHİ   : {{suctarihi}}

AÇIKLAMALAR  :
{{aciklama}}

DELİLLER     :
{{delil}}

SONUÇ VE İSTEM: Yukarıda açıklanan nedenlerle şüpheli hakkında gerekli soruşturmanın yapılarak cezalandırılması için kamu davası açılmasını saygılarımla arz ve talep ederim.

                                                    {{tarih}}
                                                    Müşteki
                                                    {{musteki}}`,
  },
  {
    id: 'bilgi-edinme',
    category: 'dilekce',
    title: 'Bilgi Edinme Başvurusu',
    summary: '4982 sayılı Kanun kapsamında kurumdan bilgi veya belge talebi.',
    basis: '4982 sayılı Bilgi Edinme Hakkı Kanunu',
    fields: [
      { key: 'kurum', label: 'Başvurulan kurum', placeholder: 'Ör. ... VALİLİĞİNE' },
      { key: 'talep', label: 'İstenen bilgi veya belge', multiline: true },
      { key: 'basvuran', label: 'Başvuranın adı soyadı' },
      { key: 'tc', label: 'T.C. kimlik no' },
      { key: 'adres', label: 'Adres, telefon, e-posta', multiline: true },
      tarih,
    ],
    body: `{{kurum}}

4982 sayılı Bilgi Edinme Hakkı Kanunu kapsamında aşağıda belirtilen bilgi / belgenin tarafıma verilmesini talep ediyorum:

{{talep}}

Cevabın aşağıdaki adresime gönderilmesini arz ederim.

                                                    {{tarih}}
                                                    {{basvuran}}

T.C. kimlik no : {{tc}}
Adres / iletişim : {{adres}}`,
    notes: ['Kurum başvuruyu 15 iş günü içinde cevaplar; başka bir kurumun görüşü gerekiyorsa süre 30 iş günüdür.'],
  },
  {
    id: 'atama-talebi',
    category: 'dilekce',
    title: 'Atama (Tayin) Talep Dilekçesi',
    summary: 'Aile birliği, sağlık veya diğer mazeretle atama talebi.',
    fields: [
      { key: 'makam', label: 'Dilekçenin verileceği makam' },
      { key: 'gerekce', label: 'Talep gerekçesi', multiline: true },
      { key: 'tercih', label: 'Atanmak istenen yerler', multiline: true },
      { key: 'ek', label: 'Ekler' },
      tarih,
      duzenleyen,
      rutbe,
      { key: 'sicil', label: 'Sicil no' },
      birlik,
    ],
    body: `{{makam}}

{{birlik}} emrinde {{rutbe}} olarak görev yapmaktayım.

{{gerekce}}

Bu nedenle aşağıda belirttiğim yerlerden birine atamamın yapılması hususunu;

Tercihlerim:
{{tercih}}

Gereğini bilgilerinize arz ederim.

                                                    {{tarih}}
                                                    {{duzenleyen}}
                                                    {{rutbe}}
                                                    Sicil: {{sicil}}

EK: {{ek}}`,
  },

  // ---------------------------------------------------------------- Üst yazılar
  {
    id: 'savciliga-evrak',
    category: 'ustyazi',
    title: 'Cumhuriyet Başsavcılığına Evrak Gönderme',
    summary: 'Soruşturma evrakının başsavcılığa gönderilmesi.',
    basis: 'Resmî Yazışmalarda Uygulanacak Usul ve Esaslar Hakkında Yönetmelik',
    fields: [
      birlik,
      { key: 'sayi', label: 'Sayı', placeholder: 'Ör. E-12345678-...' },
      tarih,
      { key: 'konu', label: 'Konu', placeholder: 'Ör. Soruşturma evrakı' },
      { key: 'muhatap', label: 'Muhatap', placeholder: 'Ör. ... CUMHURİYET BAŞSAVCILIĞINA' },
      { key: 'ilgi', label: 'İlgi', placeholder: 'Ör. ... tarihli ve ... sayılı talimatınız' },
      { key: 'ozet', label: 'Olayın özeti', multiline: true },
      { key: 'ekler', label: 'Ekler', multiline: true, placeholder: '1- İfade tutanağı (2 sayfa)\n2- Olay yeri tespit tutanağı (1 sayfa)' },
      duzenleyen,
      rutbe,
    ],
    body: `T.C.
{{birlik}}

Sayı  : {{sayi}}                                          {{tarih}}
Konu  : {{konu}}

{{muhatap}}

İlgi  : {{ilgi}}

{{ozet}}

Olayla ilgili düzenlenen evrak ekte sunulmuştur.

Bilgilerinize arz ederim.

                                                    {{duzenleyen}}
                                                    {{rutbe}}

Ek:
{{ekler}}`,
    notes: [
      'Üst makama "arz ederim", ast ve eşit makama "rica ederim" ile bitirilir.',
      'İlgi birden fazlaysa a), b) şeklinde sıralanır; ekler sayfa sayısıyla belirtilir.',
    ],
  },
  {
    id: 'adli-emanet',
    category: 'ustyazi',
    title: 'Adli Emanete Eşya Teslim Yazısı',
    summary: 'El konulan eşyanın adli emanete teslimi için gönderme yazısı.',
    basis: 'Resmî Yazışmalarda Uygulanacak Usul ve Esaslar Hakkında Yönetmelik; Suç Eşyası Yönetmeliği',
    fields: [
      birlik,
      { key: 'sayi', label: 'Sayı' },
      tarih,
      { key: 'muhatap', label: 'Muhatap', placeholder: 'Ör. ... CUMHURİYET BAŞSAVCILIĞINA (Adli Emanet Bürosu)' },
      { key: 'sorusturma', label: 'Soruşturma numarası' },
      { key: 'esya', label: 'Teslim edilen eşya (cins, miktar, özellik)', multiline: true },
      duzenleyen,
      rutbe,
    ],
    body: `T.C.
{{birlik}}

Sayı  : {{sayi}}                                          {{tarih}}
Konu  : Adli emanet

{{muhatap}}

Başsavcılığınızın {{sorusturma}} sayılı soruşturmasına konu olup el konulan ve aşağıda cinsi, miktarı ve özellikleri yazılı eşya, adli emanete alınmak üzere teslim eden görevli ile birlikte gönderilmiştir.

{{esya}}

Bilgilerinize arz ederim.

                                                    {{duzenleyen}}
                                                    {{rutbe}}

Ek:
1- Arama ve elkoyma tutanağı
2- Teslim tesellüm tutanağı`,
  },
  {
    id: 'bilgi-talep',
    category: 'ustyazi',
    title: 'Bilgi ve Belge Talep Yazısı',
    summary: 'Başka bir kurumdan soruşturma veya görev için bilgi istenmesi.',
    basis: 'Resmî Yazışmalarda Uygulanacak Usul ve Esaslar Hakkında Yönetmelik',
    fields: [
      birlik,
      { key: 'sayi', label: 'Sayı' },
      tarih,
      { key: 'konu', label: 'Konu' },
      { key: 'muhatap', label: 'Muhatap', placeholder: 'Ör. ... MÜDÜRLÜĞÜNE' },
      { key: 'ilgi', label: 'İlgi (varsa)' },
      { key: 'talep', label: 'İstenen bilgi / belge', multiline: true },
      { key: 'kapanis', label: 'Kapanış', placeholder: 'rica ederim / arz ederim' },
      duzenleyen,
      rutbe,
    ],
    body: `T.C.
{{birlik}}

Sayı  : {{sayi}}                                          {{tarih}}
Konu  : {{konu}}

{{muhatap}}

İlgi  : {{ilgi}}

Birliğimizce yürütülen işlem kapsamında aşağıda belirtilen bilgi ve belgelere ihtiyaç duyulmaktadır:

{{talep}}

Söz konusu bilgi ve belgelerin birliğimize gönderilmesini {{kapanis}}.

                                                    {{duzenleyen}}
                                                    {{rutbe}}`,
    notes: ['Kişisel veri içeren taleplerde hukuki dayanak (savcılık talimatı, kanun maddesi) ilgi kısmında belirtilmelidir.'],
  },
  {
    id: 'olay-bildirim',
    category: 'ustyazi',
    title: 'Olay Bilgi Notu Yazısı',
    summary: 'Meydana gelen olayın üst makama veya mülki amire bildirilmesi.',
    basis: 'Resmî Yazışmalarda Uygulanacak Usul ve Esaslar Hakkında Yönetmelik',
    fields: [
      birlik,
      { key: 'sayi', label: 'Sayı' },
      tarih,
      { key: 'muhatap', label: 'Muhatap', placeholder: 'Ör. ... KAYMAKAMLIĞINA' },
      { key: 'olaytarihi', label: 'Olay tarihi ve saati' },
      { key: 'olayyeri', label: 'Olay yeri' },
      { key: 'olay', label: 'Olayın özeti', multiline: true },
      { key: 'islem', label: 'Yapılan işlemler', multiline: true },
      duzenleyen,
      rutbe,
    ],
    body: `T.C.
{{birlik}}

Sayı  : {{sayi}}                                          {{tarih}}
Konu  : Olay bilgi notu

{{muhatap}}

{{olaytarihi}} tarihinde {{olayyeri}} mevkiinde meydana gelen olaya ilişkin bilgiler aşağıya çıkarılmıştır.

OLAYIN ÖZETİ:
{{olay}}

YAPILAN İŞLEMLER:
{{islem}}

Gelişmeler ayrıca bildirilecektir.

Bilgilerinize arz ederim.

                                                    {{duzenleyen}}
                                                    {{rutbe}}`,
  },
];

export const documentById = (id: string) => documents.find((d) => d.id === id);
export const documentsIn = (category: DocCategory) => documents.filter((d) => d.category === category);
