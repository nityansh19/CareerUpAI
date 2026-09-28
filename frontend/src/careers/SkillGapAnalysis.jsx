import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { roles, listValues, recommendCareers, analyzeSkillGap } from "./recommendations";

function readUser() {
  try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
}

export default function SkillGapAnalysis() {
  const [user] = useState(readUser);
  const [selectedRole, setSelectedRole] = useState(() => {
    const suggestions = recommendCareers(user || {});
    return suggestions.find(role => role.goalMatch)?.title || "";
  });
  if (!user?.id) return <Navigate to="/login" replace />;
  const analysis = analyzeSkillGap(user, selectedRole);
  const skills = listValues(user.skills);
  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <Link to="/dashboard" className="text-xl font-semibold">CareerUp AI</Link>
          <Link to="/dashboard" className="rounded-xl border border-white/20 px-4 py-3 text-sm text-[#F0D98A] hover:bg-white/5">← Back to dashboard</Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-[#D7B45A]">Build your next skill</p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">Skill Gap Analysis</h1>
        <p className="mt-5 max-w-2xl leading-7 text-slate-300">Compare your saved skills with a starter checklist for a career. This comparison uses your profile, not a test of your ability.</p>
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Your starting point</h2>
          <p className="mt-3 text-sm text-slate-300">Saved career goal: {user.careerGoal || "Not added yet"}</p>
          <p className="mt-3 text-sm text-slate-300">Your skills: {skills.join(", ") || "No skills added yet"}</p>
          {!skills.length && <p className="mt-4 text-sm text-[#F0D98A]">Add your existing skills using Edit Profile on the dashboard for a useful comparison. You can still explore the role checklists below.</p>}
          <label htmlFor="career-role" className="mt-6 block text-sm font-medium">Choose a career to compare</label>
          <select id="career-role" value={selectedRole} onChange={event => setSelectedRole(event.target.value)} className="mt-3 w-full rounded-xl border border-white/20 bg-[#0D111D] p-3 text-white focus:outline-2 focus:outline-[#D7B45A] sm:max-w-md">
            <option value="">Select a role</option>
            {roles.map(role => <option key={role.title} value={role.title}>{role.title}</option>)}
          </select>
          <p className="mt-3 text-xs text-slate-400">Changing this selection does not change your saved career goal.</p>
        </section>
        <div aria-live="polite">
          {analysis ? (
            <>
              <section className="mt-8 rounded-3xl border border-[#D7B45A]/25 bg-white/5 p-6">
                <h2 className="text-2xl font-semibold">{analysis.role.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{analysis.role.summary}</p>
                <p className="mt-6 text-3xl font-semibold text-[#F0D98A]">{analysis.coverage}% <span className="text-base text-slate-300">starter skill coverage</span></p>
                <progress aria-label="Starter skill coverage" value={analysis.matched.length} max={analysis.role.skills.length} className="mt-4 h-3 w-full accent-[#D7B45A]" />
                <p className="mt-3 text-sm text-slate-300">{analysis.matched.length} of {analysis.role.skills.length} starter skills are listed in your profile.</p>
                <p className="mt-3 text-xs leading-5 text-slate-400">This is checklist coverage, not job readiness. Unlisted skills may be skills you already have; update your profile if needed.</p>
              </section>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-semibold">Skills already listed</h2>
                  {analysis.matched.length ? <ul className="mt-5 space-y-3">{analysis.matched.map(skill => <li key={skill} className="text-emerald-300">✓ {skill}</li>)}</ul> : <p className="mt-5 leading-6 text-slate-300">None of this role’s starter skills are listed in your profile yet.</p>}
                </section>
                <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-semibold">Skills to learn or add</h2>
                  {analysis.missing.length ? <ol className="mt-5 list-inside list-decimal space-y-3 text-slate-300">{analysis.missing.map(skill => <li key={skill}>{skill}</li>)}</ol> : <p className="mt-5 leading-6 text-emerald-300">All starter skills are listed. Practice them together in a project and assess your understanding.</p>}
                </section>
              </div>
              <section className="mt-6 rounded-3xl border border-white/10 p-6">
                <h2 className="text-xl font-semibold">Your next step</h2>
                <p className="mt-3 leading-7 text-slate-300">{analysis.missing.length ? `Start with ${analysis.missing[0]}. Learn its basics, practice with a small exercise, and add it to your profile when you can use it confidently.` : `Build a small ${analysis.role.title.toLowerCase()} project that combines these skills.`}</p>
                <Link to="/dashboard" className="mt-6 inline-block rounded-xl bg-[#D7B45A] px-5 py-3 font-medium text-[#070A12]">Back to your profile</Link>
              </section>
            </>
          ) : <p className="mt-8 text-slate-300">Choose one of the six available roles to see its skill checklist.</p>}
        </div>
      </main>
    </div>
  );
}
