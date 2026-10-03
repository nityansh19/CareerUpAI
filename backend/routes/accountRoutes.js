const express = require("express");
const multer = require("multer");
const { randomBytes } = require("node:crypto");
const { PDFParse } = require("pdf-parse");
const Account = require("../models/CloudAccount");
const Session = require("../models/CloudSession");
const { hashPassword, verifyPassword, hashToken, rateLimit } = require("../services/cloudAuth");
const { analyzeResumeText } = require("../services/resumeAnalyzer");
const { generateCareerIntelligence } = require("../services/careerIntelligence");
const router = express.Router();
// Added: provide authenticated cloud APIs for the active workspace.

function publicAccount(account) {
  const value = account.toObject();
  const { _id, name, email, education, careerGoal, skills, careerInterests, jobs, interview,
    cvOriginalName, resumeAnalysis, careerIntelligence, profileVersion, jobsVersion,
    interviewVersion, resumeVersion } = value;
  return { id: String(_id), name, email, education, careerGoal, skills, careerInterests,
    jobs, interview, cvOriginalName, cvFile: cvOriginalName ? "cloud" : "", resumeAnalysis,
    careerIntelligence, profileVersion, jobsVersion, interviewVersion, resumeVersion,
    isLocalDemo: false, demoWorkspace: false };
}
// Added: explicitly whitelist response fields so password hashes, PDF bytes and internal fields never reach profile responses.

function string(value, max, required = false) {
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) {
    const error = new Error("Check the required fields and their lengths.");
    error.status = 400;
    throw error;
  }
  return value.trim();
}
// Added: reject objects and oversized values before sending account input to MongoDB.

function list(value) {
  if (!Array.isArray(value) || value.length > 100) throw Object.assign(new Error("Use up to 100 skills or interests."), { status: 400 });
  return [...new Set(value.map((item) => string(item, 100, true)))];
}
// Added: validate and deduplicate profile lists.

async function issueSession(account, res, status = 200) {
  const token = randomBytes(32).toString("hex");
  await Session.create({ tokenHash: hashToken(token), accountId: account._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  res.status(status).json({ token, user: publicAccount(account) });
}
// Added: create a seven-day, revocable session usable on separate frontend/backend domains.

router.use((req, res, next) => { res.set("Cache-Control", "no-store"); next(); });
// Added: prevent account and resume responses from being cached by intermediaries.

const authLimit = rateLimit(20, 15 * 60 * 1000);
router.post(["/register", "/login"], authLimit);
// Added: share a bounded login/registration attempt limit.

router.post("/register", async (req, res) => {
  const email = string(req.body.email, 254, true).toLowerCase();
  const name = string(req.body.name, 120, true);
  const password = req.body.password;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof password !== "string" || password.length < 8 || password.length > 128) {
    return res.status(400).json({ message: "Enter a valid email and a password of 8–128 characters." });
  }
  const passwordHash = await hashPassword(password);
  try {
    const account = await Account.create({ name, email, passwordHash });
    await issueSession(account, res, 201);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "An account already exists with this email. Sign in instead." });
    throw error;
  }
});
// Added: register actual cloud accounts with normalized unique email addresses and salted password hashes.

router.post("/login", async (req, res) => {
  const email = string(req.body.email, 254, true).toLowerCase();
  const password = req.body.password;
  if (typeof password !== "string" || !password.length || password.length > 128) return res.status(401).json({ message: "Invalid email or password." });
  const account = await Account.findOne({ email }).select("+passwordHash");
  const valid = account ? await verifyPassword(password, account.passwordHash) : await verifyPassword(password, `${"0".repeat(32)}:${"0".repeat(128)}`);
  if (!account || !valid) return res.status(401).json({ message: "Invalid email or password." });
  await issueSession(account, res);
});
// Added: require verified credentials; signing in no longer silently creates a local account.

router.use(async (req, res, next) => {
  const match = /^Bearer ([a-f0-9]{64})$/.exec(req.get("Authorization") || "");
  if (!match) return res.status(401).json({ message: "Please sign in to continue." });
  const session = await Session.findOne({ tokenHash: hashToken(match[1]), expiresAt: { $gt: new Date() } });
  if (!session) return res.status(401).json({ message: "Your session expired. Please sign in again." });
  req.account = await Account.findById(session.accountId);
  if (!req.account) return res.status(401).json({ message: "Please sign in again." });
  req.session = session;
  next();
});
// Added: determine ownership from the verified session, never from a user-supplied account ID.

router.get("/me", (req, res) => res.json({ user: publicAccount(req.account) }));
router.post("/logout", async (req, res) => { await req.session.deleteOne(); res.sendStatus(204); });
// Added: load the latest shared workspace and revoke the current session on sign-out.

async function updateSection(req, res, section, values, extraFilter = {}, extraVersions = {}) {
  const versionKey = `${section}Version`;
  const version = req.body.version;
  if (!Number.isSafeInteger(version) || version < 0) return res.status(400).json({ message: "Refresh your workspace before saving." });
  const account = await Account.findOneAndUpdate({ _id: req.account._id, [versionKey]: version, ...extraFilter },
    { $set: values, $inc: { [versionKey]: 1, ...extraVersions } }, { new: true, runValidators: true });
  if (!account) return res.status(409).json({ message: "This data changed on another device. Reload before saving again." });
  res.json({ user: publicAccount(account) });
}
// Added: atomically reject stale edits instead of overwriting newer changes from another device.

router.put("/profile", async (req, res) => {
  await updateSection(req, res, "profile", {
    name: string(req.body.name, 120, true), education: string(req.body.education, 500),
    careerGoal: string(req.body.careerGoal, 200), skills: list(req.body.skills),
    careerInterests: list(req.body.careerInterests), resumeAnalysis: null, careerIntelligence: null,
  }, {}, { resumeVersion: 1 });
});
// Added: save profiles online and invalidate reports tied to the old profile.

router.put("/jobs", async (req, res) => {
  if (!Array.isArray(req.body.jobs) || req.body.jobs.length > 500) return res.status(400).json({ message: "Save up to 500 jobs." });
  const jobs = req.body.jobs.map((job) => {
    const stage = string(job.stage, 20, true);
    const url = string(job.url, 2000);
    if (!["Saved", "Applied", "Interview", "Offer", "Closed"].includes(stage) || (url && !/^https?:\/\//i.test(url))) {
      throw Object.assign(new Error("Choose a valid job stage and an http or https link."), { status: 400 });
    }
    return { id: string(job.id, 100, true), role: string(job.role, 200, true), company: string(job.company, 200, true),
      location: string(job.location, 200), url, stage, createdAt: string(job.createdAt, 40, true) };
  });
  if (new Set(jobs.map((job) => job.id)).size !== jobs.length) return res.status(400).json({ message: "Duplicate job IDs are not allowed." });
  await updateSection(req, res, "jobs", { jobs });
});
// Added: validate and persist each account's job list with a revision check.

router.put("/interview", async (req, res) => {
  const value = req.body.interview;
  if (!value || !["Mixed", "Technical", "Behavioral"].includes(value.type) || !["Foundations", "Standard", "Advanced"].includes(value.difficulty) ||
      typeof value.started !== "boolean" || !Number.isInteger(value.step) || value.step < 0 || value.step > 3 ||
      !Array.isArray(value.answers) || value.answers.length !== value.step) return res.status(400).json({ message: "Invalid interview progress." });
  const interview = { role: string(value.role, 200), type: value.type, difficulty: value.difficulty,
    started: value.started, step: value.step, answer: string(value.answer, 10000), answers: value.answers.map((answer) => string(answer, 10000)) };
  await updateSection(req, res, "interview", { interview });
});
// Added: persist interview notes and progress with bounded input and conflict detection.

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 2 } }).single("resume");
router.post("/resume", rateLimit(20, 15 * 60 * 1000), upload, async (req, res) => {
  const file = req.file;
  if (!file || !/\.pdf$/i.test(file.originalname) || !file.buffer.subarray(0, 1024).includes(Buffer.from("%PDF-"))) {
    return res.status(400).json({ message: "Choose a valid PDF smaller than 5 MB." });
  }
  req.body.version = Number(req.body.version);
  let analysis = null;
  if (req.body.analyze === "true") {
    let parser;
    try {
      parser = new PDFParse({ data: new Uint8Array(file.buffer), isEvalSupported: false });
      const info = await parser.getInfo();
      if (info.total > 10) return res.status(400).json({ message: "Choose a resume with 10 pages or fewer." });
      const parsed = await parser.getText();
      const text = parsed.pages.map((page) => page.text).join("\n");
      if (text.trim().length < 80) return res.status(422).json({ message: "Use a text-based PDF with readable resume content." });
      analysis = analyzeResumeText(text, req.account);
    } catch {
      return res.status(422).json({ message: "This PDF could not be read. Export a text-based PDF and try again." });
    } finally { if (parser) await parser.destroy().catch(() => {}); }
  }
  await updateSection(req, res, "resume", { resume: file.buffer, cvOriginalName: file.originalname.slice(0, 255),
    resumeAnalysis: analysis, careerIntelligence: null }, { profileVersion: req.account.profileVersion });
});
// Added: store the PDF durably in MongoDB and analyze its actual text; no uploaded file depends on Render's temporary disk.

router.get("/resume", async (req, res) => {
  const account = await Account.findById(req.account._id).select("+resume");
  if (!account?.resume) return res.status(404).json({ message: "No resume has been uploaded to this account." });
  res.type("application/pdf").set("X-Content-Type-Options", "nosniff").attachment("resume.pdf").send(account.resume);
});
// Added: allow authenticated resume downloads on any device without exposing a public file URL.

router.post("/career", async (req, res) => {
  if (!req.account.careerGoal || !req.account.skills.length) return res.status(422).json({ message: "Add your target role and skills to your profile first." });
  const account = await Account.findOneAndUpdate({ _id: req.account._id, profileVersion: req.account.profileVersion, resumeVersion: req.account.resumeVersion },
    { $set: { careerIntelligence: generateCareerIntelligence(req.account) } }, { new: true });
  if (!account) return res.status(409).json({ message: "Your profile changed. Reload and try again." });
  res.json({ user: publicAccount(account) });
});
// Added: generate and persist rule-based career guidance using the authenticated profile.

module.exports = router;
// Added: expose the cloud account router to Express.
