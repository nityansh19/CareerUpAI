import { useState } from "react";
import { Link } from "react-router-dom";
import { Arrow, CheckIcon, Spark } from "./LandingUI";

const modes = [
  {
    key: "resume",
    short: "Resume",
    eyebrow: "Resume intelligence",
    title: "Turn your resume into a stronger signal.",
    copy: "See what reads well, what feels weak and which improvements can make your profile more convincing.",
    metric: "82",
    metricLabel: "resume score",
    accent: "#d9b45a",
    bars: [["Structure", 92], ["Role fit", 78], ["Impact", 66]],
    insight: "Add measurable outcomes to your strongest projects.",
    chips: ["ATS clarity", "Evidence gaps", "Role alignment"],
  },
  {
    key: "career",
    short: "Career fit",
    eyebrow: "Career intelligence",
    title: "See where your profile fits right now.",
    copy: "Compare realistic paths from one career profile and understand why one role fits better than another.",
    metric: "91%",
    metricLabel: "top role fit",
    accent: "#8d80ff",
    bars: [["Full Stack", 91], ["Backend", 84], ["AI Apps", 76]],
    insight: "TypeScript, testing and Docker are your highest-value gaps.",
    chips: ["Role matching", "Readiness", "Priority gaps"],
  },
  {
    key: "roadmap",
    short: "Roadmap",
    eyebrow: "Personal roadmap",
    title: "Turn insight into a focused next move.",
    copy: "Replace scattered courses with a short sequence of skills, projects and milestones tied to your target role.",
    metric: "06",
    metricLabel: "focused milestones",
    accent: "#76d7c4",
    bars: [["Python depth", 100], ["ML foundations", 58], ["Applied project", 34]],
    insight: "Finish ML foundations, then build one useful ML-backed product.",
    chips: ["Skill order", "Project proof", "Milestones"],
  },
];

const journey = [
  {
    number: "01",
    title: "Build your profile",
    text: "Resume, skills, education and goals become one connected career context.",
  },
  {
    number: "02",
    title: "Read the signal",
    text: "CareerUpAI surfaces role fit, strengths and the gaps worth fixing first.",
  },
  {
    number: "03",
    title: "Make the next move",
    text: "Follow a focused roadmap instead of guessing what to learn or build next.",
  },
];

function ModePanel({ mode }) {
  return (
    <div key={mode.key} className="preview-swap grid gap-4 lg:grid-cols-[.92fr_1.08fr]">
      <div className="product-copy-panel rounded-[28px] border border-white/[.07] bg-white/[.025] p-6 sm:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[.2em]" style={{ color: mode.accent }}>
          {mode.eyebrow}
        </p>

        <h3 className="career-display mt-4 max-w-lg text-2xl font-bold leading-[1.08] tracking-[-.045em] sm:text-[34px]">
          {mode.title}
        </h3>

        <p className="mt-4 max-w-lg text-sm font-medium leading-6 text-white/52">
          {mode.copy}
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {mode.chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[.07] bg-white/[.025] px-3 py-1.5 text-[10px] font-semibold text-white/48"
            >
              <CheckIcon /> {chip}
            </span>
          ))}
        </div>

        <div className="mt-8 flex items-end gap-3">
          <span className="career-display text-5xl font-extrabold tracking-[-.065em]">{mode.metric}</span>
          <span className="pb-1.5 text-xs font-semibold text-white/34">{mode.metricLabel}</span>
        </div>
      </div>

      <div className="product-signal-panel relative overflow-hidden rounded-[28px] border border-white/[.075] bg-[#080b13]/88 p-5 sm:p-7">
        <div className="product-panel-glow pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white/82">Career signal preview</p>
              <p className="mt-1 text-[10px] font-medium text-white/32">Illustrative profile analysis</p>
            </div>
            <span className="pulse-dot h-2 w-2 rounded-full bg-[#76d7c4]" />
          </div>

          <div className="mt-7 space-y-5">
            {mode.bars.map(([label, value]) => (
              <div key={label}>
                <div className="mb-2.5 flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-white/48">{label}</span>
                  <span className="text-white/72">{value}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[.055]">
                  <div className="metric-line h-full rounded-full" style={{ width: String(value) + "%" }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[#d9b45a]/12 bg-[#d9b45a]/[.035] p-4">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.18em] text-[#d9b45a]/72">
              <Spark size={13} /> Next best move
            </div>
            <p className="mt-2 text-sm font-semibold leading-6 text-white/72">{mode.insight}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompactLanding() {
  const [modeIndex, setModeIndex] = useState(0);
  const mode = modes[modeIndex];

  return (
    <>
      <section id="product-intelligence" className="relative px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[.23em] text-[#d9b45a]/78">
              One profile · three layers of intelligence
            </p>
            <h2 className="career-display mt-4 text-4xl font-extrabold leading-[1] tracking-[-.06em] sm:text-5xl">
              Everything important, <span className="text-white/38">without the noise.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-7 text-white/50 sm:text-base">
              Resume insight, career fit and a personal roadmap work from the same context—so every recommendation connects to what comes next.
            </p>
          </div>

          <div className="product-console mt-9 rounded-[34px] border border-white/[.08] bg-[#090c15]/90 p-2 backdrop-blur-2xl">
            <div className="mb-2 flex gap-1 overflow-x-auto rounded-[24px] border border-white/[.055] bg-black/10 p-1.5">
              {modes.map((item, index) => (
                <button
                  key={item.key}
                  onClick={() => setModeIndex(index)}
                  className={
                    "min-w-max flex-1 rounded-[18px] px-4 py-3 text-xs font-bold transition sm:text-sm " +
                    (modeIndex === index
                      ? "bg-white/[.09] text-white shadow-lg"
                      : "text-white/38 hover:bg-white/[.035] hover:text-white/70")
                  }
                >
                  <span className="mr-2 text-[9px] text-white/22">0{index + 1}</span>
                  {item.short}
                </button>
              ))}
            </div>

            <ModePanel mode={mode} />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-[1180px]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#d9b45a]/72">
                How it works
              </p>
              <h2 className="career-display mt-3 text-3xl font-extrabold tracking-[-.055em] sm:text-4xl">
                Three moves. One connected system.
              </h2>
            </div>

            <Link
              to="/register"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#efd080]"
            >
              Create my profile
              <span className="transition-transform group-hover:translate-x-1"><Arrow size={15} /></span>
            </Link>
          </div>

          <div className="journey-shell mt-7 grid gap-3 rounded-[30px] border border-white/[.07] bg-white/[.02] p-3 md:grid-cols-3">
            {journey.map((item, index) => (
              <article key={item.number} className="journey-card relative rounded-[24px] border border-white/[.055] bg-[#090c15]/72 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[#efd080]">{item.number}</span>
                  {index < journey.length - 1 && (
                    <span className="hidden text-lg text-white/16 md:block">→</span>
                  )}
                </div>
                <h3 className="career-display mt-7 text-xl font-bold tracking-[-.035em]">{item.title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-white/43">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="final-cta relative mt-5 overflow-hidden rounded-[30px] border border-white/[.08] bg-[#0a0d16] px-6 py-9 sm:px-9 sm:py-10">
            <div className="cta-orb pointer-events-none absolute right-[10%] top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#d9b45a]/12" />
            <div className="cta-orb cta-orb-violet pointer-events-none absolute right-[28%] top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-[#7867ff]/10" />

            <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[.2em] text-white/30">
                  Build from your real context
                </p>
                <h2 className="career-display mt-2 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-[-.055em] sm:text-4xl">
                  Your career plan should know <span className="gold-gradient">where you are now.</span>
                </h2>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Link
                  to="/register"
                  className="button-sheen group inline-flex items-center justify-center gap-2 rounded-xl bg-[#e8c96f] px-5 py-3 text-sm font-bold text-[#11131a] transition hover:-translate-y-0.5 hover:bg-[#f0d98a]"
                >
                  Start free
                  <span className="transition-transform group-hover:translate-x-1"><Arrow size={15} /></span>
                </Link>
                <Link
                  to="/product"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[.035] px-5 py-3 text-sm font-semibold text-white/65 transition hover:-translate-y-0.5 hover:bg-white/[.06] hover:text-white"
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
