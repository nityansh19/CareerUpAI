const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");

const router = express.Router();

// ===============================
// MULTER CONFIGURATION
// ===============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ===============================
// TEST ROUTE
// ===============================

router.get("/test", (req, res) => {
  res.json({
    message: "User API is working!",
  });
});

// ===============================
// REGISTER USER
// ===============================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ===============================
// LOGIN USER
// ===============================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ===============================
// UPDATE USER PROFILE
// ===============================

router.put("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullName,
      education,
      skills,
      interests,
      careerGoal,
    } = req.body;

    if (!fullName || !education || !skills || !interests || !careerGoal) {
      return res.status(400).json({
        message: "All profile fields are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        name: fullName,
        education,

        skills: skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),

        careerInterests: interests
          .split(",")
          .map((interest) => interest.trim())
          .filter((interest) => interest !== ""),

        careerGoal,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

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
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ===============================
// UPLOAD CV
// ===============================

router.post(
  "/upload-cv/:id",
  upload.single("cv"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          message: "Please upload a PDF CV.",
        });
      }

      const user = await User.findByIdAndUpdate(
        id,
        {
          cvFile: req.file.filename,
          cvOriginalName: req.file.originalname,
        },
        {
          new: true,
        }
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "CV uploaded successfully!",

        cv: {
          originalName: req.file.originalname,
          fileName: req.file.filename,
          size: req.file.size,
        },

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "CV upload failed",
      });
    }
  }
);

module.exports = router;