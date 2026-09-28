import React,{useEffect,useState} from "react";
import {Activity, BriefcaseBusiness, CalendarCheck, CircleDollarSign, Clock3, Users, UserPlus, WalletCards} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api";
import { ErrorBox, PageHeader, Spinner, StatCard, Table, Badge } from "../components";
import { useAuth } from "../auth";

export default function Dashboard(){
 const {user}=useAuth(); const [data,setData]=useState(null),[emps,setEmps]=useState([]),[leaves,setLeaves]=useState([]),[busy,setBusy]=useState(true),[err,setErr]=useState("");
 useEffect(()=>{Promise.all([api.get("/dashboard"),api.get("/employees"),api.get("/leaves")]).then(([a,b,c])=>{setData(a.data);setEmps(b.data||[]);setLeaves(c.data||[])}).catch(setErr).finally(()=>setBusy(false))},[]);
 if(busy)return <Spinner/>; if(err)return <ErrorBox error={err}/>;
 const first=user?.role==="EMPLOYEE"?emps.find(e=>e.id===user.employeeId):null;
 const chart=emps.reduce((acc,e)=>{const m=e.joiningDate?.slice(0,7)||"Unknown";acc[m]=(acc[m]||0)+1;return acc},{}); const growth=Object.entries(chart).sort().map(([month,count])=>({month,count}));
 return <div><PageHeader title={user?.role==="EMPLOYEE"?`Good day, ${first?.firstName||"Employee"}`:"HR Operations Dashboard"} subtitle="Live data from your Spring Boot backend."/>
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
   <StatCard icon={Users} label="Total Employees" value={data.totalEmployees}/><StatCard icon={UserPlus} label="Active Employees" value={data.activeEmployees} tone="emerald"/>
   <StatCard icon={CalendarCheck} label="Present Today" value={data.presentToday} tone="blue"/><StatCard icon={Clock3} label="Pending Leave" value={data.pendingLeaveRequests} tone="amber"/>
   <StatCard icon={BriefcaseBusiness} label="Open Positions" value={data.openJobPositions} tone="purple"/><StatCard icon={WalletCards} label="Payroll Records" value={data.payrollRecords} tone="rose"/>
   <StatCard icon={Activity} label="On Leave" value={data.onLeave} tone="amber"/><StatCard icon={CircleDollarSign} label="API Status" value="Connected" tone="emerald"/>
  </div>
  <div className="mt-6 grid gap-6 xl:grid-cols-3">
   <div className="card p-5 xl:col-span-2"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-black">Employee Growth</h2><p className="muted">Joining records by month</p></div><Badge tone="purple">Live</Badge></div><div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={growth}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month"/><YAxis allowDecimals={false}/><Tooltip/><Area type="monotone" dataKey="count" stroke="#635bff" fill="#635bff" fillOpacity={.12}/></AreaChart></ResponsiveContainer></div></div>
   <div className="card p-5"><h2 className="font-black">Leave Pipeline</h2><p className="muted">Current request status</p><div className="mt-5 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={["PENDING","APPROVED","REJECTED"].map(s=>({status:s,count:leaves.filter(l=>l.status===s).length}))}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="status"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="count" fill="#635bff" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div></div>
  </div>
  <div className="mt-6"><h2 className="mb-3 font-black">Recent Employees</h2><Table rows={emps.slice(0,6)} columns={[{key:"employeeCode",label:"ID"},{key:"firstName",label:"Employee",render:r=><div><b>{r.firstName} {r.lastName}</b><div className="text-xs text-slate-400">{r.email}</div></div>},{key:"designation",label:"Designation"},{key:"status",label:"Status",render:r=><Badge tone={r.status==="ACTIVE"?"green":"yellow"}>{r.status}</Badge>}]} /></div>
 </div>
}
