# Expo web çıktısını (dist/) telefona kurulabilen, internetsiz çalışan bir PWA klasörüne çevirir.
#
# Kullanım:
#   npx expo export --platform web
#   python3 scripts/build-pwa.py dist pwa
#
# Çıkan klasör herhangi bir statik hostinge (Netlify, Vercel, GitHub Pages, kendi sunucun) olduğu gibi yüklenir.
# Dosya yolları "/" ile başladığından site alan adının köküne yüklenmelidir (ör. uzmankolluk.netlify.app).
import hashlib, json, os, shutil, sys
from PIL import Image

dist, out = sys.argv[1], sys.argv[2]
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
assets = os.path.join(root, 'assets')

NAME = 'Uzman Kolluk'
THEME = '#0B6B47'
BACKGROUND = '#053A27'

shutil.rmtree(out, ignore_errors=True)
shutil.copytree(dist, out)
for junk in ('metadata.json',):
    p = os.path.join(out, junk)
    if os.path.exists(p):
        os.remove(p)

# İkonlar: normal, "maskable" (Android'in kırptığı biçim için güvenli alanlı) ve Apple
os.makedirs(os.path.join(out, 'icons'), exist_ok=True)
icon = Image.open(os.path.join(assets, 'icon.png')).convert('RGB')
for size in (192, 512):
    icon.resize((size, size), Image.LANCZOS).save(os.path.join(out, 'icons', f'icon-{size}.png'))
icon.resize((180, 180), Image.LANCZOS).save(os.path.join(out, 'icons', 'apple-touch-icon.png'))
bg = Image.open(os.path.join(assets, 'android-icon-background.png')).convert('RGBA')
fg = Image.open(os.path.join(assets, 'android-icon-foreground.png')).convert('RGBA')
Image.alpha_composite(bg, fg).convert('RGB').resize((512, 512), Image.LANCZOS).save(
    os.path.join(out, 'icons', 'maskable-512.png')
)

manifest = {
    'name': NAME,
    'short_name': NAME,
    'description': 'Jandarma sınavlarına hazırlık ve sahada iş kolaylaştıran araçlar.',
    'lang': 'tr',
    'start_url': '/',
    'scope': '/',
    'display': 'standalone',
    'orientation': 'portrait',
    'background_color': BACKGROUND,
    'theme_color': THEME,
    'icons': [
        {'src': '/icons/icon-192.png', 'sizes': '192x192', 'type': 'image/png'},
        {'src': '/icons/icon-512.png', 'sizes': '512x512', 'type': 'image/png'},
        {'src': '/icons/maskable-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'maskable'},
    ],
}
with open(os.path.join(out, 'manifest.webmanifest'), 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

# index.html: Türkçe dil, manifest, Apple ana ekran etiketleri ve service worker kaydı
index_path = os.path.join(out, 'index.html')
html = open(index_path, encoding='utf-8').read()
html = html.replace('<html lang="en">', '<html lang="tr">')
html = html.replace('httpEquiv="X-UA-Compatible"', 'http-equiv="X-UA-Compatible"')
head_tags = f'''
  <link rel="manifest" href="/manifest.webmanifest">
  <meta name="description" content="{manifest['description']}">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="{NAME}">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
'''
html = html.replace('</head>', head_tags + '</head>', 1)
register = '''
  <script>
    // İnternetsiz çalışma ve ana ekrana ekleme için service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function () {});
      });
    }
  </script>
'''
html = html.replace('</body>', register + '</body>', 1)
with open(index_path, 'w', encoding='utf-8') as f:
    f.write(html)

# Service worker: tüm dosyaları önbelleğe alır; sürüm, dosya içeriklerinden üretilir
files, digest = [], hashlib.sha256()
for base, _, names in os.walk(out):
    for n in sorted(names):
        full = os.path.join(base, n)
        rel = '/' + os.path.relpath(full, out).replace(os.sep, '/')
        files.append(rel)
        with open(full, 'rb') as fh:
            digest.update(rel.encode() + fh.read())
files.sort()
version = digest.hexdigest()[:12]
sw = f'''// Bu dosya scripts/build-pwa.py tarafından üretilir.
const CACHE = 'uzman-kolluk-{version}';
const FILES = {json.dumps(['/'] + files, ensure_ascii=False, indent=2)};

self.addEventListener('install', (event) => {{
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
}});

self.addEventListener('activate', (event) => {{
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
}});

self.addEventListener('fetch', (event) => {{
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // Sayfa geçişleri: önce ağ, bağlantı yoksa önbellekteki uygulama
  if (req.mode === 'navigate') {{
    event.respondWith(fetch(req).catch(() => caches.match('/index.html')));
    return;
  }}
  // Diğer dosyalar: önce önbellek
  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {{
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        }}),
    ),
  );
}});
'''
with open(os.path.join(out, 'sw.js'), 'w', encoding='utf-8') as f:
    f.write(sw)

# Sayfa yenilendiğinde alt sayfaların (ör. /calis) bulunabilmesi için:
# Netlify yönlendirmesi ve GitHub Pages için 404 sayfası
with open(os.path.join(out, '_redirects'), 'w') as f:
    f.write('/*    /index.html   200\n')
shutil.copy(index_path, os.path.join(out, '404.html'))

total = sum(os.path.getsize(os.path.join(b, n)) for b, _, ns in os.walk(out) for n in ns)
print(f'PWA hazır: {out}  ({len(files)} dosya, {total / 1e6:.1f} MB, sürüm {version})')
