import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../lib/api";

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" };
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
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function MetricCard({ label, value, note, accent = false }) {
  return (
    <div className="dash-card rounded-[24px] border border-white/[0.07] bg-white/[0.025] p-5">
      <p className="text-[10px] uppercase tracking-[.19em] text-white/28">{label}</p>
      <p className={`mt-3 text-3xl font-semibold tracking-[-.05em] ${accent ? "text-[#efd080]" : "text-white"}`}>{value}</p>
      <p className="mt-2 text-xs leading-5 text-white/32">{note}</p>
    </div>
  );
}

function ModuleCard({ icon, title, text, status, action, onClick }) {
  return (
    <button onClick={onClick} className="dash-card group w-full rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-5 text-left transition hover:-translate-y-1 hover:border-[#d9b45a]/20 hover:bg-white/[0.035]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-[#efd080]"><Icon name={icon} /></span>
        <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1 text-[9px] uppercase tracking-[.15em] text-white/32">{status}</span>
      </div>
      <h3 className="mt-7 text-lg font-semibold tracking-[-.025em]">{title}</h3>
      <p className="mt-3 min-h-[48px] text-sm leading-6 text-white/34">{text}</p>
      <div className="mt-6 flex items-center gap-2 text-xs font-medium text-white/48 transition group-hover:text-white">{action}<Icon name="arrow" size={15}/></div>
    </button>
  );
}

export default function Dashboard() {
  const fileInputRef = useRef(null);
  const savedUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  }, []);

  const [user, setUser] = useState(savedUser || {});
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
  const profileFields = [user.name, user.education, skills.length, user.careerInterests?.length, user.careerGoal];
  const completed = profileFields.filter(Boolean).length;
  const profileCompletion = Math.round((completed / profileFields.length) * 100);
  const hasResume = Boolean(user.cvOriginalName || user.cvFile || localStorage.getItem("careerup_cv_name"));
  const firstName = (user.name || "there").trim().split(" ")[0];

  const nextActions = [
    !user.education || !skills.length || !user.careerGoal ? { title: "Complete your Career Profile", text: "Add your education, skills, interests and target role so CareerUp has enough context to personalize your experience.", action: () => setShowProfile(true), cta: "Complete profile" } : null,
    !hasResume ? { title: "Upload your resume", text: "Add your current PDF resume to connect resume intelligence with your Career Profile.", action: () => fileInputRef.current?.click(), cta: "Upload resume" } : null,
    user.careerGoal && hasResume ? { title: "Prepare your first analysis", text: "Your profile foundation is ready. Resume analysis and role-readiness scoring are the next intelligence layer to connect.", action: () => {}, cta: "Coming next" } : null,
  ].filter(Boolean);

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    if (!user?.id) { setNotice("Please log in again before saving your profile."); return; }
    setSaving(true); setNotice("");
    try {
      const response = await fetch(apiUrl(`/api/users/profile/${user.id}`), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save profile");
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setShowProfile(false);
      setNotice("Career Profile updated successfully.");
    } catch (error) {
      setNotice(error.message || "Unable to connect to the server.");
    } finally { setSaving(false); }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { setNotice("Please choose a PDF resume."); return; }
    if (!user?.id) { setNotice("Please log in again before uploading a resume."); return; }
    setUploading(true); setNotice("");
    try {
      const form = new FormData(); form.append("cv", file);
      const response = await fetch(apiUrl(`/api/users/upload-cv/${user.id}`), { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Resume upload failed");
      localStorage.setItem("careerup_cv_name", data.cv?.originalName || file.name);
      setUser((current) => ({ ...current, cvOriginalName: data.cv?.originalName || file.name, cvFile: data.cv?.fileName }));
      setNotice("Resume uploaded successfully.");
    } catch (error) { setNotice(error.message || "Resume upload failed."); }
    finally { setUploading(false); event.target.value = ""; }
  };

  const handleLogout = () => { localStorage.removeItem("user"); localStorage.removeItem("careerup_cv_name"); window.location.href = "/"; };

  return (
    <div className="min-h-screen bg-[#060811] text-white">
      <style>{`
        body{background:#060811}.dashboard-grid{background-image:linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px);background-size:68px 68px;mask-image:linear-gradient(to bottom,black,transparent 88%)}
        .dash-card{box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}.profile-ring{background:conic-gradient(#d9b45a var(--completion),rgba(255,255,255,.06) 0)}
        .dash-input{background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);transition:.2s}.dash-input:focus{outline:none;border-color:rgba(217,180,90,.45);box-shadow:0 0 0 4px rgba(217,180,90,.08)}
        @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
      `}</style>
      <div className="pointer-events-none fixed inset-0"><div className="dashboard-grid absolute inset-0"/><div className="absolute right-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full bg-[#7867ff]/10 blur-[150px]"/><div className="absolute bottom-[-200px] left-[18%] h-[480px] w-[480px] rounded-full bg-[#d9b45a]/[0.06] blur-[150px]"/></div>

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-[250px] shrink-0 border-r border-white/[0.07] bg-[#080b13]/75 px-4 py-5 backdrop-blur-2xl lg:flex lg:flex-col">
          <Link to="/" className="flex items-center gap-3 px-2"><span className="flex h-10 w-10 items-center justify-center rounded-[13px] border border-[#d9b45a]/30 bg-[#d9b45a]/10 font-semibold text-[#efd080]">C</span><span><span className="block text-sm font-semibold">CareerUp AI</span><span className="block text-[8px] uppercase tracking-[.25em] text-white/25">Career workspace</span></span></Link>
          <nav className="mt-10 space-y-1.5">
            {[['home','Overview'],['user','Career Profile'],['file','Resume Intelligence'],['brain','Career Intelligence'],['route','Roadmap'],['spark','AI Assistant']].map(([icon,label],index)=><button key={label} onClick={index===1?()=>setShowProfile(true):undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${index===0?'bg-white/[0.06] text-white':'text-white/38 hover:bg-white/[0.035] hover:text-white'}`}><Icon name={icon}/>{label}{index>1&&<span className="ml-auto text-[8px] uppercase tracking-[.12em] text-white/18">Soon</span>}</button>)}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4"><p className="text-[9px] uppercase tracking-[.18em] text-white/25">Career Profile</p><div className="mt-3 flex items-center justify-between"><p className="text-sm font-medium">{profileCompletion}% complete</p><span className="text-xs text-[#efd080]">{completed}/5</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-[#7867ff] to-[#d9b45a]" style={{width:`${profileCompletion}%`}}/></div><button onClick={()=>setShowProfile(true)} className="mt-4 text-xs text-white/45 hover:text-white">Edit profile →</button></div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#060811]/75 backdrop-blur-2xl"><div className="flex h-[72px] items-center justify-between px-5 sm:px-7 lg:px-9"><div className="flex items-center gap-3"><button onClick={()=>setMobileNav(!mobileNav)} className="rounded-xl border border-white/[0.07] p-2.5 text-white/60 lg:hidden"><Icon name="menu"/></button><div><p className="text-sm font-semibold">Career Workspace</p><p className="text-[10px] text-white/25">Your profile, insights and next actions</p></div></div><div className="flex items-center gap-3"><Link to="/" className="hidden text-xs text-white/35 hover:text-white sm:block">View website</Link><button onClick={handleLogout} className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-2.5 text-xs text-white/48 hover:text-white"><Icon name="logout" size={15}/>Logout</button></div></div>{mobileNav&&<div className="border-t border-white/[0.06] px-5 py-4 lg:hidden"><div className="grid grid-cols-2 gap-2"><button onClick={()=>{setShowProfile(true);setMobileNav(false)}} className="rounded-xl bg-white/[0.04] px-3 py-3 text-left text-xs text-white/55">Career Profile</button><button onClick={()=>fileInputRef.current?.click()} className="rounded-xl bg-white/[0.04] px-3 py-3 text-left text-xs text-white/55">Upload Resume</button></div></div>}</header>

          <main className="mx-auto max-w-[1450px] px-5 pb-16 pt-8 sm:px-7 lg:px-9 lg:pt-10">
            {notice&&<div className="mb-6 flex items-center justify-between rounded-2xl border border-[#d9b45a]/15 bg-[#d9b45a]/[0.05] px-4 py-3 text-sm text-white/55"><span>{notice}</span><button onClick={()=>setNotice("")} className="text-white/35 hover:text-white"><Icon name="x" size={16}/></button></div>}

            <section className="grid gap-7 xl:grid-cols-[1fr_360px] xl:items-stretch">
              <div className="rounded-[30px] border border-white/[0.07] bg-white/[0.025] p-6 sm:p-8"><div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end"><div><div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[9px] uppercase tracking-[.16em] text-white/35"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300"/>Career workspace</div><h1 className="mt-5 text-4xl font-medium tracking-[-.05em] sm:text-5xl">Good to see you, {firstName}.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-white/36">CareerUp brings your profile, resume and career planning into one place. Complete the foundation first, then each intelligence module can build on the same context.</p></div><button onClick={()=>setShowProfile(true)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-[#080a11] transition hover:-translate-y-1">Update profile <Icon name="arrow" size={16}/></button></div>
                <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><MetricCard label="Profile" value={`${profileCompletion}%`} note="Career context completed" accent/><MetricCard label="Resume" value={hasResume?"Added":"Missing"} note={hasResume?(user.cvOriginalName||localStorage.getItem("careerup_cv_name")||"PDF connected"):"Upload a PDF to continue"}/><MetricCard label="Target role" value={user.careerGoal?"Set":"Not set"} note={user.careerGoal||"Add a career goal"}/><MetricCard label="Skills" value={skills.length||0} note={skills.length?"Skills in your profile":"Add your core skills"}/></div>
              </div>

              <div className="rounded-[30px] border border-white/[0.07] bg-[#0a0d16]/85 p-6"><div className="flex items-center justify-between"><p className="text-[10px] uppercase tracking-[.19em] text-white/28">Career Profile</p><span className="text-xs font-medium text-[#efd080]">{profileCompletion}%</span></div><div className="mt-7 flex items-center gap-5"><div className="profile-ring relative h-24 w-24 shrink-0 rounded-full" style={{'--completion':`${profileCompletion*3.6}deg`}}><div className="absolute inset-[7px] flex items-center justify-center rounded-full bg-[#090c14]"><span className="text-xl font-semibold">{profileCompletion}</span></div></div><div><p className="font-semibold">{profileCompletion===100?'Profile foundation ready':'Build your context'}</p><p className="mt-2 text-xs leading-5 text-white/32">CareerUp uses this information as the shared context behind future analysis and recommendations.</p></div></div><div className="mt-7 space-y-3">{[['Identity',user.name],['Education',user.education],['Skills',skills.length],['Goal',user.careerGoal]].map(([label,value])=><div key={label} className="flex items-center justify-between text-xs"><span className="text-white/30">{label}</span><span className={value?'text-emerald-300':'text-white/22'}>{value?'Complete':'Missing'}</span></div>)}</div></div>
            </section>

            <section className="mt-8"><div className="mb-4 flex items-end justify-between"><div><p className="text-[10px] uppercase tracking-[.2em] text-[#d9b45a]">Intelligence modules</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.035em]">Everything starts from one profile.</h2></div></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><ModuleCard icon="file" title="Resume Intelligence" text="Upload and understand your resume, then connect its strengths and gaps to the roles you want." status={hasResume?"Resume added":"Setup"} action={hasResume?"Resume connected":"Upload resume"} onClick={()=>fileInputRef.current?.click()}/><ModuleCard icon="brain" title="Career Intelligence" text="Match your background to realistic career paths and understand the evidence behind each direction." status={profileCompletion===100?"Profile ready":"Needs profile"} action="Prepare profile" onClick={()=>setShowProfile(true)}/><ModuleCard icon="route" title="Personal Roadmap" text="Turn your target role into skill priorities, projects and milestones based on your current position." status="Next phase" action="Foundation first" onClick={()=>setShowProfile(true)}/><ModuleCard icon="spark" title="AI Career Assistant" text="A context-aware assistant that will use your profile, resume and roadmap instead of giving generic advice." status="Next phase" action="Build context" onClick={()=>setShowProfile(true)}/></div></section>

            <section className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
              <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.02] p-6"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.19em] text-white/25">Next actions</p><h2 className="mt-2 text-xl font-semibold">Move your profile forward</h2></div><span className="rounded-full bg-white/[0.035] px-3 py-1 text-[9px] uppercase tracking-[.15em] text-white/25">{nextActions.length} actions</span></div><div className="mt-6 space-y-3">{nextActions.map((item,index)=><button key={item.title} onClick={item.action} className="group flex w-full items-center gap-4 rounded-2xl border border-white/[0.06] bg-black/10 p-4 text-left transition hover:bg-white/[0.025]"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.035] text-[10px] text-[#efd080]">0{index+1}</span><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{item.title}</span><span className="mt-1 block text-xs leading-5 text-white/28">{item.text}</span></span><span className="hidden text-xs text-white/30 group-hover:text-white sm:block">{item.cta} →</span></button>)}{nextActions.length===0&&<div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.035] p-5 text-sm text-emerald-200">Your Career Profile foundation is complete. You are ready for the intelligence layer.</div>}</div></div>

              <div className="rounded-[28px] border border-white/[0.07] bg-white/[0.02] p-6"><p className="text-[10px] uppercase tracking-[.19em] text-white/25">Profile snapshot</p><h2 className="mt-2 text-xl font-semibold">What CareerUp knows</h2><div className="mt-6 space-y-5"><div><p className="text-[10px] uppercase tracking-[.15em] text-white/22">Target role</p><p className="mt-2 text-sm text-white/62">{user.careerGoal||"Not set yet"}</p></div><div><p className="text-[10px] uppercase tracking-[.15em] text-white/22">Education</p><p className="mt-2 text-sm text-white/62">{user.education||"Not added yet"}</p></div><div><p className="text-[10px] uppercase tracking-[.15em] text-white/22">Skills</p><div className="mt-3 flex flex-wrap gap-2">{skills.length?skills.slice(0,8).map(skill=><span key={skill} className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/45">{skill}</span>):<span className="text-xs text-white/25">No skills added yet.</span>}</div></div></div></div>
            </section>
          </main>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload}/>
      {uploading&&<div className="fixed bottom-5 right-5 z-50 rounded-2xl border border-white/[0.08] bg-[#0b0e17]/95 px-5 py-4 text-sm text-white/60 shadow-2xl backdrop-blur-xl">Uploading resume…</div>}

      {showProfile&&<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[30px] border border-white/[0.08] bg-[#0b0e17] p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.2em] text-[#d9b45a]">Career Profile</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.035em]">Give CareerUp the context it needs.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/34">Your profile connects your background and career goal. Future resume analysis, role matching and roadmaps will build on this same information.</p></div><button onClick={()=>setShowProfile(false)} className="rounded-xl border border-white/[0.07] p-2 text-white/35 hover:text-white"><Icon name="x"/></button></div><form onSubmit={handleSaveProfile} className="mt-7 space-y-5">{[['fullName','Full name','text','Your full name'],['education','Education','text','e.g. BCA, Computer Applications'],['careerGoal','Target role / career goal','text','e.g. Full Stack Developer']].map(([name,label,type,placeholder])=><label key={name} className="block"><span className="mb-2 block text-xs font-medium text-white/48">{label}</span><input className="dash-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/18" name={name} type={type} placeholder={placeholder} value={profile[name]} onChange={e=>setProfile({...profile,[name]:e.target.value})} required/></label>)}<label className="block"><span className="mb-2 block text-xs font-medium text-white/48">Skills</span><textarea className="dash-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/18" rows="3" name="skills" placeholder="React, Node.js, Python, MongoDB" value={profile.skills} onChange={e=>setProfile({...profile,skills:e.target.value})} required/><span className="mt-1.5 block text-[10px] text-white/20">Separate skills with commas.</span></label><label className="block"><span className="mb-2 block text-xs font-medium text-white/48">Career interests</span><textarea className="dash-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/18" rows="3" name="interests" placeholder="AI, backend development, product engineering" value={profile.interests} onChange={e=>setProfile({...profile,interests:e.target.value})} required/><span className="mt-1.5 block text-[10px] text-white/20">Separate interests with commas.</span></label><div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={()=>setShowProfile(false)} className="rounded-xl border border-white/[0.08] px-5 py-3 text-sm text-white/45 hover:text-white">Cancel</button><button disabled={saving} type="submit" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#080a11] disabled:opacity-50">{saving?'Saving…':'Save Career Profile'}</button></div></form></div></div>}
    </div>
  );
}
