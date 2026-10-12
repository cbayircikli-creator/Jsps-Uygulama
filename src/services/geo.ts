// Koordinat biçimleri ve pusula yardımcıları (WGS84).
import { forward as toMgrs } from 'mgrs';

const toRad = (d: number) => (d * Math.PI) / 180;

export function formatDecimal(lat: number, lon: number) {
  return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
}

/** Derece-dakika-saniye, ör. 39°55'12.3" K 32°51'45.6" D */
export function formatDms(lat: number, lon: number) {
  const part = (v: number, pos: string, neg: string) => {
    const a = Math.abs(v);
    let d = Math.floor(a);
    let m = Math.floor((a - d) * 60);
    let s = Math.round(((a - d) * 60 - m) * 60 * 10) / 10;
    if (s >= 60) {
      s = 0;
      m += 1;
    }
    if (m >= 60) {
      m = 0;
      d += 1;
    }
    return `${d}°${String(m).padStart(2, '0')}'${s.toFixed(1).padStart(4, '0')}" ${v >= 0 ? pos : neg}`;
  };
  return `${part(lat, 'K', 'G')}  ${part(lon, 'D', 'B')}`;
}

/** UTM (WGS84, Krüger serisi). Kutup bölgeleri (UTM dışı) için null döner. */
export function toUtm(lat: number, lon: number) {
  if (lat < -80 || lat > 84) return null;
  const a = 6378137;
  const f = 1 / 298.257223563;
  const k0 = 0.9996;
  const e2 = f * (2 - f);
  const ep2 = e2 / (1 - e2);

  let zone = Math.floor((lon + 180) / 6) + 1;
  // Norveç ve Svalbard istisnaları
  if (lat >= 56 && lat < 64 && lon >= 3 && lon < 12) zone = 32;
  if (lat >= 72 && lat < 84) {
    if (lon >= 0 && lon < 9) zone = 31;
    else if (lon >= 9 && lon < 21) zone = 33;
    else if (lon >= 21 && lon < 33) zone = 35;
    else if (lon >= 33 && lon < 42) zone = 37;
  }
  const lon0 = toRad((zone - 1) * 6 - 180 + 3);
  const φ = toRad(lat);
  const N = a / Math.sqrt(1 - e2 * Math.sin(φ) ** 2);
  const T = Math.tan(φ) ** 2;
  const C = ep2 * Math.cos(φ) ** 2;
  const A = Math.cos(φ) * (toRad(lon) - lon0);
  const M =
    a *
    ((1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256) * φ -
      ((3 * e2) / 8 + (3 * e2 ** 2) / 32 + (45 * e2 ** 3) / 1024) * Math.sin(2 * φ) +
      ((15 * e2 ** 2) / 256 + (45 * e2 ** 3) / 1024) * Math.sin(4 * φ) -
      ((35 * e2 ** 3) / 3072) * Math.sin(6 * φ));

  const easting =
    k0 * N * (A + ((1 - T + C) * A ** 3) / 6 + ((5 - 18 * T + T ** 2 + 72 * C - 58 * ep2) * A ** 5) / 120) + 500000;
  let northing =
    k0 *
    (M +
      N *
        Math.tan(φ) *
        (A ** 2 / 2 +
          ((5 - T + 9 * C + 4 * C ** 2) * A ** 4) / 24 +
          ((61 - 58 * T + T ** 2 + 600 * C - 330 * ep2) * A ** 6) / 720));
  if (lat < 0) northing += 10000000;

  const bands = 'CDEFGHJKLMNPQRSTUVWX';
  const band = bands[Math.min(19, Math.floor((lat + 80) / 8))];
  return { zone, band, easting, northing };
}

export function formatUtm(lat: number, lon: number) {
  const u = toUtm(lat, lon);
  if (!u) return 'UTM kapsamı dışında';
  return `${u.zone}${u.band}  ${Math.round(u.easting)} D  ${Math.round(u.northing)} K`;
}

/** MGRS (askerî ızgara), 1 m hassasiyet; ör. 36S VK 12345 67890 */
export function formatMgrs(lat: number, lon: number) {
  try {
    const m = toMgrs([lon, lat], 5);
    // 36SVK1234567890 → 36S VK 12345 67890
    const g = m.match(/^(\d{1,2}[A-Z])([A-Z]{2})(\d{5})(\d{5})$/);
    return g ? `${g[1]} ${g[2]} ${g[3]} ${g[4]}` : m;
  } catch {
    return 'MGRS kapsamı dışında';
  }
}

const DIRS = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BKB', 'KB', 'KKB'];
const DIR_NAMES: Record<string, string> = { K: 'Kuzey', D: 'Doğu', G: 'Güney', B: 'Batı', KD: 'Kuzeydoğu', GD: 'Güneydoğu', GB: 'Güneybatı', KB: 'Kuzeybatı' };

/** 16 yönlü pusula kısaltması (K, KKD, KD...) */
export const directionOf = (deg: number) => DIRS[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16];
export const directionName = (deg: number) => {
  const d = directionOf(deg);
  return DIR_NAMES[d] ?? d;
};

/** Askerî kullanım için milyem (6400 sistemi) */
export const toMils = (deg: number) => Math.round((((deg % 360) + 360) % 360) * (6400 / 360));
