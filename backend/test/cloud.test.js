const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const path = require("node:path");
const mongoose = require("mongoose");
const Account = require("../models/CloudAccount");
const Session = require("../models/CloudSession");
const { hashPassword, verifyPassword } = require("../services/cloudAuth");
// Added: regression coverage for cloud security, persistence and real HTTP behavior.

const uri = process.env.TEST_MONGODB_URI;
if (!uri || !/^mongodb:\/\/127\.0\.0\.1:\d+\/careerup_cloud_test(?:\?|$)/.test(uri)) {
  throw new Error("Provide TEST_MONGODB_URI for a disposable local careerup_cloud_test database.");
}
const port = Number(process.env.TEST_PORT || 15050);
const base = `http://127.0.0.1:${port}`;
let server;
let logs = "";
const password = "Cloud-test-password-438!";
const email = `test-${Date.now()}@example.test`;
let owner, second, other;
// Added: require an explicitly disposable database and unique test accounts; never run against Atlas or production.

async function start() {
  server = spawn(process.execPath, [path.join(__dirname, "../server.js")], {
    env: { ...process.env, NODE_ENV: "production", MONGODB_URI: uri, PORT: String(port), FRONTEND_URL: "https://careerupai.netlify.app" },
    stdio: ["ignore", "pipe", "pipe"], windowsHide: true,
  });
  logs = "";
  server.stdout.on("data", (data) => { logs += data; });
  server.stderr.on("data", (data) => { logs += data; });
  for (let i = 0; i < 150; i++) {
    if (server.exitCode !== null) throw new Error(logs);
    try { if ((await fetch(`${base}/health`)).ok) return; } catch { /* Wait for this test server to bind. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Test server did not become healthy: ${logs}`);
}
// Added: run the actual production entry point with a temporary local database and wait for database readiness.

async function stop() {
  if (server && server.exitCode === null) { const exited = once(server, "exit"); server.kill(); await exited; }
}
// Added: stop only the child backend owned by this test suite.

async function request(route, { method = "GET", token, body, form } = {}) {
  const response = await fetch(`${base}${route}`, { method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { "Content-Type": "application/json" } : {}) },
    body: form || (body ? JSON.stringify(body) : undefined) });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  return { status: response.status, data, response };
}
// Added: exercise the public HTTP contract instead of calling route internals.

function resumePdf() {
  const content = "BT /F1 12 Tf 40 740 Td (Jane Developer jane@example.test) Tj 0 -20 Td (Education: Computer Science. Skills: JavaScript React Node.js MongoDB.) Tj 0 -20 Td (Experience: Built and deployed a web application, improved speed by 30 percent.) Tj 0 -20 Td (Projects: Implemented APIs, tested authentication, designed databases.) Tj ET";
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf);
}
// Added: generate a real text PDF fixture to test parsing and durable binary storage.

before(async () => { await mongoose.connect(uri); await start(); });
after(async () => { await stop(); await mongoose.disconnect(); });
// Added: isolate database and server lifecycle for repeatable tests.

test("password hashing uses unique salts and rejects wrong passwords", async () => {
  const first = await hashPassword(password), secondHash = await hashPassword(password);
  assert.notEqual(first, secondHash); assert.notEqual(first, password);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword("wrong", first), false);
});
// Added: verify the credential hashing behavior that replaces plaintext storage.

test("registration, duplicate detection, real login and separate devices", async () => {
  const created = await request("/api/account/register", { method: "POST", body: { name: "Cloud Tester", email: email.toUpperCase(), password } });
  assert.equal(created.status, 201); owner = created.data;
  assert.equal(owner.user.email, email); assert.equal(owner.user.isLocalDemo, false);
  assert.equal(owner.user.passwordHash, undefined); assert.equal(owner.user.resume, undefined);
  const saved = await Account.findById(owner.user.id).select("+passwordHash");
  assert.notEqual(saved.passwordHash, password); assert.equal(await verifyPassword(password, saved.passwordHash), true);
  assert.equal((await request("/api/account/register", { method: "POST", body: { name: "Duplicate", email, password } })).status, 409);
  assert.equal((await request("/api/account/login", { method: "POST", body: { email, password: "wrong" } })).status, 401);
  const login = await request("/api/account/login", { method: "POST", body: { email, password } });
  assert.equal(login.status, 200); second = login.data;
  assert.notEqual(second.token, owner.token); assert.equal(second.user.id, owner.user.id);
  const another = await request("/api/account/register", { method: "POST", body: { name: "Other User", email: `other-${email}`, password } });
  assert.equal(another.status, 201); other = another.data;
});
// Added: check real account creation, normalized email uniqueness and independent sessions for the same user.

test("unauthenticated requests and legacy routes cannot access account data", async () => {
  assert.equal((await request("/api/account/me")).status, 401);
  assert.equal((await request("/api/account/resume")).status, 401);
  assert.equal((await request("/api/users/profile/anything", { method: "PUT", body: {} })).status, 410);
  assert.equal((await request("/api/resume-analysis", { method: "POST", body: {} })).status, 410);
  const preflight = await fetch(`${base}/api/account/me`, { method: "OPTIONS", headers: { Origin: "https://careerupai.netlify.app", "Access-Control-Request-Method": "GET" } });
  assert.equal(preflight.headers.get("access-control-allow-origin"), "https://careerupai.netlify.app");
  const denied = await fetch(`${base}/api/account/me`, { headers: { Origin: "https://unrelated.example" } });
  assert.equal(denied.headers.get("access-control-allow-origin"), null);
});
// Added: test authentication enforcement, legacy retirement and allowed browser origins.

test("profile, jobs and practice persist across devices with stale-write protection", async () => {
  const profile = { name: "Updated Tester", education: "Computer Science", careerGoal: "Frontend Engineer", skills: ["JavaScript", "React"], careerInterests: ["Web development"], version: 0 };
  const updated = await request("/api/account/profile", { method: "PUT", token: owner.token, body: profile });
  assert.equal(updated.status, 200); assert.equal(updated.data.user.profileVersion, 1);
  assert.equal((await request("/api/account/profile", { method: "PUT", token: second.token, body: profile })).status, 409);
  const jobs = [{ id: "job-1", role: "Engineer", company: "Example", location: "Remote", url: "https://example.com/job", stage: "Applied", createdAt: new Date().toISOString() }];
  assert.equal((await request("/api/account/jobs", { method: "PUT", token: owner.token, body: { jobs, version: 0, accountId: other.user.id } })).status, 200);
  const interview = { role: "Engineer", type: "Mixed", difficulty: "Standard", started: true, step: 1, answer: "Draft notes", answers: ["First answer"] };
  assert.equal((await request("/api/account/interview", { method: "PUT", token: owner.token, body: { interview, version: 0 } })).status, 200);
  assert.equal((await request("/api/account/interview", { method: "PUT", token: second.token, body: { interview, version: 0 } })).status, 409);
  const fetched = await request("/api/account/me", { token: second.token });
  assert.equal(fetched.data.user.name, "Updated Tester"); assert.deepEqual(fetched.data.user.jobs, jobs); assert.deepEqual(fetched.data.user.interview, interview);
  const unrelated = await request("/api/account/me", { token: other.token });
  assert.equal(unrelated.data.user.jobs.length, 0); assert.equal(unrelated.data.user.interview, null);
  assert.equal((await request("/api/account/jobs", { method: "PUT", token: owner.token, body: { jobs: [{ ...jobs[0], url: "javascript:alert(1)" }], version: 1 } })).status, 400);
  assert.equal((await request("/api/account/career", { method: "POST", token: owner.token })).status, 200);
});
// Added: verify shared data, ownership determined by session, input rejection and cross-device conflict handling.

test("PDF analysis and downloads persist after backend restart", async () => {
  const pdf = resumePdf();
  const current = (await request("/api/account/me", { token: owner.token })).data.user;
  const form = new FormData(); form.append("resume", new Blob([pdf], { type: "application/pdf" }), "sample-resume.pdf");
  form.append("version", String(current.resumeVersion)); form.append("analyze", "true");
  const upload = await request("/api/account/resume", { method: "POST", token: owner.token, form });
  assert.equal(upload.status, 200, JSON.stringify(upload.data));
  assert.ok(upload.data.user.resumeAnalysis.detectedSkills.includes("react"));
  // Changed: assert the existing analyzer's normalized lowercase skill output.
  assert.equal(upload.data.user.resume, undefined);
  await stop(); await start();
  const restored = await request("/api/account/me", { token: second.token });
  assert.equal(restored.status, 200); assert.equal(restored.data.user.cvOriginalName, "sample-resume.pdf");
  assert.equal(restored.data.user.jobs.length, 1);
  const download = await fetch(`${base}/api/account/resume`, { headers: { Authorization: `Bearer ${second.token}` } });
  assert.equal(download.status, 200); assert.deepEqual(Buffer.from(await download.arrayBuffer()), pdf);
  assert.equal((await request("/api/account/resume", { token: other.token })).status, 404);
});
// Added: test real PDF extraction, byte-for-byte downloads, private files and survival of an actual backend restart.

test("logout revokes only that session and expiry is checked before TTL cleanup", async () => {
  assert.equal((await request("/api/account/logout", { method: "POST", token: owner.token })).status, 204);
  assert.equal((await request("/api/account/me", { token: owner.token })).status, 401);
  assert.equal((await request("/api/account/me", { token: second.token })).status, 200);
  await Session.updateMany({ accountId: owner.user.id }, { $set: { expiresAt: new Date(Date.now() - 1000) } });
  assert.equal((await request("/api/account/me", { token: second.token })).status, 401);
});
// Added: check session revocation and expiration independently of MongoDB's asynchronous TTL cleanup.
