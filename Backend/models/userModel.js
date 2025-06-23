import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true, // For faster lookup
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    emailId: {
      type: String,
    },
    passwordEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    hasVerifiedEmailAddress: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
    },
    createdAtClerk: {
      type: Date,
    },
    lastSignInAt: {
      type: Date,
    },

  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model("User", userSchema);
export default User;
