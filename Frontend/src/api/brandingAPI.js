import api from "./axios";

// POST request to generate brand strategy
export const generateBrandStrategy = async ({
  companyName,
  targetAudience,
  businessPurpose,
  goal,
  customTags,
  model = "openai",
}) => {
  try {
    const response = await api.post("/prompts/generate-strategy", {
      companyName,
      targetAudience,
      businessPurpose,
      goal,
      customTags,
      model,
    });
    return response.data;
  } catch (error) {
    console.error("Error generating brand strategy:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
