import User from "../models/userModel.js";

export const saveUser = async (req, res) => {
  try {
    const fields = { ...req.body };
    const user = await User.findOneAndUpdate(
      { userId: fields.userId },
      fields,
      { new: true, upsert: true }
    );
    res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "User with this userId already exists." });
    }
    console.error("❌ Error saving user:", error);
    res.status(500).json({ error: "Failed to save user" });
  }
};
