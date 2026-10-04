import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "./session";
import { persistUser } from "../lib/workspace";
import {
  ROLES,
  canonicalSkill,
  buildCareerIntelligence,
} from "../../../shared/careerEngine.mjs";
import { PageHeader, Icon } from "../workspace/WorkspaceShell";
export default function Onboarding() {
  const navigate = useNavigate(),
    user = getStoredUser();
  const [step, setStep] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [form, setForm] = useState({
    education: user?.education || "",
    careerGoal: user?.careerGoal || ROLES[0].name,
    skills: (user?.skills || []).join(", "),
    interests: (user?.careerInterests || []).join(", "),
  });
  const update = (key, value) => setForm({ ...form, [key]: value });
  const submit = async (event) => {
    event.preventDefault();
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const skills = [
        ...new Set(
          form.skills
            .split(",")
            .map((s) => canonicalSkill(s))
            .filter(Boolean),
        ),
      ];
      const interests = [
        ...new Set(
          form.interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        ),
      ];
      if (!skills.length || !interests.length)
        throw new Error("Add at least one real skill and one interest.");
      const next = { ...user, ...form, skills, careerInterests: interests };
      next.careerIntelligence = buildCareerIntelligence(next);
      await persistUser(next);
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageHeader
        eyebrow="A CLEAR START"
        title="Make this workspace yours."
        description="Three small steps. Your real background, your real goals."
      />
      <div className="ws-card ws-panel ws-onboarding">
        <div className="ws-onboarding-steps">
          {["Your background", "Your direction", "Your skills"].map(
            (label, i) => (
              <span key={label} className={i <= step ? "active" : ""}>
                0{i + 1} · {label}
              </span>
            ),
          )}
        </div>
        {error && (
          <p className="ws-message" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={submit}>
          <p className="ws-section-kicker">STEP {step + 1} OF 3</p>
          <h2>
            {
              [
                "Where are you starting?",
                "What do you want to build toward?",
                "What can you already work with?",
              ][step]
            }
          </h2>
          {step === 0 && (
            <label className="ws-field">
              Education or current background
              <input
                autoFocus
                required
                maxLength={500}
                value={form.education}
                onChange={(e) => update("education", e.target.value)}
                placeholder="e.g. BCA student · 5th semester"
              />
            </label>
          )}
          {step === 1 && (
            <>
              <label className="ws-field">
                Target role
                <select
                  value={form.careerGoal}
                  onChange={(e) => update("careerGoal", e.target.value)}
                >
                  {ROLES.map((role) => (
                    <option key={role.name}>{role.name}</option>
                  ))}
                </select>
              </label>
              <label className="ws-field">
                Interests · separate with commas
                <input
                  required
                  maxLength={1000}
                  value={form.interests}
                  onChange={(e) => update("interests", e.target.value)}
                  placeholder="Web development, data, automation"
                />
              </label>
            </>
          )}
          {step === 2 && (
            <>
              <label className="ws-field">
                Skills · separate with commas
                <textarea
                  autoFocus
                  required
                  rows={4}
                  maxLength={2000}
                  value={form.skills}
                  onChange={(e) => update("skills", e.target.value)}
                  placeholder="Python, HTML, CSS, Git"
                />
              </label>
              <p className="ws-muted">
                Add skills you have actually used. You can update these as you
                learn.
              </p>
            </>
          )}
          <div className="ws-onboarding-actions">
            {step > 0 && (
              <button
                type="button"
                className="ws-btn"
                disabled={busy}
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
            <button className="ws-btn ws-btn-primary" disabled={busy}>
              {busy ? "Saving…" : step === 2 ? "Open my workspace" : "Continue"}
              <Icon name="arrow" size={16} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
