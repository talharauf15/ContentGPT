// services/llmService.js
import openai from '../config/openai.js';
// import gemini from '../config/gemini.js'; // if using Gemini as fallback

export const generateLandingPage = async (prompt) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
};
