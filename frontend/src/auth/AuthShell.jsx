import { Link } from "react-router-dom";

function Brand() {
  return (
    <Link to="/" className="inline-flex items-center gap-3">
      <span className="auth-logo relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-[#d9b45a]/25 bg-[#d9b45a]/[.075] font-semibold text-[#efd080]">
        <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <span className="relative">C</span>
      </span>
      <span className="leading-none">
        <span className="block text-sm font-semibold tracking-[-.02em]">CareerUp AI</span>
        <span className="mt-1.5 block text-[8px] uppercase tracking-[.24em] text-white/25">Career intelligence workspace</span>
      </span>
    </Link>
  );
}

function MiniSignal({ label, value, note, accent = "gold" }) {
  const accents = {
    gold: "border-[#d9b45a]/15 bg-[#d9b45a]/[.045] text-[#efd080]",
    violet: "border-[#7867ff]/15 bg-[#7867ff]/[.055] text-[#a79dff]",
    mint: "border-[#76d7c4]/15 bg-[#76d7c4]/[.045] text-[#8be5d3]",
  };

  return (
    <div className={`auth-mini-card rounded-2xl border p-4 ${accents[accent] || accents.gold}`}>
      <p className="text-[9px] uppercase tracking-[.17em] text-white/24">{label}</p>
      <p className="mt-3 text-xl font-semibold tracking-[-.035em] text-white">{value}</p>
      <p className="mt-1.5 text-[10px] leading-4 text-white/28">{note}</p>
    </div>
  );
}

export default function AuthShell({ mode = "login", children }) {
  const isLogin = mode === "login";

  return (
    <div className="auth-page min-h-screen bg-[#050711] px-4 py-5 text-white sm:px-6 sm:py-7">
      <div className="auth-noise pointer-events-none fixed inset-0" />
      <div className="auth-grid pointer-events-none fixed inset-0" />
      <div className="pointer-events-none fixed -left-32 -top-40 h-[520px] w-[520px] rounded-full bg-[#7867ff]/10 blur-[155px]" />
      <div className="pointer-events-none fixed -bottom-44 right-[8%] h-[500px] w-[500px] rounded-full bg-[#d9b45a]/[.075] blur-[160px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1180px] items-center justify-center sm:min-h-[calc(100vh-3.5rem)]">
        <div className="auth-frame grid w-full overflow-hidden rounded-[32px] border border-white/[.075] bg-[#080b13]/72 shadow-[0_35px_120px_rgba(0,0,0,.38)] backdrop-blur-2xl lg:grid-cols-[1.02fr_.98fr]">
          <section className={`relative hidden min-h-[690px] overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between xl:p-12 ${isLogin ? "border-r" : "order-2 border-l"} border-white/[.065]`}>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(120,103,255,.09),transparent_36%),radial-gradient(circle_at_75%_70%,rgba(217,180,90,.08),transparent_35%)]" />
            <div className="relative"><Brand /></div>

            <div className="relative max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[.07] bg-white/[.025] px-3 py-1.5 text-[9px] uppercase tracking-[.18em] text-white/34">
                <span className="auth-live-dot h-1.5 w-1.5 rounded-full bg-[#76d7c4]" />
                {isLogin ? "Your workspace is ready" : "Build the context once"}
              </div>
              <h1 className="mt-6 text-5xl font-semibold leading-[.98] tracking-[-.06em] xl:text-6xl">
                {isLogin ? <>Pick up where your <span className="text-white/30">career signal</span> left off.</> : <>One profile. <span className="text-white/30">Every insight connected.</span></>}
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-white/38">
                {isLogin
                  ? "Return to your resume analysis, role readiness and next actions without rebuilding your context from scratch."
                  : "CareerUp connects your background, skills, goals and resume so each intelligence module can build on the same foundation."}
              </p>
            </div>

            <div className="relative grid grid-cols-3 gap-3">
              <MiniSignal label="Profile" value="Connected" note="Skills + goals" accent="gold" />
              <MiniSignal label="Resume" value="Analyzed" note="Evidence signals" accent="violet" />
              <MiniSignal label="Next move" value="Focused" note="Prioritized actions" accent="mint" />
            </div>
          </section>

          <section className={`${isLogin ? "" : "order-1"} flex min-h-[650px] items-center p-6 sm:p-10 lg:p-12`}>
            <div className="mx-auto w-full max-w-[430px]">
              <div className="mb-10 lg:hidden"><Brand /></div>
              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
