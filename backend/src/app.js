import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";

dotenv.config();

const app = express();

// JSON body parsing with a reasonable size limit
app.use(express.json({ limit: "1mb" }));

// CORS setup - More robust configuration
const allowedOrigins = [
  'http://localhost:5173',  // Local development
  'https://code-reviewer-frontend-fyln.onrender.com',  // Current production frontend
  process.env.FRONTEND_ORIGIN  // Environment variable fallback
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

// AI routes
app.use("/ai", aiRoutes);

// Debug CORS route
app.get("/cors-test", (req, res) => {
  res.json({
    origin: req.headers.origin,
    allowedOrigins: allowedOrigins,
    headers: req.headers
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
