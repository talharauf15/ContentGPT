// controllers/landingPageController.js
import PromptLog from "../models/promptLog.js";
import LandingPageAgent from "../models/LandingPageAgent.js";
import { generateLLMContent } from '../services/llmService.js';

export const createLandingPage = async (req, res) => {
  try {
    const inputs = req.body;

    // Required fields
    const requiredFields = ['companyName', 'targetAudience', 'businessPurpose', 'email'];
    for (const field of requiredFields) {
      if (!inputs[field]) {
        return res.status(400).json({ error: `${field} is required.` });
      }
    }

    // Destructure fields with defaults
    const {
      companyName,
      targetAudience,
      businessPurpose,
      goal = 'High-conversion engagement & lead generation',
      colorScheme = null,
      email,
      phone = '',
      socialLinks = [],
      model = 'openai', 
      agent,
      userId,
      userName,
    } = inputs;

    await LandingPageAgent.create({
      companyName,
      targetAudience,
      businessPurpose,
      goal,
      colorScheme,
      email,
      phone,
      socialLinks,
    });

    // Build final prompt string
    const finalPrompt = `
✨ Act as a senior full-stack web developer and UI/UX designer who builds high-conversion, fast-loading, and fully responsive landing pages with:
✅ Semantic HTML5
✅ Tailwind CSS via CDN
✅ Vanilla JavaScript only (no frameworks)
✅ PHP’s native mail() function for secure form handling

🧠 Mission:
Build a fully functional, visually appealing landing page for:
Company / Brand Name: ${companyName}
Target Audience: ${targetAudience}
Business Purpose: ${businessPurpose}
Goal of Landing Page: ${goal}

🎨 Preferred Color Scheme: ${colorScheme ? colorScheme : '(Choose based on industry)'}

📞 Contact Information:
Email: ${email}
Phone: ${phone}

🔗 Social Media Links: ${socialLinks.length ? socialLinks.join(', ') : 'None Provided'}

[Generate full responsive HTML + Tailwind CSS landing page layout with all the sections mentioned, functional form with PHP mail(), scroll animations, Font Awesome icons, and semantic HTML5. Comment code sections for clarity. Only provide me the code nothing else.]
    `;

    // Send to LLM (OpenAI or Gemini based on user input)
    const generatedCode = await generateLLMContent(finalPrompt, model);

    // Save log to DB
    const log = await PromptLog.create({
      prompt: finalPrompt,
      response: generatedCode,
      userId,
      userName,
      model,
      agent: "landing-page",
    });

    return res.status(200).json({ result: generatedCode });
  } catch (error) {
    console.error('❌ Error in createLandingPage:', error);
    return res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  }
};
