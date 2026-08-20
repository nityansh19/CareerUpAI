import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Login from "./auth/Login";
import Register from "./auth/Register";
import Dashboard from "./Dashboard/Dashboard";

const GOLD = "#D7B45A";
const GOLD_LIGHT = "#F0D98A";
const BG = "#070A12";
const PANEL = "#0D111D";

function Icon({ children, size = 22, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <Icon size={18}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </Icon>
  );
}

function CheckIcon({ size = 15 }) {
  return (
    <Icon size={size} strokeWidth="2.2">
      <path d="m5 12 4 4L19 6" />
    </Icon>
  );
}

function SparkIcon() {
  return (
    <Icon size={20}>
      <path d="m12 3-1.8 6.2L4 11l6.2 1.8L12 19l1.8-6.2L20 11l-6.2-1.8L12 3Z" />
      <path d="m19 17-.8 2.2L16 20l2.2.8L19 23l.8-2.2L22 20l-2.2-.8L19 17Z" />
    </Icon>
  );
}

function TargetIcon() {
  return (
    <Icon size={24}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </Icon>
  );
}

function BrainIcon() {
  return (
    <Icon size={24}>
      <path d="M9 4.5a3 3 0 0 0-5 2.2A3.2 3.2 0 0 0 4.8 13 3 3 0 0 0 7 18.5a3 3 0 0 0 5 1.8V5.5A3 3 0 0 0 9 4.5Z" />
      <path d="M15 4.5a3 3 0 0 1 5 2.2 3.2 3.2 0 0 1-.8 6.3 3 3 0 0 1-2.2 5.5 3 3 0 0 1-5 1.8V5.5a3 3 0 0 1 3-1Z" />
      <path d="M7 9h2M15 9h2M7 14h2M15 14h2" />
    </Icon>
  );
}

function ResumeIcon() {
  return (
    <Icon size={24}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </Icon>
  );
}

function RoadmapIcon() {
  return (
    <Icon size={24}>
      <circle cx="5" cy="18" r="2.5" />
      <circle cx="12" cy="6" r="2.5" />
      <circle cx="19" cy="15" r="2.5" />
      <path d="M7 16.5 10.5 8M14.5 7.5l3 5.5" />
    </Icon>
  );
}

function BriefcaseIcon() {
  return (
    <Icon size={22}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
    </Icon>
  );
}

function ShieldIcon() {
  return (
    <Icon size={21}>
      <path d="M12 3 20 6v5c0 5-3.3 8.3-8 10-4.7-1.7-8-5-8-10V6l8-3Z" />
      <path d="m8.5 12 2.3 2.3 4.8-5" />
    </Icon>
  );
}

function MessageIcon() {
  return (
    <Icon size={21}>
      <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 2 1.5-4.2A7.5 7.5 0 1 1 20 11.5Z" />
    </Icon>
  );
}

function ChevronIcon({ open }) {
  return (
    <Icon size={17} className={`transition-transform ${open ? "rotate-180" : ""}`}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

function SectionLabel({ children }) {
  return (
    <p
      className="text-xs font-medium uppercase tracking-[0.25em]"
      style={{ color: GOLD }}
    >
      {children}
    </p>
  );
}

function Metric({ value, label }) {
  return (
    <div className="min-w-[140px] text-center">
      <div className="text-2xl font-semibold tracking-tight sm:text-3xl">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </div>
    </div>
  );
}

function FeatureCard({ icon, number, title, text }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-2 hover:border-white/[0.15] hover:bg-white/[0.05]">
      <div
        className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{ color: GOLD_LIGHT, background: "rgba(215,180,90,.09)" }}
      >
        {icon}
      </div>
      <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/25">
        {number}
      </p>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/35">{text}</p>
      <div className="mt-7 flex items-center gap-2 text-xs font-medium text-white/40 transition group-hover:text-white">
        Explore <ArrowIcon />
      </div>
      <div
        className="absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl opacity-0 transition group-hover:opacity-100"
        style={{ background: "rgba(215,180,90,.12)" }}
      />
    </div>
  );
}

function PricingCard({ name, price, description, features, popular, dark, cta }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[30px] border p-7 transition duration-300 hover:-translate-y-2 ${
        dark
          ? "border-white/10 bg-white/[0.035]"
          : "border-[#D7B45A]/40 bg-gradient-to-b from-[#F0D98A] to-[#D7B45A] text-[#0A0C12]"
      }`}
    >
      {popular && (
        <div
          className={`absolute right-5 top-5 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] ${
            dark ? "bg-[#D7B45A] text-[#0A0C12]" : "bg-[#0A0C12] text-[#F0D98A]"
          }`}
        >
          Most popular
        </div>
      )}

      <div className="max-w-[270px]">
        <p
          className={`text-xs font-medium uppercase tracking-[0.2em] ${
            dark ? "text-white/40" : "text-[#0A0C12]/55"
          }`}
        >
          {name}
        </p>
        <h3 className="mt-3 text-2xl font-semibold">{description}</h3>

        <div className="mt-7 flex items-end gap-2">
          <span className="text-5xl font-semibold tracking-[-0.05em]">₹{price}</span>
          <span className={dark ? "mb-2 text-sm text-white/35" : "mb-2 text-sm text-[#0A0C12]/50"}>
            / month
          </span>
        </div>

        <div
          className={`my-7 h-px ${
            dark ? "bg-white/[0.08]" : "bg-[#0A0C12]/15"
          }`}
        />

        <div className="space-y-3.5">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5">
                <CheckIcon />
              </span>
              <span className={dark ? "text-white/60" : "text-[#0A0C12]/70"}>{feature}</span>
            </div>
          ))}
        </div>

        <Link
          to="/register"
          className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 ${
            dark
              ? "border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
              : "bg-[#0A0C12] text-white"
          }`}
        >
          {cta} <ArrowIcon />
        </Link>
      </div>
    </div>
  );
}

function Home() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [billing, setBilling] = useState("monthly");

  /*
    DEMO METRICS:
    Replace these values with real backend/database analytics before launch.
    Keeping them in one object makes the homepage easy to connect to an API later.
  */
  const metrics = {
    profiles: "2,400+",
    cvs: "1,800+",
    paths: "120+",
    readiness: "94%",
  };

  const faqItems = [
    {
      q: "What is CareerUp AI?",
      a: "CareerUp AI is an AI-powered career intelligence platform that analyzes a person's skills, education, experience and goals to create a personalized career strategy.",
    },
    {
      q: "Can I start for free?",
      a: "Yes. The Free plan is designed for users who want to understand their profile and explore career options before upgrading.",
    },
    {
      q: "What do I get with Pro?",
      a: "Pro adds unlimited CV analysis, ATS optimization, job-description matching, advanced skill-gap analysis, personalized roadmaps, cover letters and AI interview preparation.",
    },
    {
      q: "What is Career Pro?",
      a: "Career Pro is the advanced plan for people actively pursuing a role or changing careers. It adds deeper coaching, interview simulations, job-specific tailoring, LinkedIn optimization and advanced career analytics.",
    },
    {
      q: "Can universities use CareerUp AI?",
      a: "Yes. The platform is designed to support universities, placement cells and career centers with employability analytics, student readiness insights and career preparation workflows.",
    },
    {
      q: "Is my CV data private?",
      a: "CareerUp AI is designed around privacy and user control. The production platform should connect this promise to your actual security architecture, storage policy and data deletion controls before launch.",
    },
  ];

  const monthlyPrice = billing === "monthly";
  const proPrice = monthlyPrice ? "499" : "4,990";
  const premiumPrice = monthlyPrice ? "999" : "9,990";

  return (
    <div className="min-h-screen overflow-hidden bg-[#070a12] text-white">
      <style>{`
        html { scroll-behavior: smooth; }

        @keyframes floatOne {
          0%,100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(30px,-25px,0); }
        }

        @keyframes floatTwo {
          0%,100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(-25px,25px,0); }
        }

        @keyframes pulseGlow {
          0%,100% { opacity:.25; transform:scale(1); }
          50% { opacity:.5; transform:scale(1.08); }
        }

        @keyframes shimmer {
          0% { transform:translateX(-150%); }
          100% { transform:translateX(150%); }
        }

        @keyframes drawLine {
          from { stroke-dashoffset:500; }
          to { stroke-dashoffset:0; }
        }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to { opacity:1; transform:translateY(0); }
        }

        @keyframes scan {
          0% { transform:translateY(-120%); opacity:0; }
          15% { opacity:1; }
          85% { opacity:1; }
          100% { transform:translateY(520%); opacity:0; }
        }

        @keyframes countPulse {
          0%,100% { opacity:.55; }
          50% { opacity:1; }
        }

        .hero-enter {
          animation:fadeUp .8s cubic-bezier(.22,1,.36,1) forwards;
        }

        .float-one { animation:floatOne 9s ease-in-out infinite; }
        .float-two { animation:floatTwo 11s ease-in-out infinite; }
        .pulse-glow { animation:pulseGlow 4s ease-in-out infinite; }

        .career-line {
          stroke-dasharray:500;
          stroke-dashoffset:500;
          animation:drawLine 2.2s ease-out .4s forwards;
        }

        .shine {
          position:absolute;
          inset:0;
          width:40%;
          background:linear-gradient(110deg,transparent,rgba(255,255,255,.15),transparent);
          animation:shimmer 4s ease-in-out infinite;
        }

        .scan-line {
          animation:scan 3.5s ease-in-out infinite;
        }

        .metric-pulse {
          animation:countPulse 3s ease-in-out infinite;
        }

        .glass {
          background:rgba(255,255,255,.045);
          border:1px solid rgba(255,255,255,.09);
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
        }

        .glass-light {
          background:rgba(255,255,255,.07);
          border:1px solid rgba(255,255,255,.11);
          backdrop-filter:blur(24px);
        }

        .gold-text {
          background:linear-gradient(100deg,#ffffff 0%,#f0d98a 45%,#d7b45a 100%);
          -webkit-background-clip:text;
          background-clip:text;
          color:transparent;
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);
          background-size:60px 60px;
        }

        .gold-border {
          box-shadow: inset 0 0 0 1px rgba(215,180,90,.25);
        }

        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior:auto; }
          *, *::before, *::after {
            animation-duration:.01ms !important;
            animation-iteration-count:1 !important;
            transition-duration:.01ms !important;
          }
        }
      `}</style>

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-0">
        <div
          className="float-one absolute left-[-180px] top-[100px] h-[500px] w-[500px] rounded-full blur-[140px]"
          style={{ background: "rgba(99,75,180,.20)" }}
        />
        <div
          className="float-two absolute right-[-160px] top-[700px] h-[500px] w-[500px] rounded-full blur-[140px]"
          style={{ background: "rgba(215,180,90,.10)" }}
        />
        <div
          className="pulse-glow absolute left-1/2 top-[900px] h-[350px] w-[350px] -translate-x-1/2 rounded-full blur-[130px]"
          style={{ background: "rgba(85,72,210,.12)" }}
        />
      </div>

      {/* NAVBAR */}
      <header className="relative z-50 border-b border-white/[0.07] bg-[#070a12]/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shadow-lg"
              style={{ background: GOLD, color: "#0b0e16" }}
            >
              C
            </div>
            <div>
              <div className="text-[17px] font-semibold tracking-tight">CareerUp AI</div>
              <div className="text-[9px] uppercase tracking-[0.24em] text-white/35">
                Career Intelligence
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#platform" className="text-sm text-white/55 transition hover:text-white">Platform</a>
            <a href="#how-it-works" className="text-sm text-white/55 transition hover:text-white">How it works</a>
            <a href="#pricing" className="text-sm text-white/55 transition hover:text-white">Pricing</a>
            <a href="#universities" className="text-sm text-white/55 transition hover:text-white">For Universities</a>
            <Link to="/login" className="text-sm text-white/60 transition hover:text-white">Login</Link>
            <Link
              to="/register"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[#0a0c12] transition hover:-translate-y-0.5"
              style={{ background: GOLD, boxShadow: "0 8px 25px rgba(215,180,90,.18)" }}
            >
              Get Started
            </Link>
          </nav>

          <button
            className="rounded-xl border border-white/10 p-2 md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle navigation"
          >
            <div className="space-y-1.5">
              <span className="block h-px w-5 bg-white/70" />
              <span className="block h-px w-5 bg-white/70" />
              <span className="block h-px w-5 bg-white/70" />
            </div>
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t border-white/[0.07] px-6 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <a href="#platform" onClick={() => setMobileMenu(false)} className="text-sm text-white/70">Platform</a>
              <a href="#how-it-works" onClick={() => setMobileMenu(false)} className="text-sm text-white/70">How it works</a>
              <a href="#pricing" onClick={() => setMobileMenu(false)} className="text-sm text-white/70">Pricing</a>
              <a href="#universities" onClick={() => setMobileMenu(false)} className="text-sm text-white/70">For Universities</a>
              <Link to="/login" className="text-sm text-white/70">Login</Link>
              <Link
                to="/register"
                className="rounded-xl px-5 py-3 text-center text-sm font-semibold text-[#0a0c12]"
                style={{ background: GOLD }}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* HERO */}
        <section className="grid-bg relative">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-32 lg:pt-28">
            <div className="hero-enter">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-xs text-white/60 backdrop-blur-xl">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: GOLD, boxShadow: `0 0 12px ${GOLD}` }}
                />
                AI-powered career intelligence
              </div>

              <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[76px]">
                Your career.
                <br />
                <span className="gold-text">Understood by AI.</span>
                <br />
                Built for what's next.
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
                CareerUp AI turns your skills, education, experience and ambitions
                into a personalized career strategy built around you.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl px-7 py-4 text-sm font-semibold text-[#0a0c12] transition hover:-translate-y-1"
                  style={{ background: GOLD, boxShadow: "0 15px 40px rgba(215,180,90,.18)" }}
                >
                  <span className="shine" />
                  <span className="relative">Build My Career Path</span>
                  <ArrowIcon />
                </Link>
                <a
                  href="#ai-demo"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-7 py-4 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  See AI in action
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/35">
                <span className="flex items-center gap-2"><CheckIcon /> Personalized insights</span>
                <span className="flex items-center gap-2"><CheckIcon /> AI-powered analysis</span>
                <span className="flex items-center gap-2"><CheckIcon /> Actionable roadmap</span>
              </div>
            </div>

            {/* Hero dashboard visual */}
            <div className="hero-enter relative" style={{ animationDelay: ".18s" }}>
              <div className="relative mx-auto max-w-[560px]">
                <div
                  className="absolute inset-8 rounded-full blur-[100px]"
                  style={{ background: "rgba(111,91,210,.18)" }}
                />

                <div className="glass-light relative overflow-hidden rounded-[32px] p-5 shadow-2xl shadow-black/30 sm:p-7">
                  <div className="mb-7 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Career Intelligence</p>
                      <p className="mt-1 text-sm font-semibold">Your career profile</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-[10px] text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      AI Ready
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold"
                      style={{ background: "linear-gradient(135deg,#7564e8,#4432b8)" }}
                    >
                      C
                    </div>
                    <div>
                      <p className="font-semibold">Career Profile</p>
                      <p className="text-xs text-white/35">Continuously improving</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/[0.08] bg-black/20 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/35">Career readiness</p>
                        <p className="mt-1 text-4xl font-semibold">87%</p>
                        <p className="mt-2 text-xs text-emerald-300">↑ 12% this month</p>
                      </div>
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[7px] border-white/5">
                        <div
                          className="absolute inset-[-7px] rounded-full"
                          style={{
                            background: "conic-gradient(#D7B45A 0 87%, transparent 87% 100%)",
                            mask: "radial-gradient(farthest-side, transparent calc(100% - 7px), #000 0)",
                            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 7px), #000 0)",
                          }}
                        />
                        <span className="text-lg font-semibold">87</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="mb-3 text-xs text-white/35">Detected strengths</p>
                    <div className="flex flex-wrap gap-2">
                      {["JavaScript", "React", "Python", "Problem Solving", "Communication"].map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[10px] text-white/55"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-7 border-t border-white/[0.07] pt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs text-white/35">Career trajectory</span>
                      <span className="text-[10px]" style={{ color: GOLD_LIGHT }}>+2 opportunities</span>
                    </div>

                    <svg viewBox="0 0 500 110" className="w-full">
                      <defs>
                        <linearGradient id="careerGradient" x1="0" y1="1" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6658C9" />
                          <stop offset="100%" stopColor="#D7B45A" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M10 92 C80 88 90 68 150 70 C210 72 220 40 285 47 C350 54 360 25 490 12"
                        fill="none"
                        stroke="url(#careerGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="career-line"
                      />
                      {[10, 150, 285, 490].map((x, i) => (
                        <circle
                          key={x}
                          cx={x}
                          cy={[92, 70, 47, 12][i]}
                          r="4"
                          fill={i === 3 ? GOLD : "#7066C9"}
                        />
                      ))}
                    </svg>

                    <div className="flex justify-between text-[9px] text-white/25">
                      <span>Now</span><span>Skill growth</span><span>Next role</span><span>Target</span>
                    </div>
                  </div>
                </div>

                <div className="glass absolute -bottom-7 -left-5 hidden w-[230px] rounded-2xl p-4 shadow-2xl sm:block">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{ background: "rgba(215,180,90,.12)", color: GOLD_LIGHT }}
                    >
                      <SparkIcon />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">AI insight</p>
                      <p className="mt-1 text-[10px] leading-4 text-white/35">
                        Your strongest path is Full-Stack Engineering.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass absolute -right-5 top-20 hidden rounded-2xl p-4 shadow-2xl sm:block">
                  <p className="text-[9px] uppercase tracking-widest text-white/30">Career match</p>
                  <div className="mt-1 flex items-end gap-1">
                    <span className="text-2xl font-semibold" style={{ color: GOLD_LIGHT }}>94</span>
                    <span className="mb-1 text-xs text-white/30">%</span>
                  </div>
                  <p className="mt-1 text-[9px] text-emerald-300">Excellent fit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE PLATFORM METRICS */}
        <section className="border-y border-white/[0.07] bg-white/[0.018]">
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
            <div className="mb-7 text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/25">
                CareerUp AI platform activity
              </p>
              <p className="mt-2 text-sm text-white/45">
                A growing intelligence layer for ambitious careers
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <Metric value={metrics.profiles} label="Profiles analyzed" />
              <Metric value={metrics.cvs} label="CVs improved" />
              <Metric value={metrics.paths} label="Career paths mapped" />
              <Metric value={metrics.readiness} label="Demo readiness score" />
            </div>

            <p className="mt-7 text-center text-[9px] text-white/20">
              * Demo launch metrics shown for the prototype. Replace with verified live platform data before public launch.
            </p>
          </div>
        </section>

        {/* AI DEMO */}
        <section id="ai-demo" className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <div className="grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <SectionLabel>The AI career engine</SectionLabel>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Upload your CV.
                <br />
                <span className="text-white/35">Watch intelligence happen.</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/40">
                CareerUp AI can transform an ordinary CV into a living career profile,
                identify your strongest skills, expose gaps and connect your profile
                to realistic career directions.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  ["01", "CV extraction", "Education, experience, projects and skills are structured."],
                  ["02", "Skill intelligence", "Your strengths and development gaps become measurable."],
                  ["03", "Career matching", "Potential roles are ranked against your current profile."],
                  ["04", "Roadmap generation", "Your next learning and career actions become clear."],
                ].map(([n, title, text]) => (
                  <div key={n} className="flex gap-4">
                    <span className="mt-0.5 text-xs font-semibold" style={{ color: GOLD }}>{n}</span>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-white/30">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute inset-0 rounded-[40px] blur-[90px]"
                style={{ background: "rgba(105,87,200,.12)" }}
              />

              <div className="glass relative overflow-hidden rounded-[34px] p-5 sm:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">Live AI simulation</p>
                    <p className="mt-1 font-semibold">Analyzing your career profile</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-300">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    Processing
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080B13] p-5">
                  <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#D7B45A] to-transparent scan-line" />

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05]">
                      <ResumeIcon />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Nityansh_CV.pdf</p>
                      <p className="mt-1 text-[10px] text-white/30">2.4 MB · Profile extraction</p>
                    </div>
                    <span className="ml-auto text-xs text-emerald-300">✓ Ready</span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {[
                      ["Education", "BCA · Computer Applications", 96],
                      ["Technical skills", "React · JavaScript · Python · C++", 91],
                      ["Projects", "3 relevant projects detected", 88],
                      ["Career direction", "Software Engineering", 84],
                    ].map(([label, text, value]) => (
                      <div key={label}>
                        <div className="mb-2 flex justify-between gap-3 text-xs">
                          <span className="text-white/40">{label}</span>
                          <span className="text-white/65">{text}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#6556C5] to-[#D7B45A]"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ["91%", "Profile match"],
                    ["84%", "Career fit"],
                    ["73%", "Skill readiness"],
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                      <p className="text-xl font-semibold" style={{ color: GOLD_LIGHT }}>{value}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/25">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLATFORM FEATURES */}
        <section id="platform" className="border-y border-white/[0.07] bg-[#0B0F1B]">
          <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
            <div className="max-w-2xl">
              <SectionLabel>One intelligent platform</SectionLabel>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Everything you need to
                <span className="text-white/40"> move forward.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/40">
                From your first skill assessment to your next opportunity, CareerUp AI
                connects the pieces of your career into one intelligent system.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard number="01" icon={<TargetIcon />} title="Career Discovery" text="Discover roles that fit your skills, interests, education and goals." />
              <FeatureCard number="02" icon={<BrainIcon />} title="AI Skill Analysis" text="Understand what you're good at and uncover the capabilities holding you back." />
              <FeatureCard number="03" icon={<ResumeIcon />} title="Resume Intelligence" text="Turn your resume into a stronger, more targeted representation of your potential." />
              <FeatureCard number="04" icon={<RoadmapIcon />} title="Career Roadmap" text="Get a step-by-step learning and career strategy designed around your destination." />
              <FeatureCard number="05" icon={<BriefcaseIcon />} title="Job Match Engine" text="Compare your profile against job descriptions and see where you stand." />
              <FeatureCard number="06" icon={<MessageIcon />} title="AI Career Coach" text="Ask career questions and receive context-aware guidance whenever you need it." />
              <FeatureCard number="07" icon={<SparkIcon />} title="Interview Simulator" text="Practice realistic interviews and receive structured feedback on your answers." />
              <FeatureCard number="08" icon={<ShieldIcon />} title="Career Progress" text="Track your readiness, goals, applications and development over time." />
            </div>
          </div>
        </section>

        {/* INTELLIGENCE */}
        <section id="intelligence" className="relative overflow-hidden">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-28 lg:grid-cols-2 lg:px-10">
            <div>
              <SectionLabel>Career intelligence</SectionLabel>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Your career is
                <br />
                <span className="text-white/35">more than a resume.</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/40">
                CareerUp AI looks beyond job titles. It connects your existing abilities
                with opportunities, identifies gaps and turns that information into a practical plan.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Understand your current career position",
                  "Identify the highest-value skills to learn",
                  "Match your profile to realistic opportunities",
                  "Build a personalized path toward your target",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-white/60">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full"
                      style={{ color: GOLD, background: "rgba(215,180,90,.10)" }}
                    >
                      <CheckIcon />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="mt-9 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium transition hover:bg-white/[0.08]"
              >
                Discover your path <ArrowIcon />
              </Link>
            </div>

            <div className="relative">
              <div
                className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
                style={{ background: "rgba(105,87,200,.16)" }}
              />
              <div className="glass relative rounded-[32px] p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/30">AI Career Engine</p>
                    <p className="mt-1 font-semibold">Profile intelligence</p>
                  </div>
                  <div
                    className="rounded-full px-3 py-1 text-[9px]"
                    style={{ color: GOLD_LIGHT, background: "rgba(215,180,90,.09)" }}
                  >
                    LIVE ANALYSIS
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  {[
                    ["Technical Skills", 91],
                    ["Communication", 78],
                    ["Leadership", 64],
                    ["Problem Solving", 88],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-white/45">{label}</span>
                        <span className="text-white/70">{value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#6556C5] to-[#D7B45A]"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 rounded-2xl border border-white/[0.08] bg-black/20 p-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ color: GOLD_LIGHT, background: "rgba(215,180,90,.1)" }}
                    >
                      <SparkIcon />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">AI recommendation</p>
                      <p className="mt-1 text-xs leading-5 text-white/35">
                        Strengthen your system design skills to unlock higher-level engineering roles.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    ["91%", "Software Engineer"],
                    ["84%", "Data Analyst"],
                    ["76%", "Product Manager"],
                  ].map(([score, role]) => (
                    <div key={role} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">
                      <p className="text-lg font-semibold" style={{ color: GOLD_LIGHT }}>{score}</p>
                      <p className="mt-1 text-[9px] leading-3 text-white/30">{role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SKILL GAP / ROADMAP */}
        <section className="border-y border-white/[0.07] bg-white/[0.018]">
          <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
            <div className="text-center">
              <SectionLabel>From gap to growth</SectionLabel>
              <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Don't just know what you want.
                <br />
                <span className="text-white/35">Know what to do next.</span>
              </h2>
            </div>

            <div className="mt-16 grid gap-5 lg:grid-cols-3">
              <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/35">Target role</p>
                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[9px] text-emerald-300">91% match</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold">Software Engineer</h3>
                <p className="mt-2 text-xs leading-5 text-white/30">Your current profile is close. These gaps are the highest priority.</p>

                <div className="mt-7 space-y-4">
                  {[
                    ["System Design", 46],
                    ["Cloud / AWS", 38],
                    ["DSA", 72],
                    ["React", 91],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between text-[11px]">
                        <span className="text-white/40">{label}</span>
                        <span className="text-white/60">{value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#6556C5] to-[#D7B45A]" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-6">
                <p className="text-xs text-white/35">Your 90-day roadmap</p>
                <div className="mt-6 space-y-0">
                  {[
                    ["NOW", "Complete profile + CV optimization", true],
                    ["30 DAYS", "Build 2 targeted portfolio projects", true],
                    ["60 DAYS", "Practice technical interviews", false],
                    ["90 DAYS", "Begin targeted applications", false],
                  ].map(([time, task, done], index) => (
                    <div key={time} className="relative flex gap-4 pb-7">
                      {index < 3 && <div className="absolute left-[7px] top-4 h-full w-px bg-white/[0.08]" />}
                      <div
                        className="relative z-10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                        style={{
                          borderColor: done ? GOLD : "rgba(255,255,255,.18)",
                          background: done ? GOLD : "#0D111D",
                          color: "#080A10",
                        }}
                      >
                        {done && <CheckIcon size={10} />}
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold tracking-[0.15em]" style={{ color: GOLD }}>{time}</p>
                        <p className="mt-1 text-sm text-white/65">{task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-6">
                <p className="text-xs text-white/35">Job description match</p>
                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-semibold" style={{ color: GOLD_LIGHT }}>86%</span>
                  <span className="mb-2 text-xs text-emerald-300">Strong fit</span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    ["Required skills", "8 / 9"],
                    ["Experience", "Strong"],
                    ["Education", "Matched"],
                    ["Missing skill", "AWS"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 text-xs">
                      <span className="text-white/35">{label}</span>
                      <span className="text-white/70">{value}</span>
                    </div>
                  ))}
                </div>

                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-xs font-medium transition hover:bg-white/[0.08]">
                  Tailor my CV <ArrowIcon />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <div className="text-center">
            <SectionLabel>The journey</SectionLabel>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              From where you are
              <br />
              <span className="text-white/35">to where you want to be.</span>
            </h2>
          </div>

          <div className="relative mt-16 grid gap-4 md:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-[32px] hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
            {[
              ["01", "Create your profile", "Tell CareerUp AI about your education, skills, experience and ambitions."],
              ["02", "Get analyzed", "Our intelligence layer builds a picture of your strengths and career potential."],
              ["03", "Discover your path", "Explore career matches and understand exactly what skills you need next."],
              ["04", "Build your future", "Follow your roadmap, track progress and keep moving toward your target."],
            ].map(([number, title, text]) => (
              <div key={number} className="relative rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6">
                <div
                  className="relative z-10 mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border text-sm font-semibold"
                  style={{
                    borderColor: "rgba(215,180,90,.25)",
                    background: "linear-gradient(135deg,rgba(215,180,90,.14),rgba(255,255,255,.03))",
                    color: GOLD_LIGHT,
                  }}
                >
                  {number}
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/35">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI COACH */}
        <section className="border-y border-white/[0.07] bg-[#0B0F1B]">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-28 lg:grid-cols-[1fr_.95fr] lg:px-10">
            <div>
              <SectionLabel>Your always-on career coach</SectionLabel>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Ask better questions.
                <br />
                <span className="text-white/35">Make better moves.</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/40">
                A future CareerUp AI coach can use your profile, target role and progress
                to give advice that is actually contextual to your career.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "What should I learn next?",
                  "Why am I not getting interviews?",
                  "Review this job description",
                  "Prepare me for an interview",
                ].map((q) => (
                  <span key={q} className="rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-xs text-white/45">
                    {q}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass rounded-[30px] p-5 sm:p-6">
              <div className="flex items-center gap-3 border-b border-white/[0.07] pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "rgba(215,180,90,.1)", color: GOLD_LIGHT }}>
                  <SparkIcon />
                </div>
                <div>
                  <p className="text-sm font-semibold">CareerUp AI Coach</p>
                  <p className="text-[10px] text-emerald-300">Profile-aware guidance</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-md bg-white/[0.06] p-4 text-xs leading-5 text-white/55">
                  I want to become a software engineer. What should I focus on for the next 90 days?
                </div>
                <div className="max-w-[88%] rounded-2xl rounded-tl-md border border-white/[0.07] bg-[#080B13] p-4 text-xs leading-5 text-white/50">
                  Based on your current profile, prioritize <span style={{ color: GOLD_LIGHT }}>system design, DSA and cloud fundamentals</span>. Your React and JavaScript foundation is already strong.
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-white/[0.035] p-3"><p className="font-semibold text-white/70">30d</p><p className="mt-1 text-[9px] text-white/25">Skill foundation</p></div>
                    <div className="rounded-xl bg-white/[0.035] p-3"><p className="font-semibold text-white/70">60d</p><p className="mt-1 text-[9px] text-white/25">Projects</p></div>
                    <div className="rounded-xl bg-white/[0.035] p-3"><p className="font-semibold text-white/70">90d</p><p className="mt-1 text-[9px] text-white/25">Applications</p></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs text-white/25">
                Ask CareerUp AI anything about your next move...
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <div className="text-center">
            <SectionLabel>Simple, transparent pricing</SectionLabel>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Start free.
              <br />
              <span className="text-white/35">Upgrade when you're serious.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/35">
              Career intelligence for every stage, from exploring your first career path
              to aggressively preparing for your next role.
            </p>

            <div className="mt-7 inline-flex rounded-full border border-white/[0.08] bg-white/[0.025] p-1">
              <button
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                  monthlyPrice ? "bg-white text-[#0A0C12]" : "text-white/35"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                  !monthlyPrice ? "bg-white text-[#0A0C12]" : "text-white/35"
                }`}
              >
                Yearly · 2 months free
              </button>
            </div>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            <PricingCard
              name="Free"
              price="0"
              description="Explore your potential"
              dark
              cta="Start Free"
              features={[
                "AI career profile",
                "Basic CV analysis",
                "1 CV",
                "Basic skill-gap analysis",
                "3 career recommendations",
                "Basic career roadmap",
                "Basic AI career assistant",
              ]}
            />

            <PricingCard
              name="Pro"
              price={proPrice}
              description="Get serious about your career"
              popular
              dark
              cta="Upgrade to Pro"
              features={[
                "Everything in Free",
                "Unlimited CV analysis",
                "AI CV Builder",
                "ATS optimization",
                "Unlimited career matches",
                "Advanced skill-gap analysis",
                "Personalized career roadmap",
                "AI cover letters",
                "Job-description matching",
                "AI interview preparation",
                "Career progress tracking",
                "Priority AI analysis",
              ]}
            />

            <PricingCard
              name="Premium"
              price={premiumPrice}
              description="Your advanced career advantage"
              cta="Go Premium"
              features={[
                "Everything in Pro",
                "Advanced AI career coach",
                "Job application strategy",
                "Multiple CV versions",
                "Job-specific CV tailoring",
                "Interview simulations",
                "LinkedIn profile optimization",
                "Portfolio guidance",
                "Career transition planning",
                "Advanced career analytics",
                "Priority support",
              ]}
            />
          </div>

          <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 text-center">
            <p className="text-xs text-white/35">
              All plans are designed to be transparent. Payment integration can be connected later through your preferred gateway.
            </p>
          </div>
        </section>

        {/* UNIVERSITIES / B2B */}
        <section id="universities" className="border-y border-white/[0.07] bg-[#0B0F1B]">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-28 lg:grid-cols-[.9fr_1.1fr] lg:px-10">
            <div>
              <SectionLabel>CareerUp AI for organizations</SectionLabel>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Power the future of
                <br />
                <span className="gold-text">student employability.</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/40">
                Give universities, placement cells and career centers an intelligent
                layer for understanding student readiness, skill gaps and career direction.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Student employability analytics",
                  "Department-wise readiness",
                  "Skill-gap trends",
                  "CV quality insights",
                  "Placement preparation",
                  "AI interview preparation",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-white/55">
                    <span style={{ color: GOLD }}><CheckIcon /></span>
                    {item}
                  </div>
                ))}
              </div>

              <button className="mt-9 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[#0A0C12]" style={{ background: GOLD }}>
                Partner with CareerUp AI <ArrowIcon />
              </button>
            </div>

            <div className="glass overflow-hidden rounded-[32px] p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">University dashboard</p>
                  <p className="mt-1 font-semibold">Employability intelligence</p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[9px] text-emerald-300">LIVE</span>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["4,820", "Students"],
                  ["3,914", "CVs improved"],
                  ["2,706", "Career-ready"],
                  ["1,892", "Placement pipeline"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                    <p className="text-xl font-semibold">{value}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-white/25">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-white/35">Career readiness by department</p>
                  <p className="text-[9px]" style={{ color: GOLD }}>This semester</p>
                </div>

                <div className="mt-5 space-y-4">
                  {[
                    ["Computer Applications", 86],
                    ["Computer Science", 82],
                    ["Management", 71],
                    ["Commerce", 68],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between text-[10px]">
                        <span className="text-white/40">{label}</span>
                        <span className="text-white/60">{value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#6556C5] to-[#D7B45A]" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUCCESS STORIES */}
        <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>Outcomes that matter</SectionLabel>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Build confidence.
                <br />
                <span className="text-white/35">Then build your career.</span>
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-5 text-white/25">
              Use real user outcomes here once your startup has verified stories.
              Never publish invented testimonials.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              ["Student → Developer", "Career clarity", "“I finally understood which skills were actually missing from my profile.”"],
              ["Graduate → Analyst", "Targeted CV", "“Instead of applying everywhere, I could focus my applications around realistic roles.”"],
              ["Career switcher → Tech", "90-day roadmap", "“The roadmap gave me a sequence instead of a giant list of things to learn.”"],
            ].map(([role, outcome, quote]) => (
              <div key={role} className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/[0.08] px-3 py-1 text-[9px] text-white/35">{role}</span>
                  <span className="text-[9px]" style={{ color: GOLD }}>{outcome}</span>
                </div>
                <p className="mt-7 text-sm leading-6 text-white/55">{quote}</p>
                <div className="mt-7 border-t border-white/[0.07] pt-5 text-[9px] uppercase tracking-[0.15em] text-white/20">
                  Placeholder story · replace with verified user
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST / SECURITY */}
        <section className="border-y border-white/[0.07] bg-white/[0.018]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
              <div>
                <SectionLabel>Built with trust in mind</SectionLabel>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
                  Your career data
                  <br />
                  <span className="text-white/35">should stay yours.</span>
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  [<ShieldIcon />, "Secure account", "Protected access"],
                  [<ResumeIcon />, "CV controls", "Manage your files"],
                  [<CheckIcon size={21} />, "User control", "Delete when needed"],
                  [<SparkIcon />, "AI transparency", "Clear recommendations"],
                ].map(([icon, title, text]) => (
                  <div key={title} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                    <div style={{ color: GOLD_LIGHT }}>{icon}</div>
                    <p className="mt-4 text-xs font-semibold">{title}</p>
                    <p className="mt-1 text-[10px] text-white/25">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-7 text-center text-[9px] text-white/20">
              Security claims on the production site should reflect the controls actually implemented in your backend and infrastructure.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-6 py-28">
          <div className="text-center">
            <SectionLabel>Questions, answered</SectionLabel>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Everything you need
              <br />
              <span className="text-white/35">to know before starting.</span>
            </h2>
          </div>

          <div className="mt-12 space-y-3">
            {faqItems.map((item, index) => {
              const open = openFaq === index;
              return (
                <div key={item.q} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
                  <button
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left"
                    onClick={() => setOpenFaq(open ? null : index)}
                  >
                    <span className="text-sm font-medium">{item.q}</span>
                    <ChevronIcon open={open} />
                  </button>
                  {open && (
                    <div className="border-t border-white/[0.07] px-5 pb-5 pt-4 text-xs leading-6 text-white/35">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 pb-28 lg:px-10">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-white/10">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%,rgba(111,91,210,.22),transparent 40%),radial-gradient(circle at 80% 80%,rgba(215,180,90,.12),transparent 40%),#0d111d",
              }}
            />
            <div className="grid-bg relative px-7 py-16 text-center sm:px-12 sm:py-20">
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: "rgba(215,180,90,.1)", color: GOLD_LIGHT }}
              >
                <SparkIcon />
              </div>

              <h2 className="mx-auto mt-7 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
                Your next opportunity
                <br />
                <span className="gold-text">starts with clarity.</span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/40">
                Stop guessing what to learn, what roles fit or why applications aren't working.
                Start building a career strategy around your actual potential.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl px-7 py-4 text-sm font-semibold text-[#0a0c12] transition hover:-translate-y-1"
                  style={{ background: GOLD, boxShadow: "0 15px 40px rgba(215,180,90,.2)" }}
                >
                  Start free <ArrowIcon />
                </Link>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-medium text-white/65 transition hover:bg-white/[0.08]"
                >
                  View pricing
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.07] bg-[#05070d]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold"
                  style={{ background: GOLD, color: "#080a10" }}
                >
                  C
                </div>
                <div>
                  <p className="text-sm font-semibold">CareerUp AI</p>
                  <p className="text-[10px] text-white/25">Career intelligence for what's next.</p>
                </div>
              </div>
              <p className="mt-5 max-w-xs text-xs leading-5 text-white/25">
                Understand your skills. Discover your opportunities. Build your next move.
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">Product</p>
              <div className="mt-4 space-y-3 text-xs text-white/35">
                <a className="block hover:text-white" href="#platform">Platform</a>
                <a className="block hover:text-white" href="#intelligence">AI Intelligence</a>
                <a className="block hover:text-white" href="#pricing">Pricing</a>
                <a className="block hover:text-white" href="#how-it-works">How it works</a>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">Solutions</p>
              <div className="mt-4 space-y-3 text-xs text-white/35">
                <a className="block hover:text-white" href="#platform">Students</a>
                <a className="block hover:text-white" href="#universities">Universities</a>
                <a className="block hover:text-white" href="#universities">Career Centers</a>
                <Link className="block hover:text-white" to="/register">Get Started</Link>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">Account</p>
              <div className="mt-4 space-y-3 text-xs text-white/35">
                <Link className="block hover:text-white" to="/login">Login</Link>
                <Link className="block hover:text-white" to="/register">Create account</Link>
                <Link className="block hover:text-white" to="/dashboard">Dashboard</Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/[0.07] pt-6 sm:flex-row">
            <p className="text-[10px] text-white/20">© 2026 CareerUp AI. All rights reserved.</p>
            <p className="text-[10px] text-white/20">Built for what's next.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

<<<<<<< Updated upstream
export default App;
=======
export default App;
>>>>>>> Stashed changes
