import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Arrow,
  ChartIcon,
  CheckIcon,
  CompassIcon,
  FeatureCard,
  Spark,
  TiltCard,
  systemCards,
} from "./LandingUI";

const productTabs = [
  {
    key: "resume",
    label: "Resume intelligence",
    eyebrow: "01 · Diagnose",
    title: "See what recruiters and ATS systems actually see.",
    text: "CareerUp turns your resume into structured signals: strengths, weak evidence, missing skills and role alignment—so improvement becomes specific instead of guesswork.",
    metric: "82",
    metricLabel: "Resume score",
    accent: "#d9b45a",
    rows: [["Structure", 92], ["Role alignment", 78], ["Impact", 66], ["Skill coverage", 84]],
    strong: "Projects + practical evidence",
    next: "Add measurable outcomes",
  },
  {
    key: "career",
    label: "Career intelligence",
    eyebrow: "02 · Discover",
    title: "Know which paths fit—and why.",
    text: "CareerUp connects your current skills, interests and resume evidence to realistic roles, then explains what is helping or holding you back.",
    metric: "78%",
    metricLabel: "AI Engineer readiness",
    accent: "#8d80ff",
    rows: [["Full Stack Engineer", 91], ["Backend Engineer", 84], ["AI Engineer", 78], ["ML Engineer", 61]],
    strong: "Software engineering foundation",
    next: "Build applied AI evidence",
  },
  {
    key: "roadmap",
    label: "Personal roadmap",
    eyebrow: "03 · Progress",
    title: "Turn insight into your next best move.",
    text: "Your roadmap prioritizes skills, projects and milestones around your target role. You always know what to do next, and why it matters to your larger goal.",
    metric: "06",
    metricLabel: "Focused milestones",
    accent: "#76d7c4",
    rows: [["Python depth", 100], ["NumPy + Pandas", 80], ["ML foundations", 58], ["Portfolio project", 34]],
    strong: "Learning sequence is focused",
    next: "Finish ML foundations",
  },
];

const sampleRoles = [
  {
    key: "fullstack",
    role: "Full Stack Engineer",
    score: 91,
    accent: "#d9b45a",
    note: "Best current fit",
    matched: ["React", "Node.js", "MongoDB", "JavaScript", "Git"],
    missing: ["TypeScript", "Testing", "Docker"],
    evidence: "Strong project and stack overlap",
    action: "Turn your best full-stack project into measurable resume evidence.",
    roadmap: ["TypeScript depth", "Testing strategy", "Docker deployment"],
  },
  {
    key: "backend",
    role: "Backend Engineer",
    score: 84,
    accent: "#76d7c4",
    note: "Strong adjacent path",
    matched: ["Node.js", "Express", "MongoDB", "REST APIs", "Git"],
    missing: ["SQL", "Redis", "System design"],
    evidence: "Backend fundamentals already visible",
    action: "Build one API-heavy project with caching, validation and observability.",
    roadmap: ["SQL + PostgreSQL", "Redis caching", "System design basics"],
  },
  {
    key: "ai-app",
    role: "AI Application Engineer",
    score: 76,
    accent: "#8d80ff",
    note: "High-upside transition",
    matched: ["Python", "React", "Backend", "APIs", "Product building"],
    missing: ["NumPy", "Pandas", "ML foundations"],
    evidence: "Software foundation lowers the transition cost",
    action: "Build one useful product where an ML model solves a real workflow problem.",
    roadmap: ["NumPy + Pandas", "ML foundations", "Applied AI project"],
  },
  {
    key: "ml",
    role: "ML Engineer",
    score: 58,
    accent: "#f29f75",
    note: "Longer-term path",
    matched: ["Python", "Git", "Problem solving"],
    missing: ["Statistics", "Scikit-learn", "PyTorch", "Model evaluation"],
    evidence: "Programming base is useful, ML evidence is still thin",
    action: "Strengthen mathematics and classical ML before jumping into deep learning.",
    roadmap: ["Statistics", "Scikit-learn", "Model evaluation"],
  },
];

const steps = [
  {
    number: "01",
    title: "Build your career profile",
    text: "Add your resume, education, skills, interests and target role. CareerUp connects the pieces into one evolving profile.",
  },
  {
    number: "02",
    title: "Reveal your signal",
    text: "See where you are already strong, where your evidence is thin, and which career directions fit your background best.",
  },
  {
    number: "03",
    title: "Follow the highest-value path",
    text: "Get prioritized next actions instead of a giant list of courses. Learn, build and improve with a reason behind every step.",
  },
];

export function Marquee() {
  const items = ["Resume intelligence", "Role readiness", "Skill-gap analysis", "Career direction", "Personal roadmaps", "Progress signals"];

  return (
    <section className="border-y border-white/[.055] bg-white/[.012] py-4">
      <div className="overflow-hidden">
        <div className="marquee-track flex w-max items-center whitespace-nowrap">
          {[0, 1].map((group) => (
            <div key={group} className="flex items-center">
              {items.map((item, index) => (
                <div key={`${group}-${item}`} className="flex items-center">
                  <span className="px-6 text-[10px] uppercase tracking-[.22em] text-white/25 sm:px-9">{item}</span>
                  <span className={`h-1 w-1 rounded-full ${index % 2 ? "bg-[#7867ff]/60" : "bg-[#d9b45a]/60"}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SystemSection() {
  return (
    <section id="platform" className="relative px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="grid gap-10 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[.22em] text-[#d9b45a]/70">The CareerUp system</p>
            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-6xl">
              Your career data should <span className="text-white/35">work together.</span>
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/42 sm:text-base lg:ml-auto">
            Most career tools solve one tiny problem and forget everything else. CareerUp keeps your resume, skills, goals and progress connected so every insight builds on the last one.
          </p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {systemCards.map((item, index) => <FeatureCard key={item.title} item={item} index={index} />)}
        </div>
      </div>
    </section>
  );
}

export function ProductPreview() {
  const [activeTab, setActiveTab] = useState(0);
  const tab = productTabs[activeTab];

  return (
    <section className="relative px-4 py-24 sm:px-6 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7867ff]/[.055] blur-[120px]" />
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[.22em] text-[#d9b45a]/70">Interactive product preview</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-[1.03] tracking-[-.055em] sm:text-6xl">
            One profile. <span className="text-white/35">Three layers of intelligence.</span>
          </h2>
        </div>

        <div className="edge-glow relative overflow-hidden rounded-[34px] border border-white/[.08] bg-[#090c15]/88 backdrop-blur-2xl">
          <div className="flex flex-col border-b border-white/[.07] p-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1 overflow-x-auto">
              {productTabs.map((item, index) => (
                <button key={item.key} onClick={() => setActiveTab(index)} className={`product-tab relative whitespace-nowrap rounded-xl px-4 py-2.5 text-xs transition sm:text-sm ${activeTab === index ? "bg-white/[.075] text-white" : "text-white/34 hover:text-white/65"}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="hidden items-center gap-2 pr-3 text-[10px] uppercase tracking-[.18em] text-white/20 sm:flex">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#76d7c4]" /> Sample profile context
            </div>
          </div>

          <div key={tab.key} className="preview-swap grid lg:grid-cols-[.88fr_1.12fr]">
            <div className="border-b border-white/[.07] p-7 sm:p-10 lg:border-b-0 lg:border-r">
              <p className="text-[10px] uppercase tracking-[.2em]" style={{ color: tab.accent }}>{tab.eyebrow}</p>
              <h3 className="mt-5 max-w-md text-3xl font-semibold leading-[1.08] tracking-[-.045em] sm:text-5xl">{tab.title}</h3>
              <p className="mt-5 max-w-md text-sm leading-7 text-white/40">{tab.text}</p>
              <div className="mt-10 flex items-end gap-3">
                <span className="text-6xl font-semibold tracking-[-.07em] sm:text-7xl">{tab.metric}</span>
                <span className="pb-2 text-xs text-white/30">{tab.metricLabel}</span>
              </div>
            </div>

            <div className="relative p-6 sm:p-9">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/72">CareerUp intelligence</p>
                  <p className="mt-1 text-[10px] text-white/25">Illustrative preview using an example profile</p>
                </div>
                <span className="rounded-lg border border-white/[.07] bg-white/[.025] px-2.5 py-1 text-[9px] uppercase tracking-[.18em] text-white/25">Preview</span>
              </div>
              <div className="space-y-3">
                {tab.rows.map(([label, value]) => (
                  <div key={`${tab.key}-${label}`} className="metric-card rounded-2xl border border-white/[.065] bg-white/[.022] p-4">
                    <div className="flex items-center justify-between text-xs"><span className="text-white/55">{label}</span><span className="font-medium text-white/82">{value}%</span></div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[.05]"><div className="metric-line h-full rounded-full" style={{ width: `${value}%` }} /></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#76d7c4]/10 bg-[#76d7c4]/[.035] p-4"><p className="text-[9px] uppercase tracking-[.18em] text-[#76d7c4]/60">Strong signal</p><p className="mt-2 text-sm text-white/62">{tab.strong}</p></div>
                <div className="rounded-2xl border border-[#d9b45a]/10 bg-[#d9b45a]/[.035] p-4"><p className="text-[9px] uppercase tracking-[.18em] text-[#d9b45a]/60">Next priority</p><p className="mt-2 text-sm text-white/62">{tab.next}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CareerLab() {
  const [activeRole, setActiveRole] = useState(0);
  const role = sampleRoles[activeRole];
  const missingText = useMemo(() => role.missing.join(" · "), [role]);

  return (
    <section className="relative px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7867ff]/15 bg-[#7867ff]/[.055] px-3 py-1.5 text-[10px] uppercase tracking-[.18em] text-[#a79dff]"><Spark size={13} /> Career Lab</div>
            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-6xl">Try the logic. <span className="text-white/35">Change the destination.</span></h2>
          </div>
          <div className="lg:ml-auto lg:max-w-xl">
            <p className="text-sm leading-7 text-white/40 sm:text-base">Explore how the same example profile can look very different depending on the target role. This is an illustrative product preview—not a real analysis of your profile.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-white/24"><span className="rounded-full border border-white/[.06] px-3 py-1.5">React</span><span className="rounded-full border border-white/[.06] px-3 py-1.5">Node.js</span><span className="rounded-full border border-white/[.06] px-3 py-1.5">MongoDB</span><span className="rounded-full border border-white/[.06] px-3 py-1.5">Python</span></div>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[34px] border border-white/[.08] bg-[#090c15]/82 shadow-[0_35px_120px_rgba(0,0,0,.28)] backdrop-blur-2xl">
          <div className="grid lg:grid-cols-[.42fr_.58fr]">
            <div className="border-b border-white/[.07] p-4 sm:p-6 lg:border-b-0 lg:border-r">
              <p className="px-2 pb-3 text-[9px] uppercase tracking-[.2em] text-white/20">Choose a target role</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {sampleRoles.map((item, index) => (
                  <button key={item.key} onClick={() => setActiveRole(index)} className={`role-switch group w-full rounded-2xl border p-4 text-left transition ${activeRole === index ? "border-white/12 bg-white/[.06]" : "border-transparent bg-white/[.018] hover:border-white/[.07] hover:bg-white/[.035]"}`}>
                    <div className="flex items-start justify-between gap-4"><div><p className={`text-sm font-medium transition ${activeRole === index ? "text-white" : "text-white/55 group-hover:text-white/80"}`}>{item.role}</p><p className="mt-1 text-[10px] text-white/24">{item.note}</p></div><span className="text-lg font-semibold tracking-[-.04em]" style={{ color: activeRole === index ? item.accent : "rgba(255,255,255,.28)" }}>{item.score}%</span></div>
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[.045]"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.score}%`, background: item.accent }} /></div>
                  </button>
                ))}
              </div>
            </div>

            <div key={role.key} className="lab-panel relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div className="lab-scan pointer-events-none absolute inset-0 opacity-35" />
              <div className="relative z-10">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div><p className="text-[9px] uppercase tracking-[.2em]" style={{ color: role.accent }}>Readiness snapshot</p><h3 className="mt-3 text-3xl font-semibold tracking-[-.045em] sm:text-4xl">{role.role}</h3><p className="mt-3 text-sm text-white/34">{role.evidence}</p></div>
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-white/[.07] bg-white/[.025]"><div className="absolute inset-2 rounded-full border border-dashed border-white/[.08]" /><div className="text-center"><p className="text-3xl font-semibold tracking-[-.055em]">{role.score}</p><p className="text-[9px] text-white/25">readiness</p></div></div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#76d7c4]/10 bg-[#76d7c4]/[.03] p-5"><p className="text-[9px] uppercase tracking-[.18em] text-[#76d7c4]/65">Matched strengths</p><div className="mt-4 flex flex-wrap gap-2">{role.matched.map((skill) => <span key={skill} className="inline-flex items-center gap-1.5 rounded-full border border-white/[.065] bg-black/10 px-2.5 py-1.5 text-[10px] text-white/52"><CheckIcon /> {skill}</span>)}</div></div>
                  <div className="rounded-2xl border border-[#d9b45a]/10 bg-[#d9b45a]/[.03] p-5"><p className="text-[9px] uppercase tracking-[.18em] text-[#d9b45a]/65">Missing signal</p><p className="mt-4 text-sm leading-6 text-white/50">{missingText}</p></div>
                </div>

                <div className="mt-3 rounded-2xl border border-white/[.07] bg-white/[.022] p-5"><div className="flex items-start gap-3"><span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7867ff]/10 text-[#a79dff]"><Spark size={15} /></span><div><p className="text-[9px] uppercase tracking-[.18em] text-white/25">Highest-value next action</p><p className="mt-2 text-sm leading-6 text-white/66">{role.action}</p></div></div></div>

                <div className="mt-5 flex flex-col gap-4 border-t border-white/[.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">{role.roadmap.map((item, index) => <span key={item} className="flex items-center gap-2 text-[10px] text-white/28">{index > 0 && <span className="text-white/12">→</span>}{item}</span>)}</div>
                  <Link to="/register" className="group inline-flex items-center gap-2 text-xs text-[#efd080]">Analyze my profile <span className="transition-transform group-hover:translate-x-1"><Arrow size={14} /></span></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkflowSection() {
  return (
    <section id="how-it-works" className="relative px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-[11px] uppercase tracking-[.22em] text-[#d9b45a]/70">How it works</p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.04] tracking-[-.055em] sm:text-6xl">Clarity before <span className="text-white/35">more content.</span></h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/40">CareerUp is designed to reduce random learning. It helps you understand your current position first, then makes the next action easier to choose.</p>
            <Link to="/register" className="group mt-8 inline-flex items-center gap-2 text-sm text-[#efd080]">Create your profile <span className="transition-transform group-hover:translate-x-1"><Arrow size={16} /></span></Link>
          </div>
          <div className="relative">
            <div className="workflow-line absolute left-[27px] top-10 hidden h-[calc(100%-5rem)] w-px sm:block" />
            <div className="space-y-5">{steps.map((step, index) => <div key={step.number} className="workflow-card group relative rounded-[28px] border border-white/[.07] bg-white/[.022] p-6 sm:py-8 sm:pl-20 sm:pr-8"><div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border text-xs font-medium sm:absolute sm:left-5 sm:top-7 sm:mb-0 ${index === 1 ? "border-[#7867ff]/20 bg-[#7867ff]/10 text-[#a79dff]" : "border-[#d9b45a]/20 bg-[#d9b45a]/[.07] text-[#efd080]"}`}>{step.number}</div><h3 className="text-xl font-semibold tracking-[-.03em] sm:text-2xl">{step.title}</h3><p className="mt-3 max-w-xl text-sm leading-7 text-white/38">{step.text}</p></div>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProgressSection() {
  return (
    <section className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[11px] uppercase tracking-[.22em] text-[#d9b45a]/70">Your evolving signal</p><h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.03] tracking-[-.055em] sm:text-6xl">Make progress <span className="text-white/35">visible.</span></h2></div><p className="max-w-md text-sm leading-7 text-white/38">As your skills, projects and resume improve, CareerUp can turn scattered effort into a clearer picture of career readiness.</p></div>
        <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
          <TiltCard className="rounded-[30px] border border-white/[.075] bg-white/[.025] p-6 sm:p-8" intensity={5}>
            <div className="flex items-center justify-between"><div><p className="text-xs text-white/35">Career readiness trend</p><p className="mt-2 text-2xl font-semibold tracking-[-.04em]">From learning to evidence.</p></div><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#76d7c4]/[.07] text-[#76d7c4]"><ChartIcon /></span></div>
            <div className="relative mt-10 h-52 overflow-hidden rounded-2xl border border-white/[.055] bg-[#080b13]/60 p-5"><div className="absolute inset-x-5 top-1/4 border-t border-dashed border-white/[.05]" /><div className="absolute inset-x-5 top-1/2 border-t border-dashed border-white/[.05]" /><div className="absolute inset-x-5 top-3/4 border-t border-dashed border-white/[.05]" /><svg viewBox="0 0 600 170" preserveAspectRatio="none" className="absolute inset-x-5 bottom-5 h-[150px] w-[calc(100%-2.5rem)] overflow-visible"><defs><linearGradient id="careerLine" x1="0" x2="1"><stop offset="0" stopColor="#7867ff" /><stop offset="1" stopColor="#d9b45a" /></linearGradient><linearGradient id="careerArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9b45a" stopOpacity=".18" /><stop offset="1" stopColor="#d9b45a" stopOpacity="0" /></linearGradient></defs><path d="M0 142 C70 132 95 118 138 120 S205 92 255 96 S329 71 372 72 S452 46 485 52 S555 28 600 20 L600 170 L0 170Z" fill="url(#careerArea)" /><path className="career-chart-line" d="M0 142 C70 132 95 118 138 120 S205 92 255 96 S329 71 372 72 S452 46 485 52 S555 28 600 20" fill="none" stroke="url(#careerLine)" strokeWidth="3" strokeLinecap="round" /></svg><div className="absolute bottom-4 left-5 right-5 flex justify-between text-[9px] uppercase tracking-[.12em] text-white/18"><span>Profile</span><span>Resume</span><span>Projects</span><span>Skills</span><span>Ready</span></div></div>
          </TiltCard>
          <div className="grid gap-4">
            <TiltCard className="rounded-[30px] border border-white/[.075] bg-white/[.025] p-6" intensity={5}><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#7867ff]/10 text-[#a79dff]"><CompassIcon /></span><span className="rounded-full bg-[#76d7c4]/[.07] px-2.5 py-1 text-[9px] uppercase tracking-[.14em] text-[#76d7c4]">Focused</span></div><p className="mt-8 text-[10px] uppercase tracking-[.17em] text-white/25">Current direction</p><p className="mt-2 text-2xl font-semibold tracking-[-.04em]">AI Application Engineer</p><p className="mt-3 text-sm leading-6 text-white/35">A path that combines your software foundation with applied AI skills.</p></TiltCard>
            <TiltCard className="rounded-[30px] border border-white/[.075] bg-white/[.025] p-6" intensity={5}><div className="flex items-center justify-between gap-5"><div><p className="text-[10px] uppercase tracking-[.17em] text-white/25">Next best action</p><p className="mt-2 text-xl font-semibold tracking-[-.035em]">Build one ML-backed product</p></div><span className="text-[#efd080]"><Arrow /></span></div><div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[.05]"><div className="h-full w-[64%] rounded-full bg-gradient-to-r from-[#7867ff] to-[#d9b45a]" /></div><p className="mt-3 text-[10px] text-white/25">Illustrative milestone progress</p></TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="relative px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="relative overflow-hidden rounded-[36px] border border-white/[.08] bg-[#0a0d16] px-6 py-16 text-center sm:px-10 sm:py-24"><div className="cta-orb pointer-events-none absolute left-[18%] top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#7867ff]/15" /><div className="cta-orb pointer-events-none absolute right-[18%] top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#d9b45a]/12" style={{ animationDelay: "-3.5s" }} /><div className="hero-noise pointer-events-none absolute inset-0" /><div className="relative z-10 mx-auto max-w-3xl"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d9b45a]/20 bg-[#d9b45a]/[.07] text-[#efd080]"><Spark /></div><p className="mt-7 text-[10px] uppercase tracking-[.22em] text-white/25">Your next move starts with context</p><h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-.055em] sm:text-6xl">Build a career plan that actually knows <span className="gold-gradient">where you are.</span></h2><p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/38 sm:text-base">Create your Career Profile, analyze your current signal and turn vague ambition into focused next actions.</p><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/register" className="button-sheen group inline-flex items-center justify-center gap-2 rounded-xl bg-[#e6c66e] px-6 py-3.5 text-sm font-semibold text-[#11131a] transition hover:-translate-y-0.5 hover:bg-[#efd98d]">Start building <span className="transition-transform group-hover:translate-x-1"><Arrow size={16} /></span></Link><Link to="/product" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[.035] px-6 py-3.5 text-sm text-white/65 transition hover:border-white/20 hover:bg-white/[.06] hover:text-white">Explore the platform</Link></div></div></div>
      </div>
    </section>
  );
}
