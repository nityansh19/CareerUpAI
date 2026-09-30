import { api, TOKEN_KEY } from "../cloud/api";
// Changed: use authenticated cloud sessions without converting server accounts to demo accounts.

export const SESSION_KEY = "careerup_cloud_user_v1";
// Changed: isolate the cloud cache so existing browser-only data remains intact for manual migration.

export function getStoredUser() {
  try {
    if (!localStorage.getItem(TOKEN_KEY)) return null;
    // Added: a cached profile alone cannot create a cloud session.
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.id || !parsed?.email) {
      clearStoredUser();
      return null;
    }

    return parsed;
    // Changed: preserve the authenticated account ID and cloud data exactly as returned by the API.
  } catch {
    clearStoredUser();
    return null;
  }
}

export function storeUser(user) {
  if (!user?.id || !user?.email) return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("careerup:user-updated"));
  // Changed: cache confirmed cloud data and refresh account displays without altering legacy local records.
}

export function updateStoredUser(patch) {
  const current = getStoredUser();
  if (!current) return null;
  const next = { ...current, ...patch };
  // Changed: stop marking updated cloud profiles as local demos; this helper updates only the cache.
  storeUser(next);
  return next;
}

export function clearStoredUser() {
  if (localStorage.getItem(TOKEN_KEY)) void api("/logout", { method: "POST" }).catch(() => {});
  localStorage.removeItem(TOKEN_KEY);
  // Added: revoke the online session when reachable and always remove the local bearer token.
  localStorage.removeItem(SESSION_KEY);
  // Changed: clear only cloud session data and preserve the earlier browser workspace.
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
