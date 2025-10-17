import { mockAiRoutes, mockVideoRoutes } from "./setupMock.js";

import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import authRoutes from "../routes/authRoutes.js";
import listRoutes from "../routes/listRoutes.js";
import aiRoutes from "../routes/aiRoutes.js";
import videoRoutes from "../routes/videoRoutes.js";
import { User } from "../models/User.js";
import { VideoList } from "../models/VideoList.js";
import { sequelize } from "../models/index.js";

// jest.setTimeout(20000);

const app = express();
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", mockAiRoutes());
app.use("/api", mockVideoRoutes());
app.use("/api", listRoutes);

let validToken;
let invalidToken = "12345.invalid.token";
let testUser;
let testVideo;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // 🔹 Buat user test manual
  const hash = await bcrypt.hash("password123", 10);
  testUser = await User.create({
    name: "User Test",
    email: "usertest@mail.com",
    password: hash,
  });

  validToken = jwt.sign(
    { id: testUser.id, email: testUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // 🔹 Insert contoh video list
  testVideo = await VideoList.create({
    title: "Intro to React",
    videoId: "abc123",
    thumbnail: "https://img.youtube.com/vi/abc123/mqdefault.jpg",
  });
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
  await VideoList.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await sequelize.close();
});

describe("🔐 AUTH ROUTES", () => {
  test("POST /api/register → success register", async () => {
    const res = await request(app).post("/api/register").send({
      name: "New User",
      email: "newuser@mail.com",
      password: "newpassword",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.user.email).toBe("newuser@mail.com");
  });

  test("POST /api/register → fail duplicate email", async () => {
    const res = await request(app).post("/api/register").send({
      name: "User Test",
      email: "usertest@mail.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Email sudah digunakan!");
  });

  test("POST /api/login → success login", async () => {
    const res = await request(app).post("/api/login").send({
      email: "usertest@mail.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /api/login → fail wrong password", async () => {
    const res = await request(app).post("/api/login").send({
      email: "usertest@mail.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Password salah.");
  });

  test("POST /api/login → fail unregistered email", async () => {
    const res = await request(app).post("/api/login").send({
      email: "unknown@mail.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "Email belum terdaftar.");
  });
});

describe("📚 LIST ROUTES", () => {
  test("GET /api/list → should return all saved videos", async () => {
    const res = await request(app).get("/api/list");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /api/list → success add new video", async () => {
    const res = await request(app).post("/api/list").send({
      title: "Learn Node.js Basics",
      videoId: "xyz789",
      thumbnail: "https://img.youtube.com/vi/xyz789/mqdefault.jpg",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "Learn Node.js Basics");
  });

  test("DELETE /api/list/:id → success delete video", async () => {
    const res = await request(app).delete(`/api/list/${testVideo.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });
});

describe("🤖 AI ROUTE", () => {
  test("POST /api/consult → AI returns reply", async () => {
    const res = await request(app)
      .post("/api/consult")
      .send({ message: "Aku suka desain, cocoknya belajar apa?" });

    // Karena Gemini API bisa variatif, cukup pastikan ada property reply
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("reply");
  });
});

describe("🎥 VIDEO ROUTE", () => {
  test("POST /api/recommend → returns videos array", async () => {
    const res = await request(app)
      .post("/api/recommend")
      .send({ interest: "frontend" });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.videos)).toBe(true);
  });
});
