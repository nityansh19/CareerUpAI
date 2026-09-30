const configured = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");
export const API_URL = configured || (import.meta.env.DEV ? "http://localhost:5000" : "");
export const TOKEN_KEY = "careerup_cloud_token_v1";
// Added: read the hosted HTTPS backend at build time; localhost is permitted only in development.

export async function api(path, { method = "GET", body, binary = false } = {}) {
  if (!API_URL) throw new Error("CareerUp is being connected to its online service. Please try again later.");
  const token = localStorage.getItem(TOKEN_KEY);
  const isForm = body instanceof FormData;
  let response;
  try {
    response = await fetch(`${API_URL}/api/account${path}`, {
      method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body && !isForm ? { "Content-Type": "application/json" } : {}) },
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
      signal: AbortSignal.timeout(90000),
    });
  } catch {
    throw new Error("Unable to reach CareerUp. Check your connection and try again. A save may have completed; reload before retrying.");
  }
  if (token && token !== localStorage.getItem(TOKEN_KEY)) throw new Error("Your session changed. Please reload the workspace.");
  // Added: prevent delayed requests from one account populating another account's cache after sign-out or switching accounts.
  if (response.status === 204) return null;
  if (response.ok && binary) return response.blob();
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "CareerUp could not complete this request.");
    error.status = response.status;
    if (response.status === 401 && token && path !== "/login") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("careerup_cloud_user_v1");
      window.dispatchEvent(new Event("careerup:session-expired"));
    }
    throw error;
  }
  return data;
}
// Added: centralize authenticated API calls, multipart uploads, timeouts and clear failure messages.
