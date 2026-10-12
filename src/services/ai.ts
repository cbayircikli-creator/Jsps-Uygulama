// Yapay zekâ asistanı servis katmanı.
//
// ÖNEMLİ: API anahtarı asla uygulamanın içine gömülmemeli. Gerçek entegrasyonda
// uygulama kendi sunucumuza istek atar, sunucu yapay zekâ sağlayıcısını çağırır.
// Sunucu bağlı değilken asistan, uygulamadaki içerikten cevap bulan yerel arama ile çalışır.
import { answerLocally } from './localAssistant';

export type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string };

export type AssistantContext = { rankName?: string };

const AI_ENDPOINT: string | undefined = process.env.EXPO_PUBLIC_AI_ENDPOINT;

/** Yapay zekâ sunucusu yapılandırıldı mı */
export const isAiConnected = !!AI_ENDPOINT;

export async function askAssistant(
  history: ChatMessage[],
  context: AssistantContext,
): Promise<string> {
  if (AI_ENDPOINT) {
    const res = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: history.map(({ role, text }) => ({ role, content: text })),
        context,
      }),
    });
    if (!res.ok) throw new Error(`Asistan yanıt vermedi (${res.status})`);
    const data: { reply: string } = await res.json();
    return data.reply;
  }

  const last = [...history].reverse().find((m) => m.role === 'user');
  return answerLocally(last?.text ?? '').text;
}
