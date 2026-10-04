import { createDemoWorkspaceUser } from "../demoIntelligence.js";
const ACCOUNTS_KEY = "careerup_accounts_v2";
export const LOCAL_USER_KEY = "careerup_local_user_v1";
const LEGACY_CREDENTIALS = "careerup_local_credentials_v1";
const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();
const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
};
const hex = (bytes) =>
  Array.from(new Uint8Array(bytes), (value) =>
    value.toString(16).padStart(2, "0"),
  ).join("");
async function passwordDigest(password, salt) {
  if (!crypto?.subtle)
    throw new Error(
      "A secure connection is required to create an account. Open the HTTPS site.",
    );
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return hex(
    await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: new TextEncoder().encode(salt),
        iterations: 150000,
        hash: "SHA-256",
      },
      key,
      256,
    ),
  );
}
function accounts() {
  const values = read(ACCOUNTS_KEY) || {};
  const old = read(LEGACY_CREDENTIALS);
  if (old?.email && !values[old.email])
    values[old.email] = { ...old, legacy: true };
  return values;
}
export function isLocalDemoUser(user) {
  return user?.authMode !== "cloud";
}
export function getPersistedLocalUser(id) {
  return read(`careerup_profile_${id}`) || read(LOCAL_USER_KEY);
}
export function emptyUser({ id, name, email, authMode = "local" }) {
  return {
    id,
    name,
    email,
    authMode,
    isLocalDemo: false,
    education: "",
    skills: [],
    careerInterests: [],
    careerGoal: "",
    cvFile: "",
    cvOriginalName: "",
    resumeAnalysis: null,
    careerIntelligence: null,
    workspace: { jobs: [], milestones: {}, interviews: [] },
  };
}
export async function createLocalDemoAccount({ name, email, password }) {
  const cleanName = String(name || "").trim();
  const cleanEmail = normalize(email);
  if (
    !cleanName ||
    cleanName.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
    password.length < 8 ||
    password.length > 128
  )
    throw new Error(
      "Enter your name, a valid email, and a password with 8–128 characters.",
    );
  const values = accounts();
  if (values[cleanEmail])
    throw new Error(
      "An account with this email already exists on this device. Sign in instead.",
    );
  const id = `local-${crypto.randomUUID()}`;
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  const passwordHash = await passwordDigest(password, salt);
  const user = emptyUser({ id, name: cleanName, email: cleanEmail });
  // Write the profile first so a failed credentials write can be retried safely.
  localStorage.setItem(`careerup_profile_${id}`, JSON.stringify(user));
  localStorage.setItem(
    ACCOUNTS_KEY,
    JSON.stringify({
      ...values,
      [cleanEmail]: { id, email: cleanEmail, salt, passwordHash },
    }),
  );
  return user;
}
export async function authenticateLocalDemoAccount(email, password) {
  const values = accounts();
  const record = values[normalize(email)];
  if (!record)
    throw new Error(
      "No account with this email exists on this device. Create an account or try the demo.",
    );
  const digest = record.legacy
    ? hex(
        await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(password),
        ),
      )
    : await passwordDigest(password, record.salt);
  if (digest !== record.passwordHash)
    throw new Error("The email or password is incorrect.");
  const user = getPersistedLocalUser(record.id);
  if (!user || user.id !== record.id)
    throw new Error(
      "The saved profile is missing. Restore a workspace backup if you have one.",
    );
  if (record.legacy) {
    const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
    values[normalize(email)] = {
      id: record.id,
      email: normalize(email),
      salt,
      passwordHash: await passwordDigest(password, salt),
    };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(values));
    localStorage.removeItem(LEGACY_CREDENTIALS);
  }
  return { ...user, authMode: "local" };
}
export const openLocalWorkspace = authenticateLocalDemoAccount;
export function startDemoWorkspace() {
  const saved = read("careerup_profile_demo-careerup");
  return (
    saved || {
      ...createDemoWorkspaceUser({
        id: "demo-careerup",
        name: "Alex Morgan",
        email: "demo@example.com",
      }),
      authMode: "demo",
      workspace: { jobs: [], milestones: {}, interviews: [] },
    }
  );
}
