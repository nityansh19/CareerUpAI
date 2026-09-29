const rawConfiguredApiUrl = String(import.meta.env.VITE_API_URL || "").trim();
const pointsToLocalMachine = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(rawConfiguredApiUrl);

// A deployed browser can never reach the developer's localhost backend.
// Ignore an accidentally configured localhost URL in production instead of throwing "Failed to fetch".
export const configuredApiUrl =
  import.meta.env.PROD && pointsToLocalMachine ? "" : rawConfiguredApiUrl;

export const API_BASE = (
  configuredApiUrl ||
  (import.meta.env.DEV ? "http://localhost:5000" : "")
).replace(/\/$/, "");

export function apiUrl(path) {
  if (!API_BASE) {
    throw new Error(
      "CareerUp API is not configured. Set VITE_API_URL to a public HTTPS backend URL."
    );
  }

  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
