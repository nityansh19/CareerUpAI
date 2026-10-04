const { randomBytes, scrypt, timingSafeEqual, createHash } = require("node:crypto");
const { promisify } = require("node:util");
const deriveKey = promisify(scrypt);
// Added: use Node's password KDF and cryptographic randomness without adding an authentication dependency.

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await deriveKey(password, salt, 64);
  return `${salt}:${key.toString("hex")}`;
}
// Added: hash each password with a unique random salt; never save plaintext cloud passwords.

async function verifyPassword(password, stored) {
  const [salt, expected] = String(stored || "").split(":");
  if (!salt || !expected || expected.length !== 128) return false;
  const actual = await deriveKey(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(expected, "hex"));
}
// Added: compare derived password hashes in constant time.

const hashToken = (token) => createHash("sha256").update(token).digest("hex");
// Added: authenticate bearer tokens without storing reusable tokens in MongoDB.

function rateLimit(max, windowMs) {
  const attempts = new Map();
  const timer = setInterval(() => {
    for (const [key, item] of attempts) if (item.until <= Date.now()) attempts.delete(key);
  }, windowMs);
  timer.unref();
  return (req, res, next) => {
    const key = req.ip;
    let item = attempts.get(key);
    if (!item || item.until <= Date.now()) {
      if (attempts.size >= 10000) return res.status(429).json({ message: "Please try again later." });
      item = { count: 0, until: Date.now() + windowMs };
      attempts.set(key, item);
    }
    if (++item.count > max) {
      res.set("Retry-After", String(Math.ceil((item.until - Date.now()) / 1000)));
      return res.status(429).json({ message: "Too many attempts. Please try again later." });
    }
    next();
  };
}
// Added: bound repeated login/upload requests and limiter memory for the initial single backend instance.

module.exports = { hashPassword, verifyPassword, hashToken, rateLimit };
// Added: share authentication helpers between cloud routes and regression tests.
