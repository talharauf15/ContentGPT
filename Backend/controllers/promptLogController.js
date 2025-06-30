import { OpenAI } from "openai";
import PromptLog from "../models/promptLog.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createPromptLog = async (req, res) => {
  try {
    const { prompt, userId, userName } = req.body;

    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
    });

    const reply = response.choices[0].message.content;

    const newLog = await PromptLog.create({
      prompt,
      response: reply,
      userId,
      userName,
    });

    res.status(201).json(newLog);
  } catch (error) {
    console.error("❌ Prompt Log Save Error:", error);
    res.status(500).json({ error: "Failed to save prompt log" });
  }
};

export const getAllPromptLogs = async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "Missing userId in query parameters" });
      }
      const logs = await PromptLog.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  };
