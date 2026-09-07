const ROLE_LIBRARY = [
  {
    role: "Full Stack Developer",
    aliases: ["full stack", "full-stack", "mern", "web developer"],
    skills: ["javascript", "react", "node.js", "express", "mongodb", "html", "css", "git"],
    optional: ["typescript", "next.js", "sql", "rest api", "docker"],
    interests: ["web development", "backend development", "frontend development", "product engineering"],
  },
  {
    role: "Frontend Developer",
    aliases: ["frontend", "front end", "react developer", "ui developer"],
    skills: ["javascript", "react", "html", "css", "git"],
    optional: ["typescript", "next.js", "tailwind", "testing", "figma"],
    interests: ["frontend development", "web development", "ui", "design systems"],
  },
  {
    role: "Backend Developer",
    aliases: ["backend", "back end", "node developer", "api developer"],
    skills: ["javascript", "node.js", "express", "mongodb", "rest api", "git"],
    optional: ["sql", "redis", "docker", "authentication", "testing"],
    interests: ["backend development", "apis", "system design", "databases"],
  },
  {
    role: "Python Developer",
    aliases: ["python developer", "python engineer"],
    skills: ["python", "git", "sql", "rest api"],
    optional: ["django", "flask", "fastapi", "postgresql", "docker"],
    interests: ["python", "backend development", "automation", "software development"],
  },
  {
    role: "AI / ML Engineer",
    aliases: ["ai engineer", "machine learning", "ml engineer", "artificial intelligence"],
    skills: ["python", "machine learning", "numpy", "pandas", "git"],
    optional: ["scikit-learn", "pytorch", "tensorflow", "sql", "statistics", "docker"],
    interests: ["ai", "artificial intelligence", "machine learning", "data science"],
  },
  {
    role: "Data Analyst",
    aliases: ["data analyst", "analytics"],
    skills: ["sql", "excel", "data analysis", "statistics"],
    optional: ["python", "pandas", "power bi", "tableau", "data visualization"],
    interests: ["analytics", "data", "business intelligence", "data science"],
  },
  {
    role: "Data Scientist",
    aliases: ["data scientist", "data science"],
    skills: ["python", "statistics", "pandas", "numpy", "machine learning"],
    optional: ["sql", "scikit-learn", "data visualization", "pytorch", "tensorflow"],
    interests: ["data science", "machine learning", "ai", "analytics"],
  },
  {
    role: "DevOps Engineer",
    aliases: ["devops", "cloud engineer", "platform engineer"],
    skills: ["git", "linux", "docker", "ci/cd"],
    optional: ["aws", "azure", "gcp", "kubernetes", "terraform", "jenkins"],
    interests: ["devops", "cloud", "infrastructure", "automation"],
  },
  {
    role: "Software Engineer",
    aliases: ["software engineer", "software developer", "sde"],
    skills: ["data structures", "algorithms", "git", "problem solving"],
    optional: ["javascript", "python", "java", "c++", "sql", "system design"],
    interests: ["software development", "problem solving", "product engineering", "backend development"],
  },
];

const normalize = (value = "") => String(value).trim().toLowerCase();
const unique = (items) => [...new Set(items.filter(Boolean))];

function includesPhrase(haystack, phrase) {
  const h = normalize(haystack);
  const p = normalize(phrase);
  return Boolean(p && h.includes(p));
}

function scoreRole(role, context) {
  const availableSkills = context.skills;
  const requiredMatches = role.skills.filter((skill) => availableSkills.some((item) => includesPhrase(item, skill) || includesPhrase(skill, item)));
  const optionalMatches = role.optional.filter((skill) => availableSkills.some((item) => includesPhrase(item, skill) || includesPhrase(skill, item)));
  const missingSkills = role.skills.filter((skill) => !requiredMatches.includes(skill));

  const requiredRatio = role.skills.length ? requiredMatches.length / role.skills.length : 0;
  const optionalRatio = role.optional.length ? optionalMatches.length / role.optional.length : 0;
  const interestHits = role.interests.filter((interest) => context.interests.some((item) => includesPhrase(item, interest) || includesPhrase(interest, item))).length;
  const targetHit = [role.role, ...role.aliases].some((alias) => includesPhrase(context.goal, alias) || includesPhrase(alias, context.goal));
  const resumeSignal = Math.max(0, Math.min(1, (context.resumeRoleAlignment || 0) / 100));

  const readiness = Math.round(
    Math.min(100, requiredRatio * 62 + optionalRatio * 10 + Math.min(interestHits, 2) * 6 + (targetHit ? 14 : 0) + resumeSignal * 8)
  );

  const matchedSkills = unique([...requiredMatches, ...optionalMatches]);
  const why = [];
  if (targetHit) why.push("This role closely matches the career goal saved in your Career Profile.");
  if (requiredMatches.length) why.push(`You already show ${requiredMatches.length} of ${role.skills.length} core skills CareerUp tracks for this role.`);
  if (interestHits) why.push("Your saved career interests overlap with the work commonly associated with this path.");
  if (context.resumeDetected.length) why.push("Your latest resume analysis contributes additional evidence from skills detected in the resume.");
  if (!why.length) why.push("This is an adjacent path worth exploring as you expand your current skill set.");

  const nextActions = [];
  missingSkills.slice(0, 3).forEach((skill) => nextActions.push(`Build practical evidence for ${skill} through a focused project or learning milestone.`));
  if (matchedSkills.length && missingSkills.length) nextActions.push(`Strengthen your resume by connecting ${matchedSkills.slice(0, 2).join(" and ")} to measurable project outcomes.`);
  if (!missingSkills.length) nextActions.push("Your core skill coverage is strong; focus next on deeper projects, measurable impact and interview readiness.");

  return {
    role: role.role,
    readinessScore: readiness,
    matchedSkills,
    missingSkills,
    whyFit: why,
    nextActions: nextActions.slice(0, 4),
  };
}

function generateCareerIntelligence(user) {
  const profileSkills = Array.isArray(user.skills) ? user.skills : [];
  const resumeDetected = Array.isArray(user.resumeAnalysis?.detectedSkills) ? user.resumeAnalysis.detectedSkills : [];
  const interests = Array.isArray(user.careerInterests) ? user.careerInterests : [];
  const skills = unique([...profileSkills, ...resumeDetected].map(normalize));

  const context = {
    skills,
    resumeDetected,
    interests: interests.map(normalize),
    goal: normalize(user.careerGoal),
    resumeRoleAlignment: Number(user.resumeAnalysis?.roleAlignmentScore || 0),
  };

  const matches = ROLE_LIBRARY
    .map((role) => scoreRole(role, context))
    .sort((a, b) => b.readinessScore - a.readinessScore)
    .slice(0, 5);

  const best = matches[0] || null;
  return {
    targetRole: user.careerGoal || "",
    primaryRole: best?.role || "",
    primaryReadiness: best?.readinessScore || 0,
    matches,
    generatedAt: new Date(),
  };
}

module.exports = { generateCareerIntelligence, ROLE_LIBRARY };