const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    password: { type: String, required: true, select: false },
    emailVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date, default: null },
    emailVerificationCode: { type: String, default: null, select: false },
    emailVerificationExpiresAt: { type: Date, default: null, select: false },
    emailVerificationAttempts: { type: Number, default: 0, select: false },
    education: { type: String, default: "", maxlength: 500 },
    skills: { type: [String], default: [] },
    careerInterests: { type: [String], default: [] },
    careerGoal: { type: String, default: "", maxlength: 200 },
    cvFile: { type: String, default: "" },
    cvOriginalName: { type: String, default: "" },
    resumeData: { type: Buffer, select: false },
    resumeAnalysis: { type: mongoose.Schema.Types.Mixed, default: null },
    careerIntelligence: { type: mongoose.Schema.Types.Mixed, default: null },
    workspace: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({ jobs: [], milestones: {}, interviews: [] }),
    },
    workspaceVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
);
module.exports = mongoose.model("User", userSchema);
