// services/llmService.js
import openai from '../config/openai.js';
import genAI from '../config/gemini.js'; // now enabled

export const generateLLMContent = async (prompt, model = 'openai') => {
  try {
    if (model === 'openai') {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      return completion.choices[0].message.content;

    } else if (model === 'gemini') {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();

    } else {
      throw new Error(`Unsupported model type: ${model}`);
    }
  } catch (error) {
    console.error('❌ Error generating LLM content:', error.message);
    return `Error: ${error.message}`;
  }
};
