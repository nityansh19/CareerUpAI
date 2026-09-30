import { useEffect, useState } from "react";
import { api, TOKEN_KEY } from "./api";
import { clearStoredUser, storeUser } from "../auth/session";
// Added: verify a saved login and load the latest MongoDB data before rendering protected screens.

export default function CloudGate({ children }) {
  const [state, setState] = useState(() => localStorage.getItem(TOKEN_KEY) ? "loading" : "ready");
  const [message, setMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    const expired = () => { if (active) { setMessage("Your session expired. Please sign in again."); setState("expired"); } };
    window.addEventListener("careerup:session-expired", expired);
    if (localStorage.getItem(TOKEN_KEY)) {
      api("/me").then(({ user }) => {
        if (active) { storeUser(user); setState("ready"); }
      }).catch((error) => {
        if (active) { setMessage(error.message); setState(error.status === 401 ? "expired" : "error"); }
      });
    }
    return () => { active = false; window.removeEventListener("careerup:session-expired", expired); };
  }, [attempt]);
  if (state === "ready") return children;
  return <main className="auth-page min-h-screen bg-[#050711] p-8 text-white" role="status">
    <h1>CareerUp AI</h1><p>{state === "loading" ? "Loading your online workspace…" : message}</p>
    {state === "error" && <button onClick={() => { setState("loading"); setAttempt((value) => value + 1); }}>Try again</button>}
    {state !== "loading" && <button onClick={() => { clearStoredUser(); window.location.assign("/login"); }}>Go to sign in</button>}
  </main>;
}
// Added: show recoverable loading/session errors instead of treating a stale browser cache as an online login.
