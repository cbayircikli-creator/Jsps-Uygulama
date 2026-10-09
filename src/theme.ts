// Görsel kimlik: Jandarma orman yeşili, pirinç (madalya/rütbe) vurgusu, açık adaçayı zemin.
export const colors = {
  primary: '#1D3B2A',
  primaryDark: '#10241A',
  primaryMid: '#2D5A41',
  primarySoft: '#E2EBE2',
  accent: '#C49A3A',
  accentBright: '#E2BE62',
  accentSoft: '#F6ECD2',
  background: '#ECEFE7',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F7F2',
  text: '#16211A',
  textMuted: '#5C6A60',
  textOnDark: '#E8EFE6',
  textOnDarkMuted: '#A9BCAE',
  border: '#DAE0D4',
  success: '#2E7D4F',
  successSoft: '#E1F1E6',
  danger: '#B3261E',
  dangerSoft: '#FBE9E7',
  // Modül kutucuklarının ikon zeminleri
  tint: {
    green: '#E2EBE2',
    brass: '#F6ECD2',
    slate: '#E3E8EE',
    clay: '#F4E4DC',
    sky: '#DFEDF2',
    plum: '#ECE4F0',
  },
  tintInk: {
    green: '#1D3B2A',
    brass: '#8A6516',
    slate: '#34465A',
    clay: '#8A3F22',
    sky: '#1E5A6E',
    plum: '#5B3A6E',
  },
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 12, lg: 18, xl: 24, pill: 999 };

export const font = {
  display: 30,
  title: 26,
  heading: 17,
  body: 15,
  small: 13,
  tiny: 11,
};

// Yazı tipleri _layout.tsx içinde yüklenir. Özel yazı tiplerinde kalınlık fontWeight ile değil,
// ayrı dosya ile verilir; aksi hâlde Android yanlış yüzü seçer.
export const fonts = {
  display: 'BarlowCondensed_700Bold',
  displayMedium: 'BarlowCondensed_600SemiBold',
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  heavy: 'Manrope_800ExtraBold',
};

export const shadow = {
  card: { boxShadow: '0px 1px 2px rgba(16, 36, 26, 0.06), 0px 4px 14px rgba(16, 36, 26, 0.05)' },
  raised: { boxShadow: '0px 8px 24px rgba(16, 36, 26, 0.18)' },
};
