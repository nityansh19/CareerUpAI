const express = require("express");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const { rateLimit } = require("express-rate-limit");
const User = require("../models/User");
const auth = require("../middleware/auth");
const {
  hashPassword,
  verifyPassword,
  issueSession,
} = require("../services/auth");
const { validateWorkspace, text } = require("../services/validation");
const router = express.Router();
function passwordValue(value) {
  if (typeof value !== "string" || !value.length || value.length > 128)
    throw Object.assign(
      new Error("Enter a valid password with at most 128 characters."),
      { status: 400 },
    );
  return value;
}
const engine = import("../../shared/careerEngine.mjs");
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many sign-in attempts. Please try again in 15 minutes.",
  },
});
function serializeUser(user) {
  const data = user.toObject ? user.toObject() : user;
  return {
    id: String(data._id),
    name: data.name,
    email: data.email,
    education: data.education || "",
    skills: data.skills || [],
    careerInterests: data.careerInterests || [],
    careerGoal: data.careerGoal || "",
    cvFile: data.cvFile || "",
    cvOriginalName: data.cvOriginalName || "",
    resumeAnalysis: data.resumeAnalysis || null,
    careerIntelligence: data.careerIntelligence || null,
    workspace: data.workspace || { jobs: [], milestones: {}, interviews: [] },
    workspaceVersion: data.workspaceVersion || 0,
  };
}
const sendUser = (res, user) => res.json({ user: serializeUser(user) });
router.post("/register", authLimit, async (req, res) => {
  const name = text(req.body.name, 100, true),
    email = text(req.body.email, 254, true).toLowerCase(),
    password = passwordValue(req.body.password);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8)
    return res
      .status(400)
      .json({
        message: "Enter a valid email and a password with 8–128 characters.",
      });
  if (await User.exists({ email }))
    return res
      .status(409)
      .json({
        message: "An account with this email already exists. Sign in instead.",
      });
  const user = await User.create({
    name,
    email,
    password: await hashPassword(password),
  });
  const session = await issueSession(user._id);
  return res.status(201).json({ ...session, user: serializeUser(user) });
});
router.post("/login", authLimit, async (req, res) => {
  const email = text(req.body.email, 254, true).toLowerCase(),
    password = passwordValue(req.body.password);
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await verifyPassword(password, user.password)))
    return res
      .status(401)
      .json({ message: "The email or password is incorrect." });
  // Upgrade old plaintext records only after the owner proves the password.
  if (!user.password.startsWith("scrypt:")) {
    user.password = await hashPassword(password);
    await user.save();
  }
  const session = await issueSession(user._id);
  res.json({ ...session, user: serializeUser(user) });
});
router.get("/me", auth, (req, res) => sendUser(res, req.user));
router.post("/logout", auth, async (req, res) => {
  await req.session.deleteOne();
  res.json({ message: "Signed out." });
});
router.put("/workspace", auth, async (req, res) => {
  const fields = validateWorkspace(req.body);
  const { buildCareerIntelligence } = await engine;
  const careerIntelligence = fields.skills.length
    ? buildCareerIntelligence({ ...serializeUser(req.user), ...fields })
    : null;
  const user = await User.findOneAndUpdate(
    {
      _id: req.user._id,
      ...(req.body.expectedVersion === 0
        ? {
            $or: [
              { workspaceVersion: 0 },
              { workspaceVersion: { $exists: false } },
            ],
          }
        : { workspaceVersion: req.body.expectedVersion }),
    },
    { $set: { ...fields, careerIntelligence }, $inc: { workspaceVersion: 1 } },
    { new: true, runValidators: true },
  );
  if (!user)
    return res
      .status(409)
      .json({
        message:
          "Your workspace changed in another session. Reload this page before saving again.",
      });
  sendUser(res, user);
});
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0 },
}).single("cv");
router.post("/analyze-resume/:id", auth, (req, res, next) => {
  upload(req, res, (error) => {
    if (error)
      return res
        .status(400)
        .json({
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "Choose a PDF smaller than 5 MB."
              : "Upload one PDF file and try again.",
        });
    (async () => {
      const file = req.file;
      if (
        !file ||
        !file.originalname.toLowerCase().endsWith(".pdf") ||
        !file.buffer.subarray(0, 1024).includes(Buffer.from("%PDF-"))
      )
        return res.status(400).json({ message: "Choose a valid PDF resume." });
      let parser;
      try {
        parser = new PDFParse({
          data: new Uint8Array(file.buffer),
          isEvalSupported: false,
        });
        const info = await parser.getInfo();
        if (info.total > 10)
          return res
            .status(400)
            .json({ message: "Choose a PDF with 10 pages or fewer." });
        const parsed = await parser.getText();
        const source = parsed.pages.map((p) => p.text).join("\n");
        const { analyzeResumeText, buildCareerIntelligence } = await engine;
        const report = analyzeResumeText(source, serializeUser(req.user), {
          pages: info.total,
          source: "pdf",
          fileName: file.originalname,
        });
        const career = buildCareerIntelligence({
          ...serializeUser(req.user),
          resumeAnalysis: report,
        });
        const user = await User.findByIdAndUpdate(
          req.user._id,
          {
            $set: {
              resumeAnalysis: report,
              careerIntelligence: career,
              cvFile: "account-pdf",
              cvOriginalName: file.originalname.slice(0, 250),
              resumeData: file.buffer,
            },
            $inc: { workspaceVersion: 1 },
          },
          { new: true },
        );
        sendUser(res, user);
      } catch (error) {
        if (error.name === "MongoServerError") throw error;
        res
          .status(422)
          .json({
            message:
              "This PDF could not be read. Export a text-based PDF without password protection, or paste its text.",
          });
      } finally {
        if (parser) await parser.destroy().catch(() => {});
      }
    })().catch(next);
  });
});
router.post("/analyze-text", auth, async (req, res) => {
  const source = text(req.body.text, 60000, true);
  const { analyzeResumeText, buildCareerIntelligence } = await engine;
  let report;
  try {
    report = analyzeResumeText(source, serializeUser(req.user));
  } catch (error) {
    return res.status(422).json({ message: error.message });
  }
  const career = buildCareerIntelligence({
    ...serializeUser(req.user),
    resumeAnalysis: report,
  });
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { resumeAnalysis: report, careerIntelligence: career },
      $inc: { workspaceVersion: 1 },
    },
    { new: true },
  );
  sendUser(res, user);
});
router.get("/resume", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("+resumeData");
  if (!user.resumeData)
    return res
      .status(404)
      .json({ message: "Upload a PDF to save an original file." });
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="resume.pdf"`,
  });
  res.send(user.resumeData);
});
router.post("/career-intelligence/:id", auth, async (req, res) => {
  if (!req.user.skills.length)
    return res
      .status(422)
      .json({ message: "Add your skills before comparing career paths." });
  const { buildCareerIntelligence } = await engine;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        careerIntelligence: buildCareerIntelligence(serializeUser(req.user)),
      },
      $inc: { workspaceVersion: 1 },
    },
    { new: true },
  );
  sendUser(res, user);
});
// No legacy ID-only routes: every data operation requires an authenticated owner.
module.exports = router;
module.exports.serializeUser = serializeUser;
