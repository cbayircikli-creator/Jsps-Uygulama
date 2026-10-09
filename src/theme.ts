// Görsel kimlik: canlı zümrüt yeşili ve altın; her dersin kendi rengi var.
export const colors = {
  primary: '#0B6B47',
  primaryDark: '#053A27',
  primaryMid: '#10935F',
  primaryBright: '#19B877',
  primarySoft: '#DDF3E8',
  accent: '#E8A417',
  accentBright: '#FFC93C',
  accentSoft: '#FFF1CC',
  background: '#EEF5F1',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F9F6',
  text: '#0F1F17',
  textMuted: '#55685D',
  textOnDark: '#EAF7F0',
  textOnDarkMuted: '#A8D3BE',
  border: '#D5E4DA',
  success: '#12A15E',
  successSoft: '#DCF5E7',
  danger: '#E0413A',
  dangerSoft: '#FDE6E4',
  // Modül kutucuklarının ikon zeminleri
  tint: {
    green: '#D8F3E6',
    brass: '#FFEFC7',
    slate: '#DCE4FB',
    clay: '#FFE0D6',
    sky: '#D3F1F6',
    plum: '#EEDFFB',
  },
  tintInk: {
    green: '#0B7A4F',
    brass: '#A86B00',
    slate: '#3446C4',
    clay: '#C2410C',
    sky: '#0E7C8C',
    plum: '#7A3CC7',
  },
};

/** Her dersin rengi: etiketlerde, sonuç çubuklarında ve konu testlerinde kullanılır. */
export const subjectColors: Record<string, { main: string; soft: string; gradient: [string, string] }> = {
  Türkçe: { main: '#E5533D', soft: '#FDE5DF', gradient: ['#F0714F', '#D9402E'] },
  Tarih: { main: '#D98A00', soft: '#FFF0CF', gradient: ['#F5AE1E', '#D27D00'] },
  Anayasa: { main: '#3F51D9', soft: '#E1E5FC', gradient: ['#5B6CF0', '#3341C2'] },
  Güncel: { main: '#0E95A6', soft: '#D6F2F5', gradient: ['#1DB3C4', '#0B7F8E'] },
  Muhakeme: { main: '#8B45E0', soft: '#EFE2FC', gradient: ['#A463F2', '#7634CC'] },
  Mevzuat: { main: '#0B8A56', soft: '#D8F3E6', gradient: ['#17B072', '#0A6E46'] },
};

export const subjectColor = (subject: string) => subjectColors[subject] ?? subjectColors.Mevzuat;

export const gradients = {
  header: [colors.primaryDark, colors.primary] as const,
  hero: ['#04301F', '#0B6B47', '#13A067'] as const,
  gold: ['#FFD36B', '#E8A417'] as const,
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
  card: { boxShadow: '0px 1px 2px rgba(5, 58, 39, 0.06), 0px 6px 16px rgba(5, 58, 39, 0.06)' },
  raised: { boxShadow: '0px 10px 24px rgba(11, 107, 71, 0.28)' },
};

// Deneme ve deste kartlarında sırayla kullanılan renkler
const PALETTE = ['Anayasa', 'Güncel', 'Muhakeme', 'Türkçe', 'Tarih', 'Mevzuat'];
export const paletteColor = (index: number) => subjectColor(PALETTE[index % PALETTE.length]);
