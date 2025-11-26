import mongoose from "mongoose";

const brandStrategyAgentSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    targetAudience: { type: String, required: true },
    // now supports multiple purposes: ["1", "2", ...]
    businessPurpose: { type: [String], required: true },
    goal: { type: String, required: true },
    customTags: { type: String },
  },
  { timestamps: true }
);

const BrandStrategyAgent = mongoose.model("BrandStrategyAgent", brandStrategyAgentSchema);
export default BrandStrategyAgent; 