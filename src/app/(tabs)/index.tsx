import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card, Screen, SectionTitle, Tag, text, type IconName } from '../../components/ui';
import { useProfile } from '../../context/ProfileContext';
import { useProgressStats } from '../../context/ProgressContext';
import { content } from '../../services/content';
import { colors, font, radius, spacing } from '../../theme';

const modules: { title: string; icon: IconName; href: Href }[] = [
  { title: 'Mevzuat', icon: 'book-outline', href: '/mevzuat' },
  { title: 'Denemeler', icon: 'document-text-outline', href: '/calis' },
  { title: 'Emsal Kararlar', icon: 'hammer-outline', href: '/kararlar' },
  { title: 'Bilgi Kartları', icon: 'albums-outline', href: '/calis' },
  { title: 'Duyurular', icon: 'megaphone-outline', href: '/duyurular' },
  { title: 'Yapay Zekâ', icon: 'sparkles-outline', href: '/asistan' },
];

export default function Home() {
  const { rank } = useProfile();
  const stats = useProgressStats();
  const latest = content.announcements().slice(0, 3);

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Hoş geldiniz</Text>
        <Text style={styles.heroSub}>
          {rank ? `${rank.name} için içerikler hazır.` : 'Çalışmaya başlamak için Çalış sekmesine geçin.'}
        </Text>
        <View style={styles.stats}>
          <Stat value={String(stats.examsTaken)} label="Deneme" />
          <Stat value={stats.successRate === null ? '–' : `%${stats.successRate}`} label="Başarı" />
          <Stat value={String(stats.cardsKnown)} label="Öğrenilen kart" />
        </View>
      </View>

      <View style={styles.grid}>
        {modules.map((m) => (
          <Pressable
            key={m.title}
            onPress={() => router.push(m.href)}
            style={({ pressed }) => [styles.tile, pressed && { opacity: 0.6 }]}
          >
            <View style={styles.tileIcon}>
              <Ionicons name={m.icon} size={24} color={colors.primary} />
            </View>
            <Text style={styles.tileText}>{m.title}</Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle
        action={
          <Pressable onPress={() => router.push('/duyurular')}>
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
    </Screen>
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
  stats: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  stat: { flex: 1, backgroundColor: colors.primaryDark, borderRadius: radius.sm, padding: spacing.sm, alignItems: 'center' },
  statValue: { color: colors.accent, fontSize: font.heading, fontWeight: '700' },
  statLabel: { color: colors.primarySoft, fontSize: font.tiny },
  hero: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.xs },
  heroTitle: { color: '#fff', fontSize: font.title, fontWeight: '700' },
  heroSub: { color: colors.primarySoft, fontSize: font.body },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: {
    flexBasis: '30%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  tileIcon: { backgroundColor: colors.primarySoft, borderRadius: radius.pill, padding: spacing.md },
  tileText: { fontSize: font.small, fontWeight: '600', color: colors.text, textAlign: 'center' },
  link: { color: colors.primary, fontWeight: '600' },
});
