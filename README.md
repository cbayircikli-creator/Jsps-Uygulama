# JSPS Uygulaması

Belirli personel için hazırlanan, mevzuat ve sınav çalışma uygulaması.
Expo (React Native + TypeScript) ile yazıldı; aynı kod iOS, Android ve web'de çalışır.

## Bölümler

| Sekme / Ekran | İçerik |
| --- | --- |
| Ana Sayfa | Modül kısayolları ve güncel duyurular |
| Mevzuat | Kanun, yönetmelik vb. listesi, arama ve madde detayı |
| Çalış | Denemeler ve bilgi kartları (rütbeye göre filtrelenir) |
| Asistan | Yapay zekâ sohbet ekranı |
| Profil | Rütbe seçimi / değiştirme |
| Emsal Kararlar | Ana sayfadan açılır; arama ve karar detayı |
| Duyurular | Ana sayfadan açılır |

**Rütbe akışı:** Uygulamaya ilk girişte hiçbir şey sorulmaz. Kullanıcı *Çalış* bölümüne
girdiğinde rütbesi sorulur (`RankGate`), seçim cihazda saklanır ve içerikler rütbe grubuna
(Uzman Erbaş / Astsubay / Subay) göre filtrelenir. Bir içeriğe `ranks: [...]` verilmezse
herkese görünür.

## Klasör yapısı

```
src/
  app/            Ekranlar (Expo Router: her dosya bir sayfa)
    (tabs)/       Alt sekmeler
    mevzuat/ kararlar/ duyurular/ deneme/ kartlar/   Detay sayfaları
  components/     Ortak arayüz parçaları, rütbe seçici
  context/        Profil (rütbe) durumu
  data/           Örnek içerik ve tipler
  services/       content.ts (içerik erişimi), ai.ts (asistan)
  theme.ts        Renkler ve ölçüler
```

## Çalıştırma

```bash
npm install
npm start          # Expo Go ile telefonda açmak için QR kod
npm run web        # tarayıcıda
npm run typecheck
npm run lint
```

## Notlar / sonraki adımlar

- **Denemeler** `src/data/exams/` altındadır: daha önce hazırlanan 21 deneme, toplam 2297 soru,
  hepsi 5 şıklı (A–E) ve açıklamalı. Bu dosyalar `scripts/import-artifacts.mjs` ile üretilir;
  denemelerin HTML hâllerini bir klasöre koyup `node scripts/import-artifacts.mjs <klasör>` çalıştırmak
  yeterlidir. Yeni deneme eklemek için betikteki `CATALOG` listesine başlığını yazın.
- Denemeler üç modda çözülür: **Sınav** (süreli, sonunda puan), **Çalışma** (her soruda anında
  doğru cevap ve açıklama) ve **Yanlışlarım**. Yarım kalan deneme kaldığı yerden devam eder.
- **Bilgi kartları** `src/data/flashcards.ts` içinde; "Sayılar ve Süreler" notundan 7 deste.
- **Mevzuat** sekmesinde denemelerde geçen 46 kanun ve 17 yönetmelik var. Her birinin sayfasında
  ondan çıkan sorular (toplam ~1550) ve madde madde dağılımı gösterilir; bir maddeye dokununca yalnızca
  onun soruları çözülür. Eşleştirme `src/services/lawIndex.ts` içinde, sorunun "Kaynak" alanından yapılır.
  Madde metinleri uygulamaya kopyalanmadı; düğme güncel resmî metni mevzuat.gov.tr'de açar.
- **Web önizleme:** `npx expo export --platform web && python3 scripts/build-preview.py dist onizleme.html`
  uygulamayı tek bir HTML dosyasına gömer; bu dosya Claude artifact'ı olarak paylaşılabilir.
- Emsal kararlar yalnızca tasarım için örnektir ve gerçek değildir; resmî kaynaktan doğrulanarak eklenmeli.
- İçerik ileride bir sunucuya taşınacaksa yalnızca `src/services/content.ts` değişir.
- Yapay zekâ: API anahtarı uygulamaya gömülmemeli. Kendi sunucumuzda bir uç nokta kurulup
  `EXPO_PUBLIC_AI_ENDPOINT` ortam değişkeniyle bağlanır; o zamana kadar asistan yer tutucu yanıt verir.
- Rütbe listesi `src/data/ranks.ts` içinde, ihtiyaca göre düzenlenebilir.

## Yol haritası

1. ✅ Uygulama iskeleti (sekmeler, ekranlar, rütbe sorusu)
2. ✅ İlerleme takibi: deneme sonuçları ve süre, bilgi kartlarında "biliyorum / tekrar",
   mevzuat ve kararları kaydetme, ana sayfada istatistik
3. ✅ Yanlışlarım: yanlış yapılan soruları ayrıca tekrar çözme, konu bazlı başarı
4. 🟡 Gerçek içerik: ✅ soru bankası (21 deneme, 2297 soru), bilgi kartları, kanun bazlı soru çalışma ·
   ⬜ emsal kararlar
5. ⬜ Yapay zekâ sunucusu ve asistan bağlantısı
6. ⬜ Rütbeye özel içerik ve davranışlar
7. ⬜ Duyuruların uzaktan güncellenmesi ve bildirimler
