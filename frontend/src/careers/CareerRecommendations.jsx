import { Link, Navigate } from "react-router-dom";
import { listValues, recommendCareers } from "./recommendations";

export default function CareerRecommendations() {
  let user;
  try { user = JSON.parse(localStorage.getItem("user")); } catch { user = null; }
  if (!user?.id) return <Navigate to="/login" replace />;
  const recommendations = recommendCareers(user);
  const skills = listValues(user.skills);
  const interests = listValues(user.careerInterests ?? user.interests);
  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <Link to="/dashboard" className="text-xl font-semibold">CareerUp AI</Link>
          <Link to="/dashboard" className="rounded-xl border border-white/20 px-4 py-3 text-sm text-[#F0D98A] hover:bg-white/5">← Back to dashboard</Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-xs uppercase tracking-[0.2em] text-[#D7B45A]">Your next direction</p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">Career Recommendations</h1>
        <p className="mt-5 max-w-2xl leading-7 text-slate-300">Explore roles connected to your skills, interests, and career goal. These initial suggestions use profile-matching rules, not an AI assessment or a job-readiness score.</p>
        <section aria-label="Your saved profile" className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Based on your saved profile</h2>
          <dl className="mt-4 grid gap-5 text-sm sm:grid-cols-2">
            <div><dt className="text-slate-400">Education</dt><dd className="mt-1">{user.education || "Not added yet"}</dd></div>
            <div><dt className="text-slate-400">Career goal</dt><dd className="mt-1">{user.careerGoal || "Not added yet"}</dd></div>
            <div><dt className="text-slate-400">Skills</dt><dd className="mt-1">{skills.join(", ") || "Not added yet"}</dd></div>
            <div><dt className="text-slate-400">Interests</dt><dd className="mt-1">{interests.join(", ") || "Not added yet"}</dd></div>
          </dl>
          <p className="mt-5 text-xs leading-5 text-slate-400">Suggestions use your listed skills, interests, and goal. Education is shown for context and does not determine eligibility.</p>
        </section>
        {recommendations.length ? (
          <section aria-label="Suggested career roles" className="mt-8 grid gap-6 lg:grid-cols-3">
            {recommendations.map((role, index) => (
              <article key={role.title} className="rounded-3xl border border-[#D7B45A]/25 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-widest text-[#D7B45A]">Suggestion {index + 1}</p>
                <h2 className="mt-4 text-2xl font-semibold">{role.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{role.summary}</p>
                <h3 className="mt-6 font-medium text-[#F0D98A]">Why this role appears</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                  {role.goalMatch && <li>• Matches your stated career goal.</li>}
                  {!!role.interestMatches.length && <li>• Connects with your interest in {role.interestMatches.join(", ")}.</li>}
                  {!!role.matched.length && <li>• Uses skills you listed: {role.matched.join(", ")}.</li>}
                </ul>
                <h3 className="mt-6 font-medium text-[#F0D98A]">Skills to explore next</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{role.missing.length ? role.missing.join(", ") : "You have listed all starter skills for this role. Build a project to demonstrate them."}</p>
                <p className="mt-5 text-xs leading-5 text-slate-400">Skills are self-reported. Missing skills are absent from your profile, not necessarily skills you lack.</p>
              </article>
            ))}
          </section>
        ) : (
          <section className="mt-8 rounded-3xl border border-white/10 p-8">
            <h2 className="text-xl font-semibold">No matching roles yet</h2>
            <p className="mt-3 text-slate-300">Add your skills, interests, and a specific career goal using Edit Profile on the dashboard. This starter catalog currently covers six technology roles.</p>
            <Link to="/dashboard" className="mt-6 inline-block rounded-xl bg-[#D7B45A] px-5 py-3 font-medium text-[#070A12]">Go to dashboard</Link>
          </section>
        )}
      </main>
    </div>
  );
}
