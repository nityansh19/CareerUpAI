const test = require("node:test");
const assert = require("node:assert/strict");
const { validateWorkspace } = require("../services/validation");

const body = () => ({
  name: "Test User",
  education: "BCA",
  careerGoal: "Python Developer",
  skills: ["Python"],
  careerInterests: ["Automation"],
  expectedVersion: 0,
  workspace: { jobs: [], milestones: {}, interviews: [] },
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
