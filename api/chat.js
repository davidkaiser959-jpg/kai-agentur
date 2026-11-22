export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Holt deinen geschützten Key sicher aus Vercel
  const apiKey = process.env.GEMINI_API_KEY;
  const model = "gemini-3.8-flash";

  const { contents } = await req.json();

  const systemPrompt = `Du bist K.A.I. (Kunden. Automatisch. Informieren.), ein freundlicher, hilfsbereiter KI-Assistent für lokale Unternehmen. Antworte kurz, klar und kundenorientiert auf Deutsch.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents
      }),
    }
  );

  // Leitet den Live-Stream direkt an dein Chatfenster weiter
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
