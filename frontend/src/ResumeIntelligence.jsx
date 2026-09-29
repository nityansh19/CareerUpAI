import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "./lib/api";

function Score({ label, value }) {
  return <div className="rounded-[22px] border border-white/[0.07] bg-white/[0.025] p-5"><div className="flex items-end justify-between"><p className="text-[10px] uppercase tracking-[.18em] text-white/28">{label}</p><p className="text-2xl font-semibold">{value}</p></div><div className="mt-4 h-1.5 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-[#7867ff] to-[#d9b45a]" style={{ width: `${value}%` }}/></div></div>;
}

function InsightList({ title, items, tone = "neutral" }) {
  const dot = tone === "good" ? "bg-emerald-300" : tone === "warn" ? "bg-amber-300" : "bg-[#d9b45a]";
  return <div className="rounded-[26px] border border-white/[0.07] bg-white/[0.02] p-6"><p className="text-[10px] uppercase tracking-[.18em] text-white/28">{title}</p><div className="mt-5 space-y-3">{items?.length ? items.map((item) => <div key={item} className="flex gap-3 text-sm leading-6 text-white/52"><span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`}/><span>{item}</span></div>) : <p className="text-sm text-white/25">No items yet.</p>}</div></div>;
}

export default function ResumeIntelligence() {
  const inputRef = useRef(null);
  const savedUser = useMemo(() => { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } }, []);
  const [analysis, setAnalysis] = useState(savedUser?.resumeAnalysis || null);
  const [fileName, setFileName] = useState(savedUser?.cvOriginalName || localStorage.getItem("careerup_cv_name") || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const analyze = async (file) => {
    if (!file || !savedUser?.id) return;
    if (file.type !== "application/pdf") { setMessage("Please choose a PDF resume."); return; }
    setLoading(true); setMessage("");
    try {
      const form = new FormData(); form.append("cv", file);
      const response = await fetch(apiUrl(`/api/users/analyze-resume/${savedUser.id}`), { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Resume analysis failed");
      setAnalysis(data.analysis);
      setFileName(data.cv?.originalName || file.name);
      localStorage.setItem("careerup_cv_name", data.cv?.originalName || file.name);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Resume analysis complete.");
    } catch (error) { setMessage(error.message || "Resume analysis failed."); }
    finally { setLoading(false); }
  };

  if (!savedUser?.id) {
    return <div className="min-h-screen bg-[#060811] px-6 py-20 text-white"><div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center"><h1 className="text-3xl font-semibold">Sign in to use Resume Intelligence.</h1><Link to="/login" className="mt-6 inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black">Go to login</Link></div></div>;
  }

  return <div className="min-h-screen bg-[#060811] text-white">
    <style>{`body{background:#060811}.ri-grid{background-image:linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px);background-size:68px 68px;mask-image:linear-gradient(to bottom,black,transparent 90%)}`}</style>
    <div className="pointer-events-none fixed inset-0"><div className="ri-grid absolute inset-0"/><div className="absolute right-[-160px] top-[-160px] h-[520px] w-[520px] rounded-full bg-[#7867ff]/10 blur-[150px]"/><div className="absolute bottom-[-180px] left-[15%] h-[480px] w-[480px] rounded-full bg-[#d9b45a]/[0.06] blur-[150px]"/></div>
    <header className="relative z-10 border-b border-white/[0.07] bg-[#060811]/80 backdrop-blur-2xl"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6"><div><p className="text-sm font-semibold">Resume Intelligence</p><p className="text-[10px] text-white/25">CareerUp workspace</p></div><div className="flex gap-3"><Link to="/dashboard" className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-xs text-white/55 hover:text-white">Dashboard</Link><button onClick={()=>inputRef.current?.click()} className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-[#080a11]">{analysis ? "Analyze another" : "Analyze resume"}</button></div></div></header>
    <main className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:py-14">
      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[30px] border border-white/[0.07] bg-white/[0.025] p-7 sm:p-9"><p className="text-[10px] uppercase tracking-[.22em] text-[#d9b45a]">Resume Intelligence</p><h1 className="mt-4 max-w-3xl text-4xl font-medium tracking-[-.05em] sm:text-5xl">See what your resume communicates before a recruiter does.</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-white/38">CareerUp extracts the text from your PDF, checks structure and evidence, detects technical skills, and compares the resume with the target role in your Career Profile.</p>{message&&<div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white/50">{message}</div>}</div>
        <div className="rounded-[30px] border border-white/[0.07] bg-[#0a0d16]/90 p-6"><p className="text-[10px] uppercase tracking-[.18em] text-white/28">Current resume</p><div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d9b45a]/20 bg-[#d9b45a]/10 text-[#efd080]">PDF</div><p className="mt-5 break-words text-sm font-medium">{fileName || "No resume analyzed yet"}</p><p className="mt-2 text-xs leading-5 text-white/28">Target role: {savedUser.careerGoal || "Not set"}</p><button disabled={loading} onClick={()=>inputRef.current?.click()} className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#080a11] disabled:opacity-50">{loading ? "Analyzing…" : analysis ? "Run new analysis" : "Upload PDF & analyze"}</button></div>
      </section>

      {!analysis ? <section className="mt-7 rounded-[30px] border border-dashed border-white/[0.1] bg-white/[0.015] px-6 py-16 text-center"><p className="text-sm font-medium">Upload a text-based PDF resume to begin.</p><p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-white/28">Scanned image-only PDFs may not contain extractable text. Export your resume from Word, Google Docs, Canva or your resume builder as a normal PDF.</p></section> : <>
        <section className="mt-7 grid gap-4 lg:grid-cols-5"><div className="rounded-[26px] border border-[#d9b45a]/15 bg-[#d9b45a]/[0.05] p-6 lg:col-span-1"><p className="text-[10px] uppercase tracking-[.18em] text-white/28">Overall</p><p className="mt-4 text-5xl font-semibold tracking-[-.06em] text-[#efd080]">{analysis.overallScore}</p><p className="mt-2 text-xs text-white/28">out of 100</p></div><Score label="Structure" value={analysis.structureScore}/><Score label="Content" value={analysis.contentScore}/><Score label="Impact" value={analysis.impactScore}/><Score label="Role alignment" value={analysis.roleAlignmentScore}/></section>
        <section className="mt-5 grid gap-5 lg:grid-cols-3"><InsightList title="Strengths" items={analysis.strengths} tone="good"/><InsightList title="Gaps" items={analysis.gaps} tone="warn"/><InsightList title="Recommendations" items={analysis.recommendations}/></section>
        <section className="mt-5 rounded-[28px] border border-white/[0.07] bg-white/[0.02] p-6"><div className="flex flex-col justify-between gap-5 sm:flex-row"><div><p className="text-[10px] uppercase tracking-[.18em] text-white/25">Detected skills</p><div className="mt-4 flex flex-wrap gap-2">{analysis.detectedSkills?.length ? analysis.detectedSkills.map(skill=><span key={skill} className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/50">{skill}</span>) : <span className="text-xs text-white/25">No recognized skills detected.</span>}</div></div><div className="sm:text-right"><p className="text-[10px] uppercase tracking-[.18em] text-white/25">Analyzed for</p><p className="mt-3 text-sm font-medium">{analysis.targetRole}</p></div></div></section>
      </>}
    </main>
    <input ref={inputRef} className="hidden" type="file" accept="application/pdf" onChange={(e)=>{ const file=e.target.files?.[0]; if(file) analyze(file); e.target.value=""; }}/>
  </div>;
}