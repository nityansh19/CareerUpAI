const configuredApiUrl = String(import.meta.env.VITE_API_URL || "").trim();

export const API_BASE = (
  configuredApiUrl ||
  (import.meta.env.DEV ? "http://localhost:5000" : "")
).replace(/\/$/, "");

export function apiUrl(path) {
  if (!API_BASE) {
    throw new Error(
      "CareerUp API is not configured. Set VITE_API_URL to your deployed backend URL."
    );
  }

  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
