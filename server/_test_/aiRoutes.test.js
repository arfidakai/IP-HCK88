import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

jest.unstable_mockModule("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockResolvedValue({
        candidates: [
          { content: { parts: [{ text: "Kamu cocok belajar Frontend" }] } },
        ],
      }),
    },
  })),
}));

const { default: aiRoutes } = await import("../routes/aiRoutes.js");

const app = express();
app.use(express.json());
app.use("/api", aiRoutes);

describe("🤖 AI ROUTES", () => {
  test("POST /api/consult → success", async () => {
    const res = await request(app)
      .post("/api/consult")
      .send({ message: "Aku suka desain" });

    expect(res.statusCode).toBe(200);
    expect(res.body.reply).toContain("Frontend");
  });

  test("POST /api/consult → handle Gemini API error", async () => {
    const { GoogleGenAI } = await import("@google/genai");
    GoogleGenAI.mockImplementation(() => ({
      models: {
        generateContent: jest.fn().mockRejectedValue(new Error("Boom")),
      },
    }));

    const res = await request(app)
      .post("/api/consult")
      .send({ message: "error test" });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("AI consultation failed");
  });
});
