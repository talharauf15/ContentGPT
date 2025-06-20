
import Prompt from "../models/prompt.js";

export const createPrompt = async (req, res) => {
  try {
    console.log("📥 Received POST body:", req.body); // Debug log

    const { prompt } = req.body;
    const newPrompt = await Prompt.create({ prompt });
    console.log("✅ Saved Prompt:", newPrompt); // Debug log

    res.status(201).json(newPrompt);
  } catch (error) {
    console.error("❌ Error saving prompt:", error); // 👈 Catch actual error
    res.status(500).json({ error: "Failed to save prompt" });
  }
};


export const getAllPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 });
    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prompts" });
  }
};
