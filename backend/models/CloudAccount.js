const mongoose = require("mongoose");
// Added: use MongoDB for cloud accounts instead of browser-only credentials.

const schema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  name: { type: String, required: true },
  education: { type: String, default: "" },
  careerGoal: { type: String, default: "" },
  skills: { type: [String], default: [] },
  careerInterests: { type: [String], default: [] },
  jobs: { type: [mongoose.Schema.Types.Mixed], default: [] },
  interview: { type: mongoose.Schema.Types.Mixed, default: null },
  resume: { type: Buffer, select: false },
  cvOriginalName: { type: String, default: "" },
  resumeAnalysis: { type: mongoose.Schema.Types.Mixed, default: null },
  careerIntelligence: { type: mongoose.Schema.Types.Mixed, default: null },
  profileVersion: { type: Number, default: 0 },
  jobsVersion: { type: Number, default: 0 },
  interviewVersion: { type: Number, default: 0 },
  resumeVersion: { type: Number, default: 0 },
}, { timestamps: true });
// Added: persist profiles, jobs, practice and one PDF (limited to 5 MB by the API); keep passwords and PDF bytes out of normal queries.

module.exports = mongoose.model("CloudAccount", schema);
// Added: keep new authenticated accounts separate from the legacy plaintext-password collection.
