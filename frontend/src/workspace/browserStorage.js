const STORAGE_ERROR = "Unable to save on this device. Browser storage may be full or disabled. Free some space or allow site storage and try again.";

export function readPractice(userId) {
  try {
    const value = JSON.parse(localStorage.getItem(`careerup_interview_${userId}`));
    if (!value || typeof value.role !== "string" ||
        !["Mixed", "Technical", "Behavioral"].includes(value.type) ||
        !["Foundations", "Standard", "Advanced"].includes(value.difficulty) ||
        typeof value.started !== "boolean" || !Number.isInteger(value.step) ||
        value.step < 0 || value.step > 3 || typeof value.answer !== "string" ||
        !Array.isArray(value.answers) || value.answers.length !== value.step ||
        value.answers.some(answer => typeof answer !== "string")) return null;
    return value;
  } catch { return null; }
}

export function savePractice(userId, practice) {
  try {
    localStorage.setItem(`careerup_interview_${userId}`, JSON.stringify(practice));
  } catch { throw new Error(STORAGE_ERROR); }
}

async function resumeTransaction(mode, operation) {
  if (!globalThis.indexedDB) throw new Error(STORAGE_ERROR);
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open("careerup_files_v1", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("resumes");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error(STORAGE_ERROR));
  });
  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction("resumes", mode);
      const request = operation(transaction.objectStore("resumes"));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(new Error(STORAGE_ERROR));
      transaction.onerror = () => reject(new Error(STORAGE_ERROR));
    });
  } finally { db.close(); }
}

export async function saveResume(userId, file) {
  if (!userId) throw new Error("Sign in before saving a resume.");
  if (file.type !== "application/pdf") throw new Error("Choose a PDF resume.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Choose a PDF smaller than 5 MB.");
  await resumeTransaction("readwrite", store => store.put(file, userId));
}

export function readResume(userId) {
  return resumeTransaction("readonly", store => store.get(userId));
}
