import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { buildDemoCareerIntelligence, buildDemoResumeAnalysis } from "./demoIntelligence";
import { clearStoredUser, getStoredUser, storeUser } from "./auth/session";

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    file: <><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h5"/></>,
    brain: <><path d="M9 4.5a3 3 0 0 0-5 2.2A3.2 3.2 0 0 0 4.8 13 3 3 0 0 0 7 18.5a3 3 0 0 0 5 1.8V5.5A3 3 0 0 0 9 4.5Z"/><path d="M15 4.5a3 3 0 0 1 5 2.2 3.2 3.2 0 0 1-.8 6.3 3 3 0 0 1-2.2 5.5 3 3 0 0 1-5 1.8V5.5a3 3 0 0 1 3-1Z"/></>,
    route: <><circle cx="5" cy="18" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="19" cy="15" r="2"/><path d="m7 16.5 3.8-8M14 7l3.8 6"/></>,
    spark: <><path d="m12 3-1.8 6.2L4 11l6.2 1.8L12 19l1.8-6.2L20 11l-6.2-1.8L12 3Z"/><path d="m19 17-.7 2.2L16 20l2.3.8L19 23l.8-2.2L22 20l-2.2-.8L19 17Z"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 19V5a2 2 0 0 0-2-2h-6"/></>,
    x: <><path d="m6 6 12 12M18 6 6 18"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function FeatureCard({ icon, eyebrow, title, text, to, status, accent }) {
  const tones = {
    gold: "border-[#d9b45a]/15 bg-[#d9b45a]/[.055] text-[#efd080]",
    violet: "border-[#7867ff]/15 bg-[#7867ff]/[.06] text-[#a79dff]",
    mint: "border-[#76d7c4]/15 bg-[#76d7c4]/[.05] text-[#8be5d3]",
    white: "border-white/[.07] bg-white/[.03] text-white/60",
  };
  const body = <><div className="flex items-start justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${tones[accent]}`}><Icon name={icon}/></span><span className="rounded-full border border-white/[.06] px-2.5 py-1 text-[8px] uppercase tracking-[.14em] text-white/24">{status}</span></div><p className="mt-8 text-[9px] uppercase tracking-[.18em] text-white/22">{eyebrow}</p><h3 className="mt-2 text-xl font-semibold tracking-[-.035em]">{title}</h3><p className="mt-3 min-h-[52px] text-sm leading-6 text-white/32">{text}</p><div className="mt-6 flex items-center gap-2 text-xs font-medium text-white/38 transition group-hover:text-[#efd080]">{to ? "Explore demo" : "Coming later"}<Icon name="arrow" size={14}/></div></>;
  const className = "group rounded-[26px] border border-white/[.065] bg-white/[.02] p-5 text-left transition hover:-translate-y-1 hover:border-white/[.12] hover:bg-white/[.03]";
  return to ? <Link to={to} className={className}>{body}</Link> : <div className={className}>{body}</div>;
}

function parseList(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

export default function LocalDemoWorkspace() {
  const fileInputRef = useRef(null);
  const initialUser = useMemo(() => getStoredUser() || {}, []);
  const [user, setUser] = useState(initialUser);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    name: initialUser.name || "",
    education: initialUser.education || "",
    careerGoal: initialUser.careerGoal || "",
    skills: (initialUser.skills || []).join(", "),
    interests: (initialUser.careerInterests || []).join(", "),
  });

  const resume = user.resumeAnalysis;
  const career = user.careerIntelligence;
  const skills = Array.isArray(user.skills) ? user.skills : [];
  const firstName = (user.name || "there").trim().split(" ")[0];

  const saveProfile = (event) => {
    event.preventDefault();
    const nextBase = {
      ...user,
      name: form.name.trim(),
      education: form.education.trim(),
      careerGoal: form.careerGoal.trim(),
      skills: parseList(form.skills),
      careerInterests: parseList(form.interests),
    };
    const nextResume = buildDemoResumeAnalysis(nextBase, user.cvOriginalName || "careerup-demo-resume.pdf");
    const nextCareer = buildDemoCareerIntelligence({ ...nextBase, resumeAnalysis: nextResume });
    const nextUser = { ...nextBase, resumeAnalysis: nextResume, careerIntelligence: nextCareer };
    storeUser(nextUser);
    setUser(nextUser);
    setEditing(false);
    setNotice("Local demo profile updated. Sample Resume and Career Intelligence were recalculated from your new profile.");
  };

  const chooseResume = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") {
      setNotice("Choose a PDF file for the demo preview.");
      return;
    }
    const nextBase = { ...user, cvOriginalName: file.name, cvFile: `local-demo:${file.name}` };
    const nextResume = buildDemoResumeAnalysis(nextBase, file.name);
    const nextCareer = buildDemoCareerIntelligence({ ...nextBase, resumeAnalysis: nextResume });
    const nextUser = { ...nextBase, resumeAnalysis: nextResume, careerIntelligence: nextCareer };
    storeUser(nextUser);
    setUser(nextUser);
    setNotice("PDF selected locally. CareerUp generated a sample product preview; the PDF contents were not uploaded or analyzed.");
  };

  const logout = () => {
    clearStoredUser();
    window.location.href = "/login";
  };

  const stages = [
    ["Profile", true],
    ["Resume", Boolean(resume)],
    ["Career", Boolean(career)],
    ["Roadmap", false],
  ];

  return (
    <div className="min-h-screen bg-[#060811] text-white">
      <style>{`body{background:#060811}.demo-grid{background-image:linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px);background-size:68px 68px;mask-image:linear-gradient(to bottom,black,transparent 92%)}.demo-card{box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}.demo-input{width:100%;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);outline:none;transition:.2s}.demo-input:focus{border-color:rgba(217,180,90,.45);box-shadow:0 0 0 4px rgba(217,180,90,.07)}@media(prefers-reduced-motion:reduce){*{transition:none!important}}`}</style>
      <div className="pointer-events-none fixed inset-0"><div className="demo-grid absolute inset-0"/><div className="absolute -right-48 -top-48 h-[560px] w-[560px] rounded-full bg-[#7867ff]/10 blur-[165px]"/><div className="absolute -bottom-52 left-[14%] h-[520px] w-[520px] rounded-full bg-[#d9b45a]/[.065] blur-[170px]"/></div>

      <header className="sticky top-0 z-40 border-b border-white/[.065] bg-[#060811]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[72px] max-w-[1480px] items-center justify-between px-5 sm:px-7 lg:px-9">
          <Link to="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#d9b45a]/25 bg-[#d9b45a]/[.075] font-semibold text-[#efd080]">C</span><div><p className="text-sm font-semibold">CareerUp AI</p><p className="mt-1 text-[8px] uppercase tracking-[.22em] text-white/22">Local demo workspace</p></div></Link>
          <div className="flex items-center gap-2"><button onClick={() => setEditing(true)} className="rounded-xl border border-white/[.065] bg-white/[.02] px-3 py-2.5 text-xs text-white/42 transition hover:text-white">Edit local profile</button><button onClick={logout} className="rounded-xl border border-white/[.065] bg-white/[.02] p-2.5 text-white/35 transition hover:text-white"><Icon name="logout" size={16}/></button></div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1480px] px-5 pb-16 pt-7 sm:px-7 lg:px-9 lg:pt-9">
        <div className="mb-5 rounded-2xl border border-[#76d7c4]/12 bg-[#76d7c4]/[.04] px-4 py-3 text-xs leading-5 text-[#a9eadc]/75"><strong className="font-semibold text-[#a9eadc]">Local demo mode:</strong> the profile, scores and recommendations below are sample product data stored in this browser. No resume contents are uploaded or genuinely analyzed in this mode.</div>
        {notice && <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-[#d9b45a]/12 bg-[#d9b45a]/[.04] px-4 py-3 text-xs leading-5 text-white/50"><span>{notice}</span><button onClick={() => setNotice("")} className="text-white/30 hover:text-white"><Icon name="x" size={14}/></button></div>}

        <section className="grid gap-5 xl:grid-cols-[1.18fr_.82fr]">
          <div className="demo-card relative overflow-hidden rounded-[30px] border border-white/[.07] bg-[#090c15]/82 p-6 sm:p-8"><div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#7867ff]/10 blur-[100px]"/><div className="relative"><div className="inline-flex items-center gap-2 rounded-full border border-[#76d7c4]/12 bg-[#76d7c4]/[.04] px-3 py-1.5 text-[9px] uppercase tracking-[.17em] text-[#8be5d3]"><span className="h-1.5 w-1.5 rounded-full bg-[#76d7c4]"/>Product tour unlocked</div><h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-5xl">Welcome, {firstName}. Explore what CareerUp is becoming.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-white/34">This workspace shows the full product direction using local sample data: a shared Career Profile, resume diagnostics, career matches and the path toward personalized roadmaps and an AI career assistant.</p><div className="mt-7 flex flex-wrap gap-3"><Link to="/resume-intelligence" className="inline-flex items-center gap-2 rounded-2xl bg-[#f0d481] px-4 py-3 text-xs font-semibold text-[#11131a]">Open Resume Intelligence <Icon name="arrow" size={14}/></Link><Link to="/career-intelligence" className="inline-flex items-center gap-2 rounded-2xl border border-white/[.08] bg-white/[.025] px-4 py-3 text-xs text-white/60">Open Career Intelligence <Icon name="arrow" size={14}/></Link></div></div></div>

          <div className="demo-card rounded-[30px] border border-white/[.07] bg-white/[.022] p-6"><p className="text-[9px] uppercase tracking-[.18em] text-white/22">CareerUp flow</p><h2 className="mt-2 text-lg font-semibold">Connected intelligence</h2><div className="relative mt-8 flex items-start justify-between"><div className="absolute left-[10%] right-[10%] top-[18px] h-px bg-gradient-to-r from-[#76d7c4]/25 via-[#d9b45a]/25 to-white/[.06]"/>{stages.map(([label,ready],index)=><div key={label} className="relative z-10 flex flex-1 flex-col items-center text-center"><span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${ready?"border-[#76d7c4]/20 bg-[#76d7c4]/[.07] text-[#8be5d3]":index===3?"border-[#d9b45a]/20 bg-[#d9b45a]/[.06] text-[#efd080]":"border-white/[.06] bg-[#090c14] text-white/20"}`}>{ready?<Icon name="check" size={14}/>:<span className="h-1.5 w-1.5 rounded-full bg-current"/>}</span><span className="mt-2 text-[9px] uppercase tracking-[.12em] text-white/30">{label}</span></div>)}</div><div className="mt-8 border-t border-white/[.055] pt-5 text-xs"><div className="flex justify-between"><span className="text-white/25">Target role</span><span className="font-medium text-white/60">{user.careerGoal}</span></div><div className="mt-3 flex justify-between"><span className="text-white/25">Resume</span><span className="max-w-[60%] truncate text-white/45">{user.cvOriginalName}</span></div></div></div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="demo-card rounded-[24px] border border-white/[.065] bg-white/[.022] p-5"><p className="text-[9px] uppercase tracking-[.18em] text-white/24">Career Profile</p><p className="mt-3 text-3xl font-semibold tracking-[-.05em] text-[#efd080]">100%</p><p className="mt-2 text-xs text-white/28">Sample context connected</p></div>
          <div className="demo-card rounded-[24px] border border-white/[.065] bg-white/[.022] p-5"><p className="text-[9px] uppercase tracking-[.18em] text-white/24">Resume score</p><p className="mt-3 text-3xl font-semibold tracking-[-.05em] text-[#a79dff]">{resume?.overallScore || "—"}/100</p><p className="mt-2 text-xs text-white/28">Illustrative Resume Intelligence</p></div>
          <div className="demo-card rounded-[24px] border border-white/[.065] bg-white/[.022] p-5"><p className="text-[9px] uppercase tracking-[.18em] text-white/24">Career match</p><p className="mt-3 text-3xl font-semibold tracking-[-.05em] text-[#8be5d3]">{career?.primaryReadiness || "—"}%</p><p className="mt-2 truncate text-xs text-white/28">{career?.primaryRole || user.careerGoal}</p></div>
          <div className="demo-card rounded-[24px] border border-white/[.065] bg-white/[.022] p-5"><p className="text-[9px] uppercase tracking-[.18em] text-white/24">Skills</p><p className="mt-3 text-3xl font-semibold tracking-[-.05em]">{skills.length}</p><p className="mt-2 text-xs text-white/28">Editable local profile skills</p></div>
        </section>

        <section className="mt-9"><div className="mb-4"><p className="text-[9px] uppercase tracking-[.19em] text-[#d9b45a]/70">What users will get</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em]">The CareerUp intelligence stack.</h2></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><FeatureCard icon="file" eyebrow="Diagnose" title="Resume Intelligence" text="See structure, impact, skill coverage, strengths, gaps and role alignment in one report." to="/resume-intelligence" status="Demo ready" accent="gold"/><FeatureCard icon="brain" eyebrow="Discover" title="Career Intelligence" text="Compare role directions, readiness scores, matched skills, missing skills and next actions." to="/career-intelligence" status="Demo ready" accent="violet"/><FeatureCard icon="route" eyebrow="Plan" title="Personal Roadmaps" text="Turn a target role into a focused sequence of skills, projects and milestones." to="/roadmaps" status="Preview" accent="mint"/><FeatureCard icon="spark" eyebrow="Ask" title="AI Career Assistant" text="A future context-aware copilot for decisions, applications, interviews and career planning." status="Planned" accent="white"/></div></section>

        <section className="mt-9 grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
          <div className="demo-card rounded-[28px] border border-white/[.065] bg-white/[.02] p-6"><div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[.18em] text-white/22">Sample intelligence</p><h2 className="mt-2 text-xl font-semibold">What the product can surface</h2></div><button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl border border-white/[.07] bg-white/[.02] px-3 py-2 text-[10px] text-white/38 hover:text-white"><Icon name="upload" size={14}/>Choose PDF name</button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-white/[.055] bg-black/10 p-5"><p className="text-[9px] uppercase tracking-[.16em] text-[#efd080]/65">Resume strengths</p><div className="mt-4 space-y-2">{(resume?.strengths||[]).slice(0,3).map((item)=><p key={item} className="flex gap-2 text-xs leading-5 text-white/32"><span className="mt-1 text-[#76d7c4]"><Icon name="check" size={12}/></span>{item}</p>)}</div></div><div className="rounded-2xl border border-white/[.055] bg-black/10 p-5"><p className="text-[9px] uppercase tracking-[.16em] text-[#a79dff]/70">Career priority gaps</p><p className="mt-4 text-sm font-medium text-white/62">{career?.primaryRole}</p><p className="mt-2 text-xs leading-5 text-white/30">{career?.matches?.[0]?.missingSkills?.length ? career.matches[0].missingSkills.slice(0,3).join(" · ") : "No sample gaps in the primary path."}</p></div></div></div>

          <div className="demo-card rounded-[28px] border border-white/[.065] bg-white/[.02] p-6"><div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[.18em] text-white/22">Local Career Profile</p><h2 className="mt-2 text-xl font-semibold">Customize the demo</h2></div><button onClick={() => setEditing(true)} className="rounded-xl border border-white/[.06] px-3 py-2 text-[10px] text-white/35 hover:text-white">Edit</button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div><p className="text-[9px] uppercase tracking-[.14em] text-white/20">Target</p><p className="mt-2 text-sm text-white/60">{user.careerGoal}</p></div><div><p className="text-[9px] uppercase tracking-[.14em] text-white/20">Education</p><p className="mt-2 text-sm text-white/60">{user.education}</p></div></div><div className="mt-6"><p className="text-[9px] uppercase tracking-[.14em] text-white/20">Skills</p><div className="mt-3 flex flex-wrap gap-2">{skills.slice(0,8).map((skill)=><span key={skill} className="rounded-full border border-white/[.06] bg-white/[.02] px-3 py-1.5 text-[10px] text-white/40">{skill}</span>)}</div></div></div>
        </section>
      </main>

      <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={chooseResume}/>

      {editing && <div className="fixed inset-0 z-[80] flex justify-end bg-black/65 backdrop-blur-sm"><button aria-label="Close editor" onClick={() => setEditing(false)} className="absolute inset-0"/><aside className="relative z-10 h-full w-full max-w-[570px] overflow-y-auto border-l border-white/[.075] bg-[#090c14] p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><p className="text-[9px] uppercase tracking-[.18em] text-[#d9b45a]/70">Local demo profile</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em]">Make the sample feel more like you.</h2><p className="mt-3 text-sm leading-6 text-white/32">Saving recalculates the illustrative demo scores locally. It still does not contact a server or analyze a real resume.</p></div><button onClick={() => setEditing(false)} className="rounded-xl border border-white/[.065] p-2 text-white/30 hover:text-white"><Icon name="x"/></button></div><form onSubmit={saveProfile} className="mt-8 space-y-5"><label className="block"><span className="mb-2 block text-xs text-white/45">Name</span><input className="demo-input rounded-xl px-4 py-3 text-sm text-white" value={form.name} onChange={(event)=>setForm({...form,name:event.target.value})} required/></label><label className="block"><span className="mb-2 block text-xs text-white/45">Education</span><input className="demo-input rounded-xl px-4 py-3 text-sm text-white" value={form.education} onChange={(event)=>setForm({...form,education:event.target.value})} required/></label><label className="block"><span className="mb-2 block text-xs text-white/45">Target role</span><input className="demo-input rounded-xl px-4 py-3 text-sm text-white" value={form.careerGoal} onChange={(event)=>setForm({...form,careerGoal:event.target.value})} required/></label><label className="block"><span className="mb-2 block text-xs text-white/45">Skills</span><textarea rows="4" className="demo-input rounded-xl px-4 py-3 text-sm text-white" value={form.skills} onChange={(event)=>setForm({...form,skills:event.target.value})} required/></label><label className="block"><span className="mb-2 block text-xs text-white/45">Interests</span><textarea rows="4" className="demo-input rounded-xl px-4 py-3 text-sm text-white" value={form.interests} onChange={(event)=>setForm({...form,interests:event.target.value})} required/></label><div className="flex justify-end gap-3 border-t border-white/[.055] pt-5"><button type="button" onClick={()=>setEditing(false)} className="rounded-xl border border-white/[.075] px-5 py-3 text-sm text-white/38">Cancel</button><button className="rounded-xl bg-[#f0d481] px-6 py-3 text-sm font-semibold text-[#11131a]">Save local profile</button></div></form></aside></div>}
    </div>
  );
}
