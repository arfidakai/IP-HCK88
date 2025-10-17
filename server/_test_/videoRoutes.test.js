import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const mockGet = jest.fn();
jest.unstable_mockModule("axios", () => ({
  default: { get: mockGet },
}));

const { default: axios } = await import("axios");
const { default: videoRoutes } = await import("../routes/videoRoutes.js");

const app = express();
app.use(express.json());
app.use("/api", videoRoutes);

describe("🎥 VIDEO ROUTES", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  test("POST /api/recommend → success", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: { videoId: "abc123" },
            snippet: {
              title: "Belajar React",
              thumbnails: { medium: { url: "https://yt.com" } },
            },
          },
        ],
      },
    });

    const res = await request(app)
      .post("/api/recommend")
      .send({ interest: "react" });

    expect(res.statusCode).toBe(200);
    expect(res.body.videos[0].title).toBe("Belajar React");
  });

  test("GET /api/trending → success", async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: { videoId: "xyz456" },
            snippet: {
              title: "Tutorial Backend",
              thumbnails: { medium: { url: "https://yt.com" } },
            },
          },
        ],
        nextPageToken: "CAoQAA",
      },
    });

    const res = await request(app).get("/api/trending");

    expect(res.statusCode).toBe(200);
    expect(res.body.videos[0].videoId).toBe("xyz456");
  });

  test("POST /api/recommend → error handling", async () => {
    mockGet.mockRejectedValueOnce(new Error("YouTube API down"));

    const res = await request(app)
      .post("/api/recommend")
      .send({ interest: "python" });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to fetch recommendations");
  });
});
