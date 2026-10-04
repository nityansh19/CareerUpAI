import { useState } from "react";
import { getStoredUser } from "../auth/session";
import {
  ROLES,
  buildCareerIntelligence,
  canonicalSkill,
} from "../../../shared/careerEngine.mjs";
import { persistUser } from "../lib/workspace";
import { Icon, PageHeader } from "./WorkspaceShell";
const parse = (value) => [
  ...new Set(
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  ),
];
const message = (error, text) => (
  <p
    role={error ? "alert" : "status"}
    className={`ws-message ${error ? "ws-error" : ""}`}
  >
    {text}
  </p>
);
export default function ProfilePage() {
  const [user, setUser] = useState(() => getStoredUser()),
    [form, setForm] = useState(() => ({
      name: getStoredUser().name,
      education: getStoredUser().education || "",
      careerGoal: getStoredUser().careerGoal || "",
      skills: (getStoredUser().skills || []).join(", "),
      interests: (getStoredUser().careerInterests || []).join(", "),
    })),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState(""),
    [error, setError] = useState("");
  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    setError("");
    try {
      const skills = parse(form.skills).map(canonicalSkill),
        interests = parse(form.interests);
      if (!skills.length || !interests.length)
        throw new Error("Add at least one skill and one interest.");
      const next = {
        ...user,
        name: form.name.trim(),
        education: form.education.trim(),
        careerGoal: form.careerGoal,
        skills: [...new Set(skills)],
        careerInterests: interests,
        resumeAnalysis: user.resumeAnalysis?.demoPreview
          ? null
          : user.resumeAnalysis,
      };
      if (next.cvFile === "local-demo") {
        next.cvFile = "";
        next.cvOriginalName = "";
      }
      next.careerIntelligence = buildCareerIntelligence(next);
      setUser(await persistUser(next));
      setStatus(
        "Profile saved. Career comparisons now reflect your skills. Review your resume again if your target changed.",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageHeader
        eyebrow="YOUR CONTEXT"
        title="Your story. Your direction."
        description="Use real skills and experience to make your guidance useful."
      />
      {error && message(true, error)}
      {status && message(false, status)}
      <form
        onSubmit={save}
        className="ws-card ws-panel"
        style={{ maxWidth: 850 }}
      >
        <div className="ws-profile-heading">
          <span className="ws-profile-avatar">
            {user.name[0]?.toUpperCase()}
          </span>
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="ws-form-grid">
          <label className="ws-field">
            Full name
            <input
              required
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="ws-field">
            Education / background
            <input
              required
              maxLength={500}
              value={form.education}
              onChange={(e) => setForm({ ...form, education: e.target.value })}
            />
          </label>
          <label className="ws-field ws-span-two">
            Target role
            <select
              required
              value={form.careerGoal}
              onChange={(e) => setForm({ ...form, careerGoal: e.target.value })}
            >
              <option value="" disabled>
                Choose your target
              </option>
              {form.careerGoal &&
                !ROLES.some((r) => r.name === form.careerGoal) && (
                  <option>{form.careerGoal}</option>
                )}
              {ROLES.map((role) => (
                <option key={role.name}>{role.name}</option>
              ))}
            </select>
          </label>
          <label className="ws-field ws-span-two">
            Skills · separate with commas
            <textarea
              required
              maxLength={2000}
              rows={3}
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="Python, HTML, CSS, Git"
            />
          </label>
          <label className="ws-field ws-span-two">
            Interests · separate with commas
            <input
              required
              maxLength={1000}
              value={form.interests}
              onChange={(e) => setForm({ ...form, interests: e.target.value })}
              placeholder="Web development, data, automation"
            />
          </label>
        </div>
        <div className="ws-panel-actions">
          <button disabled={busy} className="ws-btn ws-btn-primary">
            {busy ? "Saving…" : "Save profile"}
            <Icon name="check" size={15} />
          </button>
        </div>
      </form>
    </>
  );
}
