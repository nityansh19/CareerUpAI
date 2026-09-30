import { readPractice, savePractice } from "./browserStorage";
import { useEffect, useRef, useState } from "react";
// Changed: track serialized interview saves and unsaved changes.
import { Link, useNavigate } from "react-router-dom";
import { clearStoredUser, getStoredUser, storeUser } from "../auth/session";
import { api } from "../cloud/api";
// Changed: use the online workspace API instead of recalculating demo reports.
import { DemoBanner, EmptyState, Icon, PageHeader } from "./WorkspaceShell";

// Changed: removed the device-specific job reader; account data now arrives from MongoDB.

export function SkillsPage() {
  const user = getStoredUser() || {};
  const skills = Array.isArray(user.skills) ? user.skills : [];
  const match = user.careerIntelligence?.matches?.[0];
  const gaps = match?.missingSkills || [];
  return <>
    {user.isLocalDemo && <DemoBanner/>}
    <PageHeader eyebrow="GROW / SKILLS" title="Skills" description="Know what you have and choose the next skill to build." action={<Link className="ws-btn ws-btn-primary" to="/profile">Update skills <Icon name="arrow" size={15}/></Link>}/>
    <div className="ws-grid-two"><section className="ws-card ws-panel"><p className="ws-section-kicker">YOUR PROFILE</p><h2 style={{marginTop:9}}>{skills.length} skills on your profile</h2><p>Keep this list current so your career matches have better context.</p><div className="ws-tag-list" style={{marginTop:16}}>{skills.length ? skills.map((skill) => <span key={skill} className="ws-tag">{skill}</span>) : <span className="ws-muted">No skills added yet.</span>}</div></section><section className="ws-card ws-panel"><p className="ws-section-kicker">TARGET ROLE</p><h2 style={{marginTop:9}}>{match?.role || user.careerGoal || "Choose a direction"}</h2><p>{match ? `${match.readinessScore}% match from your latest Career AI results.` : "Generate career matches to see focused skill gaps."}</p><Link className="ws-btn" style={{marginTop:17}} to="/career-intelligence">{match ? "Review career match" : "Explore career paths"} <Icon name="arrow" size={14}/></Link></section></div>
    <div className="ws-section-head"><h2>Suggested learning path</h2><p>Based on your current top career match</p></div>
    {gaps.length ? <div className="ws-card ws-panel">{gaps.slice(0, 4).map((gap, index) => <div className="ws-row" key={gap}><div style={{display:"flex",gap:13,alignItems:"center"}}><span className="ws-action-icon" style={{width:29,height:29,display:"grid",placeItems:"center",borderRadius:8,background:"#29263c",color:"#b1a5ff",fontSize:11}}>0{index+1}</span><div><strong>{gap}</strong><div><small>{index === 0 ? "Start here · build one practical example" : "Next · add a project or proof"}</small></div></div></div><Link to="/profile" className="ws-btn">Add when learned</Link></div>)}</div> : <EmptyState icon="layers" title={match ? "No priority gaps in this match" : "Your roadmap starts with a career match"} description={match ? "Keep strengthening your project evidence and update your skills as you learn." : "Career AI compares your profile with role requirements, then shows which skills to focus on."} action={<Link className="ws-btn ws-btn-primary" to="/career-intelligence">Explore careers <Icon name="arrow" size={15}/></Link>}/>}
  </>;
}

export function ProfilePage() {
  const [user, setUser] = useState(() => getStoredUser() || {});
  const [form, setForm] = useState({ fullName:user.name || "", education:user.education || "", careerGoal:user.careerGoal || "", skills:(user.skills || []).join(", "), interests:(user.careerInterests || []).join(", ") });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const parse = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      const { user: next } = await api("/profile", { method: "PUT", body: {
        name: form.fullName.trim(), education: form.education.trim(), careerGoal: form.careerGoal.trim(),
        skills: parse(form.skills), careerInterests: parse(form.interests), version: user.profileVersion,
      } });
      storeUser(next); setUser(next);
      setMessage("Profile saved online. Generate new reports to use your updated details.");
      // Changed: save the profile atomically online and invalidate reports that used the previous profile.
    } catch (error) { setMessage(error.message || "Unable to save your profile."); }
    finally { setSaving(false); }
  };
  return <>
    {user.isLocalDemo && <DemoBanner/>}
    <PageHeader eyebrow="YOUR CONTEXT" title="Profile" description="These details shape your resume analysis and career recommendations."/>
    {message && <p className="ws-message" role="status">{message}</p>}
    <form onSubmit={save} className="ws-card ws-panel" style={{maxWidth:800}}><div className="ws-form-grid"><label className="ws-field">Full name<input required value={form.fullName} onChange={(event) => setForm({...form,fullName:event.target.value})}/></label><label className="ws-field">Education<input required value={form.education} onChange={(event) => setForm({...form,education:event.target.value})}/></label><label className="ws-field ws-span-two">Target role<input required value={form.careerGoal} onChange={(event) => setForm({...form,careerGoal:event.target.value})} placeholder="e.g. Full Stack Developer"/></label><label className="ws-field ws-span-two">Skills <small style={{fontWeight:400,color:"#858d9f"}}>Separate with commas</small><textarea required rows={3} value={form.skills} onChange={(event) => setForm({...form,skills:event.target.value})} placeholder="React, Python, MongoDB"/></label><label className="ws-field ws-span-two">Career interests <small style={{fontWeight:400,color:"#858d9f"}}>Separate with commas</small><textarea required rows={3} value={form.interests} onChange={(event) => setForm({...form,interests:event.target.value})} placeholder="Web development, AI, backend"/></label></div><div style={{display:"flex",justifyContent:"flex-end",marginTop:20}}><button className="ws-btn ws-btn-primary" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button></div></form>
  </>;
}

const STAGES = ["Saved", "Applied", "Interview", "Offer", "Closed"];
export function JobsPage() {
  const user = getStoredUser() || {};
  const [jobs, setJobs] = useState(() => user.jobs || []);
  const version = useRef(user.jobsVersion);
  const saving = useRef(false);
  // Changed: initialize jobs from the cloud account and retain the revision of the displayed list.
  const [drawer, setDrawer] = useState(null);
  const [form, setForm] = useState({role:"",company:"",location:"",url:"",stage:"Saved"});
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const saveJobs = async (next) => {
    if (saving.current) return false;
    saving.current = true; setError("");
    try {
      const result = await api("/jobs", { method: "PUT", body: { jobs: next, version: version.current } });
      storeUser(result.user); version.current = result.user.jobsVersion; setJobs(result.user.jobs);
      return true;
    } catch (error) { setError(error.message); return false; }
    finally { saving.current = false; }
  };
  // Changed: confirm database saves before updating the list, preserving visible data on failure or conflicts.
  const addJob = async (event) => {
    event.preventDefault();
    if (form.url && !/^https?:[/][/]/i.test(form.url.trim())) { setError("Use an http or https job link."); return; }
    // Changed: reject unsafe URL schemes without throwing while validating user input.
    if (await saveJobs([{...form,url:form.url.trim(),id:crypto.randomUUID(),createdAt:new Date().toISOString()},...jobs])) {
      setForm({role:"",company:"",location:"",url:"",stage:"Saved"}); setDrawer(null);
    }
  };
  const updateStage = async (job, stage) => { if (await saveJobs(jobs.map((item) => item.id === job.id ? {...item,stage} : item))) setDrawer({...job,stage}); };
  const removeJob = async (job) => { if (await saveJobs(jobs.filter((item) => item.id !== job.id))) setDrawer(null); };
  // Changed: await create, status-change and delete operations and keep the editor open if a save fails.
  const visible = filter === "All" ? jobs : jobs.filter((job) => job.stage === filter);
  return <>
    {user.isLocalDemo && <DemoBanner/>}
    <PageHeader eyebrow="ACT / JOBS" title="Jobs" description="Keep opportunities and applications in one simple place." action={<button className="ws-btn ws-btn-primary" onClick={() => setDrawer("new")}><Icon name="plus" size={16}/> Add a job</button>}/>
    <div className="ws-demo-banner"><span className="ws-demo-dot"/><span>Job discovery is in development. Saved job links and application stages are available across your devices.</span></div>
    {/* Changed: explain shared job storage and surface errors for edits as well as new jobs. */}
    {error && <p className="ws-message" role="alert">{error}</p>}
    <div className="ws-tabs" role="tablist" aria-label="Application stage">{["All",...STAGES].map((stage) => <button role="tab" aria-selected={filter === stage} className={filter === stage ? "active" : ""} key={stage} onClick={() => setFilter(stage)}>{stage}{stage === "All" ? ` (${jobs.length})` : ""}</button>)}</div>
    {visible.length ? <div className="ws-card ws-panel">{visible.map((job) => <button key={job.id} className="ws-row" style={{width:"100%",borderLeft:0,borderRight:0,borderBottom:0,background:"transparent",color:"#f0f1f8",textAlign:"left"}} onClick={() => setDrawer(job)}><div><strong>{job.role}</strong><div><small>{job.company}{job.location ? ` · ${job.location}` : ""}</small></div></div><span className="ws-tag">{job.stage}</span></button>)}</div> : <EmptyState icon="briefcase" title={filter === "All" ? "No jobs saved yet" : `No ${filter.toLowerCase()} jobs yet`} description="Save roles you’re interested in and keep track of where each application stands." action={<button className="ws-btn ws-btn-primary" onClick={() => setDrawer("new")}>Add your first job <Icon name="plus" size={15}/></button>}/>}
    {drawer && <div className="ws-drawer-backdrop" onClick={() => setDrawer(null)}><aside className="ws-drawer" role="dialog" aria-modal="true" aria-label={drawer === "new" ? "Add a job" : "Job details"} onClick={(event) => event.stopPropagation()}><div className="ws-drawer-top"><div><p className="ws-eyebrow">JOB TRACKER</p><h2>{drawer === "new" ? "Add an opportunity" : drawer.role}</h2></div><button className="ws-icon-button" onClick={() => setDrawer(null)} aria-label="Close job details"><Icon name="close"/></button></div>{drawer === "new" ? <form onSubmit={addJob} style={{display:"grid",gap:16,marginTop:24}}>{error && <p className="ws-message" role="alert">{error}</p>}<label className="ws-field">Position<input required value={form.role} onChange={(event) => setForm({...form,role:event.target.value})} placeholder="Frontend Developer"/></label><label className="ws-field">Company<input required value={form.company} onChange={(event) => setForm({...form,company:event.target.value})} placeholder="Company name"/></label><label className="ws-field">Location<input value={form.location} onChange={(event) => setForm({...form,location:event.target.value})} placeholder="Remote or city"/></label><label className="ws-field">Job link<input type="url" value={form.url} onChange={(event) => setForm({...form,url:event.target.value})} placeholder="https://…"/></label><label className="ws-field">Status<select value={form.stage} onChange={(event) => setForm({...form,stage:event.target.value})}>{STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select></label><button className="ws-btn ws-btn-primary">Save job</button></form> : <div style={{marginTop:24}}><p>{drawer.company}{drawer.location ? ` · ${drawer.location}` : ""}</p><label className="ws-field" style={{marginTop:20}}>Application status<select value={drawer.stage} onChange={(event) => updateStage(drawer,event.target.value)}>{STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select></label><div style={{display:"flex",gap:9,marginTop:20}}>{drawer.url && <a className="ws-btn ws-btn-primary" href={drawer.url} target="_blank" rel="noreferrer">Open job <Icon name="arrow" size={14}/></a>}<button className="ws-btn" onClick={() => removeJob(drawer)}>Remove</button></div></div>}</aside></div>}
  </>;
}

const QUESTIONS = {
  Foundations: {
    Technical: ["What does your favorite project do?", "How do you find the cause of a bug?", "What is one tool you learned recently?"],
    Behavioral: ["Why are you interested in this role?", "Tell me about a time you helped someone.", "How do you respond to feedback?"],
    Mixed: ["Introduce yourself and your career goal.", "Explain one project you built.", "Tell me about a challenge you solved."],
  },
  Standard: {
    Technical: ["Tell me about a project you built and the problem it solves.", "How would you debug a feature that works locally but fails after deployment?", "Explain a technical tradeoff you made and why."],
    Behavioral: ["Tell me about a time you learned a new skill quickly.", "Describe a disagreement in a team and how you handled it.", "What feedback changed how you work?"],
    Mixed: ["Walk me through a project relevant to this role.", "How do you investigate an unexpected production issue?", "Tell me about a challenge you overcame while collaborating."],
  },
  Advanced: {
    Technical: ["How would you design and scale a feature for unpredictable traffic?", "Describe a production incident and how you would diagnose it end to end.", "Defend a major architecture tradeoff you would make for this role."],
    Behavioral: ["Describe a time you influenced a decision without formal authority.", "How would you handle a team deadline when the original plan is no longer realistic?", "Tell me about a decision you made with incomplete information."],
    Mixed: ["Explain a difficult design choice in your strongest project.", "How would you lead the response to a critical production failure?", "Describe a time you changed a team's direction using evidence."],
  },
};
export function InterviewPage() {
  const user = getStoredUser() || {};
  const [practice, setPractice] = useState(() => readPractice(user.id) || {
    role: user.careerGoal || "Software Developer", type: "Mixed", difficulty: "Standard",
    started: false, step: 0, answer: "", answers: [],
  });
  const { role, type, difficulty, started, step, answer, answers } = practice;
  const [storageMessage, setStorageMessage] = useState("");
  const latest = useRef(practice);
  const practiceVersion = useRef(user.interviewVersion);
  // Added: retain the revision of the displayed interview draft for conflict detection.
  const queue = useRef(Promise.resolve());
  const pending = useRef(0);
  const failed = useRef(false);
  useEffect(() => {
    const warn = (event) => { if (pending.current || failed.current) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  // Added: warn before closing the tab while interview notes have not reached the server.
  const updatePractice = (patch) => {
    const next = { ...latest.current, ...patch };
    latest.current = next; setPractice(next); pending.current += 1; setStorageMessage("Saving online…");
    queue.current = queue.current.catch(() => {}).then(async () => {
      try { practiceVersion.current = await savePractice(user.id, next, practiceVersion.current); failed.current = false; }
      // Changed: advance the revision only after this draft is successfully saved.
      catch (error) { failed.current = true; setStorageMessage(error.message); }
      finally { pending.current -= 1; if (!pending.current && !failed.current) setStorageMessage("Saved online."); }
    });
  };
  // Changed: serialize online interview saves so fast typing cannot reorder notes or lose the last confirmed revision.
  const questions = QUESTIONS[difficulty][type];
  const next = () => updatePractice({ answers: [...answers, answer.trim()], answer: "", step: step + 1 });
  return <>
    {user.isLocalDemo && <DemoBanner/>}
    <PageHeader eyebrow="PREPARE / INTERVIEW" title="Interview practice" description="Build confidence through a short, focused practice session."/>
    <div className="ws-demo-banner"><span className="ws-demo-dot"/><span>Your progress and notes are saved online. Wait for “Saved online” before leaving. This is guided practice with fixed prompts; automated AI feedback is not available yet.</span></div>
    {/* Changed: show online save semantics and preserve the guided-practice limitation. */}
    {storageMessage && <p className="ws-message" role="alert">{storageMessage}</p>}
    {!started ? <div className="ws-card ws-panel" style={{maxWidth:660}}><h2>Set up your session</h2><p>Three questions, one at a time. Choose a role and the kind of practice you need.</p><div className="ws-form-grid" style={{marginTop:18}}><label className="ws-field ws-span-two">Role<input value={role} onChange={(event) => updatePractice({ role: event.target.value })}/></label><label className="ws-field">Interview type<select value={type} onChange={(event) => updatePractice({ type: event.target.value })}>{Object.keys(QUESTIONS.Standard).map((item) => <option key={item}>{item}</option>)}</select></label><label className="ws-field">Difficulty<select value={difficulty} onChange={(event) => updatePractice({ difficulty: event.target.value })}><option>Foundations</option><option>Standard</option><option>Advanced</option></select></label></div><button className="ws-btn ws-btn-primary" style={{marginTop:20}} onClick={() => updatePractice({ started: true, step: 0, answers: [], answer: "" })}>Start practice <Icon name="arrow" size={15}/></button></div> : step < questions.length ? <div className="ws-card ws-panel" style={{maxWidth:760}}><p className="ws-section-kicker">QUESTION {step+1} OF {questions.length} · {role || "YOUR ROLE"} · {difficulty.toUpperCase()}</p><h2 style={{fontSize:20,marginTop:17}}>{questions[step]}</h2><p>Write a few notes or answer out loud. Move on when you are ready.</p><label className="ws-field" style={{marginTop:23}}>Your notes<textarea aria-label="Your notes" value={answer} onChange={(event) => updatePractice({ answer: event.target.value })} rows={6} placeholder="Outline your answer here (optional)"/></label><button className="ws-btn ws-btn-primary" style={{marginTop:18}} onClick={next}>{step === questions.length-1 ? "Finish practice" : "Next question"} <Icon name="arrow" size={15}/></button></div> : <div className="ws-card ws-panel" style={{maxWidth:760}}><p className="ws-section-kicker">SESSION COMPLETE</p><h2 style={{fontSize:20,marginTop:10}}>You completed 3 questions</h2><p>Review your notes and refine one answer before your next session. No automated performance score was calculated.</p><div className="ws-list">{questions.map((question,index) => <div className="ws-row" key={question}><div><strong>{question}</strong><p style={{margin:"5px 0 0"}}>{answers[index] || "No written notes"}</p></div></div>)}</div><div style={{display:"flex",gap:9,marginTop:18}}><button className="ws-btn ws-btn-primary" onClick={() => updatePractice({ step: 0, answers: [], answer: "" })}>Try again</button><button className="ws-btn" onClick={() => updatePractice({ started: false })}>Change setup</button></div></div>}
    {/* Changed: give prefilled interview notes a stable accessible name on every device. */}
  </>;
}

export function SettingsPage() {
  const user = getStoredUser() || {};
  const navigate = useNavigate();
  const logout = () => { clearStoredUser(); navigate("/",{replace:true}); };
  return <><PageHeader eyebrow="ACCOUNT" title="Settings" description="Your account and workspace details."/><div className="ws-card ws-panel" style={{maxWidth:640}}><div className="ws-row"><div><strong>Account</strong><div><small>{user.email}</small></div></div><Link className="ws-btn" to="/profile">Edit profile</Link></div><div className="ws-row"><div><strong>Data mode</strong><div><small>{"Saved online · reload to see changes from another device"}</small></div></div></div><div className="ws-row"><div><strong>Quick actions</strong><div><small>Press Ctrl / Cmd + K anywhere in the workspace</small></div></div></div><div className="ws-row"><div><strong>Session</strong><div><small>Sign out on this device</small></div></div><button onClick={logout} className="ws-btn"><Icon name="logout" size={15}/> Sign out</button></div></div></>;
  // Changed: report cloud storage and explain how to refresh changes from another device.
}
