const Session = require("../models/Session");
const User = require("../models/User");
const { tokenHash } = require("../services/auth");
module.exports = async (req, res, next) => {
  const token = req.get("Authorization")?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Sign in to access your workspace." });
  try {
    const session = await Session.findOne({
      tokenHash: tokenHash(token),
      expiresAt: { $gt: new Date() },
    });
    if (!session)
      return res
        .status(401)
        .json({ message: "Your session expired. Sign in again." });
    const user = await User.findById(session.userId);
    if (!user)
      return res
        .status(401)
        .json({ message: "The account is no longer available." });
    if (!user.emailVerified) {
      await session.deleteOne();
      return res.status(401).json({
        code: "EMAIL_NOT_VERIFIED",
        message: "Verify your email before accessing your workspace.",
      });
    }
    if (req.params.id && req.params.id !== String(user._id))
      return res
        .status(403)
        .json({ message: "This workspace belongs to a different account." });
    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
};
