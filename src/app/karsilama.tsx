import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RankPicker } from '../components/RankPicker';
import { type IconName } from '../components/ui';
import { useProfile } from '../context/ProfileContext';
import { legislation } from '../data/legislation';
import { questionPool } from '../services/questionPool';
import { colors, font, fonts, gradients, radius, spacing } from '../theme';

const logo = require('../../assets/splash-icon.png');

type Slide = { icon?: IconName; title: string; text: string };

// Sayılar içerikten hesaplanır; içerik büyüdükçe metin de güncel kalır.
const slides: Slide[] = [
  {
    title: 'JSPS Hazırlık',
    text: 'Jandarma sınavlarına hazırlanmanın en düzenli yolu. Tamamen ücretsiz, internetsiz de çalışır.',
  },
  {
    icon: 'document-text',
    title: `${Math.floor(questionPool().length / 100) * 100}+ soru`,
    text: 'Hepsi 5 şıklı ve açıklamalı. Denemeler, konu testleri, karışık testler ve yanlışlarını tekrar çözme.',
  },
  {
    icon: 'library',
    title: 'Kanun kanun, madde madde',
    text: `${legislation.length} kanun ve yönetmelik. Her maddeden çıkan soruları ayrı çöz, resmî metni tek dokunuşla aç.`,
  },
  {
    icon: 'flame',
    title: 'Her gün bir adım',
    text: 'Günlük hedef, gün serisi, bilgi kartları ve sınav geri sayımı ile düzenli çalış.',
  },
];

export default function Karsilama() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { rank, completeOnboarding } = useProfile();
  const [page, setPage] = useState(0);
  const scroller = useRef<ScrollView>(null);
  const total = slides.length + 1; // son sayfa rütbe seçimi

  const goTo = (i: number) => {
    scroller.current?.scrollTo({ x: i * width, animated: true });
    setPage(i);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPage(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const finish = async () => {
    await completeOnboarding();
    router.replace('/');
  };

  const last = page === total - 1;

  return (
    <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.page}>
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.brand}>JSPS · SINAV HAZIRLIK</Text>
        {!last && (
          <Pressable onPress={() => goTo(total - 1)} hitSlop={10}>
            <Text style={styles.skip}>Atla</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        onScrollEndDrag={onScroll}
        scrollEventThrottle={16}
      >
        {slides.map((s, i) => (
          <View key={s.title} style={[styles.slide, { width }]}>
            {i === 0 ? (
              <Image source={logo} style={styles.logo} accessibilityIgnoresInvertColors />
            ) : (
              <View style={styles.iconCircle}>
                <Ionicons name={s.icon!} size={56} color={colors.accentBright} />
              </View>
            )}
            <Text style={styles.title}>{s.title}</Text>
            <Text style={styles.text}>{s.text}</Text>
          </View>
        ))}
        <ScrollView style={{ width }} contentContainerStyle={styles.rankSlide}>
          <Text style={styles.title}>Hangi sınava hazırlanıyorsun?</Text>
          <Text style={styles.text}>{"İçerikleri sana göre düzenleyelim. Sonra Profil'den değiştirebilirsin."}</Text>
          <RankPicker />
        </ScrollView>
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.dots}>
          {Array.from({ length: total }, (_, i) => (
            <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
          ))}
        </View>
        <Pressable
          onPress={last ? finish : () => goTo(page + 1)}
          disabled={last && !rank}
          style={({ pressed }) => [styles.cta, (pressed || (last && !rank)) && { opacity: 0.6 }]}
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>{last ? (rank ? 'Başla' : 'Önce seçim yap') : 'Devam'}</Text>
          <Ionicons name={last ? 'checkmark' : 'arrow-forward'} size={20} color={colors.primaryDark} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  brand: { color: colors.accentBright, fontFamily: fonts.bold, fontSize: font.tiny, letterSpacing: 2 },
  skip: { color: colors.textOnDark, fontFamily: fonts.bold, fontSize: font.body },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, gap: spacing.lg },
  logo: { width: 200, height: 200 },
  iconCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#fff', fontFamily: fonts.display, fontSize: 38, lineHeight: 42, textAlign: 'center' },
  text: {
    color: colors.textOnDarkMuted,
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 360,
  },
  rankSlide: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.lg },
  bottom: { paddingHorizontal: spacing.xl, gap: spacing.lg },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotActive: { width: 24, backgroundColor: colors.accentBright },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accentBright,
    borderRadius: radius.md,
    paddingVertical: spacing.md + 4,
  },
  ctaText: { color: colors.primaryDark, fontFamily: fonts.heavy, fontSize: 16 },
});
