import React, { useState } from "react";
import { Eye, EyeOff, Moon, ShieldCheck, Sun } from "lucide-react";
import api from "../api";
import { ErrorBox } from "../components";

export default function SettingsPage() {
  const [dark, setDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const toggle = () => {
    const value = !dark;
    setDark(value);
    document.documentElement.classList.toggle("dark", value);
    localStorage.setItem("hrflow_theme", value ? "dark" : "light");
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword.length < 6) {
      setError("New password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setBusy(true);

    try {
      const { data } = await api.post("/auth/change-password", {
        currentPassword,
        newPassword
      });

      setMessage(data?.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to change password."
      );
    } finally {
      setBusy(false);
    }
  };

  const passwordInput = (
    value,
    setValue,
    show,
    setShow,
    placeholder
  ) => (
    <div className="relative">
      <input
        className="input pr-11"
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        required
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title">Settings</h1>
        <p className="mt-1 muted">
          Workspace preferences and account security.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-brand dark:bg-indigo-950/50">
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </div>
            <div>
              <h2 className="font-black">Appearance</h2>
              <p className="muted">Choose your dashboard theme.</p>
            </div>
          </div>

          <button className="btn-secondary mt-5" onClick={toggle}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
            {dark ? "Switch to light mode" : "Switch to dark mode"}
          </button>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/50">
              <ShieldCheck size={19} />
            </div>
            <div>
              <h2 className="font-black">Change Password</h2>
              <p className="muted">
                Update your own login password securely.
              </p>
            </div>
          </div>

          <form onSubmit={changePassword} className="mt-5 space-y-4">
            {error && <ErrorBox error={error} />}

            {message && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                {message}
              </div>
            )}

            <div>
              <label className="label">Current password</label>
              {passwordInput(
                currentPassword,
                setCurrentPassword,
                showCurrent,
                setShowCurrent,
                "Enter current password"
              )}
            </div>

            <div>
              <label className="label">New password</label>
              {passwordInput(
                newPassword,
                setNewPassword,
                showNew,
                setShowNew,
                "Minimum 6 characters"
              )}
            </div>

            <div>
              <label className="label">Confirm new password</label>
              {passwordInput(
                confirmPassword,
                setConfirmPassword,
                showConfirm,
                setShowConfirm,
                "Re-enter new password"
              )}
            </div>

            <button
              className="btn-primary w-full"
              disabled={busy}
            >
              {busy ? "Updating password..." : "Change password"}
            </button>
          </form>
        </div>

        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <ShieldCheck size={19} />
            </div>
            <div>
              <h2 className="font-black">Security</h2>
              <p className="muted">
                JWT authentication is handled by the Spring Boot backend.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm dark:bg-slate-800">
            Passwords are stored using BCrypt. Your password change request
            uses the currently authenticated account, so an employee cannot
            change another employee's password by supplying another employee ID.
          </div>
        </div>
      </div>
    </div>
  );
}
