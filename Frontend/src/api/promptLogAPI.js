import api from "./axios";


export const createPromptLog = async ({ prompt, response, userId, userName }) => {
  try {
    const res = await api.post("/prompt-logs", {
      prompt,
      response,
      userId,
      userName,
    });
    return res.data; // only return useful data
  } catch (error) {
    console.error("❌ Error creating prompt log:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};


export const getAllPromptLogs = async () => {
  return await api.get("/prompt-logs");
};
