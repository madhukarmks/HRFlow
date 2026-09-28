import React,{useEffect,useState} from "react";
import {CalendarCheck,LogIn,LogOut} from "lucide-react";
import api from "../api";
import {Badge,ErrorBox,PageHeader,Spinner,Table} from "../components";
import {useAuth} from "../auth";
export default function Attendance(){
 const {user}=useAuth();const [rows,setRows]=useState([]),[employees,setEmployees]=useState([]),[selected,setSelected]=useState(user?.employeeId||""),[busy,setBusy]=useState(true),[err,setErr]=useState("");
 const load=()=>{setBusy(true);Promise.all([api.get("/attendance",{params:selected?{employeeId:selected}:{} }),api.get("/employees")]).then(([a,b])=>{setRows(a.data||[]);setEmployees(b.data||[]) }).catch(setErr).finally(()=>setBusy(false))};useEffect(load,[selected]);
 const action=async type=>{if(!selected)return;try{await api.post(`/attendance/${type}/${selected}`);load()}catch(x){setErr(x)}};
 const empName=id=>{const e=employees.find(x=>x.id===id);return e?`${e.firstName} ${e.lastName}`:id};
 return <div><PageHeader title={user?.role==="EMPLOYEE"?"My Attendance":"Attendance"} subtitle="Real-time check-in, check-out and attendance history." actions={user?.role==="EMPLOYEE"&&<><button className="btn-primary" onClick={()=>action("check-in")}><LogIn size={17}/> Check in</button><button className="btn-secondary" onClick={()=>action("check-out")}><LogOut size={17}/> Check out</button></>}/>{err&&<ErrorBox error={err}/>}
 {!["EMPLOYEE"].includes(user?.role)&&<div className="mb-4 max-w-sm"><label className="label">Employee</label><select className="input" value={selected} onChange={e=>setSelected(e.target.value)}><option value="">All employees</option>{employees.map(e=><option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}</select></div>}
 {busy?<Spinner/>:<Table rows={rows} columns={[{key:"employeeId",label:"Employee",render:r=>empName(r.employeeId)},{key:"attendanceDate",label:"Date"},{key:"checkIn",label:"Check in"},{key:"checkOut",label:"Check out"},{key:"workingMinutes",label:"Working",render:r=>`${Math.floor((r.workingMinutes||0)/60)}h ${(r.workingMinutes||0)%60}m`},{key:"status",label:"Status",render:r=><Badge tone={r.status==="PRESENT"?"green":"yellow"}>{r.status}</Badge>},{key:"location",label:"Location"}]}/>}
 </div>
}
