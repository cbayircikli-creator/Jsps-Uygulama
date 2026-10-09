// "Sayılar ve Süreler" testi. Her sorunun doğru cevabı "JSPS Sayılar ve Süreler Notu"ndaki
// bilgidir; yanlış şıklar sınavda karıştırılan diğer sayılardır. Yeni soru eklerken de yalnızca
// doğrulanmış bir kaynaktaki bilgiyi kullanın.
import type { Options, PracticeExam, Question, Subject } from './types';

// [soru, şıklar, doğru şık, açıklama, kaynak, ders]
type Row = [string, Options, number, string, string, Subject?];

const rows: Row[] = [
  // Yaş sınırları
  ['TCK\'ya göre hangi yaştan küçüklerin ceza sorumluluğu yoktur, yalnızca güvenlik tedbiri uygulanır?', ['10', '11', '12', '13', '15'], 2, '12 yaşından küçükler için ceza sorumluluğu yoktur; yalnızca çocuklara özgü güvenlik tedbirleri uygulanır.', 'TCK md. 31'],
  ['5395 sayılı Kanun\'a göre üst sınırı 5 yılı aşmayan suçlarda hangi yaştan küçükler tutuklanamaz?', ['12', '13', '15', '16', '18'], 2, '15 yaşını doldurmamış çocuklar, üst sınırı 5 yılı aşmayan suçlar nedeniyle tutuklanamaz.', '5395 md. 21'],
  ['CMK\'ya göre hangi yaştan küçük tanıklara yemin ettirilmez?', ['12', '15', '16', '17', '18'], 1, '15 yaşını doldurmamış tanıklar yeminsiz dinlenir.', 'CMK md. 50'],
  ['Kabahatler Kanunu\'na göre hangi yaştan küçüklere idari para cezası uygulanamaz?', ['11', '12', '14', '15', '18'], 3, '15 yaşını doldurmamış kişilere idari para cezası verilemez. 15 yaş sınırı tutuklama yasağı ve yeminsiz tanıklıkta da geçer.', '5326 md. 11'],
  ['TCK\'da "çocuk" kavramı kimi ifade eder?', ['12 yaşından küçükleri', '15 yaşından küçükleri', '16 yaşından küçükleri', '18 yaşını doldurmamış kişileri', '21 yaşından küçükleri'], 3, 'TCK\'ya göre henüz 18 yaşını doldurmamış kişi çocuk sayılır.', 'TCK md. 6'],
  ['CMK\'ya göre aşağıdakilerden hangisine istemi aranmaksızın müdafi atanır?', ['18 yaşını doldurmamış şüpheliye', '15 yaşını doldurmuş şüpheliye', '21 yaşını doldurmamış şüpheliye', '65 yaşını doldurmuş şüpheliye', 'İlk kez suç işleyen şüpheliye'], 0, '18 yaşından küçük şüpheli veya sanığa zorunlu müdafi atanır.', 'CMK md. 150'],
  ['Tebligat Kanunu\'na göre muhatap adresinde yoksa tebligat, birlikte oturan ve görünüşüne göre kaç yaşından büyük olan kişiye yapılabilir?', ['12', '15', '16', '18', '21'], 3, 'Muhatapla birlikte oturan ve görünüşe göre 18 yaşından büyük kişiye tebligat yapılabilir.', '7201 md. 16'],
  ['Anayasa\'ya göre milletvekili seçilebilme yaşı kaçtır?', ['18', '21', '25', '30', '35'], 0, '18 yaşını dolduran her Türk milletvekili seçilebilir.', 'Anayasa md. 76', 'Anayasa'],

  // CMK ve gözaltı
  ['CMK\'ya göre gözaltı süresi, yakalama yerine en yakın hâkim veya mahkemeye gönderilmesi için gerekli süre hariç kaç saati geçemez?', ['12 saat', '24 saat', '36 saat', '48 saat', '4 gün'], 1, 'Gözaltı süresi yakalama anından itibaren 24 saati geçemez.', 'CMK md. 91'],
  ['Toplu olarak işlenen suçlarda gözaltı süresi nasıl uzatılabilir?', ['Her defasında 1 gün, toplam 3 gün', 'Her defasında 2 gün, toplam 4 gün', 'Her defasında 1 gün, toplam 4 gün', 'Tek seferde 7 gün', 'Her defasında 12 saat, toplam 2 gün'], 0, 'Toplu suçlarda Cumhuriyet savcısı yazılı emirle gözaltı süresini her defasında 1 günü geçmemek üzere üç gün süreyle uzatabilir.', 'CMK md. 91/3'],
  ['Toplu suçlarda gözaltı süresinin uzatılmasına kim karar verir?', ['Kolluk amiri', 'Cumhuriyet savcısı, yazılı emirle', 'Sulh ceza hâkimi', 'Mülki amir', 'Asliye ceza mahkemesi'], 1, 'Uzatma, Cumhuriyet savcısının yazılı emriyle yapılır.', 'CMK md. 91/3'],
  ['Gözaltı işlemine itiraz nereye yapılır ve itiraz ne kadar sürede karara bağlanır?', ['Asliye ceza mahkemesine, 48 saatte', 'Sulh ceza hâkimliğine, 24 saatte', 'Cumhuriyet başsavcılığına, 24 saatte', 'Ağır ceza mahkemesine, 3 günde', 'Sulh ceza hâkimliğine, 48 saatte'], 1, 'Gözaltına itiraz sulh ceza hâkimliğine yapılır; hâkim 24 saat içinde karar verir.', 'CMK md. 91/5'],
  ['Hâkim kararı olmadan yapılan elkoyma işlemi kaç saat içinde hâkim onayına sunulur ve hâkim kaç saat içinde karar verir?', ['12 saat / 24 saat', '24 saat / 48 saat', '48 saat / 24 saat', '24 saat / 72 saat', '3 gün / 3 gün'], 1, 'Hâkim kararı olmadan yapılan elkoyma 24 saat içinde onaya sunulur; hâkim 48 saat içinde karar verir.', 'CMK md. 127'],
  ['Gecikmesinde sakınca bulunan hâlde konut araması kimin emriyle yapılabilir?', ['Kolluk amirinin yazılı emriyle', 'Cumhuriyet savcısının yazılı emriyle', 'Mülki amirin yazılı emriyle', 'Kolluk amirinin sözlü emriyle', 'Muhtarın izniyle'], 1, 'Konut araması hâkim kararıyla, gecikmede sakınca varsa Cumhuriyet savcısının yazılı emriyle yapılır. Kolluk amiri konutta arama emri veremez.', 'CMK md. 119'],
  ['Cumhuriyet savcısı bulunmadan yapılan konut aramasında kimler hazır bulundurulur?', ['Muhtar ve bir kolluk görevlisi', 'İhtiyar heyetinden veya komşulardan iki kişi', 'Bir avukat', 'Konut sahibinin iki yakını', 'Mülki amir'], 1, 'Savcı yoksa aramada o yer ihtiyar heyetinden veya komşulardan iki kişi bulundurulur.', 'CMK md. 119/4'],
  ['Kovuşturmaya yer olmadığı kararına itiraz süresi ve mercii nedir?', ['7 gün, asliye ceza mahkemesi', '15 gün, sulh ceza hâkimliği', '15 gün, ağır ceza mahkemesi', '30 gün, sulh ceza hâkimliği', '10 gün, bölge adliye mahkemesi'], 1, 'Kovuşturmaya yer olmadığı kararına tebliğden itibaren 15 gün içinde sulh ceza hâkimliğine itiraz edilir.', 'CMK md. 173'],
  ['CMK\'ya göre alt sınırı kaç yıldan fazla hapis cezasını gerektiren suçlarda istem aranmaksızın müdafi görevlendirilir?', ['2 yıldan', '3 yıldan', '5 yıldan', '7 yıldan', '10 yıldan'], 2, 'Alt sınırı 5 yıldan fazla hapis cezasını gerektiren suçlarda zorunlu müdafi atanır.', 'CMK md. 150/3'],

  // İdari süreler
  ['Kabahatler Kanunu\'na göre idari para cezası peşin ödenirse ne olur?', ['15 gün içinde ödenirse 3/4\'ü tahsil edilir', '30 gün içinde ödenirse yarısı tahsil edilir', '15 gün içinde ödenirse yarısı tahsil edilir', '7 gün içinde ödenirse 2/3\'ü tahsil edilir', '30 gün içinde ödenirse 3/4\'ü tahsil edilir'], 0, 'İdari para cezası tebliğden itibaren 15 gün içinde peşin ödenirse dörtte üçü tahsil edilir.', '5326 md. 17'],
  ['İdari yaptırım kararına karşı başvuru süresi ve mercii nedir?', ['7 gün, idare mahkemesi', '15 gün, sulh ceza hâkimliği', '30 gün, idare mahkemesi', '15 gün, asliye hukuk mahkemesi', '30 gün, sulh ceza hâkimliği'], 1, 'Karara karşı tebliğden itibaren 15 gün içinde sulh ceza hâkimliğine başvurulur.', '5326 md. 27'],
  ['4483 sayılı Kanun\'a göre soruşturma izni hakkında karar verme süresi nedir?', ['15 gün, 15 gün uzatılabilir', '30 gün, en fazla 15 gün uzatılabilir', '30 gün, en fazla 30 gün uzatılabilir', '45 gün, uzatılamaz', '60 gün, 15 gün uzatılabilir'], 1, 'İzin mercii 30 gün içinde karar verir; zorunlu hâllerde bu süre en fazla 15 gün uzatılabilir.', '4483 md. 7'],
  ['4483 sayılı Kanun\'a göre soruşturma izni verilmesi veya verilmemesi kararına itiraz süresi kaç gündür?', ['7', '10', '15', '20', '30'], 1, 'Karara karşı 10 gün içinde itiraz edilebilir.', '4483 md. 9'],
  ['4483 sayılı Kanun\'a göre ilçede ve ilde görevli memurlar için soruşturma izni vermeye yetkili merci kimdir?', ['İlçede kaymakam, ilde vali', 'İlçede Cumhuriyet savcısı, ilde başsavcı', 'İlçede belediye başkanı, ilde vali', 'Her ikisinde İçişleri Bakanı', 'İlçede kaymakam, ilde İçişleri Bakanı'], 0, 'İlçede görevli memurlar için kaymakam, ilde görevli memurlar için vali izin verir.', '4483 md. 3'],
  ['KVKK\'ya göre veri sorumlusu, ilgili kişinin başvurusunu en geç ne kadar sürede ve nasıl sonuçlandırır?', ['15 gün içinde, ücret karşılığında', '30 gün içinde, kural olarak ücretsiz', '30 iş günü içinde, ücret karşılığında', '60 gün içinde, ücretsiz', '15 iş günü içinde, ücretsiz'], 1, 'Başvuru en geç 30 gün içinde ve kural olarak ücretsiz sonuçlandırılır.', '6698 md. 13'],
  ['KVKK\'ya göre ilgili kişi Kurula şikâyette hangi süreler içinde bulunabilir?', ['Cevaptan itibaren 15 gün; her hâlde başvurudan itibaren 30 gün', 'Cevaptan itibaren 30 gün; her hâlde başvurudan itibaren 60 gün', 'Cevaptan itibaren 60 gün; her hâlde başvurudan itibaren 90 gün', 'Cevaptan itibaren 30 gün; başka süre sınırı yok', 'Cevaptan itibaren 7 gün; her hâlde başvurudan itibaren 30 gün'], 1, 'Cevabın öğrenildiği tarihten itibaren 30 gün, her hâlde başvuru tarihinden itibaren 60 gün içinde Kurula şikâyet edilebilir.', '6698 md. 14'],
  ['Bilgi Edinme Hakkı Kanunu\'na göre başvurulara cevap süresi nedir?', ['15 iş günü; başka kurumdan görüş gerekirse 30 iş günü', '30 gün; görüş gerekirse 60 gün', '10 iş günü; görüş gerekirse 20 iş günü', '15 gün; uzatılamaz', '30 iş günü; görüş gerekirse 45 iş günü'], 0, 'Bilgi veya belgeye 15 iş günü içinde erişim sağlanır; başka kurumun görüşü gerekiyorsa süre 30 iş günüdür.', '4982 md. 11'],
  ['Dilekçe Hakkının Kullanılmasına Dair Kanun\'a göre dilekçelere en geç ne kadar sürede cevap verilir?', ['15 gün', '30 gün', '45 gün', '60 gün', '3 ay'], 1, 'Dilekçelere en geç 30 gün içinde cevap verilir.', '3071 md. 7'],
  ['Tebligat Kanunu\'na göre elektronik tebligat ne zaman yapılmış sayılır?', ['Muhatabın adresine ulaştığı gün', 'Ulaştığı günü izleyen 3. günün sonunda', 'Ulaştığı günü izleyen 5. günün sonunda', 'Ulaştığı günü izleyen 7. günün sonunda', 'Muhatap okuduğu anda'], 2, 'Elektronik tebligat, muhatabın elektronik adresine ulaştığı tarihi izleyen 5. günün sonunda yapılmış sayılır.', '7201 md. 7/a'],
  ['Nüfus Hizmetleri Kanunu\'na göre yurt içindeki doğumlar kaç gün içinde bildirilir?', ['10', '15', '30', '60', '90'], 2, 'Yurt içinde doğumlar 30 gün içinde bildirilir.', '5490'],
  ['2863 sayılı Kanun\'a göre taşınır kültür varlığı bulan kişi en geç ne kadar sürede bildirimde bulunmalıdır?', ['24 saat', '3 gün', '7 gün', '15 gün', '30 gün'], 1, 'Kültür varlığını bulanlar en geç 3 gün içinde ilgili makama bildirmek zorundadır.', '2863'],
  ['3628 sayılı Kanun\'a göre mal bildirimi hangi dönemlerde yenilenir?', ['Her yıl ocak ayı sonuna kadar', 'Sonu 0 ve 5 ile biten yıllarda şubat ayı sonuna kadar', 'Her üç yılda bir mart ayı sonuna kadar', 'Sonu 0 ile biten yıllarda haziran ayı sonuna kadar', 'Yalnızca göreve başlarken'], 1, 'Mal bildirimi sonu 0 ve 5 ile biten yıllarda şubat ayı sonuna kadar yenilenir.', '3628'],
  ['2911 sayılı Kanun\'a göre toplantı için bildirim ne zaman verilir ve düzenleme kurulu en az kaç kişiden oluşur?', ['En az 24 saat önce; 5 kişi', 'En az 48 saat önce; 7 kişi', 'En az 72 saat önce; 7 kişi', 'En az 48 saat önce; 3 kişi', 'En az bir hafta önce; 10 kişi'], 1, 'Bildirim toplantıdan en az 48 saat önce verilir; düzenleme kurulu en az 7 kişiden oluşur.', '2911'],
  ['5188 sayılı Kanun\'a göre özel güvenlik görevlisi kimlik kartı kaç yıl geçerlidir?', ['1 yıl', '3 yıl', '5 yıl', '7 yıl', '10 yıl'], 2, 'Özel güvenlik kimlik kartı 5 yıl geçerlidir.', '5188'],

  // 6284 ve 6458
  ['6284 sayılı Kanun\'a göre ilk defa verilen tedbir kararının süresi ve şartı nedir?', ['En çok 3 ay; delil aranır', 'En çok 6 ay; delil veya belge aranmaz', 'En çok 1 yıl; delil aranmaz', 'En çok 6 ay; delil aranır', 'Süresiz; belge aranır'], 1, 'Tedbir kararı ilk defa en çok 6 ay için verilir; şiddet veya tehlike için delil ya da belge aranmaz.', '6284 md. 8'],
  ['6284 sayılı Kanun\'a göre tedbir kararına aykırılıkta zorlama hapsi süreleri nedir?', ['İlk ihlal 1–3 gün, tekrarında 3–10 gün', 'İlk ihlal 3–10 gün, tekrarında 15–30 gün; toplam 6 ayı geçemez', 'İlk ihlal 10–15 gün, tekrarında 30–60 gün', 'İlk ihlal 3–10 gün, tekrarında 15–30 gün; toplam 1 yılı geçemez', 'İlk ihlal 15 gün, tekrarında 45 gün'], 1, 'Zorlama hapsi ilk ihlalde 3–10 gün, tekrarında 15–30 gündür; toplam süre 6 ayı geçemez.', '6284 md. 13'],
  ['6458 sayılı Kanun\'a göre idari gözetim süresi nedir?', ['En fazla 3 ay; 3 ay uzatılabilir', 'En fazla 6 ay; en fazla 6 ay daha uzatılabilir', 'En fazla 1 yıl; uzatılamaz', 'En fazla 6 ay; en fazla 1 yıl uzatılabilir', 'En fazla 12 ay; 6 ay uzatılabilir'], 1, 'İdari gözetim en fazla 6 ay sürer; gerekirse en fazla 6 ay daha uzatılabilir.', '6458 md. 57'],
  ['6458 sayılı Kanun\'a göre vize veya vize muafiyetiyle kalış süresi en fazla nedir?', ['Her 90 günde 30 gün', 'Her 180 günde 90 gün', 'Her 365 günde 180 gün', 'Her 180 günde 60 gün', 'Her 120 günde 90 gün'], 1, 'Vize ya da vize muafiyeti her 180 günde 90 güne kadar kalış hakkı sağlar.', '6458'],
  ['Uluslararası koruma başvurusu nereye ve nasıl yapılır?', ['Kolluğa, yazılı olarak', 'Valiliğe, şahsen', 'Dışişleri Bakanlığına, elektronik ortamda', 'Kaymakamlığa, vekil aracılığıyla', 'Büyükelçiliğe, şahsen'], 1, 'Uluslararası koruma başvurusu valiliklere şahsen yapılır.', '6458 md. 65'],

  // Personel
  ['657 sayılı Kanun\'a göre adaylık süresi ne kadardır?', ['6 aydan az, 1 yıldan fazla olamaz', '1 yıldan az, 2 yıldan fazla olamaz', '1 yıldan az, 3 yıldan fazla olamaz', '2 yıl; uzatılamaz', '6 ay; 6 ay uzatılabilir'], 1, 'Adaylık süresi 1 yıldan az, 2 yıldan fazla olamaz.', '657 md. 54'],
  ['657 sayılı Kanun\'a göre yıllık izin süreleri nasıldır?', ['1–10 yıl hizmette 15 gün, fazlasında 20 gün', '1–10 yıl hizmette 20 gün, fazlasında 30 gün', '1–10 yıl hizmette 20 gün, fazlasında 25 gün', '1–5 yıl hizmette 20 gün, fazlasında 30 gün', 'Hizmet süresinden bağımsız 30 gün'], 1, 'Hizmet süresi 1–10 yıl olanlara 20 gün, 10 yıldan fazla olanlara 30 gün yıllık izin verilir.', '657 md. 102'],
  ['657 sayılı Kanun\'a göre aylıktan kesme cezasının oranı nedir?', ['Brüt aylığın 1/30\'u ile 1/8\'i arası', 'Brüt aylığın 1/30\'u ile 1/4\'ü arası', 'Brüt aylığın 1/8\'i ile 1/4\'ü arası', 'Brüt aylığın 1/10\'u ile 1/2\'si arası', 'Brüt aylığın 1/60\'ı ile 1/30\'u arası'], 0, 'Aylıktan kesme, memurun brüt aylığından 1/30 ile 1/8 arasında kesinti yapılmasıdır.', '657 md. 125'],
  ['657 sayılı Kanun\'da görevden uzaklaştırmanın niteliği nedir?', ['Bir disiplin cezasıdır', 'Bir tedbirdir', 'Bir idari para cezasıdır', 'Bir ödül türüdür', 'Bir zorunlu izin türüdür'], 1, 'Görevden uzaklaştırma disiplin cezası değil, ihtiyati bir tedbirdir.', '657'],
  ['7068 sayılı Kanun\'daki disiplin cezaları arasında aşağıdakilerden hangisi yoktur?', ['Kınama', 'Aylıktan kesme', 'Oda hapsi', 'Uzun süreli durdurma', 'Meslekten çıkarma'], 2, '7068\'de uyarma, kınama, aylıktan kesme, kısa ve uzun süreli durdurma, meslekten ve devlet memurluğundan çıkarma vardır; oda hapsi yoktur.', '7068'],
  ['Türk Vatandaşlığı Kanunu\'na göre genel yoldan vatandaşlık ve evlilik yoluyla vatandaşlık için aranan süreler nedir?', ['Kesintisiz 3 yıl ikamet; evlilikte 2 yıl', 'Kesintisiz 5 yıl ikamet; evlilikte en az 3 yıl', 'Kesintisiz 5 yıl ikamet; evlilikte 5 yıl', 'Kesintisiz 7 yıl ikamet; evlilikte 3 yıl', 'Kesintisiz 10 yıl ikamet; evlilikte 5 yıl'], 1, 'Genel yoldan kesintisiz 5 yıl ikamet; Türk vatandaşıyla evlilikte en az 3 yıl evlilik aranır.', '5901'],

  // Zamanaşımı ve erteleme
  ['Ömür boyu hapis cezasını gerektiren suçlarda dava zamanaşımı süresi kaç yıldır?', ['15', '20', '25', '30', '40'], 2, 'Ömür boyu hapiste dava zamanaşımı 25 yıl, ceza zamanaşımı 30 yıldır.', 'TCK md. 66'],
  ['Ağırlaştırılmış müebbet hapis cezalarında ceza zamanaşımı süresi kaç yıldır?', ['24', '25', '30', '40', '50'], 3, 'Ağırlaştırılmış hapiste dava zamanaşımı 30, ceza zamanaşımı 40 yıldır.', 'TCK md. 68'],
  ['Beş yıla kadar hapis cezasını gerektiren suçlarda dava zamanaşımı süresi kaç yıldır?', ['5', '8', '10', '12', '15'], 1, '5 yıla kadar hapiste dava zamanaşımı 8 yıl, ceza zamanaşımı 10 yıldır.', 'TCK md. 66'],
  ['20 yıl ve daha fazla hapis cezalarında ceza zamanaşımı süresi kaç yıldır?', ['15', '20', '24', '25', '30'], 2, '20 yıl ve üstü hapiste dava zamanaşımı 20 yıl, ceza zamanaşımı 24 yıldır.', 'TCK md. 68'],
  ['TCK\'ya göre hangi süredeki hapis cezası ertelenebilir?', ['1 yıl veya daha az', '2 yıl veya daha az; 18 yaş altı ve 65 yaş üstü için 3 yıl', '3 yıl veya daha az', '2 yıl veya daha az; yaş ayrımı yoktur', '5 yıl veya daha az'], 1, '2 yıl veya daha az hapis ertelenebilir; suç tarihinde 18 yaşını doldurmamış veya 65 yaşını bitirmiş olanlarda üst sınır 3 yıldır. Denetim süresi 1–3 yıldır.', 'TCK md. 51'],
  ['Hükmün açıklanmasının geri bırakılmasında denetim süresi kaç yıldır?', ['1', '2', '3', '5', '10'], 3, 'HAGB, 2 yıl veya daha az hapiste uygulanır; denetim süresi 5 yıldır.', 'CMK md. 231'],
  ['Kamu davasının açılmasının ertelenmesi hangi suçlarda uygulanır ve erteleme süresi nedir?', ['Üst sınırı 2 yılı geçmeyen; 3 yıl', 'Üst sınırı 3 yılı geçmeyen; 5 yıl', 'Üst sınırı 5 yılı geçmeyen; 5 yıl', 'Üst sınırı 3 yılı geçmeyen; 3 yıl', 'Alt sınırı 3 yılı geçmeyen; 5 yıl'], 1, 'Üst sınırı 3 yılı geçmeyen suçlarda kamu davasının açılması 5 yıl ertelenebilir.', 'CMK md. 171'],
  ['TCK\'ya göre önödeme hangi suçlarda uygulanır ve ödeme süresi nedir?', ['Üst sınırı 6 ayı aşmayan veya yalnız adli para cezası gerektiren suçlarda; 10 gün', 'Üst sınırı 1 yılı aşmayan suçlarda; 15 gün', 'Üst sınırı 3 ayı aşmayan suçlarda; 10 gün', 'Üst sınırı 6 ayı aşmayan suçlarda; 30 gün', 'Alt sınırı 6 ayı aşmayan suçlarda; 10 gün'], 0, 'Önödeme, üst sınırı 6 ayı aşmayan hapis veya yalnız adli para cezası gerektiren suçlarda uygulanır; ödeme 10 gün içinde yapılır.', 'TCK md. 75'],
  ['TCK\'ya göre kısa süreli hapis cezası kaç yıl veya daha az olan cezadır?', ['6 ay', '1 yıl', '2 yıl', '3 yıl', '3 ay'], 1, 'Hükmedilen 1 yıl veya daha az hapis cezası kısa süreli hapis cezasıdır.', 'TCK md. 49'],
  ['TCK\'ya göre adli para cezasının gün sayısı ve bir günün karşılığı nedir?', ['5–730 gün; günü 20–100 TL', '5–365 gün; günü 10–50 TL', '10–730 gün; günü 20–100 TL', '5–730 gün; günü 10–100 TL', '1–365 gün; günü 20–200 TL'], 0, 'Adli para cezası 5 günden 730 güne kadardır; bir gün karşılığı 20–100 TL arasında belirlenir.', 'TCK md. 52'],

  // Trafik
  ['Hususi otomobil sürücüleri için yasal alkol sınırı kaç promildir?', ['0,20', '0,30', '0,50', '0,80', '1,00'], 2, 'Hususi otomobil sürücülerinde sınır 0,50 promil, diğer tüm sürücülerde 0,20 promildir.', '2918'],
  ['Hususi otomobil dışındaki sürücüler için alkol sınırı kaç promildir?', ['0,00', '0,10', '0,20', '0,30', '0,50'], 2, 'Hususi otomobil dışındaki tüm sürücüler için sınır 0,20 promildir.', '2918'],
  ['Alkollü araç kullanmanın ikinci kez tespitinde sürücü belgesi ne kadar süreyle geri alınır?', ['6 ay', '1 yıl', '2 yıl', '5 yıl', 'Süresiz'], 2, 'Birinci tespitte 6 ay, ikincide 2 yıl, üçüncüde 5 yıl süreyle geri alınır.', '2918'],
  ['Otoyollarda otomobiller için genel hız sınırı kaç km/saattir?', ['90', '100', '110', '120', '130'], 3, 'Otomobilde yerleşim içi 50, yerleşim dışı 90, bölünmüş yol 110, otoyol 120 km/saattir.', 'Karayolları Trafik Yönetmeliği'],
  ['Trafik işaretlerinde öncelik sırası nasıldır?', ['Levha, ışıklı cihaz, trafik görevlisi', 'Trafik görevlisinin işareti; ışıklı cihaz ve levhadan önce gelir', 'Işıklı trafik cihazı her zaman önce gelir', 'Yer işaretleri her zaman önce gelir', 'Levhalar ışıklı cihazlardan önce gelir'], 1, 'Trafik görevlisinin işaret ve talimatları ışıklı cihazlardan ve levhalardan önce gelir.', '2918'],

  // Anayasa ve kurullar
  ['Anayasa\'nın 4. maddesine göre hangi maddelerin değiştirilmesi teklif dahi edilemez?', ['1, 2 ve 3. maddeler', '1, 2 ve 4. maddeler', '2, 3 ve 4. maddeler', '1 ve 2. maddeler', '1, 3 ve 5. maddeler'], 0, 'Devletin şekline ilişkin 1. madde, Cumhuriyetin niteliklerine ilişkin 2. madde ve 3. madde hükümleri değiştirilemez ve değiştirilmesi teklif edilemez.', 'Anayasa md. 4', 'Anayasa'],
  ['Anayasa Mahkemesi kaç üyeden oluşur?', ['11', '13', '15', '17', '21'], 2, 'Anayasa Mahkemesi 15 üyeden kurulur.', 'Anayasa md. 146', 'Anayasa'],
  ['Hâkimler ve Savcılar Kurulu kaç üyeden oluşur?', ['11', '13', '15', '17', '22'], 1, 'HSK 13 üyeden oluşur.', 'Anayasa md. 159', 'Anayasa'],
  ['Kişisel Verileri Koruma Kurulu kaç üyeden oluşur?', ['5', '7', '9', '11', '13'], 2, 'KVKK Kurulu 9 üyeden oluşur.', '6698'],
  ['Cumhurbaşkanının görev süresi ve seçilme sınırı nedir?', ['4 yıl; en fazla 2 kez', '5 yıl; en fazla 2 kez', '5 yıl; bir kez', '7 yıl; bir kez', '5 yıl; sınırsız'], 1, 'Cumhurbaşkanının görev süresi 5 yıldır; bir kimse en fazla iki defa seçilebilir.', 'Anayasa md. 101', 'Anayasa'],
  ['Anayasa değişikliği teklifi TBMM üye tamsayısının en az kaçı tarafından yazıyla yapılır?', ['1/3', '1/4', '2/5', '3/5', '2/3'], 0, 'Teklif üye tamsayısının en az 1/3\'ü tarafından yapılır; 3/5 ile halkoylamasına gidilebilir, 2/3 ile doğrudan kabul edilir.', 'Anayasa md. 175', 'Anayasa'],
  ['Anayasa değişikliği TBMM\'de hangi oranla kabul edilirse Cumhurbaşkanı halkoylamasına götürmeden yayımlayabilir?', ['1/2', '3/5', '2/3', '3/4', '4/5'], 2, 'Üye tamsayısının 2/3 çoğunluğu ile kabul edilen değişiklik doğrudan kabul edilmiş olur; 3/5 ile 2/3 arası halkoylamasına gider.', 'Anayasa md. 175', 'Anayasa'],
  ['TBMM\'nin toplantı yeter sayısı nedir?', ['Üye tamsayısının 1/3\'ü', 'Üye tamsayısının yarısı', 'Üye tamsayısının 1/4\'ü', 'Üye tamsayısının 2/3\'ü', 'Salt çoğunluk + 1'], 0, 'TBMM üye tamsayısının 1/3\'ü ile toplanır; karar yeter sayısı üye tamsayısının 1/4\'ünün bir fazlasından az olamaz.', 'Anayasa md. 96', 'Anayasa'],
  ['Olağanüstü hâl ilanında süre ve uzatma sınırları nedir?', ['En çok 3 ay; her uzatma en çok 3 ay', 'En çok 6 ay; her uzatma en çok 4 ay', 'En çok 6 ay; her uzatma en çok 6 ay', 'En çok 1 yıl; uzatılamaz', 'En çok 4 ay; her uzatma en çok 6 ay'], 1, 'Olağanüstü hâl Cumhurbaşkanınca en çok 6 ay için ilan edilir; TBMM her defasında en çok 4 ay uzatabilir.', 'Anayasa md. 119', 'Anayasa'],
  ['Anayasa\'ya göre yakalanan veya tutuklanan kişi en geç ne kadar sürede hâkim önüne çıkarılır?', ['24 saat; toplu suçlarda 3 gün', '48 saat; toplu suçlarda 4 gün', '48 saat; toplu suçlarda 7 gün', '72 saat; toplu suçlarda 4 gün', '24 saat; toplu suçlarda 4 gün'], 1, 'Anayasa md. 19\'a göre süre 48 saat, toplu suçlarda en çok 4 gündür. CMK\'daki gözaltı süresi ise 24 saattir.', 'Anayasa md. 19', 'Anayasa'],

  // İndirim, artırım ve cezalar
  ['Haksız tahrik hâlinde ağırlaştırılmış müebbet hapis yerine hangi ceza verilir?', ['12–18 yıl', '13–20 yıl', '15–20 yıl', '18–24 yıl', '20–25 yıl'], 3, 'Haksız tahrikte ağırlaştırılmış yerine 18–24 yıl, ömür boyu yerine 12–18 yıl verilir; diğer cezalarda 1/4\'ten 3/4\'e kadar indirilir.', 'TCK md. 29'],
  ['Teşebbüs hâlinde müebbet hapis yerine hangi ceza verilir?', ['9–15 yıl', '10–15 yıl', '12–18 yıl', '13–20 yıl', '15–20 yıl'], 0, 'Teşebbüste ağırlaştırılmış yerine 13–20 yıl, müebbet yerine 9–15 yıl verilir.', 'TCK md. 35'],
  ['Yardım eden kişiye ağırlaştırılmış müebbet hapis yerine hangi ceza verilir?', ['13–20 yıl', '15–20 yıl', '18–24 yıl', '10–15 yıl', '20–25 yıl'], 1, 'Yardım edene ağırlaştırılmış yerine 15–20 yıl, müebbet yerine 10–15 yıl verilir; diğer cezalarda yarısı indirilir ve 8 yılı geçemez.', 'TCK md. 39'],
  ['Zincirleme suçta ceza nasıl belirlenir?', ['1/6\'dan 1/2\'ye kadar artırılır', 'Tek ceza verilir, 1/4\'ten 3/4\'e kadar artırılır', 'Yarı oranında artırılır', 'Bir kat artırılır', 'Her suç için ayrı ceza verilir'], 1, 'Zincirleme suçta tek ceza verilir ve bu ceza 1/4\'ten 3/4\'e kadar artırılır.', 'TCK md. 43'],
  ['İşlediği bir fiille birden fazla farklı suçun oluşmasına sebebiyet veren kişi hakkında hangi ceza verilir?', ['Her suçtan ayrı ceza', 'En ağır cezayı gerektiren suçtan ceza', 'En hafif cezayı gerektiren suçtan ceza', 'Cezalar toplanıp yarısı indirilir', 'Zincirleme suç hükümleri uygulanır'], 1, 'Fikri içtimada en ağır cezayı gerektiren suçtan cezalandırılır.', 'TCK md. 44'],
  ['Başkasını suç işlemeye azmettiren kişiye hangi ceza verilir?', ['İşlenen suçun cezasının yarısı', 'İşlenen suçun cezası', 'İşlenen suçun cezasının 1/3\'ü', 'İşlenen suçun cezasının 2/3\'ü', 'Ceza verilmez'], 1, 'Azmettiren, işlenen suçun cezası ile cezalandırılır.', 'TCK md. 38'],
  ['Rüşvet suçunun cezası nedir?', ['2–5 yıl hapis', '3–8 yıl hapis', '4–12 yıl hapis', '5–12 yıl hapis', '5–10 yıl hapis'], 2, 'Rüşvet alan da veren de 4–12 yıl hapis cezası ile cezalandırılır.', 'TCK md. 252'],
  ['Zimmet suçunun cezası nedir?', ['4–12 yıl hapis', '5–10 yıl hapis', '5–12 yıl hapis', '3–8 yıl hapis', '2–7 yıl hapis'], 2, 'Zimmet 5–12 yıl hapis cezası gerektirir; ihaleye fesat karıştırma da aynı aralıktadır.', 'TCK md. 247'],
  ['İşkence suçunun temel cezası nedir?', ['2–8 yıl hapis', '3–12 yıl hapis', '4–12 yıl hapis', '5–10 yıl hapis', '1–5 yıl hapis'], 1, 'İşkence 3–12 yıl hapis cezası gerektirir.', 'TCK md. 94'],
  ['Silahlı örgüte üye olanlara verilecek ceza nedir?', ['3–8 yıl hapis', '4–12 yıl hapis', '5–10 yıl hapis', '10–15 yıl hapis', '1–5 yıl hapis'], 2, 'Silahlı örgüte üyelik 5–10 yıl, örgütü kuran veya yöneten 10–15 yıl hapisle cezalandırılır.', 'TCK md. 314'],
  ['Resmi belgede sahteciliği kamu görevlisi görevi sırasında işlerse cezası nedir?', ['2–5 yıl hapis', '3–8 yıl hapis', '4–10 yıl hapis', '1–5 yıl hapis', '5–12 yıl hapis'], 1, 'Resmi belgede sahtecilik 2–5 yıl; görevi sırasında kamu görevlisi işlerse 3–8 yıl hapistir.', 'TCK md. 204'],
  ['Cumhurbaşkanına hakaret ve Türk Milletini aşağılama suçlarında kovuşturma kimin iznine bağlıdır?', ['Cumhurbaşkanının şikâyetine', 'Adalet Bakanının iznine', 'İçişleri Bakanının iznine', 'TBMM Başkanının iznine', 'Cumhuriyet başsavcısının onayına'], 1, 'TCK 299 ve 301\'deki suçlarda kovuşturma Adalet Bakanının iznine bağlıdır.', 'TCK md. 299, 301'],
  ['Suçu bildirmeme suçunu adli kolluk görevlisi işlerse ceza nasıl değişir?', ['1/3 oranında artırılır', 'Yarı oranında artırılır', 'Bir kat artırılır', '1/4 oranında artırılır', 'Değişmez'], 1, 'Kamu görevlisinin suçu bildirmemesi suçu adli kolluk görevlisi tarafından işlenirse ceza yarı oranında artırılır.', 'TCK md. 279/2'],
  ['Suçluyu kayırma suçu kişinin eşi, kardeşi, üstsoyu veya altsoyu lehine işlenirse ne olur?', ['Ceza yarı oranında indirilir', 'Ceza verilmez', 'Ceza 1/3 oranında indirilir', 'Ceza aynen verilir', 'Adli para cezasına çevrilir'], 1, 'Bu yakınlar lehine işlenen suçluyu kayırmada ceza verilmez.', 'TCK md. 283/3'],

  // Karıştırılanlar
  ['Önleme amaçlı durdurma için aranan şüphe derecesi hangisidir?', ['Makul sebep', 'Makul şüphe', 'Kuvvetli suç şüphesi', 'Yeterli şüphe', 'Basit şüphe'], 0, 'Durdurma için makul sebep, arama için makul şüphe, tutuklama için kuvvetli suç şüphesi gerekir.', 'PVSK md. 4/A; CMK'],
  ['Arama kararı için aranan şüphe derecesi hangisidir?', ['Kuvvetli suç şüphesi', 'Makul sebep', 'Makul şüphe', 'Yeterli şüphe', 'Basit şüphe'], 2, 'Arama için makul şüphe gerekir; durdurmada makul sebep, tutuklamada kuvvetli suç şüphesi aranır.', 'CMK md. 116'],
  ['Tutuklama için aranan şüphe derecesi hangisidir?', ['Makul sebep', 'Makul şüphe', 'Basit şüphe', 'Yeterli şüphe', 'Kuvvetli suç şüphesi'], 4, 'Tutuklama için kuvvetli suç şüphesinin varlığını gösteren somut deliller gerekir.', 'CMK md. 100'],
  ['Kovuşturma evresi başladığında suç şüphesi altındaki kişi nasıl adlandırılır?', ['Şüpheli', 'Sanık', 'Hükümlü', 'Tutuklu', 'Fail'], 1, 'Soruşturma evresinde şüpheli, kovuşturma başlayınca sanık denir.', 'CMK md. 2'],
  ['Avrupa dışında meydana gelen olaylar nedeniyle gelen ve uluslararası koruma isteyen kişiye ne statüsü verilir?', ['Mülteci', 'Şartlı mülteci', 'Geçici koruma', 'İkincil koruma', 'Vatansız'], 1, 'Avrupa\'daki olaylar nedeniyle gelene mülteci, Avrupa dışındaki olaylar nedeniyle gelene şartlı mülteci statüsü verilir.', '6458'],
  ['Kitlesel akın hâlinde sınırlarımıza gelen yabancılara hangi koruma sağlanır?', ['Mülteci statüsü', 'Şartlı mülteci statüsü', 'Geçici koruma', 'İkincil koruma', 'İkamet izni'], 2, 'Kitlesel akında geçici koruma sağlanır.', '6458'],
  ['Kayın hısımlığında tanıklıktan çekinme hakkı hangi dereceye kadardır?', ['1. derece', '2. derece', '3. derece', '4. derece', 'Sınırsız'], 1, 'Kan hısımlarında 3. dereceye, kayın hısımlarında 2. dereceye kadar tanıklıktan çekinilebilir. Boşanmış eş de çekinebilir.', 'CMK md. 45'],
  ['Kan hısımlığında tanıklıktan çekinme hakkı hangi dereceye kadardır?', ['1. derece', '2. derece', '4. derece', '3. derece', 'Sınırsız'], 3, 'Kan hısımlarında 3. dereceye, kayın hısımlarında 2. dereceye kadar tanıklıktan çekinilebilir.', 'CMK md. 45'],
  ['Müdafi bulunmadan kollukta alınan ifade hangi durumda hükme esas alınamaz?', ['Her durumda hükme esas alınır', 'Hâkim önünde doğrulanmazsa', 'Savcı onaylamazsa', 'Tanık ifadesiyle desteklenmezse', 'Şüpheli imzalamazsa'], 1, 'Müdafi hazır olmadan kollukta alınan ifade, hâkim veya mahkeme huzurunda doğrulanmadıkça hükme esas alınamaz.', 'CMK md. 148'],
];

/**
 * Doğru şıkkın hep aynı harfte toplanmaması için cevap sırayla A–E arasına dağıtılır.
 * Doğru şık hedef konumdaki şıkla yer değiştirir.
 */
function spread(row: Row, i: number): Question {
  const [text, options, answer, explanation, source, subject] = row;
  const target = i % 5;
  const opts = [...options] as Options;
  [opts[answer], opts[target]] = [opts[target], opts[answer]];
  return {
    id: `sayilar-${i + 1}`,
    subject: subject ?? 'Mevzuat',
    topic: 'Sayılar ve Süreler',
    text,
    options: opts,
    answerIndex: target,
    explanation,
    source,
  };
}

export const factExam: PracticeExam = {
  id: 'sayilar-sureler',
  title: 'Sayılar ve Süreler Testi',
  durationMinutes: Math.round((rows.length * 1.2) / 5) * 5,
  questions: rows.map(spread),
};
