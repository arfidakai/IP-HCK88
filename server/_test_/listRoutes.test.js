import express from "express";
import request from "supertest";
import { jest } from "@jest/globals";

jest.unstable_mockModule("../models/VideoList.js", () => ({
  VideoList: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
  },
}));

const { VideoList } = await import("../models/VideoList.js");
const { default: listRoutes } = await import("../routes/listRoutes.js");

const app = express();
app.use(express.json());
app.use("/api", listRoutes);

describe("📚 LIST ROUTES", () => {
  beforeEach(() => jest.clearAllMocks());

  test("GET /list → success", async () => {
    VideoList.findAll.mockResolvedValue([{ id: 1, title: "React Video" }]);
    const res = await request(app).get("/api/list");
    expect(res.statusCode).toBe(200);
    expect(res.body[0].title).toBe("React Video");
  });

  test("GET /list → fail", async () => {
    VideoList.findAll.mockRejectedValue(new Error("DB error"));
    const res = await request(app).get("/api/list");
    expect(res.statusCode).toBe(500);
  });

  test("POST /list → success", async () => {
    VideoList.create.mockResolvedValue({
      id: 1,
      title: "Node Tutorial",
      listName: "Umum",
      status: "belum",
    });
    const res = await request(app)
      .post("/api/list")
      .send({ title: "Node Tutorial", videoId: "abc" });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Node Tutorial");
  });

  test("POST /list → fail", async () => {
    VideoList.create.mockRejectedValue(new Error("Insert error"));
    const res = await request(app).post("/api/list").send({ title: "Broken" });
    expect(res.statusCode).toBe(500);
  });

  test("PUT /list/:id → success", async () => {
    const mockSave = jest.fn();
    VideoList.findByPk.mockResolvedValue({
      id: 1,
      save: mockSave,
      status: "belum",
    });

    const res = await request(app)
      .put("/api/list/1")
      .send({ status: "selesai" });

    expect(res.statusCode).toBe(200);
    expect(mockSave).toHaveBeenCalled();
  });

  test("PUT /list/:id → not found", async () => {
    VideoList.findByPk.mockResolvedValue(null);
    const res = await request(app).put("/api/list/99").send({ status: "done" });
    expect(res.statusCode).toBe(404);
  });

  test("PUT /list/:id → fail", async () => {
    VideoList.findByPk.mockRejectedValue(new Error("Fail find"));
    const res = await request(app).put("/api/list/1").send({ status: "x" });
    expect(res.statusCode).toBe(500);
  });

  test("DELETE /list/:id → success", async () => {
    VideoList.destroy.mockResolvedValue(1);
    const res = await request(app).delete("/api/list/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("DELETE /list/:id → fail", async () => {
    VideoList.destroy.mockRejectedValue(new Error("Fail delete"));
    const res = await request(app).delete("/api/list/2");
    expect(res.statusCode).toBe(500);
  });
});
