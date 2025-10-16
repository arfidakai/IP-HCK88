import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";
import aiRoutes from "./routes/aiRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import listRoutes from "./routes/listRoutes.js";

import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import "./config/passport.js";

import { User } from "./models/User.js";

try {
  await sequelize.authenticate();
  console.log("✅ Connected to Supabase database!");

  // sync semua model ke database
  await sequelize.sync({ alter: true }); // pakai alter biar update tabel kalau ada perubahan
  console.log("✅ Database synced!");
} catch (err) {
  console.error("❌ Database connection failed:", err);
}

dotenv.config();

const app = express(); // ✅ inisialisasi dulu baru pakai

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  session({ secret: "session-secret", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", authRoutes);
app.use("/api", aiRoutes);
app.use("/api", videoRoutes);
app.use("/api", listRoutes);

// Database connection
try {
  await sequelize.authenticate();
  console.log("✅ Connected to database!");
} catch (err) {
  console.error("❌ Database connection failed:", err);
}

const PORT = 8080;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
