import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";
import { AppShell } from "./layouts";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import Payroll from "./pages/Payroll";
import Recruitment from "./pages/Recruitment";
import Performance from "./pages/Performance";
import Documents from "./pages/Documents";
import Announcements from "./pages/Announcements";
import Notifications from "./pages/Notifications";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/SettingsPage";

function Guard({children}) {
  const {user}=useAuth();
  return user ? children : <Navigate to="/login" replace/>;
}
function RoleGuard({children, roles}) {
  const {user}=useAuth();
  if(!user) return <Navigate to="/login" replace/>;
  return roles.includes(user.role) ? children : <Navigate to="/dashboard" replace/>;
}
export default function App(){
 return <AuthProvider><Routes>
   <Route path="/login" element={<Login/>}/>
   <Route element={<Guard><AppShell/></Guard>}>
     <Route index element={<Navigate to="/dashboard" replace/>}/>
     <Route path="/dashboard" element={<Dashboard/>}/>
     <Route path="/employees" element={<RoleGuard roles={["ADMIN","HR","MANAGER"]}><Employees/></RoleGuard>}/>
     <Route path="/departments" element={<RoleGuard roles={["ADMIN","HR","MANAGER"]}><Departments/></RoleGuard>}/>
     <Route path="/attendance" element={<Attendance/>}/>
     <Route path="/leaves" element={<Leaves/>}/>
     <Route path="/payroll" element={<Payroll/>}/>
     <Route path="/recruitment" element={<RoleGuard roles={["ADMIN","HR","MANAGER"]}><Recruitment/></RoleGuard>}/>
     <Route path="/performance" element={<Performance/>}/>
     <Route path="/documents" element={<Documents/>}/>
     <Route path="/announcements" element={<Announcements/>}/>
     <Route path="/notifications" element={<Notifications/>}/>
     <Route path="/tasks" element={<Tasks/>}/>
     <Route path="/reports" element={<RoleGuard roles={["ADMIN","HR","MANAGER"]}><Reports/></RoleGuard>}/>
     <Route path="/profile" element={<Profile/>}/>
     <Route path="/settings" element={<SettingsPage/>}/>
   </Route>
   <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
 </Routes></AuthProvider>
}
