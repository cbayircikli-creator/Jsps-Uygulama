import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen, SectionTitle, text, type IconName } from '../../components/ui';
import { categories, documentsIn } from '../../data/documents';
import { colors, font, fonts, paletteColor, radius, shadow, spacing } from '../../theme';

const extras: { title: string; text: string; icon: IconName; href: Href }[] = [
  { title: 'Asistan', text: 'Bir kavram sor, özetlerden ve sorulardan cevap bulsun', icon: 'sparkles', href: '/asistan' },
  { title: 'Konu Özetleri', text: 'Sayılar, süreler ve karıştırılanlar', icon: 'reader', href: '/ozetler' },
  { title: 'Soru Ara', text: 'Soru bankasında kelimeyle ara', icon: 'search', href: '/ara' },
];

export default function Araclar() {
  return (
    <Screen>
      <Pressable onPress={() => router.push('/konum')} style={({ pressed }) => [pressed && styles.pressed]}>
        <LinearGradient colors={['#062B4A', '#0B5C7A', '#0E95A6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Ionicons name="compass" size={120} color="rgba(255,255,255,0.10)" style={styles.heroGhost} />
          <View style={styles.heroIcon}>
            <Ionicons name="navigate" size={26} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>Pusula ve Konum</Text>
          <Text style={styles.heroText}>Yön, koordinat (ondalık, derece-dakika-saniye, UTM, MGRS), rakım ve uydu haritası</Text>
          <View style={styles.heroCta}>
            <Text style={styles.heroCtaText}>Aç</Text>
            <Ionicons name="arrow-forward" size={16} color="#062B4A" />
          </View>
        </LinearGradient>
      </Pressable>

      <SectionTitle>Belge Örnekleri</SectionTitle>
      <Text style={text.muted}>Alanları doldur, belge hazır olsun; kopyala veya paylaş.</Text>
      {categories.map((c, i) => {
        const col = paletteColor(i);
        return (
          <Pressable
            key={c.id}
            onPress={() => router.push({ pathname: '/belgeler/[tur]', params: { tur: c.id } })}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <LinearGradient colors={col.gradient} style={styles.rowIcon}>
              <Ionicons name={c.icon} size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={text.heading}>{c.title}</Text>
              <Text style={text.muted}>{c.summary}</Text>
            </View>
            <View style={[styles.count, { backgroundColor: col.soft }]}>
              <Text style={[styles.countText, { color: col.main }]}>{documentsIn(c.id).length}</Text>
            </View>
          </Pressable>
        );
      })}

      <SectionTitle>Çalışma araçları</SectionTitle>
      {extras.map((e) => (
        <Pressable key={e.title} onPress={() => router.push(e.href)} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
          <View style={styles.plainIcon}>
            <Ionicons name={e.icon} size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={text.heading}>{e.title}</Text>
            <Text style={text.muted}>{e.text}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  hero: { borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm, overflow: 'hidden', ...shadow.raised },
  heroGhost: { position: 'absolute', right: -20, top: -10 },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { color: '#fff', fontFamily: fonts.display, fontSize: 30, lineHeight: 34 },
  heroText: { color: 'rgba(255,255,255,0.85)', fontFamily: fonts.medium, fontSize: font.small, lineHeight: 19 },
  heroCta: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  heroCtaText: { color: '#062B4A', fontFamily: fonts.bold },
  row: {
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
  rowIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  plainIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: { minWidth: 32, alignItems: 'center', borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  countText: { fontFamily: fonts.display, fontSize: 18 },
});
