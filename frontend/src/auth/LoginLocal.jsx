import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "./AuthShell";
import { openLocalWorkspace } from "./localAccount";
import { getStoredUser, storeUser } from "./session";
import "./AuthStyles.css";

export default function LoginLocal() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const existing = getStoredUser();
    if (existing) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const user = await openLocalWorkspace(email, password);
      storeUser(user);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message || "Unable to open your local CareerUp workspace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell mode="login">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#76d7c4]/15 bg-[#76d7c4]/[.04] px-3 py-1.5 text-[9px] uppercase tracking-[.18em] text-[#8be5d3]">
        <span className="auth-live-dot h-1.5 w-1.5 rounded-full bg-[#76d7c4]" /> Local testing access
      </div>

      <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-.04em] sm:text-4xl">Welcome back.</h2>
      <p className="mt-4 text-sm leading-7 text-white/36">
        Everything is stored only in this browser for the testing phase. No backend or database connection is used.
      </p>

      {message && <div className="mt-6 rounded-2xl border border-rose-400/15 bg-rose-400/[.05] px-4 py-3 text-sm leading-6 text-rose-200/80">{message}</div>}

      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-medium text-white/46">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="auth-input rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/18"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-medium text-white/46">Password</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              autoComplete="current-password"
              placeholder="Enter your local testing password"
              className="auth-input rounded-2xl px-4 py-3.5 pr-20 text-sm text-white placeholder:text-white/18"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30 transition hover:text-white"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <button
          disabled={loading}
          className="auth-primary w-full rounded-2xl bg-[#f0d481] px-5 py-3.5 text-sm font-semibold text-[#11131a] transition hover:-translate-y-0.5 hover:bg-[#f5dc92] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <span className="relative z-10">{loading ? "Opening workspace…" : "Continue to CareerUp"}</span>
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-white/[.06] bg-white/[.02] p-4 text-[10px] leading-5 text-white/22">
        On the first login in this browser, CareerUp automatically creates a local testing workspace. Your changes stay on this device until browser storage is cleared.
      </div>

      <p className="mt-6 text-center text-xs text-white/30">
        Prefer to create the local account first?{" "}
        <Link to="/register" className="font-medium text-[#efd080] transition hover:text-white">Create one</Link>
      </p>
    </AuthShell>
  );
}
