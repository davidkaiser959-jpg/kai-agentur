import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY fehlt in den Vercel Environment Variables.' });
  }

  try {
    const { message, source } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Nachricht fehlt.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction =
      source === 'karte'
        ? 'Du bist KAI, der freundliche digitale Assistent der KAI-Agentur. Der Besucher kommt gerade über den QR-Code unserer Visitenkarte auf die Website. Antworte auf Deutsch, kurz, klar, sympathisch und ohne Fachjargon. Hilf bei Fragen zu Websites, KI-Assistenten und einer möglichen Zusammenarbeit.'
        : 'Du bist KAI, der freundliche digitale Assistent der KAI-Agentur. Antworte auf Deutsch, kurz, klar, sympathisch und ohne Fachjargon. Hilf Besuchern bei Fragen zu modernen Websites, KI-Chatbots und einer Zusammenarbeit mit der KAI-Agentur.';

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
