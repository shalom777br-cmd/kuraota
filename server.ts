import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily to avoid crashing on start if the key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Classical music recommendation API (mood, instrument, era etc.)
app.post("/api/recommendations", async (req, res) => {
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
      model: "gemini-3.5-flash",
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
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini Recommendations Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate recommendations" });
  }
});

// Concert review helper API
app.post("/api/review-helper", async (req, res) => {
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
      model: "gemini-3.5-flash",
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
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini Review Helper Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate review draft" });
  }
});

// Composer details generator API
app.post("/api/composer-info", async (req, res) => {
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
      model: "gemini-3.5-flash",
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
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini Composer Info Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch composer details" });
  }
});

// Integrate Vite middleware or serve static assets
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();
