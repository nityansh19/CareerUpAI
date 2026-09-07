const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const pdf = require("pdf-parse");
const User = require("../models/User");
const { analyzeResumeText } = require("../services/resumeAnalyzer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed."));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/test", (req, res) => {
  res.json({ message: "User API is working!" });
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      message: "User registered successfully!",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        education: user.education,
        skills: user.skills,
        careerInterests: user.careerInterests,
        careerGoal: user.careerGoal,
        cvFile: user.cvFile,
        cvOriginalName: user.cvOriginalName,
        resumeAnalysis: user.resumeAnalysis,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, education, skills, interests, careerGoal } = req.body;

    if (!fullName || !education || !skills || !interests || !careerGoal) {
      return res.status(400).json({ message: "All profile fields are required" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        name: fullName,
        education,
        skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        careerInterests: interests.split(",").map((interest) => interest.trim()).filter(Boolean),
        careerGoal,
      },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile saved successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        education: user.education,
        skills: user.skills,
        careerInterests: user.careerInterests,
        careerGoal: user.careerGoal,
        cvFile: user.cvFile,
        cvOriginalName: user.cvOriginalName,
        resumeAnalysis: user.resumeAnalysis,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/upload-cv/:id", upload.single("cv"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ message: "Please upload a PDF CV." });

    const user = await User.findByIdAndUpdate(
      id,
      { cvFile: req.file.filename, cvOriginalName: req.file.originalname },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "CV uploaded successfully!",
      cv: { originalName: req.file.originalname, fileName: req.file.filename, size: req.file.size },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        education: user.education,
        skills: user.skills,
        careerInterests: user.careerInterests,
        careerGoal: user.careerGoal,
        cvFile: user.cvFile,
        cvOriginalName: user.cvOriginalName,
        resumeAnalysis: user.resumeAnalysis,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "CV upload failed" });
  }
});

router.post("/analyze-resume/:id", upload.single("cv"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!req.file) return res.status(400).json({ message: "Please upload a PDF resume." });

    const buffer = await fs.readFile(req.file.path);
    const parsed = await pdf(buffer);
    const text = (parsed.text || "").trim();

    if (text.length < 80) {
      return res.status(422).json({
        message: "We could not extract enough text from this PDF. Try exporting your resume as a text-based PDF instead of an image scan.",
      });
    }

    const analysis = analyzeResumeText(text, user);
    user.cvFile = req.file.filename;
    user.cvOriginalName = req.file.originalname;
    user.resumeAnalysis = analysis;
    await user.save();

    res.json({
      message: "Resume analysis complete.",
      analysis,
      cv: { originalName: req.file.originalname, fileName: req.file.filename, size: req.file.size },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        education: user.education,
        skills: user.skills,
        careerInterests: user.careerInterests,
        careerGoal: user.careerGoal,
        cvFile: user.cvFile,
        cvOriginalName: user.cvOriginalName,
        resumeAnalysis: user.resumeAnalysis,
      },
    });
  } catch (error) {
    console.error("Resume analysis error:", error);
    res.status(500).json({ message: "Resume analysis failed. Please try again." });
  }
});

router.get("/resume-analysis/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("resumeAnalysis cvOriginalName careerGoal");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ analysis: user.resumeAnalysis || null, cvOriginalName: user.cvOriginalName, careerGoal: user.careerGoal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load resume analysis" });
  }
});

module.exports = router;