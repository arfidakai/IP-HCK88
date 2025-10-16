import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { sequelize } from "./models/index.js";
import aiRoutes from "./routes/aiRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";

import "./config/passport.js";

import { User } from "./models/User.js";

try {
  await sequelize.authenticate();
  console.log("✅ Connected to Supabase database!");

  await sequelize.sync({ alter: true });
  console.log("✅ Database synced!");
} catch (err) {
  console.error("❌ Database connection failed:", err);
}

dotenv.config();

const app = express();
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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
