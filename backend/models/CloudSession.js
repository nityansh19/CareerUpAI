const mongoose = require("mongoose");
// Added: persist login sessions across backend restarts.

module.exports = mongoose.model("CloudSession", new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "CloudAccount", required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
}));
// Added: store only token hashes and automatically remove expired sessions with a MongoDB TTL index.
