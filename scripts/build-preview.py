# dist/ çıktısını tek bir HTML sayfasına gömer (Claude artifact önizlemesi için).
# Kullanım: npx expo export --platform web && python3 scripts/build-preview.py dist <çıktı.html>
import base64, glob, os, re, sys
dist, out = sys.argv[1], sys.argv[2]
js = open(glob.glob(f'{dist}/_expo/static/js/web/*.js')[0], encoding='utf-8').read()
mime = {'.ttf': 'font/ttf', '.png': 'image/png'}
def inline(m):
    path = os.path.join(dist, m.group(1).lstrip('/'))
    data = base64.b64encode(open(path, 'rb').read()).decode()
    return '"data:%s;base64,%s"' % (mime[os.path.splitext(path)[1]], data)
js = re.sub(r'"(/assets/[^"]+)"', inline, js)
# HTML ayrıştırıcısı betik içindeki "<!--" dizisini özel yorumlar; JS'te anlamı aynı olan "<\!--" yazılır
# (dizgelerde ve düzenli ifadelerde "\!" yalnızca "!" demektir).
js = js.replace('<!--', '<\\!--')
assert '</script' not in js.lower() and '<!--' not in js
page = f'''<title>JSPS Hazırlık</title>
<style>
/* Uygulamanın kendi teması; sayfa yalnızca zemini ve tam ekran düzeni sağlar. */
:root {{ --bg: #F4F6F5; --fg: #1B2420; }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg: #F4F6F5; --fg: #1B2420; }} }}
:root[data-theme="dark"] {{ --bg: #F4F6F5; --fg: #1B2420; }}
html, body {{ height: 100%; }}
body {{ overflow: hidden; background: var(--bg); color: var(--fg); }}
#root {{ display: flex; height: 100%; flex: 1; }}
</style>
<div id="root"></div>
<script>
// Uygulama yönlendirmesi adres çubuğundaki yola bakar; ana sayfadan başlat.
try {{ history.replaceState(null, '', '/'); }} catch (e) {{}}
</script>
<script>
{js}
</script>
'''
open(out, 'w', encoding='utf-8').write(page)
print(len(page.encode()) / 1e6, 'MB')
