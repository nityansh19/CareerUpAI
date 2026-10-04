const bad = (message) => {
  const error = new Error(message);
  error.status = 400;
  throw error;
};
function text(value, max = 500, required = false) {
  if (
    typeof value !== "string" ||
    value.length > max ||
    (required && !value.trim())
  )
    bad("A text field is missing or too long.");
  return value.trim();
}
function list(value, max = 100) {
  if (!Array.isArray(value) || value.length > max)
    bad("Invalid skill or interest list.");
  return [...new Set(value.map((s) => text(s, 100, true)))];
}
function validateWorkspace(body) {
  const name = text(body.name, 100, true),
    education = text(body.education || "", 500),
    careerGoal = text(body.careerGoal || "", 200),
    skills = list(body.skills || []),
    careerInterests = list(body.careerInterests || []);
  const w = body.workspace;
  if (!w || typeof w !== "object") bad("Workspace data is required.");
  if (!Array.isArray(w.jobs) || w.jobs.length > 500)
    bad("A workspace supports up to 500 opportunities.");
  const date = (value) => {
    if (!value) return "";
    if (
      typeof value !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(Date.parse(value))
    )
      bad("Invalid application date.");
    return value;
  };
  const jobs = w.jobs.map((job) => {
    if (
      !job ||
      !["Saved", "Applied", "Interview", "Offer", "Closed"].includes(job.stage)
    )
      bad("Invalid application stage.");
    const url = text(job.url || "", 2000);
    if (url && !/^https?:\/\//i.test(url))
      bad("Use an http or https job link.");
    return {
      id: text(job.id, 100, true),
      role: text(job.role, 200, true),
      company: text(job.company, 200, true),
      location: text(job.location || "", 200),
      url,
      stage: job.stage,
      notes: text(job.notes || "", 5000),
      appliedAt: date(job.appliedAt),
      followUpAt: date(job.followUpAt),
      createdAt: text(job.createdAt || "", 100),
      updatedAt: text(job.updatedAt || "", 100),
    };
  });
  if (new Set(jobs.map((j) => j.id)).size !== jobs.length)
    bad("Opportunity IDs must be unique.");
  if (
    !w.milestones ||
    typeof w.milestones !== "object" ||
    Array.isArray(w.milestones) ||
    Object.keys(w.milestones).length > 1000
  )
    bad("Invalid milestone progress.");
  const milestones = {};
  for (const [key, value] of Object.entries(w.milestones)) {
    if (
      typeof value !== "boolean" ||
      key.length > 300 ||
      ["__proto__", "constructor", "prototype"].includes(key)
    )
      bad("Invalid milestone.");
    milestones[key] = value;
  }
  if (!Array.isArray(w.interviews) || w.interviews.length > 100)
    bad("A workspace supports up to 100 practice sessions.");
  const interviews = w.interviews.map((s) => {
    if (
      !s ||
      !["Mixed", "Technical", "Behavioral"].includes(s.type) ||
      !["Foundations", "Standard", "Advanced"].includes(s.difficulty)
    )
      bad("Invalid interview setup.");
    if (!Array.isArray(s.answers) || s.answers.length !== 3)
      bad("An interview session needs three answers.");
    return {
      id: text(s.id, 100, true),
      role: text(s.role, 200, true),
      type: s.type,
      difficulty: s.difficulty,
      answers: s.answers.map((a) => text(a, 10000)),
      questions: (Array.isArray(s.questions) && s.questions.length === 3
        ? s.questions
        : bad("An interview needs three questions.")
      ).map((q) => text(q, 500, true)),
      completedAt: text(s.completedAt, 100, true),
    };
  });
  if (!Number.isSafeInteger(body.expectedVersion) || body.expectedVersion < 0)
    bad("A valid workspace version is required.");
  return {
    name,
    education,
    careerGoal,
    skills,
    careerInterests,
    workspace: {
      jobs,
      milestones,
      interviews,
      learningRole: text(w.learningRole || "", 200),
    },
  };
}
module.exports = { validateWorkspace, text, list };
