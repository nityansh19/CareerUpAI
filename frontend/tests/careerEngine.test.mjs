import test from "node:test";
import assert from "node:assert/strict";
import {
  ROLES,
  containsSkill,
  canonicalSkill,
  resolveRole,
  buildCareerIntelligence,
  analyzeResumeText,
  learningPlan,
  interviewQuestions,
  reviewInterviewAnswer,
} from "../../shared/careerEngine.mjs";
test("empty profiles do not invent skill coverage", () => {
  const result = buildCareerIntelligence({
    skills: [],
    careerGoal: "Frontend Developer",
  });
  assert.equal(result.matches.length, 12);
  assert.ok(
    result.matches.every(
      (m) => m.readinessScore === 0 && m.matchedSkills.length === 0,
    ),
  );
});
test("aliases match complete skills rather than substrings", () => {
  assert.equal(
    containsSkill("Digital portrait painted with no code", "Git"),
    false,
  );
  assert.equal(containsSkill("I used ReactJS and PostgreSQL", "React"), true);
  assert.equal(containsSkill("I used PostgreSQL", "SQL"), true);
  assert.equal(containsSkill("C++ and C++ projects", "C++"), true);
  assert.equal(canonicalSkill("JS"), "JavaScript");
  assert.equal(resolveRole("Data Analyst").name, "Data Analyst");
  assert.equal(resolveRole("lawyer"), null);
});
test("career coverage respects evidence and excludes illustrative resume data", () => {
  const user = {
    skills: ["Python"],
    careerGoal: "Machine Learning Engineer",
    resumeAnalysis: {
      demoPreview: true,
      detectedSkills: ["NumPy", "Pandas", "Git"],
    },
  };
  const match = buildCareerIntelligence(user).matches.find(
    (m) => m.role === "Machine Learning Engineer",
  );
  assert.deepEqual(match.matchedSkills, ["Python"]);
  assert.equal(match.readinessScore, 14);
  user.resumeAnalysis.demoPreview = false;
  assert.equal(
    buildCareerIntelligence(user).matches.find((m) => m.role === match.role)
      .matchedSkills.length,
    4,
  );
});
test("complete role checklists score 100 without bonus inflation", () => {
  for (const role of ROLES) {
    const result = buildCareerIntelligence({
      skills: role.skills,
      careerGoal: role.name,
    });
    assert.equal(
      result.matches.find((m) => m.role === role.name).readinessScore,
      100,
    );
  }
});
test("resume reports are derived from text and have no fabricated role fit", () => {
  const plain = "This resume has a description of an unrelated hobby. ".repeat(
    4,
  );
  const report = analyzeResumeText(plain, {});
  assert.equal(report.structureScore, 0);
  assert.equal(report.roleAlignmentScore, null);
  assert.equal(report.detectedSkills.length, 0);
  assert.ok(report.overallScore < 50);
  assert.throws(() => analyzeResumeText("tiny"), /readable text/);
});
test("resume improvements reflect missing sections and measurable outcomes", () => {
  const good =
    "alex@example.com github.com/alex Education BCA Skills JavaScript React TypeScript CSS HTML Testing Git Projects Built and developed a tested dashboard. Reduced load time by 35% and improved usability for 200 users. ";
  const report = analyzeResumeText(good.repeat(3), {
    careerGoal: "Frontend Developer",
  });
  assert.equal(report.structureScore, 100);
  assert.equal(report.roleAlignmentScore, 100);
  assert.ok(report.strengths.some((s) => s.includes("quantified")));
  assert.equal(report.source, "text");
});
test("learning paths are stable, role specific, and include projects", () => {
  const a = learningPlan({
    skills: ["Python"],
    careerGoal: "Python Developer",
  });
  const b = learningPlan({
    skills: ["Python"],
    careerGoal: "Python Developer",
  });
  assert.deepEqual(a, b);
  assert.ok(!a.some((step) => step.skill === "Python"));
  assert.ok(a.some((step) => step.phase === "Build"));
  assert.deepEqual(learningPlan({ skills: [], careerGoal: "lawyer" }), []);
});
test("interview prompts depend on role and review does not invent a performance score", () => {
  assert.notDeepEqual(
    interviewQuestions("Data Analyst", "Technical", "Standard"),
    interviewQuestions("Mobile Developer", "Technical", "Standard"),
  );
  const review = reviewInterviewAnswer(
    "In my project the challenge was slow requests. I implemented caching and tested it. The result reduced latency by 20 percent.",
  );
  assert.ok(review.checks.every((c) => c.found));
  assert.equal(review.score, undefined);
  assert.ok(review.method.includes("technical correctness"));
});
test("interview writing checks recognize debugging examples and use natural feedback", () => {
  const review = reviewInterviewAnswer(
    "In my project, the problem was lost changes. I traced the data flow and added validation. This fixed the issue and restored saved progress.",
  );
  assert.ok(review.checks.every((check) => check.found));
  assert.ok(
    reviewInterviewAnswer("A short answer.").suggestions.includes(
      "Make your action explicit.",
    ),
  );
});
