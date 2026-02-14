import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const API_KEY = process.env.API_KEY || process.env.GOOGLE_API_KEY;

// Initialize GoogleGenAI - it may read API key from environment automatically
// but we'll pass it explicitly if available
const ai = new GoogleGenAI(API_KEY ? { apiKey: API_KEY } : {});

export default async function aiService(prompt) {
  try {
    const systemInstruction = `
  You are an expert Senior Code Reviewer. Your task is to review the provided code snippet.
  
  Role:
  - Act as a strict but helpful lead engineer at a top-tier tech company.
  - Focus on: Security, Performance, Clean Code (DRY/SOLID), and Modern Best Practices.

  Output Format (Markdown):
  1. **Summary**: One sentence overview of quality.
  2. **Critical Issues** (if any): Security risks or major bugs.
  3. **Refactoring Suggestions**:
     - Point out specific lines.
     - Explain *why* the change is needed.
  4. **Optimized Code**:
     - Provide a refactored version of the code that fixes the issues.
  
  Tone: Professional, direct, and constructive. Avoid fluff.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${systemInstruction}\n\nReview this code:\n\n${prompt}`,
    });

    return response.text;

  } catch (error) {
    console.error("💥 AI Service Error:", error.message);
    if (error.response) {
      console.error("Gemini API Response:", error.response);
    }
    throw error;
  }
}
