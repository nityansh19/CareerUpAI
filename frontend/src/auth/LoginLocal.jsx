import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../lib/api";
import AuthShell from "./AuthShell";
import { getStoredUser, isProfileReady, storeUser } from "./session";
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
    if (existing) navigate(isProfileReady(existing) ? "/dashboard" : "/onboarding", { replace: true });
  }, [navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(apiUrl("/api/users/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid email or password.");

      storeUser(data.user);
      navigate(isProfileReady(data.user) ? "/dashboard" : "/onboarding", { replace: true });
    } catch (error) {
      setMessage(error.message || "Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell mode="login">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/[.07] bg-white/[.025] px-3 py-1.5 text-[9px] uppercase tracking-[.18em] text-white/35">
        <span className="auth-live-dot h-1.5 w-1.5 rounded-full bg-[#76d7c4]" /> Secure workspace access
      </div>
      <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-5xl">Welcome back.</h2>
      <p className="mt-4 text-sm leading-7 text-white/36">Sign in to continue from your saved Career Profile, resume intelligence and role-readiness context.</p>

      {message && <div className="mt-6 rounded-2xl border border-rose-400/15 bg-rose-400/[.05] px-4 py-3 text-sm leading-6 text-rose-200/80">{message}</div>}

      <form onSubmit={submit} className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-medium text-white/46">Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="you@example.com" className="auth-input rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/18" />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-medium text-white/46">Password</span>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" placeholder="Enter your password" className="auth-input rounded-2xl px-4 py-3.5 pr-20 text-sm text-white placeholder:text-white/18" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30 transition hover:text-white">{showPassword ? "Hide" : "Show"}</button>
          </div>
        </label>

        <button disabled={loading} className="auth-primary w-full rounded-2xl bg-[#f0d481] px-5 py-3.5 text-sm font-semibold text-[#11131a] transition hover:-translate-y-0.5 hover:bg-[#f5dc92] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">
          <span className="relative z-10">{loading ? "Opening workspace…" : "Continue to CareerUp"}</span>
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3 text-[10px] text-white/22"><span className="h-px flex-1 bg-white/[.06]" /><span>Your local session stays available after refresh</span><span className="h-px flex-1 bg-white/[.06]" /></div>
      <p className="mt-6 text-center text-xs text-white/30">New to CareerUp? <Link to="/register" className="font-medium text-[#efd080] transition hover:text-white">Create your account</Link></p>
    </AuthShell>
  );
}
