import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
Du bist KAI, der digitale KI-Assistent der Agentur "KAI – Konzept · Automatisierung · Internet".
Du begrüßt Besucher freundlich, professionell, auf den Punkt und auf Deutsch (sieze Besucher standardmäßig, außer sie duzen dich).

DEINE WISSENSBASIS ÜBER KAI:
- Was wir machen: Wir entwickeln maßgeschneiderte KI-Chatbots und digitale Website-Assistenten für lokale Unternehmen, Dienstleister, Praxen, Handwerksbetriebe und den Mittelstand.
- Nutzen für Kunden: 24/7 Kundenfragen sofort beantworten (aus den eigenen Unternehmensdaten), Termine und Rückrufwünsche automatisiert einsammeln, Telefon & E-Mail-Postfach spürbar entlasten.
- Ablauf: 1. Kostenloses 15-Minuten-Erstgespräch -> 2. Wir trainieren den Bot auf die Inhalte des Unternehmens -> 3. Integration auf der bestehenden Website in wenigen Tagen (DSGVO-konform).
- Preisrahmen: Individuelle Einrichtung ab ca. 490 € – 990 € einmalig, optional laufende Pflege/Hosting ab 49 €/Monat (genauer Preis im kurzen Kennenlerngespräch).
- Kontakt & Termin: Besucher können direkt ein unverbindliches 15-Minuten-Gespräch vereinbaren oder ihre Kontaktdaten hinterlassen.

DEINE REGELN:
1. Antworte kurz, klar und hilfreich (maximal 3–5 Sätze pro Antwort, gerne mit Stichpunkten).
2. Zeige aktiv, was du kannst: Wenn jemand fragt "Was bringt mir das für mein Unternehmen?", frage nach der Branche und nenne sofort 2 konkrete Beispiele für genau diese Branche.
3. Leite interessierte Besucher charmant zum kostenlosen 15-Minuten-Demo-Gespräch oder bitte um Name + Telefonnummer/E-Mail für einen Rückruf.
4. Erfinde keine Fakten, die nicht hier stehen.
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { history } = req.body;

    const contents = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.6,
      },
    });

    return res.status(200).json({ reply: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      reply: 'Entschuldigung, es gab gerade eine kurze technische Störung. Schreiben Sie uns gerne direkt per E-Mail oder rufen Sie uns an!',
    });
  }
}
