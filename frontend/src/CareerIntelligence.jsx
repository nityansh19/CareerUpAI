import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "./lib/api";

function ScoreRing({ value }) {
  const safe = Math.max(0, Math.min(100, Number(value || 0)));
  return (
    <div className="relative h-28 w-28 shrink-0 rounded-full" style={{ background: `conic-gradient(#d9b45a ${safe * 3.6}deg, rgba(255,255,255,.06) 0)` }}>
      <div className="absolute inset-[8px] flex flex-col items-center justify-center rounded-full bg-[#090c14]">
        <span className="text-3xl font-semibold tracking-[-.05em] text-[#efd080]">{safe}</span>
        <span className="text-[9px] uppercase tracking-[.16em] text-white/24">readiness</span>
      </div>
    </div>
  );
}

function SkillPill({ children, missing = false }) {
  return <span className={`rounded-full border px-3 py-1.5 text-[10px] ${missing ? "border-amber-300/15 bg-amber-300/[0.04] text-amber-100/65" : "border-emerald-300/15 bg-emerald-300/[0.04] text-emerald-100/65"}`}>{children}</span>;
}

function MatchCard({ match, active, onClick, index }) {
  return (
    <button onClick={onClick} className={`w-full rounded-[24px] border p-5 text-left transition hover:-translate-y-1 ${active ? "border-[#d9b45a]/25 bg-[#d9b45a]/[0.055]" : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.035]"}`}>
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-[9px] uppercase tracking-[.18em] text-white/25">Match 0{index + 1}</p><h3 className="mt-2 text-lg font-semibold tracking-[-.03em]">{match.role}</h3></div>
        <div className="text-right"><p className="text-2xl font-semibold text-[#efd080]">{match.readinessScore}</p><p className="text-[9px] uppercase tracking-[.14em] text-white/22">readiness</p></div>
      </div>
      <div className="mt-5 h-1.5 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-[#7867ff] to-[#d9b45a]" style={{ width: `${match.readinessScore}%` }}/></div>
      <p className="mt-4 text-xs text-white/30">{match.matchedSkills?.length || 0} matched skills · {match.missingSkills?.length || 0} core gaps</p>
    </button>
  );
}

export default function CareerIntelligence() {
  const savedUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  }, []);

  const [intelligence, setIntelligence] = useState(savedUser?.careerIntelligence || null);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const generate = async () => {
    if (!savedUser?.id) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(apiUrl(`/api/users/career-intelligence/${savedUser.id}`), { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to generate Career Intelligence");
      setIntelligence(data.intelligence);
      setSelected(0);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Career Intelligence updated from your latest profile and resume context.");
    } catch (error) {
      setMessage(error.message || "Unable to generate Career Intelligence.");
    } finally {
      setLoading(false);
    }
  };

  if (!savedUser?.id) {
    return <div className="min-h-screen bg-[#060811] px-6 py-20 text-white"><div className="mx-auto max-w-xl rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center"><h1 className="text-3xl font-semibold">Sign in to use Career Intelligence.</h1><Link to="/login" className="mt-6 inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black">Go to login</Link></div></div>;
  }

  const matches = intelligence?.matches || [];
  const active = matches[selected] || matches[0] || null;

  return (
    <div className="min-h-screen bg-[#060811] text-white">
      <style>{`
        body{background:#060811}.ci-grid{background-image:linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px);background-size:68px 68px;mask-image:linear-gradient(to bottom,black,transparent 90%)}
        .ci-card{box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
        @media(prefers-reduced-motion:reduce){*{transition:none!important}}
      `}</style>
      <div className="pointer-events-none fixed inset-0"><div className="ci-grid absolute inset-0"/><div className="absolute right-[-160px] top-[-160px] h-[520px] w-[520px] rounded-full bg-[#7867ff]/10 blur-[150px]"/><div className="absolute bottom-[-180px] left-[15%] h-[480px] w-[480px] rounded-full bg-[#d9b45a]/[0.06] blur-[150px]"/></div>

      <header className="relative z-10 border-b border-white/[0.07] bg-[#060811]/80 backdrop-blur-2xl"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6"><div><p className="text-sm font-semibold">Career Intelligence</p><p className="text-[10px] text-white/25">CareerUp workspace</p></div><div className="flex gap-3"><Link to="/dashboard" className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-xs text-white/55 hover:text-white">Dashboard</Link><button disabled={loading} onClick={generate} className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-[#080a11] disabled:opacity-50">{loading ? "Analyzing…" : intelligence ? "Refresh matches" : "Generate matches"}</button></div></div></header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <section className="grid gap-6 xl:grid-cols-[1fr_370px]">
          <div className="rounded-[30px] border border-white/[0.07] bg-white/[0.025] p-7 sm:p-9"><p className="text-[10px] uppercase tracking-[.22em] text-[#d9b45a]">Career Intelligence</p><h1 className="mt-4 max-w-3xl text-4xl font-medium tracking-[-.05em] sm:text-5xl">See which roles fit your profile—and what is still missing.</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-white/38">CareerUp combines your saved skills, interests, target role and resume-detected skills, then compares that context with structured role requirements. Every score is explainable through matched skills and visible gaps.</p>{message&&<div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-white/50">{message}</div>}</div>
          <div className="rounded-[30px] border border-white/[0.07] bg-[#0a0d16]/90 p-6"><p className="text-[10px] uppercase tracking-[.18em] text-white/28">Profile context</p><div className="mt-6 space-y-5"><div><p className="text-[9px] uppercase tracking-[.15em] text-white/22">Target goal</p><p className="mt-2 text-sm font-medium">{savedUser.careerGoal || "Not set"}</p></div><div><p className="text-[9px] uppercase tracking-[.15em] text-white/22">Profile skills</p><p className="mt-2 text-sm text-white/55">{savedUser.skills?.length || 0} skills</p></div><div><p className="text-[9px] uppercase tracking-[.15em] text-white/22">Resume intelligence</p><p className="mt-2 text-sm text-white/55">{savedUser.resumeAnalysis ? `${savedUser.resumeAnalysis.detectedSkills?.length || 0} resume skills detected` : "No resume analysis yet"}</p></div></div><button disabled={loading} onClick={generate} className="mt-7 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#080a11] disabled:opacity-50">{loading ? "Generating…" : intelligence ? "Recalculate intelligence" : "Generate Career Intelligence"}</button></div>
        </section>

        {!intelligence ? (
          <section className="mt-7 rounded-[30px] border border-dashed border-white/[0.1] bg-white/[0.015] px-6 py-16 text-center"><p className="text-sm font-medium">Your role matches have not been generated yet.</p><p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-white/28">For stronger results, complete your Career Profile and run Resume Intelligence first. CareerUp can still generate matches from your saved profile skills and interests.</p><button onClick={generate} disabled={loading} className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">Generate matches</button></section>
        ) : (
          <>
            <section className="mt-7 grid gap-5 lg:grid-cols-[360px_1fr]">
              <div className="space-y-3">{matches.map((match, index) => <MatchCard key={match.role} match={match} index={index} active={selected === index} onClick={() => setSelected(index)} />)}</div>

              {active && <div className="ci-card rounded-[30px] border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8"><div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] uppercase tracking-[.18em] text-[#d9b45a]">Selected path</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.045em]">{active.role}</h2><p className="mt-3 text-sm text-white/34">Based on your current Career Profile and latest available resume evidence.</p></div><ScoreRing value={active.readinessScore}/></div>

                <div className="mt-8 grid gap-5 md:grid-cols-2"><div className="rounded-[24px] border border-white/[0.06] bg-black/10 p-5"><p className="text-[10px] uppercase tracking-[.17em] text-white/25">Matched skills</p><div className="mt-4 flex flex-wrap gap-2">{active.matchedSkills?.length ? active.matchedSkills.map(skill => <SkillPill key={skill}>{skill}</SkillPill>) : <span className="text-xs text-white/25">No direct skill matches yet.</span>}</div></div><div className="rounded-[24px] border border-white/[0.06] bg-black/10 p-5"><p className="text-[10px] uppercase tracking-[.17em] text-white/25">Core gaps</p><div className="mt-4 flex flex-wrap gap-2">{active.missingSkills?.length ? active.missingSkills.map(skill => <SkillPill key={skill} missing>{skill}</SkillPill>) : <span className="text-xs text-emerald-200/65">No core gaps detected in this model.</span>}</div></div></div>

                <div className="mt-5 grid gap-5 md:grid-cols-2"><div className="rounded-[24px] border border-white/[0.06] bg-black/10 p-5"><p className="text-[10px] uppercase tracking-[.17em] text-white/25">Why this fits</p><div className="mt-4 space-y-3">{active.whyFit?.map(item => <div key={item} className="flex gap-3 text-sm leading-6 text-white/48"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300"/><span>{item}</span></div>)}</div></div><div className="rounded-[24px] border border-white/[0.06] bg-black/10 p-5"><p className="text-[10px] uppercase tracking-[.17em] text-white/25">Next actions</p><div className="mt-4 space-y-3">{active.nextActions?.map(item => <div key={item} className="flex gap-3 text-sm leading-6 text-white/48"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9b45a]"/><span>{item}</span></div>)}</div></div></div>
              </div>}
            </section>

            <section className="mt-5 rounded-[28px] border border-white/[0.07] bg-white/[0.02] p-6"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="text-[10px] uppercase tracking-[.18em] text-white/25">Best current match</p><p className="mt-2 text-xl font-semibold">{intelligence.primaryRole}</p><p className="mt-2 text-xs text-white/30">Generated from your current profile. Updating your skills, target role or resume should change these results.</p></div><div className="sm:text-right"><p className="text-4xl font-semibold tracking-[-.05em] text-[#efd080]">{intelligence.primaryReadiness}</p><p className="text-[9px] uppercase tracking-[.15em] text-white/22">readiness score</p></div></div></section>
          </>
        )}
      </main>
    </div>
  );
}