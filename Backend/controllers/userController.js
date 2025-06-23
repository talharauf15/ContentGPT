// controller/userController.js
import User from "../models/userModel.js";

// Create or update user in DB
export const saveUser = async (req, res) => {
  try {
    const {
      userId,
      username,
      fullName,
      firstName,
      lastName,
      email,
      emailId,
      passwordEnabled,
      twoFactorEnabled,
      hasVerifiedEmailAddress,
      imageUrl,
      createdAtClerk,
      lastSignInAt,
    } = req.body;

    const existingUser = await User.findOne({ userId });

    let user;
    if (existingUser) {
      user = await User.findOneAndUpdate(
        { userId },
        {
          username,
          fullName,
          firstName,
          lastName,
          email,
          emailId,
          passwordEnabled,
          twoFactorEnabled,
          hasVerifiedEmailAddress,
          imageUrl,
          createdAtClerk,
          lastSignInAt,
        },
        { new: true }
      );
    } else {
      user = await User.create({
        userId,
        username,
        fullName,
        firstName,
        lastName,
        email,
        emailId,
        passwordEnabled,
        twoFactorEnabled,
        hasVerifiedEmailAddress,
        imageUrl,
        createdAtClerk,
        lastSignInAt,
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ error: "Failed to save user" });
  }
};
