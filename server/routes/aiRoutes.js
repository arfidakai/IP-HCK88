import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/consult", async (req, res) => {
  try {
    const { message } = req.body;

    const systemPrompt = `
Kamu adalah asisten pembelajaran AI yang membantu user menentukan bidang belajar IT yang cocok.
Jawablah dengan gaya yang ramah, singkat, dan berikan alasan singkat di akhir.
Contoh jawaban:
"Kamu cocok belajar *Frontend Development*, karena kamu suka desain dan interaksi user."
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\nUser: ${message}`,
            },
          ],
        },
      ],
    });
    console.log("🧩 RAW RESPONSE:", JSON.stringify(response, null, 2));

    const reply =
      response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      response.output_text?.trim() ||
      response.output?.[0]?.content?.[0]?.text?.trim() ||
      "Maaf, AI tidak memberikan jawaban.";

    console.log("🧠 Gemini reply (parsed):", reply);
    res.json({ reply });
  } catch (err) {
    console.error("❌ Gemini API error:", err);
    res.status(500).json({
      error: "AI consultation failed",
      details: err.message,
    });
  }
});

export default router;
