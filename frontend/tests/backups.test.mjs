import test from "node:test";
import assert from "node:assert/strict";
import * as lib from "../src/lib/workspace.js";
const valid = () => ({
  format: "careerup-workspace",
  version: 2,
  profile: {
    name: "Test User",
    education: "BCA",
    careerGoal: "Python Developer",
    skills: ["Python"],
    careerInterests: ["automation"],
  },
  workspace: {
    jobs: [
      {
        id: "job-1",
        role: "Python Developer",
        company: "Example",
        stage: "Saved",
        url: "https://example.com",
      },
    ],
    milestones: { "Python Developer:SQL": true },
    interviews: [],
  },
});
test("backups preserve useful data but cannot change account identity", () => {
  const data = valid();
  data.profile.email = "other@example.com";
  data.profile.id = "other";
  const result = lib.validateBackup(data);
  assert.equal(result.profile.name, "Test User");
  assert.equal(result.profile.email, undefined);
  assert.equal(result.profile.id, undefined);
});
test("imports reject dangerous links and malformed nested data", () => {
  const data = valid();
  data.workspace.jobs[0].url = "javascript:alert(1)";
  assert.throws(() => lib.validateBackup(data), /invalid job/);
  data.workspace.jobs[0].url = "https://example.com";
  data.workspace.milestones = JSON.parse('{"__proto__":true}');
  assert.throws(() => lib.validateBackup(data), /invalid learning/);
});
test("CSV exports neutralize spreadsheet formulas and quote line breaks", () => {
  assert.equal(lib.csvCell('=HYPERLINK("bad")'), '"\'=HYPERLINK(""bad"")"');
  assert.equal(lib.csvCell("  +SUM(1,2)"), '"\'  +SUM(1,2)"');
  assert.equal(lib.csvCell("note\nsecond line"), '"note\nsecond line"');
});
