import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getStoredUser, storeUser } from "../auth/session";
import {
  analyzeResumeText,
  buildCareerIntelligence,
} from "../../../shared/careerEngine.mjs";
import { extractPdf } from "../lib/pdf";
import { downloadFile } from "../lib/workspace";
import { readResume, saveResume } from "./browserStorage";
import { DemoBanner, Icon, PageHeader } from "./WorkspaceShell";
const List = ({ items = [] }) => (
  <ul className="ws-list">
    {items.map((text, i) => (
      <li key={i}>{text}</li>
    ))}
  </ul>
);
export default function ResumePage() {
  const input = useRef(null);
  const [user, setUser] = useState(() => getStoredUser()),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [text, setText] = useState(""),
    [tab, setTab] = useState("PDF");
  const analysis = user.resumeAnalysis;
  const current = analysis && !analysis.demoPreview;
  const adopt = (next) => {
    storeUser(next);
    setUser(next);
  };
  const analyzePdf = async (file) => {
    if (!file) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const parsed = await extractPdf(file);
      const report = analyzeResumeText(parsed.text, user, {
        pages: parsed.pages,
        source: "pdf",
        fileName: file.name,
      });
      await saveResume(user.id, file);
      const next = {
        ...user,
        cvOriginalName: file.name,
        cvFile: "device-pdf",
        resumeAnalysis: report,
      };
      next.careerIntelligence = buildCareerIntelligence(next);
      adopt(next);
      setMessage(
        "PDF read successfully. Your report and original file are saved on this device.",
      );
    } catch (e) {
      setError(
        e.message ||
          "This PDF could not be read. Export it again or paste its text.",
      );
    } finally {
      setBusy(false);
    }
  };
  const analyzeText = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const next = {
        ...user,
        resumeAnalysis: analyzeResumeText(text, user, { source: "text" }),
      };
      next.careerIntelligence = buildCareerIntelligence(next);
      adopt(next);
      setMessage(
        "Resume text reviewed. The report is based on the text you provided.",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const download = async () => {
    setError("");
    try {
      const file = await readResume(user.id);
      if (!file)
        throw new Error(
          "Upload a PDF to save an original file on this device.",
        );
      downloadFile(file.name || "resume.pdf", file);
    } catch (e) {
      setError(e.message);
    }
  };
  const exportReport = () =>
    downloadFile(
      "careerup-resume-review.txt",
      [
        `CareerUpAI resume review\nTarget: ${analysis.targetRole}\nReviewed: ${new Date(analysis.analyzedAt).toLocaleString()}\nQuality checklist: ${analysis.overallScore}/100\n${analysis.methodology || "Illustrative demo report"}\n`,
        "STRENGTHS",
        ...(analysis.strengths || []),
        "\nGAPS",
        ...(analysis.gaps || []),
        "\nNEXT IMPROVEMENTS",
        ...(analysis.recommendations || []),
      ].join("\n"),
      "text/plain",
    );
  const stale = current && analysis.targetRole !== user.careerGoal;
  return (
    <>
      {user.authMode === "demo" && <DemoBanner />}
      <PageHeader
        eyebrow="PREPARE / RESUME REVIEW"
        title="Make your experience stand out."
        description="Read the actual text. Find missing evidence. Make one useful improvement."
        action={
          current && (
            <button className="ws-btn" onClick={exportReport}>
              Export report <Icon name="arrow" size={15} />
            </button>
          )
        }
      />
      {error && (
        <p role="alert" className="ws-message ws-error">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="ws-message">
          {message}
        </p>
      )}
      <div className="ws-grid-two">
        <section className="ws-card ws-panel">
          <p className="ws-section-kicker">YOUR SOURCE</p>
          <div className="ws-tabs" role="tablist" aria-label="Resume source">
            {["PDF", "Paste text"].map((item) => (
              <button
                key={item}
                role="tab"
                aria-selected={tab === item}
                onClick={() => setTab(item)}
                className={tab === item ? "active" : ""}
              >
                {item}
              </button>
            ))}
          </div>
          {tab === "PDF" ? (
            <div
              className="ws-upload"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (!busy) analyzePdf(e.dataTransfer.files[0]);
              }}
            >
              <span className="ws-empty-icon">
                <Icon name="file" size={25} />
              </span>
              <h2>{user.cvOriginalName || "Bring your resume into focus."}</h2>
              <p>
                Drop a text-based PDF here or choose a file.
                <br />
                Up to 5 MB · 10 pages · Scanned PDFs need OCR
              </p>
              <button
                className="ws-btn ws-btn-primary"
                disabled={busy}
                onClick={() => input.current.click()}
              >
                {busy ? "Reading your PDF…" : "Choose PDF"}
                <Icon name="plus" size={16} />
              </button>
              {user.cvOriginalName && (
                <button className="ws-btn" disabled={busy} onClick={download}>
                  Download original PDF
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={analyzeText}>
              <label className="ws-field">
                Resume text
                <textarea
                  required
                  minLength={80}
                  maxLength={60000}
                  rows={9}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste the text from your resume, including headings and achievement bullets."
                />
              </label>
              <button disabled={busy} className="ws-btn ws-btn-primary">
                {busy ? "Reviewing…" : "Review this text"}
              </button>
            </form>
          )}
          <p className="ws-muted" style={{ marginTop: 16 }}>
            Reviewing for{" "}
            <Link to="/profile">{user.careerGoal || "a general profile"}</Link>.{" "}
            PDFs and pasted text are processed on this device.
          </p>
        </section>
        <section className="ws-card ws-panel">
          <p className="ws-section-kicker">WHAT WE CHECK</p>
          <h2 style={{ marginTop: 15 }}>Evidence over decoration.</h2>
          <p>
            Contact details, readable sections, action verbs, outcomes, and
            relevant skill mentions.
          </p>
          <List
            items={[
              "Review your contribution to each project.",
              "Add accurate outcomes and the context behind them.",
              "Connect skills to work you can explain.",
            ]}
          />
          <div className="ws-info-note">
            Rule-based text review. Scores summarize these checks; they do not
            predict an ATS result or job offer.
          </div>
        </section>
      </div>
      {analysis && (
        <section
          className="ws-card ws-panel ws-report"
          style={{ marginTop: 20 }}
        >
          <div className="ws-panel-header">
            <div>
              <p className="ws-section-kicker">
                {analysis.demoPreview
                  ? "ILLUSTRATIVE SAMPLE"
                  : "YOUR LATEST REVIEW"}
              </p>
              <h2 style={{ marginTop: 8 }}>{analysis.targetRole}</h2>
              <p>
                {analysis.stats?.wordCount
                  ? `${analysis.stats.wordCount} words · `
                  : ""}
                {analysis.stats?.pages
                  ? `${analysis.stats.pages} pages · `
                  : ""}
                {new Date(analysis.analyzedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="ws-score">
              {analysis.overallScore}
              <small>/100</small>
            </div>
          </div>
          {stale && (
            <p className="ws-message">
              Your target changed. Review the resume again to refresh role
              coverage.
            </p>
          )}
          <div className="ws-score-bars">
            {[
              ["Structure", analysis.structureScore],
              ["Content", analysis.contentScore],
              ["Impact", analysis.impactScore],
              ["Role coverage", analysis.roleAlignmentScore],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <i>
                  <span style={{ width: `${value || 0}%` }} />
                </i>
                <b>{value ?? "—"}</b>
              </div>
            ))}
          </div>
          <div className="ws-grid-two" style={{ marginTop: 30 }}>
            <div>
              <h2>Next improvements</h2>
              <List items={analysis.recommendations} />
            </div>
            <div>
              <h2>What’s working</h2>
              <List items={analysis.strengths} />
            </div>
          </div>
          <details className="ws-details">
            <summary>See gaps and detected skills</summary>
            <List items={analysis.gaps} />
            <div className="ws-tag-list">
              {analysis.detectedSkills?.map((skill) => (
                <span className="ws-tag" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </details>
          {analysis.checks && (
            <div className="ws-check-grid">
              {analysis.checks.map((check) => (
                <span key={check.label} className={check.found ? "found" : ""}>
                  <Icon name={check.found ? "check" : "close"} size={14} />
                  {check.label}
                </span>
              ))}
            </div>
          )}
          <div className="ws-panel-actions">
            <button className="ws-btn" onClick={exportReport}>
              Download review
            </button>
            <Link className="ws-btn ws-btn-primary" to="/skills">
              Build missing skills <Icon name="arrow" size={14} />
            </Link>
          </div>
        </section>
      )}
      <input
        ref={input}
        className="sr-only"
        type="file"
        aria-label="Choose resume PDF"
        accept="application/pdf,.pdf"
        onChange={(e) => {
          analyzePdf(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </>
  );
}
