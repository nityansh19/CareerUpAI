import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "./AuthShell";
import { apiUrl } from "../lib/api";
import { authenticateLocalDemoAccount } from "./localAccount";
import { getStoredUser, isProfileReady, storeUser } from "./session";
import "./AuthStyles.css";

const remoteAuthEnabled = Boolean(String(import.meta.env.VITE_API_URL || "").trim());

export default function LoginLocal() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const existing = getStoredUser();
    if (existing) navigate(isProfileReady(existing) ? "/dashboard" : "/onboarding", { replace: true });
  }, [navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let user;

      if (remoteAuthEnabled) {
        const response = await fetch(apiUrl("/api/users/login"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data.message || "Unable to sign in.");
        }

        user = data.user;
      } else {
        user = await authenticateLocalDemoAccount(email, password);
      }

      storeUser(user);
      navigate(isProfileReady(user) ? "/dashboard" : "/onboarding", { replace: true });
    } catch (error) {
      if (error instanceof TypeError) {
        setMessage("Cannot reach the CareerUp API. Check the deployed backend URL and try again.");
      } else {
        setMessage(error.message || (remoteAuthEnabled ? "Unable to sign in." : "Unable to open the local demo account."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell mode="login">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#76d7c4]/15 bg-[#76d7c4]/[.04] px-3 py-1.5 text-[9px] uppercase tracking-[.18em] text-[#8be5d3]">
        <span className="auth-live-dot h-1.5 w-1.5 rounded-full bg-[#76d7c4]" /> {remoteAuthEnabled ? "Secure workspace access" : "Local demo access"}
      </div>
      <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-.04em] sm:text-4xl">Welcome back.</h2>
      <p className="mt-4 text-sm leading-7 text-white/36">{remoteAuthEnabled ? "Sign in to continue from your saved Career Profile, resume intelligence and role-readiness context." : "Sign in to the local CareerUp demo saved in this browser. No backend request is required to open the workspace."}</p>

      {message && <div className="mt-6 rounded-2xl border border-rose-400/15 bg-rose-400/[.05] px-4 py-3 text-sm leading-6 text-rose-200/80">{message}</div>}

      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-medium text-white/46">Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="you@example.com" className="auth-input rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/18" />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-medium text-white/46">Password</span>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" placeholder={remoteAuthEnabled ? "Enter your password" : "Enter your local demo password"} className="auth-input rounded-2xl px-4 py-3.5 pr-20 text-sm text-white placeholder:text-white/18" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30 transition hover:text-white">{showPassword ? "Hide" : "Show"}</button>
          </div>
        </label>

        <button disabled={loading} className="auth-primary w-full rounded-2xl bg-[#f0d481] px-5 py-3.5 text-sm font-semibold text-[#11131a] transition hover:-translate-y-0.5 hover:bg-[#f5dc92] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">
          <span className="relative z-10">{loading ? (remoteAuthEnabled ? "Signing in…" : "Opening local workspace…") : (remoteAuthEnabled ? "Continue to CareerUp" : "Open CareerUp demo")}</span>
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-white/[.06] bg-white/[.02] p-4 text-[10px] leading-5 text-white/22">
        {remoteAuthEnabled
          ? "Your account is verified by the CareerUp backend and your saved workspace is restored after sign-in."
          : "This demo account exists only in this browser. Logging out keeps the local demo so you can sign back in later, but clearing site data removes it."}
      </div>
      <p className="mt-6 text-center text-xs text-white/30">{remoteAuthEnabled ? "New to CareerUp?" : "Need a local demo account?"} <Link to="/register" className="font-medium text-[#efd080] transition hover:text-white">{remoteAuthEnabled ? "Create an account" : "Create one"}</Link></p>
    </AuthShell>
  );
}
