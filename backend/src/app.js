import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";

dotenv.config();

const app = express();

// JSON body parsing with a reasonable size limit
app.use(express.json({ limit: "1mb" }));

// CORS setup
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "*";
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
  })
);

// Health check route
app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

// AI routes
app.use("/ai", aiRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
