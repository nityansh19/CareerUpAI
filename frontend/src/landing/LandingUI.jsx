import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export function Arrow({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>;
}

export function Spark({ size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3-1.8 6.2L4 11l6.2 1.8L12 19l1.8-6.2L20 11l-6.2-1.8L12 3Z"/><path d="m19 17-.7 2.2L16 20l2.3.8L19 23l.8-2.2L22 20l-2.2-.8L19 17Z"/></svg>;
}

export function BrainIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 4.5a3 3 0 0 0-5 2.2A3.2 3.2 0 0 0 4.8 13 3 3 0 0 0 7 18.5a3 3 0 0 0 5 1.8V5.5A3 3 0 0 0 9 4.5Z"/><path d="M15 4.5a3 3 0 0 1 5 2.2 3.2 3.2 0 0 1-.8 6.3 3 3 0 0 1-2.2 5.5 3 3 0 0 1-5 1.8V5.5a3 3 0 0 1 3-1Z"/></svg>;
}

export function FileIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h5"/></svg>;
}

export function RouteIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="5" cy="18" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="19" cy="15" r="2"/><path d="m7 16.5 3.8-8M14 7l3.8 6"/></svg>;
}

export function CompassIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z"/></svg>;
}

export function ChartIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19V9M10 19V5M16 19v-7M22 19V3"/></svg>;
}

export function CheckIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>;
}

export function TiltCard({ children, className = "", intensity = 8 }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glowX: 50, glowY: 50 });

  const onMove = (event) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    setTilt({ x: -(py - 0.5) * intensity, y: (px - 0.5) * intensity, glowX: px * 100, glowY: py * 100 });
  };

  return <div ref={ref} onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0, glowX: 50, glowY: 50 })} className={`tilt-card ${className}`} style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`, "--glow-x": `${tilt.glowX}%`, "--glow-y": `${tilt.glowY}%` }}>{children}</div>;
}

export function IntelligenceCore({ pointer }) {
  const style = { transform: `translate3d(${pointer.x * 20}px, ${pointer.y * 16}px, 0) rotateX(${pointer.y * -7}deg) rotateY(${pointer.x * 9}deg)` };

  return (
    <div className="relative mx-auto h-[470px] w-full max-w-[620px] select-none sm:h-[590px]">
      <div className="core-halo absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full"/>
      <div className="core-beam core-beam-a absolute left-1/2 top-1/2 h-[2px] w-[390px] -translate-x-1/2 -translate-y-1/2"/>
      <div className="core-beam core-beam-b absolute left-1/2 top-1/2 h-[2px] w-[390px] -translate-x-1/2 -translate-y-1/2"/>
      <div className="orbit orbit-a absolute left-1/2 top-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"/>
      <div className="orbit orbit-b absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"/>
      <div className="orbit orbit-c absolute left-1/2 top-1/2 h-[510px] w-[510px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]"/>

      <div className="core-stage absolute inset-0 transition-transform duration-200 ease-out" style={style}>
        <div className="core-float absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <div className="core-shell relative flex h-44 w-44 items-center justify-center rounded-[42px] border border-white/15 bg-white/[0.055] shadow-2xl backdrop-blur-2xl sm:h-52 sm:w-52">
            <div className="scan-surface absolute inset-3 rounded-[34px]"/>
            <div className="relative flex h-28 w-28 items-center justify-center rounded-[34px] border border-[#d9b45a]/35 bg-[#0b0f1a] shadow-[0_0_90px_rgba(217,180,90,.2)] sm:h-32 sm:w-32"><div className="absolute inset-3 rounded-[26px] border border-white/[0.06]"/><span className="gold-gradient text-5xl font-semibold tracking-[-0.08em]">C</span></div>
          </div>
        </div>

        <div className="float-card float-card-a absolute left-0 top-[13%] z-30 w-[190px] rounded-2xl border border-white/10 bg-[#0b0f19]/82 p-4 shadow-2xl backdrop-blur-xl sm:left-[-4px]">
          <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7867ff]/10 text-[#9f94ff]"><BrainIcon/></span><div><p className="text-[10px] uppercase tracking-[.18em] text-white/30">Career fit</p><p className="mt-1 text-sm font-semibold">AI Engineer</p></div></div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="data-fill h-full w-[78%] rounded-full bg-gradient-to-r from-[#7867ff] to-[#d9b45a]"/></div><p className="mt-2 text-right text-[10px] text-white/35">78% readiness</p>
        </div>

        <div className="float-card float-card-b absolute right-0 top-[17%] z-30 w-[176px] rounded-2xl border border-white/10 bg-[#0b0f19]/82 p-4 shadow-2xl backdrop-blur-xl sm:right-[-3px]">
          <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d9b45a]/10 text-[#efd080]"><FileIcon/></span><div><p className="text-[10px] uppercase tracking-[.18em] text-white/30">Resume</p><p className="mt-1 text-sm font-semibold">82 / 100</p></div></div><p className="mt-4 text-xs leading-5 text-white/35">Strong structure · impact gap</p>
        </div>

        <div className="float-card float-card-c absolute bottom-[13%] left-[4%] z-30 w-[182px] rounded-2xl border border-white/10 bg-[#0b0f19]/82 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between"><span className="text-[10px] uppercase tracking-[.18em] text-white/30">Growth</span><span className="text-xs text-emerald-300">+18%</span></div><div className="mt-3 flex h-10 items-end gap-1.5">{[38,50,44,63,58,74,88].map((height,index)=><span key={index} className="growth-bar flex-1 rounded-t bg-white/10" style={{height:`${height}%`,animationDelay:`${index*80}ms`}}/>)}</div>
        </div>

        <div className="float-card float-card-d absolute bottom-[8%] right-[4%] z-30 w-[196px] rounded-2xl border border-white/10 bg-[#0b0f19]/82 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d9b45a]/10 text-[#efd080]"><RouteIcon/></span><div><p className="text-[10px] uppercase tracking-[.18em] text-white/30">Next move</p><p className="mt-1 text-sm font-semibold">Build ML project</p></div></div><p className="mt-3 text-[11px] leading-4 text-white/35">Highest-value action for your target path.</p>
        </div>
      </div>
    </div>
  );
}

export const systemCards = [
  { icon:<FileIcon/>, tag:"Analyze", title:"Resume Intelligence", text:"Find weak evidence, missing skills and role-alignment gaps hidden inside your current resume.", href:"/resume-intelligence" },
  { icon:<BrainIcon/>, tag:"Understand", title:"Career Intelligence", text:"Discover suitable paths, compare readiness and understand exactly why each role matches you.", href:"/career-intelligence" },
  { icon:<RouteIcon/>, tag:"Act", title:"Personal Roadmaps", text:"Turn your gaps into a clear progression of skills, projects and milestones toward your target role.", href:"/roadmaps" },
];

export function FeatureCard({ item, index }) {
  return <TiltCard className="group rounded-[28px] border border-white/[.075] bg-white/[.025] p-6 sm:p-7"><div className="flex items-start justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${index===1?'border-[#7867ff]/20 bg-[#7867ff]/10 text-[#a79dff]':'border-[#d9b45a]/20 bg-[#d9b45a]/[.08] text-[#efd080]'}`}>{item.icon}</span><span className="rounded-full border border-white/[.07] px-2.5 py-1 text-[9px] uppercase tracking-[.16em] text-white/28">{item.tag}</span></div><h3 className="mt-12 text-2xl font-semibold tracking-[-.035em]">{item.title}</h3><p className="mt-3 text-sm leading-6 text-white/38">{item.text}</p><Link to={item.href} className="mt-7 inline-flex items-center gap-2 text-sm text-white/45 transition group-hover:text-[#efd080]">Explore feature <Arrow size={15}/></Link></TiltCard>;
}
