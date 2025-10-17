import request from "supertest";
import express from "express";
import aiRoutes from "../routes/aiRoutes.js";
import videoRoutes from "../routes/videoRoutes.js";

const app = express();
app.use(express.json());
app.use("/api", aiRoutes);
app.use("/api", videoRoutes);

describe("AI Course Backend API", () => {
  test("POST /api/consult → should return AI reply", async () => {
    const res = await request(app)
      .post("/api/consult")
      .send({ message: "Aku suka desain, cocoknya belajar apa?" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("reply");
  });

  test("POST /api/recommend → should return video list", async () => {
    const res = await request(app)
      .post("/api/recommend")
      .send({ interest: "frontend" });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.videos)).toBe(true);
  });
});
