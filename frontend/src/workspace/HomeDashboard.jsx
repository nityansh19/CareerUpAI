import { useState } from "react";
import { Link } from "react-router-dom";
import { getProfileCompletion, getStoredUser } from "../auth/session";
import { AskCareerUp, DemoBanner, Icon, PageHeader } from "./WorkspaceShell";

const hour = new Date().getHours();
const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

export default function HomeDashboard() {
  const user = getStoredUser() || {};
  const [detail, setDetail] = useState(null);
  const profile = getProfileCompletion(user);
  const resume = user.resumeAnalysis;
  const career = user.careerIntelligence;
  const skills = Array.isArray(user.skills) ? user.skills : [];
  const hasResume = Boolean(user.cvFile || user.cvOriginalName);
  const ready = [profile === 100, Boolean(resume?.analyzedAt), Boolean(career?.generatedAt)].filter(Boolean).length;
  const firstName = (user.name || "there").trim().split(" ")[0];
  const next = !hasResume ? { title: "Connect your resume", text: "Add a PDF to understand your strengths and the improvements that matter.", to: "/resume-intelligence", cta: "Open Resume" }
    : !resume?.analyzedAt ? { title: "Analyze your resume", text: "Turn your existing resume into clear suggestions for your target role.", to: "/resume-intelligence", cta: "Analyze Resume" }
      : !career?.generatedAt ? { title: "Explore your career matches", text: "See which roles fit your skills and where to focus next.", to: "/career-intelligence", cta: "Explore Matches" }
        : career.matches?.[0]?.missingSkills?.length ? { title: `Work on ${career.matches[0].missingSkills[0]}`, text: `A priority skill gap for ${career.primaryRole || user.careerGoal}. Start with one clear next step.`, to: "/skills", cta: "View Skills" }
          : { title: "Keep your profile up to date", text: "Your current signals are connected. Add new projects and skills as you grow.", to: "/profile", cta: "Update Profile" };

  const metrics = [
    { label: "Profile", value: `${profile}%`, note: "Your starting point", to: "/profile", details: "Your name, education, skills, interests, and career goal help CareerUp personalize its guidance." },
    { label: "Resume strength", value: resume ? `${resume.overallScore}/100` : "—", note: resume ? "Latest analysis" : "Ready when you are", to: "/resume-intelligence", details: resume?.recommendations?.slice(0, 3).join(" · ") || "Analyze a PDF resume to see your strengths and improvements." },
    { label: "Career match", value: career ? `${career.primaryReadiness}%` : "—", note: career?.primaryRole || "Find your direction", to: "/career-intelligence", details: career?.matches?.[0]?.whyFit?.slice(0, 2).join(" · ") || "Generate matches based on your profile and resume evidence." },
    { label: "Skills", value: String(skills.length), note: career?.matches?.[0]?.missingSkills?.length ? `${career.matches[0].missingSkills.length} priority gaps` : "In your profile", to: "/skills", details: skills.length ? skills.slice(0, 8).join(" · ") : "Add your skills to your profile to get more useful recommendations." },
  ];
  const actions = [
    ...(career ? [{ icon: "briefcase", title: "Track job opportunities", description: "Save roles and stay on top of applications.", to: "/jobs" }] : []),
    { icon: "file", title: resume ? "Improve your resume" : "Add your resume", description: "See your next resume improvements.", to: "/resume-intelligence" },
    { icon: "spark", title: career ? "Review career fit" : "Explore career paths", description: "Understand roles and skill gaps.", to: "/career-intelligence" },
    { icon: "mic", title: "Practice an interview", description: "Prepare for your next conversation.", to: "/interview" },
  ].filter((item) => item.to !== next.to).slice(0, 3);

  return <>
    {user.isLocalDemo && <DemoBanner/>}
    <PageHeader eyebrow="YOUR WORKSPACE" title={`${greeting}, ${firstName}.`} description="Here’s what can move your career forward today."/>
    <section className="ws-hero" aria-label="Next step and progress">
      <div className="ws-card ws-focus"><p className="ws-section-kicker">RECOMMENDED NEXT STEP</p><p className="ws-focus-label">Continue your career journey</p><h2>{next.title}</h2><p className="ws-focus-copy">{next.text}</p><Link className="ws-btn ws-btn-primary" to={next.to}>{next.cta}<Icon name="arrow" size={15}/></Link></div>
      <div className="ws-card ws-progress"><div><p className="ws-section-kicker">YOUR FOUNDATION</p><div style={{marginTop:20}}><strong>{ready}/3</strong><p>Profile, resume, and career insights connected</p></div></div><div><div className="ws-progress-track"><span style={{width:`${ready/3*100}%`}}/></div><div className="ws-progress-steps"><span className={profile === 100 ? "done" : ""}>Profile</span><span className={resume?.analyzedAt ? "done" : ""}>Resume</span><span className={career?.generatedAt ? "done" : ""}>Career</span></div></div></div>
    </section>
    <AskCareerUp/>
    <section className="ws-metrics" aria-label="Career overview">{metrics.map((metric) => <button className="ws-card ws-metric" key={metric.label} onClick={() => setDetail(metric)}><div className="ws-metric-label">{metric.label}</div><div className="ws-metric-value">{metric.value}</div><div className="ws-metric-note">{metric.note}</div></button>)}</section>
    <section><div className="ws-section-head"><h2>Recommended for you</h2><p>Choose one thing to focus on</p></div><div className="ws-actions">{actions.map((action) => <Link to={action.to} className="ws-card ws-action-card" key={action.title}><span className="ws-action-icon"><Icon name={action.icon} size={16}/></span><h3>{action.title}</h3><p>{action.description}</p><Icon name="arrow" size={15}/></Link>)}</div></section>
    {detail && <div className="ws-drawer-backdrop" onClick={() => setDetail(null)}><aside className="ws-drawer" role="dialog" aria-modal="true" aria-label={`${detail.label} details`} onClick={(event) => event.stopPropagation()}><div className="ws-drawer-top"><div><p className="ws-eyebrow">YOUR OVERVIEW</p><h2>{detail.label}</h2></div><button className="ws-icon-button" onClick={() => setDetail(null)} aria-label="Close details"><Icon name="close"/></button></div><div className="ws-score">{detail.value}</div><p>{detail.details}</p><Link className="ws-btn ws-btn-primary" to={detail.to}>Open {detail.label}<Icon name="arrow" size={15}/></Link></aside></div>}
  </>;
}
