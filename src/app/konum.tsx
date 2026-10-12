import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Linking, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Polygon, Text as SvgText } from 'react-native-svg';

import { SatelliteMap, type MapKind } from '../components/SatelliteMap';
import { Card, Screen, SectionTitle, text } from '../components/ui';
import { directionName, directionOf, formatDecimal, formatDms, formatMgrs, formatUtm, toMils } from '../services/geo';
import { colors, font, fonts, radius, shadow, spacing } from '../theme';

type Status = 'loading' | 'denied' | 'unavailable' | 'ready';

const FORMATS = [
  { key: 'mgrs', label: 'MGRS', fn: formatMgrs },
  { key: 'utm', label: 'UTM', fn: formatUtm },
  { key: 'dms', label: 'Derece', fn: formatDms },
  { key: 'dec', label: 'Ondalık', fn: formatDecimal },
] as const;

const MAP_KINDS: { key: MapKind; label: string }[] = [
  { key: 'satellite', label: 'Uydu' },
  { key: 'hybrid', label: 'Hibrit' },
  { key: 'standard', label: 'Harita' },
];

export default function Konum() {
  const [status, setStatus] = useState<Status>('loading');
  const [pos, setPos] = useState<Location.LocationObject | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [mapKind, setMapKind] = useState<MapKind>('satellite');
  const [copied, setCopied] = useState<string | null>(null);
  // İzin yeniden istendiğinde dinleyicileri baştan kurmak için
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let posSub: Location.LocationSubscription | undefined;
    let headSub: Location.LocationSubscription | undefined;
    let cancelled = false;
    (async () => {
      try {
        const perm = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;
        if (perm.status !== 'granted') {
          setStatus('denied');
          return;
        }
        posSub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1 },
          (p) => {
            setPos(p);
            setStatus('ready');
          },
          () => setStatus('unavailable'),
        );
        // Pusula her cihazda yoktur (ör. web); yoksa yön gösterilmez.
        headSub = await Location.watchHeadingAsync((h) =>
          setHeading(h.trueHeading >= 0 ? h.trueHeading : h.magHeading),
        ).catch(() => undefined);
      } catch {
        if (!cancelled) setStatus('unavailable');
      }
    })();
    return () => {
      cancelled = true;
      posSub?.remove();
      headSub?.remove();
    };
  }, [attempt]);

  const coords = pos?.coords;
  const lat = coords?.latitude;
  const lon = coords?.longitude;
  const hasPos = coords !== undefined && lat !== undefined && lon !== undefined;

  const copy = async (label: string, value: string) => {
    try {
      await Clipboard.setStringAsync(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  const shareText = () =>
    hasPos
      ? `Konum\nMGRS: ${formatMgrs(lat, lon)}\nUTM: ${formatUtm(lat, lon)}\n${formatDms(lat, lon)}\n${formatDecimal(lat, lon)}\nhttps://www.google.com/maps/search/?api=1&query=${lat},${lon}`
      : '';

  return (
    <Screen>
      <Card style={styles.compassCard}>
        <Compass heading={heading} />
        {heading !== null ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.headingValue}>
              {Math.round(heading)}° <Text style={styles.headingDir}>{directionOf(heading)}</Text>
            </Text>
            <Text style={text.muted}>
              {directionName(heading)} · {toMils(heading)} milyem
            </Text>
          </View>
        ) : (
          <Text style={[text.muted, { textAlign: 'center' }]}>
            {status === 'loading' ? 'Pusula hazırlanıyor…' : 'Bu cihazda pusula algılayıcısı kullanılamıyor.'}
          </Text>
        )}
      </Card>

      {status === 'denied' && (
        <Card style={{ gap: spacing.md }}>
          <Text style={text.heading}>Konum izni gerekli</Text>
          <Text style={text.muted}>
            Koordinat ve haritayı gösterebilmek için konum izni ver. Konumun yalnızca bu ekranda kullanılır, hiçbir yere gönderilmez.
          </Text>
          <View style={styles.row}>
            <Pressable onPress={() => setAttempt((a) => a + 1)} style={[styles.btn, styles.btnPrimary]}>
              <Text style={[styles.btnText, { color: '#fff' }]}>Tekrar iste</Text>
            </Pressable>
            <Pressable onPress={() => Linking.openSettings().catch(() => {})} style={[styles.btn, styles.btnOutline]}>
              <Text style={[styles.btnText, { color: colors.primary }]}>Ayarları aç</Text>
            </Pressable>
          </View>
        </Card>
      )}
      {status === 'unavailable' && (
        <Card style={{ gap: spacing.sm }}>
          <Text style={text.heading}>Konum alınamadı</Text>
          <Text style={text.muted}>Cihazının konum servisinin açık olduğundan emin ol; açık alanda konum daha hızlı bulunur.</Text>
          <Pressable onPress={() => setAttempt((a) => a + 1)} style={[styles.btn, styles.btnPrimary]}>
            <Text style={[styles.btnText, { color: '#fff' }]}>Tekrar dene</Text>
          </Pressable>
        </Card>
      )}

      {hasPos && (
        <>
          <SectionTitle>Koordinatlar</SectionTitle>
          <Card style={{ gap: 0, paddingVertical: spacing.xs }}>
            {FORMATS.map((f, i) => {
              const value = f.fn(lat, lon);
              return (
                <Pressable
                  key={f.key}
                  onPress={() => copy(f.label, value)}
                  style={[styles.coordRow, i > 0 && styles.divider]}
                  accessibilityRole="button"
                  accessibilityLabel={`${f.label} koordinatını kopyala`}
                >
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.coordLabel}>{f.label}</Text>
                    <Text style={styles.coordValue} selectable>
                      {value}
                    </Text>
                  </View>
                  <Ionicons
                    name={copied === f.label ? 'checkmark-circle' : 'copy-outline'}
                    size={20}
                    color={copied === f.label ? colors.success : colors.textMuted}
                  />
                </Pressable>
              );
            })}
          </Card>

          <View style={styles.metrics}>
            <Metric
              label="Rakım"
              value={coords.altitude != null ? `${Math.round(coords.altitude)} m` : '–'}
            />
            <Metric
              label="Doğruluk"
              value={coords.accuracy != null ? `±${Math.round(coords.accuracy)} m` : '–'}
            />
            <Metric
              label="Hız"
              value={coords.speed != null && coords.speed >= 0 ? `${Math.round(coords.speed * 3.6)} km/s` : '–'}
            />
          </View>

          <SectionTitle>Harita</SectionTitle>
          <View style={styles.segment}>
            {MAP_KINDS.map((m) => (
              <Pressable
                key={m.key}
                onPress={() => setMapKind(m.key)}
                style={[styles.segmentItem, mapKind === m.key && styles.segmentActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: mapKind === m.key }}
              >
                <Text style={[styles.segmentText, mapKind === m.key && { color: '#fff' }]}>{m.label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.map}>
            <SatelliteMap lat={lat} lon={lon} kind={mapKind} />
          </View>

          <View style={styles.row}>
            <Pressable
              onPress={() => Share.share({ message: shareText() }).catch(() => copy('Konum', shareText()))}
              style={[styles.btn, styles.btnPrimary]}
            >
              <Ionicons name="share-social" size={18} color="#fff" />
              <Text style={[styles.btnText, { color: '#fff' }]}>Konumu paylaş</Text>
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`)}
              style={[styles.btn, styles.btnOutline]}
            >
              <Ionicons name="map" size={18} color={colors.primary} />
              <Text style={[styles.btnText, { color: colors.primary }]}>Haritada aç</Text>
            </Pressable>
          </View>
          <Text style={[text.muted, { textAlign: 'center' }]}>
            Koordinatlar WGS84 datumundadır. Doğruluk, uydu görüşüne ve cihaza göre değişir.
          </Text>
        </>
      )}
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

/** Kadran cihazın yönüne göre döner; üstteki kırmızı ok her zaman cihazın baktığı yönü gösterir. */
function Compass({ heading }: { heading: number | null }) {
  const size = 240;
  const c = size / 2;
  const r = c - 8;
  const rot = -(heading ?? 0);
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  const labels = [
    { deg: 0, t: 'K' },
    { deg: 90, t: 'D' },
    { deg: 180, t: 'G' },
    { deg: 270, t: 'B' },
  ];
  return (
    <Svg width={size} height={size} accessibilityLabel={heading !== null ? `Yön ${Math.round(heading)} derece` : 'Pusula'}>
      <Circle cx={c} cy={c} r={r} fill={colors.primaryDark} />
      <Circle cx={c} cy={c} r={r - 34} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
      <G rotation={rot} origin={`${c}, ${c}`}>
        {ticks.map((d) => {
          const major = d % 30 === 0;
          const a = (d * Math.PI) / 180;
          const r1 = r - (major ? 16 : 8);
          return (
            <Line
              key={d}
              x1={c + Math.sin(a) * r1}
              y1={c - Math.cos(a) * r1}
              x2={c + Math.sin(a) * (r - 3)}
              y2={c - Math.cos(a) * (r - 3)}
              stroke={d === 0 ? '#FF5A4E' : major ? '#FFFFFF' : 'rgba(255,255,255,0.45)'}
              strokeWidth={major ? 2 : 1}
            />
          );
        })}
        {labels.map((l) => {
          const a = (l.deg * Math.PI) / 180;
          const rr = r - 30;
          return (
            <SvgText
              key={l.t}
              x={c + Math.sin(a) * rr}
              y={c - Math.cos(a) * rr + 7}
              fill={l.t === 'K' ? '#FF5A4E' : '#FFFFFF'}
              fontSize={20}
              fontWeight="700"
              textAnchor="middle"
            >
              {l.t}
            </SvgText>
          );
        })}
        {[30, 60, 120, 150, 210, 240, 300, 330].map((d) => {
          const a = (d * Math.PI) / 180;
          const rr = r - 30;
          return (
            <SvgText
              key={d}
              x={c + Math.sin(a) * rr}
              y={c - Math.cos(a) * rr + 4}
              fill="rgba(255,255,255,0.6)"
              fontSize={10}
              textAnchor="middle"
            >
              {d}
            </SvgText>
          );
        })}
      </G>
      {/* Sabit gösterge: cihazın baktığı yön */}
      <Polygon points={`${c},${c - r + 22} ${c - 9},${c - 6} ${c + 9},${c - 6}`} fill="#FF5A4E" />
      <Polygon points={`${c},${c + r - 46} ${c - 9},${c + 6} ${c + 9},${c + 6}`} fill="rgba(255,255,255,0.35)" />
      <Circle cx={c} cy={c} r={7} fill={colors.accentBright} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  compassCard: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl },
  headingValue: { fontFamily: fonts.display, fontSize: 44, lineHeight: 48, color: colors.text },
  headingDir: { color: colors.danger },
  row: { flexDirection: 'row', gap: spacing.sm },
  btn: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnOutline: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary },
  btnText: { fontFamily: fonts.bold, fontSize: font.body },
  coordRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  coordLabel: { fontFamily: fonts.bold, fontSize: font.tiny, letterSpacing: 1, color: colors.accent },
  coordValue: { fontFamily: fonts.display, fontSize: 22, color: colors.text, fontVariant: ['tabular-nums'] },
  metrics: { flexDirection: 'row', gap: spacing.sm },
  metric: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    ...shadow.card,
  },
  metricValue: { fontFamily: fonts.display, fontSize: 22, color: colors.text, fontVariant: ['tabular-nums'] },
  metricLabel: { fontFamily: fonts.semibold, fontSize: font.tiny, color: colors.textMuted },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
  },
  segmentItem: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radius.sm },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { fontFamily: fonts.bold, fontSize: font.small, color: colors.text },
  map: { height: 300, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.primarySoft, ...shadow.card },
});
