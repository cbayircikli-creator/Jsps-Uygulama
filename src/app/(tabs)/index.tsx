import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, SectionTitle, Tag, text, type IconName } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';
import { useProgress, useProgressStats, type ExamMode } from '../../context/ProgressContext';
import { content } from '../../services/content';
import { newQuickQuizId } from '../../services/quickQuiz';
import { colors, font, fonts, gradients, radius, shadow, spacing } from '../../theme';

type Tint = keyof typeof colors.tint;

const modules: { title: string; icon: IconName; href: Href; tint: Tint }[] = [
  { title: 'Mevzuat', icon: 'book', href: '/mevzuat', tint: 'green' },
  { title: 'Denemeler', icon: 'document-text', href: '/calis', tint: 'brass' },
  { title: 'Emsal Kararlar', icon: 'hammer', href: '/kararlar', tint: 'slate' },
  { title: 'Bilgi Kartları', icon: 'albums', href: '/calis', tint: 'clay' },
  { title: 'Duyurular', icon: 'megaphone', href: '/duyurular', tint: 'sky' },
  { title: 'Yapay Zekâ', icon: 'sparkles', href: '/asistan', tint: 'plum' },
];

const DAY_LETTERS = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];

const MODE_LABEL: Record<ExamMode, string> = { sinav: 'Sınav modu', calisma: 'Çalışma modu', yanlis: 'Yanlışlarım' };

function greeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return 'Günaydın';
  if (h >= 11 && h < 17) return 'İyi günler';
  if (h >= 17 && h < 22) return 'İyi akşamlar';
  return 'İyi geceler';
}

export default function Home() {
  const insets = useSafeAreaInsets();
  const { rank } = useProfile();
  const { drafts, examDate } = useProgress();
  const daysLeft = examDate
    ? Math.ceil((new Date(`${examDate}T00:00:00`).getTime() - new Date(new Date().toDateString()).getTime()) / 86400000)
    : null;
  const stats = useProgressStats();
  const latest = content.announcements().slice(0, 2);
  const goalPct = Math.min(1, stats.today / stats.dailyGoal);
  const weekMax = Math.max(stats.dailyGoal, ...stats.week.map((d) => d.count));

  // En son dokunulan yarım deneme
  const resume = Object.entries(drafts)
    .sort(([, a], [, b]) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
    .map(([key, draft]) => {
      const cut = key.lastIndexOf(':');
      const exam = content.examById(key.slice(0, cut));
      return exam && { exam, mode: key.slice(cut + 1) as ExamMode, answered: Object.keys(draft.answers).length };
    })
    .find(Boolean);

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}
      >
        {/* Rütbe şeridi motifi */}
        <View style={styles.chevrons} pointerEvents="none">
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.chevron, { top: i * 26 }]} />
          ))}
        </View>

        <View style={styles.topRow}>
          <Text style={styles.eyebrow}>JSPS · SINAV HAZIRLIK</Text>
          {daysLeft !== null && daysLeft >= 0 && (
            <View style={styles.countdown}>
              <Ionicons name="calendar" size={12} color={colors.primaryDark} />
              <Text style={styles.countdownText}>{daysLeft === 0 ? 'Sınav bugün!' : `Sınava ${daysLeft} gün`}</Text>
            </View>
          )}
        </View>
        <Text style={styles.greeting}>{greeting()}</Text>
        <Text style={styles.heroSub}>
          {rank ? `${rank.name} · bugün de bir adım öne geç.` : 'Bugün de bir adım öne geç.'}
        </Text>

        <View style={styles.goalCard}>
          <View style={styles.goalRow}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.goalLabel}>GÜNLÜK HEDEF</Text>
              <Text style={styles.goalValue}>
                {stats.today}
                <Text style={styles.goalOf}> / {stats.dailyGoal} soru</Text>
              </Text>
            </View>
            <View style={styles.streak}>
              <Ionicons name="flame" size={20} color={stats.streak ? colors.accentBright : colors.textOnDarkMuted} />
              <Text style={styles.streakValue}>{stats.streak}</Text>
              <Text style={styles.streakLabel}>gün seri</Text>
            </View>
          </View>
          <View style={styles.goalTrack}>
            <View style={[styles.goalFill, { width: `${goalPct * 100}%` }]} />
          </View>
          <Text style={styles.goalNote}>
            {goalPct >= 1
              ? 'Bugünkü hedef tamam. Tebrikler!'
              : stats.today === 0
                ? 'Bugün henüz soru çözmedin.'
                : `Hedefe ${stats.dailyGoal - stats.today} soru kaldı.`}
          </Text>

          <View style={styles.week}>
            {stats.week.map((d, i) => {
              const isToday = i === stats.week.length - 1;
              return (
                <View key={i} style={styles.weekCol}>
                  <View style={styles.weekBarTrack}>
                    <View
                      style={[
                        styles.weekBar,
                        { height: `${Math.max(d.count ? 8 : 0, (d.count / weekMax) * 100)}%` },
                        d.count >= stats.dailyGoal && { backgroundColor: colors.accentBright },
                      ]}
                    />
                  </View>
                  <Text style={[styles.weekDay, isToday && { color: colors.accentBright }]}>
                    {DAY_LETTERS[d.day.getDay()]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        {resume && (
          <Pressable
            onPress={() => router.push({ pathname: '/deneme/[id]', params: { id: resume.exam.id, mod: resume.mode } })}
            style={({ pressed }) => [styles.resume, pressed && styles.pressed]}
          >
            <View style={styles.resumeIcon}>
              <Ionicons name="play" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.resumeEyebrow}>KALDIĞIN YERDEN DEVAM ET</Text>
              <Text style={text.heading} numberOfLines={1}>
                {resume.exam.title}
              </Text>
              <View style={styles.resumeTrack}>
                <View
                  style={[styles.resumeFill, { width: `${(resume.answered / resume.exam.questions.length) * 100}%` }]}
                />
              </View>
              <Text style={text.muted}>
                {MODE_LABEL[resume.mode]} · {resume.answered}/{resume.exam.questions.length} cevaplandı
              </Text>
            </View>
          </Pressable>
        )}

        <View style={styles.quickRow}>
          <Pressable
            onPress={() => router.push({ pathname: '/deneme/[id]', params: { id: newQuickQuizId(), mod: 'calisma' } })}
            style={({ pressed }) => [styles.quick, styles.quickDark, pressed && styles.pressed]}
          >
            <Ionicons name="shuffle" size={22} color={colors.accentBright} />
            <Text style={styles.quickTitleLight}>Karışık 20 Soru</Text>
            <Text style={styles.quickSubLight}>Tüm denemelerden, anında açıklamalı</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/mevzuat')}
            style={({ pressed }) => [styles.quick, pressed && styles.pressed]}
          >
            <Ionicons name="library" size={22} color={colors.primary} />
            <Text style={styles.quickTitle}>Kanuna Göre Çalış</Text>
            <Text style={styles.quickSub}>Madde madde soru çöz</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <Stat value={String(stats.examsTaken)} label="Deneme" />
          <Stat value={stats.successRate === null ? '–' : `%${stats.successRate}`} label="Başarı" />
          <Stat value={String(stats.cardsKnown)} label="Öğrenilen kart" />
        </View>

        <SectionTitle>Modüller</SectionTitle>
        <View style={styles.grid}>
          {modules.map((m) => (
            <Pressable
              key={m.title}
              onPress={() => router.push(m.href)}
              style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
            >
              <View style={[styles.tileIcon, { backgroundColor: colors.tint[m.tint] }]}>
                <Ionicons name={m.icon} size={22} color={colors.tintInk[m.tint]} />
              </View>
              <Text style={styles.tileText}>{m.title}</Text>
            </Pressable>
          ))}
        </View>

        <SectionTitle
          action={
            <Pressable onPress={() => router.push('/duyurular')} hitSlop={8}>
              <Text style={styles.link}>Tümü</Text>
            </Pressable>
          }
        >
          Güncel Duyurular
        </SectionTitle>
        {latest.map((a) => (
          <Card key={a.id} onPress={() => router.push(`/duyurular/${a.id}`)}>
            {a.important && <Tag label="Önemli" tone="accent" />}
            <Text style={text.heading}>{a.title}</Text>
            <Text style={text.muted}>{a.date}</Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },

  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    overflow: 'hidden',
    gap: spacing.xs,
  },
  chevrons: { position: 'absolute', right: -30, top: 28, width: 170, height: 120, opacity: 0.12 },
  chevron: {
    position: 'absolute',
    left: 30,
    width: 110,
    height: 110,
    borderTopWidth: 10,
    borderLeftWidth: 10,
    borderColor: colors.accentBright,
    transform: [{ rotate: '45deg' }],
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accentBright,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  countdownText: { color: colors.primaryDark, fontFamily: fonts.heavy, fontSize: font.tiny },
  eyebrow: { color: colors.accentBright, fontFamily: fonts.bold, fontSize: font.tiny, letterSpacing: 2 },
  greeting: { color: '#fff', fontFamily: fonts.display, fontSize: 38, lineHeight: 42, letterSpacing: 0.3 },
  heroSub: { color: colors.textOnDarkMuted, fontFamily: fonts.medium, fontSize: font.body },

  goalCard: {
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  goalLabel: { color: colors.textOnDarkMuted, fontFamily: fonts.bold, fontSize: font.tiny, letterSpacing: 1.5 },
  goalValue: { color: '#fff', fontFamily: fonts.display, fontSize: 34, lineHeight: 38 },
  goalOf: { color: colors.textOnDarkMuted, fontFamily: fonts.displayMedium, fontSize: 20 },
  streak: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 76,
  },
  streakValue: { color: '#fff', fontFamily: fonts.display, fontSize: 24, lineHeight: 26 },
  streakLabel: { color: colors.textOnDarkMuted, fontFamily: fonts.semibold, fontSize: font.tiny },
  goalTrack: { height: 8, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden' },
  goalFill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.accentBright },
  goalNote: { color: colors.textOnDark, fontFamily: fonts.medium, fontSize: font.small },
  week: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  weekCol: { flex: 1, alignItems: 'center', gap: 4 },
  weekBarTrack: {
    width: '100%',
    height: 36,
    justifyContent: 'flex-end',
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  weekBar: { width: '100%', borderRadius: 6, backgroundColor: 'rgba(226,190,98,0.55)' },
  weekDay: { color: colors.textOnDarkMuted, fontFamily: fonts.semibold, fontSize: 10 },

  body: { padding: spacing.lg, gap: spacing.md },

  resume: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.card,
  },
  resumeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeEyebrow: { color: colors.accent, fontFamily: fonts.bold, fontSize: 10, letterSpacing: 1.5 },
  resumeTrack: { height: 6, borderRadius: radius.pill, backgroundColor: colors.primarySoft, overflow: 'hidden' },
  resumeFill: { height: '100%', backgroundColor: colors.primary },

  quickRow: { flexDirection: 'row', gap: spacing.md },
  quick: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
    ...shadow.card,
  },
  quickDark: { backgroundColor: colors.primary, borderColor: colors.primary, ...shadow.raised },
  quickTitle: { color: colors.text, fontFamily: fonts.display, fontSize: 21, marginTop: spacing.xs },
  quickTitleLight: { color: '#fff', fontFamily: fonts.display, fontSize: 21, marginTop: spacing.xs },
  quickSub: { color: colors.textMuted, fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
  quickSubLight: { color: colors.textOnDarkMuted, fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },

  statsRow: { flexDirection: 'row', gap: spacing.sm },
  stat: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statValue: { color: colors.primary, fontFamily: fonts.display, fontSize: 26, lineHeight: 30 },
  statLabel: { color: colors.textMuted, fontFamily: fonts.semibold, fontSize: font.tiny },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: {
    flexBasis: '30%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadow.card,
  },
  tileIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tileText: { fontSize: 12.5, fontFamily: fonts.bold, color: colors.text, textAlign: 'center' },
  link: { color: colors.primary, fontFamily: fonts.bold },
});
