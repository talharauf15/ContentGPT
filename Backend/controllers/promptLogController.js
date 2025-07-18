import { OpenAI } from "openai";
import PromptLog from "../models/promptLog.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const createPromptLog = async (req, res) => {
  try {
    const { prompt, userId, userName, model = "openai", agent } = req.body;

    if (!prompt || !userId || !userName || !agent) {
      return res.status(400).json({ error: "Missing required fields: prompt, userId, userName, agent." });
    }

    let reply = "";

    if (model === "openai") {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });
      reply = response.choices[0].message.content;
    }
    else if (model === "gemini") {
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      reply = response.text();
    }
    else {
      return res.status(400).json({ error: "Invalid model. Only 'openai' or 'gemini' are supported." });
    }

    const newLog = await PromptLog.create({
      prompt,
      response: reply,
      userId,
      userName,
      model,
      agent,
    });

    res.status(201).json(newLog);
  } catch (error) {
    console.error("❌ Prompt Log Save Error:", error.message);
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
    console.error("❌ Fetch Logs Error:", error.message);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};
