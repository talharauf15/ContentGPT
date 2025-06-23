import api from "./axios"; 

export const saveUserToBackend = async (userData) => {
  try {
    const res = await api.post("/users", userData);
    // console.log("✅ User saved:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Failed to save user:", error.response?.data || error.message);
  }
};
