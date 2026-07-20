import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGeminiClient } from './_lib/gemini.js';
import { Type } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { mood, instrument, era, prompt } = req.body;
    const ai = getGeminiClient();

    const userPrompt = prompt || `Suggest classical music based on: Mood: ${mood || "any"}, Instrument: ${instrument || "any"}, Era: ${era || "any"}.`;

    const systemInstruction = `
      You are "Concierge Classique", an elegant and deeply knowledgeable classical music expert and AI assistant for the classical music SNS "L'harmonie Classique".
      Generate classical music piece recommendations in a JSON array of objects.
      Each object must contain:
      - title: name of the piece
      - composer: name of the composer
      - era: era (e.g., Baroque, Classical, Romantic, Modern)
      - description: brief explanation of why it fits and what makes it special (in polite Japanese)
      - movement: famous movement or highlight to listen to
      Ensure you only return valid JSON. Do not write markdown blocks other than the JSON itself if requested, but with responseMimeType: "application/json", return pure JSON array.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              composer: { type: Type.STRING },
              era: { type: Type.STRING },
              description: { type: Type.STRING },
              movement: { type: Type.STRING },
            },
            required: ["title", "composer", "era", "description", "movement"],
          },
        },
      },
    });

    const text = response.text || "[]";
    return res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini Recommendations Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate recommendations" });
  }
}
