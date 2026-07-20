import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getGeminiClient } from './_lib/gemini';
import { Type } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { composer, piece, performanceDate, venue, performer, notes, rating } = req.body;
    const ai = getGeminiClient();

    const userPrompt = `
      Composer: ${composer || "Unknown"}
      Piece/Program: ${piece || "Unknown"}
      Performer/Orchestra: ${performer || "Unknown"}
      Venue: ${venue || "Unknown"}
      Date: ${performanceDate || "Unknown"}
      My Rating: ${rating || 5}/5 stars
      My rough notes: ${notes || "No draft notes provided."}
    `;

    const systemInstruction = `
      You are "Rédacteur d'Harmonie", a professional classical music critic.
      Your task is to take the user's rough notes, rating, and details of a classical concert and write a highly polished, eloquent, and expressive concert review in Japanese.
      The output should match the tone of an elegant classic music community post.
      Incorporate proper classical music terminology (e.g., phrasing, acoustics, dynamics, interpretation, emotional depth) based on the input.
      Provide the result as a JSON object containing:
      - title: A poetic and engaging title for the review (in Japanese)
      - reviewText: The main polished review text (around 300-500 characters, in Japanese)
      - highlight: A one-sentence highlight of the concert (in Japanese)
      - suggestion: A recommendation of another piece/recording to listen to after this concert (in Japanese)
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            reviewText: { type: Type.STRING },
            highlight: { type: Type.STRING },
            suggestion: { type: Type.STRING },
          },
          required: ["title", "reviewText", "highlight", "suggestion"],
        },
      },
    });

    const text = response.text || "{}";
    return res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini Review Helper Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate review draft" });
  }
}
