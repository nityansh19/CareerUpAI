import { useState } from "react";
import { Link } from "react-router-dom";
import { getStoredUser } from "../auth/session";
import {
  ROLES,
  buildCareerIntelligence,
  learningPlan,
} from "../../../shared/careerEngine.mjs";
import { persistUser } from "../lib/workspace";
import { DemoBanner, EmptyState, Icon, PageHeader } from "./WorkspaceShell";
const message = (error, text) => (
  <p
    role={error ? "alert" : "status"}
    className={`ws-message ${error ? "ws-error" : ""}`}
  >
    {text}
  </p>
);
export default function SkillsPage() {
  const [user, setUser] = useState(() => getStoredUser()),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const selected = user.workspace?.learningRole || user.careerGoal;
  const plan = learningPlan(user, selected),
    completed = user.workspace?.milestones || {};
  const done = plan.filter((item) => completed[item.id]).length;
  const save = async (patch) => {
    setBusy(true);
    setError("");
    try {
      setUser(
        await persistUser({
          ...user,
          workspace: { ...user.workspace, ...patch },
        }),
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const learn = async (skill) => {
    setBusy(true);
    try {
      const next = { ...user, skills: [...new Set([...user.skills, skill])] };
      next.careerIntelligence = buildCareerIntelligence(next);
      setUser(await persistUser(next));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      {user.authMode === "demo" && <DemoBanner />}
      <PageHeader
        eyebrow="GROW / LEARNING PLAN"
        title="Turn your ambition into progress."
        description="Learn the foundations, build proof, and make your work easy to review."
        action={
          <Link to="/profile" className="ws-btn">
            Edit skills <Icon name="arrow" size={15} />
          </Link>
        }
      />
      {error && message(true, error)}
      <section className="ws-card ws-plan-summary">
        <div>
          <p className="ws-section-kicker">YOUR DIRECTION</p>
          <label className="ws-field">
            Learning path
            <select
              disabled={busy}
              value={ROLES.some((r) => r.name === selected) ? selected : ""}
              onChange={(e) => save({ learningRole: e.target.value })}
            >
              <option disabled value="">
                Choose a path
              </option>
              {ROLES.map((role) => (
                <option key={role.name}>{role.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="ws-plan-progress">
          <strong>
            {done}
            <span> / {plan.length}</span>
          </strong>
          <p>milestones completed</p>
          <div className="ws-progress-track">
            <span
              style={{
                width: `${plan.length ? (done / plan.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </section>
      {!plan.length ? (
        <EmptyState
          title="Choose the direction you want to grow."
          description="Select a learning path to see specific skills, official resources, and project milestones."
        />
      ) : (
        <div className="ws-roadmap">
          {plan.map((item, i) => (
            <article
              key={item.id}
              className={`ws-card ws-milestone ${completed[item.id] ? "complete" : ""}`}
            >
              <div className="ws-milestone-number">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="ws-milestone-body">
                <p className="ws-section-kicker">{item.phase}</p>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <div className="ws-panel-actions">
                  {item.resource && (
                    <a
                      className="ws-resource-link"
                      href={item.resource[1]}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.resource[0]} <Icon name="arrow" size={14} />
                    </a>
                  )}
                  {item.skill && completed[item.id] && (
                    <button
                      className="ws-btn"
                      disabled={busy}
                      onClick={() => learn(item.skill)}
                    >
                      Add {item.skill} to my profile
                    </button>
                  )}
                </div>
              </div>
              <label className="ws-milestone-check">
                <input
                  type="checkbox"
                  disabled={busy}
                  checked={Boolean(completed[item.id])}
                  onChange={(e) =>
                    save({
                      milestones: { ...completed, [item.id]: e.target.checked },
                    })
                  }
                />
                <span>{completed[item.id] ? "Done" : "Mark done"}</span>
              </label>
            </article>
          ))}
        </div>
      )}
      <div className="ws-info-note">
        Milestones track your own progress. Add a skill to your profile when you
        can use and explain it. Changing paths preserves your progress in other
        paths.
      </div>
    </>
  );
}
