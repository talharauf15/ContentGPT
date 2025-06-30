import api from "./axios"; 

export const saveUserToBackend = async (userData) => {
  try {
    const res = await api.post("/users", userData);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to save user:", error.response?.data || error.message);
  }
};
