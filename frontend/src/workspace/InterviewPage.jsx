import { useState } from "react";
import { getStoredUser } from "../auth/session";
import {
  ROLES,
  interviewQuestions,
  reviewInterviewAnswer,
} from "../../../shared/careerEngine.mjs";
import { downloadFile, persistUser } from "../lib/workspace";
import { readPractice, savePractice } from "./browserStorage";
import { Icon, PageHeader } from "./WorkspaceShell";
const message = (error, text) => (
  <p
    role={error ? "alert" : "status"}
    className={`ws-message ${error ? "ws-error" : ""}`}
  >
    {text}
  </p>
);
export default function InterviewPage() {
  const [user, setUser] = useState(() => getStoredUser()),
    [practice, setPractice] = useState(
      () =>
        readPractice(getStoredUser().id) || {
          role: getStoredUser().careerGoal || ROLES[0].name,
          type: "Mixed",
          difficulty: "Standard",
          started: false,
          step: 0,
          answer: "",
          answers: [],
        },
    ),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [saved, setSaved] = useState(false);
  const { role, type, difficulty, started, step, answer, answers } = practice;
  const questions = interviewQuestions(role, type, difficulty);
  const update = (patch) => {
    const next = { ...practice, ...patch };
    try {
      savePractice(user.id, next);
      setPractice(next);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };
  const finish = async () => {
    const nextAnswers = [...answers, answer.trim()];
    if (step < 2) {
      update({ answers: nextAnswers, step: step + 1, answer: "" });
      return;
    }
    setBusy(true);
    setError("");
    try {
      const record = {
        id: crypto.randomUUID(),
        role,
        type,
        difficulty,
        questions,
        answers: nextAnswers,
        completedAt: new Date().toISOString(),
      };
      const interviews = [record, ...(user.workspace?.interviews || [])].slice(
        0,
        100,
      );
      const next = await persistUser({
        ...user,
        workspace: { ...user.workspace, interviews },
      });
      setUser(next);
      update({ answers: nextAnswers, step: 3, answer: "" });
      setSaved(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const exportSession = () =>
    downloadFile(
      "careerup-interview-practice.txt",
      [
        `CareerUpAI interview practice\n${role} · ${type} · ${difficulty}\nWriting checklist, not an automated assessment.\n`,
        ...questions.flatMap((question, i) => [
          `${i + 1}. ${question}`,
          answers[i] || "No written answer",
          ...reviewInterviewAnswer(answers[i] || "").suggestions,
          "",
        ]),
      ].join("\n"),
      "text/plain",
    );
  return (
    <>
      <PageHeader
        eyebrow="PREPARE / INTERVIEW PRACTICE"
        title="Practice with purpose."
        description="Three relevant prompts. Your own examples. A clearer answer each time."
      />
      {error && message(true, error)}
      {!started ? (
        <div className="ws-card ws-panel" style={{ maxWidth: 760 }}>
          <p className="ws-section-kicker">YOUR NEXT REHEARSAL</p>
          <h2 style={{ marginTop: 15 }}>
            A little preparation goes a long way.
          </h2>
          <p>
            Choose a role and focus. Your draft saves on this device, and
            completed sessions stay in your workspace.
          </p>
          <div className="ws-form-grid" style={{ marginTop: 24 }}>
            <label className="ws-field ws-span-two">
              Role
              <select
                value={
                  ROLES.some((r) => r.name === role) ? role : ROLES[0].name
                }
                onChange={(e) => update({ role: e.target.value })}
              >
                {ROLES.map((r) => (
                  <option key={r.name}>{r.name}</option>
                ))}
              </select>
            </label>
            <label className="ws-field">
              Focus
              <select
                value={type}
                onChange={(e) => update({ type: e.target.value })}
              >
                {["Mixed", "Technical", "Behavioral"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="ws-field">
              Difficulty
              <select
                value={difficulty}
                onChange={(e) => update({ difficulty: e.target.value })}
              >
                {["Foundations", "Standard", "Advanced"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
          </div>
          <button
            className="ws-btn ws-btn-primary"
            style={{ marginTop: 24 }}
            onClick={() => {
              setSaved(false);
              update({ started: true, step: 0, answer: "", answers: [] });
            }}
          >
            Start practice <Icon name="arrow" size={16} />
          </button>
        </div>
      ) : step < 3 ? (
        <section className="ws-card ws-panel" style={{ maxWidth: 850 }}>
          <div className="ws-interview-progress">
            {[0, 1, 2].map((i) => (
              <span key={i} className={i <= step ? "active" : ""} />
            ))}
          </div>
          <p className="ws-section-kicker">
            QUESTION {step + 1} / 3 · {difficulty}
          </p>
          <h2
            key={questions[step]}
            className="ws-question-enter"
            style={{ fontSize: 24, marginTop: 20 }}
          >
            {questions[step]}
          </h2>
          <p>
            Explain the context, your action, and the result. Include a real
            example.
          </p>
          <label className="ws-field" style={{ marginTop: 24 }}>
            Your answer
            <textarea
              rows={7}
              maxLength={10000}
              value={answer}
              onChange={(e) => update({ answer: e.target.value })}
              placeholder="In my project, the challenge was… I decided to… The result was…"
            />
          </label>
          <div className="ws-panel-actions">
            <button
              className="ws-btn ws-btn-primary"
              disabled={busy || answer.trim().length < 10}
              onClick={finish}
            >
              {busy
                ? "Saving session…"
                : step === 2
                  ? "Finish and review"
                  : "Next question"}
              <Icon name="arrow" size={15} />
            </button>
            <button
              className="ws-btn"
              disabled={busy}
              onClick={() => update({ started: false })}
            >
              Change setup
            </button>
          </div>
          <p className="ws-muted">
            {answer.trim().split(/\s+/).filter(Boolean).length} words · Write at
            least 10 characters to continue.
          </p>
        </section>
      ) : (
        <section className="ws-card ws-panel">
          <p className="ws-section-kicker">
            {saved ? "SESSION SAVED" : "YOUR COMPLETED SESSION"}
          </p>
          <h2 style={{ marginTop: 15 }}>Take one answer from good to clear.</h2>
          <p>
            The review below checks answer structure. It does not evaluate
            technical accuracy, delivery, or interview performance.
          </p>
          {questions.map((question, i) => {
            const review = reviewInterviewAnswer(answers[i] || "");
            return (
              <article className="ws-answer-review" key={question}>
                <h3>
                  {i + 1}. {question}
                </h3>
                <p className="ws-answer-text">
                  {answers[i] || "No written answer"}
                </p>
                <div className="ws-check-grid">
                  {review.checks.map((check) => (
                    <span
                      className={check.found ? "found" : ""}
                      key={check.label}
                    >
                      <Icon name={check.found ? "check" : "close"} size={14} />
                      {check.label}
                    </span>
                  ))}
                </div>
                {review.suggestions.length ? (
                  <ul className="ws-list">
                    {review.suggestions.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="ws-muted">
                    Your answer includes the main structure signals. Practice it
                    out loud and check its accuracy.
                  </p>
                )}
              </article>
            );
          })}
          <div className="ws-panel-actions">
            <button
              className="ws-btn ws-btn-primary"
              onClick={() => {
                setSaved(false);
                update({ started: false, step: 0, answer: "", answers: [] });
              }}
            >
              Practice again
            </button>
            <button className="ws-btn" onClick={exportSession}>
              Download session
            </button>
          </div>
        </section>
      )}
      {user.workspace?.interviews?.length > 0 && (
        <section style={{ marginTop: 30 }}>
          <div className="ws-section-head">
            <h2>Past sessions</h2>
            <p>Your recent practice</p>
          </div>
          <div className="ws-card ws-panel">
            {user.workspace.interviews.slice(0, 5).map((session) => (
              <details className="ws-details" key={session.id}>
                <summary>
                  {session.role} ·{" "}
                  {new Date(session.completedAt).toLocaleDateString()}
                </summary>
                {session.answers.map((a, i) => (
                  <p key={i} className="ws-answer-text">
                    <strong>
                      {session.questions?.[i] || `Answer ${i + 1}`}
                    </strong>
                    <br />
                    {a}
                  </p>
                ))}
              </details>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
