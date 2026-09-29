const SKILLS = [
  "javascript", "typescript", "react", "next.js", "node.js", "express", "mongodb", "sql", "python", "java", "c++", "html", "css", "tailwind", "git", "github", "docker", "aws", "azure", "figma", "rest api", "graphql", "machine learning", "data science", "pandas", "numpy", "tensorflow", "pytorch", "linux", "devops", "redis", "postgresql"
];

const SECTION_PATTERNS = {
  summary: /summary|profile|objective/i,
  experience: /experience|employment|work history/i,
  projects: /projects|project experience/i,
  education: /education|academic/i,
  skills: /skills|technical skills|technologies/i,
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function analyzeResumeText(text, user = {}) {
  const raw = text || "";
  const lower = raw.toLowerCase();
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const wordCount = raw.split(/\s+/).filter(Boolean).length;

  const detectedSkills = SKILLS.filter((skill) => lower.includes(skill));
  const savedSkills = (user.skills || []).map((skill) => String(skill).toLowerCase().trim()).filter(Boolean);
  const targetRole = user.careerGoal || "Your target role";

  const sectionHits = Object.entries(SECTION_PATTERNS)
    .filter(([, pattern]) => lines.some((line) => pattern.test(line)))
    .map(([name]) => name);

  const hasEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(raw);
  const hasPhone = /(?:\+?\d[\d\s().-]{7,}\d)/.test(raw);
  const hasLinkedIn = /linkedin\.com/i.test(lower);
  const hasGithub = /github\.com/i.test(lower);
  const actionVerbs = ["built", "developed", "created", "implemented", "designed", "improved", "optimized", "led", "launched", "managed", "increased", "reduced"];
  const actionVerbHits = actionVerbs.filter((verb) => lower.includes(verb)).length;
  const quantifiedImpact = /\b\d+(?:\.\d+)?%|\b\d+[kKmM+]?\s+(?:users|clients|requests|projects|features|students|customers|members|hours|days)\b/.test(raw);
  const bulletCount = lines.filter((line) => /^[•●▪◦*-]/.test(line)).length;

  let structureScore = 30;
  structureScore += sectionHits.length * 11;
  if (hasEmail) structureScore += 6;
  if (hasPhone) structureScore += 6;
  if (hasLinkedIn || hasGithub) structureScore += 5;
  if (wordCount >= 250 && wordCount <= 900) structureScore += 8;
  structureScore = clamp(structureScore);

  let contentScore = 25;
  contentScore += Math.min(detectedSkills.length * 4, 28);
  contentScore += Math.min(actionVerbHits * 5, 25);
  if (sectionHits.includes("projects")) contentScore += 8;
  if (sectionHits.includes("experience")) contentScore += 8;
  contentScore = clamp(contentScore);

  let impactScore = 25;
  if (quantifiedImpact) impactScore += 30;
  impactScore += Math.min(actionVerbHits * 6, 24);
  if (bulletCount >= 4) impactScore += 12;
  impactScore = clamp(impactScore);

  const relevantSavedSkills = savedSkills.length
    ? savedSkills.filter((skill) => lower.includes(skill))
    : detectedSkills;
  let roleAlignmentScore = savedSkills.length
    ? Math.round((relevantSavedSkills.length / savedSkills.length) * 100)
    : Math.min(55 + detectedSkills.length * 4, 90);
  if (!user.careerGoal) roleAlignmentScore = Math.min(roleAlignmentScore, 70);
  roleAlignmentScore = clamp(roleAlignmentScore);

  const strengths = [];
  const gaps = [];
  const recommendations = [];

  if (sectionHits.length >= 4) strengths.push("Clear resume structure with the core sections recruiters expect.");
  else gaps.push("Some standard resume sections are missing or difficult to identify.");

  if (detectedSkills.length >= 6) strengths.push(`Strong technical keyword coverage with ${detectedSkills.length} recognizable skills.`);
  else gaps.push("Technical skill coverage is limited; important tools may be missing from the resume text.");

  if (quantifiedImpact) strengths.push("Includes measurable outcomes that make achievements more credible.");
  else {
    gaps.push("Achievements are not strongly quantified.");
    recommendations.push("Add numbers, percentages, scale or before/after impact to your strongest project and experience bullets.");
  }

  if (actionVerbHits >= 4) strengths.push("Uses action-oriented language to describe work and projects.");
  else recommendations.push("Rewrite passive bullets with stronger action verbs such as built, implemented, improved, optimized or led.");

  if (!hasLinkedIn && !hasGithub) recommendations.push("Add a relevant professional link such as GitHub, LinkedIn or a portfolio where appropriate.");
  if (!sectionHits.includes("projects")) recommendations.push("Add a dedicated projects section with technologies used, your contribution and measurable outcomes.");
  if (savedSkills.length && relevantSavedSkills.length < savedSkills.length) {
    const missing = savedSkills.filter((skill) => !lower.includes(skill)).slice(0, 5);
    if (missing.length) gaps.push(`Target-profile skills not clearly evidenced: ${missing.join(", ")}.`);
  }
  if (!user.careerGoal) recommendations.push("Set a target role in your Career Profile to make role-alignment scoring more specific.");
  if (wordCount < 220) recommendations.push("Add more evidence around projects, experience and outcomes; the resume currently appears sparse.");
  if (wordCount > 1000) recommendations.push("Tighten the resume by removing low-value detail and keeping the strongest evidence for your target role.");

  if (!recommendations.length) recommendations.push("Prioritize the strongest role-relevant achievements near the top and keep each bullet focused on one result.");

  const overallScore = Math.round(
    structureScore * 0.25 +
    contentScore * 0.3 +
    impactScore * 0.2 +
    roleAlignmentScore * 0.25
  );

  return {
    overallScore,
    structureScore,
    contentScore,
    impactScore,
    roleAlignmentScore,
    detectedSkills: uniq(detectedSkills),
    strengths: uniq(strengths).slice(0, 5),
    gaps: uniq(gaps).slice(0, 5),
    recommendations: uniq(recommendations).slice(0, 6),
    targetRole,
    analyzedAt: new Date(),
    stats: {
      wordCount,
      sectionCount: sectionHits.length,
      contactSignals: [hasEmail, hasPhone, hasLinkedIn || hasGithub].filter(Boolean).length,
    },
  };
}

module.exports = { analyzeResumeText };