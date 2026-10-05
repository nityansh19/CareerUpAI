import {
  getStoredUser,
  storeUser,
  TOKEN_KEY,
  clearStoredUser,
} from "../auth/session.js";
export const API_URL = (import.meta.env?.VITE_API_URL || "").replace(
  /\/+$/,
  "",
);
export const CLOUD_ENABLED = Boolean(API_URL);
export async function request(path, options = {}) {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error(
      "The online service could not be reached. Your saved device data is still available. Please try again shortly.",
    );
  }
  if (response.status === 401 && token) {
    clearStoredUser();
    window.dispatchEvent(new Event("careerup:session-expired"));
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      payload.message || "The change could not be saved. Please try again.",
    );
    error.code = payload.code || "";
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}
export async function authenticate(form, register = false) {
  if (!CLOUD_ENABLED)
    throw new Error(
      "Online accounts are not configured yet. You can still explore the sample workspace.",
    );
  const result = await request(
    `/api/users/${register ? "register" : "login"}`,
    { method: "POST", body: JSON.stringify(form) },
  );
  if (result.verificationRequired) return result;
  sessionStorage.setItem(TOKEN_KEY, result.token);
  return { ...result.user, authMode: "cloud", isLocalDemo: false };
}
export async function verifyEmailAddress(email, code) {
  if (!CLOUD_ENABLED)
    throw new Error("Online accounts are not configured yet.");
  const result = await request("/api/users/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
  sessionStorage.setItem(TOKEN_KEY, result.token);
  return { ...result.user, authMode: "cloud", isLocalDemo: false };
}
export async function resendVerification(email) {
  if (!CLOUD_ENABLED)
    throw new Error("Online accounts are not configured yet.");
  return request("/api/users/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
export async function persistUser(next) {
  if (next.authMode === "cloud") {
    const { user } = await request("/api/users/workspace", {
      method: "PUT",
      body: JSON.stringify({
        name: next.name,
        education: next.education,
        careerGoal: next.careerGoal,
        skills: next.skills,
        careerInterests: next.careerInterests,
        workspace: next.workspace,
        expectedVersion: next.workspaceVersion || 0,
      }),
    });
    const saved = { ...user, authMode: "cloud", isLocalDemo: false };
    storeUser(saved);
    return saved;
  }
  storeUser(next);
  return next;
}
export async function refreshCloudUser() {
  const current = getStoredUser();
  if (current?.authMode !== "cloud") return current;
  const { user } = await request("/api/users/me");
  const next = { ...user, authMode: "cloud" };
  storeUser(next);
  return next;
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
