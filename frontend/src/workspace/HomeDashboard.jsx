import { Link } from "react-router-dom";
import { getProfileCompletion, getStoredUser } from "../auth/session";
import { getJobs, localDate } from "../lib/workspace";
import { learningPlan } from "../../../shared/careerEngine.mjs";
import { DemoBanner, Icon, PageHeader } from "./WorkspaceShell";
export default function HomeDashboard() {
  const user = getStoredUser(),
    jobs = getJobs(user),
    completion = getProfileCompletion(user),
    resume = user.resumeAnalysis,
    career = user.careerIntelligence;
  const plan = learningPlan(
      user,
      user.workspace?.learningRole || user.careerGoal,
    ),
    milestones = user.workspace?.milestones || {},
    done = plan.filter((s) => milestones[s.id]).length,
    nextMilestone = plan.find((s) => !milestones[s.id]);
  const hour = new Date().getHours(),
    greeting =
      hour < 12
        ? "Good morning"
        : hour < 17
          ? "Good afternoon"
          : "Good evening",
    firstName = user.name.trim().split(" ")[0];
  const next =
    completion < 100
      ? {
          title: "Give your plan a real starting point.",
          text: "Add your background, skills, and target role to personalize your workspace.",
          to: "/onboarding",
          cta: "Complete my profile",
        }
      : !resume || resume.demoPreview
        ? {
            title: "Make your resume work harder.",
            text: "Review the actual text and see which skills, achievements, and sections need clearer evidence.",
            to: "/resume-intelligence",
            cta: "Review my resume",
          }
        : nextMilestone
          ? {
              title: nextMilestone.title,
              text: nextMilestone.description,
              to: "/skills",
              cta: "Continue my learning plan",
            }
          : {
              title: "Put your preparation into action.",
              text: "Save suitable opportunities, prepare your examples, and follow up with a clear plan.",
              to: "/jobs",
              cta: "Track my opportunities",
            };
  const metrics = [
    {
      title: "Profile complete",
      value: `${completion}%`,
      note:
        completion === 100
          ? "Your foundation is ready"
          : "Add your real context",
      icon: "user",
      to: "/profile",
    },
    {
      title: "Resume checklist",
      value: resume ? `${resume.overallScore}/100` : "—",
      note: resume?.demoPreview
        ? "Sample report"
        : resume
          ? "Your latest text review"
          : "Read your actual resume",
      icon: "file",
      to: "/resume-intelligence",
    },
    {
      title: "Learning milestones",
      value: `${done}/${plan.length}`,
      note: "Your progress, one step at a time",
      icon: "layers",
      to: "/skills",
    },
    {
      title: "Applications in progress",
      value: jobs.filter((j) => ["Applied", "Interview"].includes(j.stage))
        .length,
      note: `${jobs.length} opportunities tracked`,
      icon: "briefcase",
      to: "/jobs",
    },
  ];
  const today = localDate();
  const due = jobs.filter(
    (j) =>
      j.followUpAt &&
      j.followUpAt <= today &&
      !["Closed", "Offer"].includes(j.stage),
  );
  const priorities = [
    {
      title: nextMilestone?.title || "Review your career direction",
      text: nextMilestone
        ? "Continue your current learning milestone."
        : "Compare role checklists against your skills.",
      to: nextMilestone ? "/skills" : "/career-intelligence",
      icon: "layers",
    },
    {
      title: due.length
        ? `${due.length} follow-up${due.length > 1 ? "s" : ""} due`
        : "Keep your search organized",
      text: due.length
        ? due
            .map((j) => j.company)
            .slice(0, 2)
            .join(" · ")
        : "Save an opportunity and plan your next action.",
      to: "/jobs",
      icon: "briefcase",
    },
    {
      title: "Rehearse one useful story",
      text: "Practice the context, action, and outcome behind your work.",
      to: "/interview",
      icon: "mic",
    },
  ];
  return (
    <>
      {user.authMode === "demo" && <DemoBanner />}
      <PageHeader
        eyebrow={new Date().toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
        title={`${greeting}, ${firstName}.`}
        description="A clear direction. A little progress. Your next opportunity."
      />
      <section className="ws-command-center">
        <div className="ws-command-copy">
          <p className="ws-section-kicker">YOUR NEXT MOVE</p>
          <h2>{next.title}</h2>
          <p>{next.text}</p>
          <Link to={next.to} className="ws-btn ws-btn-primary">
            {next.cta}
            <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="ws-direction-card">
          <span className="ws-orbit-icon">
            <Icon name="spark" size={30} />
          </span>
          <p className="ws-section-kicker">BUILDING TOWARD</p>
          <h3>{user.careerGoal || "Your next chapter"}</h3>
          <div className="ws-direction-divider" />
          <p>
            {user.skills?.length || 0} declared skills · {done} milestones done
          </p>
          <Link to="/career-intelligence">
            Explore your paths <Icon name="arrow" size={14} />
          </Link>
        </div>
      </section>
      <section className="ws-metrics" aria-label="Your career overview">
        {metrics.map((metric) => (
          <Link className="ws-card ws-metric" to={metric.to} key={metric.title}>
            <div className="ws-metric-label">
              <span>{metric.title}</span>
              <Icon name={metric.icon} size={17} />
            </div>
            <div className="ws-metric-value">{metric.value}</div>
            <div className="ws-metric-note">{metric.note}</div>
          </Link>
        ))}
      </section>
      <section>
        <div className="ws-section-head">
          <h2>Small moves. Real progress.</h2>
          <p>Choose your focus for today</p>
        </div>
        <div className="ws-actions">
          {priorities.map((item, i) => (
            <Link
              key={item.title}
              className="ws-card ws-action-card"
              to={item.to}
            >
              <div className="ws-action-heading">
                <span className="ws-action-icon">
                  <Icon name={item.icon} />
                </span>
                <small>0{i + 1}</small>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="ws-action-link">
                Open <Icon name="arrow" size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="ws-grid-two" style={{ marginTop: 26 }}>
        <div className="ws-card ws-panel">
          <div className="ws-panel-header">
            <div>
              <p className="ws-section-kicker">YOUR DIRECTION</p>
              <h2 style={{ marginTop: 12 }}>Paths you can build toward</h2>
            </div>
            <Link
              to="/career-intelligence"
              className="ws-icon-button"
              aria-label="View career paths"
            >
              <Icon name="arrow" />
            </Link>
          </div>
          {career?.matches?.length ? (
            career.matches.slice(0, 3).map((match) => (
              <div className="ws-coverage-row" key={match.role}>
                <div>
                  <strong>{match.role}</strong>
                  <span>{match.matchedSkills.length} skills covered</span>
                </div>
                <b>{match.readinessScore}%</b>
                <i>
                  <span style={{ width: `${match.readinessScore}%` }} />
                </i>
              </div>
            ))
          ) : (
            <p className="ws-muted" style={{ marginTop: 25 }}>
              Complete your profile to compare career checklists.
            </p>
          )}
          <p className="ws-muted" style={{ marginTop: 18, fontSize: 11 }}>
            Skill coverage against curated checklists, not a hiring prediction.
          </p>
        </div>
        <div className="ws-card ws-panel">
          <p className="ws-section-kicker">YOUR LEARNING PLAN</p>
          <h2 style={{ marginTop: 12 }}>
            {plan.length ? "Keep the momentum." : "Start with a direction."}
          </h2>
          <p>
            {plan.length
              ? `${done} of ${plan.length} milestones completed`
              : "Choose a target role to build your first learning plan."}
          </p>
          <div className="ws-progress-track" style={{ margin: "25px 0" }}>
            <span
              style={{
                width: `${plan.length ? (done / plan.length) * 100 : 0}%`,
              }}
            />
          </div>
          {plan.slice(0, 3).map((item) => (
            <div className="ws-plan-preview" key={item.id}>
              <span className={milestones[item.id] ? "done" : ""}>
                <Icon
                  name={milestones[item.id] ? "check" : "layers"}
                  size={14}
                />
              </span>
              <strong>{item.title}</strong>
              <small>{item.phase}</small>
            </div>
          ))}
          <Link to="/skills" className="ws-btn" style={{ marginTop: 20 }}>
            Open full plan <Icon name="arrow" size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
