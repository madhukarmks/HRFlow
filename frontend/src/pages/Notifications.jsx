import React,{useEffect,useState} from "react";
import {Bell,Check} from "lucide-react";
import api from "../api";
import {Badge,Empty,ErrorBox,PageHeader,Spinner} from "../components";
import {useAuth} from "../auth";
export default function Notifications(){
 const {user}=useAuth();const [rows,setRows]=useState([]),[busy,setBusy]=useState(true),[err,setErr]=useState("");
 const load=()=>{if(!user?.userId)return;setBusy(true);api.get(`/notifications/user/${user.userId}`).then(r=>setRows(r.data||[])).catch(setErr).finally(()=>setBusy(false))};useEffect(load,[user?.userId]);
 const read=async id=>{try{await api.put(`/notifications/${id}/read`);load()}catch(x){setErr(x)}};
 return <div><PageHeader title="Notifications" subtitle="Important events and workflow updates."/><div>{err&&<ErrorBox error={err}/>} {busy?<Spinner/>:rows.length===0?<Empty title="You're all caught up" text="No notifications are available for this account."/>:<div className="space-y-3">{rows.map(n=><div key={n.id} className={`card flex items-start gap-4 p-5 ${!n.readFlag?"border-indigo-200 dark:border-indigo-900":""}`}><div className="rounded-xl bg-indigo-50 p-2.5 text-brand dark:bg-indigo-950/50"><Bell size={18}/></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="font-bold">{n.title}</h3>{!n.readFlag&&<Badge tone="purple">NEW</Badge>}</div><p className="mt-1 text-sm text-slate-500">{n.message}</p><p className="mt-2 text-xs text-slate-400">{n.createdAt}</p></div>{!n.readFlag&&<button className="btn-secondary px-3" onClick={()=>read(n.id)}><Check size={15}/> Read</button>}</div>)}</div>}</div></div>
}
