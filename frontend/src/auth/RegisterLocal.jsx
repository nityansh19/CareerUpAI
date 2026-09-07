import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../lib/api";
import { getStoredUser, storeUser } from "./session";

export default function RegisterLocal() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const response = await fetch(apiUrl("/api/users/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, email: form.email.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed.");

      storeUser(data.user);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message || "Unable to create your account right now.");
    } finally {
      setLoading(false);
    }
  };

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="min-h-screen bg-[#050711] px-5 py-8 text-white">
      <style>{`body{background:#050711}.auth-grid{background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(to bottom,black,transparent 92%)}`}</style>
      <div className="pointer-events-none fixed inset-0"><div className="auth-grid absolute inset-0"/><div className="absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-[#7867ff]/12 blur-[150px]"/><div className="absolute -bottom-36 right-[10%] h-[430px] w-[430px] rounded-full bg-[#d9b45a]/10 blur-[150px]"/></div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[34px] border border-white/[0.08] bg-white/[0.025] shadow-2xl backdrop-blur-2xl lg:grid-cols-[.95fr_1.05fr]">
          <section className="p-7 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <Link to="/" className="mb-10 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9b45a]/30 bg-[#d9b45a]/10 text-[#efd080]">C</span><span className="text-sm font-semibold">CareerUp AI</span></Link>
              <p className="text-[10px] uppercase tracking-[.2em] text-[#d9b45a]">Create account</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em]">Build your Career Profile.</h1>
              <p className="mt-3 text-sm leading-6 text-white/32">Create your account once, and CareerUp will keep your local session available on this device.</p>

              {message && <div className="mt-6 rounded-2xl border border-rose-400/15 bg-rose-400/[0.05] px-4 py-3 text-sm text-rose-200/80">{message}</div>}

              <form onSubmit={submit} className="mt-8 space-y-5">
                <label className="block"><span className="mb-2 block text-xs text-white/45">Full name</span><input value={form.name} onChange={(e)=>setField("name",e.target.value)} required autoComplete="name" placeholder="Your full name" className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm outline-none placeholder:text-white/18 focus:border-[#d9b45a]/45 focus:ring-4 focus:ring-[#d9b45a]/[0.07]"/></label>
                <label className="block"><span className="mb-2 block text-xs text-white/45">Email</span><input type="email" value={form.email} onChange={(e)=>setField("email",e.target.value)} required autoComplete="email" placeholder="you@example.com" className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm outline-none placeholder:text-white/18 focus:border-[#d9b45a]/45 focus:ring-4 focus:ring-[#d9b45a]/[0.07]"/></label>
                <label className="block"><span className="mb-2 block text-xs text-white/45">Password</span><div className="relative"><input type={showPassword?"text":"password"} value={form.password} onChange={(e)=>setField("password",e.target.value)} required minLength="6" autoComplete="new-password" placeholder="Minimum 6 characters" className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 pr-20 text-sm outline-none placeholder:text-white/18 focus:border-[#d9b45a]/45 focus:ring-4 focus:ring-[#d9b45a]/[0.07]"/><button type="button" onClick={()=>setShowPassword((v)=>!v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/32 hover:text-white">{showPassword?"Hide":"Show"}</button></div></label>
                <button disabled={loading} className="w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-[#070910] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">{loading?"Creating account…":"Create account"}</button>
              </form>

              <p className="mt-6 text-center text-xs text-white/30">Already have an account? <Link to="/login" className="text-[#efd080] hover:text-white">Sign in</Link></p>
            </div>
          </section>

          <section className="hidden min-h-[650px] border-l border-white/[0.07] p-12 lg:flex lg:flex-col lg:justify-between">
            <div><p className="text-[10px] uppercase tracking-[.22em] text-[#d9b45a]">One profile. Connected intelligence.</p><h2 className="mt-5 max-w-xl text-5xl font-medium leading-[1.02] tracking-[-.055em]">Start with context, then let every module build on it.</h2><p className="mt-5 max-w-lg text-sm leading-7 text-white/38">Resume Intelligence, Career Intelligence and your future roadmap will all use the same account and Career Profile.</p></div>
            <div className="grid grid-cols-3 gap-3">{["Resume","Career","Roadmap"].map((item)=><div key={item} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"><p className="text-[9px] uppercase tracking-[.16em] text-white/25">Connected</p><p className="mt-3 text-sm font-medium">{item}</p></div>)}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
