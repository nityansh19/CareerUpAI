import { storeUser } from "../auth/session.js";
import {
  createLocalDemoAccount,
  authenticateLocalDemoAccount,
} from "../auth/localAccount.js";

export const CLOUD_ENABLED = false;

export async function authenticate(form, register = false) {
  return register
    ? createLocalDemoAccount(form)
    : authenticateLocalDemoAccount(form.email, form.password);
}

export async function persistUser(next) {
  const saved =
    next.authMode === "demo" ? next : { ...next, authMode: "local" };
  storeUser(saved);
  return saved;
}

export function downloadFile(name, contents, type = "application/json") {
  const blob =
    contents instanceof Blob ? contents : new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function csvCell(value) {
  const text = String(value ?? "");
  const safe = /^[\s]*[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function getJobs(user) {
  let values = user.workspace?.jobs;
  if (!values?.length)
    try {
      values = JSON.parse(
        localStorage.getItem(`careerup_jobs_${user.id}`) || "[]",
      );
    } catch {
      values = [];
    }
  return Array.isArray(values)
    ? values.filter(
        (j) =>
          j &&
          typeof j.id === "string" &&
          typeof j.role === "string" &&
          typeof j.company === "string" &&
          ["Saved", "Applied", "Interview", "Offer", "Closed"].includes(
            j.stage,
          ),
      )
    : [];
}

export function localDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function backup(user) {
  return {
    format: "careerup-workspace",
    version: 2,
    exportedAt: new Date().toISOString(),
    profile: {
      name: user.name,
      education: user.education,
      careerGoal: user.careerGoal,
      skills: user.skills,
      careerInterests: user.careerInterests,
    },
    workspace: { ...user.workspace, jobs: getJobs(user) },
  };
}

export function validateBackup(data) {
  if (
    data?.format !== "careerup-workspace" ||
    data.version !== 2 ||
    !data.profile ||
    !data.workspace
  )
    throw new Error(
      "Choose a CareerUpAI workspace backup exported from Settings.",
    );
  const p = data.profile,
    w = data.workspace;
  for (const key of ["name", "education", "careerGoal"])
    if (typeof p[key] !== "string" || p[key].length > 500)
      throw new Error("This backup contains invalid profile fields.");
  for (const key of ["skills", "careerInterests"])
    if (
      !Array.isArray(p[key]) ||
      p[key].length > 100 ||
      p[key].some((s) => typeof s !== "string" || s.length > 100)
    )
      throw new Error("This backup contains invalid skills or interests.");
  if (
    !Array.isArray(w.jobs) ||
    w.jobs.length > 500 ||
    w.jobs.some(
      (j) =>
        !j ||
        typeof j.id !== "string" ||
        typeof j.role !== "string" ||
        typeof j.company !== "string" ||
        j.role.length > 200 ||
        j.company.length > 200 ||
        !["Saved", "Applied", "Interview", "Offer", "Closed"].includes(
          j.stage,
        ) ||
        (j.url &&
          (typeof j.url !== "string" || !/^https?:\/\//i.test(j.url))) ||
        (j.notes && (typeof j.notes !== "string" || j.notes.length > 5000)) ||
        (j.location && typeof j.location !== "string"),
    )
  )
    throw new Error("This backup contains invalid job entries or links.");
  if (
    !w.milestones ||
    typeof w.milestones !== "object" ||
    Array.isArray(w.milestones) ||
    Object.values(w.milestones).some((v) => typeof v !== "boolean") ||
    Object.keys(w.milestones).some((k) =>
      ["__proto__", "prototype", "constructor"].includes(k),
    )
  )
    throw new Error("This backup contains invalid learning progress.");
  if (
    !Array.isArray(w.interviews) ||
    w.interviews.length > 100 ||
    w.interviews.some(
      (s) =>
        !s ||
        typeof s.id !== "string" ||
        typeof s.role !== "string" ||
        !["Mixed", "Technical", "Behavioral"].includes(s.type) ||
        !["Foundations", "Standard", "Advanced"].includes(s.difficulty) ||
        !Number.isFinite(Date.parse(s.completedAt)) ||
        !Array.isArray(s.answers) ||
        s.answers.length !== 3 ||
        s.answers.some((a) => typeof a !== "string" || a.length > 10000) ||
        !Array.isArray(s.questions) ||
        s.questions.length !== 3 ||
        s.questions.some((q) => typeof q !== "string" || q.length > 500),
    )
  )
    throw new Error("This backup contains invalid interview entries.");
  return {
    profile: {
      name: p.name,
      education: p.education,
      careerGoal: p.careerGoal,
      skills: p.skills,
      careerInterests: p.careerInterests,
    },
    workspace: {
      jobs: w.jobs,
      milestones: w.milestones,
      interviews: w.interviews,
      learningRole: typeof w.learningRole === "string" ? w.learningRole : "",
    },
  };
}
