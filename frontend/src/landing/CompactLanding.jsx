import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Arrow, CheckIcon, Spark } from "./LandingUI";

const modes = [
  {
    key: "resume",
    short: "Resume",
    eyebrow: "Resume intelligence",
    title: "Turn your resume into a clear signal.",
    copy: "See strengths, weak evidence, section gaps and the improvements that matter most.",
    metric: "82",
    metricLabel: "resume score",
    accent: "#d9b45a",
    bars: [
      ["Structure", 92],
      ["Role fit", 78],
      ["Impact", 66],
    ],
    next: "Add measurable outcomes to your strongest projects.",
  },
  {
    key: "career",
    short: "Career fit",
    eyebrow: "Career intelligence",
    title: "Compare realistic paths in seconds.",
    copy: "CareerUpAI connects your skills and evidence to roles, then shows why each path fits.",
    metric: "91%",
    metricLabel: "top role fit",
    accent: "#8d80ff",
    bars: [
      ["Full Stack", 91],
      ["Backend", 84],
      ["AI Apps", 76],
    ],
    next: "Strengthen TypeScript, testing and Docker to close the highest-value gaps.",
  },
  {
    key: "roadmap",
    short: "Roadmap",
    eyebrow: "Personal roadmap",
    title: "Your next skill. Your next project.",
    copy: "Turn your target role into a focused sequence of skills, projects and proof.",
    metric: "06",
    metricLabel: "focused milestones",
    accent: "#76d7c4",
    bars: [
      ["Python depth", 100],
      ["ML foundations", 58],
      ["Applied project", 34],
    ],
    next: "Finish ML foundations, then build one useful ML-backed product.",
  },
];

const roleProfiles = [
  {
    key: "fullstack",
    name: "Full Stack Engineer",
    score: 91,
    label: "Best current fit",
    matched: ["React", "Node.js", "MongoDB", "Git"],
    missing: ["TypeScript", "Testing", "Docker"],
  },
  {
    key: "backend",
    name: "Backend Engineer",
    score: 84,
    label: "Strong adjacent path",
    matched: ["Node.js", "Express", "REST APIs", "MongoDB"],
    missing: ["SQL", "Redis", "System design"],
  },
  {
    key: "ai",
    name: "AI Application Engineer",
    score: 76,
    label: "High-upside transition",
    matched: ["Python", "React", "Backend", "APIs"],
    missing: ["NumPy", "Pandas", "ML foundations"],
  },
];

const journey = [
  ["01", "Profile", "Connect your resume, skills, education and goals."],
  [
    "02",
    "Signal",
    "See role fit, gaps and the evidence recruiters can actually find.",
  ],
  ["03", "Action", "Follow the few next moves with the highest career value."],
];

function ModePanel({ mode }) {
  return (
    <div
      key={mode.key}
      className="preview-swap grid gap-4 lg:grid-cols-[.92fr_1.08fr]"
    >
      <div className="rounded-[28px] border border-white/[.07] bg-white/[.025] p-6 sm:p-8">
        <p
          className="text-[10px] uppercase tracking-[.2em]"
          style={{ color: mode.accent }}
        >
          {mode.eyebrow}
        </p>
        <h3 className="mt-4 max-w-lg text-2xl font-semibold leading-[1.08] tracking-[-.04em] sm:text-3xl">
          {mode.title}
        </h3>
        <p className="mt-4 max-w-lg text-sm leading-6 text-white/40">
          {mode.copy}
        </p>
        <div className="mt-7 flex items-end gap-3">
          <span className="text-4xl font-semibold tracking-[-.05em] sm:text-4xl">
            {mode.metric}
          </span>
          <span className="pb-1.5 text-xs text-white/28">
            {mode.metricLabel}
          </span>
        </div>
        <div className="mt-7 rounded-2xl border border-white/[.06] bg-black/10 p-4">
          <p className="text-[9px] uppercase tracking-[.18em] text-white/24">
            Highest-value next action
          </p>
          <p className="mt-2 text-sm leading-6 text-white/62">{mode.next}</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/[.07] bg-[#080b13]/78 p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/72">
              Preview career signal
            </p>
            <p className="mt-1 text-[10px] text-white/24">
              Illustrative profile preview
            </p>
          </div>
          <span className="pulse-dot h-2 w-2 rounded-full bg-[#76d7c4]" />
        </div>
        <div className="mt-6 space-y-4">
          {mode.bars.map(([label, value]) => (
            <div key={label}>
              <div className="mb-2 flex items-center justify-between text-[11px]">
                <span className="text-white/38">{label}</span>
                <span className="text-white/55">{value}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[.05]">
                <div
                  className="metric-line h-full rounded-full"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#76d7c4]/10 bg-[#76d7c4]/[.035] p-4">
            <p className="text-[9px] uppercase tracking-[.16em] text-[#76d7c4]/60">
              Working for you
            </p>
            <p className="mt-2 text-sm text-white/58">
              Projects + practical evidence
            </p>
          </div>
          <div className="rounded-2xl border border-[#d9b45a]/10 bg-[#d9b45a]/[.035] p-4">
            <p className="text-[9px] uppercase tracking-[.16em] text-[#d9b45a]/60">
              Needs attention
            </p>
            <p className="mt-2 text-sm text-white/58">
              Proof, depth and role alignment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompactLanding() {
  const [modeIndex, setModeIndex] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const mode = modes[modeIndex];
  const role = roleProfiles[roleIndex];

  const missingText = useMemo(() => role.missing.join(" · "), [role]);

  return (
    <>
      <section
        data-motion-item
        id="platform"
        className="relative px-4 py-10 sm:px-6 sm:py-12"
      >
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="grid gap-7 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[.22em] text-[#d9b45a]/70">
                Career command center
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.01] tracking-[-.055em] sm:text-5xl">
                Less scrolling.{" "}
                <span className="text-white/34">More discovery.</span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/38 lg:ml-auto">
              One compact workspace for resume intelligence, career fit and your
              personal roadmap. Switch views instead of hunting through separate
              tools.
            </p>
          </div>

          <div className="edge-glow mt-8 rounded-[32px] border border-white/[.08] bg-[#090c15]/88 p-2 backdrop-blur-2xl">
            <div className="mb-2 flex gap-1 overflow-x-auto rounded-[24px] border border-white/[.055] bg-black/10 p-1.5">
              {modes.map((item, index) => (
                <button
                  key={item.key}
                  onClick={() => setModeIndex(index)}
                  className={`min-w-max flex-1 rounded-[18px] px-4 py-3 text-xs transition sm:text-sm ${modeIndex === index ? "bg-white/[.085] text-white shadow-lg" : "text-white/34 hover:bg-white/[.035] hover:text-white/65"}`}
                >
                  <span className="mr-2 text-[9px] text-white/20">
                    0{index + 1}
                  </span>
                  {item.short}
                </button>
              ))}
            </div>
            <ModePanel mode={mode} />
          </div>
        </div>
      </section>

      <section
        data-motion-item
        id="career-lab"
        className="relative px-4 py-8 sm:px-6 sm:py-10"
      >
        <div className="mx-auto grid w-full max-w-[1180px] gap-4 lg:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-[30px] border border-white/[.07] bg-white/[.022] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[.2em] text-[#8d80ff]">
                  Career Lab
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-.04em]">
                  Switch your target role.
                </h3>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#7867ff]/10 text-[#a79dff]">
                <Spark size={16} />
              </span>
            </div>
            <div className="mt-5 grid gap-2">
              {roleProfiles.map((item, index) => (
                <button
                  key={item.key}
                  onClick={() => setRoleIndex(index)}
                  className={`role-switch flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition ${roleIndex === index ? "border-white/[.12] bg-white/[.065]" : "border-white/[.055] bg-white/[.018] hover:bg-white/[.04]"}`}
                >
                  <div>
                    <p className="text-sm font-medium text-white/72">
                      {item.name}
                    </p>
                    <p className="mt-1 text-[10px] text-white/25">
                      {item.label}
                    </p>
                  </div>
                  <span className="text-lg font-semibold tracking-[-.04em] text-white/70">
                    {item.score}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div
            key={role.key}
            className="lab-panel rounded-[30px] border border-white/[.07] bg-[#090c15]/78 p-6 sm:p-7"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[.18em] text-[#d9b45a]/65">
                  Readiness snapshot
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-[-.045em]">
                  {role.name}
                </h3>
                <p className="mt-2 text-sm text-white/30">{role.label}</p>
              </div>
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-white/[.08] bg-white/[.025]">
                <div className="text-center">
                  <p className="text-2xl font-semibold">{role.score}</p>
                  <p className="text-[8px] text-white/24">readiness</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#76d7c4]/10 bg-[#76d7c4]/[.03] p-4">
                <p className="text-[9px] uppercase tracking-[.17em] text-[#76d7c4]/65">
                  Matched strengths
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {role.matched.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/[.065] bg-black/10 px-2.5 py-1.5 text-[10px] text-white/50"
                    >
                      <CheckIcon />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-[#d9b45a]/10 bg-[#d9b45a]/[.03] p-4">
                <p className="text-[9px] uppercase tracking-[.17em] text-[#d9b45a]/65">
                  Missing signal
                </p>
                <p className="mt-3 text-sm leading-6 text-white/48">
                  {missingText}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/[.06] bg-white/[.02] p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/46">
                Turn this snapshot into a personalized plan.
              </p>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 text-xs text-[#efd080]"
              >
                Analyze my profile{" "}
                <span className="transition-transform group-hover:translate-x-1">
                  <Arrow size={14} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        data-motion-item
        id="why-careerup"
        className="relative px-4 py-12 sm:px-6 sm:py-16"
      >
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[.22em] text-[#d9b45a]/70">
                Why CareerUpAI
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.01] tracking-[-.055em] sm:text-5xl">
                One career system.{" "}
                <span className="text-white/34">
                  Not another isolated tool.
                </span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/42 lg:ml-auto">
              CareerUpAI keeps your resume, skills, target roles and progress
              connected so the advice you get has context instead of starting
              from zero every time.
            </p>
          </div>

          <div className="why-grid mt-8 grid gap-4 lg:grid-cols-12">
            <article className="why-card why-card-large relative overflow-hidden rounded-[30px] border border-white/[.07] bg-[#090c15]/82 p-6 sm:p-8 lg:col-span-7">
              <div className="why-orb pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#7867ff]/12" />
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#7867ff]/20 bg-[#7867ff]/10 text-[#a79dff]">
                    <Spark size={18} />
                  </span>
                  <span className="rounded-full border border-white/[.06] px-3 py-1 text-[9px] uppercase tracking-[.17em] text-white/25">
                    Connected intelligence
                  </span>
                </div>

                <h3 className="mt-10 max-w-lg text-3xl font-semibold tracking-[-.045em]">
                  Every insight starts from the same career profile.
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/40">
                  Resume analysis can inform career fit. Career fit can shape
                  your roadmap. Your roadmap can point back to the projects and
                  skills that strengthen your profile.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Resume", "What your profile currently proves"],
                    ["Career fit", "Where your evidence maps best"],
                    ["Roadmap", "What to improve next"],
                  ].map(([title, text]) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-white/[.06] bg-black/10 p-4"
                    >
                      <p className="text-xs font-medium text-white/68">
                        {title}
                      </p>
                      <p className="mt-2 text-[11px] leading-5 text-white/30">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <div className="grid gap-4 lg:col-span-5">
              {[
                [
                  "Clarity over noise",
                  "Prioritize the few skill gaps and actions that matter most instead of collecting endless recommendations.",
                ],
                [
                  "Built around progress",
                  "As your profile changes, your direction can change with it instead of staying stuck on one static report.",
                ],
                [
                  "Actionable by design",
                  "Insights are paired with practical next steps so analysis turns into something you can actually do.",
                ],
              ].map(([title, text], index) => (
                <article
                  key={title}
                  className="why-card rounded-[26px] border border-white/[.07] bg-white/[.022] p-5 sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#d9b45a]/18 bg-[#d9b45a]/[.07] text-[10px] font-medium text-[#efd080]">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-.03em]">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/36">
                        {text}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 rounded-[26px] border border-white/[.065] bg-white/[.018] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-white/38">
              {[
                "One connected profile",
                "Focused skill priorities",
                "Role-readiness signals",
                "Personal next actions",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="text-[#76d7c4]">
                    <CheckIcon />
                  </span>
                  {item}
                </span>
              ))}
            </div>
            <Link
              to="/product"
              className="group inline-flex shrink-0 items-center gap-2 text-xs text-[#efd080]"
            >
              Explore the full platform
              <span className="transition-transform group-hover:translate-x-1">
                <Arrow size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section
        data-motion-item
        id="how-it-works"
        className="px-4 py-8 sm:px-6 sm:py-10"
      >
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[.2em] text-[#d9b45a]/70">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-.05em] sm:text-4xl">
                Three moves. One connected system.
              </h2>
            </div>
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 text-sm text-[#efd080]"
            >
              Create my profile{" "}
              <span className="transition-transform group-hover:translate-x-1">
                <Arrow size={15} />
              </span>
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {journey.map(([number, title, text], index) => (
              <div
                key={number}
                className="workflow-card relative overflow-hidden rounded-[24px] border border-white/[.065] bg-white/[.022] p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-[#efd080]">
                    {number}
                  </span>
                  {index < journey.length - 1 && (
                    <span className="hidden text-white/15 md:block">→</span>
                  )}
                </div>
                <h3 className="mt-8 text-xl font-semibold tracking-[-.035em]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/34">{text}</p>
              </div>
            ))}
          </div>

          <div className="relative mt-4 overflow-hidden rounded-[30px] border border-white/[.08] bg-[#0a0d16] px-6 py-8 sm:px-8 sm:py-10">
            <div className="cta-orb pointer-events-none absolute right-[12%] top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-[#d9b45a]/10" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[.2em] text-white/24">
                  Start with your real context
                </p>
                <h2 className="mt-2 max-w-2xl text-3xl font-semibold leading-[1.05] tracking-[-.05em] sm:text-4xl">
                  Your career plan should know{" "}
                  <span className="gold-gradient">where you are now.</span>
                </h2>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Link
                  to="/register"
                  className="button-sheen group inline-flex items-center justify-center gap-2 rounded-xl bg-[#e6c66e] px-5 py-3 text-sm font-semibold text-[#11131a] transition hover:-translate-y-0.5"
                >
                  Start free{" "}
                  <span className="transition-transform group-hover:translate-x-1">
                    <Arrow size={15} />
                  </span>
                </Link>
                <Link
                  to="/product"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[.035] px-5 py-3 text-sm text-white/60 transition hover:bg-white/[.06] hover:text-white"
                >
                  Explore platform
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
