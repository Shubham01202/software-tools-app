// routes/openaiRoutes.js
const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

// ✅ Setup OpenRouter API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // format: org-xxxx:xxxxxxxxx
  baseURL: "https://openrouter.ai/api/v1", // important change for OpenRouter
});

// ✅ POST /api/openai/chat
router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // ✅ Use a free model like mistral
    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct", // ✅ free and no need to enable
      messages: [{ role: "user", content: prompt }],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    res.status(500).json({
      error: "Something went wrong with OpenRouter API",
    });
  }
});

module.exports = router;
