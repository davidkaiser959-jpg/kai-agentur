import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "Nachricht fehlt" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction:
          "Du bist KAI (Konzept · Automatisierung · Internet), der hilfreiche KI-Assistent der Agentur KAI. Antworte kurz, klar, freundlich und praxisnah auf Deutsch.",
      },
    });

    return res.status(200).json({ reply: response.text });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "Fehler bei der KI-Antwort" });
  }
}
