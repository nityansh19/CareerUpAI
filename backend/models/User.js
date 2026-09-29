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

const careerMatchSchema = new mongoose.Schema(
  {
    role: { type: String, default: "" },
    readinessScore: { type: Number, default: 0 },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    whyFit: { type: [String], default: [] },
    nextActions: { type: [String], default: [] },
  },
  { _id: false }
);

const careerIntelligenceSchema = new mongoose.Schema(
  {
    targetRole: { type: String, default: "" },
    primaryRole: { type: String, default: "" },
    primaryReadiness: { type: Number, default: 0 },
    matches: { type: [careerMatchSchema], default: [] },
    generatedAt: { type: Date },
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

    careerIntelligence: {
      type: careerIntelligenceSchema,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);