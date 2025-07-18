import api from "./axios";


export const createPrompt = async (prompt) => {
    try {
      const response = await api.post('/brand-strategy', { prompt });
      return response.data; 
    } catch (error) {
      console.error('Error posting prompt:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  };

  export const getAllPrompts = async () => {
    try {
      const response = await api.get("/brand-strategy");
      return response.data; 
    } catch (error) {
      console.error("Error fetching prompts:", error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  };
  