import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../lib/api";
import { getStoredUser, storeUser } from "./session";
import "./AuthStyles.css";

const skillSuggestions = ["JavaScript", "React", "Node.js", "Python", "MongoDB", "SQL", "Git", "Docker"];
const interestSuggestions = ["Web development", "Backend development", "AI", "Machine learning", "Product engineering", "DevOps"];

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    back: <><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    spark: <><path d="m12 3-1.8 6.2L4 11l6.2 1.8L12 19l1.8-6.2L20 11l-6.2-1.8L12 3Z"/><path d="m19 17-.7 2.2L16 20l2.3.8L19 23l.8-2.2L22 20l-2.2-.8L19 17Z"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function splitValues(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function addValue(current, value) {
  const values = splitValues(current);
  if (values.some((item) => item.toLowerCase() === value.toLowerCase())) return current;
  return [...values, value].join(", ");
}

export default function Onboarding() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const user = useMemo(() => getStoredUser(), []);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [resume, setResume] = useState(null);
  const [form, setForm] = useState({
    fullName: user?.name || "",
    education: user?.education || "",
    careerGoal: user?.careerGoal || "",
    skills: Array.isArray(user?.skills) ? user.skills.join(", ") : "",
    interests: Array.isArray(user?.careerInterests) ? user.careerInterests.join(", ") : "",
  });

  const skills = splitValues(form.skills);
  const interests = splitValues(form.interests);
  const progress = ((step + 1) / 3) * 100;

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const validateStep = () => {
    if (step === 0 && (!form.fullName.trim() || !form.education.trim() || !form.careerGoal.trim())) {
      setMessage("Add your name, education and target role before continuing.");
      return false;
    }
    if (step === 1 && (!skills.length || !interests.length)) {
      setMessage("Add at least one skill and one career interest before continuing.");
      return false;
    }
    setMessage("");
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, 2));
  };

  const finish = async (skipResume = false) => {
    if (!user?.id) {
      setMessage("Your session is missing. Please sign in again.");
      return;
    }

    const resumeToUpload = skipResume ? null : resume;
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(apiUrl(`/api/users/profile/${user.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save your Career Profile.");

      let finalUser = data.user;
      storeUser(finalUser);

      if (resumeToUpload) {
        const uploadBody = new FormData();
        uploadBody.append("cv", resumeToUpload);
        const uploadResponse = await fetch(apiUrl(`/api/users/upload-cv/${user.id}`), { method: "POST", body: uploadBody });
        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadData.message || "Your profile was saved, but the resume upload failed.");
        finalUser = uploadData.user || { ...finalUser, cvOriginalName: uploadData.cv?.originalName || resumeToUpload.name, cvFile: uploadData.cv?.fileName };
        localStorage.setItem("careerup_cv_name", uploadData.cv?.originalName || resumeToUpload.name);
        storeUser(finalUser);
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message || "Unable to complete setup right now.");
    } finally {
      setSaving(false);
    }
  };

  const summaries = [
    { label: "Target", value: form.careerGoal || "Not set" },
    { label: "Skills", value: skills.length ? `${skills.length} added` : "None yet" },
    { label: "Resume", value: resume?.name || user?.cvOriginalName || "Optional" },
  ];

  return (
    <div className="min-h-screen bg-[#050711] px-4 py-5 text-white sm:px-6 sm:py-7">
      <div className="auth-noise pointer-events-none fixed inset-0" />
      <div className="auth-grid pointer-events-none fixed inset-0" />
      <div className="pointer-events-none fixed -left-36 top-[18%] h-[500px] w-[500px] rounded-full bg-[#7867ff]/10 blur-[160px]" />
      <div className="pointer-events-none fixed -right-36 bottom-[-120px] h-[500px] w-[500px] rounded-full bg-[#d9b45a]/[.075] blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <header className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d9b45a]/25 bg-[#d9b45a]/[.075] font-semibold text-[#efd080]">C</span><div><p className="text-sm font-semibold">CareerUp AI</p><p className="mt-1 text-[8px] uppercase tracking-[.22em] text-white/22">Workspace setup</p></div></div>
          <div className="text-right"><p className="text-[9px] uppercase tracking-[.18em] text-white/22">Setup progress</p><p className="mt-1 text-xs font-medium text-[#efd080]">{Math.round(progress)}%</p></div>
        </header>

        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[.055]"><div className="h-full rounded-full bg-gradient-to-r from-[#7867ff] via-[#d9b45a] to-[#76d7c4] transition-[width] duration-500" style={{ width: `${progress}%` }} /></div>

        <div className="onboarding-shell mt-6 grid overflow-hidden rounded-[32px] border border-white/[.075] bg-[#080b13]/76 backdrop-blur-2xl lg:grid-cols-[300px_1fr]">
          <aside className="border-b border-white/[.065] p-5 lg:min-h-[680px] lg:border-b-0 lg:border-r lg:p-7">
            <p className="text-[9px] uppercase tracking-[.2em] text-white/22">Build your context</p>
            <div className="mt-5 grid grid-cols-3 gap-2 lg:grid-cols-1">
              {["Direction", "Strengths", "Resume"].map((label, index) => (
                <button key={label} type="button" onClick={() => index < step && setStep(index)} className={`onboarding-step rounded-2xl border px-3 py-3 text-left ${index === step ? "is-active" : index < step ? "border-[#76d7c4]/12 bg-[#76d7c4]/[.035] text-white/55" : "border-white/[.055] bg-white/[.018] text-white/22"}`}>
                  <div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 text-[9px]">{index < step ? <Icon name="check" size={12} /> : `0${index + 1}`}</span><span className="text-[11px] font-medium">{label}</span></div>
                </button>
              ))}
            </div>

            <div className="mt-7 hidden rounded-2xl border border-white/[.06] bg-white/[.02] p-4 lg:block">
              <p className="text-[9px] uppercase tracking-[.18em] text-white/20">Setup snapshot</p>
              <div className="mt-4 space-y-4">{summaries.map((item) => <div key={item.label}><p className="text-[9px] uppercase tracking-[.14em] text-white/18">{item.label}</p><p className="mt-1.5 truncate text-xs text-white/50">{item.value}</p></div>)}</div>
            </div>
          </aside>

          <main className="p-6 sm:p-9 lg:p-12">
            {message && <div className="mb-6 rounded-2xl border border-rose-400/15 bg-rose-400/[.05] px-4 py-3 text-sm leading-6 text-rose-200/80">{message}</div>}

            {step === 0 && (
              <section className="onboarding-panel max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#d9b45a]/15 bg-[#d9b45a]/[.045] px-3 py-1.5 text-[9px] uppercase tracking-[.18em] text-[#efd080]/80"><Icon name="spark" size={13} /> Direction</div>
                <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-5xl">Where are you starting, and where do you want to go?</h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/36">CareerUp uses this as the foundation for role matching and future recommendations. You can change it later.</p>
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <label className="sm:col-span-2"><span className="mb-2 block text-xs font-medium text-white/46">Full name</span><input className="auth-input rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/18" value={form.fullName} onChange={(event) => setField("fullName", event.target.value)} placeholder="Your full name" /></label>
                  <label><span className="mb-2 block text-xs font-medium text-white/46">Education</span><input className="auth-input rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/18" value={form.education} onChange={(event) => setField("education", event.target.value)} placeholder="e.g. BCA, Computer Applications" /></label>
                  <label><span className="mb-2 block text-xs font-medium text-white/46">Target role</span><input className="auth-input rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/18" value={form.careerGoal} onChange={(event) => setField("careerGoal", event.target.value)} placeholder="e.g. Full Stack Developer" /></label>
                </div>
              </section>
            )}

            {step === 1 && (
              <section className="onboarding-panel max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#7867ff]/15 bg-[#7867ff]/[.05] px-3 py-1.5 text-[9px] uppercase tracking-[.18em] text-[#a79dff]">Your strengths</div>
                <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-5xl">Give CareerUp the signals that describe you today.</h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/36">Add the skills you can already use and the areas you genuinely want to explore. Comma-separated values work best.</p>

                <label className="mt-8 block"><span className="mb-2 block text-xs font-medium text-white/46">Skills</span><textarea rows="3" className="auth-input rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/18" value={form.skills} onChange={(event) => setField("skills", event.target.value)} placeholder="React, Node.js, Python, MongoDB" /></label>
                <div className="mt-3 flex flex-wrap gap-2">{skillSuggestions.map((item) => <button type="button" key={item} onClick={() => setField("skills", addValue(form.skills, item))} className="onboarding-chip rounded-full border border-white/[.06] bg-white/[.018] px-3 py-1.5 text-[10px] text-white/32">+ {item}</button>)}</div>

                <label className="mt-6 block"><span className="mb-2 block text-xs font-medium text-white/46">Career interests</span><textarea rows="3" className="auth-input rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/18" value={form.interests} onChange={(event) => setField("interests", event.target.value)} placeholder="AI, backend development, product engineering" /></label>
                <div className="mt-3 flex flex-wrap gap-2">{interestSuggestions.map((item) => <button type="button" key={item} onClick={() => setField("interests", addValue(form.interests, item))} className="onboarding-chip rounded-full border border-white/[.06] bg-white/[.018] px-3 py-1.5 text-[10px] text-white/32">+ {item}</button>)}</div>
              </section>
            )}

            {step === 2 && (
              <section className="onboarding-panel max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#76d7c4]/15 bg-[#76d7c4]/[.04] px-3 py-1.5 text-[9px] uppercase tracking-[.18em] text-[#8be5d3]">Final step · Optional</div>
                <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-5xl">Connect your resume now, or add it later.</h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/36">A PDF resume gives Resume Intelligence evidence to analyze. You can skip this step and still enter your workspace.</p>

                <button type="button" onClick={() => fileInputRef.current?.click()} className="onboarding-drop mt-8 flex w-full flex-col items-center rounded-[26px] border border-dashed border-white/[.1] px-6 py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[.07] bg-white/[.03] text-[#efd080]"><Icon name="upload" /></span>
                  <p className="mt-4 text-sm font-medium">{resume ? resume.name : user?.cvOriginalName || "Choose your PDF resume"}</p>
                  <p className="mt-2 text-xs text-white/25">PDF only · up to 5 MB</p>
                </button>
                <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; if (file.type !== "application/pdf") { setMessage("Please choose a PDF resume."); return; } setResume(file); setMessage(""); }} />

                <div className="mt-6 grid gap-3 sm:grid-cols-3">{summaries.map((item) => <div key={item.label} className="rounded-2xl border border-white/[.06] bg-white/[.02] p-4"><p className="text-[9px] uppercase tracking-[.15em] text-white/20">{item.label}</p><p className="mt-2 truncate text-xs text-white/52">{item.value}</p></div>)}</div>
              </section>
            )}

            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-white/[.055] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={() => step === 0 ? navigate("/") : setStep((current) => current - 1)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/[.075] px-5 py-3 text-sm text-white/42 transition hover:border-white/[.13] hover:text-white"><Icon name="back" size={16} />{step === 0 ? "Back to website" : "Back"}</button>
              {step < 2 ? <button type="button" onClick={next} className="auth-primary inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f0d481] px-6 py-3 text-sm font-semibold text-[#11131a] transition hover:-translate-y-0.5 hover:bg-[#f5dc92]"><span className="relative z-10 flex items-center gap-2">Continue <Icon name="arrow" size={16} /></span></button> : <div className="flex flex-col gap-2 sm:flex-row"><button type="button" disabled={saving} onClick={() => finish(true)} className="rounded-2xl border border-white/[.075] px-5 py-3 text-sm text-white/42 transition hover:text-white disabled:opacity-40">Skip resume</button><button type="button" disabled={saving} onClick={() => finish(false)} className="auth-primary rounded-2xl bg-[#f0d481] px-6 py-3 text-sm font-semibold text-[#11131a] transition hover:-translate-y-0.5 hover:bg-[#f5dc92] disabled:opacity-50"><span className="relative z-10">{saving ? "Building workspace…" : resume ? "Save & enter CareerUp" : "Enter CareerUp"}</span></button></div>}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
