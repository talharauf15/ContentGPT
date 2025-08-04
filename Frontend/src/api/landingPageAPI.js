// src/api/landingPageApi.js
import api from "./axios";

// POST request to generate landing page
export const generateLandingPage = async ({
  companyName,
  targetAudience,
  businessPurpose,
  goal,
  colorScheme,
  email,
  phone,
  socialLinks,
  model = "openai",
  agent = "landing-page",
  userId,
  userName,
}) => {
  try {
    const response = await api.post("/landing-page/generate-landing", {
      companyName,
      targetAudience,
      businessPurpose,
      goal,
      colorScheme,
      email,
      phone,
      socialLinks,
      model,
      agent,
      userId,
      userName,
    });

    return response.data;
  } catch (error) {
    console.error("Error generating landing page:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
