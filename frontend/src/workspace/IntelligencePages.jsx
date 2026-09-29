import { readResume, saveResume } from "./browserStorage";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getStoredUser, storeUser } from "../auth/session";
import { buildDemoCareerIntelligence, buildDemoResumeAnalysis } from "../demoIntelligence";
import { DemoBanner, EmptyState, Icon, PageHeader } from "./WorkspaceShell";

function List({ items, empty }) {
  return items?.length ? <ul className="ws-list">{items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul> : <p className="ws-muted">{empty}</p>;
}

function ScoreBars({ analysis }) {
  const values = [["Structure", analysis.structureScore], ["Content", analysis.contentScore], ["Impact", analysis.impactScore], ["Role fit", analysis.roleAlignmentScore]];
  return <div className="ws-score-bars">{values.map(([label, value]) => <div key={label}><span>{label}</span><i><span style={{width:`${Math.max(0, Math.min(100, Number(value) || 0))}%`}}/></i><b>{value}</b></div>)}</div>;
}

export function ResumePage() {
  const inputRef = useRef(null);
  const uploadRef = useRef(null);
  const [user, setUser] = useState(() => getStoredUser() || {});
  const [tab, setTab] = useState("Overview");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const analysis = user.resumeAnalysis;
  const demo = user.isLocalDemo;
  const fileName = user.cvOriginalName || localStorage.getItem("careerup_cv_name") || "";

  const analyze = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") { setMessage("Choose a PDF resume to continue."); return; }
    setLoading(true); setMessage("");
    try {
      await saveResume(user.id, file);
      const base = { ...user, isLocalDemo: true, demoWorkspace: true, cvOriginalName: file.name, cvFile: `local-demo:${file.name}` };
      const resumeAnalysis = buildDemoResumeAnalysis(base, file.name);
      const next = { ...base, resumeAnalysis, careerIntelligence: buildDemoCareerIntelligence({ ...base, resumeAnalysis }) };
      setMessage("PDF saved on this device. The preview report uses your profile, not the PDF contents. No file was sent to a server.");
      localStorage.setItem("careerup_cv_name", next.cvOriginalName || file.name);
      storeUser(next); setUser(next); setTab("Overview");
    } catch (error) { setMessage(error.message || "Unable to analyze your resume."); }
    finally { setLoading(false); }
  };

  const connect = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") { setMessage("Choose a PDF resume to continue."); return; }
    setLoading(true); setMessage("");
    try {
      await saveResume(user.id, file);
      const next = {
        ...user,
        isLocalDemo: true,
        demoWorkspace: true,
        cvOriginalName: file.name,
        cvFile: `local-demo:${file.name}`,
        resumeAnalysis: null,
        careerIntelligence: null,
      };
      storeUser(next); setUser(next); setTab("Overview");
      localStorage.setItem("careerup_cv_name", file.name);
      setMessage("PDF saved in this browser. You can download it here on your next visit.");
    } catch (error) { setMessage(error.message || "Unable to connect your resume."); }
    finally { setLoading(false); }
  };

  const download = async () => {
    setMessage("");
    try {
      const file = await readResume(user.id);
      if (!file) throw new Error("This resume was not saved on this device. Choose the PDF again to save it.");
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url; link.download = file.name || "resume.pdf";
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { setMessage(error.message || "Unable to open the saved resume."); }
  };

  return <>
    {demo && <DemoBanner/>}
    <PageHeader eyebrow="PREPARE / RESUME" title="Resume" description="See what your resume communicates and improve one thing at a time." action={<button className="ws-btn ws-btn-primary" disabled={loading} onClick={() => inputRef.current?.click()}><Icon name="file" size={16}/>{loading ? "Analyzing…" : analysis ? "Analyze another PDF" : "Upload & analyze PDF"}</button>}/>
    {message && <p className="ws-message" role="status">{message}</p>}
    <div className="ws-card ws-panel ws-panel-header"><div><p className="ws-section-kicker">CURRENT RESUME</p><h2 style={{marginTop:8}}>{fileName || "No resume connected yet"}</h2><p>{"Local testing report stored in this browser"}</p><button type="button" disabled={loading} onClick={() => uploadRef.current?.click()} style={{border:0,background:"none",padding:0,marginTop:7,fontSize:11,color:"#b6aaff"}}>Connect a PDF locally without analysis</button>{fileName && <button type="button" className="ws-btn" disabled={loading} onClick={download} style={{marginTop:12}}>Download saved PDF</button>}</div>{analysis && <div className="ws-score">{analysis.overallScore}<small>/ 100</small></div>}</div>
    {!analysis ? <div style={{marginTop:16}}><EmptyState icon="file" title="Start with your resume" description="Upload a text based PDF to see structure, skill coverage, and targeted suggestions. Scanned image PDFs may not contain readable text." action={<button className="ws-btn ws-btn-primary" onClick={() => inputRef.current?.click()}>Choose PDF <Icon name="arrow" size={15}/></button>}/></div> : <>
      <div className="ws-tabs" role="tablist" aria-label="Resume report">{["Overview", "Suggestions", "Details"].map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>
      {tab === "Overview" && <div className="ws-grid-two"><section className="ws-card ws-panel"><h2>Resume strength</h2><p>A quick view of the latest analysis.</p><ScoreBars analysis={analysis}/></section><section className="ws-card ws-panel"><h2>Your next improvement</h2><p>Start with the first recommendation, then work through the rest.</p><List items={(analysis.recommendations || []).slice(0, 2)} empty="No recommendations yet."/><button className="ws-btn" style={{marginTop:14}} onClick={() => setTab("Suggestions")}>View all suggestions <Icon name="arrow" size={14}/></button></section></div>}
      {tab === "Suggestions" && <div className="ws-grid-two"><section className="ws-card ws-panel"><h2>Improvements</h2><List items={analysis.recommendations} empty="No suggestions yet."/></section><section className="ws-card ws-panel"><h2>Gaps to address</h2><List items={analysis.gaps} empty="No gaps detected in this report."/></section></div>}
      {tab === "Details" && <div className="ws-grid-two"><section className="ws-card ws-panel"><h2>What’s working</h2><List items={analysis.strengths} empty="No strengths listed yet."/><div className="ws-details"><p>Analyzed for {analysis.targetRole || user.careerGoal || "your target role"}</p></div></section><section className="ws-card ws-panel"><h2>Detected skills</h2><p>Skills found in the resume analysis.</p><div className="ws-tag-list" style={{marginTop:15}}>{analysis.detectedSkills?.length ? analysis.detectedSkills.map((skill) => <span className="ws-tag" key={skill}>{skill}</span>) : <span className="ws-muted">No recognized skills detected.</span>}</div></section></div>}
    </>}
    <input ref={inputRef} className="sr-only" type="file" accept="application/pdf" onChange={(event) => { const file = event.target.files?.[0]; if (file) analyze(file); event.target.value = ""; }}/>
    <input ref={uploadRef} className="sr-only" type="file" accept="application/pdf" onChange={(event) => { const file = event.target.files?.[0]; if (file) connect(file); event.target.value = ""; }}/>
  </>;
}

export function CareerPage() {
  const [user, setUser] = useState(() => getStoredUser() || {});
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const intelligence = user.careerIntelligence;
  const matches = intelligence?.matches || [];
  const active = matches[selected] || matches[0];
  const demo = user.isLocalDemo;

  const generate = async () => {
    setLoading(true); setMessage("");
    try {
      const next = {
        ...user,
        isLocalDemo: true,
        demoWorkspace: true,
        careerIntelligence: buildDemoCareerIntelligence(user),
      };
      setMessage("Career matches recalculated locally from your saved profile.");
      storeUser(next); setUser(next); setSelected(0);
    } catch (error) { setMessage(error.message || "Unable to generate career matches."); }
    finally { setLoading(false); }
  };

  return <>
    {demo && <DemoBanner/>}
    <PageHeader eyebrow="DISCOVER / CAREER AI" title="Career AI" description="Explore career paths that fit your skills, goals, and resume evidence." action={<button className="ws-btn ws-btn-primary" onClick={generate} disabled={loading}><Icon name="spark" size={16}/>{loading ? "Finding matches…" : intelligence ? "Refresh matches" : "Explore careers"}</button>}/>
    {message && <p className="ws-message" role="status">{message}</p>}
    {!intelligence ? <EmptyState icon="spark" title="Where do you want to go next?" description="Generate role matches from your saved profile. Adding a resume first can give CareerUp more context." action={<button onClick={generate} disabled={loading} className="ws-btn ws-btn-primary">Explore careers <Icon name="arrow" size={15}/></button>}/> : <>
      <div className="ws-grid-two ws-career-grid">
        <section><p className="ws-section-kicker" style={{marginBottom:12}}>YOUR MATCHES</p><div className="ws-match-list">{matches.map((match, index) => <button className={`ws-match ${selected === index ? "active" : ""}`} key={`${match.role}-${index}`} onClick={() => setSelected(index)}><span>{match.role}</span><b>{match.readinessScore}%</b></button>)}</div></section>
        {active && <section className="ws-card ws-panel"><p className="ws-section-kicker">SELECTED PATH</p><div className="ws-panel-header" style={{marginTop:8}}><div><h2 style={{fontSize:22}}>{active.role}</h2><p>Readiness based on your current career profile.</p></div><div className="ws-score" style={{fontSize:28}}>{active.readinessScore}<small>%</small></div></div><div className="ws-grid-two" style={{marginTop:19,gap:20}}><div><p className="ws-section-kicker" style={{marginBottom:11}}>YOUR STRENGTHS</p><div className="ws-tag-list">{active.matchedSkills?.length ? active.matchedSkills.map((skill) => <span key={skill} className="ws-tag">{skill}</span>) : <span className="ws-muted">No direct matches yet.</span>}</div></div><div><p className="ws-section-kicker" style={{marginBottom:11}}>SKILLS TO IMPROVE</p><div className="ws-tag-list">{active.missingSkills?.length ? active.missingSkills.map((skill) => <span key={skill} className="ws-tag ws-tag-gap">{skill}</span>) : <span className="ws-muted">No core gaps found.</span>}</div></div></div><details className="ws-details"><summary>Why this career?</summary><List items={active.whyFit} empty="No explanation available."/></details><div className="ws-details"><p className="ws-section-kicker">YOUR NEXT MOVES</p><List items={(active.nextActions || []).slice(0, 3)} empty="Review your profile for your next step."/><Link className="ws-btn" to="/skills" style={{marginTop:14}}>View skill roadmap <Icon name="arrow" size={14}/></Link></div></section>}
      </div>
      <p className="ws-muted" style={{marginTop:18}}>Matches reflect the current profile. <Link to="/profile" style={{color:"#c2b7ff"}}>Update your skills and goal</Link> whenever they change.</p>
    </>}
  </>;
}
