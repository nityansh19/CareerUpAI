const mongoose = require("mongoose");
module.exports = async function connectDB() {
  const uri =
    process.env.MONGODB_URI ||
    (process.env.NODE_ENV === "production"
      ? null
      : "mongodb://127.0.0.1:27017/careerupai");
  if (!uri) {
    console.error("MONGODB_URI is required for online workspaces.");
    return false;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("CareerUpAI database connected.");
    return true;
  } catch {
    console.error(
      "CareerUpAI database unavailable. Check MONGODB_URI and database network access.",
    );
    return false;
  }
};
