import { createDemoWorkspaceUser } from "../demoIntelligence";

const CREDENTIALS_KEY = "careerup_local_credentials_v1";
export const LOCAL_USER_KEY = "careerup_local_user_v1";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function nameFromEmail(email) {
  const localPart = normalizeEmail(email).split("@")[0] || "CareerUp Tester";
  const words = localPart.replace(/[._-]+/g, " ").trim();
  return words
    ? words.replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "CareerUp Tester";
}

async function hashPassword(password) {
  const value = String(password || "");
  if (globalThis.crypto?.subtle && globalThis.TextEncoder) {
    const bytes = new TextEncoder().encode(value);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `fallback-${(hash >>> 0).toString(16)}`;
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function newLocalId() {
  return `local-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`}`;
}

export function isLocalDemoUser(user) {
  return Boolean(user?.isLocalDemo || String(user?.id || "").startsWith("local-"));
}

export function getPersistedLocalUser() {
  return readJson(LOCAL_USER_KEY);
}

export async function createLocalDemoAccount({ name, email, password }) {
  const cleanName = String(name || "").trim();
  const cleanEmail = normalizeEmail(email);
  const cleanPassword = String(password || "");

  if (!cleanName || !cleanEmail || cleanPassword.length < 6) {
    throw new Error("Enter your name, email and a password with at least 6 characters.");
  }

  const existingCredentials = readJson(CREDENTIALS_KEY);
  if (existingCredentials?.email === cleanEmail) {
    throw new Error("A local CareerUp account with this email already exists on this browser. Sign in instead.");
  }

  const id = newLocalId();
  const passwordHash = await hashPassword(cleanPassword);
  const user = createDemoWorkspaceUser({ id, name: cleanName, email: cleanEmail });

  localStorage.setItem(
    CREDENTIALS_KEY,
    JSON.stringify({ id, email: cleanEmail, passwordHash, createdAt: new Date().toISOString() })
  );
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  return user;
}

export async function authenticateLocalDemoAccount(email, password) {
  const credentials = readJson(CREDENTIALS_KEY);
  const user = getPersistedLocalUser();

  if (!credentials || !user) {
    throw new Error("No local CareerUp account was found on this browser.");
  }

  const cleanEmail = normalizeEmail(email);
  const passwordHash = await hashPassword(password);

  if (credentials.email !== cleanEmail || credentials.passwordHash !== passwordHash) {
    throw new Error("Invalid email or password for this local CareerUp workspace.");
  }

  return user;
}

// Testing-mode login: if this browser has no local account yet, the first
// successful-looking login creates one locally so the workspace can be explored.
export async function openLocalWorkspace(email, password) {
  const cleanEmail = normalizeEmail(email);
  const cleanPassword = String(password || "");

  if (!cleanEmail || cleanPassword.length < 6) {
    throw new Error("Enter a valid email and a password with at least 6 characters.");
  }

  const credentials = readJson(CREDENTIALS_KEY);
  const user = getPersistedLocalUser();

  if (!credentials) {
    const id = newLocalId();
    const passwordHash = await hashPassword(cleanPassword);
    const localUser = createDemoWorkspaceUser({
      id,
      name: nameFromEmail(cleanEmail),
      email: cleanEmail,
    });

    localStorage.setItem(
      CREDENTIALS_KEY,
      JSON.stringify({ id, email: cleanEmail, passwordHash, createdAt: new Date().toISOString() })
    );
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    return localUser;
  }

  const passwordHash = await hashPassword(cleanPassword);
  if (credentials.email !== cleanEmail || credentials.passwordHash !== passwordHash) {
    throw new Error("Invalid email or password for this local CareerUp workspace.");
  }

  if (user) return user;

  const recoveredUser = createDemoWorkspaceUser({
    id: credentials.id || newLocalId(),
    name: nameFromEmail(cleanEmail),
    email: cleanEmail,
  });
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(recoveredUser));
  return recoveredUser;
}
