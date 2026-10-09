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

import { useProfile } from '../../context/ProfileContext';
import { askAssistant, type ChatMessage } from '../../services/ai';
import { colors, font, radius, spacing } from '../../theme';

const welcome: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Merhaba! Mevzuat, emsal kararlar veya deneme soruları hakkında sorunuzu yazın.',
};

export default function Asistan() {
  const { rank } = useProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const list = useRef<FlatList<ChatMessage>>(null);

  const send = async () => {
    const question = input.trim();
    if (!question || loading) return;
    const next = [...messages, { id: String(Date.now()), role: 'user' as const, text: question }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const reply = await askAssistant(next, { rankName: rank?.name });
      setMessages((m) => [...m, { id: `${Date.now()}-a`, role: 'assistant', text: reply }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Bilinmeyen hata';
      setMessages((m) => [...m, { id: `${Date.now()}-e`, role: 'assistant', text: `Hata: ${msg}` }]);
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
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.user : styles.assistant]}>
            <Text style={[styles.bubbleText, item.role === 'user' && { color: '#fff' }]}>{item.text}</Text>
          </View>
        )}
        ListFooterComponent={loading ? <ActivityIndicator color={colors.primary} /> : null}
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
          onPress={send}
          disabled={loading || !input.trim()}
          style={styles.send}
          accessibilityRole="button"
          accessibilityLabel="Gönder"
        >
          <Ionicons name="send" size={20} color="#fff" />
        </Pressable>
      </View>
      <Text style={styles.disclaimer}>Yapay zekâ yanıtları hatalı olabilir; resmî metinlerden doğrulayın.</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bubble: { maxWidth: '85%', borderRadius: radius.md, padding: spacing.md },
  user: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  assistant: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  bubbleText: { fontSize: font.body, color: colors.text, lineHeight: 21 },
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
    color: colors.text,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  send: { backgroundColor: colors.primary, borderRadius: radius.pill, padding: spacing.md },
  disclaimer: {
    fontSize: font.tiny,
    color: colors.textMuted,
    textAlign: 'center',
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
});
