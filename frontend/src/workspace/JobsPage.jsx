import { useState } from "react";
import { getStoredUser } from "../auth/session";
import {
  csvCell,
  downloadFile,
  getJobs,
  localDate,
  persistUser,
} from "../lib/workspace";
import Dialog from "../components/Dialog";
import { EmptyState, Icon, PageHeader } from "./WorkspaceShell";
const STAGES = ["Saved", "Applied", "Interview", "Offer", "Closed"];
const blankJob = {
  role: "",
  company: "",
  location: "",
  url: "",
  stage: "Saved",
  notes: "",
  appliedAt: "",
  followUpAt: "",
};
const message = (error, text) => (
  <p
    role={error ? "alert" : "status"}
    className={`ws-message ${error ? "ws-error" : ""}`}
  >
    {text}
  </p>
);
export default function JobsPage() {
  const [user, setUser] = useState(() => getStoredUser()),
    [jobs, setJobs] = useState(() => getJobs(getStoredUser())),
    [form, setForm] = useState(null),
    [filter, setFilter] = useState("All"),
    [query, setQuery] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [undo, setUndo] = useState(null);
  const save = async (next) => {
    const saved = await persistUser({
      ...user,
      workspace: { ...user.workspace, jobs: next },
    });
    setUser(saved);
    setJobs(next);
  };
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (!form.role.trim() || !form.company.trim())
        throw new Error("Add a position and company.");
      if (form.url && !/^https?:\/\//i.test(form.url.trim()))
        throw new Error("Use a link beginning with https:// or http://.");
      const job = {
        ...form,
        role: form.role.trim(),
        company: form.company.trim(),
        url: form.url.trim(),
        id: form.id || crypto.randomUUID(),
        createdAt: form.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await save(
        form.id
          ? jobs.map((j) => (j.id === form.id ? job : j))
          : [job, ...jobs],
      );
      setForm(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const archive = async () => {
    setBusy(true);
    try {
      setUndo({ ...form });
      await save(
        jobs.map((j) =>
          j.id === form.id
            ? { ...j, stage: "Closed", updatedAt: new Date().toISOString() }
            : j,
        ),
      );
      setForm(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const restore = async () => {
    try {
      await save(jobs.map((j) => (j.id === undo.id ? undo : j)));
      setUndo(null);
    } catch (e) {
      setError(e.message);
    }
  };
  const visible = jobs.filter(
    (job) =>
      (filter === "All" || job.stage === filter) &&
      `${job.role} ${job.company} ${job.location}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const exportCsv = () =>
    downloadFile(
      "careerup-applications.csv",
      [
        [
          "Position",
          "Company",
          "Location",
          "Stage",
          "Applied date",
          "Follow-up",
          "Link",
          "Notes",
        ],
        ...jobs.map((j) => [
          j.role,
          j.company,
          j.location,
          j.stage,
          j.appliedAt,
          j.followUpAt,
          j.url,
          j.notes,
        ]),
      ]
        .map((row) => row.map(csvCell).join(","))
        .join("\r\n"),
      "text/csv;charset=utf-8",
    );
  const today = localDate();
  const due = jobs.filter(
    (j) =>
      j.followUpAt &&
      j.followUpAt <= today &&
      j.stage !== "Closed" &&
      j.stage !== "Offer",
  );
  return (
    <>
      <PageHeader
        eyebrow="ACT / APPLICATION TRACKER"
        title="Keep your next opportunity in sight."
        description="Save roles, keep notes, and follow up at the right time."
        action={
          <div className="ws-panel-actions">
            {jobs.length > 0 && (
              <button className="ws-btn" onClick={exportCsv}>
                Export CSV
              </button>
            )}
            <button
              className="ws-btn ws-btn-primary"
              onClick={() => {
                setError("");
                setForm({ ...blankJob });
              }}
            >
              <Icon name="plus" size={16} />
              Add opportunity
            </button>
          </div>
        }
      />
      {error && !form && message(true, error)}
      {undo && (
        <p className="ws-message">
          Opportunity moved to Closed.{" "}
          <button className="ws-inline-button" onClick={restore}>
            Undo
          </button>
        </p>
      )}
      <div className="ws-tracker-stats">
        {[
          ["Saved", jobs.length],
          [
            "In progress",
            jobs.filter((j) => ["Applied", "Interview"].includes(j.stage))
              .length,
          ],
          ["Interviews", jobs.filter((j) => j.stage === "Interview").length],
          ["Follow-ups due", due.length],
        ].map(([label, value]) => (
          <div className="ws-card" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="ws-filter-row">
        <div className="ws-tabs" role="tablist" aria-label="Application stage">
          {["All", ...STAGES].map((stage) => (
            <button
              key={stage}
              role="tab"
              aria-selected={filter === stage}
              className={filter === stage ? "active" : ""}
              onClick={() => setFilter(stage)}
            >
              {stage}
            </button>
          ))}
        </div>
        <label className="ws-search-field">
          <Icon name="search" size={16} />
          <input
            aria-label="Search applications"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company or role"
          />
        </label>
      </div>
      {visible.length ? (
        <div className="ws-job-grid">
          {visible.map((job) => (
            <button
              key={job.id}
              onClick={() => {
                setError("");
                setForm({ ...blankJob, ...job });
              }}
              className="ws-card ws-job-card"
            >
              <div className="ws-job-company">
                <span>{job.company.slice(0, 2).toUpperCase()}</span>
                <span
                  className={`ws-stage ws-stage-${job.stage.toLowerCase()}`}
                >
                  {job.stage}
                </span>
              </div>
              <h2>{job.role}</h2>
              <p>
                {job.company} · {job.location || "Location not added"}
              </p>
              <footer>
                <span>
                  {job.followUpAt
                    ? `Follow up ${job.followUpAt}`
                    : "Add a follow-up date"}
                </span>
                <Icon name="arrow" size={16} />
              </footer>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="briefcase"
          title={
            jobs.length
              ? "No opportunities match your filters."
              : "Your search deserves a clear system."
          }
          description="Save opportunities from any job board. Keep your applications, notes, and follow-up dates together."
          action={
            <button
              className="ws-btn ws-btn-primary"
              onClick={() => setForm({ ...blankJob })}
            >
              Save an opportunity <Icon name="plus" size={15} />
            </button>
          }
        />
      )}
      <div className="ws-info-note">
        This is your application tracker. CareerUpAI does not fetch live
        listings or submit applications on your behalf.
      </div>
      {form && (
        <Dialog
          title={form.id ? "Edit opportunity" : "Save an opportunity"}
          onClose={() => !busy && setForm(null)}
        >
          <form onSubmit={submit} className="ws-job-form">
            {error && message(true, error)}
            {[
              ["Position", "role", "Frontend Developer"],
              ["Company", "company", "Company name"],
              ["Location", "location", "Remote or city"],
              ["Job link", "url", "https://…"],
            ].map(([label, key, placeholder]) => (
              <label className="ws-field" key={key}>
                {label}
                <input
                  required={key === "role" || key === "company"}
                  type={key === "url" ? "url" : "text"}
                  maxLength={key === "url" ? 2000 : 200}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                />
              </label>
            ))}
            <label className="ws-field">
              Application stage
              <select
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
              >
                {STAGES.map((stage) => (
                  <option key={stage}>{stage}</option>
                ))}
              </select>
            </label>
            <div className="ws-form-grid">
              <label className="ws-field">
                Applied date
                <input
                  type="date"
                  value={form.appliedAt}
                  onChange={(e) =>
                    setForm({ ...form, appliedAt: e.target.value })
                  }
                />
              </label>
              <label className="ws-field">
                Follow-up date
                <input
                  type="date"
                  value={form.followUpAt}
                  onChange={(e) =>
                    setForm({ ...form, followUpAt: e.target.value })
                  }
                />
              </label>
            </div>
            <label className="ws-field">
              Notes
              <textarea
                rows={4}
                maxLength={5000}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Recruiter contact, next steps, preparation…"
              />
            </label>
            <div className="ws-panel-actions">
              <button disabled={busy} className="ws-btn ws-btn-primary">
                {busy ? "Saving…" : "Save opportunity"}
              </button>
              {form.id && form.url && (
                <a
                  className="ws-btn"
                  href={form.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open listing
                </a>
              )}
              {form.id && form.stage !== "Closed" && (
                <button
                  disabled={busy}
                  type="button"
                  className="ws-btn"
                  onClick={archive}
                >
                  Move to Closed
                </button>
              )}
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
}
