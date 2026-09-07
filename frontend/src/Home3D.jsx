import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Arrow({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function Spark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.8 6.2L4 11l6.2 1.8L12 19l1.8-6.2L20 11l-6.2-1.8L12 3Z" />
      <path d="m19 17-.7 2.2L16 20l2.3.8L19 23l.8-2.2L22 20l-2.2-.8L19 17Z" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4.5a3 3 0 0 0-5 2.2A3.2 3.2 0 0 0 4.8 13 3 3 0 0 0 7 18.5a3 3 0 0 0 5 1.8V5.5A3 3 0 0 0 9 4.5Z" />
      <path d="M15 4.5a3 3 0 0 1 5 2.2 3.2 3.2 0 0 1-.8 6.3 3 3 0 0 1-2.2 5.5 3 3 0 0 1-5 1.8V5.5a3 3 0 0 1 3-1Z" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2h8l4 4v16H6z" />
      <path d="M14 2v5h5M9 12h6M9 16h5" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="18" r="2" />
      <circle cx="12" cy="6" r="2" />
      <circle cx="19" cy="15" r="2" />
      <path d="m7 16.5 3.8-8M14 7l3.8 6" />
    </svg>
  );
}

function TiltCard({ children, className = "", intensity = 10 }) {
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
      className={`tilt-card ${className}`}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
        "--glow-x": `${tilt.glowX}%`,
        "--glow-y": `${tilt.glowY}%`,
      }}
    >
      {children}
    </div>
  );
}

function IntelligenceCore({ pointer }) {
  const coreStyle = {
    transform: `translate3d(${pointer.x * 18}px, ${pointer.y * 14}px, 0) rotateX(${pointer.y * -6}deg) rotateY(${pointer.x * 8}deg)`,
  };

  return (
    <div className="relative mx-auto h-[480px] w-full max-w-[580px] select-none sm:h-[560px]">
      <div className="core-halo absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="core-beam core-beam-a absolute left-1/2 top-1/2 h-[2px] w-[370px] -translate-x-1/2 -translate-y-1/2" />
      <div className="core-beam core-beam-b absolute left-1/2 top-1/2 h-[2px] w-[370px] -translate-x-1/2 -translate-y-1/2" />
      <div className="orbit orbit-a absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <div className="orbit orbit-b absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
      <div className="orbit orbit-c absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]" />

      <div className="core-stage absolute inset-0 transition-transform duration-200 ease-out" style={coreStyle}>
        <div className="core-float absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <div className="core-shell relative flex h-44 w-44 items-center justify-center rounded-[42px] border border-white/15 bg-white/[0.06] shadow-2xl backdrop-blur-2xl sm:h-52 sm:w-52">
            <div className="scan-surface absolute inset-3 rounded-[34px]" />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-[34px] border border-[#d9b45a]/35 bg-[#0b0f1a] shadow-[0_0_80px_rgba(217,180,90,.18)] sm:h-32 sm:w-32">
              <div className="absolute inset-3 rounded-[26px] border border-white/[0.06]" />
              <span className="gold-gradient text-5xl font-semibold tracking-[-0.08em]">C</span>
            </div>
          </div>
        </div>

        <div className="float-card float-card-a absolute left-0 top-[15%] z-30 w-[190px] rounded-2xl border border-white/10 bg-[#0b0f19]/80 p-4 shadow-2xl backdrop-blur-xl sm:left-[-10px]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7867ff]/10 text-[#9f94ff]"><BrainIcon /></span>
            <div><p className="text-[10px] uppercase tracking-[.18em] text-white/30">Career fit</p><p className="mt-1 text-sm font-semibold">Software Engineer</p></div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="data-fill h-full w-[91%] rounded-full bg-gradient-to-r from-[#7867ff] to-[#d9b45a]" /></div>
          <p className="mt-2 text-right text-[10px] text-white/35">91% match</p>
        </div>

        <div className="float-card float-card-b absolute right-0 top-[19%] z-30 w-[170px] rounded-2xl border border-white/10 bg-[#0b0f19]/80 p-4 shadow-2xl backdrop-blur-xl sm:right-[-4px]">
          <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d9b45a]/10 text-[#efd080]"><FileIcon /></span><div><p className="text-[10px] uppercase tracking-[.18em] text-white/30">Resume</p><p className="mt-1 text-sm font-semibold">Analyzed</p></div></div>
          <p className="mt-4 text-xs leading-5 text-white/35">12 strengths · 4 gaps</p>
        </div>

        <div className="float-card float-card-c absolute bottom-[13%] left-[5%] z-30 w-[178px] rounded-2xl border border-white/10 bg-[#0b0f19]/80 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between"><span className="text-[10px] uppercase tracking-[.18em] text-white/30">Readiness</span><span className="text-xs text-emerald-300">+18%</span></div>
          <p className="mt-2 text-3xl font-semibold tracking-[-.05em]">84<span className="text-base text-white/30">/100</span></p>
        </div>

        <div className="float-card float-card-d absolute bottom-[8%] right-[5%] z-30 w-[188px] rounded-2xl border border-white/10 bg-[#0b0f19]/80 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d9b45a]/10 text-[#efd080]"><RouteIcon /></span><div><p className="text-[10px] uppercase tracking-[.18em] text-white/30">Next move</p><p className="mt-1 text-sm font-semibold">System Design</p></div></div>
          <p className="mt-3 text-[11px] leading-4 text-white/35">Highest-value skill to unlock your target role.</p>
        </div>
      </div>
    </div>
  );
}

const featureItems = [
  { icon: <FileIcon />, title: "Resume Intelligence", text: "Turn a static CV into a structured career profile that AI can actually reason about." },
  { icon: <BrainIcon />, title: "Career Intelligence", text: "Understand your strongest directions, skill gaps and realistic next moves." },
  { icon: <RouteIcon />, title: "Personal Roadmaps", text: "Convert analysis into a focused path with clear skills, projects and milestones." },
];

export default function Home3D() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scrollDepth, setScrollDepth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
      setScrollDepth(Math.min(window.scrollY / 900, 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePointerMove = (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    setPointer({ x, y });
  };

  return (
    <div onMouseMove={handlePointerMove} className="min-h-screen overflow-hidden bg-[#060811] text-white">
      <style>{`
        html{scroll-behavior:smooth}
        body{background:#060811}
        .gold-gradient{background:linear-gradient(115deg,#fff 5%,#f2d88d 45%,#d9b45a 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
        .hero-grid{background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,black,transparent 82%);animation:gridDrift 22s linear infinite}
        .nav-glow{box-shadow:0 18px 70px rgba(0,0,0,.32)}
        .core-stage{transform-style:preserve-3d;perspective:1200px}
        .core-halo{background:radial-gradient(circle,rgba(120,103,255,.28) 0%,rgba(217,180,90,.13) 32%,transparent 70%);filter:blur(22px);animation:halo 5s ease-in-out infinite}
        .core-shell{transform:rotateX(10deg) rotateY(-12deg) translateZ(25px);transform-style:preserve-3d;box-shadow:0 45px 110px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.14)}
        .core-float{animation:coreFloat 6s ease-in-out infinite}
        .scan-surface{background:linear-gradient(180deg,transparent 0%,rgba(217,180,90,.04) 45%,rgba(217,180,90,.22) 50%,rgba(217,180,90,.04) 55%,transparent 100%);background-size:100% 220%;animation:scan 4.8s linear infinite;filter:blur(.2px)}
        .orbit{transform-style:preserve-3d}.orbit::after{content:"";position:absolute;top:-5px;left:50%;width:9px;height:9px;border-radius:999px;background:#d9b45a;box-shadow:0 0 24px rgba(217,180,90,.85)}
        .orbit-a{animation:spin 16s linear infinite}.orbit-b{animation:spinReverse 24s linear infinite}.orbit-c{animation:spinTilt 34s linear infinite}
        .core-beam{background:linear-gradient(90deg,transparent,rgba(120,103,255,.6),rgba(217,180,90,.4),transparent);filter:blur(.4px);opacity:.32}.core-beam-a{transform:translate(-50%,-50%) rotate(25deg);animation:beamPulse 4s ease-in-out infinite}.core-beam-b{transform:translate(-50%,-50%) rotate(-32deg);animation:beamPulse 4.8s ease-in-out infinite reverse}
        .float-card{transform-style:preserve-3d;box-shadow:0 20px 70px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.04)}
        .float-card::before{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(130deg,rgba(255,255,255,.07),transparent 34%);pointer-events:none}
        .float-card-a{animation:cardA 7s ease-in-out infinite}.float-card-b{animation:cardB 8s ease-in-out infinite}.float-card-c{animation:cardC 7.5s ease-in-out infinite}.float-card-d{animation:cardD 8.5s ease-in-out infinite}
        .data-fill{animation:dataPulse 3.5s ease-in-out infinite}
        .shine-border{position:relative}.shine-border::before{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:linear-gradient(120deg,rgba(217,180,90,.45),transparent 30%,transparent 70%,rgba(120,103,255,.35));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}
        .tilt-card{position:relative;transition:transform .22s ease,box-shadow .22s ease;transform-style:preserve-3d;will-change:transform}.tilt-card::after{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(circle at var(--glow-x) var(--glow-y),rgba(255,255,255,.09),transparent 32%);opacity:0;transition:opacity .25s;pointer-events:none}.tilt-card:hover::after{opacity:1}.tilt-card:hover{box-shadow:0 30px 80px rgba(0,0,0,.32)}
        .depth-icon{transform:translateZ(36px)}.depth-title{transform:translateZ(22px)}.depth-copy{transform:translateZ(12px)}
        .noise{background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E")}
        .reveal{animation:reveal .8s cubic-bezier(.22,1,.36,1) both}.reveal-2{animation-delay:.12s}.reveal-3{animation-delay:.24s}
        .cinematic-panel{transform-style:preserve-3d;perspective:1300px}.model-layer{animation:modelFloat 6s ease-in-out infinite}.model-layer:nth-child(2){animation-delay:-1.8s}.model-layer:nth-child(3){animation-delay:-3.4s}.model-layer:nth-child(4){animation-delay:-4.6s}
        .magnetic{position:relative;overflow:hidden}.magnetic::after{content:"";position:absolute;inset:-80%;background:linear-gradient(115deg,transparent 42%,rgba(255,255,255,.2),transparent 58%);transform:translateX(-60%);transition:transform .7s ease}.magnetic:hover::after{transform:translateX(60%)}
        @keyframes reveal{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes halo{50%{transform:translate(-50%,-50%) scale(1.1);opacity:.82}}
        @keyframes coreFloat{50%{transform:translate(-50%,-54%) rotate(1deg)}}
        @keyframes spin{to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes spinReverse{to{transform:translate(-50%,-50%) rotate(-360deg)}}@keyframes spinTilt{to{transform:translate(-50%,-50%) rotate(360deg) rotateX(68deg)}}
        @keyframes scan{from{background-position:0 120%}to{background-position:0 -120%}}
        @keyframes beamPulse{50%{opacity:.7;filter:blur(.2px)}}
        @keyframes dataPulse{50%{filter:brightness(1.45);box-shadow:0 0 18px rgba(217,180,90,.2)}}
        @keyframes cardA{50%{transform:translate3d(10px,-14px,28px) rotate(-1.4deg)}}@keyframes cardB{50%{transform:translate3d(-9px,11px,36px) rotate(1.2deg)}}@keyframes cardC{50%{transform:translate3d(10px,10px,24px) rotate(1deg)}}@keyframes cardD{50%{transform:translate3d(-10px,-11px,32px) rotate(-1deg)}}
        @keyframes modelFloat{50%{transform:translateY(-6px) translateZ(20px)}}@keyframes gridDrift{to{background-position:72px 72px}}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}
      `}</style>

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="hero-grid absolute inset-0" style={{ transform: `translate3d(${pointer.x * -12}px, ${pointer.y * -10}px, 0) scale(1.03)` }} />
        <div className="absolute left-[-12%] top-[-18%] h-[600px] w-[600px] rounded-full bg-[#7867ff]/10 blur-[150px] transition-transform duration-300" style={{ transform: `translate3d(${pointer.x * 32}px, ${pointer.y * 24}px, 0)` }} />
        <div className="absolute right-[-12%] top-[20%] h-[520px] w-[520px] rounded-full bg-[#d9b45a]/[0.07] blur-[150px] transition-transform duration-300" style={{ transform: `translate3d(${pointer.x * -28}px, ${pointer.y * -20}px, 0)` }} />
        <div className="noise absolute inset-0 opacity-[0.035]" />
      </div>

      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-white/[0.07] bg-[#060811]/80 backdrop-blur-2xl nav-glow" : "bg-transparent"}`}>
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] border border-[#d9b45a]/30 bg-[#d9b45a]/10 font-semibold text-[#efd080] shadow-[0_0_30px_rgba(217,180,90,.08)] transition duration-300 group-hover:rotate-6 group-hover:scale-105">C</div>
            <div><p className="text-[15px] font-semibold tracking-[-.02em]">CareerUp AI</p><p className="text-[8px] uppercase tracking-[.28em] text-white/25">Career Intelligence</p></div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#product" className="text-sm text-white/45 transition hover:text-white">Product</a>
            <a href="#intelligence" className="text-sm text-white/45 transition hover:text-white">Intelligence</a>
            <a href="#how" className="text-sm text-white/45 transition hover:text-white">How it works</a>
            <Link to="/login" className="text-sm text-white/55 transition hover:text-white">Login</Link>
            <Link to="/register" className="magnetic rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#090b12] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(255,255,255,.12)]">Get started</Link>
          </nav>

          <button onClick={() => setMenu(!menu)} className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 md:hidden" aria-label="Toggle navigation">
            <span className="block h-px w-5 bg-white/70" /><span className="mt-1.5 block h-px w-5 bg-white/70" />
          </button>
        </div>
        {menu && <div className="border-t border-white/[0.06] bg-[#060811]/95 px-6 py-5 backdrop-blur-2xl md:hidden"><div className="flex flex-col gap-4"><a href="#product" onClick={() => setMenu(false)} className="text-sm text-white/60">Product</a><a href="#intelligence" onClick={() => setMenu(false)} className="text-sm text-white/60">Intelligence</a><a href="#how" onClick={() => setMenu(false)} className="text-sm text-white/60">How it works</a><Link to="/login" className="text-sm text-white/60">Login</Link><Link to="/register" className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-[#090b12]">Get started</Link></div></div>}
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid min-h-[94vh] max-w-7xl items-center gap-10 px-6 pb-16 pt-32 lg:grid-cols-[1.02fr_.98fr] lg:px-10 lg:pb-20 lg:pt-28">
          <div className="relative z-10 max-w-3xl" style={{ transform: `translate3d(0, ${scrollDepth * 22}px, 0)`, opacity: 1 - scrollDepth * 0.12 }}>
            <div className="reveal mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[11px] uppercase tracking-[.18em] text-white/50 backdrop-blur-xl"><span className="text-[#efd080]"><Spark size={15} /></span>AI career intelligence, built around you</div>
            <h1 className="reveal reveal-2 text-[52px] font-medium leading-[.97] tracking-[-.055em] sm:text-[68px] lg:text-[82px]">Turn your career into a<br /><span className="gold-gradient">system you can navigate.</span></h1>
            <p className="reveal reveal-3 mt-7 max-w-xl text-base leading-7 text-white/40 sm:text-lg">CareerUp AI understands your skills, resume and goals, then turns them into clear career direction—not another dashboard full of noise.</p>
            <div className="reveal reveal-3 mt-9 flex flex-wrap items-center gap-3"><Link to="/register" className="magnetic group inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-[#080a11] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(255,255,255,.13)]">Build my career profile <span className="transition group-hover:translate-x-1"><Arrow /></span></Link><a href="#intelligence" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-3.5 text-sm font-medium text-white/65 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.06] hover:text-white">See how it works</a></div>
            <div className="mt-11 flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-[.16em] text-white/25"><span>Career profile</span><span>Resume intelligence</span><span>Skill mapping</span><span>Roadmaps</span></div>
          </div>
          <div className="relative" style={{ transform: `translate3d(0, ${scrollDepth * -20}px, 0)` }}><IntelligenceCore pointer={pointer} /></div>
        </section>

        <section id="product" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div><p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#d9b45a]">One profile. One direction.</p><h2 className="mt-4 max-w-xl text-4xl font-medium tracking-[-.045em] sm:text-5xl">Less clutter.<br /><span className="text-white/30">More useful intelligence.</span></h2></div>
            <p className="max-w-xl text-sm leading-7 text-white/35 lg:justify-self-end">Instead of placing every feature on the homepage, the new CareerUp experience gives each capability its own space. The landing page explains the value; the product does the work.</p>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {featureItems.map((item, index) => <TiltCard key={item.title} intensity={12} className="shine-border rounded-[28px] border border-white/[0.07] bg-white/[0.025] p-6"><div className="depth-icon flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.035] text-[#efd080]">{item.icon}</span><span className="text-[10px] tracking-[.2em] text-white/20">0{index + 1}</span></div><h3 className="depth-title mt-9 text-xl font-semibold tracking-[-.025em]">{item.title}</h3><p className="depth-copy mt-3 text-sm leading-6 text-white/35">{item.text}</p><div className="depth-copy mt-8 flex items-center gap-2 text-xs font-medium text-white/40">Explore <Arrow size={15} /></div></TiltCard>)}
          </div>
        </section>

        <section id="intelligence" className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <TiltCard intensity={4} className="cinematic-panel shine-border overflow-hidden rounded-[36px] border border-white/[0.08] bg-[#0a0d16]/80 p-6 shadow-[0_40px_120px_rgba(0,0,0,.35)] backdrop-blur-xl sm:p-10 lg:p-12">
            <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div className="depth-title"><p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#d9b45a]">The intelligence layer</p><h2 className="mt-4 text-4xl font-medium tracking-[-.045em] sm:text-5xl">Your resume is only the beginning.</h2><p className="mt-6 max-w-lg text-sm leading-7 text-white/35">CareerUp builds a living career profile from your education, skills, projects, experience and goals. That profile becomes the context behind every recommendation.</p><div className="mt-8 space-y-3">{["Understand where you are now","See which roles actually fit","Know which skills matter next"].map((text) => <div key={text} className="flex items-center gap-3 text-sm text-white/60"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d9b45a]/10 text-[10px] text-[#efd080]">✓</span>{text}</div>)}</div></div>
              <div className="relative min-h-[420px] rounded-[30px] border border-white/[0.07] bg-black/20 p-5 sm:p-7">
                <div className="absolute inset-0 rounded-[30px] bg-[radial-gradient(circle_at_70%_20%,rgba(120,103,255,.12),transparent_42%)]" />
                <div className="relative flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.2em] text-white/25">Career profile</p><p className="mt-1 font-semibold">Intelligence overview</p></div><span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1 text-[9px] uppercase tracking-[.15em] text-emerald-300">Live model</span></div>
                <div className="relative mt-8 grid gap-3 sm:grid-cols-2">{[["91%","Career fit"],["84","Readiness score"],["4","Priority gaps"],["6","Next actions"]].map(([value,label]) => <div key={label} className="model-layer rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"><p className="text-3xl font-semibold tracking-[-.05em]">{value}</p><p className="mt-2 text-[10px] uppercase tracking-[.16em] text-white/25">{label}</p></div>)}</div>
                <div className="model-layer relative mt-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7867ff]/10 text-[#9f94ff]"><Spark /></span><div><p className="text-xs font-semibold">Highest-value next move</p><p className="mt-1 text-xs text-white/30">Strengthen system design and ship one architecture-focused project.</p></div></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="data-fill h-full w-[76%] rounded-full bg-gradient-to-r from-[#7867ff] to-[#d9b45a]" /></div></div>
              </div>
            </div>
          </TiltCard>
        </section>

        <section id="how" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="text-center"><p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#d9b45a]">Simple by design</p><h2 className="mx-auto mt-4 max-w-3xl text-4xl font-medium tracking-[-.045em] sm:text-5xl">Three steps from uncertainty to direction.</h2></div>
          <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">{[["01","Build your profile","Tell CareerUp what you know, what you've built and where you want to go."],["02","Let AI connect the dots","Your resume, skills and goals become one structured intelligence profile."],["03","Move with a plan","Get focused recommendations, roadmaps and next actions instead of generic advice."]].map(([n,title,text]) => <TiltCard key={n} intensity={7} className="rounded-[26px] border border-white/[0.07] bg-white/[0.02] p-6"><span className="depth-icon inline-block text-[10px] tracking-[.2em] text-[#d9b45a]">{n}</span><h3 className="depth-title mt-7 text-lg font-semibold">{title}</h3><p className="depth-copy mt-3 text-sm leading-6 text-white/32">{text}</p></TiltCard>)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 lg:px-10 lg:pb-32">
          <div className="relative overflow-hidden rounded-[36px] border border-white/[0.08] bg-white/[0.035] px-6 py-16 text-center sm:px-10 sm:py-20"><div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9b45a]/10 blur-[90px]" /><div className="relative"><p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#d9b45a]">Your next move starts here</p><h2 className="mx-auto mt-4 max-w-3xl text-4xl font-medium tracking-[-.045em] sm:text-5xl">Build a career profile that gets smarter with you.</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/35">Start with what you already have. CareerUp AI will help you understand what comes next.</p><Link to="/register" className="magnetic group mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-[#080a11] transition hover:-translate-y-1">Create my profile <span className="transition group-hover:translate-x-1"><Arrow /></span></Link></div></div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.07]"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-xs text-white/25 sm:flex-row sm:items-center sm:justify-between lg:px-10"><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10">C</span><span>CareerUp AI</span></div><p>Career intelligence for what comes next.</p><div className="flex gap-5"><Link to="/login" className="hover:text-white">Login</Link><Link to="/register" className="hover:text-white">Get started</Link></div></div></footer>
    </div>
  );
}
