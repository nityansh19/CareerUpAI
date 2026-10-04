// The same transparent scoring rules run in the browser and authenticated API.
export const ROLES = [
  {
    name: "Full Stack Developer",
    aliases: ["full stack", "full-stack", "mern", "web developer"],
    skills: ["JavaScript", "HTML", "CSS", "React", "Node.js", "SQL", "Git"],
    project:
      "Build and deploy a full-stack application with authentication, validated forms, tests, and a documented API.",
  },
  {
    name: "Frontend Developer",
    aliases: ["frontend", "front end", "react developer", "ui developer"],
    skills: [
      "JavaScript",
      "HTML",
      "CSS",
      "React",
      "TypeScript",
      "Testing",
      "Git",
    ],
    project:
      "Build an accessible responsive dashboard with reusable components, loading states, and interaction tests.",
  },
  {
    name: "Backend Developer",
    aliases: ["backend", "back end", "api developer"],
    skills: ["Node.js", "SQL", "REST APIs", "Authentication", "Testing", "Git"],
    project:
      "Build an API with authentication, pagination, a relational database, integration tests, and API documentation.",
  },
  {
    name: "Python Developer",
    aliases: ["python developer", "python engineer", "automation"],
    skills: ["Python", "SQL", "REST APIs", "Testing", "Git"],
    project:
      "Build a useful automation tool or Python API, add tests and error handling, and publish installation instructions.",
  },
  {
    name: "AI Application Engineer",
    aliases: ["ai application", "ai apps", "llm", "generative ai"],
    skills: ["Python", "REST APIs", "React", "SQL", "Testing", "Git"],
    project:
      "Build a retrieval-based assistant with source citations, a small evaluation dataset, and documented failure cases.",
  },
  {
    name: "Machine Learning Engineer",
    aliases: ["machine learning", "ml engineer", "ai engineer"],
    skills: [
      "Python",
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "Statistics",
      "Model evaluation",
      "Git",
    ],
    project:
      "Train a baseline model, compare it with an improved model on held-out data, and deploy an inference API.",
  },
  {
    name: "Data Analyst",
    aliases: ["data analyst", "analytics", "business intelligence"],
    skills: ["SQL", "Excel", "Statistics", "Python", "Data visualization"],
    project:
      "Analyze a public dataset, clean it reproducibly, and create a dashboard explaining three evidence-based findings.",
  },
  {
    name: "Data Scientist",
    aliases: ["data scientist", "data science"],
    skills: [
      "Python",
      "Pandas",
      "NumPy",
      "Statistics",
      "SQL",
      "Model evaluation",
    ],
    project:
      "Create a reproducible analysis with a clear hypothesis, baseline model, validation, and an explanation of limitations.",
  },
  {
    name: "DevOps Engineer",
    aliases: ["devops", "cloud engineer", "platform engineer"],
    skills: ["Linux", "Docker", "CI/CD", "Git", "Cloud", "Monitoring"],
    project:
      "Containerize a service, build a CI pipeline, deploy it, and document monitoring, backups, and rollback.",
  },
  {
    name: "Software Engineer",
    aliases: ["software engineer", "software developer", "sde"],
    skills: [
      "Data structures",
      "Algorithms",
      "Problem solving",
      "Testing",
      "Git",
    ],
    project:
      "Build a tested application and document its data structures, complexity, technical decisions, and deployment.",
  },
  {
    name: "Mobile Developer",
    aliases: ["mobile", "flutter", "android"],
    skills: ["Dart", "Flutter", "REST APIs", "Testing", "Git"],
    project:
      "Build a mobile app with persistent data, accessible navigation, offline states, and a tested release build.",
  },
  {
    name: "Product Designer",
    aliases: ["product design", "ux", "ui/ux", "designer"],
    skills: [
      "Figma",
      "User research",
      "Prototyping",
      "Accessibility",
      "Design systems",
    ],
    project:
      "Create a case study with user research, a tested prototype, accessibility checks, and documented design decisions.",
  },
];

const ALIASES = {
  JavaScript: ["javascript", "js"],
  TypeScript: ["typescript", "ts"],
  React: ["react", "react.js", "reactjs"],
  "Node.js": ["node.js", "nodejs", "node"],
  "REST APIs": ["rest api", "rest apis", "restful", "apis", "api"],
  Git: ["git", "version control"],
  "Scikit-learn": ["scikit-learn", "sklearn"],
  "CI/CD": ["ci/cd", "ci cd", "continuous integration"],
  SQL: ["sql", "postgresql", "mysql", "sqlite"],
  Testing: ["testing", "unit tests", "pytest", "jest", "vitest", "playwright"],
  Cloud: ["cloud", "aws", "azure", "gcp"],
  "Model evaluation": [
    "model evaluation",
    "cross-validation",
    "cross validation",
  ],
  "Data visualization": [
    "data visualization",
    "matplotlib",
    "power bi",
    "tableau",
  ],
};
const EXTRA_SKILLS = [
  "MongoDB",
  "Express",
  "Next.js",
  "Tailwind",
  "Redis",
  "Java",
  "C++",
  "TensorFlow",
  "PyTorch",
  "Kubernetes",
  "Terraform",
];
export const SKILLS = [
  ...new Set([...ROLES.flatMap((role) => role.skills), ...EXTRA_SKILLS]),
];
const clean = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();
const escaped = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const phrases = (skill) => ALIASES[skill] || [skill.toLowerCase()];
export function containsSkill(text, skill) {
  return phrases(skill).some((alias) =>
    new RegExp(`(^|[^a-z0-9])${escaped(alias)}(?=$|[^a-z0-9])`, "i").test(text),
  );
}
export function canonicalSkill(value) {
  return (
    SKILLS.find((skill) =>
      phrases(skill).some((alias) => clean(alias) === clean(value)),
    ) || String(value).trim()
  );
}
export function resolveRole(value) {
  const goal = clean(value);
  if (!goal) return null;
  return (
    ROLES.find((role) => clean(role.name) === goal) ||
    ROLES.find((role) => role.aliases.some((alias) => goal.includes(alias))) ||
    null
  );
}
export const CAREER_ENGINE_VERSION = 2;
export function buildCareerIntelligence(user) {
  const declared = new Set((user.skills || []).map(canonicalSkill));
  const detected = user.resumeAnalysis?.demoPreview
    ? []
    : user.resumeAnalysis?.detectedSkills || [];
  const available = new Set([...declared, ...detected.map(canonicalSkill)]);
  const target = resolveRole(user.careerGoal);
  const matches = ROLES.map((role) => {
    const matchedSkills = role.skills.filter((skill) => available.has(skill));
    const missingSkills = role.skills.filter((skill) => !available.has(skill));
    const readinessScore = Math.round(
      (matchedSkills.length / role.skills.length) * 100,
    );
    return {
      role: role.name,
      readinessScore,
      matchedSkills,
      missingSkills,
      resumeEvidence: matchedSkills.filter((skill) =>
        detected.map(canonicalSkill).includes(skill),
      ),
      whyFit: [
        `${matchedSkills.length} of ${role.skills.length} skills in this curated role checklist appear in your profile or resume.`,
        ...(target?.name === role.name
          ? ["This path matches your saved target role."]
          : []),
        ...(matchedSkills.length
          ? [
              "These are skill mentions, not a verification of proficiency or employment readiness.",
            ]
          : ["Add your real skills to get a useful comparison."]),
      ],
      nextActions: [
        ...missingSkills
          .slice(0, 3)
          .map(
            (skill) =>
              `Practice ${skill} and add a project that demonstrates it.`,
          ),
        role.project,
      ],
    };
  }).sort(
    (a, b) =>
      b.readinessScore - a.readinessScore ||
      Number(b.role === target?.name) - Number(a.role === target?.name),
  );
  return {
    engineVersion: CAREER_ENGINE_VERSION,
    targetRole: target?.name || "",
    primaryRole: matches[0].role,
    primaryReadiness: matches[0].readinessScore,
    matches,
    generatedAt: new Date().toISOString(),
    methodology:
      "Skill coverage against a curated checklist. Scores are not hiring predictions.",
  };
}

export function analyzeResumeText(text, user = {}, options = {}) {
  if (typeof text !== "string" || text.trim().length < 80)
    throw new Error(
      "Not enough readable text. Use a text-based PDF or paste at least 80 characters.",
    );
  const words = text.trim().split(/\s+/).length;
  const sections = [
    ["Education", /\b(education|qualifications|academic)\b/i],
    ["Skills", /\b(skills|technologies|expertise)\b/i],
    [
      "Experience or projects",
      /\b(experience|employment|internship|projects?)\b/i,
    ],
  ];
  const checks = [
    {
      label: "Readable email address",
      found: /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(text),
    },
    {
      label: "Professional or portfolio link",
      found: /\b(linkedin\.com|github\.com|https?:\/\/|www\.)/i.test(text),
    },
    ...sections.map(([label, pattern]) => ({
      label,
      found: pattern.test(text),
    })),
  ];
  const detectedSkills = SKILLS.filter((skill) => containsSkill(text, skill));
  const role = resolveRole(user.careerGoal);
  const requirements = role?.skills || (user.skills || []).map(canonicalSkill);
  const matchedSkills = requirements.filter((skill) =>
    containsSkill(text, skill),
  );
  const missingSkills = requirements.filter(
    (skill) => !containsSkill(text, skill),
  );
  const hasImpact =
    /\b\d+(?:\.\d+)?\s*(?:%|users|customers|hours|requests|seconds|students|clients)\b/i.test(
      text,
    ) || /\b\d+(?:\.\d+)?%/.test(text);
  const verbs = [
    ...new Set(
      text
        .toLowerCase()
        .match(
          /\b(built|developed|implemented|designed|improved|optimized|led|launched|reduced|increased|analyzed|created)\b/g,
        ) || [],
    ),
  ];
  const structureScore = Math.round(
    (checks.filter((c) => c.found).length / checks.length) * 100,
  );
  const contentScore = Math.min(
    100,
    (checks[4].found ? 30 : 0) +
      (words >= 180 ? 30 : Math.round((words / 180) * 30)) +
      Math.min(40, verbs.length * 8),
  );
  const impactScore = Math.min(
    100,
    (hasImpact ? 55 : 0) + Math.min(45, verbs.length * 9),
  );
  const roleAlignmentScore = requirements.length
    ? Math.round((matchedSkills.length / requirements.length) * 100)
    : null;
  const strengths = checks
    .filter((c) => c.found)
    .map((c) => `${c.label} found in the extracted text.`);
  if (hasImpact)
    strengths.push(
      "Found a quantified result. Check that each number is accurate and explains your contribution.",
    );
  const gaps = [
    ...checks.filter((c) => !c.found).map((c) => `${c.label} not detected.`),
    ...(missingSkills.length
      ? [`Skills not evidenced for your target: ${missingSkills.join(", ")}.`]
      : []),
  ];
  const recommendations = [
    ...checks
      .filter((c) => !c.found)
      .map((c) => `Add or clarify your ${c.label.toLowerCase()}.`),
    ...(!hasImpact
      ? [
          "Describe a specific outcome for your strongest project. Add numbers only when you can verify them.",
        ]
      : []),
    ...(verbs.length < 3
      ? [
          "Begin achievement bullets with precise verbs and explain what you personally contributed.",
        ]
      : []),
    ...(missingSkills.length
      ? [
          `Show honest project evidence for ${missingSkills.slice(0, 3).join(", ")} if you have used them.`,
        ]
      : []),
    ...(words > 1000
      ? [
          "Tighten repetitive or unrelated detail to make your strongest evidence easier to find.",
        ]
      : []),
    ...(!role
      ? ["Choose a supported target role to compare against a role checklist."]
      : []),
  ];
  if (!recommendations.length)
    recommendations.push(
      "Review each project bullet for your contribution, the context, and a verifiable outcome.",
    );
  const components = [
    structureScore,
    contentScore,
    impactScore,
    ...(roleAlignmentScore !== null ? [roleAlignmentScore] : []),
  ];
  return {
    overallScore: Math.round(
      components.reduce((a, b) => a + b, 0) / components.length,
    ),
    structureScore,
    contentScore,
    impactScore,
    roleAlignmentScore,
    detectedSkills,
    matchedSkills,
    missingSkills,
    strengths,
    gaps,
    recommendations,
    checks,
    targetRole: role?.name || user.careerGoal || "General review",
    analyzedAt: new Date().toISOString(),
    stats: { wordCount: words, pages: options.pages || null },
    methodology:
      "Rule-based review of extracted text. This is not an ATS pass rate or a prediction of hiring outcomes.",
    source: options.source || "text",
    fileName: options.fileName || "",
  };
}

const RESOURCE_MAP = {
  Python: ["Python tutorial", "https://docs.python.org/3/tutorial/"],
  JavaScript: [
    "MDN JavaScript guide",
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
  ],
  React: ["React Learn", "https://react.dev/learn"],
  "Node.js": ["Node.js Learn", "https://nodejs.org/en/learn"],
  TypeScript: [
    "TypeScript handbook",
    "https://www.typescriptlang.org/docs/handbook/intro.html",
  ],
  Git: ["Git book", "https://git-scm.com/book/en/v2"],
  SQL: [
    "PostgreSQL tutorial",
    "https://www.postgresql.org/docs/current/tutorial.html",
  ],
  Docker: ["Docker getting started", "https://docs.docker.com/get-started/"],
  Flutter: [
    "Flutter learning pathway",
    "https://docs.flutter.dev/learn/pathway",
  ],
  Dart: ["Dart tutorials", "https://dart.dev/tutorials"],
  Pandas: [
    "pandas tutorials",
    "https://pandas.pydata.org/docs/getting_started/intro_tutorials/",
  ],
  NumPy: [
    "NumPy beginner guide",
    "https://numpy.org/doc/stable/user/absolute_beginners.html",
  ],
  "Scikit-learn": [
    "scikit-learn getting started",
    "https://scikit-learn.org/stable/getting_started.html",
  ],
  "Model evaluation": [
    "Model evaluation guide",
    "https://scikit-learn.org/stable/modules/model_evaluation.html",
  ],
  HTML: [
    "MDN HTML",
    "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
  ],
  CSS: [
    "MDN CSS",
    "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",
  ],
  Accessibility: [
    "W3C accessibility fundamentals",
    "https://www.w3.org/WAI/fundamentals/",
  ],
  "CI/CD": ["GitHub Actions", "https://docs.github.com/en/actions"],
  Testing: ["Testing Library", "https://testing-library.com/docs/"],
  "REST APIs": [
    "MDN HTTP overview",
    "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
  ],
};
export function learningPlan(user, roleName = user.careerGoal) {
  const role = resolveRole(roleName);
  if (!role) return [];
  const skills = new Set((user.skills || []).map(canonicalSkill));
  const completed = user.workspace?.milestones || {};
  return [
    ...role.skills
      .filter(
        (skill) =>
          !skills.has(skill) ||
          Object.hasOwn(completed, `${role.name}:${skill}`),
      )
      .map((skill, i) => ({
        id: `${role.name}:${skill}`,
        skill,
        title: `Practice ${skill}`,
        phase: "Learn",
        description:
          "Learn the foundations, solve a small exercise, then apply the skill in a project. Complete this milestone when you can explain your work.",
        resource: RESOURCE_MAP[skill] || null,
        order: i + 1,
      })),
    {
      id: `${role.name}:project`,
      title: "Build proof of your skills",
      phase: "Build",
      description: role.project,
    },
    {
      id: `${role.name}:resume`,
      title: "Make your work easy to review",
      phase: "Prepare",
      description:
        "Update your resume with your contribution and results. Publish the project and its README, then review your target role coverage again.",
    },
    {
      id: `${role.name}:apply`,
      title: "Practice and apply deliberately",
      phase: "Act",
      description:
        "Practice three relevant interview questions, save suitable opportunities, and schedule follow-ups in your job tracker.",
    },
  ];
}

export function interviewQuestions(roleName, type, difficulty) {
  const role = resolveRole(roleName);
  const skill = role?.skills[0] || "your main tool";
  const technical =
    difficulty === "Foundations"
      ? [
          `What is ${skill} used for? Give an example from your own work.`,
          "Walk through one project and explain your contribution.",
          "How would you investigate a bug in that project?",
        ]
      : difficulty === "Advanced"
        ? [
            `How would you design a reliable ${role?.name || roleName} project under tight constraints?`,
            "Explain a difficult technical tradeoff and how you would validate it.",
            "What failure would you monitor first, and how would you recover?",
          ]
        : [
            `Explain a project relevant to ${role?.name || roleName}, including your implementation choices.`,
            `Explain how you applied ${skill} and what you would improve.`,
            "Describe your debugging process for a feature that fails after deployment.",
          ];
  const behavioral = [
    "Describe a challenging situation. What action did you take and what happened?",
    "Tell me about feedback you received and how you used it.",
    "Describe a disagreement, your contribution, and the outcome.",
  ];
  return type === "Technical"
    ? technical
    : type === "Behavioral"
      ? behavioral
      : [technical[0], behavioral[0], technical[2]];
}
export function reviewInterviewAnswer(answer) {
  const words = String(answer || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const checks = [
    {
      label: "Context",
      found: /\b(project|team|problem|challenge|task|situation|goal)\b/i.test(
        answer,
      ),
    },
    {
      label: "Your action",
      found:
        /\b(i|my)\b/i.test(answer) &&
        /\b(built|created|developed|implemented|analyzed|designed|tested|decided|helped|debugged|learned|improved)\b/i.test(
          answer,
        ),
    },
    {
      label: "Result or learning",
      found:
        /\b(result|outcome|improved|reduced|increased|learned|achieved|delivered|launched|saved)\b/i.test(
          answer,
        ),
    },
  ];
  return {
    words,
    checks,
    suggestions: [
      ...(words < 35
        ? [
            "Add enough detail to explain your reasoning; a few clear sentences are a useful start.",
          ]
        : []),
      ...checks
        .filter((c) => !c.found)
        .map((c) => `Make the ${c.label.toLowerCase()} explicit.`),
      ...(words > 350
        ? [
            "Shorten the answer to its most relevant details before practicing out loud.",
          ]
        : []),
    ],
    method:
      "Writing checklist only. It does not assess technical correctness, fluency, or interview performance.",
  };
}
