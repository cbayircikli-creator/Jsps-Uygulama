# JSPS Hazırlık

Jandarma sınavlarına (Uzman Çavuş, Astsubay, Subay) hazırlanmak için ücretsiz, internetsiz çalışan
mobil uygulama. Expo (React Native + TypeScript) ile yazıldı; aynı kod iOS, Android ve web'de çalışır.

## Özellikler

| Bölüm | İçerik |
| --- | --- |
| Ana Sayfa | Günlük hedef, gün serisi, son 7 gün, kaldığın yerden devam, karışık 20 soru, sınav geri sayımı |
| Mevzuat | 46 kanun ve 17 yönetmelik; her birinden çıkan sorular ve madde madde çalışma; resmî metin mevzuat.gov.tr'de |
| Çalış | Konu testleri (derslere göre 20'şerlik), 22 deneme, işaretli sorular, bilgi kartları, ders bazlı başarı |
| Deneme ekranı | Sınav (süreli), Çalışma (anında açıklama) ve Yanlışlarım modları; soru işaretleme; başarı halkası |
| Konu Özetleri | Sayı, süre, oran ve karıştırılan noktalar; her satırda kaynak madde |
| Soru Ara | Tüm soru bankasında kelimeyle arama |
| İstatistikler | Toplam soru, doğruluk, seri, son 30 gün grafiği, derslere göre doğruluk, öneri |
| Asistan | Çevrimdışı: konu özetleri ve soru bankasından cevap bulur. Sunucu bağlanırsa yapay zekâ |
| Profil | Rütbe, günlük hedef, sınav tarihi, kaydedilenler, gizlilik/hakkında |
| Emsal Kararlar | Hazırlanıyor; doğrulanmış kararlar eklenince listelenir |

İlk açılışta 4 sayfalık tanıtım ve rütbe seçimi gösterilir. Tüm ilerleme yalnızca cihazda saklanır.

## İçerik

- **Denemeler** `src/data/exams/`: daha önce hazırlanan 21 deneme. `scripts/import-artifacts.mjs` ile
  üretilir: denemelerin HTML hâllerini bir klasöre koyup `node scripts/import-artifacts.mjs <klasör>`.
  Yeni deneme eklemek için betikteki `CATALOG` listesine başlığını yazın.
- **Sayılar ve Süreler Testi** `src/data/factQuestions.ts`: 91 soru; her doğru cevap "Sayılar ve Süreler"
  notundaki bilgidir.
- **Konu özetleri** `src/data/summaries.ts`, **bilgi kartları** `src/data/flashcards.ts`: aynı nottan.
- Toplam havuz tekrarlar ayıklanmış **2357 soru**, hepsi 5 şıklı ve açıklamalı.
- **Kanun eşleştirmesi** `src/services/lawIndex.ts`: sorunun "Kaynak" alanından kanun/yönetmelik ve madde bulunur.
  Madde metinleri uygulamaya kopyalanmaz; güncel resmî metin mevzuat.gov.tr'den açılır.
- Doğrulanmamış bilgi eklenmez. Emsal kararlar künyesi resmî kaynağından doğrulanarak eklenmelidir.

## Klasör yapısı

```
src/
  app/          Ekranlar (Expo Router: her dosya bir sayfa)
    (tabs)/     Alt sekmeler
    karsilama, istatistik, ara, ozetler/, konu/, deneme/, kartlar/, mevzuat/, kararlar/, duyurular/
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

## Mağazaya çıkış

`app.json` içinde paket kimliği `com.jspshazirlik.app`; gerekirse yayın öncesi değiştirin.
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
4. ⬜ Emsal kararlar (doğrulanmış künyelerle)
5. ⬜ Mülakat bölümü
6. ⬜ Yapay zekâ sunucusu
7. ⬜ Rütbeye özel içerik, duyuruların uzaktan güncellenmesi ve bildirimler
