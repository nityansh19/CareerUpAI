const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    overallScore: { type: Number, default: 0 },
    structureScore: { type: Number, default: 0 },
    contentScore: { type: Number, default: 0 },
    impactScore: { type: Number, default: 0 },
    roleAlignmentScore: { type: Number, default: 0 },
    detectedSkills: { type: [String], default: [] },
    strengths: { type: [String], default: [] },
    gaps: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    targetRole: { type: String, default: "" },
    analyzedAt: { type: Date },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    education: {
      type: String,
      default: "",
    },

    careerInterests: {
      type: [String],
      default: [],
    },

    careerGoal: {
      type: String,
      default: "",
    },

    cvFile: {
      type: String,
      default: "",
    },

    cvOriginalName: {
      type: String,
      default: "",
    },

    resumeAnalysis: {
      type: resumeAnalysisSchema,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);