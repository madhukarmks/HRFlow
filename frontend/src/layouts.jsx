import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  FileText,
  Gauge,
  LogOut,
  Menu,
  Moon,
  PanelLeft,
  Settings,
  ShieldCheck,
  Sun,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "./auth";
import api from "./api";

const adminItems = [
  ["Dashboard", "/dashboard", Gauge],
  ["Employees", "/employees", Users],
  ["Departments", "/departments", Building2],
  ["Attendance", "/attendance", CalendarDays],
  ["Leave Management", "/leaves", ClipboardCheck],
  ["Payroll", "/payroll", CircleDollarSign],
  ["Recruitment", "/recruitment", BriefcaseBusiness],
  ["Performance", "/performance", Activity],
  ["Documents", "/documents", FileText],
  ["Announcements", "/announcements", Bell],
  ["Reports", "/reports", FileText],
  ["Settings", "/settings", Settings],
];

const empItems = [
  ["Dashboard", "/dashboard", Gauge],
  ["My Profile", "/profile", UserRound],
  ["My Attendance", "/attendance", CalendarDays],
  ["My Leave", "/leaves", ClipboardCheck],
  ["My Payroll", "/payroll", CircleDollarSign],
  ["My Documents", "/documents", FileText],
  ["My Performance", "/performance", Activity],
  ["My Tasks", "/tasks", ClipboardCheck],
  ["Announcements", "/announcements", Bell],
  ["Notifications", "/notifications", Bell],
  ["Settings", "/settings", Settings],
];

export function AppShell() {
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [dark, setDark] = useState(
    localStorage.getItem("hrflow_theme") === "dark"
  );
  const [notifications, setNotifications] = useState([]);

  const loc = useLocation();

  const employee = user?.role === "EMPLOYEE";
  const items = employee ? empItems : adminItems;

  const title =
    loc.pathname.split("/")[1]?.replaceAll("-", " ") || "dashboard";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);

    localStorage.setItem(
      "hrflow_theme",
      dark ? "dark" : "light"
    );
  }, [dark]);

  useEffect(() => {
    if (user?.userId) {
      api
        .get(`/notifications/user/${user.userId}`)
        .then((r) => setNotifications(r.data || []))
        .catch(() => setNotifications([]));
    }
  }, [user?.userId, loc.pathname]);

  const handleLogout = () => {
    setMobile(false);
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 hidden
          border-r border-slate-200 bg-white
          transition-all duration-300
          dark:border-slate-800 dark:bg-slate-900
          lg:block
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        <Sidebar
          collapsed={collapsed}
          items={items}
          user={user}
          logout={handleLogout}
        />
      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      {mobile && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 lg:hidden"
          onClick={() => setMobile(false)}
        >
          <aside
            className="
              h-full w-72
              bg-white
              shadow-2xl
              dark:bg-slate-900
            "
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              collapsed={false}
              items={items}
              user={user}
              logout={handleLogout}
              close={() => setMobile(false)}
            />
          </aside>
        </div>
      )}

      {/* ================= MAIN AREA ================= */}
      <div
        className={`
          min-h-screen transition-all duration-300
          ${collapsed ? "lg:pl-20" : "lg:pl-64"}
        `}
      >

        {/* ================= TOP NAVBAR ================= */}
        <header
          className="
            sticky top-0 z-30
            flex h-16 items-center gap-3
            border-b border-slate-200
            bg-white/90 px-4
            backdrop-blur
            dark:border-slate-800
            dark:bg-slate-950/90
            md:px-6
          "
        >

          {/* Mobile menu */}
          <button
            type="button"
            className="
              rounded-xl p-2
              hover:bg-slate-100
              dark:hover:bg-slate-800
              lg:hidden
            "
            onClick={() => setMobile(true)}
          >
            <Menu size={20} />
          </button>

          {/* Desktop collapse */}
          <button
            type="button"
            className="
              hidden rounded-xl p-2
              hover:bg-slate-100
              dark:hover:bg-slate-800
              lg:block
            "
            onClick={() => setCollapsed((v) => !v)}
          >
            <PanelLeft size={19} />
          </button>

          {/* Page title */}
          <div
            className="
              hidden text-sm font-semibold
              capitalize text-slate-500
              md:block
            "
          >
            {title}
          </div>

          <div className="ml-auto flex items-center gap-2">

            {/* Notifications */}
            <Link
              to="/notifications"
              className="
                relative rounded-xl p-2.5
                hover:bg-slate-100
                dark:hover:bg-slate-800
              "
            >
              <Bell size={19} />

              {notifications.filter(
                (n) => !n.readFlag
              ).length > 0 && (
                <span
                  className="
                    absolute right-1 top-1
                    h-2 w-2 rounded-full
                    bg-rose-500
                  "
                />
              )}
            </Link>

            {/* Theme */}
            <button
              type="button"
              className="
                rounded-xl p-2.5
                hover:bg-slate-100
                dark:hover:bg-slate-800
              "
              onClick={() => setDark((v) => !v)}
            >
              {dark ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>

            {/* Profile */}
            <Link
              to="/profile"
              className="
                hidden items-center gap-2
                rounded-xl px-2 py-1.5
                hover:bg-slate-100
                dark:hover:bg-slate-800
                sm:flex
              "
            >
              <div
                className="
                  grid h-8 w-8 place-items-center
                  rounded-full bg-brand
                  text-xs font-black text-white
                "
              >
                {(user?.email || "U")[0].toUpperCase()}
              </div>

              <div className="text-left">
                <div className="text-xs font-bold">
                  {user?.email}
                </div>

                <div className="text-[10px] text-slate-500">
                  {user?.role}
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* ================= PAGE CONTENT ================= */}
        <main
          className="
            mx-auto
            max-w-[1600px]
            p-4
            md:p-6
            lg:p-8
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}


/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  collapsed = false,
  items,
  user,
  logout,
  close,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* =====================================================
          SIDEBAR HEADER
      ===================================================== */}
      <div
        className="
          flex h-16
          flex-none
          items-center
          gap-3
          border-b
          border-slate-200
          px-5
          dark:border-slate-800
        "
      >

        {!collapsed ? (
          <Link
            to="/dashboard"
            className="flex min-w-0 items-center gap-3"
            onClick={close}
          >
            <div
              className="
                grid h-9 w-9
                flex-none
                place-items-center
                rounded-xl
                bg-brand
                text-white
              "
            >
              <ShieldCheck size={20} />
            </div>

            <div className="min-w-0">
              <div className="font-black tracking-tight">
                HR<span className="text-brand">Flow</span>
              </div>

              <div
                className="
                  truncate
                  text-[9px]
                  uppercase
                  tracking-widest
                  text-slate-400
                "
              >
                People • Payroll • Performance
              </div>
            </div>
          </Link>
        ) : (
          <Link to="/dashboard">
            <div
              className="
                grid h-9 w-9
                place-items-center
                rounded-xl
                bg-brand
                text-white
              "
            >
              <ShieldCheck size={20} />
            </div>
          </Link>
        )}

        {/* Mobile close */}
        <button
          type="button"
          className="ml-auto lg:hidden"
          onClick={close}
        >
          <X size={18} />
        </button>
      </div>


      {/* =====================================================
          SCROLLABLE NAVIGATION

          IMPORTANT FIX:
          flex-1 + min-h-0 + overflow-y-auto

          Ab menu scroll hoga aur Logout neeche fixed rahega.
      ===================================================== */}
      <nav
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          px-3
          py-4

          scrollbar-thin
          scrollbar-thumb-slate-300
          scrollbar-track-transparent

          dark:scrollbar-thumb-slate-700
        "
      >

        <div
          className="
            mb-2
            px-3
            text-[10px]
            font-black
            uppercase
            tracking-widest
            text-slate-400
          "
        >
          {user?.role === "EMPLOYEE"
            ? "Employee"
            : "HR Workspace"}
        </div>

        {items.map(([label, path, Icon]) => (
          <NavLink
            key={path}
            to={path}
            onClick={close}
            className={({ isActive }) =>
              `
                mb-1
                flex
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5
                text-sm
                font-semibold
                transition-all
                duration-200

                ${
                  isActive
                    ? `
                      bg-indigo-50
                      text-brand
                      shadow-sm
                      dark:bg-indigo-950/50
                    `
                    : `
                      text-slate-600
                      hover:bg-slate-100
                      dark:text-slate-300
                      dark:hover:bg-slate-800
                    `
                }

                ${collapsed ? "justify-center" : ""}
              `
            }
          >
            <Icon
              size={18}
              className="flex-none"
            />

            {!collapsed && (
              <span className="truncate">
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>


      {/* =====================================================
          LOGOUT FOOTER

          IMPORTANT:
          flex-none means this section NEVER gets pushed
          below the viewport.
      ===================================================== */}
      <div
        className="
          flex-none
          border-t
          border-slate-200
          bg-white
          p-3
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <button
          type="button"
          onClick={logout}
          className={`
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-sm
            font-semibold
            text-rose-600
            transition
            hover:bg-rose-50
            dark:hover:bg-rose-950/30

            ${collapsed ? "justify-center" : ""}
          `}
        >
          <LogOut
            size={18}
            className="flex-none"
          />

          {!collapsed && (
            <span>
              Sign out
            </span>
          )}
        </button>
      </div>

    </div>
  );
}