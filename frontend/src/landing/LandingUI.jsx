import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export function Arrow({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function Spark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3-1.8 6.2L4 11l6.2 1.8L12 19l1.8-6.2L20 11l-6.2-1.8L12 3Z" />
      <path d="m19 17-.7 2.2L16 20l2.3.8L19 23l.8-2.2L22 20l-2.2-.8L19 17Z" />
    </svg>
  );
}

export function BrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 4.5a3 3 0 0 0-5 2.2A3.2 3.2 0 0 0 4.8 13 3 3 0 0 0 7 18.5a3 3 0 0 0 5 1.8V5.5A3 3 0 0 0 9 4.5Z" />
      <path d="M15 4.5a3 3 0 0 1 5 2.2 3.2 3.2 0 0 1-.8 6.3 3 3 0 0 1-2.2 5.5 3 3 0 0 1-5 1.8V5.5a3 3 0 0 1 3-1Z" />
    </svg>
  );
}

export function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2h8l4 4v16H6z" />
      <path d="M14 2v5h5M9 12h6M9 16h5" />
    </svg>
  );
}

export function RouteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="5" cy="18" r="2" />
      <circle cx="12" cy="6" r="2" />
      <circle cx="19" cy="15" r="2" />
      <path d="m7 16.5 3.8-8M14 7l3.8 6" />
    </svg>
  );
}

export function CompassIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" />
    </svg>
  );
}

export function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19V9M10 19V5M16 19v-7M22 19V3" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function TiltCard({ children, className = "", intensity = 8 }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glowX: 50, glowY: 50 });

  const onMove = (event) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    setTilt({
      x: -(py - 0.5) * intensity,
      y: (px - 0.5) * intensity,
      glowX: px * 100,
      glowY: py * 100,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0, glowX: 50, glowY: 50 })}
      className={"tilt-card " + className}
      style={{
        transform:
          "perspective(1200px) rotateX(" +
          tilt.x +
          "deg) rotateY(" +
          tilt.y +
          "deg) translateZ(0)",
        "--glow-x": String(tilt.glowX) + "%",
        "--glow-y": String(tilt.glowY) + "%",
      }}
    >
      {children}
    </div>
  );
}

export function IntelligenceCore({ pointer }) {
  const sceneTransform =
    "translate3d(" +
    pointer.x * 18 +
    "px," +
    pointer.y * 14 +
    "px,0) rotateX(" +
    pointer.y * -6 +
    "deg) rotateY(" +
    pointer.x * 8 +
    "deg)";

  return (
    <div className="intelligence-stage relative mx-auto h-[470px] w-full max-w-[620px] select-none sm:h-[560px]">
      <div className="intelligence-aura pointer-events-none absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="intelligence-ring intelligence-ring-a pointer-events-none absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[.07]" />
      <div className="intelligence-ring intelligence-ring-b pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[.035]" />

      <div className="intelligence-scene absolute inset-0 transition-transform duration-200 ease-out" style={{ transform: sceneTransform }}>
        <div className="hero-panel hero-panel-left absolute left-[0%] top-[18%] z-20 w-[170px] rounded-2xl border border-white/[.09] bg-[#0a0d16]/86 p-4 backdrop-blur-xl sm:left-[2%] sm:w-[184px]">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[.17em] text-white/35">Resume signal</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#d9b45a]" />
          </div>
          <div className="mt-4 flex items-end gap-2">
            <span className="career-display text-3xl font-extrabold tracking-[-.06em]">82</span>
            <span className="pb-1 text-[10px] font-semibold text-white/30">/ 100</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[.06]">
            <div className="hero-signal-fill h-full w-[82%] rounded-full bg-gradient-to-r from-[#d9b45a] to-[#efd080]" />
          </div>
        </div>

        <div className="hero-panel hero-panel-right absolute bottom-[15%] right-[0%] z-20 w-[188px] rounded-2xl border border-white/[.09] bg-[#0a0d16]/86 p-4 backdrop-blur-xl sm:right-[1%] sm:w-[205px]">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.17em] text-[#76d7c4]/75">
            <Spark size={12} /> Next best move
          </div>
          <p className="mt-3 text-sm font-bold leading-5 text-white/78">Ship one production-ready full-stack project.</p>
          <p className="mt-2 text-[10px] font-medium leading-4 text-white/34">Highest-value action for your current target.</p>
        </div>

        <div className="intelligence-card absolute left-1/2 top-1/2 z-30 w-[min(84%,390px)] -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-white/[.11] bg-[#0a0d16]/94 p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
          <div className="intelligence-card-sheen pointer-events-none absolute inset-0 overflow-hidden rounded-[30px]" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[.19em] text-[#d9b45a]/76">
                  CareerUpAI Intelligence
                </p>
                <p className="mt-1 text-[10px] font-semibold text-white/30">Live profile snapshot</p>
              </div>
              <span className="pulse-dot h-2 w-2 rounded-full bg-[#76d7c4]" />
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-white/32">Strongest path</p>
                <h3 className="career-display mt-2 text-2xl font-extrabold tracking-[-.045em] sm:text-[28px]">
                  Full Stack Engineer
                </h3>
                <p className="mt-1 text-xs font-semibold text-white/36">Best current fit</p>
              </div>

              <div className="match-orb flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full">
                <div className="flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#0a0d16]">
                  <div className="text-center">
                    <p className="career-display text-xl font-extrabold tracking-[-.04em]">91%</p>
                    <p className="text-[7px] font-bold uppercase tracking-[.12em] text-white/28">match</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#76d7c4]/12 bg-[#76d7c4]/[.035] p-3.5">
                <p className="text-[8px] font-extrabold uppercase tracking-[.16em] text-[#76d7c4]/70">Strong</p>
                <p className="mt-2 text-xs font-bold leading-5 text-white/68">React · Node · MongoDB</p>
              </div>
              <div className="rounded-2xl border border-[#d9b45a]/12 bg-[#d9b45a]/[.035] p-3.5">
                <p className="text-[8px] font-extrabold uppercase tracking-[.16em] text-[#d9b45a]/70">Improve</p>
                <p className="mt-2 text-xs font-bold leading-5 text-white/68">TypeScript · Docker</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/[.065] bg-white/[.022] p-3.5">
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[.15em] text-white/28">
                <span>Readiness</span>
                <span className="text-white/52">91%</span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[.055]">
                <div className="hero-readiness-fill h-full w-[91%] rounded-full bg-gradient-to-r from-[#7867ff] via-[#d9b45a] to-[#76d7c4]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const systemCards = [
  {
    icon: <FileIcon />,
    tag: "Analyze",
    title: "Resume Intelligence",
    text: "Find weak evidence, missing skills and role-alignment gaps hidden inside your current resume.",
    href: "/resume-intelligence",
  },
  {
    icon: <BrainIcon />,
    tag: "Understand",
    title: "Career Intelligence",
    text: "Discover suitable paths, compare readiness and understand exactly why each role matches you.",
    href: "/career-intelligence",
  },
  {
    icon: <RouteIcon />,
    tag: "Act",
    title: "Personal Roadmaps",
    text: "Turn your gaps into a clear progression of skills, projects and milestones toward your target role.",
    href: "/roadmaps",
  },
];

export function FeatureCard({ item, index }) {
  return (
    <TiltCard className="group rounded-[28px] border border-white/[.075] bg-white/[.025] p-6 sm:p-7">
      <div className="flex items-start justify-between">
        <span
          className={
            "flex h-11 w-11 items-center justify-center rounded-2xl border " +
            (index === 1
              ? "border-[#7867ff]/20 bg-[#7867ff]/10 text-[#a79dff]"
              : "border-[#d9b45a]/20 bg-[#d9b45a]/[.08] text-[#efd080]")
          }
        >
          {item.icon}
        </span>
        <span className="rounded-full border border-white/[.07] px-2.5 py-1 text-[9px] uppercase tracking-[.16em] text-white/28">
          {item.tag}
        </span>
      </div>
      <h3 className="mt-12 text-2xl font-semibold tracking-[-.035em]">{item.title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/38">{item.text}</p>
      <Link
        to={item.href}
        className="mt-7 inline-flex items-center gap-2 text-sm text-white/45 transition group-hover:text-[#efd080]"
      >
        Explore feature <Arrow size={15} />
      </Link>
    </TiltCard>
  );
}
