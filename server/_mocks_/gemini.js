// Mock untuk Gemini API
export const mockGeminiResponse = (message) => {
  // balikin jawaban dummy aja biar test cepat
  return {
    reply: `AI Mocked reply for message: "${message}"`,
  };
};
