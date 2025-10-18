import aiService from "../services/ai.service.js";

export default async function getResponse(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await aiService(prompt);
    res.status(200).json({ result: response });
  } catch (error) {
    console.error("❌ Controller Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
