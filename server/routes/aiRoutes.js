import express from "express";
import fetch from "node-fetch";
const router = express.Router();

router.post("/consult", async (req, res) => {
  try {
    const { message } = req.body;

    const systemPrompt = `
Kamu adalah asisten pembelajaran AI yang membantu user menentukan bidang belajar IT yang cocok.
Jawablah dengan gaya yang ramah, singkat, dan berikan alasan singkat di akhir.
Contoh jawaban:
"Kamu cocok belajar *Frontend Development*, karena kamu suka desain dan interaksi user."
`;

    const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
    const apiKey = process.env.GEMINI_API_KEY;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite-001:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
        })
      }
    );
    const data = await geminiRes.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      data.error?.message ||
      "Maaf, AI tidak memberikan jawaban.";

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

// Diagnostics: simple ping to verify Gemini API key
router.get("/gemini/ping", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: "ping" }],
        },
      ],
    });
    const reply =
      response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      response.output_text?.trim() ||
      response.output?.[0]?.content?.[0]?.text?.trim() ||
      null;
    res.json({ ok: true, reply });
  } catch (err) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.error?.message || err.message;
    res.status(status || 500).json({ ok: false, error: msg, status });
  }
});
