const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const request = require("supertest");
const User = require("../models/User");
const Session = require("../models/Session");
const router = require("../routes/userRoutes");
const ownerId = "507f1f77bcf86cd799439011",
  otherId = "507f1f77bcf86cd799439012",
  token = "a".repeat(64);
const app = express();
app.use(express.json());
app.use("/api/users", router);
app.use((e, req, res, next) =>
  res.status(e.status || 500).json({ message: e.message }),
);
const owner = {
  _id: ownerId,
  name: "API Test",
  email: "api-test@example.com",
  skills: ["Python"],
  careerGoal: "Python Developer",
  workspace: { jobs: [], milestones: {}, interviews: [] },
  workspaceVersion: 0,
};
test("data endpoints require authentication before uploads or updates", async () => {
  for (const path of ["/me", "/resume"])
    assert.equal((await request(app).get("/api/users" + path)).status, 401);
  assert.equal(
    (await request(app).put("/api/users/workspace").send({ name: "injected" }))
      .status,
    401,
  );
  assert.equal(
    (await request(app).post("/api/users/analyze-resume/" + ownerId)).status,
    401,
  );
});
test("authenticated users cannot analyze or change another owner record", async (t) => {
  t.mock.method(Session, "findOne", async () => ({ userId: ownerId }));
  t.mock.method(User, "findById", async () => owner);
  assert.equal(
    (
      await request(app)
        .post("/api/users/career-intelligence/" + otherId)
        .set("Authorization", "Bearer " + token)
    ).status,
    403,
  );
  const result = await request(app)
    .get("/api/users/me")
    .set("Authorization", "Bearer " + token);
  assert.equal(result.status, 200);
  assert.equal(result.body.user.id, ownerId);
});
test("actual Express workspace route persists validated data and detects stale versions", async (t) => {
  t.mock.method(Session, "findOne", async () => ({ userId: ownerId }));
  t.mock.method(User, "findById", async () => owner);
  let stored = null;
  t.mock.method(User, "findOneAndUpdate", async (query, update) => {
    if (
      (query.workspaceVersion ?? (query.$or ? 0 : undefined)) !==
      owner.workspaceVersion
    )
      return null;
    stored = update;
    Object.assign(owner, update.$set);
    owner.workspaceVersion += 1;
    return owner;
  });
  const payload = {
    name: owner.name,
    education: "BCA",
    careerGoal: owner.careerGoal,
    skills: owner.skills,
    careerInterests: ["automation"],
    expectedVersion: 0,
    workspace: {
      jobs: [
        {
          id: "job-1",
          role: "Python Developer",
          company: "Example",
          stage: "Applied",
          url: "https://example.com",
          notes: "Prepare tests",
          followUpAt: "2026-10-10",
        },
      ],
      milestones: { "Python Developer:SQL": true },
      interviews: [],
    },
  };
  const saved = await request(app)
    .put("/api/users/workspace")
    .set("Authorization", "Bearer " + token)
    .send(payload);
  assert.equal(saved.status, 200);
  assert.equal(saved.body.user.workspace.jobs[0].notes, "Prepare tests");
  assert.equal(saved.body.user.workspaceVersion, 1);
  assert.ok(stored.$set.careerIntelligence.matches.length === 12);
  assert.equal(
    (
      await request(app)
        .put("/api/users/workspace")
        .set("Authorization", "Bearer " + token)
        .send(payload)
    ).status,
    409,
  );
});
test("PDF route rejects non-PDF bytes and reads real PDF text", async (t) => {
  t.mock.method(Session, "findOne", async () => ({ userId: ownerId }));
  t.mock.method(User, "findById", async () => owner);
  t.mock.method(User, "findByIdAndUpdate", async (id, update) => ({
    ...owner,
    ...update.$set,
    workspaceVersion: 2,
  }));
  const fake = await request(app)
    .post("/api/users/analyze-resume/" + ownerId)
    .set("Authorization", "Bearer " + token)
    .attach("cv", Buffer.from("not a pdf"), "fake.pdf");
  assert.equal(fake.status, 400);
  const data = require("node:fs").readFileSync(
    __dirname + "/fixtures/resume.pdf",
  );
  const result = await request(app)
    .post("/api/users/analyze-resume/" + ownerId)
    .set("Authorization", "Bearer " + token)
    .attach("cv", data, "resume.pdf");
  assert.equal(result.status, 200, JSON.stringify(result.body));
  assert.ok(result.body.user.resumeAnalysis.stats.wordCount > 30);
  assert.ok(result.body.user.resumeAnalysis.detectedSkills.includes("Python"));
  assert.equal(result.body.user.resumeData, undefined);
});

test("cloud registration, login, protected reads, and logout use revocable hashed sessions", async (t) => {
  const { tokenHash } = require("../services/auth");
  const records = new Map();
  let user;
  t.mock.method(User, "exists", async () => false);
  t.mock.method(User, "create", async (value) => {
    user = { ...owner, ...value, _id: ownerId, save: async () => {} };
    return user;
  });
  t.mock.method(User, "findOne", () => ({ select: async () => user }));
  t.mock.method(User, "findById", async () => user);
  t.mock.method(Session, "create", async (value) => {
    const session = {
      ...value,
      deleteOne: async () => records.delete(value.tokenHash),
    };
    records.set(value.tokenHash, session);
    return session;
  });
  t.mock.method(
    Session,
    "findOne",
    async (query) => records.get(query.tokenHash) || null,
  );
  const registered = await request(app)
    .post("/api/users/register")
    .send({
      name: "Cloud Test",
      email: "CLOUD@example.com",
      password: " password with spaces ",
    });
  assert.equal(registered.status, 201);
  assert.equal(registered.body.user.email, "cloud@example.com");
  assert.equal(registered.body.user.password, undefined);
  assert.ok(user.password.startsWith("scrypt:"));
  assert.ok(records.has(tokenHash(registered.body.token)));
  const wrong = await request(app)
    .post("/api/users/login")
    .send({ email: "cloud@example.com", password: "password with spaces" });
  assert.equal(wrong.status, 401);
  const login = await request(app)
    .post("/api/users/login")
    .send({ email: "cloud@example.com", password: " password with spaces " });
  assert.equal(login.status, 200);
  const header = "Bearer " + login.body.token;
  assert.equal(
    (await request(app).get("/api/users/me").set("Authorization", header))
      .status,
    200,
  );
  assert.equal(
    (await request(app).post("/api/users/logout").set("Authorization", header))
      .status,
    200,
  );
  assert.equal(
    (await request(app).get("/api/users/me").set("Authorization", header))
      .status,
    401,
  );
});
