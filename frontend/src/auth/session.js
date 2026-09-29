import { isLocalDemoUser, LOCAL_USER_KEY } from "./localAccount";
import { createDemoWorkspaceUser } from "../demoIntelligence";

export const SESSION_KEY = "user";

function migrateToLocal(user) {
  if (!user?.id || !user?.email) return null;
  if (isLocalDemoUser(user)) return user;

  const localId = `local-${user.id}`;
  const defaults = createDemoWorkspaceUser({
    id: localId,
    name: user.name || "CareerUp Tester",
    email: user.email,
  });

  return {
    ...defaults,
    ...user,
    id: localId,
    isLocalDemo: true,
    demoWorkspace: true,
  };
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.id || !parsed?.email) {
      clearStoredUser();
      return null;
    }

    const user = migrateToLocal(parsed);
    if (!user) return null;

    if (!isLocalDemoUser(parsed)) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    }

    return user;
  } catch {
    clearStoredUser();
    return null;
  }
}

export function storeUser(user) {
  if (!user?.id || !user?.email) return;
  const localUser = migrateToLocal(user) || user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(localUser));
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
}

export function updateStoredUser(patch) {
  const current = getStoredUser();
  if (!current) return null;
  const next = { ...current, ...patch, isLocalDemo: true, demoWorkspace: true };
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
