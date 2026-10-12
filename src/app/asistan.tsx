import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useProfile } from '../context/ProfileContext';
import { askAssistant, isAiConnected, type ChatMessage } from '../services/ai';
import { colors, font, fonts, radius, shadow, spacing } from '../theme';

const SUGGESTIONS = [
  'Gözaltı süresi kaç saat?',
  'HAGB denetim süresi',
  'Anayasa Mahkemesi kaç üye?',
  'Zincirleme suçta ceza',
  'Tanıklıktan çekinme',
];

const welcome: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: isAiConnected
    ? 'Merhaba! Mevzuat, konu özetleri veya deneme soruları hakkında sorunu yaz.'
    : 'Merhaba! Bir konu ya da kavram yaz; konu özetlerinden ve soru bankasından ilgili bilgiyi bulayım.',
};

export default function Asistan() {
  const { rank } = useProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const list = useRef<FlatList<ChatMessage>>(null);
  // Mesaj kimlikleri için artan sayaç
  const seq = useRef(0);
  const nextId = () => String(++seq.current);

  const send = async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;
    const next = [...messages, { id: nextId(), role: 'user' as const, text: question }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const reply = await askAssistant(next, { rankName: rank?.name });
      setMessages((m) => [...m, { id: nextId(), role: 'assistant', text: reply }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Bilinmeyen hata';
      setMessages((m) => [...m, { id: nextId(), role: 'assistant', text: `Hata: ${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={list}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.sm }}
        onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
        ListHeaderComponent={
          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <Ionicons name="sparkles" size={20} color={colors.tintInk.teal} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.bannerTitle}>{isAiConnected ? 'Yapay zekâ asistanı' : 'Çevrimdışı asistan'}</Text>
              <Text style={styles.bannerText}>
                {isAiConnected
                  ? 'Sorularını yapay zekâ yanıtlar. Önemli bilgileri resmî metinden doğrula.'
                  : 'Cevaplar uygulamadaki konu özetlerinden ve soru bankasından alınır, internet gerekmez.'}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.user : styles.assistant]}>
            <Text style={[styles.bubbleText, item.role === 'user' && { color: '#fff' }]}>{item.text}</Text>
          </View>
        )}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : messages.length === 1 ? (
            <View style={styles.chips}>
              {SUGGESTIONS.map((q) => (
                <Pressable key={q} onPress={() => send(q)} style={styles.chip} accessibilityRole="button">
                  <Text style={styles.chipText}>{q}</Text>
                </Pressable>
              ))}
            </View>
          ) : null
        }
      />
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Sorunuzu yazın…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
        />
        <Pressable
          onPress={() => send()}
          disabled={loading || !input.trim()}
          style={styles.send}
          accessibilityRole="button"
          accessibilityLabel="Gönder"
        >
          <Ionicons name="send" size={20} color="#fff" />
        </Pressable>
      </View>
      <Text style={styles.disclaimer}>
        {isAiConnected
          ? 'Yapay zekâ yanıtları hatalı olabilir; resmî metinlerden doğrulayın.'
          : 'Bilgiler sınav hazırlık içindir; güncel hâli için Mevzuat sekmesinden resmî metne bakın.'}
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.tint.teal,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: { fontFamily: fonts.bold, fontSize: font.body, color: colors.text },
  bannerText: { fontFamily: fonts.medium, fontSize: font.small, lineHeight: 18, color: colors.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipText: { fontFamily: fonts.semibold, fontSize: font.small, color: colors.primary },
  bubble: { maxWidth: '88%', borderRadius: radius.lg, padding: spacing.md, ...shadow.card },
  user: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  assistant: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  bubbleText: { fontSize: font.body, fontFamily: fonts.regular, color: colors.text, lineHeight: 22 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    fontSize: font.body,
    fontFamily: fonts.medium,
    color: colors.text,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  send: { backgroundColor: colors.primary, borderRadius: radius.pill, padding: spacing.md },
  disclaimer: {
    fontSize: font.tiny,
    fontFamily: fonts.medium,
    paddingHorizontal: spacing.lg,
    color: colors.textMuted,
    textAlign: 'center',
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
});
