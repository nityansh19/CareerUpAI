import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearStoredUser, getStoredUser } from "../auth/session";
import { buildCareerIntelligence } from "../../../shared/careerEngine.mjs";
import {
  backup,
  downloadFile,
  persistUser,
  request,
  validateBackup,
} from "../lib/workspace";
import Dialog from "../components/Dialog";
import { Icon, PageHeader } from "./WorkspaceShell";
const message = (error, text) => (
  <p
    role={error ? "alert" : "status"}
    className={`ws-message ${error ? "ws-error" : ""}`}
  >
    {text}
  </p>
);
export default function SettingsPage() {
  const [user, setUser] = useState(() => getStoredUser()),
    [error, setError] = useState(""),
    [status, setStatus] = useState(""),
    [pending, setPending] = useState(null),
    [busy, setBusy] = useState(false);
  const input = useRef(null),
    navigate = useNavigate();
  const signout = async () => {
    if (user.authMode === "cloud")
      await request("/api/users/logout", { method: "POST" }).catch(() => {});
    clearStoredUser();
    navigate("/", { replace: true });
  };
  const readBackup = async (file) => {
    if (!file) return;
    setError("");
    try {
      if (file.size > 3 * 1024 * 1024)
        throw new Error("Choose a workspace backup smaller than 3 MB.");
      setPending(validateBackup(JSON.parse(await file.text())));
    } catch (e) {
      setError(e.message || "The backup could not be read.");
    }
  };
  const restore = async () => {
    setBusy(true);
    setError("");
    try {
      const ids = new Set((user.workspace?.jobs || []).map((j) => j.id));
      const jobs = [
        ...(user.workspace?.jobs || []),
        ...pending.workspace.jobs.filter((j) => !ids.has(j.id)),
      ];
      const interviewIds = new Set(
        (user.workspace?.interviews || []).map((s) => s.id),
      );
      const interviews = [
        ...(user.workspace?.interviews || []),
        ...pending.workspace.interviews.filter((s) => !interviewIds.has(s.id)),
      ].slice(0, 100);
      if (jobs.length > 500)
        throw new Error(
          "The combined workspace has more than 500 opportunities. Keep a smaller backup.",
        );
      const next = {
        ...user,
        ...pending.profile,
        workspace: {
          ...user.workspace,
          jobs,
          interviews,
          milestones: {
            ...user.workspace?.milestones,
            ...pending.workspace.milestones,
          },
          learningRole:
            pending.workspace.learningRole || user.workspace?.learningRole,
        },
      };
      next.careerIntelligence = buildCareerIntelligence(next);
      setUser(await persistUser(next));
      setPending(null);
      setStatus(
        "Backup imported. Jobs and practice sessions were merged; profile details were updated.",
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
        eyebrow="YOUR WORKSPACE"
        title="Stay in control of your data."
        description="Keep a backup, move your progress, and manage your session."
      />
      {error && message(true, error)}
      {status && message(false, status)}
      <div className="ws-grid-two">
        <section className="ws-card ws-panel">
          <p className="ws-section-kicker">ACCOUNT</p>
          <h2 style={{ marginTop: 16 }}>{user.name}</h2>
          <p>{user.email}</p>
          <div className="ws-row">
            <div>
              <strong>Storage</strong>
              <p>
                {user.authMode === "cloud"
                  ? "Online account · syncs between signed-in devices"
                  : user.authMode === "demo"
                    ? "Sample workspace · saved on this device"
                    : "Device account · saved in this browser"}
              </p>
            </div>
          </div>
          <div className="ws-panel-actions">
            <Link to="/profile" className="ws-btn">
              Edit profile
            </Link>
            <button className="ws-btn" onClick={signout}>
              Sign out <Icon name="logout" size={15} />
            </button>
          </div>
        </section>
        <section className="ws-card ws-panel">
          <p className="ws-section-kicker">BACKUP & TRANSFER</p>
          <h2 style={{ marginTop: 16 }}>Your progress goes with you.</h2>
          <p>
            Export your profile, learning progress, applications, and completed
            interview sessions. Backups contain personal data, so keep them
            somewhere private.
          </p>
          <div className="ws-panel-actions">
            <button
              className="ws-btn ws-btn-primary"
              onClick={() =>
                downloadFile(
                  "careerup-workspace-backup.json",
                  JSON.stringify(backup(user), null, 2),
                )
              }
            >
              Export workspace
            </button>
            <button className="ws-btn" onClick={() => input.current.click()}>
              Import backup
            </button>
          </div>
          <p className="ws-muted" style={{ marginTop: 18 }}>
            Backups exclude passwords, session tokens, and original PDFs.
            Download your PDF separately from Resume.
          </p>
        </section>
      </div>
      <div className="ws-card ws-panel" style={{ marginTop: 20 }}>
        <div className="ws-row">
          <div>
            <strong>Quick navigation</strong>
            <p>Press Ctrl / Cmd + K to jump to a tool.</p>
          </div>
          <kbd>Ctrl K</kbd>
        </div>
        <div className="ws-row">
          <div>
            <strong>Privacy & product information</strong>
            <p>How data and recommendations work.</p>
          </div>
          <Link to="/privacy" className="ws-btn">
            Read details
          </Link>
        </div>
        <div className="ws-row">
          <div>
            <strong>Feedback</strong>
            <p>Report a problem or suggest a useful improvement.</p>
          </div>
          <a
            className="ws-btn"
            href="https://github.com/nityansh19/CareerUpAI/issues"
            target="_blank"
            rel="noreferrer"
          >
            Give feedback <Icon name="arrow" size={14} />
          </a>
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        aria-label="Choose workspace backup"
        onChange={(e) => {
          readBackup(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {pending && (
        <Dialog
          title="Import this workspace backup?"
          onClose={() => !busy && setPending(null)}
        >
          <p>
            Your profile will update to <strong>{pending.profile.name}</strong>.{" "}
            {pending.workspace.jobs.length} opportunities and{" "}
            {pending.workspace.interviews.length} practice sessions will merge
            with your current entries.
          </p>
          <p>
            Your account email and password stay the same. Resume files are not
            included.
          </p>
          {error && message(true, error)}
          <div className="ws-panel-actions">
            <button
              className="ws-btn ws-btn-primary"
              disabled={busy}
              onClick={restore}
            >
              {busy ? "Importing…" : "Import and merge"}
            </button>
            <button
              className="ws-btn"
              disabled={busy}
              onClick={() => setPending(null)}
            >
              Cancel
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
