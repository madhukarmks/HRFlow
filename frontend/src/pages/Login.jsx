import React,{useState} from "react";
import { Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Login(){
 const {login}=useAuth(); const nav=useNavigate(); const [email,setEmail]=useState("admin@hrflow.local"),[password,setPassword]=useState("Admin@123"),[show,setShow]=useState(false),[busy,setBusy]=useState(false),[err,setErr]=useState("");
 const submit=async e=>{e.preventDefault();setErr("");setBusy(true);try{await login(email,password);nav("/dashboard")}catch(x){setErr(x.response?.data?.message||x.response?.data?.error||"Invalid email or password.")}finally{setBusy(false)}};
 return <div className="min-h-screen bg-slate-950"><div className="grid min-h-screen lg:grid-cols-2">
   <div className="hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-700 to-slate-950 p-12 text-white lg:flex">
    <div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15"><ShieldCheck/></div><div><div className="text-2xl font-black">HRFlow</div><div className="text-xs text-white/60">Smart Human Resource Management</div></div></div>
    <div className="max-w-xl"><Sparkles className="mb-5" size={34}/><h1 className="text-5xl font-black leading-tight">One platform for people, payroll & performance.</h1><p className="mt-5 text-lg text-white/70">A connected workspace for HR teams, managers and employees.</p><div className="mt-8 grid grid-cols-3 gap-3"><div className="rounded-2xl bg-white/10 p-4"><b>4</b><p className="mt-1 text-xs text-white/60">Role levels</p></div><div className="rounded-2xl bg-white/10 p-4"><b>JWT</b><p className="mt-1 text-xs text-white/60">Secure auth</p></div><div className="rounded-2xl bg-white/10 p-4"><b>API</b><p className="mt-1 text-xs text-white/60">Spring Boot</p></div></div></div>
    <p className="text-xs text-white/40">HRFlow • Portfolio-ready HR operations platform</p>
   </div>
   <div className="flex items-center justify-center bg-slate-50 p-5 dark:bg-slate-950"><form onSubmit={submit} className="w-full max-w-md">
     <div className="mb-8 lg:hidden"><div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white"><ShieldCheck/></div><h1 className="text-3xl font-black">Welcome to HRFlow</h1></div>
     <div className="mb-7"><h2 className="text-3xl font-black text-slate-900 dark:text-white">Welcome back</h2><p className="mt-2 muted">Sign in to continue to your workspace.</p></div>
     {err&&<div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</div>}
     <label className="label">Email</label><input className="input mb-4" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
     <label className="label">Password</label><div className="relative mb-5"><input className="input pr-11" type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" onClick={()=>setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>
     <div className="mb-6 flex items-center justify-between text-sm"><label className="flex items-center gap-2"><input type="checkbox" defaultChecked/> Remember me</label><span className="font-semibold text-brand">Secure access</span></div>
     <button className="btn-primary w-full py-3.5" disabled={busy}>{busy?"Signing in...":"Sign in"}</button>
     <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900"><b className="text-slate-700 dark:text-slate-200">Demo accounts</b><div className="mt-2 grid grid-cols-2 gap-2"><span>Admin: admin@hrflow.local</span><span>HR: hr@hrflow.local</span><span>Manager: manager@hrflow.local</span><span>Employee: employee@hrflow.local</span></div><p className="mt-2">Passwords are documented in the backend README.</p></div>
   </form></div>
 </div></div>
}
