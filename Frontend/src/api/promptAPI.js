import api from "./axios";


export const createPrompt = async (prompt) => {
    try {
      const response = await api.post('/prompts', { prompt });
      return response.data; 
    } catch (error) {
      console.error('Error posting prompt:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  };

  export const getAllPrompts = async () => {
    try {
      const response = await api.get("/prompts");
      return response.data; 
    } catch (error) {
      console.error("Error fetching prompts:", error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  };
  