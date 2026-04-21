import dotenv from "dotenv";
dotenv.config(); // ⬅️ paling atas!


import express from "express";
import cors from "cors";
// import { sequelize } from "./models/index.js";
import aiRoutes from "./routes/aiRoutes.js";
// import videoRoutes from "./routes/videoRoutes.js";
// import listRoutes from "./routes/listRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
// import "./config/passport.js";


// Database disabled for AI-only mode

4
// Validate API keys on startup (AI only)
if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_here') {
  console.warn("⚠️  GEMINI_API_KEY not set or still placeholder. AI features will fail.");
}


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes (AI only)
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});
app.use("/api", aiRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
