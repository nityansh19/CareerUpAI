import { useState } from "react";
import { Link } from "react-router-dom";
import { getStoredUser, storeUser } from "../auth/session";
import { buildCareerIntelligence } from "../../../shared/careerEngine.mjs";
import { persistUser } from "../lib/workspace";
import { DemoBanner, EmptyState, Icon, PageHeader } from "./WorkspaceShell";
const List = ({ items = [] }) => (
  <ul className="ws-list">
    {items.map((text, i) => (
      <li key={i}>{text}</li>
    ))}
  </ul>
);
export default function CareerPage() {
  const [user, setUser] = useState(() => getStoredUser()),
    [selected, setSelected] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const intelligence = user.careerIntelligence,
    matches = intelligence?.matches || [],
    active = matches[selected];
  const generate = async () => {
    setBusy(true);
    setError("");
    try {
      if (!user.skills?.length)
        throw new Error(
          "Add your real skills in Profile before comparing career paths.",
        );
      const next = {
        ...user,
        careerIntelligence: buildCareerIntelligence(user),
      };
      storeUser(next);
      setUser(next);
      setSelected(0);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const target = async () => {
    setBusy(true);
    setError("");
    try {
      const next = {
        ...user,
        careerGoal: active.role,
        workspace: { ...user.workspace, learningRole: active.role },
      };
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
        eyebrow="DISCOVER / CAREER PATHS"
        title="Find a direction worth building."
        description="Compare 12 software, data, cloud, mobile, and design paths against your actual skills."
        action={
          <button
            disabled={busy}
            className="ws-btn ws-btn-primary"
            onClick={generate}
          >
            {busy
              ? "Comparing…"
              : intelligence
                ? "Refresh comparison"
                : "Compare my skills"}
            <Icon name="spark" size={16} />
          </button>
        }
      />
      {error && (
        <p className="ws-message ws-error" role="alert">
          {error}
        </p>
      )}
      {!intelligence ? (
        <EmptyState
          title="Your next path starts with your skills."
          description="Add what you know, then compare role checklists and see exactly where to focus."
          action={
            <Link to="/profile" className="ws-btn ws-btn-primary">
              Complete my profile <Icon name="arrow" size={15} />
            </Link>
          }
        />
      ) : (
        <>
          <div className="ws-grid-two ws-career-grid">
            <section>
              <p className="ws-section-kicker" style={{ marginBottom: 14 }}>
                EXPLORE YOUR OPTIONS
              </p>
              <div className="ws-match-list">
                {matches.map((match, i) => (
                  <button
                    key={match.role}
                    onClick={() => setSelected(i)}
                    className={`ws-match ${selected === i ? "active" : ""}`}
                  >
                    <span>
                      {match.role}
                      {match.role === user.careerGoal && (
                        <small className="ws-match-target">Your target</small>
                      )}
                    </span>
                    <b>{match.readinessScore}%</b>
                  </button>
                ))}
              </div>
            </section>
            {active && (
              <section className="ws-card ws-panel">
                <p className="ws-section-kicker">SKILL COVERAGE</p>
                <div className="ws-panel-header" style={{ marginTop: 15 }}>
                  <h2>{active.role}</h2>
                  <div className="ws-score">
                    {active.readinessScore}
                    <small>%</small>
                  </div>
                </div>
                <p>
                  {active.matchedSkills.length} core skills covered ·{" "}
                  {active.missingSkills.length} to build
                </p>
                <div className="ws-details">
                  <h3>Already in your profile or resume</h3>
                  <div className="ws-tag-list">
                    {active.matchedSkills.length ? (
                      active.matchedSkills.map((skill) => (
                        <span className="ws-tag" key={skill}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="ws-muted">No checklist matches yet.</p>
                    )}
                  </div>
                </div>
                <div className="ws-details">
                  <h3>Your next learning opportunities</h3>
                  <div className="ws-tag-list">
                    {active.missingSkills.map((skill) => (
                      <span className="ws-tag ws-tag-gap" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ws-details">
                  <h3>Why this path appears</h3>
                  <List items={active.whyFit} />
                </div>
                <div className="ws-details">
                  <h3>Make your first move</h3>
                  <List items={active.nextActions.slice(0, 3)} />
                </div>
                <div className="ws-panel-actions">
                  <button
                    disabled={busy || user.careerGoal === active.role}
                    onClick={target}
                    className="ws-btn ws-btn-primary"
                  >
                    {user.careerGoal === active.role
                      ? "Current target"
                      : "Set as my target"}
                  </button>
                  <Link className="ws-btn" to="/skills">
                    Open learning plan <Icon name="arrow" size={14} />
                  </Link>
                </div>
              </section>
            )}
          </div>
          <div className="ws-info-note">
            Skill coverage uses a curated checklist and self-reported or
            detected skill mentions. It does not verify proficiency, consider
            every employer requirement, or predict hiring outcomes.
          </div>
        </>
      )}
    </>
  );
}
