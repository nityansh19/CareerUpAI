const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./db");

const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? "ok" : "degraded",
    database: databaseReady ? "connected" : "unavailable",
  });
});

// User routes
app.use("/api/users", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "CareerUp database is temporarily unavailable.",
    });
  }
  next();
}, userRoutes);

app.use("/api/resume-analysis", require("./routes/resumeRoutes"));

app.get("/", (req, res) => {
  res.send("CareerUp AI Backend is Running!");
});

async function startServer() {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CareerUp AI Backend running on port ${PORT}`);
  });
}

startServer();