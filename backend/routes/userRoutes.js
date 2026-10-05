const express = require("express");

const router = express.Router();

router.use((req, res) => {
  res.status(503).json({
    code: "SUPABASE_MIGRATION_PENDING",
    message:
      "Online accounts are temporarily disabled while CareerUpAI moves its account database to Supabase. The sample/device workspace remains available.",
  });
});

module.exports = router;
