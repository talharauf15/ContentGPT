import api from "./axios";


export const createPromptLog = async ({ prompt, response, userId, userName, model }) => {
  try {
    const res = await api.post("/prompt-logs", {
      prompt,
      response,
      userId,
      userName,
      model,
    });
    return res.data; 
  } catch (error) {
    console.error("❌ Error creating prompt log:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};


export const getAllPromptLogs = async (userId) => {
  return await api.get(`/prompt-logs`,{
    params: {userId},
  });
};
