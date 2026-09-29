const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));

const ROLE_LIBRARY = {
  "full stack developer": ["JavaScript", "React", "Node.js", "MongoDB", "SQL", "Git", "Docker"],
  "full stack engineer": ["JavaScript", "React", "Node.js", "MongoDB", "SQL", "Git", "Docker"],
  "frontend engineer": ["JavaScript", "React", "TypeScript", "CSS", "Testing", "Git"],
  "backend engineer": ["Node.js", "Express", "SQL", "MongoDB", "Docker", "System design"],
  "ai application engineer": ["Python", "APIs", "React", "Backend", "NumPy", "Pandas", "ML foundations"],
  "ml engineer": ["Python", "NumPy", "Pandas", "Scikit-learn", "Statistics", "Model evaluation"],
};

const DEFAULT_SKILLS = ["JavaScript", "React", "Node.js", "MongoDB", "Git", "Python"];

function normalizedSkills(user) {
  return (Array.isArray(user?.skills) && user.skills.length ? user.skills : DEFAULT_SKILLS).map((skill) => String(skill).trim()).filter(Boolean);
}

function roleRequirements(role) {
  const key = String(role || "").toLowerCase();
  if (ROLE_LIBRARY[key]) return ROLE_LIBRARY[key];
  if (key.includes("frontend")) return ROLE_LIBRARY["frontend engineer"];
  if (key.includes("backend")) return ROLE_LIBRARY["backend engineer"];
  if (key.includes("ai") || key.includes("machine learning") || key.includes("ml")) return ROLE_LIBRARY["ai application engineer"];
  return ROLE_LIBRARY["full stack developer"];
}

export function buildDemoResumeAnalysis(user, fileName = "careerup-demo-resume.pdf") {
  const skills = normalizedSkills(user);
  const targetRole = user?.careerGoal || "Full Stack Developer";
  const roleSkills = roleRequirements(targetRole);
  const lower = new Set(skills.map((skill) => skill.toLowerCase()));
  const roleMatches = roleSkills.filter((skill) => lower.has(skill.toLowerCase())).length;
  const roleAlignmentScore = clamp(62 + roleMatches * 5 + Math.min(skills.length, 6) * 2, 62, 91);
  const contentScore = clamp(72 + Math.min(skills.length, 7) * 2, 72, 88);
  const structureScore = 90;
  const impactScore = 69;
  const overallScore = clamp((structureScore + contentScore + impactScore + roleAlignmentScore) / 4);

  return {
    overallScore,
    structureScore,
    contentScore,
    impactScore,
    roleAlignmentScore,
    strengths: [
      "Clear technical skill coverage for a software-focused profile.",
      "Projects and stack keywords give the resume useful recruiter signals.",
      "Core sections are structured in a way that is easy to scan.",
    ],
    gaps: [
      "Project bullets need more measurable outcomes and impact.",
      `Add more evidence that directly supports ${targetRole}.`,
      "Show deployment, collaboration or ownership signals more clearly.",
    ],
    recommendations: [
      "Rewrite project bullets using action + problem + measurable result.",
      `Prioritize keywords and projects that strengthen ${targetRole} alignment.`,
      "Keep the strongest projects and skills near the top of the resume.",
    ],
    detectedSkills: skills.slice(0, 10),
    targetRole,
    fileName,
    analyzedAt: new Date().toISOString(),
    demoPreview: true,
  };
}

function buildMatch(role, user, targetRole, index) {
  const skills = normalizedSkills(user);
  const required = roleRequirements(role);
  const lower = new Set(skills.map((skill) => skill.toLowerCase()));
  const matchedSkills = required.filter((skill) => lower.has(skill.toLowerCase()));
  const missingSkills = required.filter((skill) => !lower.has(skill.toLowerCase()));
  const targetBoost = role.toLowerCase() === targetRole.toLowerCase() ? 10 : 0;
  const readinessScore = clamp(52 + matchedSkills.length * 6 + Math.min(skills.length, 6) * 2 + targetBoost - index * 2, 48, 94);

  return {
    role,
    readinessScore,
    matchedSkills,
    missingSkills: missingSkills.slice(0, 4),
    whyFit: [
      matchedSkills.length ? `Your profile already shows ${matchedSkills.length} relevant skills for this direction.` : "Your current software foundation provides a starting point for this direction.",
      role.toLowerCase() === targetRole.toLowerCase() ? "This role directly matches the target saved in your Career Profile." : "This is an adjacent path that overlaps with your current technical foundation.",
      "Your existing projects can be repositioned to create stronger role-specific evidence.",
    ],
    nextActions: missingSkills.length ? missingSkills.slice(0, 3).map((skill) => `Build practical evidence for ${skill}.`) : ["Turn your strongest project into measurable resume evidence.", "Add one deeper project that demonstrates ownership."],
  };
}

export function buildDemoCareerIntelligence(user) {
  const targetRole = user?.careerGoal || "Full Stack Developer";
  const alternatives = ["Backend Engineer", "Frontend Engineer", "AI Application Engineer", "ML Engineer"];
  const roles = [targetRole, ...alternatives].filter((role, index, list) => list.findIndex((item) => item.toLowerCase() === role.toLowerCase()) === index).slice(0, 4);
  const matches = roles.map((role, index) => buildMatch(role, user, targetRole, index)).sort((a, b) => b.readinessScore - a.readinessScore);

  return {
    primaryRole: matches[0]?.role || targetRole,
    primaryReadiness: matches[0]?.readinessScore || 0,
    matches,
    generatedAt: new Date().toISOString(),
    demoPreview: true,
  };
}

export function createDemoWorkspaceUser({ id, name, email }) {
  const base = {
    id,
    name,
    email,
    isLocalDemo: true,
    demoWorkspace: true,
    education: "Sample Computer Applications profile",
    skills: [...DEFAULT_SKILLS],
    careerInterests: ["Web development", "Backend development", "AI", "Product engineering"],
    careerGoal: "Full Stack Developer",
    cvOriginalName: "careerup-demo-resume.pdf",
    cvFile: "local-demo",
  };

  const resumeAnalysis = buildDemoResumeAnalysis(base, base.cvOriginalName);
  const careerIntelligence = buildDemoCareerIntelligence({ ...base, resumeAnalysis });
  return { ...base, resumeAnalysis, careerIntelligence };
}
