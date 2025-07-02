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
    },
    model: {
      type: String,
      required: true,
      enum: ["openai", "gemini"],
      default: "openai",
    }
  },
  {
    timestamps: true, 
  }
);

const PromptLog = mongoose.model("PromptLog", promptLogSchema);
export default PromptLog;
