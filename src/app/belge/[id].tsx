import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card, EmptyState, Screen, SectionTitle, text } from '../../components/ui';
import { useProgress, type Officer } from '../../context/ProgressContext';
import { documentById, type DocField, type DocTemplate } from '../../data/documents';
import { colors, font, fonts, radius, shadow, spacing } from '../../theme';

const pad = (n: number) => String(n).padStart(2, '0');
const BLANK = '……………';
const mono = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

function autoValue(f: DocField, officer: Officer) {
  const now = new Date();
  switch (f.auto) {
    case 'date':
      return `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
    case 'time':
      return `${pad(now.getHours())}.${pad(now.getMinutes())}`;
    case 'officerName':
      return officer.name;
    case 'officerRank':
      return officer.rank;
    case 'officerUnit':
      return officer.unit;
    default:
      return '';
  }
}

export default function BelgeDuzenle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const doc = documentById(id);
  const { loaded } = useProgress();
  if (!doc) return <EmptyState icon="alert-circle-outline" text="Belge bulunamadı." />;
  // Kayıtlı görevli bilgileri okunmadan form kurulursa otomatik alanlar boş kalır.
  if (!loaded) return null;
  return <Editor key={doc.id} doc={doc} />;
}

function Editor({ doc }: { doc: DocTemplate }) {
  const { officer, setOfficer } = useProgress();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(doc.fields.map((f) => [f.key, autoValue(f, officer)])),
  );
  const [status, setStatus] = useState<string | null>(null);

  const output = useMemo(
    () => doc.body.replace(/{{(\w+)}}/g, (_, k: string) => values[k]?.trim() || BLANK),
    [doc, values],
  );

  const officerFields = doc.fields.filter((f) => f.auto?.startsWith('officer'));
  const flash = (msg: string) => {
    setStatus(msg);
    setTimeout(() => setStatus(null), 2500);
  };

  const copy = async () => {
    try {
      await Clipboard.setStringAsync(output);
      flash('Belge panoya kopyalandı.');
    } catch {
      flash('Kopyalanamadı; metni önizlemeden seçip kopyalayabilirsin.');
    }
  };

  const share = async () => {
    try {
      await Share.share({ title: doc.title, message: output });
    } catch {
      await copy();
    }
  };

  const rememberOfficer = () => {
    const pick = (auto: DocField['auto'], fallback: string) => {
      const f = doc.fields.find((x) => x.auto === auto);
      return f ? values[f.key]?.trim() ?? '' : fallback;
    };
    setOfficer({
      name: pick('officerName', officer.name),
      rank: pick('officerRank', officer.rank),
      unit: pick('officerUnit', officer.unit),
    });
    flash('Bilgilerin kaydedildi; sonraki belgelerde otomatik dolacak.');
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: doc.title }} />
      <Text style={text.muted}>{doc.summary}</Text>
      {doc.basis && (
        <View style={styles.basis}>
          <Ionicons name="library" size={16} color={colors.primary} />
          <Text style={styles.basisText}>{doc.basis}</Text>
        </View>
      )}

      <SectionTitle>Bilgiler</SectionTitle>
      <Card style={{ gap: spacing.md }}>
        {doc.fields.map((f) => (
          <View key={f.key} style={{ gap: 4 }}>
            <Text style={styles.label}>{f.label}</Text>
            <TextInput
              value={values[f.key]}
              onChangeText={(t) => setValues((v) => ({ ...v, [f.key]: t }))}
              placeholder={f.placeholder ?? ''}
              placeholderTextColor={colors.textMuted}
              multiline={f.multiline}
              style={[styles.input, f.multiline && styles.inputMulti]}
              accessibilityLabel={f.label}
            />
          </View>
        ))}
        {officerFields.length > 0 && (
          <Pressable onPress={rememberOfficer} style={styles.remember} accessibilityRole="button">
            <Ionicons name="person-circle" size={18} color={colors.primary} />
            <Text style={styles.rememberText}>Ad, rütbe ve birlik bilgimi sonraki belgeler için hatırla</Text>
          </Pressable>
        )}
      </Card>

      <SectionTitle>Önizleme</SectionTitle>
      <View style={styles.paper}>
        <Text style={styles.paperText} selectable>
          {output}
        </Text>
      </View>

      {status && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text style={styles.toastText}>{status}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable onPress={copy} style={({ pressed }) => [styles.action, styles.primary, pressed && styles.pressed]}>
          <Ionicons name="copy" size={18} color="#fff" />
          <Text style={[styles.actionText, { color: '#fff' }]}>Kopyala</Text>
        </Pressable>
        <Pressable onPress={share} style={({ pressed }) => [styles.action, styles.outline, pressed && styles.pressed]}>
          <Ionicons name="share-social" size={18} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>Paylaş</Text>
        </Pressable>
      </View>

      {doc.notes && doc.notes.length > 0 && (
        <>
          <SectionTitle>Dikkat edilecekler</SectionTitle>
          {doc.notes.map((n) => (
            <View key={n} style={styles.noteRow}>
              <Ionicons name="alert-circle" size={18} color={colors.accent} />
              <Text style={[text.body, { flex: 1 }]}>{n}</Text>
            </View>
          ))}
        </>
      )}
      <Text style={[text.muted, { textAlign: 'center' }]}>
        Biçim örneğidir; birliğinizin resmî formu ve güncel mevzuat esas alınmalıdır.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  basis: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  basisText: { flex: 1, fontFamily: fonts.semibold, fontSize: font.small, color: colors.primary, lineHeight: 18 },
  label: { fontFamily: fonts.bold, fontSize: font.small, color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.medium,
    fontSize: font.body,
    color: colors.text,
    backgroundColor: colors.surfaceAlt,
  },
  inputMulti: { minHeight: 84, textAlignVertical: 'top' },
  remember: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xs },
  rememberText: { flex: 1, fontFamily: fonts.bold, fontSize: font.small, color: colors.primary },
  paper: {
    backgroundColor: '#FFFEFA',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.card,
  },
  paperText: { fontFamily: mono, fontSize: 12.5, lineHeight: 19, color: colors.text },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.successSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  toastText: { flex: 1, fontFamily: fonts.semibold, fontSize: font.small, color: colors.text },
  actions: { flexDirection: 'row', gap: spacing.md },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.md,
  },
  primary: { backgroundColor: colors.primary },
  outline: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary },
  actionText: { fontFamily: fonts.bold, fontSize: font.body },
  pressed: { opacity: 0.8 },
  noteRow: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
});
