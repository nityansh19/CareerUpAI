import { api } from "../cloud/api";
import { getStoredUser, storeUser } from "../auth/session";
// Changed: preserve the storage entry points while persisting through authenticated cloud APIs.

export function readPractice() {
  return getStoredUser()?.interview || null;
}
// Changed: read practice loaded from the server instead of a device-specific key.

export async function savePractice(userId, practice, version) {
  // Changed: use the revision belonging to the displayed practice draft, not an unrelated refreshed cache.
  const user = getStoredUser();
  if (!user || user.id !== userId) throw new Error("Sign in before saving your practice.");
  const result = await api("/interview", { method: "PUT", body: { interview: practice, version } });
  // Changed: reject edits when another device changed this draft's original revision.
  storeUser(result.user);
  return result.user.interviewVersion;
  // Added: pass the confirmed revision back to the serialized save queue.
}
// Changed: persist interview notes with revision checks and report failed saves.

export async function saveResume(userId, file, analyze = false) {
  const user = getStoredUser();
  if (!user || user.id !== userId) throw new Error("Sign in before saving a resume.");
  if (file.type !== "application/pdf") throw new Error("Choose a PDF resume.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Choose a PDF smaller than 5 MB.");
  const body = new FormData();
  body.append("resume", file);
  body.append("analyze", String(analyze));
  body.append("version", String(user.resumeVersion));
  const { user: next } = await api("/resume", { method: "POST", body });
  storeUser(next);
  return next;
}
// Changed: save the PDF in MongoDB and optionally analyze its actual text on the backend.

export async function readResume(userId) {
  const user = getStoredUser();
  if (!user || user.id !== userId) throw new Error("Sign in before downloading a resume.");
  const blob = await api("/resume", { binary: true });
  return new File([blob], user.cvOriginalName || "resume.pdf", { type: "application/pdf" });
}
// Changed: retrieve the authenticated account's PDF on any device instead of using IndexedDB.
