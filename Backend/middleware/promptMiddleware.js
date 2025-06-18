// middleware/promptMiddleware.js

export const validatePrompt = (req, res, next) => {
    const { prompt } = req.body;
  
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required and must be a non-empty string." });
    }
  
    req.body.prompt = prompt.trim(); // Clean it up
    next();
  };
  