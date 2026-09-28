import React,{useEffect,useState} from "react";
import {BarChart3,Database,Download,Users} from "lucide-react";
import {BarChart,Bar,ResponsiveContainer,XAxis,YAxis,Tooltip,CartesianGrid} from "recharts";
import api from "../api";
import {ErrorBox,PageHeader,Spinner,StatCard} from "../components";
export default function Reports(){
 const [data,setData]=useState(null),[busy,setBusy]=useState(true),[err,setErr]=useState("");
 useEffect(()=>{api.get("/reports/summary").then(r=>setData(r.data)).catch(setErr).finally(()=>setBusy(false))},[]);
 if(busy)return <Spinner/>;if(err)return <ErrorBox error={err}/>;
 const chart=[["employees","Employees"],["attendanceRecords","Attendance"],["leaveRequests","Leaves"],["payrollRecords","Payroll"],["candidates","Candidates"]].map(([k,l])=>({name:l,value:data[k]||0}));
 return <div><PageHeader title="Reports & Analytics" subtitle="Current system-level operational counts from the backend." actions={<button className="btn-secondary" onClick={()=>window.print()}><Download size={16}/> Print / PDF</button>}/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><StatCard icon={Users} label="Employees" value={data.employees}/><StatCard icon={Database} label="Attendance" value={data.attendanceRecords}/><StatCard icon={BarChart3} label="Leaves" value={data.leaveRequests}/><StatCard icon={Database} label="Payroll" value={data.payrollRecords}/><StatCard icon={Users} label="Candidates" value={data.candidates}/></div><div className="card mt-6 p-6"><h2 className="font-black">Module volume</h2><div className="mt-5 h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={chart}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name"/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="value" fill="#635bff" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div></div></div>
}
