import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../lib/api";
import { getStoredUser, storeUser } from "./session";

export default function LoginLocal() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (getStoredUser()) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(apiUrl("/api/users/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid email or password.");

      storeUser(data.user);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message || "Unable to sign in right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050711] px-5 py-8 text-white">
      <style>{`body{background:#050711}.auth-grid{background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(to bottom,black,transparent 92%)}`}</style>
      <div className="pointer-events-none fixed inset-0"><div className="auth-grid absolute inset-0"/><div className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-[#7867ff]/12 blur-[150px]"/><div className="absolute -bottom-36 left-[12%] h-[430px] w-[430px] rounded-full bg-[#d9b45a]/10 blur-[150px]"/></div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[34px] border border-white/[0.08] bg-white/[0.025] shadow-2xl backdrop-blur-2xl lg:grid-cols-[1.05fr_.95fr]">
          <section className="hidden min-h-[650px] border-r border-white/[0.07] p-12 lg:flex lg:flex-col lg:justify-between">
            <Link to="/" className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d9b45a]/30 bg-[#d9b45a]/10 font-semibold text-[#efd080]">C</span><span><span className="block text-sm font-semibold">CareerUp AI</span><span className="text-[9px] uppercase tracking-[.22em] text-white/28">Career intelligence</span></span></Link>
            <div><p className="text-[10px] uppercase tracking-[.22em] text-[#d9b45a]">Welcome back</p><h1 className="mt-5 max-w-xl text-5xl font-medium leading-[1.02] tracking-[-.055em]">Your career profile keeps getting smarter.</h1><p className="mt-5 max-w-lg text-sm leading-7 text-white/38">Sign in to continue your resume analysis, career matches and personalized roadmap from the same CareerUp workspace.</p></div>
            <p className="text-xs text-white/22">Your password is never stored in localStorage.</p>
          </section>

          <section className="p-7 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <Link to="/" className="mb-10 flex items-center gap-3 lg:hidden"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9b45a]/30 bg-[#d9b45a]/10 text-[#efd080]">C</span><span className="text-sm font-semibold">CareerUp AI</span></Link>
              <p className="text-[10px] uppercase tracking-[.2em] text-[#d9b45a]">Sign in</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-.04em]">Continue your CareerUp journey.</h2>
              <p className="mt-3 text-sm leading-6 text-white/32">Your session stays available on this device after refresh.</p>

              {message && <div className="mt-6 rounded-2xl border border-rose-400/15 bg-rose-400/[0.05] px-4 py-3 text-sm text-rose-200/80">{message}</div>}

              <form onSubmit={submit} className="mt-8 space-y-5">
                <label className="block"><span className="mb-2 block text-xs text-white/45">Email</span><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm outline-none placeholder:text-white/18 focus:border-[#d9b45a]/45 focus:ring-4 focus:ring-[#d9b45a]/[0.07]"/></label>
                <label className="block"><span className="mb-2 block text-xs text-white/45">Password</span><div className="relative"><input type={showPassword?"text":"password"} value={password} onChange={(e)=>setPassword(e.target.value)} required autoComplete="current-password" placeholder="Enter your password" className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 pr-20 text-sm outline-none placeholder:text-white/18 focus:border-[#d9b45a]/45 focus:ring-4 focus:ring-[#d9b45a]/[0.07]"/><button type="button" onClick={()=>setShowPassword((v)=>!v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/32 hover:text-white">{showPassword?"Hide":"Show"}</button></div></label>
                <button disabled={loading} className="w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-[#070910] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">{loading?"Signing in…":"Sign in"}</button>
              </form>

              <p className="mt-6 text-center text-xs text-white/30">New to CareerUp? <Link to="/register" className="text-[#efd080] hover:text-white">Create an account</Link></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
