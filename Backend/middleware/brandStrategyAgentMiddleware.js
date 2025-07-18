
export const validatePrompt = (req, res, next) => {
  const { companyName, targetAudience, businessPurpose, goal } = req.body;

  if (!companyName || typeof companyName !== "string" || companyName.trim() === "") {
    return res.status(400).json({ error: "Company name is required and must be a non-empty string." });
  }

  if (!targetAudience || typeof targetAudience !== "string" || targetAudience.trim() === "") {
    return res.status(400).json({ error: "Target audience is required and must be a non-empty string." });
  }

  if (!businessPurpose || typeof businessPurpose !== "string" || businessPurpose.trim() === "") {
    return res.status(400).json({ error: "Business purpose is required and must be a non-empty string." });
  }

  if (!goal || typeof goal !== "string" || goal.trim() === "") {
    return res.status(400).json({ error: "Goal is required and must be a non-empty string." });
  }

  // Trim all string fields
  req.body.companyName = companyName.trim();
  req.body.targetAudience = targetAudience.trim();
  req.body.businessPurpose = businessPurpose.trim();
  req.body.goal = goal.trim();
  
  next();
};
  