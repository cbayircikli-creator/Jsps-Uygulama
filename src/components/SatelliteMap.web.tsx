// Web'de harita bileşeni yok; koordinatı Google Haritalar'da açan bir kart gösterilir.
import Ionicons from '@expo/vector-icons/Ionicons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing } from '../theme';

export type MapKind = 'satellite' | 'hybrid' | 'standard';

export function SatelliteMap({ lat, lon, kind }: { lat: number; lon: number; kind: MapKind }) {
  const url = `https://www.google.com/maps/@?api=1&map_action=map&center=${lat},${lon}&zoom=18&basemap=${kind === 'standard' ? 'roadmap' : 'satellite'}`;
  return (
    <View style={styles.wrap}>
      <Ionicons name="earth" size={40} color={colors.textOnDark} />
      <Text style={styles.text}>Uydu haritası telefon uygulamasında görünür.</Text>
      <Pressable onPress={() => Linking.openURL(url)} style={styles.btn}>
        <Text style={styles.btnText}>Google Haritalar&apos;da aç</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#0B3B4F',
    padding: spacing.lg,
  },
  text: { color: colors.textOnDark, fontFamily: fonts.semibold, textAlign: 'center' },
  btn: { backgroundColor: '#fff', borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  btnText: { color: '#0B3B4F', fontFamily: fonts.bold },
});
