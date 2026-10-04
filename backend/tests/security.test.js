const test = require("node:test");
const assert = require("node:assert/strict");
const { hashPassword, verifyPassword, tokenHash } = require("../services/auth");
const { validateWorkspace } = require("../services/validation");
const User = require("../models/User");
const { serializeUser } = require("../routes/userRoutes");
const body = () => ({
  name: "Test User",
  education: "BCA",
  careerGoal: "Python Developer",
  skills: ["Python"],
  careerInterests: ["Automation"],
  expectedVersion: 0,
  workspace: { jobs: [], milestones: {}, interviews: [] },
});
test("passwords use distinct salts and verify safely", async () => {
  const a = await hashPassword("same-password"),
    b = await hashPassword("same-password");
  assert.notEqual(a, b);
  assert.ok(a.startsWith("scrypt:"));
  assert.equal(await verifyPassword("same-password", a), true);
  assert.equal(await verifyPassword("wrong-password", a), false);
  assert.equal(await verifyPassword("old password", "old password"), true);
  assert.equal(tokenHash("token").length, 64);
});
test("workspace validation rejects injected links, oversized notes, and malformed sessions", () => {
  const valid = body();
  assert.equal(validateWorkspace(valid).name, "Test User");
  valid.workspace.jobs = [
    {
      id: "one",
      role: "Developer",
      company: "Test",
      stage: "Saved",
      url: "javascript:alert(1)",
    },
  ];
  assert.throws(() => validateWorkspace(valid), /http/);
  valid.workspace.jobs[0].url = "https://example.com";
  valid.workspace.jobs[0].notes = "x".repeat(5001);
  assert.throws(() => validateWorkspace(valid), /too long/);
  valid.workspace.jobs = [];
  valid.workspace.interviews = [
    { type: "Mixed", difficulty: "Standard", answers: ["one"] },
  ];
  assert.throws(() => validateWorkspace(valid), /three/);
});
test("version checks and prototype keys are validated", () => {
  const valid = body();
  valid.expectedVersion = -1;
  assert.throws(() => validateWorkspace(valid), /version/);
  valid.expectedVersion = 0;
  valid.workspace.milestones = JSON.parse('{"__proto__":true}');
  assert.throws(() => validateWorkspace(valid), /milestone/);
});
test("API serialization never leaks password hashes or resume bytes", () => {
  const doc = new User({
    name: "Test",
    email: "test@example.com",
    password: "secret",
    resumeData: Buffer.from("private PDF"),
  });
  const result = serializeUser(doc);
  assert.equal(result.password, undefined);
  assert.equal(result.resumeData, undefined);
  assert.equal(result.email, "test@example.com");
});
