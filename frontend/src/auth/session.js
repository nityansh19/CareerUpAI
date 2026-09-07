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

export function isLoggedIn() {
  return Boolean(getStoredUser());
}
