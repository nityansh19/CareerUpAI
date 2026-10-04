const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Session",
  new mongoose.Schema(
    {
      tokenHash: { type: String, unique: true, required: true },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      expiresAt: { type: Date, required: true, index: { expires: 0 } },
    },
    { timestamps: true },
  ),
);
