// Yapay zekâ asistanı servis katmanı.
//
// ÖNEMLİ: API anahtarı asla uygulamanın içine gömülmemeli. Gerçek entegrasyonda
// uygulama kendi sunucumuza istek atar, sunucu yapay zekâ sağlayıcısını çağırır.
// O zamana kadar `askAssistant` yer tutucu bir yanıt döndürür.

export type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string };

export type AssistantContext = { rankName?: string };

const AI_ENDPOINT: string | undefined = process.env.EXPO_PUBLIC_AI_ENDPOINT;

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

  await new Promise((r) => setTimeout(r, 400));
  return (
    'Asistan henüz bağlanmadı. Sunucu tarafı hazır olduğunda mevzuat soruları, ' +
    'konu özetleri ve deneme çözümlerinde burada yardımcı olacağım.'
  );
}
