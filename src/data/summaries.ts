// Konu özetleri ("hap bilgi"). İçerik "JSPS Sayılar ve Süreler Notu"ndan birebir alınmıştır;
// yeni bilgi eklerken yalnızca doğrulanmış kaynak kullanın.

export type SummaryRow = { label: string; value: string; source?: string };
export type SummaryGroup = { title?: string; rows: SummaryRow[] };
export type Summary = {
  id: string;
  title: string;
  icon: 'hammer' | 'swap-vertical' | 'people' | 'time' | 'hourglass' | 'car' | 'flag' | 'warning';
  intro?: string;
  groups: SummaryGroup[];
  /** Sınavda en çok karıştırılan noktalar */
  traps?: { title: string; text: string }[];
};

export const summaries: Summary[] = [
  {
    id: 'oranlar',
    title: 'İndirim ve Artırım Oranları',
    icon: 'swap-vertical',
    intro: 'Sınavda en çok karışan kısım. Hepsinde ilk bakılacak şey, cezanın ağırlaştırılmış mı ömür boyu mu olduğu.',
    groups: [
      {
        title: 'Ağırlaştırılmış / ömür boyu yerine',
        rows: [
          { label: 'Haksız tahrik', value: '18–24 yıl / 12–18 yıl · diğerlerinde 1/4–3/4 indirim', source: 'TCK 29' },
          { label: 'Teşebbüs', value: '13–20 yıl / 9–15 yıl · diğerlerinde 1/4–3/4 indirim', source: 'TCK 35' },
          { label: 'Yardım etme', value: '15–20 yıl / 10–15 yıl · diğerlerinde yarısı indirilir, 8 yılı geçemez', source: 'TCK 39' },
        ],
      },
      {
        title: 'Tek cümlelik kurallar',
        rows: [
          { label: 'Zincirleme suç', value: "Tek ceza, 1/4'ten 3/4'e kadar artırılır", source: 'TCK 43' },
          { label: 'Fikri içtima', value: 'En ağır cezayı gerektiren suçtan ceza', source: 'TCK 44' },
          { label: 'Azmettirme', value: 'İşlenen suçun cezasının aynısı', source: 'TCK 38' },
          { label: 'Meşru savunma', value: 'Ceza verilmez', source: 'TCK 25' },
          { label: 'Gönüllü vazgeçme', value: 'Teşebbüsten ceza yok; tamamlanan kısım suçsa o ceza', source: 'TCK 36' },
          { label: 'Bilinçsiz taksir, fail ağır mağdur', value: 'Ceza verilmez', source: 'TCK 22/6' },
          { label: 'Bilinçli taksir, fail ağır mağdur', value: 'Yarısına kadar indirilebilir', source: 'TCK 22/6' },
          { label: 'İradi alkol veya madde etkisi', value: 'Kusur yeteneğini etkileyen hüküm uygulanmaz', source: 'TCK 34/2' },
          { label: 'Suçluyu kayırma; eş, kardeş, üstsoy, altsoy lehine', value: 'Ceza verilmez', source: 'TCK 283/3' },
          { label: 'Suçu bildirmemek; adli kolluk görevlisi', value: 'Yarı oranında artırılır', source: 'TCK 279/2' },
          { label: '5816 suçları toplu, umuma açık yerde veya basınla', value: 'Yarı oranında artırılır', source: '5816 md. 2' },
        ],
      },
    ],
    traps: [{ title: 'Hafıza ipucu', text: 'Tahrik 18, teşebbüs 13, yardım 15 ile başlar.' }],
  },
  {
    id: 'yaslar',
    title: 'Yaş Sınırları',
    icon: 'people',
    groups: [
      {
        rows: [
          { label: "12'den küçük", value: 'Ceza sorumluluğu yok, sadece güvenlik tedbiri', source: 'TCK 31' },
          { label: "15'ten küçük", value: 'Üst sınırı 5 yılı aşmayan suçta tutuklanamaz', source: '5395 md. 21' },
          { label: "15'ten küçük", value: 'Tanık olarak yemin ettirilmez', source: 'CMK 50' },
          { label: "15'ten küçük", value: 'İdari para cezası uygulanamaz', source: '5326 md. 11' },
          { label: "18'den küçük", value: 'Kanunda "çocuk" sayılır', source: 'TCK 6' },
          { label: "18'den küçük", value: 'Zorunlu müdafi atanır', source: 'CMK 150' },
          { label: "18'den küçük", value: 'Tütün ürünü satılamaz', source: '4207' },
          { label: "18'den büyük", value: 'Birlikte oturana tebligat yapılabilir (görünüşe göre)', source: '7201 md. 16' },
          { label: '18', value: 'Milletvekili seçilme · B sınıfı ehliyet · Düzenleme kurulu üyeliği', source: 'Any. 76 · 2918 · 2911' },
        ],
      },
    ],
    traps: [{ title: '15 üçlüsü', text: 'Tutuklama yasağı, yeminsiz tanıklık ve idari para cezası yasağı. Üçünde de sınır 15 yaş.' }],
  },
  {
    id: 'usul',
    title: 'Usul Süreleri',
    icon: 'time',
    groups: [
      {
        title: 'CMK ve gözaltı',
        rows: [
          { label: 'Gözaltı süresi', value: '24 saat', source: 'CMK 91' },
          { label: 'Toplu suçlarda uzatma', value: 'Savcı yazılı emriyle, her defasında 1 gün, toplam 3 gün', source: 'CMK 91/3' },
          { label: 'Gözaltına itiraz', value: 'Sulh ceza hâkimliği, hâkim 24 saatte karar verir', source: 'CMK 91/5' },
          { label: 'Yakınlarına haber', value: 'Savcının talimatıyla, gecikmeksizin', source: 'CMK 95' },
          { label: 'Haklarının bildirilmesi', value: 'Derhâl', source: 'CMK 90/4' },
          { label: 'Hâkim kararsız elkoyma', value: '24 saatte onaya sunulur, hâkim 48 saatte karar verir', source: 'CMK 127' },
          { label: 'Konut araması', value: 'Hâkim kararı; gecikmede sakınca varsa savcının yazılı emri. Kolluk amiri yetkili değil.', source: 'CMK 119' },
          { label: 'Savcısız konut araması', value: 'İhtiyar heyetinden veya komşulardan 2 kişi hazır bulunur', source: 'CMK 119/4' },
          { label: 'Kovuşturmaya yer olmadığına itiraz', value: '15 gün, sulh ceza hâkimliği', source: 'CMK 173' },
          { label: 'Zorunlu müdafi', value: 'Alt sınırı 5 yıldan fazla olan suçlar', source: 'CMK 150/3' },
        ],
      },
      {
        title: 'İdari süreler',
        rows: [
          { label: 'İdari para cezasını peşin ödeme', value: "15 gün içinde ödenirse 3/4'ü alınır", source: '5326 md. 17' },
          { label: 'İdari yaptırıma başvuru', value: '15 gün, sulh ceza hâkimliği', source: '5326 md. 27' },
          { label: 'Soruşturma izni', value: '30 gün, en fazla 15 gün uzatma', source: '4483 md. 7' },
          { label: 'Soruşturma iznine itiraz', value: '10 gün', source: '4483 md. 9' },
          { label: 'İzin mercii', value: 'İlçede kaymakam, ilde vali', source: '4483 md. 3' },
          { label: 'KVKK başvurusuna cevap', value: '30 gün, ücretsiz', source: '6698 md. 13' },
          { label: 'KVKK Kurula şikâyet', value: 'Cevaptan itibaren 30 gün, her hâlde başvurudan itibaren 60 gün', source: '6698 md. 14' },
          { label: 'Bilgi edinme', value: '15 iş günü; başka kurumdan görüş gerekirse 30 iş günü', source: '4982' },
          { label: 'Dilekçeye cevap', value: '30 gün', source: '3071' },
          { label: 'Elektronik tebligat', value: 'Ulaştığı günü izleyen 5. günün sonunda yapılmış sayılır', source: '7201 md. 7/a' },
          { label: 'Doğum bildirimi', value: '30 gün', source: '5490' },
          { label: 'Kültür varlığı bulma', value: '3 gün içinde bildirim', source: '2863' },
          { label: 'Mal bildirimini yenileme', value: 'Sonu 0 ve 5 ile biten yıllarda, şubat sonuna kadar', source: '3628' },
          { label: 'Toplantı bildirimi', value: 'En az 48 saat önce; kurul en az 7 kişi', source: '2911' },
          { label: 'Özel güvenlik kimlik kartı', value: '5 yıl geçerli', source: '5188' },
        ],
      },
      {
        title: '6284 ve 6458',
        rows: [
          { label: 'Tedbir kararı, ilk defa', value: 'En çok 6 ay; delil veya belge aranmaz', source: '6284 md. 8' },
          { label: 'Zorlama hapsi', value: 'İlk ihlal 3–10 gün, tekrarında 15–30 gün, toplam 6 ayı geçemez', source: '6284 md. 13' },
          { label: 'Mülki amirin verebildiği tedbir', value: 'Barınma, geçici maddi yardım, rehberlik, hayati tehlikede geçici koruma, kreş', source: '6284 md. 3' },
          { label: 'İdari gözetim', value: 'En fazla 6 ay, en fazla 6 ay daha uzatılabilir', source: '6458 md. 57' },
          { label: 'Vizeyle kalış', value: 'Her 180 günde 90 gün', source: '6458' },
          { label: 'Uluslararası koruma başvurusu', value: 'Valiliğe, şahsen', source: '6458 md. 65' },
        ],
      },
      {
        title: 'Personel',
        rows: [
          { label: 'Adaylık süresi', value: '1 yıldan az, 2 yıldan fazla olamaz', source: '657 md. 54' },
          { label: 'Yıllık izin', value: '1–10 yıl hizmette 20 gün, 10 yıldan fazlasında 30 gün', source: '657 md. 102' },
          { label: 'Aylıktan kesme', value: "Brüt aylığın 1/30'u ile 1/8'i arası", source: '657 md. 125' },
          { label: 'Görevden uzaklaştırma', value: 'Disiplin cezası değil, tedbirdir', source: '657' },
          { label: '7068 cezaları', value: 'Uyarma, kınama, aylıktan kesme, kısa süreli durdurma, uzun süreli durdurma, meslekten çıkarma, devlet memurluğundan çıkarma. Oda hapsi yok.', source: '7068' },
          { label: 'Vatandaşlık', value: 'Kesintisiz 5 yıl ikamet; evlilikte en az 3 yıl', source: '5901' },
        ],
      },
    ],
  },
  {
    id: 'zamanasimi',
    title: 'Zamanaşımı ve Erteleme',
    icon: 'hourglass',
    groups: [
      {
        title: 'Dava / ceza zamanaşımı',
        rows: [
          { label: 'Ağırlaştırılmış hapis', value: '30 yıl / 40 yıl', source: 'TCK 66, 68' },
          { label: 'Ömür boyu hapis', value: '25 yıl / 30 yıl', source: 'TCK 66, 68' },
          { label: '20 yıl ve üstü hapis', value: '20 yıl / 24 yıl', source: 'TCK 66, 68' },
          { label: '5–20 yıl arası hapis', value: '15 yıl / 20 yıl (5 yıldan fazla)', source: 'TCK 66, 68' },
          { label: '5 yıla kadar hapis', value: '8 yıl / 10 yıl', source: 'TCK 66, 68' },
        ],
      },
      {
        title: 'Erteleme ve benzerleri',
        rows: [
          { label: 'Erteleme', value: '2 yıl veya daha az (18 yaş altı ve 65 üstü için 3 yıl); denetim 1–3 yıl', source: 'TCK 51' },
          { label: 'HAGB', value: '2 yıl veya daha az; denetim 5 yıl', source: 'CMK 231' },
          { label: 'Kamu davasının açılmasının ertelenmesi', value: 'Üst sınırı 3 yılı geçmeyen; 5 yıl', source: 'CMK 171' },
          { label: 'Önödeme', value: 'Üst sınırı 6 ayı aşmayan veya yalnız adli para cezası; 10 günde ödeme', source: 'TCK 75' },
          { label: 'Kısa süreli hapis', value: '1 yıl veya daha az', source: 'TCK 49' },
          { label: 'Adli para cezası', value: '5–730 gün; günü 20–100 TL', source: 'TCK 52' },
        ],
      },
    ],
    traps: [
      { title: 'İpucu', text: 'Ceza zamanaşımı her satırda dava zamanaşımından daha uzundur.' },
      { title: '2-2-3-6 kuralı', text: 'Erteleme 2, HAGB 2, KDAE 3 yıl, önödeme 6 ay.' },
    ],
  },
  {
    id: 'ceza-sureleri',
    title: 'Ceza Süreleri',
    icon: 'hammer',
    intro: 'Tek tek ezberleme; aynı süreyi paylaşanları grup olarak aklında tut.',
    groups: [
      {
        rows: [
          { label: '3 ay – 1 yıl', value: 'Huzur ve sükûnu bozma (TCK 123, şikâyete bağlı) · Görevi ihmal (TCK 257/2)' },
          { label: '4 ay – 1 yıl', value: 'Basit tıbbi müdahaleyle geçen yaralama (TCK 86/2), veya adli para, şikâyete bağlı' },
          { label: '6 ay – 2 yıl', value: "Tehdit (106) · Görevi kötüye kullanma (257/1) · Kamu görevlisinin suçu bildirmemesi (279) · Türk Milletini aşağılama (301) · İstiklal Marşı'nı aşağılama (300/2)" },
          { label: '6 ay – 3 yıl', value: 'Görevi yaptırmamak için direnme (265)' },
          { label: '1 – 3 yıl', value: "Hırsızlık (141) · Özel belgede sahtecilik (207) · Türk Bayrağını aşağılama (300/1) · Atatürk'ün hatırasına hakaret veya sövme (5816 md. 1)" },
          { label: '1 – 4 yıl', value: 'İftira (267) · Göreve ilişkin sırrın açıklanması (258)' },
          { label: '1 – 5 yıl', value: 'Dolandırıcılık (157) + 5.000 güne kadar adli para · Kişiyi hürriyetinden yoksun kılma (109) · Atatürk heykel, büst veya kabrine zarar (5816 md. 1)' },
          { label: '2 – 5 yıl', value: 'Resmi belgede sahtecilik (204); kamu görevlisi işlerse 3 – 8 yıl' },
          { label: '3 – 12 yıl', value: 'İşkence (94)' },
          { label: '4 – 12 yıl', value: 'Rüşvet (252); alan da veren de' },
          { label: '5 – 10 yıl', value: 'Silahlı örgüte üyelik (314); kuran veya yöneten 10 – 15 yıl' },
          { label: '5 – 12 yıl', value: 'Zimmet (247) · İhaleye fesat karıştırma (235)' },
          { label: 'Ömür boyu', value: 'Kasten öldürme, temel hâl (81)' },
          { label: 'Ağırlaştırılmış', value: 'Tasarlayarak öldürme ve diğer nitelikli hâller (82)' },
        ],
      },
    ],
    traps: [
      {
        title: 'İzin şartı',
        text: 'Cumhurbaşkanına sövme (299) ve Türk Milletini aşağılama (301) suçlarında kovuşturma Adalet Bakanının iznine bağlıdır.',
      },
    ],
  },
  {
    id: 'anayasa-kurullar',
    title: 'Anayasa ve Kurullar',
    icon: 'flag',
    groups: [
      {
        rows: [
          { label: 'Değiştirilemez maddeler', value: '1, 2, 3', source: 'Any. 4' },
          { label: 'Anayasa Mahkemesi üye sayısı', value: '15', source: 'Any. 146' },
          { label: 'HSK üye sayısı', value: '13', source: 'Any. 159' },
          { label: 'KVKK Kurulu', value: '9', source: '6698' },
          { label: 'Cumhurbaşkanlığı görevi', value: '5 yıl, en fazla 2 kez', source: 'Any. 101' },
          { label: 'TBMM ve Cumhurbaşkanlığı seçimi', value: '5 yılda bir, aynı gün', source: 'Any. 77' },
          { label: 'Anayasa değişikliği', value: 'Teklif 1/3 · halkoylaması 3/5 · doğrudan kabul 2/3', source: 'Any. 175' },
          { label: 'TBMM toplantı yeter sayısı', value: "Üye tamsayısının 1/3'ü; karar için en az 1/4 + 1", source: 'Any. 96' },
          { label: 'Olağanüstü hâl', value: 'Cumhurbaşkanı ilan eder; en çok 6 ay, uzatma her defasında en çok 4 ay', source: 'Any. 119' },
          { label: 'Hâkim önüne çıkarma', value: '48 saat; toplu suçlarda 4 gün', source: 'Any. 19' },
        ],
      },
    ],
  },
  {
    id: 'trafik',
    title: 'Trafik',
    icon: 'car',
    groups: [
      {
        rows: [
          { label: 'Alkol sınırı', value: 'Hususi otomobil 0,50 promil; diğer tüm sürücüler 0,20 promil' },
          { label: 'Ehliyetin geri alınması', value: '1. tespitte 6 ay · 2. tespitte 2 yıl · 3. tespitte 5 yıl' },
          { label: 'Otomobil hız sınırları', value: 'Yerleşim içi 50 · yerleşim dışı 90 · bölünmüş yol 110 · otoyol 120 km/saat' },
          { label: 'Öncelik sırası', value: 'Trafik görevlisinin işareti, ışıklı cihaz ve levhadan önce gelir' },
        ],
      },
    ],
  },
  {
    id: 'karistirilanlar',
    title: 'En Çok Karıştırılanlar',
    icon: 'warning',
    groups: [],
    traps: [
      { title: '24 saat mi, 48 saat mi?', text: 'CMK\'daki gözaltı süresi 24 saat, toplu suçlarda +3 gün. Anayasa md. 19\'daki hâkim önüne çıkarma süresi 48 saat, toplu suçlarda 4 gün.' },
      { title: 'Ömür boyu hapiste 25 mi, 30 mu?', text: 'Dava zamanaşımı 25 yıl, ceza zamanaşımı 30 yıl.' },
      { title: 'Şüphe dereceleri', text: 'Durdurma için makul sebep, arama için makul şüphe, tutuklama için kuvvetli suç şüphesi gerekir.' },
      { title: 'Şüpheli mi, sanık mı?', text: 'Soruşturma evresinde şüpheli; kovuşturma başlayınca sanık.' },
      { title: 'Mülteci mi, şartlı mülteci mi?', text: "Avrupa'daki olaylar yüzünden gelen mülteci; Avrupa dışındaki olaylar yüzünden gelen şartlı mülteci. Kitlesel akında geçici koruma verilir." },
      { title: 'Uyarma mı, kınama mı?', text: 'Uyarmada "daha dikkatli ol", kınamada "kusurlusun" yazıyla bildirilir.' },
      { title: 'Tanıklıktan çekinme', text: 'Kan hısımlarında 3. dereceye, kayın hısımlarında 2. dereceye kadar. Boşanmış eş de çekinebilir.' },
      { title: 'Kolluk ifadesi', text: 'Müdafi yokken alınan ifade, hâkim önünde doğrulanmazsa hükme esas alınamaz.' },
    ],
  },
];

export const summaryById = (id: string) => summaries.find((s) => s.id === id);
