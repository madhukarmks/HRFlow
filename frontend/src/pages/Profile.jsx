import React,{useEffect,useState} from "react";
import {UserRound} from "lucide-react";
import api from "../api";
import {Badge,ErrorBox,PageHeader,Spinner} from "../components";
import {useAuth} from "../auth";
export default function Profile(){
 const {user}=useAuth();const [employee,setEmployee]=useState(null),[busy,setBusy]=useState(true),[err,setErr]=useState("");
 useEffect(()=>{if(user?.employeeId)api.get(`/employees/${user.employeeId}`).then(r=>setEmployee(r.data)).catch(setErr).finally(()=>setBusy(false));else setBusy(false)},[user?.employeeId]);
 if(busy)return <Spinner/>;if(err)return <ErrorBox error={err}/>;
 return <div><PageHeader title="My Profile" subtitle="Your account and employment profile."/><div className="grid gap-6 lg:grid-cols-[280px_1fr]"><div className="card p-6 text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-indigo-50 text-4xl font-black text-brand dark:bg-indigo-950/50">{(employee?.firstName||user?.email||"U")[0].toUpperCase()}</div><h2 className="mt-4 text-xl font-black">{employee?`${employee.firstName} ${employee.lastName}`:user?.email}</h2><p className="muted">{employee?.designation||user?.role}</p><Badge tone="green">{user?.role}</Badge></div><div className="card p-6"><h2 className="mb-5 font-black">Employment information</h2><div className="grid gap-5 sm:grid-cols-2">{[["Employee ID",employee?.employeeCode],["Email",employee?.email],["Phone",employee?.phone],["Department ID",employee?.departmentId],["Designation",employee?.designation],["Joining date",employee?.joiningDate],["Work location",employee?.workLocation],["Employment status",employee?.status]].map(([l,v])=><div key={l}><div className="label">{l}</div><div className="font-semibold">{v||"—"}</div></div>)}</div></div></div></div>
}
