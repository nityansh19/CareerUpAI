const mongoose = require("mongoose");

const connectDB = async () => {
  if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI?.trim()) {
    throw new Error("MONGODB_URI is required in production.");
  }
  // Changed: require an explicit cloud database URI instead of silently using localhost in production.
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/careerforge";
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected successfully!");
    return true;
  } catch {
    // Changed: omit the raw database exception because connection errors can contain credentials.
    throw new Error("MongoDB connection failed. Check MONGODB_URI and database network access.");
    // Changed: stop startup on database failure without printing credentials from connection errors.
  }
};

module.exports = connectDB;
