import { buildCareerIntelligence } from "../../shared/careerEngine.mjs";
const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(value)));

const ROLE_LIBRARY = {
  "full stack developer": [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "SQL",
    "Git",
    "Docker",
  ],
  "full stack engineer": [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "SQL",
    "Git",
    "Docker",
  ],
  "frontend engineer": [
    "JavaScript",
    "React",
    "TypeScript",
    "CSS",
    "Testing",
    "Git",
  ],
  "backend engineer": [
    "Node.js",
    "Express",
    "SQL",
    "MongoDB",
    "Docker",
    "System design",
  ],
  "ai application engineer": [
    "Python",
    "APIs",
    "React",
    "Backend",
    "NumPy",
    "Pandas",
    "ML foundations",
  ],
  "ml engineer": [
    "Python",
    "NumPy",
    "Pandas",
    "Scikit-learn",
    "Statistics",
    "Model evaluation",
  ],
};

const DEFAULT_SKILLS = [
  "JavaScript",
  "React",
  "Node.js",
  "MongoDB",
  "Git",
  "Python",
];

function normalizedSkills(user) {
  return (
    Array.isArray(user?.skills) && user.skills.length
      ? user.skills
      : DEFAULT_SKILLS
  )
    .map((skill) => String(skill).trim())
    .filter(Boolean);
}

function roleRequirements(role) {
  const key = String(role || "").toLowerCase();
  if (ROLE_LIBRARY[key]) return ROLE_LIBRARY[key];
  if (key.includes("frontend")) return ROLE_LIBRARY["frontend engineer"];
  if (key.includes("backend")) return ROLE_LIBRARY["backend engineer"];
  if (
    key.includes("ai") ||
    key.includes("machine learning") ||
    key.includes("ml")
  )
    return ROLE_LIBRARY["ai application engineer"];
  return ROLE_LIBRARY["full stack developer"];
}

export function buildDemoResumeAnalysis(
  user,
  fileName = "careerup-demo-resume.pdf",
) {
  const skills = normalizedSkills(user);
  const targetRole = user?.careerGoal || "Full Stack Developer";
  const roleSkills = roleRequirements(targetRole);
  const lower = new Set(skills.map((skill) => skill.toLowerCase()));
  const roleMatches = roleSkills.filter((skill) =>
    lower.has(skill.toLowerCase()),
  ).length;
  const roleAlignmentScore = clamp(
    62 + roleMatches * 5 + Math.min(skills.length, 6) * 2,
    62,
    91,
  );
  const contentScore = clamp(72 + Math.min(skills.length, 7) * 2, 72, 88);
  const structureScore = 90;
  const impactScore = 69;
  const overallScore = clamp(
    (structureScore + contentScore + impactScore + roleAlignmentScore) / 4,
  );

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

export function buildDemoCareerIntelligence(user) {
  return { ...buildCareerIntelligence(user), demoPreview: true };
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
    careerInterests: [
      "Web development",
      "Backend development",
      "AI",
      "Product engineering",
    ],
    careerGoal: "Full Stack Developer",
    cvOriginalName: "",
    cvFile: "",
  };

  const resumeAnalysis = buildDemoResumeAnalysis(base);
  const careerIntelligence = buildDemoCareerIntelligence({
    ...base,
    resumeAnalysis,
  });
  return { ...base, resumeAnalysis, careerIntelligence };
}
