const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { rateLimit } = require("express-rate-limit");
const connectDB = require("./db");
const app = express();
app.disable("x-powered-by");
app.set(
  "trust proxy",
  Number(process.env.TRUST_PROXY || (process.env.RENDER ? "1" : "0")),
);
const origins = (
  process.env.ALLOWED_ORIGINS ||
  "https://career-up-ai-delta.vercel.app,http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((s) => s.trim());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origins.includes(origin)) return callback(null, true);
      callback(
        Object.assign(new Error("This origin is not allowed."), {
          status: 403,
        }),
      );
    },
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
  });
  next();
});
app.use(express.json({ limit: "3mb" }));
app.get("/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res
    .status(connected ? 200 : 503)
    .json({
      status: connected ? "ok" : "degraded",
      database: connected ? "connected" : "unavailable",
      version: 3,
      capabilities: connected
        ? ["verified-accounts", "workspace-sync", "resume-text-review"]
        : [],
    });
});
app.use(
  "/api",
  rateLimit({
    windowMs: 60000,
    limit: 120,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Too many requests. Please try again shortly." },
  }),
);
app.use(
  "/api/users",
  (req, res, next) => {
    if (mongoose.connection.readyState !== 1)
      return res
        .status(503)
        .json({
          message:
            "The online workspace is temporarily unavailable. Please try again shortly.",
        });
    next();
  },
  require("./routes/userRoutes"),
);
app.get("/", (req, res) =>
  res.json({ service: "CareerUpAI", version: 3, health: "/health" }),
);
app.use((req, res) =>
  res.status(404).json({ message: "This endpoint does not exist." }),
);
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.status || error.statusCode || 500;
  console.error("CareerUpAI request failed:", error.name);
  res
    .status(error.code === 11000 ? 409 : status)
    .json({
      message:
        error.code === 11000
          ? "An account with this email already exists."
          : status < 500
            ? error.message
            : "The request could not be completed. Please try again.",
    });
});
async function startServer() {
  await connectDB();
  const server = app.listen(process.env.PORT || 5000, "0.0.0.0", () =>
    console.log("CareerUpAI API listening."),
  );
  const close = () =>
    server.close(() => mongoose.disconnect().finally(() => process.exit(0)));
  process.on("SIGTERM", close);
  process.on("SIGINT", close);
  return server;
}
if (require.main === module)
  startServer().catch(() => {
    console.error("CareerUpAI could not start.");
    process.exit(1);
  });
module.exports = { app, startServer };
