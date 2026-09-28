import React, { useEffect, useState } from "react";
import { Bell, Check, ChevronLeft, ChevronRight, Loader2, Search, X } from "lucide-react";

export function Spinner({ text = "Loading..." }) {
  return <div className="flex min-h-[220px] items-center justify-center gap-3 text-slate-500"><Loader2 className="animate-spin" size={20}/>{text}</div>;
}
export function Empty({ title="Nothing here yet", text="No records match your current filters." }) {
  return <div className="card flex min-h-[220px] flex-col items-center justify-center p-8 text-center"><div className="mb-3 rounded-2xl bg-slate-100 p-3 dark:bg-slate-800"><Search size={22}/></div><h3 className="font-bold text-slate-900 dark:text-white">{title}</h3><p className="mt-1 max-w-md text-sm text-slate-500">{text}</p></div>;
}
export function ErrorBox({ error }) {
  return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">{error?.response?.data?.message || error?.response?.data?.error || error?.message || "Something went wrong."}</div>;
}
export function Toast({ toast, clear }) {
  if (!toast) return null;
  return <div className="fixed bottom-5 right-5 z-[100] flex max-w-sm items-start gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-2xl"><Check size={18} className="mt-0.5 text-emerald-400"/><div className="text-sm">{toast}</div><button onClick={clear}><X size={16}/></button></div>;
}
export function Modal({ open, title, children, onClose, width="max-w-2xl" }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className={`max-h-[92vh] w-full ${width} overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900`}><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-black text-slate-900 dark:text-white">{title}</h2><button className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose}><X size={20}/></button></div>{children}</div></div>;
}
export function Badge({ children, tone="slate" }) {
  const map={green:"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",red:"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",yellow:"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",blue:"bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",purple:"bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",slate:"bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"};
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${map[tone]||map.slate}`}>{children}</span>;
}
export function Table({ columns, rows, keyField="id", empty }) {
  if (!rows?.length) return empty || <Empty/>;
  return <div className="card overflow-hidden"><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400"><tr>{columns.map(c=><th key={c.key} className="whitespace-nowrap px-5 py-3.5 font-bold">{c.label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{rows.map((row,i)=><tr key={row[keyField]??i} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">{columns.map(c=><td key={c.key} className="whitespace-nowrap px-5 py-4 text-slate-700 dark:text-slate-200">{c.render?c.render(row):row[c.key] ?? "—"}</td>)}</tr>)}</tbody></table></div></div>;
}
export function StatCard({ icon:Icon, label, value, note, tone="indigo" }) {
  const colors={indigo:"bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50",emerald:"bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50",amber:"bg-amber-50 text-amber-600 dark:bg-amber-950/50",rose:"bg-rose-50 text-rose-600 dark:bg-rose-950/50",blue:"bg-blue-50 text-blue-600 dark:bg-blue-950/50"};
  return <div className="card p-5"><div className="flex items-start justify-between"><div><p className="muted">{label}</p><p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{value ?? "—"}</p>{note&&<p className="mt-1 text-xs text-slate-500">{note}</p>}</div><div className={`rounded-2xl p-3 ${colors[tone]}`}><Icon size={20}/></div></div></div>;
}
export function PageHeader({ title, subtitle, actions }) {
  return <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><h1 className="page-title">{title}</h1>{subtitle&&<p className="mt-1 muted">{subtitle}</p>}</div><div className="flex flex-wrap gap-2">{actions}</div></div>;
}
export function SearchBox({ value, onChange, placeholder="Search..." }) {
  return <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17}/><input className="input pl-10" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></div>;
}
export function Pagination({ page, pages, setPage }) {
  if (!pages || pages<=1) return null;
  return <div className="mt-4 flex items-center justify-end gap-2"><button className="btn-secondary px-3" disabled={page<=1} onClick={()=>setPage(page-1)}><ChevronLeft size={16}/></button><span className="text-sm text-slate-500">Page {page} of {pages}</span><button className="btn-secondary px-3" disabled={page>=pages} onClick={()=>setPage(page+1)}><ChevronRight size={16}/></button></div>;
}
