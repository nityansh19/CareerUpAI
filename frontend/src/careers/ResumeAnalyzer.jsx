import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { listValues } from "./recommendations";
import { apiUrl } from "../lib/api";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  let user;
  try { user = JSON.parse(localStorage.getItem("user")); } catch { user = null; }
  if (!user?.id) return <Navigate to="/login" replace />;

  async function analyze(event) {
    event.preventDefault();
    setError(""); setResult(null);
    if (!file || !/\.pdf$/i.test(file.name)) { setError("Choose a PDF resume first."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Choose a PDF smaller than 5 MB."); return; }
    const body = new FormData();
    body.append("resume", file);
    body.append("skills", JSON.stringify(listValues(user.skills)));
    setBusy(true);
    try {
      const response = await fetch(apiUrl("/api/resume-analysis"), { method: "POST", body, signal: AbortSignal.timeout(60000) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to analyze this PDF.");
      setResult(data);
    } catch (failure) {
      setError(failure.name === "TimeoutError" ? "Analysis took too long. Try a smaller PDF." : failure instanceof TypeError ? "Cannot reach the backend. Check that it is running and try again." : failure.message);
    } finally { setBusy(false); }
  }
  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <header className="border-b border-white/10"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <Link to="/dashboard" className="text-xl font-semibold">CareerUp AI</Link>
        <Link to="/dashboard" className="rounded-xl border border-white/20 px-4 py-3 text-sm text-[#F0D98A]">← Back to dashboard</Link>
      </div></header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-[#D7B45A]">Tell your story clearly</p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">Resume Analyzer</h1>
        <p className="mt-5 max-w-2xl leading-7 text-slate-300">Upload your resume for a basic text review: common sections, contact details, and mentions of your saved skills. This is rule-based feedback, not an AI evaluation or ATS score.</p>
        <form onSubmit={analyze} className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <label htmlFor="resume-file" className="block text-lg font-semibold">Choose your PDF resume</label>
          <p id="resume-help" className="mt-3 text-sm leading-6 text-slate-300">Up to 5 MB and 10 pages. Use a PDF with selectable text. Scanned images and password-protected files are not supported.</p>
          <input id="resume-file" aria-describedby="resume-help" type="file" accept=".pdf,application/pdf" disabled={busy} onChange={event => { setFile(event.target.files?.[0] || null); setResult(null); setError(""); }} className="mt-5 block w-full rounded-xl border border-white/20 p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[#D7B45A] file:px-3 file:py-2 file:text-[#070A12]" />
          <p className="mt-4 text-xs leading-5 text-slate-400">The PDF is processed on this app’s backend without saving the file or analysis. It is not sent to an external AI service. Results clear when you leave or refresh this page.</p>
          <button disabled={busy || !file} className="mt-6 rounded-xl bg-[#D7B45A] px-5 py-3 font-medium text-[#070A12] disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Reading your resume…" : "Analyze resume"}</button>
        </form>
        {error && <p role="alert" className="mt-6 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-200">{error}</p>}
        {busy && <p role="status" className="mt-6 text-slate-300">Extracting text and checking your resume…</p>}
        {result && <section aria-label="Resume results" className="mt-8 space-y-6">
          <div className="rounded-3xl border border-[#D7B45A]/25 bg-white/5 p-6"><h2 className="text-2xl font-semibold">Your resume review</h2><p className="mt-3 break-words text-slate-300">{result.fileName} · {result.pages} page(s) · approximately {result.wordCount} words</p><p className="mt-3 text-xs leading-5 text-slate-400">Text checks can miss unusual headings and formatting. Review suggestions against your actual resume.</p></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6"><h3 className="text-xl font-semibold">Sections and contact details</h3><ul className="mt-5 space-y-3">{result.checks.map(check => <li key={check.label} className={check.found ? "text-emerald-300" : "text-[#F0D98A]"}>{check.found ? "Found" : "Not detected"}: {check.label}</li>)}</ul></div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6"><h3 className="text-xl font-semibold">Your profile skills</h3><p className="mt-5 text-sm text-emerald-300">Mentioned: {result.matchedSkills.join(", ") || "None detected"}</p><p className="mt-4 text-sm text-slate-300">Not detected: {result.missingSkills.join(", ") || "None"}</p><p className="mt-4 text-xs leading-5 text-slate-400">Checks use the skill names in your profile; synonyms may not be recognized. Add skills to your profile if you have not done so.</p></div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6"><h3 className="text-xl font-semibold">Suggested improvements</h3><ul className="mt-5 list-disc space-y-3 pl-5 leading-7 text-slate-300">{result.suggestions.map(suggestion => <li key={suggestion}>{suggestion}</li>)}</ul></div>
        </section>}
      </main>
    </div>
  );
}
