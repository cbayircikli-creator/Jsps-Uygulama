import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, EmptyState, Screen, SectionTitle, text, type IconName } from '../components/ui';
import { useProgress, useProgressStats } from '../context/ProgressContext';
import { SUBJECTS } from '../services/topicTests';
import { colors, font, fonts, radius, shadow, spacing, SUBJECT_ORDER, subjectColor } from '../theme';

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const dayLabel = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;

const CHART_H = 140;

export default function Istatistik() {
  const stats = useProgressStats();
  const { wrongQuestions, savedQuestions } = useProgress();
  // Grafikte dokunulan gün; varsayılan bugün
  const [selected, setSelected] = useState(stats.month.length - 1);

  const wrongTotal = Object.values(wrongQuestions).reduce((s, ids) => s + ids.length, 0);
  const max = Math.max(stats.dailyGoal, ...stats.month.map((d) => d.count));
  const sel = stats.month[selected];
  const monthTotal = stats.month.reduce((s, d) => s + d.count, 0);
  const goalDays = stats.month.filter((d) => d.count >= stats.dailyGoal).length;

  const subjects = SUBJECT_ORDER.filter((s) => stats.bySubject[s]?.total).map((s) => {
    const sc = stats.bySubject[s];
    return { name: s, ...sc, pct: Math.round((sc.correct / sc.total) * 100) };
  });
  // En az 10 soru çözülmüş derslerden en düşük başarılı olanı öneri olarak göster
  const weakest = subjects.filter((s) => s.total >= 10).sort((a, b) => a.pct - b.pct)[0];
  const weakestKey = weakest && SUBJECTS.find((s) => s.name === weakest.name)?.key;

  if (stats.totalAnswered === 0 && stats.examsTaken === 0) {
    return (
      <Screen>
        <EmptyState icon="stats-chart-outline" text="Henüz soru çözmedin. İlk testini çözdüğünde gelişimin burada görünecek." />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.tiles}>
        <Tile icon="create" value={String(stats.totalAnswered)} label="Çözülen soru" />
        <Tile icon="checkmark-done" value={stats.successRate === null ? '–' : `%${stats.successRate}`} label="Doğruluk" />
        <Tile icon="flame" value={`${stats.streak} gün`} label={`Seri · en iyi ${stats.bestStreak}`} />
        <Tile icon="document-text" value={String(stats.examsTaken)} label="Biten test" />
      </View>

      <SectionTitle>Son 30 gün</SectionTitle>
      <Card style={{ gap: spacing.md }}>
        <View style={styles.chartHead}>
          <View>
            <Text style={styles.selValue}>{sel.count} soru</Text>
            <Text style={text.muted}>{selected === stats.month.length - 1 ? 'Bugün' : dayLabel(sel.day)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.selValue}>{monthTotal}</Text>
            <Text style={text.muted}>
              toplam · {goalDays} gün hedef tuttu
            </Text>
          </View>
        </View>

        <View
          style={styles.chart}
          accessible
          accessibilityLabel={`Son 30 günde toplam ${monthTotal} soru çözüldü, ${goalDays} gün hedef tutturuldu.`}
        >
          {stats.month.map((d, i) => {
            const h = d.count ? Math.max(4, (d.count / max) * CHART_H) : 0;
            const active = i === selected;
            return (
              <Pressable
                key={i}
                onPress={() => setSelected(i)}
                style={styles.barHit}
                accessibilityLabel={`${dayLabel(d.day)}: ${d.count} soru`}
              >
                <View
                  style={[
                    styles.bar,
                    { height: h, backgroundColor: d.count >= stats.dailyGoal ? colors.primary : colors.primaryBright },
                    active && styles.barActive,
                  ]}
                />
              </Pressable>
            );
          })}
          {/* Günlük hedef çizgisi, çubukların üstünde */}
          <View pointerEvents="none" style={[styles.goalLine, { bottom: (stats.dailyGoal / max) * CHART_H }]}>
            <Text style={styles.goalLabel}>Hedef {stats.dailyGoal}</Text>
          </View>
        </View>
        <View style={styles.axis}>
          {[0, 10, 20, 29].map((i) => (
            <Text key={i} style={styles.axisText}>
              {dayLabel(stats.month[i].day)}
            </Text>
          ))}
        </View>
        <View style={styles.legend}>
          <LegendDot color={colors.primary} label="Hedef tuttu" />
          <LegendDot color={colors.primaryBright} label="Hedefin altında" />
        </View>
      </Card>

      {subjects.length > 0 && (
        <>
          <SectionTitle>Derslere göre doğruluk</SectionTitle>
          <Card style={{ gap: spacing.md }}>
            {subjects.map((s) => {
              const c = subjectColor(s.name);
              return (
                <View key={s.name} style={{ gap: 6 }}>
                  <View style={styles.rowBetween}>
                    <View style={styles.rowStart}>
                      <View style={[styles.swatch, { backgroundColor: c.main }]} />
                      <Text style={styles.subjectName}>{s.name}</Text>
                    </View>
                    <Text style={styles.subjectValue}>
                      %{s.pct} <Text style={text.muted}>· {s.correct}/{s.total}</Text>
                    </Text>
                  </View>
                  <View style={[styles.track, { backgroundColor: c.soft }]}>
                    <View style={[styles.fill, { width: `${s.pct}%`, backgroundColor: c.main }]} />
                  </View>
                </View>
              );
            })}
          </Card>
        </>
      )}

      {weakest && weakestKey && (
        <Pressable
          onPress={() => router.push({ pathname: '/konu/[ders]', params: { ders: weakestKey } })}
          style={({ pressed }) => [styles.tip, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="bulb" size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={text.heading}>Önerimiz: {weakest.name}</Text>
            <Text style={text.muted}>
              Bu derste başarın %{weakest.pct}. Birkaç konu testi çözmek ortalamanı hızla yükseltir.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
      )}

      <SectionTitle>Tekrar listen</SectionTitle>
      <View style={styles.tiles}>
        <Tile icon="close-circle" value={String(wrongTotal)} label="Tekrar bekleyen yanlış" />
        <Tile icon="bookmark" value={String(savedQuestions.length)} label="İşaretli soru" />
        <Tile icon="albums" value={String(stats.cardsKnown)} label="Öğrenilen kart" />
        <Tile icon="calendar" value={String(stats.activeDays)} label="Çalışılan gün" />
      </View>
    </Screen>
  );
}

function Tile({ icon, value, label }: { icon: IconName; value: string; label: string }) {
  return (
    <View style={styles.tile}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.rowStart}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <Text style={text.muted}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tile: {
    width: '48.5%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: 2,
    ...shadow.card,
  },
  tileValue: { fontFamily: fonts.display, fontSize: 30, lineHeight: 34, color: colors.text, marginTop: spacing.xs },
  tileLabel: { fontFamily: fonts.semibold, fontSize: 12, color: colors.textMuted },

  chartHead: { flexDirection: 'row', justifyContent: 'space-between' },
  selValue: { fontFamily: fonts.display, fontSize: 24, color: colors.text, fontVariant: ['tabular-nums'] },
  chart: {
    height: CHART_H,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderTopColor: colors.accent,
    zIndex: 1,
  },
  goalLabel: {
    position: 'absolute',
    right: 0,
    top: -18,
    borderRadius: 4,
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.textMuted,
    backgroundColor: colors.surface,
    paddingHorizontal: 4,
  },
  // Dokunma alanı çubuktan geniş; çubuklar arasında 2 px boşluk kalır
  barHit: { flex: 1, height: '100%', justifyContent: 'flex-end', paddingHorizontal: 1 },
  bar: { width: '100%', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barActive: { backgroundColor: colors.accent },
  axis: { flexDirection: 'row', justifyContent: 'space-between' },
  axisText: { fontFamily: fonts.medium, fontSize: 11, color: colors.textMuted },
  legend: { flexDirection: 'row', gap: spacing.lg },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowStart: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 10, height: 10, borderRadius: 3 },
  subjectName: { fontFamily: fonts.bold, fontSize: font.body, color: colors.text },
  subjectValue: { fontFamily: fonts.bold, fontSize: font.body, color: colors.text },
  track: { height: 8, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },

  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
});
