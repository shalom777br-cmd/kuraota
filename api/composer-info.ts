import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGeminiClient } from './_lib/gemini.js';
import { Type } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { composerName } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `
      You are "Musicologue", an expert musicologist.
      Given the name of a classical composer, provide detailed, accurate, and fascinating information in Japanese.
      Provide the result as a JSON object containing:
      - name: Composer name (in Japanese and alphabet)
      - era: Period/era of classical music (e.g., Romantic, Classical, Baroque)
      - country: Country of origin
      - lifespan: Birth and death years
      - biography: A beautifully written 2-3 sentence biography in Japanese
      - funFact: A quirky, interesting, or little-known historical anecdote/fact about the composer
      - keyPieces: A list of 3 signature masterpieces, each with a brief 1-sentence listening note.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `Composer: ${composerName}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            era: { type: Type.STRING },
            country: { type: Type.STRING },
            lifespan: { type: Type.STRING },
            biography: { type: Type.STRING },
            funFact: { type: Type.STRING },
            keyPieces: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["title", "description"],
              },
            },
          },
          required: ["name", "era", "country", "lifespan", "biography", "funFact", "keyPieces"],
        },
      },
    });

    const text = response.text || "{}";
    return res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini Composer Info Error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch composer details" });
  }
}
