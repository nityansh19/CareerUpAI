import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Arrow, IntelligenceCore, Spark } from "./landing/LandingUI";
import CompactLanding from "./landing/CompactLanding";
import "./landing/LandingStyles.css";

function Header({ scrolled, menu, setMenu }) {
  const shellClass =
    "mx-auto flex w-[min(94%,1180px)] items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-500 sm:px-5 " +
    (scrolled
      ? "nav-glow border-white/10 bg-[#080b13]/88 backdrop-blur-2xl"
      : "border-white/[.04] bg-[#070a12]/28 backdrop-blur-md");

  return (
    <header className={"fixed inset-x-0 top-0 z-50 transition-all duration-500 " + (scrolled ? "pt-3" : "pt-5")}>
      <div className={shellClass}>
        <Link to="/" className="group flex items-center gap-3">
          <span className="brand-mark relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-[#d9b45a]/25 bg-[#d9b45a]/[.07] text-sm font-extrabold text-[#efd080]">
            C
          </span>
          <div className="leading-none">
            <span className="brand-wordmark block text-[15px] font-extrabold tracking-[-.045em] text-white">
              CareerUpAI
            </span>
            <span className="mt-1.5 block text-[8px] font-semibold uppercase tracking-[.24em] text-white/30">
              Career intelligence
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <a href="#product-intelligence" className="text-sm font-medium text-white/50 transition hover:text-white">
            Product
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-white/50 transition hover:text-white">
            How it works
          </a>
          <Link to="/pricing" className="text-sm font-medium text-white/50 transition hover:text-white">
            Pricing
          </Link>
          <Link to="/about" className="text-sm font-medium text-white/50 transition hover:text-white">
            About
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/login" className="rounded-xl px-4 py-2.5 text-sm font-medium text-white/55 transition hover:bg-white/[.04] hover:text-white">
            Login
          </Link>
          <Link
            to="/register"
            className="group flex items-center gap-2 rounded-xl border border-[#d9b45a]/35 bg-[#d9b45a]/10 px-4 py-2.5 text-sm font-semibold text-[#f2d88d] transition hover:-translate-y-0.5 hover:border-[#d9b45a]/60 hover:bg-[#d9b45a]/15"
          >
            Start free <Arrow size={15} />
          </Link>
        </div>

        <button
          onClick={() => setMenu((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.035] lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={menu}
        >
          <span className="relative block h-4 w-5">
            <span className={"absolute left-0 top-1 h-px w-5 bg-white transition " + (menu ? "translate-y-[3px] rotate-45" : "")} />
            <span className={"absolute bottom-1 left-0 h-px w-5 bg-white transition " + (menu ? "-translate-y-[3px] -rotate-45" : "")} />
          </span>
        </button>
      </div>

      {menu && (
        <div className="mx-auto mt-2 w-[min(94%,1180px)] rounded-2xl border border-white/10 bg-[#080b13]/95 p-3 shadow-2xl backdrop-blur-2xl lg:hidden">
          <a href="#product-intelligence" onClick={() => setMenu(false)} className="block rounded-xl px-4 py-3 text-sm text-white/65 hover:bg-white/[.04] hover:text-white">
            Product
          </a>
          <a href="#how-it-works" onClick={() => setMenu(false)} className="block rounded-xl px-4 py-3 text-sm text-white/65 hover:bg-white/[.04] hover:text-white">
            How it works
          </a>
          <Link to="/pricing" onClick={() => setMenu(false)} className="block rounded-xl px-4 py-3 text-sm text-white/65 hover:bg-white/[.04] hover:text-white">
            Pricing
          </Link>
          <Link to="/about" onClick={() => setMenu(false)} className="block rounded-xl px-4 py-3 text-sm text-white/65 hover:bg-white/[.04] hover:text-white">
            About
          </Link>
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/[.06] pt-3">
            <Link to="/login" className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm text-white/75">
              Login
            </Link>
            <Link to="/register" className="rounded-xl bg-[#e8c96f] px-4 py-3 text-center text-sm font-bold text-[#11131a]">
              Start free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ pointer }) {
  return (
    <section className="relative overflow-hidden px-4 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32 lg:min-h-[760px] lg:pt-28">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-75" />
      <div className="hero-vignette pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-[#7867ff]/10 blur-[110px]" />
      <div className="pointer-events-none absolute right-[8%] top-[24%] h-80 w-80 rounded-full bg-[#d9b45a]/10 blur-[120px]" />

      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-8 lg:min-h-[640px] lg:grid-cols-[.95fr_1.05fr] lg:gap-2">
        <div className="relative z-20 max-w-[650px]">
          <div className="hero-kicker mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[.035] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[.17em] text-white/52 backdrop-blur-xl">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#76d7c4]" />
            AI career intelligence, made personal
          </div>

          <h1 className="career-display max-w-[720px] text-[clamp(3.15rem,6.3vw,5.6rem)] font-extrabold leading-[.9] tracking-[-.075em] text-white">
            Stop guessing.
            <span className="gold-gradient mt-2 block">Know your next move.</span>
          </h1>

          <p className="mt-6 max-w-[590px] text-[15px] font-medium leading-7 text-white/55 sm:text-[17px] sm:leading-8">
            CareerUpAI turns your resume, skills and goals into clear career direction—what fits, what is missing and what to do next.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="button-sheen group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#efd17b] px-5 py-3.5 text-sm font-bold text-[#10131a] shadow-[0_16px_50px_rgba(217,180,90,.18)] transition hover:-translate-y-0.5 hover:bg-[#f5dc92]"
            >
              Build my career profile
              <span className="transition-transform group-hover:translate-x-1"><Arrow size={17} /></span>
            </Link>
            <a
              href="#product-intelligence"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.035] px-5 py-3.5 text-sm font-semibold text-white/72 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[.06] hover:text-white"
            >
              <Spark size={16} /> See the product
            </a>
          </div>

          <div className="mt-7 flex items-center gap-3 text-[11px] font-medium text-white/34">
            <span>Resume intelligence</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>Career fit</span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
            <span>Personal roadmap</span>
          </div>
        </div>

        <div className="relative z-10 lg:pl-4">
          <IntelligenceCore pointer={pointer} />
        </div>
      </div>
    </section>
  );
}

export default function Home3D() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 18);
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setScrollProgress(Math.min(window.scrollY / max, 1));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePointerMove = (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setPointer({
      x: event.clientX / window.innerWidth - 0.5,
      y: event.clientY / window.innerHeight - 0.5,
    });
  };

  return (
    <div
      onMouseMove={handlePointerMove}
      className="careerup-landing min-h-screen overflow-hidden bg-[#060811] text-white selection:bg-[#d9b45a]/30 selection:text-white"
    >
      <div
        className="fixed left-0 top-0 z-[90] h-[2px] bg-gradient-to-r from-[#7867ff] via-[#d9b45a] to-[#76d7c4] shadow-[0_0_18px_rgba(217,180,90,.35)] transition-[width] duration-150"
        style={{ width: String(scrollProgress * 100) + "%" }}
      />
      <div className="hero-noise pointer-events-none fixed inset-0 z-[2]" />

      <Header scrolled={scrolled} menu={menu} setMenu={setMenu} />

      <main className="career-public-main relative z-10">
        <Hero pointer={pointer} />
        <CompactLanding />
      </main>

      <footer className="relative z-10 border-t border-white/[.055] px-4 py-7 sm:px-6">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-5 text-xs text-white/32 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="brand-mark flex h-8 w-8 items-center justify-center rounded-xl border border-[#d9b45a]/20 bg-[#d9b45a]/[.05] font-extrabold text-[#efd080]">
              C
            </span>
            <span className="font-medium">CareerUpAI · Career intelligence for what comes next.</span>
          </div>
          <div className="flex gap-5">
            <Link to="/about" className="transition hover:text-white/70">About</Link>
            <Link to="/pricing" className="transition hover:text-white/70">Pricing</Link>
            <Link to="/login" className="transition hover:text-white/70">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
