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
```

## Notlar / sonraki adımlar

- `src/data` altındaki içerik **iskelet veridir**. Mevzuat madde metinleri boş, emsal kararlar
  yalnızca tasarım için örnektir ve gerçek değildir. Gerçek içerik resmî kaynaktan doğrulanarak eklenmeli.
- İçerik ileride bir sunucuya taşınacaksa yalnızca `src/services/content.ts` değişir.
- Yapay zekâ: API anahtarı uygulamaya gömülmemeli. Kendi sunucumuzda bir uç nokta kurulup
  `EXPO_PUBLIC_AI_ENDPOINT` ortam değişkeniyle bağlanır; o zamana kadar asistan yer tutucu yanıt verir.
- Rütbe listesi `src/data/ranks.ts` içinde, ihtiyaca göre düzenlenebilir.
