export const SESSION_KEY = "careerup_user";
export const LEGACY_SESSION_KEY = "user";

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY) || localStorage.getItem(LEGACY_SESSION_KEY);
    if (!raw) return null;

    const user = JSON.parse(raw);
    if (!user?.id || !user?.email) return null;

    // Keep both keys in sync until every existing module uses the new helper.
    const serialized = JSON.stringify(user);
    localStorage.setItem(SESSION_KEY, serialized);
    localStorage.setItem(LEGACY_SESSION_KEY, serialized);
    return user;
  } catch {
    clearStoredUser();
    return null;
  }
}

export function storeUser(user) {
  if (!user?.id || !user?.email) return;
  const serialized = JSON.stringify(user);
  localStorage.setItem(SESSION_KEY, serialized);
  localStorage.setItem(LEGACY_SESSION_KEY, serialized);
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
  localStorage.removeItem(LEGACY_SESSION_KEY);
  localStorage.removeItem("careerup_cv_name");
}

export function isLoggedIn() {
  return Boolean(getStoredUser());
}
