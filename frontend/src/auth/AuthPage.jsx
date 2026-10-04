import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "./AuthShell";
import { storeUser, isProfileReady } from "./session";
import { startDemoWorkspace } from "./localAccount";
import { authenticate, CLOUD_ENABLED } from "../lib/workspace";
import "./AuthStyles.css";
export default function AuthPage({ register = false }) {
  const navigate = useNavigate(),
    location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" }),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const field = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await authenticate(form, register);
      storeUser(user);
      const next = location.state?.from;
      const target =
        typeof next === "string" &&
        /^\/(dashboard|profile|skills|jobs|interview|career-intelligence|resume-intelligence|settings)$/.test(
          next,
        )
          ? next
          : "/dashboard";
      navigate(isProfileReady(user) ? target : "/onboarding", {
        replace: true,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const demo = () => {
    try {
      storeUser(startDemoWorkspace());
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <AuthShell mode={register ? "register" : "login"}>
      <span className="auth-pill">
        {CLOUD_ENABLED
          ? "Your career, connected"
          : "Your personal career workspace"}
      </span>
      <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight">
        {register ? "Make your next move count." : "Welcome back."}
      </h1>
      <p className="mt-4 text-sm leading-7 text-white/60">
        {register
          ? "Start with your skills and goals. Build a clear plan, improve your resume, and track your progress."
          : "Pick up your learning plan, resume review, and applications where you left off."}
      </p>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      <form onSubmit={submit} className="mt-6 space-y-4">
        {register && (
          <label className="auth-field">
            Full name
            <input
              className="auth-input"
              required
              maxLength={100}
              autoComplete="name"
              value={form.name}
              onChange={(e) => field("name", e.target.value)}
              placeholder="Your full name"
            />
          </label>
        )}
        <label className="auth-field">
          Email
          <input
            className="auth-input"
            required
            type="email"
            maxLength={254}
            autoComplete="email"
            value={form.email}
            onChange={(e) => field("email", e.target.value)}
            placeholder="you@example.com"
          />
        </label>
        <label className="auth-field">
          Password
          <div className="auth-password">
            <input
              className="auth-input"
              required
              minLength={register ? 8 : 6}
              maxLength={128}
              type={show ? "text" : "password"}
              autoComplete={register ? "new-password" : "current-password"}
              value={form.password}
              onChange={(e) => field("password", e.target.value)}
              placeholder={register ? "At least 8 characters" : "Your password"}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </label>
        <button disabled={busy} className="auth-submit">
          {busy
            ? "Opening your workspace…"
            : register
              ? "Create account"
              : "Sign in"}
        </button>
      </form>
      <p className="mt-5 text-center text-xs text-white/60">
        {register ? "Already have an account?" : "New to CareerUpAI?"}{" "}
        <Link className="text-[#f0d481]" to={register ? "/login" : "/register"}>
          {register ? "Sign in" : "Create account"}
        </Link>
      </p>
      <div className="auth-data-note">
        {CLOUD_ENABLED
          ? "Your profile and workspace sync to your account."
          : "Your account and workspace are saved on this device. Export a backup in Settings to keep a copy or move devices. Device passwords do not provide shared-device security."}{" "}
        <Link to="/privacy">Data & privacy</Link>
      </div>
      <button
        type="button"
        className="auth-demo"
        disabled={busy}
        onClick={demo}
      >
        Explore a sample workspace <span aria-hidden="true">→</span>
      </button>
    </AuthShell>
  );
}
