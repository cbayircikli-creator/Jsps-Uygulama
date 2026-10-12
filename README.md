# Uzman Kolluk

Jandarma sınavlarına (Uzman Çavuş, Astsubay, Subay) hazırlık ve sahada iş kolaylaştıran araçlar sunan,
ücretsiz mobil uygulama. Expo (React Native + TypeScript) ile yazıldı; aynı kod iOS, Android ve web'de çalışır.

## Özellikler

| Bölüm | İçerik |
| --- | --- |
| Ana Sayfa | Günlük hedef, gün serisi, son 7 gün, kaldığın yerden devam, karışık 20 soru, sınav geri sayımı |
| Mevzuat | 46 kanun ve 17 yönetmelik; her birinden çıkan sorular ve madde madde çalışma; resmî metin mevzuat.gov.tr'de |
| Çalış | Konu testleri (derslere göre 20'şerlik), 25 deneme, işaretli sorular, bilgi kartları, ders bazlı başarı |
| Deneme ekranı | Sınav (süreli), Çalışma (anında açıklama) ve Yanlışlarım modları; soru işaretleme; başarı halkası |
| Konu Özetleri | Sayı, süre, oran ve karıştırılan noktalar; her satırda kaynak madde |
| Soru Ara | Tüm soru bankasında kelimeyle arama |
| İstatistikler | Toplam soru, doğruluk, seri, son 30 gün grafiği, derslere göre doğruluk, öneri |
| Araçlar | Tutanak (8), dilekçe (5) ve üst yazı (4) örnekleri: doldur, önizle, kopyala/paylaş; Pusula ve Konum |
| Pusula ve Konum | Yön (derece, milyem), MGRS/UTM/DMS/ondalık koordinat, rakım, doğruluk, uydu/hibrit harita |
| Asistan | Çevrimdışı: konu özetleri ve soru bankasından cevap bulur. Sunucu bağlanırsa yapay zekâ |
| Profil | Rütbe, günlük hedef, sınav tarihi, kaydedilenler, gizlilik/hakkında |
| Emsal Kararlar | Hazırlanıyor; doğrulanmış kararlar eklenince listelenir |

İlk açılışta 4 sayfalık tanıtım ve rütbe seçimi gösterilir. Tüm ilerleme yalnızca cihazda saklanır.

## İçerik

- **Denemeler** `src/data/exams/`: daha önce hazırlanan 21 deneme. `scripts/import-artifacts.mjs` ile
  üretilir: denemelerin HTML hâllerini bir klasöre koyup `node scripts/import-artifacts.mjs <klasör>`.
  Yeni deneme eklemek için betikteki `CATALOG` listesine başlığını yazın.
- **Uzman Kolluk denemeleri** `src/data/newExams.ts`: 3 deneme × 40 soru; yalnızca kanun metninde açıkça yer alan
  bilgilere dayanır, her soruda kaynak madde vardır.
- **Belge örnekleri** `src/data/documents.ts`: `{{alan}}` yer tutuculu şablonlar; biçim örneğidir.
- **Sayılar ve Süreler Testi** `src/data/factQuestions.ts`: 91 soru; her doğru cevap "Sayılar ve Süreler"
  notundaki bilgidir.
- **Konu özetleri** `src/data/summaries.ts`, **bilgi kartları** `src/data/flashcards.ts`: aynı nottan.
- Toplam havuz tekrarlar ayıklanmış **2477 soru**, hepsi 5 şıklı ve açıklamalı.
- **Kanun eşleştirmesi** `src/services/lawIndex.ts`: sorunun "Kaynak" alanından kanun/yönetmelik ve madde bulunur.
  Madde metinleri uygulamaya kopyalanmaz; güncel resmî metin mevzuat.gov.tr'den açılır.
- Doğrulanmamış bilgi eklenmez. Emsal kararlar künyesi resmî kaynağından doğrulanarak eklenmelidir.

## Klasör yapısı

```
src/
  app/          Ekranlar (Expo Router: her dosya bir sayfa)
    (tabs)/     Alt sekmeler
    karsilama, istatistik, ara, asistan, konum, ozetler/, konu/, deneme/, kartlar/, belge/, belgeler/,
    mevzuat/, kararlar/, duyurular/
  components/   Ortak arayüz parçaları, rütbe seçici, başarı halkası
  context/      Profil (rütbe, karşılama) ve ilerleme (sonuçlar, hedef, seri, işaretler)
  data/         İçerik ve tipler
  services/     İçerik erişimi, soru havuzu, konu testleri, kanun dizini, asistan
  theme.ts      Renkler, ders renkleri, yazı tipleri
assets/         Uygulama ikonu, açılış ekranı
scripts/        İçe aktarma ve web önizleme betikleri
```

## Çalıştırma

```bash
npm install
npm start          # Expo Go ile telefonda açmak için QR kod
npm run web        # tarayıcıda
npm run typecheck
npm run lint
```

**Web önizleme:** `npx expo export --platform web && python3 scripts/build-preview.py dist onizleme.html`
uygulamayı tek bir HTML dosyasına gömer; bu dosya Claude artifact'ı olarak paylaşılabilir.

## PWA olarak yayınlama (Expo'suz, düz dosyalar)

```bash
npx expo export --platform web
python3 scripts/build-pwa.py dist pwa
```

`pwa/` klasörü; index.html, ikonlar, manifest ve internetsiz çalışma için service worker içerir. Herhangi bir
statik hostinge olduğu gibi yüklenir (ör. Netlify'da klasörü sürükle bırak). Dosya yolları `/` ile başladığından
site alan adının köküne yüklenmelidir. Telefonda tarayıcı menüsünden "Ana ekrana ekle" ile uygulama gibi kurulur.

## Mağazaya çıkış

`app.json` içinde paket kimliği `com.uzmankolluk.app`; mağazaya çıktıktan sonra değiştirilemez.

**Harita:** Android mağaza derlemesinde Google Haritalar için bir API anahtarı gerekir. Anahtar alındıktan sonra
`app.json` eklentilerine `["react-native-maps", { "androidGoogleMapsApiKey": "..." }]` eklenir. iOS'ta
Apple Haritalar anahtarsız çalışır; Expo Go ile denerken anahtar gerekmez.
`eas.json` profilleri: `development`, `preview` (Android APK) ve `production`.

```bash
npx eas-cli@latest build --profile preview --platform android   # test APK'sı
npx eas-cli@latest build --profile production --platform all
npx eas-cli@latest submit --platform all
```

## Notlar

- Yapay zekâ: API anahtarı uygulamaya gömülmez. Kendi sunucumuzda bir uç nokta kurulup
  `EXPO_PUBLIC_AI_ENDPOINT` ortam değişkeniyle bağlanır; o zamana kadar asistan çevrimdışı çalışır.
- Ders renkleri `SUBJECT_ORDER` sırasıyla renk körlüğü denetiminden geçer; dersleri bu sırayla listeleyin.
- Rütbeler `src/data/ranks.ts`: Uzman Çavuş, Astsubay, Subay. Eski ayrıntılı rütbe kayıtları bu gruplara taşınır.

## Yol haritası

1. ✅ İskelet, ilerleme takibi, yanlışlarım, konu bazlı başarı
2. ✅ Soru bankası, konu testleri, bilgi kartları, konu özetleri, kanun bazlı çalışma
3. ✅ Marka kimliği, karşılama, istatistikler, soru arama, çevrimdışı asistan
4. ✅ Uzman Kolluk: Araçlar (belge örnekleri, pusula ve konum), yeni denemeler
5. ⬜ Emsal kararlar (doğrulanmış künyelerle)
6. ⬜ Mülakat bölümü
7. ⬜ Yapay zekâ sunucusu
8. ⬜ Rütbeye özel içerik, duyuruların uzaktan güncellenmesi ve bildirimler
