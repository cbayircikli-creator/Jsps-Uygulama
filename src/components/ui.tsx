import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type ViewStyle } from 'react-native';

import { colors, font, fonts, gradients, radius, shadow, spacing, subjectColor } from '../theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  if (!scroll) return <View style={styles.screen}>{children}</View>;
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      {children}
    </ScrollView>
  );
}

export function Card({
  children,
  onPress,
  style,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}>
      {children}
    </Pressable>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {action}
    </View>
  );
}

export function Tag({ label, tone = 'default' }: { label: string; tone?: 'default' | 'accent' | 'danger' }) {
  const bg = tone === 'accent' ? colors.accentSoft : tone === 'danger' ? colors.dangerSoft : colors.primarySoft;
  const fg = tone === 'danger' ? colors.danger : colors.primaryDark;
  return (
    <View style={[styles.tag, { backgroundColor: bg }]}>
      <Text style={[styles.tagText, { color: fg }]}>{label}</Text>
    </View>
  );
}

/** Ders adına göre renkli etiket, ör. "Anayasa" mavi, "Tarih" kehribar */
export function SubjectTag({ subject, detail }: { subject: string; detail?: string }) {
  const c = subjectColor(subject);
  return (
    <View style={[styles.tag, styles.subjectTag, { backgroundColor: c.soft }]}>
      <View style={[styles.dot, { backgroundColor: c.main }]} />
      <Text style={[styles.tagText, { color: c.main }]} numberOfLines={1}>
        {detail ? `${subject} · ${detail}` : subject}
      </Text>
    </View>
  );
}

/** Üst başlıkların renk geçişli zemini (Stack/Tabs `headerBackground`) */
export function HeaderBackground() {
  return <LinearGradient colors={gradients.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }} />;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.search}>
      <Ionicons name="search" size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.searchInput}
        autoCorrect={false}
      />
    </View>
  );
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
}) {
  const outline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        outline && styles.buttonOutline,
        (pressed || disabled) && styles.pressed,
      ]}
    >
      <Text style={[styles.buttonText, outline && { color: colors.primary }]}>{title}</Text>
    </Pressable>
  );
}

/** Henüz içeriği hazırlanan bölümler için tanıtım ekranı */
export function ComingSoon({
  icon,
  title,
  text: body,
  action,
}: {
  icon: IconName;
  title: string;
  text: string;
  action?: { title: string; onPress: () => void };
}) {
  return (
    <View style={styles.soon}>
      <View style={styles.soonIcon}>
        <Ionicons name={icon} size={40} color={colors.primary} />
      </View>
      <View style={styles.soonBadge}>
        <Text style={styles.soonBadgeText}>HAZIRLANIYOR</Text>
      </View>
      <Text style={[text.title, { textAlign: 'center' }]}>{title}</Text>
      <Text style={[text.body, { textAlign: 'center', color: colors.textMuted }]}>{body}</Text>
      {action && (
        <View style={{ alignSelf: 'stretch' }}>
          <Button title={action.title} onPress={action.onPress} />
        </View>
      )}
    </View>
  );
}

export function EmptyState({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.empty}>
      <Ionicons name={icon} size={36} color={colors.textMuted} />
      <Text style={styles.muted}>{text}</Text>
    </View>
  );
}

export const text = StyleSheet.create({
  title: { fontSize: font.title, fontFamily: fonts.display, color: colors.text, letterSpacing: 0.2, lineHeight: 30 },
  heading: { fontSize: font.heading, fontFamily: fonts.bold, color: colors.text, lineHeight: 23 },
  body: { fontSize: font.body, fontFamily: fonts.regular, color: colors.text, lineHeight: 23 },
  muted: { fontSize: font.small, fontFamily: fonts.medium, color: colors.textMuted, lineHeight: 19 },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  screenContent: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadow.card,
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.99 }] },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  sectionTitle: { fontSize: 22, fontFamily: fonts.display, color: colors.text, letterSpacing: 0.3 },
  tag: { alignSelf: 'flex-start', paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill },
  tagText: { fontSize: font.tiny, fontFamily: fonts.bold, letterSpacing: 0.2 },
  subjectTag: { flexDirection: 'row', alignItems: 'center', gap: 5, flexShrink: 1 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    ...shadow.card,
  },
  searchInput: { flex: 1, paddingVertical: spacing.md, fontSize: font.body, fontFamily: fonts.medium, color: colors.text },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md + 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  buttonOutline: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary },
  buttonText: { color: '#fff', fontSize: font.body, fontFamily: fonts.bold },
  empty: { alignItems: 'center', gap: spacing.sm, padding: spacing.xxl },
  soon: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xxl, paddingHorizontal: spacing.md },
  soonIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soonBadge: { backgroundColor: colors.accentSoft, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4 },
  soonBadgeText: { color: colors.tintInk.brass, fontFamily: fonts.bold, fontSize: font.tiny, letterSpacing: 1.5 },
  muted: { fontSize: font.small, fontFamily: fonts.medium, color: colors.textMuted, textAlign: 'center' },
});
