const {
  randomBytes,
  scrypt,
  timingSafeEqual,
  createHash,
} = require("node:crypto");
const { promisify } = require("node:util");
const derive = promisify(scrypt);
const Session = require("../models/Session");
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await derive(password, salt, 64);
  return `scrypt:${salt}:${key.toString("hex")}`;
}
async function verifyPassword(password, stored) {
  if (typeof stored !== "string") return false;
  if (!stored.startsWith("scrypt:")) {
    const a = Buffer.from(password),
      b = Buffer.from(stored);
    return a.length === b.length && timingSafeEqual(a, b);
  }
  const [, salt, digest] = stored.split(":");
  if (!salt || !digest) return false;
  const expected = Buffer.from(digest, "hex");
  const key = await derive(password, salt, 64);
  return key.length === expected.length && timingSafeEqual(key, expected);
}
const tokenHash = (token) => createHash("sha256").update(token).digest("hex");
async function issueSession(userId) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await Session.create({ tokenHash: tokenHash(token), userId, expiresAt });
  return { token, expiresAt };
}
module.exports = { hashPassword, verifyPassword, tokenHash, issueSession };
