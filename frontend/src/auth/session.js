import {
  buildCareerIntelligence,
  CAREER_ENGINE_VERSION,
} from "../../../shared/careerEngine.mjs";

export const SESSION_KEY = "user";

export function getStoredUser() {
  try {
    const value = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!value?.id || !value?.email) return null;
    const normalized =
      value.authMode === "cloud" ? { ...value, authMode: "local" } : value;
    if (value.authMode === "cloud")
      localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
    return {
      ...normalized,
      ...(normalized.cvFile === "local-demo"
        ? { cvFile: "", cvOriginalName: "" }
        : {}),
      careerIntelligence:
        normalized.careerIntelligence &&
        normalized.careerIntelligence.engineVersion !== CAREER_ENGINE_VERSION
          ? buildCareerIntelligence(normalized)
          : normalized.careerIntelligence,
      authMode: normalized.authMode || "local",
      workspace: normalized.workspace || {
        jobs: [],
        milestones: {},
        interviews: [],
      },
    };
  } catch {
    return null;
  }
}

export function storeUser(user) {
  if (!user?.id || !user?.email)
    throw new Error("The account could not be saved. Please sign in again.");
  try {
    if (user.authMode !== "demo")
      localStorage.setItem(`careerup_profile_${user.id}`, JSON.stringify(user));
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    throw new Error(
      "Your browser could not save this change. Allow site storage or free space, then try again.",
    );
  }
  window.dispatchEvent(new Event("careerup:user-updated"));
}

export function updateStoredUser(patch) {
  const user = getStoredUser();
  if (!user) return null;
  const next = { ...user, ...patch };
  storeUser(next);
  return next;
}

export function clearStoredUser() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem("careerup_access_token");
}

export function isProfileReady(user = getStoredUser()) {
  return getProfileCompletion(user) === 100;
}

export function getProfileCompletion(user = getStoredUser()) {
  if (!user) return 0;
  const checks = [
    Boolean(user.name?.trim()),
    Boolean(user.education?.trim()),
    Boolean(user.skills?.length),
    Boolean(user.careerInterests?.length),
    Boolean(user.careerGoal?.trim()),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export const isLoggedIn = () => Boolean(getStoredUser());
