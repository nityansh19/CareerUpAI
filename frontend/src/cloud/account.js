import { api, TOKEN_KEY } from "./api";
import { storeUser } from "../auth/session";
// Added: connect the existing sign-in and registration screens to cloud accounts.

async function authenticate(path, credentials) {
  const result = await api(path, { method: "POST", body: credentials });
  localStorage.setItem(TOKEN_KEY, result.token);
  storeUser(result.user);
  return result.user;
}
// Added: cache only the authenticated user and session returned by the backend.

export const login = (email, password) => authenticate("/login", { email, password });
export const register = (form) => authenticate("/register", form);
// Added: keep login and registration distinct; login never creates an account automatically.
