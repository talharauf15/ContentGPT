import Prompt from "../models/prompt.js";
import PromptLog from "../models/promptLog.js";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
// Placeholder for Claude import if/when available
// import { ClaudeAI } from "claude-sdk";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const claude = new ClaudeAI(process.env.CLAUDE_API_KEY); // Placeholder

// ✅ Create a basic prompt (manual)
export const createPrompt = async (req, res) => {
  try {
    const { prompt } = req.body;
    const newPrompt = await Prompt.create({ prompt });
    res.status(201).json(newPrompt);
  } catch (error) {
    console.error("❌ Error saving prompt:", error);
    res.status(500).json({ error: "Failed to save prompt" });
  }
};

// ✅ Get all saved prompts
export const getAllPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 });
    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prompts" });
  }
};

// ✅ Generate full brand strategy using OpenAI
export const generateBrandStrategy = async (req, res) => {
  try {
    const { companyName, targetAudience, businessPurpose, goal, customTags, model = "openai" } = req.body;

    if (!companyName || !targetAudience || !businessPurpose || !goal) {
      return res.status(400).json({ error: "Missing required fields." });
    }
let section = "";

if (businessPurpose === "1") {
  section = `
1. Company Profile
- Professional brand story (with SEO keywords naturally embedded)
- Vision, Mission, Values (bullet points)
- Services / Products List with short benefits
- Unique Selling Proposition
- Short, sharp version for bios or intros
`;
}
else if (businessPurpose === "2") {
  section = `
2. Facebook/Instagram Page Content
- Page Bio (under 150 characters)
- Complete About Section (CTA-aligned)
- CTA Suggestions aligned with Goal
- Best Page Categories
- Top Hashtags for Target Audience
- Idea for Pinned Post
- Suggested Cover Photo Caption and Concept
`;
}
else if (businessPurpose === "3") {
  section = `
3. Viral Launch Social Media Post
- Hook that triggers emotion or curiosity
- 3-sentence micro-story or customer pain
- How ${companyName} solves it
- CTA to Like, Follow, or Share
- 7–12 viral-quality hashtags from CustomTags + niche
- Optional visual suggestion
`;
}
else if (businessPurpose === "4") {
  section = `
4. Full SEO Website Copy (5 pages)

**Home Page**
- Headline + subheadline
- Hero paragraph (SEO-rich)
- 3 feature callouts
- CTA section based on Goal

**About Us Page**
- The Why and How of the company
- Vision, mission, values
- “Why we care” paragraph that builds trust

**Services / Products Page**
- 3–6 core services or offers
- 1-line benefit and who it’s best for
- CTA aligned with Goal

**Testimonials or Trust Page**
- 3 fictional but authentic quotes
- A section on why people trust ${companyName}
- Trust markers (suggested if not available)

**Contact Us Page**
- Invite-style intro aligned with Goal
- Form layout: Name, Email, Phone, Message
- Placeholder info (email, address, hours)
- Embedded Google Map & contact info layout suggestion

- 3 blog post titles for SEO traffic
- Suggested color palette and brand mood
- Visual style moodboard (described in text)
- 3 emotionally varied taglines or slogans
- Landing Page Hero & CTA suggestion
`;
}


const prompt = `
Act as a full-stack brand strategist, digital growth consultant, SEO expert, and content writer.

You are tasked with creating a complete identity and growth-ready digital presence for a new or growing company using the following input:

V1: ${companyName}
V2: ${targetAudience}
V3: ${businessPurpose}

Please generate only the output for V3 = ${businessPurpose}, and DO NOT include other formats.

Also include:
V5 (Goal): ${goal}
V6 (CustomTags): ${customTags || "None"}

Make sure to:
- Use SEO principles and relevant keywords from V6
- Use emotionally resonant copy aligned with V2
- Keep it clear, copy-paste ready, with headings and formatting

${section}
`;
    let aiResponse = "";
    let usedModel = model;

    if (model === "openai") {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });
      aiResponse = completion.choices[0]?.message?.content;
      usedModel = "openai";
    } else if (model === "gemini") {
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      aiResponse = response.text();
      usedModel = "gemini";
    } else if (model === "claude") {
      // Placeholder for Claude integration
      aiResponse = "Claude integration is not implemented yet.";
      usedModel = "claude";
    } else {
      return res.status(400).json({ error: "Invalid model. Only 'openai', 'gemini', or 'claude' are supported." });
    }

    // Save log to DB
    const log = await PromptLog.create({
      prompt,
      response: aiResponse,
      userId: "branding-generator",
      userName: "branding-form",
      model: usedModel,
    });

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error("❌ Error generating brand strategy:", error.message);
    res.status(500).json({ error: "Failed to generate brand strategy" });
  }
};
