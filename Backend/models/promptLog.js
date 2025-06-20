// models/PromptLog.js
import mongoose from "mongoose";

const promptLogSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const PromptLog = mongoose.model("PromptLog", promptLogSchema);
export default PromptLog;
