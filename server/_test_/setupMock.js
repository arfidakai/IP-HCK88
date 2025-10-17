// 🧪 setupMock.js — pakai gaya ESM
import express from "express";
import { mockGeminiResponse } from "../_mocks_/gemini.js";
import { mockYouTubeResponse } from "../_mocks_/youtube.js";

export const mockAiRoutes = () => {
  const router = express.Router();
  router.post("/consult", (req, res) => {
    const { message } = req.body;
    const result = mockGeminiResponse(message);
    res.status(200).json(result);
  });
  return router;
};

export const mockVideoRoutes = () => {
  const router = express.Router();
  router.post("/recommend", (req, res) => {
    const { interest } = req.body;
    const result = mockYouTubeResponse(interest);
    res.status(200).json(result);
  });
  return router;
};
