import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../lib/api";
import { clearStoredUser, getProfileCompletion, getStoredUser, storeUser } from "../auth/session";
import "./DashboardStyles.css";

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    file: <><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h5"/></>,
    brain: <><path d="M9 4.5a3 3 0 0 0-5 2.2A3.2 3.2 0 0 0 4.8 13 3 3 0 0 0 7 18.5a3 3 0 0 0 5 1.8V5.5A3 3 0 0 0 9 4.5Z"/><path d="M15 4.5a3 3 0 0 1 5 2.2 3.2 3.2 0 0 1-.8 6.3 3 3 0 0 1-2.2 5.5 3 3 0 0 1-5 1.8V5.5a3 3 0 0 1 3-1Z"/></>,
    route: <><circle cx="5" cy="18" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="19" cy="15" r="2"/><path d="m7 16.5 3.8-8M14 7l3.8 6"/></>,
    spark: <><path d="m12 3-1.8 6.2L4 11l6.2 1.8L12 19l1.8-6.2L20 11l-6.2-1.8L12 3Z"/><path d="m19 17-.7 2.2L16 20l2.3.8L19 23l.8-2.2L22 20l-2.2-.8L19 17Z"/></>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 19V5a2 2 0 0 0-2-2h-6"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    x: <><path d="m6 6 12 12M18 6 6 18"/></>,
    target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></>,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function MetricCard({ label, value, note, accent = "white" }) {
  const color = accent === "gold" ? "text-[#efd080]" : accent === "mint" ? "text-[#8be5d3]" : accent === "violet" ? "text-[#a79dff]" : "text-white";
  return (
    <div className="workspace-card rounded-[24px] border border-white/[.065] bg-white/[.022] p-5">
      <p className="text-[9px] uppercase tracking-[.18em] text-white/24">{label}</p>
      <p className={`mt-3 truncate text-3xl font-semibold tracking-[-.05em] ${color}`}>{value}</p>
      <p className="mt-2 truncate text-xs text-white/28">{note}</p>
    </div>
  );
}

function SidebarItem({ icon, label, to, onClick, active = false, status }) {
  const className = `workspace-nav-item flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm ${active ? "bg-white/[.06] text-white" : "text-white/38 hover:bg-white/[.035] hover:text-white"}`;
  const content = <><Icon name={icon}/><span>{label}</span>{status && <span className="ml-auto rounded-full border border-white/[.055] px-2 py-0.5 text-[7px] uppercase tracking-[.12em] text-white/20">{status}</span>}</>;
  return to ? <Link to={to} className={className}>{content}</Link> : <button type="button" onClick={onClick} className={className}>{content}</button>;
}

function ModuleCard({ icon, eyebrow, title, text, to, status, accent = "gold", onClick }) {
  const accents = {
    gold: "border-[#d9b45a]/15 bg-[#d9b45a]/[.055] text-[#efd080]",
    violet: "border-[#7867ff]/15 bg-[#7867ff]/[.06] text-[#a79dff]",
    mint: "border-[#76d7c4]/15 bg-[#76d7c4]/[.05] text-[#8be5d3]",
    white: "border-white/[.075] bg-white/[.03] text-white/65",
  };
  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${accents[accent]}` }><Icon name={icon}/></span>
        <span className="rounded-full border border-white/[.06] bg-white/[.02] px-2.5 py-1 text-[8px] uppercase tracking-[.14em] text-white/24">{status}</span>
      </div>
      <p className="mt-8 text-[9px] uppercase tracking-[.18em] text-white/22">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-[-.035em]">{title}</h3>
      <p className="mt-3 min-h-[52px] text-sm leading-6 text-white/32">{text}</p>
      <div className="mt-6 flex items-center gap-2 text-xs font-medium text-white/40 transition group-hover:text-[#efd080]">Open module <Icon name="arrow" size={14}/></div>
    </>
  );
  const className = "workspace-module workspace-card group block rounded-[26px] border border-white/[.065] bg-white/[.02] p-5 text-left";
  return to ? <Link to={to} className={className}>{body}</Link> : <button type="button" onClick={onClick} className={`${className} w-full`}>{body}</button>;
}

function SignalStep({ label, ready, current }) {
  return (
    <div className="relative z-10 flex flex-1 flex-col items-center text-center">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${ready ? "border-[#76d7c4]/20 bg-[#76d7c4]/[.07] text-[#8be5d3]" : current ? "border-[#d9b45a]/20 bg-[#d9b45a]/[.07] text-[#efd080]" : "border-white/[.06] bg-[#090c14] text-white/20"}`}>
        {ready ? <Icon name="check" size={14}/> : <span className="h-1.5 w-1.5 rounded-full bg-current"/>}
      </span>
      <span className={`mt-2 text-[9px] uppercase tracking-[.12em] ${ready ? "text-white/45" : current ? "text-[#efd080]/70" : "text-white/18"}`}>{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const fileInputRef = useRef(null);
  const savedUser = useMemo(() => getStoredUser() || {}, []);
  const [user, setUser] = useState(savedUser);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [profile, setProfile] = useState({
    fullName: savedUser?.name || "",
    education: savedUser?.education || "",
    skills: Array.isArray(savedUser?.skills) ? savedUser.skills.join(", ") : "",
    interests: Array.isArray(savedUser?.careerInterests) ? savedUser.careerInterests.join(", ") : "",
    careerGoal: savedUser?.careerGoal || "",
  });

  const skills = Array.isArray(user.skills) ? user.skills : [];
  const interests = Array.isArray(user.careerInterests) ? user.careerInterests : [];
  const profileCompletion = getProfileCompletion(user);
  const resumeName = user.cvOriginalName || localStorage.getItem("careerup_cv_name") || "";
  const hasResume = Boolean(resumeName || user.cvFile);
  const resumeAnalysis = user.resumeAnalysis || null;
  const careerIntelligence = user.careerIntelligence || null;
  const resumeScore = Number.isFinite(Number(resumeAnalysis?.overallScore)) ? Number(resumeAnalysis.overallScore) : null;
  const careerScore = Number.isFinite(Number(careerIntelligence?.primaryReadiness)) ? Number(careerIntelligence.primaryReadiness) : null;
  const primaryMatch = Array.isArray(careerIntelligence?.matches) ? careerIntelligence.matches[0] : null;
  const connectedLayers = [profileCompletion === 100, Boolean(resumeAnalysis?.analyzedAt), Boolean(careerIntelligence?.generatedAt)].filter(Boolean).length;
  const firstName = (user.name || "there").trim().split(" ")[0];
  const targetRole = careerIntelligence?.primaryRole || user.careerGoal || "Not set";

  const nextMove = !hasResume
    ? { eyebrow: "Build evidence", title: "Connect your current resume", text: "Upload a PDF so Resume Intelligence can evaluate the evidence behind your Career Profile.", cta: "Upload resume", action: () => fileInputRef.current?.click() }
    : !resumeAnalysis?.analyzedAt
      ? { eyebrow: "Diagnose", title: "Run your first resume analysis", text: "Your resume is connected. Analyze its structure, impact, skill coverage and target-role alignment next.", cta: "Open Resume Intelligence", to: "/resume-intelligence" }
      : !careerIntelligence?.generatedAt
        ? { eyebrow: "Discover", title: "Generate your career matches", text: "Your profile and resume evidence are ready. Compare realistic role directions and identify your strongest skill gaps.", cta: "Open Career Intelligence", to: "/career-intelligence" }
        : primaryMatch?.missingSkills?.length
          ? { eyebrow: "Highest-value gap", title: `Strengthen ${primaryMatch.missingSkills[0]}`, text: `Your strongest current path is ${primaryMatch.role}. Closing this gap can improve the evidence behind that direction.`, cta: "Review career match", to: "/career-intelligence" }
          : { eyebrow: "Turn insight into action", title: "Build your next focused roadmap", text: "Your core profile and intelligence layers are connected. Translate them into milestones and project evidence next.", cta: "Explore roadmaps", to: "/roadmaps" };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    if (!user?.id) { setNotice("Please sign in again before saving your profile."); return; }
    setSaving(true);
    setNotice("");
    try {
      const response = await fetch(apiUrl(`/api/users/profile/${user.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save profile.");
      setUser(data.user);
      storeUser(data.user);
      setShowProfile(false);
      setNotice("Career Profile updated. Career Intelligence will refresh from your latest context when you generate it again.");
    } catch (error) {
      setNotice(error.message || "Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { setNotice("Please choose a PDF resume."); return; }
    if (!user?.id) { setNotice("Please sign in again before uploading a resume."); return; }

    setUploading(true);
    setNotice("");
    try {
      const body = new FormData();
      body.append("cv", file);
      const response = await fetch(apiUrl(`/api/users/upload-cv/${user.id}`), { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Resume upload failed.");
      const nextUser = data.user || { ...user, cvOriginalName: data.cv?.originalName || file.name, cvFile: data.cv?.fileName };
      localStorage.setItem("careerup_cv_name", data.cv?.originalName || file.name);
      setUser(nextUser);
      storeUser(nextUser);
      setNotice("Resume connected. Open Resume Intelligence when you are ready to analyze it.");
    } catch (error) {
      setNotice(error.message || "Resume upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleLogout = () => {
    clearStoredUser();
    window.location.href = "/";
  };

  const intelligenceStages = [
    { label: "Profile", ready: profileCompletion === 100 },
    { label: "Resume", ready: Boolean(resumeAnalysis?.analyzedAt), current: profileCompletion === 100 && !resumeAnalysis?.analyzedAt },
    { label: "Career", ready: Boolean(careerIntelligence?.generatedAt), current: Boolean(resumeAnalysis?.analyzedAt) && !careerIntelligence?.generatedAt },
    { label: "Roadmap", ready: false, current: Boolean(careerIntelligence?.generatedAt) },
  ];

  return (
    <div className="min-h-screen bg-[#060811] text-white">
      <div className="workspace-noise pointer-events-none fixed inset-0 z-[1]" />
      <div className="pointer-events-none fixed inset-0"><div className="workspace-grid absolute inset-0"/><div className="absolute right-[-190px] top-[-190px] h-[560px] w-[560px] rounded-full bg-[#7867ff]/10 blur-[165px]"/><div className="absolute bottom-[-220px] left-[16%] h-[520px] w-[520px] rounded-full bg-[#d9b45a]/[.065] blur-[170px]"/></div>

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-[268px] shrink-0 border-r border-white/[.065] bg-[#080b13]/72 px-4 py-5 backdrop-blur-2xl lg:flex lg:flex-col">
          <Link to="/" className="flex items-center gap-3 px-2"><span className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#d9b45a]/25 bg-[#d9b45a]/[.075] font-semibold text-[#efd080]">C</span><span><span className="block text-sm font-semibold">CareerUp AI</span><span className="mt-1 block text-[8px] uppercase tracking-[.23em] text-white/22">Career operating system</span></span></Link>

          <nav className="mt-9 space-y-1">
            <SidebarItem icon="home" label="Overview" active />
            <SidebarItem icon="user" label="Career Profile" onClick={() => setShowProfile(true)} />
            <SidebarItem icon="file" label="Resume Intelligence" to="/resume-intelligence" />
            <SidebarItem icon="brain" label="Career Intelligence" to="/career-intelligence" />
            <SidebarItem icon="route" label="Roadmaps" to="/roadmaps" status="Preview" />
            <SidebarItem icon="spark" label="AI Career Assistant" status="Soon" />
          </nav>

          <div className="mt-auto space-y-3">
            <div className="workspace-card rounded-2xl border border-white/[.06] bg-white/[.018] p-4">
              <div className="flex items-center justify-between"><p className="text-[9px] uppercase tracking-[.17em] text-white/22">Intelligence layers</p><span className="text-xs font-medium text-[#efd080]">{connectedLayers}/3</span></div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[.055]"><div className="h-full rounded-full bg-gradient-to-r from-[#7867ff] to-[#d9b45a] transition-[width] duration-500" style={{ width: `${(connectedLayers / 3) * 100}%` }} /></div>
              <p className="mt-3 text-[10px] leading-4 text-white/24">Profile → Resume → Career Intelligence</p>
            </div>
            <button onClick={handleLogout} className="workspace-nav-item flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/28 hover:bg-white/[.03] hover:text-white"><Icon name="logout"/>Logout</button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-white/[.065] bg-[#060811]/74 backdrop-blur-2xl">
            <div className="flex h-[72px] items-center justify-between px-5 sm:px-7 lg:px-9">
              <div className="flex items-center gap-3"><button onClick={() => setMobileNav((value) => !value)} className="rounded-xl border border-white/[.07] p-2.5 text-white/55 lg:hidden"><Icon name="menu"/></button><div><p className="text-sm font-semibold">Career Workspace</p><p className="mt-1 text-[9px] text-white/22">{targetRole}</p></div></div>
              <div className="flex items-center gap-3"><span className="hidden items-center gap-2 rounded-full border border-[#76d7c4]/10 bg-[#76d7c4]/[.035] px-3 py-1.5 text-[9px] uppercase tracking-[.15em] text-[#8be5d3]/70 sm:flex"><span className="workspace-pulse h-1.5 w-1.5 rounded-full bg-[#76d7c4]"/>Profile connected</span><button onClick={handleLogout} className="rounded-xl border border-white/[.065] bg-white/[.02] p-2.5 text-white/34 transition hover:text-white lg:hidden"><Icon name="logout" size={16}/></button></div>
            </div>
            {mobileNav && <div className="border-t border-white/[.055] px-5 py-4 lg:hidden"><div className="grid grid-cols-2 gap-2"><button onClick={() => { setShowProfile(true); setMobileNav(false); }} className="rounded-xl bg-white/[.035] px-3 py-3 text-left text-xs text-white/55">Career Profile</button><Link to="/resume-intelligence" className="rounded-xl bg-white/[.035] px-3 py-3 text-xs text-white/55">Resume Intelligence</Link><Link to="/career-intelligence" className="rounded-xl bg-white/[.035] px-3 py-3 text-xs text-white/55">Career Intelligence</Link><Link to="/roadmaps" className="rounded-xl bg-white/[.035] px-3 py-3 text-xs text-white/55">Roadmaps</Link></div></div>}
          </header>

          <main className="mx-auto max-w-[1480px] px-5 pb-16 pt-7 sm:px-7 lg:px-9 lg:pt-9">
            {notice && <div className="workspace-toast mb-6 flex items-start justify-between gap-4 rounded-2xl border border-[#d9b45a]/15 bg-[#d9b45a]/[.05] px-4 py-3 text-sm leading-6 text-white/55"><span>{notice}</span><button onClick={() => setNotice("")} className="mt-0.5 text-white/28 transition hover:text-white"><Icon name="x" size={15}/></button></div>}

            <section className="grid gap-5 xl:grid-cols-[1.18fr_.82fr]">
              <div className="next-move-glow relative overflow-hidden rounded-[30px] border border-white/[.07] bg-[#090c15]/82 p-6 sm:p-8">
                <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#7867ff]/10 blur-[95px]"/>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/[.07] bg-white/[.025] px-3 py-1.5 text-[9px] uppercase tracking-[.17em] text-white/32"><span className="workspace-pulse h-1.5 w-1.5 rounded-full bg-[#76d7c4]"/>Career operating system</div>
                  <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-5xl">Welcome back, {firstName}.</h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/34">Your Career Profile is the shared context behind every analysis. CareerUp uses what you have already added to surface the next useful action—not another generic checklist.</p>

                  <div className="mt-8 rounded-[24px] border border-[#7867ff]/12 bg-[#7867ff]/[.045] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
                    <div><p className="text-[9px] uppercase tracking-[.18em] text-[#a79dff]/70">{nextMove.eyebrow}</p><h2 className="mt-2 text-xl font-semibold tracking-[-.035em] sm:text-2xl">{nextMove.title}</h2><p className="mt-2 max-w-2xl text-xs leading-6 text-white/30">{nextMove.text}</p></div>
                    {nextMove.to ? <Link to={nextMove.to} className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-[#090b12] transition hover:-translate-y-0.5 sm:mt-0">{nextMove.cta}<Icon name="arrow" size={14}/></Link> : <button onClick={nextMove.action} className="mt-5 inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-[#090b12] transition hover:-translate-y-0.5 sm:mt-0">{nextMove.cta}<Icon name="arrow" size={14}/></button>}
                  </div>
                </div>
              </div>

              <div className="workspace-card rounded-[30px] border border-white/[.07] bg-white/[.022] p-6">
                <div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[.18em] text-white/22">Connected intelligence</p><p className="mt-2 text-lg font-semibold">{connectedLayers}/3 layers active</p></div><span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d9b45a]/14 bg-[#d9b45a]/[.055] text-[#efd080]"><Icon name="layers"/></span></div>
                <div className="relative mt-8 flex items-start justify-between"><div className="workspace-step-line absolute left-[10%] right-[10%] top-[18px] h-px"/>{intelligenceStages.map((stage) => <SignalStep key={stage.label} {...stage}/>)}</div>
                <div className="mt-8 border-t border-white/[.055] pt-5"><div className="flex items-center justify-between text-xs"><span className="text-white/27">Current target</span><span className="max-w-[60%] truncate font-medium text-white/65">{targetRole}</span></div><div className="mt-3 flex items-center justify-between text-xs"><span className="text-white/27">Resume</span><span className="max-w-[60%] truncate text-white/45">{resumeName || "Not connected"}</span></div></div>
              </div>
            </section>

            <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Career Profile" value={`${profileCompletion}%`} note="Shared context completed" accent="gold" />
              <MetricCard label="Resume score" value={resumeScore === null ? "—" : `${resumeScore}/100`} note={resumeScore === null ? (hasResume ? "Ready to analyze" : "Resume not connected") : "Latest Resume Intelligence"} accent="violet" />
              <MetricCard label="Career match" value={careerScore === null ? "—" : `${careerScore}%`} note={careerScore === null ? "Generate Career Intelligence" : careerIntelligence?.primaryRole || "Primary role readiness"} accent="mint" />
              <MetricCard label="Skills" value={skills.length} note={skills.length ? `${Math.min(skills.length, 4)} shown in snapshot` : "No skills connected"} />
            </section>

            <section className="mt-9">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[9px] uppercase tracking-[.19em] text-[#d9b45a]/70">Your intelligence stack</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em]">Everything builds from the same profile.</h2></div><button onClick={() => setShowProfile(true)} className="text-left text-xs text-white/30 transition hover:text-white sm:text-right">Edit Career Profile →</button></div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <ModuleCard icon="file" eyebrow="Diagnose" title="Resume Intelligence" text="Analyze structure, impact, skill coverage and target-role alignment from your current PDF." to="/resume-intelligence" status={resumeAnalysis?.analyzedAt ? "Analyzed" : hasResume ? "Ready" : "Needs resume"} accent="gold" />
                <ModuleCard icon="brain" eyebrow="Discover" title="Career Intelligence" text="Compare realistic role directions, readiness scores and the skills holding each path back." to="/career-intelligence" status={careerIntelligence?.generatedAt ? "Generated" : "Ready"} accent="violet" />
                <ModuleCard icon="route" eyebrow="Plan" title="Personal Roadmaps" text="Turn your target direction into skills, projects and milestones that can become real evidence." to="/roadmaps" status="Preview" accent="mint" />
                <ModuleCard icon="spark" eyebrow="Ask" title="AI Career Assistant" text="A future context-aware assistant for decisions, applications, interview prep and next actions." status="Planned" accent="white" onClick={() => setNotice("AI Career Assistant is planned for a later product phase. Your Career Profile is already being structured so it can use this context when we build it.")} />
              </div>
            </section>

            <section className="mt-9 grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
              <div className="workspace-card rounded-[28px] border border-white/[.065] bg-white/[.02] p-6">
                <div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[.18em] text-white/22">Latest intelligence</p><h2 className="mt-2 text-xl font-semibold tracking-[-.035em]">What CareerUp can see now</h2></div><span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[.06] bg-white/[.025] text-white/34"><Icon name="target" size={17}/></span></div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/[.055] bg-black/10 p-5">
                    <div className="flex items-center justify-between"><p className="text-[9px] uppercase tracking-[.16em] text-[#efd080]/65">Resume signal</p><span className="text-xs font-medium text-white/45">{resumeScore === null ? "Not analyzed" : `${resumeScore}/100`}</span></div>
                    {resumeAnalysis ? <><p className="mt-4 text-xs font-medium text-white/60">Strengths</p><div className="mt-3 space-y-2">{(resumeAnalysis.strengths || []).slice(0, 2).map((item) => <p key={item} className="flex gap-2 text-xs leading-5 text-white/31"><span className="mt-1 text-[#76d7c4]"><Icon name="check" size={12}/></span>{item}</p>)}</div><Link to="/resume-intelligence" className="mt-5 inline-flex items-center gap-2 text-xs text-white/36 transition hover:text-white">View full analysis <Icon name="arrow" size={13}/></Link></> : <><p className="mt-4 text-sm leading-6 text-white/30">{hasResume ? "Your PDF is connected. Run Resume Intelligence to turn it into structured evidence." : "Connect a PDF resume to unlock this layer."}</p>{hasResume ? <Link to="/resume-intelligence" className="mt-5 inline-flex items-center gap-2 text-xs text-[#efd080]">Analyze resume <Icon name="arrow" size={13}/></Link> : <button onClick={() => fileInputRef.current?.click()} className="mt-5 inline-flex items-center gap-2 text-xs text-[#efd080]">Upload resume <Icon name="upload" size={13}/></button>}</>}
                  </div>

                  <div className="rounded-2xl border border-white/[.055] bg-black/10 p-5">
                    <div className="flex items-center justify-between"><p className="text-[9px] uppercase tracking-[.16em] text-[#a79dff]/70">Career signal</p><span className="text-xs font-medium text-white/45">{careerScore === null ? "Not generated" : `${careerScore}%`}</span></div>
                    {careerIntelligence ? <><p className="mt-4 text-sm font-medium text-white/62">{careerIntelligence.primaryRole || user.careerGoal}</p><p className="mt-2 text-xs leading-5 text-white/28">{primaryMatch?.missingSkills?.length ? `Priority gaps: ${primaryMatch.missingSkills.slice(0, 3).join(", ")}.` : "Your core tracked skills are strongly aligned with this direction."}</p><Link to="/career-intelligence" className="mt-5 inline-flex items-center gap-2 text-xs text-white/36 transition hover:text-white">Review matches <Icon name="arrow" size={13}/></Link></> : <><p className="mt-4 text-sm leading-6 text-white/30">Generate role matches from your saved profile and latest available resume evidence.</p><Link to="/career-intelligence" className="mt-5 inline-flex items-center gap-2 text-xs text-[#a79dff]">Generate intelligence <Icon name="arrow" size={13}/></Link></>}
                  </div>
                </div>
              </div>

              <div className="workspace-card rounded-[28px] border border-white/[.065] bg-white/[.02] p-6">
                <div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[.18em] text-white/22">Career Profile</p><h2 className="mt-2 text-xl font-semibold tracking-[-.035em]">Your shared context</h2></div><button onClick={() => setShowProfile(true)} className="rounded-xl border border-white/[.06] bg-white/[.02] px-3 py-2 text-[10px] text-white/34 transition hover:text-white">Edit</button></div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2"><div><p className="text-[9px] uppercase tracking-[.15em] text-white/19">Target role</p><p className="mt-2 text-sm text-white/58">{user.careerGoal}</p></div><div><p className="text-[9px] uppercase tracking-[.15em] text-white/19">Education</p><p className="mt-2 text-sm text-white/58">{user.education}</p></div></div>
                <div className="mt-6"><p className="text-[9px] uppercase tracking-[.15em] text-white/19">Skills</p><div className="mt-3 flex flex-wrap gap-2">{skills.slice(0, 8).map((skill) => <span key={skill} className="rounded-full border border-white/[.06] bg-white/[.02] px-3 py-1.5 text-[10px] text-white/38">{skill}</span>)}</div></div>
                <div className="mt-6"><p className="text-[9px] uppercase tracking-[.15em] text-white/19">Interests</p><p className="mt-2 text-xs leading-5 text-white/34">{interests.slice(0, 5).join(" · ")}</p></div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload}/>
      {uploading && <div className="workspace-toast fixed bottom-5 right-5 z-[70] rounded-2xl border border-white/[.08] bg-[#0b0e17]/95 px-5 py-4 text-sm text-white/55 shadow-2xl backdrop-blur-xl">Connecting resume…</div>}

      {showProfile && <div className="fixed inset-0 z-[80] flex justify-end bg-black/65 backdrop-blur-sm"><button aria-label="Close profile editor" onClick={() => setShowProfile(false)} className="absolute inset-0"/><aside className="workspace-drawer relative z-10 h-full w-full max-w-[570px] overflow-y-auto border-l border-white/[.075] bg-[#090c14] p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-5"><div><p className="text-[9px] uppercase tracking-[.19em] text-[#d9b45a]/70">Career Profile</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.04em]">Edit your shared career context.</h2><p className="mt-3 text-sm leading-6 text-white/32">Changing these fields updates the context used by Career Intelligence. Your resume analysis remains available until you run a new one.</p></div><button onClick={() => setShowProfile(false)} className="rounded-xl border border-white/[.065] p-2 text-white/30 transition hover:text-white"><Icon name="x"/></button></div>
        <form onSubmit={handleSaveProfile} className="mt-8 space-y-5">
          <label className="block"><span className="mb-2 block text-xs font-medium text-white/45">Full name</span><input className="workspace-input rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/18" value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} required /></label>
          <label className="block"><span className="mb-2 block text-xs font-medium text-white/45">Education</span><input className="workspace-input rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/18" value={profile.education} onChange={(event) => setProfile({ ...profile, education: event.target.value })} placeholder="e.g. BCA, Computer Applications" required /></label>
          <label className="block"><span className="mb-2 block text-xs font-medium text-white/45">Target role</span><input className="workspace-input rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/18" value={profile.careerGoal} onChange={(event) => setProfile({ ...profile, careerGoal: event.target.value })} placeholder="e.g. Full Stack Developer" required /></label>
          <label className="block"><span className="mb-2 block text-xs font-medium text-white/45">Skills</span><textarea rows="4" className="workspace-input rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/18" value={profile.skills} onChange={(event) => setProfile({ ...profile, skills: event.target.value })} placeholder="React, Node.js, Python, MongoDB" required/><span className="mt-2 block text-[10px] text-white/20">Separate skills with commas.</span></label>
          <label className="block"><span className="mb-2 block text-xs font-medium text-white/45">Career interests</span><textarea rows="4" className="workspace-input rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/18" value={profile.interests} onChange={(event) => setProfile({ ...profile, interests: event.target.value })} placeholder="AI, backend development, product engineering" required/><span className="mt-2 block text-[10px] text-white/20">Separate interests with commas.</span></label>
          <div className="flex flex-col-reverse gap-3 border-t border-white/[.055] pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={() => setShowProfile(false)} className="rounded-xl border border-white/[.075] px-5 py-3 text-sm text-white/38 transition hover:text-white">Cancel</button><button disabled={saving} className="rounded-xl bg-[#f0d481] px-6 py-3 text-sm font-semibold text-[#11131a] transition hover:bg-[#f5dc92] disabled:opacity-50">{saving ? "Saving…" : "Save Career Profile"}</button></div>
        </form>
      </aside></div>}
    </div>
  );
}
