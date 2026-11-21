import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY fehlt in Vercel' });
  }

  try {
    const { message, source } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Nachricht fehlt' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction =
      source === 'karte'
        ? 'Du bist KAI, der freundliche digitale Assistent einer minimalistischen Web- und KI-Agentur. Der Besucher kommt über einen QR-Code von einer Visitenkarte. Antworte kurz, klar, sympathisch und auf Deutsch.'
        : 'Du bist KAI, der freundliche digitale Assistent einer minimalistischen Web- und KI-Agentur. Antworte kurz, klar, sympathisch und auf Deutsch.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
      },
    });

    return res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error('Gemini API Fehler:', error);
    return res.status(500).json({
      error: 'Fehler bei der Gemini-Anfrage',
      details: error.message,
    });
  }
}
