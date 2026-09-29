import { isLocalDemoUser, LOCAL_USER_KEY } from "./localAccount";

export const SESSION_KEY = "user";

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const user = JSON.parse(raw);
    if (!user?.id || !user?.email) {
      clearStoredUser();
      return null;
    }

    return user;
  } catch {
    clearStoredUser();
    return null;
  }
}

export function storeUser(user) {
  if (!user?.id || !user?.email) return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  if (isLocalDemoUser(user)) {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  }
}

export function updateStoredUser(patch) {
  const current = getStoredUser();
  if (!current) return null;
  const next = { ...current, ...patch };
  storeUser(next);
  return next;
}

export function clearStoredUser() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("careerup_cv_name");
}

export function isProfileReady(user = getStoredUser()) {
  if (!user) return false;
  return Boolean(
    user.name?.trim() &&
    user.education?.trim() &&
    Array.isArray(user.skills) && user.skills.length > 0 &&
    Array.isArray(user.careerInterests) && user.careerInterests.length > 0 &&
    user.careerGoal?.trim()
  );
}

export function getProfileCompletion(user = getStoredUser()) {
  if (!user) return 0;
  const checks = [
    Boolean(user.name?.trim()),
    Boolean(user.education?.trim()),
    Array.isArray(user.skills) && user.skills.length > 0,
    Array.isArray(user.careerInterests) && user.careerInterests.length > 0,
    Boolean(user.careerGoal?.trim()),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function isLoggedIn() {
  return Boolean(getStoredUser());
}
