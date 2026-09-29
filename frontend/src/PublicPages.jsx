import { useEffect } from "react";
import { Link } from "react-router-dom";

const PAGE_DATA = {
  product: {
    eyebrow: "The CareerUp platform",
    title: "One intelligent workspace for your entire career journey.",
    intro: "CareerUp AI connects your resume, skills, goals, role exploration and learning plan so every recommendation is based on the same career profile.",
    sections: [
      ["Career Profile", "Bring together your resume, education, skills, projects, experience and goals in one evolving profile that becomes the foundation for every CareerUp insight."],
      ["Resume Intelligence", "Understand what your resume communicates, where it is strong, which skills are missing and how well it aligns with the opportunities you are targeting."],
      ["Career Intelligence", "Explore realistic career paths based on your background and understand why a role fits, what you already have and what you still need to develop."],
      ["Personal Roadmaps", "Turn analysis into action with skill priorities, project ideas and milestones designed around the role you want to reach."],
    ],
    cta: "Build your career profile"
  },
  resume: {
    eyebrow: "Resume Intelligence",
    title: "Turn your resume into career intelligence.",
    intro: "CareerUp AI helps you understand your resume beyond formatting. See strengths, gaps, role alignment and the improvements that can make your profile more relevant.",
    sections: [
      ["Resume analysis", "Break your resume into skills, education, projects and experience so CareerUp can understand the story your profile currently tells."],
      ["Role alignment", "Compare your background with target roles and identify the qualifications, skills and experience that matter most for each path."],
      ["Skill-gap insights", "See which missing capabilities are holding back your readiness and which gaps deserve your attention first."],
      ["Actionable improvements", "Receive focused suggestions for strengthening content, adding evidence and building projects that make your profile more convincing."],
    ],
    cta: "Analyze my resume"
  },
  intelligence: {
    eyebrow: "Career Intelligence",
    title: "Understand where your profile can take you next.",
    intro: "CareerUp AI connects your experience, skills and goals to help you explore roles that fit your current profile and understand what it takes to move toward them.",
    sections: [
      ["Role matching", "Discover career directions that align with your skills, education, projects and interests instead of relying on generic job lists."],
      ["Readiness signals", "Understand how prepared you are for a target role and which parts of your profile already support that direction."],
      ["Gap prioritization", "Separate important skill gaps from low-value noise so you can spend time on the capabilities that actually improve your trajectory."],
      ["Next-best actions", "Turn every insight into clear next moves—from learning a skill to building a project or improving your resume evidence."],
    ],
    cta: "Explore my career paths"
  },
  roadmaps: {
    eyebrow: "Personal Roadmaps",
    title: "Move from career advice to a plan you can actually follow.",
    intro: "CareerUp turns your target role and current profile into a structured roadmap with skills, projects and milestones that give you a practical path forward.",
    sections: [
      ["Skill priorities", "Know which skills to learn first based on your current gaps and the requirements of the role you are targeting."],
      ["Project recommendations", "Build projects that demonstrate the capabilities employers expect instead of collecting disconnected tutorial work."],
      ["Milestones", "Break a long-term career goal into smaller checkpoints so progress is visible and easier to maintain."],
      ["Adaptive direction", "As your profile improves, your roadmap can evolve with your new skills, projects and changing career goals."],
    ],
    cta: "Create my roadmap"
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Start building your career direction for free.",
    intro: "CareerUp is designed to make the core career-planning experience accessible first. Advanced AI capabilities and higher usage limits can grow with you as the platform expands.",
    sections: [
      ["Free", "Create your career profile, explore the core experience and start organizing the information that powers your recommendations."],
      ["CareerUp Plus", "Planned for users who want deeper AI analysis, richer comparisons, advanced roadmaps and expanded career-assistant usage."],
      ["For institutions", "CareerUp can grow into a shared career-intelligence layer for universities, placement teams and student-support programs."],
      ["Simple by design", "No confusing bundles or dozens of add-ons. The goal is a clear product with capabilities that become more powerful as your needs grow."],
    ],
    cta: "Get started free"
  },
  about: {
    eyebrow: "About CareerUp AI",
    title: "Career planning should feel connected, personal and actionable.",
    intro: "CareerUp AI is being built around a simple idea: your resume, skills, projects, goals and career decisions should not live in separate tools. They should work together as one intelligent system.",
    sections: [
      ["Why CareerUp exists", "Most career tools solve one isolated problem. CareerUp is designed to connect the full journey—from understanding where you are to deciding where to go and what to do next."],
      ["Personal context first", "Useful career guidance depends on context. CareerUp centers its recommendations on a persistent profile rather than generic advice that could apply to anyone."],
      ["Clarity over complexity", "The interface is designed to reduce noise and surface the few insights and actions that matter most at each stage of your journey."],
      ["Built to evolve", "CareerUp is designed as a long-term career workspace that can become more useful as your experience, skills and ambitions change."],
    ],
    cta: "Create your CareerUp profile"
  }
};

const navItems = [
  ["Product", "/product"],
  ["Resume AI", "/resume-intelligence"],
  ["Career Intelligence", "/career-intelligence"],
  ["Roadmaps", "/roadmaps"],
  ["Pricing", "/pricing"],
  ["About", "/about"],
];

export function PublicPage({ type }) {
  const page = PAGE_DATA[type];

  useEffect(() => {
    document.title = `${page.eyebrow} — CareerUp AI`;
    window.scrollTo(0, 0);
  }, [page.eyebrow]);

  return (
    <div className="min-h-screen bg-[#060811] text-white">
      <style>{`
        body{background:#060811}.page-grid{background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,black,transparent 85%)}
        .page-glow{background:radial-gradient(circle,rgba(120,103,255,.18),rgba(217,180,90,.08) 38%,transparent 70%);filter:blur(18px);animation:pulseGlow 6s ease-in-out infinite}
        .page-card{position:relative;overflow:hidden;transition:transform .3s ease,border-color .3s ease,background .3s ease}.page-card:before{content:"";position:absolute;inset:0;background:linear-gradient(130deg,rgba(255,255,255,.06),transparent 32%);opacity:0;transition:opacity .3s}.page-card:hover{transform:translateY(-6px);border-color:rgba(217,180,90,.2);background:rgba(255,255,255,.035)}.page-card:hover:before{opacity:1}
        @keyframes pulseGlow{50%{transform:scale(1.08);opacity:.8}}@media(prefers-reduced-motion:reduce){*{animation:none!important;scroll-behavior:auto!important}}
      `}</style>

      <div className="pointer-events-none fixed inset-0 overflow-hidden"><div className="page-grid absolute inset-0" /><div className="page-glow absolute left-1/2 top-[-180px] h-[620px] w-[620px] -translate-x-1/2 rounded-full" /></div>

      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#060811]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-[13px] border border-[#d9b45a]/30 bg-[#d9b45a]/10 font-semibold text-[#efd080]">C</span><span><span className="block text-[15px] font-semibold">CareerUp AI</span><span className="block text-[8px] uppercase tracking-[.28em] text-white/25">Career Intelligence</span></span></Link>
          <nav className="hidden items-center gap-5 xl:flex">{navItems.map(([label,path]) => <Link key={path} to={path} className="text-xs text-white/45 transition hover:text-white">{label}</Link>)}<Link to="/login" className="ml-2 text-xs text-white/55 hover:text-white">Login</Link><Link to="/register" className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-[#080a11]">Get started</Link></nav>
          <Link to="/register" className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-[#080a11] xl:hidden">Get started</Link>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-24 lg:px-10 lg:pb-28 lg:pt-32"><div className="max-w-4xl"><p className="text-[10px] font-semibold uppercase tracking-[.28em] text-[#d9b45a]">{page.eyebrow}</p><h1 className="mt-5 text-[48px] font-medium leading-[.98] tracking-[-.055em] sm:text-[64px] lg:text-[76px]">{page.title}</h1><p className="mt-7 max-w-2xl text-base leading-8 text-white/42 sm:text-lg">{page.intro}</p><div className="mt-9 flex flex-wrap gap-3"><Link to="/register" className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-[#080a11] transition hover:-translate-y-1">{page.cta} →</Link><Link to="/" className="rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-3.5 text-sm text-white/65 transition hover:bg-white/[0.06] hover:text-white">Back to overview</Link></div></div></section>

        <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-10 lg:pb-36"><div className="grid gap-4 md:grid-cols-2">{page.sections.map(([title,text],index) => <article key={title} className="page-card rounded-[28px] border border-white/[0.07] bg-white/[0.02] p-7 sm:p-8"><div className="relative"><div className="flex items-center justify-between"><span className="text-[10px] uppercase tracking-[.2em] text-[#d9b45a]">0{index+1}</span><span className="h-2 w-2 rounded-full bg-[#7867ff] shadow-[0_0_20px_rgba(120,103,255,.8)]" /></div><h2 className="mt-12 text-2xl font-semibold tracking-[-.035em]">{title}</h2><p className="mt-4 max-w-xl text-sm leading-7 text-white/38">{text}</p></div></article>)}</div></section>

        <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-10 lg:pb-36"><div className="rounded-[34px] border border-white/[0.08] bg-white/[0.035] px-6 py-14 text-center sm:px-10 sm:py-16"><p className="text-[10px] uppercase tracking-[.25em] text-[#d9b45a]">Build your direction</p><h2 className="mx-auto mt-4 max-w-3xl text-4xl font-medium tracking-[-.045em] sm:text-5xl">Your career profile becomes more useful with every step.</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/35">Start with your current background and goals. CareerUp connects the information so your next decisions have context.</p><Link to="/register" className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-[#080a11]">Get started →</Link></div></section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.07]"><div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-10"><div><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10">C</span><span className="text-sm font-semibold">CareerUp AI</span></div><p className="mt-4 max-w-xs text-xs leading-6 text-white/30">Your intelligent workspace for resume insights, career direction and personalized growth.</p></div><div><p className="text-xs font-semibold text-white/70">Product</p><div className="mt-4 space-y-3">{navItems.slice(0,4).map(([label,path]) => <Link key={path} to={path} className="block text-xs text-white/30 hover:text-white">{label}</Link>)}</div></div><div><p className="text-xs font-semibold text-white/70">Company</p><div className="mt-4 space-y-3"><Link to="/about" className="block text-xs text-white/30 hover:text-white">About</Link><Link to="/pricing" className="block text-xs text-white/30 hover:text-white">Pricing</Link></div></div><div><p className="text-xs font-semibold text-white/70">Account</p><div className="mt-4 space-y-3"><Link to="/login" className="block text-xs text-white/30 hover:text-white">Login</Link><Link to="/register" className="block text-xs text-white/30 hover:text-white">Create account</Link></div></div></div></footer>
    </div>
  );
}
