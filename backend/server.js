const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./db");

const accountRoutes = require("./routes/accountRoutes");
// Changed: load the authenticated cloud routes used by the active frontend.

const app = express();
app.set("trust proxy", 1);
// Added: use the client address supplied by Render's single reverse proxy for rate limiting.
app.disable("x-powered-by");
// Added: omit the unnecessary framework identification header.
const PORT = process.env.PORT || 5000;


const allowedOrigins = (process.env.FRONTEND_URL || (process.env.NODE_ENV === "production" ? "https://careerupai.netlify.app" : "http://localhost:5173"))
  .split(",").map((origin) => origin.trim()).filter(Boolean);
// Changed: read allowed frontend origins from hosting configuration, with separate cloud and local defaults.
app.use(cors({ origin: allowedOrigins }));
// Changed: allow browser access from the configured frontend instead of every website; this is not authentication.
app.use(express.json({ limit: "256kb" }));
// Changed: bound workspace JSON requests while allowing job lists and interview notes.

app.get("/health", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? "ok" : "degraded",
    database: databaseReady ? "connected" : "unavailable",
  });
});

// User routes
app.use("/api/account", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "CareerUp database is temporarily unavailable.",
    });
  }
  next();
}, accountRoutes);
// Changed: apply database readiness checks to the new authenticated account API.

app.use(["/api/users", "/api/resume-analysis"], (req, res) => {
  res.status(410).json({ message: "This legacy API has been retired. Use the updated CareerUp app." });
});
// Changed: retire unauthenticated legacy routes rather than expose plaintext-password accounts or user-ID-only access online.

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.code === "LIMIT_FILE_SIZE" ? 413 : error.name === "MulterError" ? 400 : error.status || 500;
  res.status(status).json({ message: status === 413 ? "Choose a PDF smaller than 5 MB." :
    status >= 500 ? "The server could not complete this request. Please try again." : error.message });
});
// Added: return bounded, credential-free JSON errors for failed cloud requests and uploads.

app.get("/", (req, res) => {
  res.send("CareerUp AI Backend is Running!");
});

async function startServer() {
  await connectDB();
  await Promise.all([require("./models/CloudAccount").init(), require("./models/CloudSession").init()]);
  // Added: finish unique email/session and expiration indexes before accepting registrations.

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CareerUp AI Backend running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
// Changed: exit with a failure status when database startup fails so the host cannot report a healthy deployment.
