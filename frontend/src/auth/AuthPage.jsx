import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "./AuthShell";
import { storeUser, isProfileReady } from "./session";
import { startDemoWorkspace } from "./localAccount";
import {
  authenticate,
  CLOUD_ENABLED,
  resendVerification,
  verifyEmailAddress,
} from "../lib/workspace";
import "./AuthStyles.css";

export default function AuthPage({ register = false }) {
  const navigate = useNavigate(),
    location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" }),
    [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [verificationEmail, setVerificationEmail] = useState(""),
    [code, setCode] = useState("");

  const field = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const finishSignIn = (user) => {
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
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await authenticate(form, register);
      if (result?.verificationRequired) {
        setVerificationEmail(
          result.email || form.email.trim().toLowerCase(),
        );
        setNotice(
          "We sent a 6-digit code to your email. Enter it below to activate your account.",
        );
        return;
      }
      finishSignIn(result);
    } catch (e) {
      if (e.code === "EMAIL_NOT_VERIFIED") {
        setVerificationEmail(form.email.trim().toLowerCase());
        setNotice(
          "Your password is correct, but this email still needs verification.",
        );
      } else {
        setError(e.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const verify = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const user = await verifyEmailAddress(verificationEmail, code);
      finishSignIn(user);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await resendVerification(verificationEmail);
      setNotice(result.message || "A new verification code has been sent.");
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

  if (verificationEmail) {
    return (
      <AuthShell mode="register">
        <span className="auth-pill">Verify your email</span>
        <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight">
          Check your inbox.
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/60">
          We only activate accounts after you prove you can access{" "}
          <span className="text-white/85">{verificationEmail}</span>.
        </p>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        {notice && (
          <p className="mt-4 text-sm leading-6 text-[#f0d481]" role="status">
            {notice}
          </p>
        )}
        <form onSubmit={verify} className="mt-6 space-y-4">
          <label className="auth-field">
            6-digit verification code
            <input
              className="auth-input"
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="123456"
            />
          </label>
          <button disabled={busy || code.length !== 6} className="auth-submit">
            {busy ? "Verifying…" : "Verify email & continue"}
          </button>
        </form>
        <button
          type="button"
          className="auth-demo"
          disabled={busy}
          onClick={resend}
        >
          Send a new code
        </button>
        <button
          type="button"
          className="mt-3 w-full text-center text-xs text-white/55 hover:text-white"
          disabled={busy}
          onClick={() => {
            setVerificationEmail("");
            setCode("");
            setError("");
            setNotice("");
          }}
        >
          Use a different email
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell mode={register ? "register" : "login"}>
      <span className="auth-pill">
        {CLOUD_ENABLED
          ? "Verified accounts, connected workspace"
          : "Sample workspace available"}
      </span>
      <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight">
        {register ? "Make your next move count." : "Welcome back."}
      </h1>
      <p className="mt-4 text-sm leading-7 text-white/60">
        {register
          ? "Create your account with an email you can verify, then build your career workspace."
          : "Sign in with your verified email to continue where you left off."}
      </p>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-4 text-sm leading-6 text-[#f0d481]" role="status">
          {notice}
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
        <button disabled={busy || !CLOUD_ENABLED} className="auth-submit">
          {busy
            ? "Checking your account…"
            : register
              ? "Create verified account"
              : "Sign in"}
        </button>
      </form>
      {!CLOUD_ENABLED && (
        <p className="auth-error" role="status">
          Online accounts need VITE_API_URL configured. Fake device-email
          accounts are disabled for Login and Create Account.
        </p>
      )}
      <p className="mt-5 text-center text-xs text-white/60">
        {register ? "Already have an account?" : "New to CareerUpAI?"}{" "}
        <Link className="text-[#f0d481]" to={register ? "/login" : "/register"}>
          {register ? "Sign in" : "Create account"}
        </Link>
      </p>
      <div className="auth-data-note">
        Real accounts require email verification before a session is created.{" "}
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
