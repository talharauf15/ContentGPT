import mongoose from 'mongoose';

const LandingPageAgentSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  targetAudience: { type: String, required: true },
  businessPurpose: { type: String, required: true },
  goal: { type: String, default: 'High-conversion engagement & lead generation' },
  colorScheme: { type: String, default: null },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  socialLinks: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model('LandingPageAgent', LandingPageAgentSchema);
