import BrandStrategyAgent from "../models/brandStrategyAgent.js";
import PromptLog from "../models/promptLog.js";
import { generateLLMContent } from "../services/llmService.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ✅ Create a basic prompt (manual)
export const createPrompt = async (req, res) => {
  try {
    const { companyName, targetAudience, businessPurpose, goal, customTags } = req.body;
    if (!businessPurpose || (Array.isArray(businessPurpose) && businessPurpose.length === 0)) {
      return res.status(400).json({ error: "businessPurpose is required." });
    }
    const businessPurposes = Array.isArray(businessPurpose) ? businessPurpose : [businessPurpose];

    const newPrompt = await BrandStrategyAgent.create({
      companyName,
      targetAudience,
      businessPurpose: businessPurposes,
      goal,
      customTags,
    });
    res.status(201).json(newPrompt);
  } catch (error) {
    console.error("❌ Error saving prompt:", error);
    res.status(500).json({ error: "Failed to save prompt" });
  }
};

// ✅ Get all saved prompts
export const getAllPrompts = async (req, res) => {
  try {
    const prompts = await BrandStrategyAgent.find().sort({ createdAt: -1 });
    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prompts" });
  }
};

// ✅ Generate full brand strategy using OpenAI
export const generateBrandStrategy = async (req, res) => {
  try {
    const { companyName, targetAudience, businessPurpose, goal, customTags, model = "openai", agent, userId, userName } = req.body;
    const businessPurposes = Array.isArray(businessPurpose) ? businessPurpose : [businessPurpose];

    if (!companyName || !targetAudience || !businessPurposes.length || !goal) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Save input to BrandStrategyAgent (all requested purposes)
    await BrandStrategyAgent.create({
      companyName,
      targetAudience,
      businessPurpose: businessPurposes,
      goal,
      customTags,
    });

    // Call LLM once per selected business purpose, with 5s delay between each
    const responses = [];

    for (let i = 0; i < businessPurposes.length; i++) {
      const bp = businessPurposes[i];

      if (i > 0) {
        // wait 5 seconds before next LLM call
        await sleep(5000);
      }

      let section = "";

      if (bp === "1") {
        section = `
1. Company Profile
- Professional brand story (with SEO keywords naturally embedded)
- Vision, Mission, Values (bullet points)
- Services / Products List with short benefits
- Unique Selling Proposition
- Short, sharp version for bios or intros
`;
      } else if (bp === "2") {
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
      } else if (bp === "3") {
        section = `
3. Viral Launch Social Media Post
- Hook that triggers emotion or curiosity
- 3-sentence micro-story or customer pain
- How ${companyName} solves it
- CTA to Like, Follow, or Share
- 7–12 viral-quality hashtags from CustomTags + niche
- Optional visual suggestion
`;
      } else if (bp === "4") {
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
      } else {
        // skip unknown purpose
        continue;
      }

      const prompt = `
Act as a full-stack brand strategist, digital growth consultant, SEO expert, and content writer.

You are tasked with creating a complete identity and growth-ready digital presence for a new or growing company using the following input:

V1: ${companyName}
V2: ${targetAudience}
V3: ${bp}

Please generate only the output for V3 = ${bp}, and DO NOT include other formats.

Also include:
V5 (Goal): ${goal}
V6 (CustomTags): ${customTags || "None"}

Make sure to:
- Use SEO principles and relevant keywords from V6
- Use emotionally resonant copy aligned with V2
- Keep it clear, copy-paste ready, with headings and formatting

${section}
`;

      if (model !== "openai" && model !== "gemini") {
        return res.status(400).json({ error: "Invalid model. Only 'openai' or 'gemini' are supported." });
      }

      const aiResponse = await generateLLMContent(prompt, model);
      responses.push({
        businessPurpose: bp,
        response: aiResponse,
        prompt,
      });
    }

    const combinedResponse = responses.map((r) => r.response).join("\n\n---\n\n");

    // Save log to DB (combined)
    await PromptLog.create({
      prompt: responses.map((r) => r.prompt).join("\n\n---\n\n"),
      response: combinedResponse,
      userId,
      userName,
      model,
      agent: "brand-strategy",
    });

    res.status(200).json({
      response: combinedResponse,
      parts: responses,
    });
  } catch (error) {
    console.error("❌ Error generating brand strategy:", error);
    res.status(500).json({ error: "Failed to generate brand strategy", details: error.message });
  }
};
