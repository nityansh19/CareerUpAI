import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "./AuthShell";
import { createLocalDemoAccount } from "./localAccount";
import { getStoredUser, isProfileReady, storeUser } from "./session";
import "./AuthStyles.css";

export default function RegisterLocal() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const existing = getStoredUser();
    if (existing) navigate(isProfileReady(existing) ? "/dashboard" : "/onboarding", { replace: true });
  }, [navigate]);

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const user = await createLocalDemoAccount(form);
      storeUser(user);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message || "Unable to create the local demo account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell mode="register">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#76d7c4]/15 bg-[#76d7c4]/[.04] px-3 py-1.5 text-[9px] uppercase tracking-[.18em] text-[#8be5d3]">
        Local demo mode · No server required
      </div>
      <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-5xl">Create your CareerUp demo workspace.</h1>
      <p className="mt-4 text-sm leading-7 text-white/36">Your account is created only in this browser. CareerUp will load a clearly marked sample Career Profile, Resume Intelligence report and Career Intelligence matches so you can explore the product immediately.</p>

      {message && <div className="mt-6 rounded-2xl border border-rose-400/15 bg-rose-400/[.05] px-4 py-3 text-sm leading-6 text-rose-200/80">{message}</div>}

      <form onSubmit={submit} className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-medium text-white/46">Full name</span>
          <input value={form.name} onChange={(event) => setField("name", event.target.value)} required autoComplete="name" placeholder="Your full name" className="auth-input rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/18" />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-medium text-white/46">Email</span>
          <input type="email" value={form.email} onChange={(event) => setField("email", event.target.value)} required autoComplete="email" placeholder="you@example.com" className="auth-input rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/18" />
        </label>

        <label className="block">
          <div className="mb-2 flex items-center justify-between"><span className="text-xs font-medium text-white/46">Password</span><span className="text-[10px] text-white/20">6+ characters</span></div>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} value={form.password} onChange={(event) => setField("password", event.target.value)} required minLength="6" autoComplete="new-password" placeholder="Create a local demo password" className="auth-input rounded-2xl px-4 py-3.5 pr-20 text-sm text-white placeholder:text-white/18" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30 transition hover:text-white">{showPassword ? "Hide" : "Show"}</button>
          </div>
        </label>

        <button disabled={loading} className="auth-primary w-full rounded-2xl bg-[#f0d481] px-5 py-3.5 text-sm font-semibold text-[#11131a] transition hover:-translate-y-0.5 hover:bg-[#f5dc92] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0">
          <span className="relative z-10">{loading ? "Preparing demo workspace…" : "Create local demo & explore"}</span>
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-white/[.06] bg-white/[.02] p-4">
        <p className="text-[9px] uppercase tracking-[.18em] text-white/22">Explore immediately</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] text-white/35">
          <span className="rounded-xl bg-white/[.025] px-2 py-2.5">Dashboard</span>
          <span className="rounded-xl bg-white/[.025] px-2 py-2.5">Resume AI</span>
          <span className="rounded-xl bg-white/[.025] px-2 py-2.5">Career AI</span>
        </div>
        <p className="mt-3 text-[10px] leading-5 text-white/20">Demo credentials and product data stay on this browser. This is not production authentication and no account is created on a server.</p>
      </div>

      <p className="mt-6 text-center text-xs text-white/30">Already created a local demo? <Link to="/login" className="font-medium text-[#efd080] transition hover:text-white">Sign in</Link></p>
    </AuthShell>
  );
}
