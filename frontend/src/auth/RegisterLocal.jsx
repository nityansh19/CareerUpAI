import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "./AuthShell";
import { register } from "../cloud/account";
// Changed: register a shared online account with the backend.
import { getStoredUser, storeUser } from "./session";
import "./AuthStyles.css";

export default function RegisterLocal() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const existing = getStoredUser();
    if (existing) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const user = await register(form);
      // Changed: wait for the database-backed account and session before opening the dashboard.
      storeUser(user);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message || "Unable to create your CareerUp account.");
      // Changed: describe cloud registration failures.
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell mode="register">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#76d7c4]/15 bg-[#76d7c4]/[.04] px-3 py-1.5 text-[9px] uppercase tracking-[.18em] text-[#8be5d3]">
        One account · Any device
        {/* Changed: label the new cloud registration flow. */}
      </div>

      <h1 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-.04em] sm:text-4xl">
        Create your CareerUp account.
        {/* Changed: register a real account instead of a local testing workspace. */}
      </h1>
      <p className="mt-4 text-sm leading-7 text-white/36">
        Save your profile, jobs, interview notes and resume online, then continue from another device.
        {/* Changed: describe the data persisted by the cloud API. */}
      </p>

      {message && <div className="mt-6 rounded-2xl border border-rose-400/15 bg-rose-400/[.05] px-4 py-3 text-sm leading-6 text-rose-200/80">{message}</div>}

      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-medium text-white/46">Full name</span>
          <input
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            required
            autoComplete="name"
            placeholder="Your full name"
            className="auth-input rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/18"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-medium text-white/46">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="auth-input rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/18"
          />
        </label>

        <label className="block">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-white/46">Password</span>
            <span className="text-[10px] text-white/20">8–128 characters</span>
            {/* Changed: show the server's password length requirement. */}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) => setField("password", event.target.value)}
              required
              minLength={8}
              maxLength={128}
              // Changed: match the backend's password length validation.
              autoComplete="new-password"
              placeholder="Create a password"
              // Changed: remove the obsolete local-account label.
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
          <span className="relative z-10">{loading ? "Creating account…" : "Create account"}</span>
          {/* Changed: show online registration progress. */}
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-white/[.06] bg-white/[.02] p-4">
        <p className="text-[9px] uppercase tracking-[.18em] text-white/22">Available immediately</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] text-white/35">
          <span className="rounded-xl bg-white/[.025] px-2 py-2.5">Dashboard</span>
          <span className="rounded-xl bg-white/[.025] px-2 py-2.5">Resume AI</span>
          <span className="rounded-xl bg-white/[.025] px-2 py-2.5">Career AI</span>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-white/30">
        Already have an account?{" "}
        {/* Changed: route existing cloud members to sign-in. */}
        <Link to="/login" className="font-medium text-[#efd080] transition hover:text-white">Sign in</Link>
      </p>
    </AuthShell>
  );
}
