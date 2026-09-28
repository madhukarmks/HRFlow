import React, { useEffect, useState } from "react";
import { Edit3, Plus, Trash2, UserRound, ShieldCheck } from "lucide-react";
import api from "../api";
import { useAuth } from "../auth";
import {
  Badge,
  ErrorBox,
  Modal,
  PageHeader,
  SearchBox,
  Spinner,
  Table
} from "../components";

const empty = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  gender: "",
  dateOfBirth: "",
  designation: "",
  joiningDate: "",
  employmentType: "FULL_TIME",
  workLocation: "",
  status: "ACTIVE",

  basicSalary: 0,
  allowances: 0,
  deductions: 0,

  departmentId: "",
  managerId: "",
  userId: "",

  // Login account
  loginEmail: "",
  temporaryPassword: "",
  role: "EMPLOYEE"
};

export default function Employees() {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN" || user?.role === "HR";
  const canDelete = user?.role === "ADMIN";
  const [rows, setRows] = useState([]);
  const [deps, setDeps] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState("");

  const load = () => {
    setBusy(true);
    setErr("");

    Promise.all([
      api.get("/employees", {
        params: {
          search: search || undefined
        }
      }),
      api.get("/departments")
    ])
      .then(([a, b]) => {
        setRows(a.data || []);
        setDeps(b.data || []);
      })
      .catch(setErr)
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [search]);

  const save = async (e) => {
    e.preventDefault();

    try {
      setErr("");

      const body = {
        ...form,

        departmentId: form.departmentId
          ? Number(form.departmentId)
          : null,

        managerId: form.managerId
          ? Number(form.managerId)
          : null,

        userId: form.userId
          ? Number(form.userId)
          : null,

        basicSalary: Number(form.basicSalary || 0),
        allowances: Number(form.allowances || 0),
        deductions: Number(form.deductions || 0),

        // Login account
        loginEmail: form.loginEmail || form.email,
        role: form.role || "EMPLOYEE"
      };

      /*
       * For new employee:
       * Creates employee + login account through backend.
       */
      if (editing) {
        await api.put(`/employees/${editing}`, body);
      } else {
        await api.post("/employees", body);
      }

      setOpen(false);
      setForm(empty);
      setEditing(null);
      load();
    } catch (x) {
      setErr(x);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this employee?")) return;

    try {
      await api.delete(`/employees/${id}`);
      load();
    } catch (x) {
      setErr(x);
    }
  };

  const field = (k, label, type = "text", required = false) => (
    <div>
      <label className="label">
        {label}
        {required && (
          <span className="ml-1 text-rose-500">*</span>
        )}
      </label>

      <input
        className="input"
        type={type}
        value={form[k] ?? ""}
        onChange={(e) =>
          setForm({
            ...form,
            [k]: e.target.value
          })
        }
        required={required}
      />
    </div>
  );

  const openCreate = () => {
    setErr("");
    setForm({
      ...empty
    });
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (r) => {
    setErr("");

    setForm({
      ...empty,
      ...r,

      departmentId: r.departmentId || "",
      managerId: r.managerId || "",
      userId: r.userId || "",

      loginEmail: r.loginEmail || r.email || "",
      temporaryPassword: "",
      role: r.role || "EMPLOYEE"
    });

    setEditing(r.id);
    setOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle="Search, onboard and maintain employee records."
        actions={
          canManage ? (
            <button
              className="btn-primary"
              onClick={openCreate}
            >
              <Plus size={17} />
              Add employee
            </button>
          ) : null
        }
      />

      {err && <ErrorBox error={err} />}

      <div className="mb-4 max-w-md">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search name, email or employee ID..."
        />
      </div>

      {busy ? (
        <Spinner />
      ) : (
        <Table
          rows={rows}
          columns={[
            {
              key: "employeeCode",
              label: "Employee ID"
            },

            {
              key: "firstName",
              label: "Employee",
              render: (r) => (
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-50 text-brand">
                    <UserRound size={17} />
                  </div>

                  <div>
                    <b>
                      {r.firstName} {r.lastName}
                    </b>

                    <div className="text-xs text-slate-400">
                      {r.email}
                    </div>
                  </div>
                </div>
              )
            },

            {
              key: "designation",
              label: "Designation"
            },

            {
              key: "departmentId",
              label: "Department",
              render: (r) =>
                deps.find(
                  (d) => d.id === r.departmentId
                )?.name || "—"
            },

            {
              key: "joiningDate",
              label: "Joining Date"
            },

            {
              key: "status",
              label: "Status",
              render: (r) => (
                <Badge
                  tone={
                    r.status === "ACTIVE"
                      ? "green"
                      : "yellow"
                  }
                >
                  {r.status}
                </Badge>
              )
            },

            {
              key: "actions",
              label: "Actions",
              render: (r) => (
                <div className="flex gap-1">
                  {canManage && (
                    <button
                      className="rounded-lg p-2 hover:bg-slate-100"
                      onClick={() => openEdit(r)}
                      title="Edit employee"
                    >
                      <Edit3 size={16} />
                    </button>
                  )}

                  {canDelete && (
                    <button
                      className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                      onClick={() => del(r.id)}
                      title="Delete employee"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              )
            }
          ]}
        />
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit employee" : "Add employee"}
      >
        <form
          onSubmit={save}
          className="grid gap-4 sm:grid-cols-2"
        >
          {/* ================= BASIC INFORMATION ================= */}

          {field(
            "employeeCode",
            "Employee ID",
            "text",
            true
          )}

          {field(
            "firstName",
            "First name",
            "text",
            true
          )}

          {field(
            "lastName",
            "Last name",
            "text",
            true
          )}

          {field(
            "email",
            "Email",
            "email",
            true
          )}

          {field("phone", "Phone")}

          {field(
            "designation",
            "Designation",
            "text",
            true
          )}

          {field(
            "joiningDate",
            "Joining date",
            "date",
            true
          )}

          {field(
            "dateOfBirth",
            "Date of birth",
            "date"
          )}

          {/* Department */}

          <div>
            <label className="label">
              Department
              <span className="ml-1 text-rose-500">*</span>
            </label>

            <select
              className="input"
              value={form.departmentId}
              onChange={(e) =>
                setForm({
                  ...form,
                  departmentId: e.target.value
                })
              }
              required
            >
              <option value="">
                Select department
              </option>

              {deps.map((d) => (
                <option
                  key={d.id}
                  value={d.id}
                >
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Employment type */}

          <div>
            <label className="label">
              Employment type
            </label>

            <select
              className="input"
              value={form.employmentType}
              onChange={(e) =>
                setForm({
                  ...form,
                  employmentType: e.target.value
                })
              }
            >
              {[
                "FULL_TIME",
                "PART_TIME",
                "CONTRACT",
                "INTERN"
              ].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>

          {field(
            "workLocation",
            "Work location"
          )}

          {field(
            "basicSalary",
            "Basic salary",
            "number"
          )}

          {field(
            "allowances",
            "Allowances",
            "number"
          )}

          {field(
            "deductions",
            "Deductions",
            "number"
          )}

          {/* ================= LOGIN ACCOUNT ================= */}

          <div className="sm:col-span-2 mt-2 border-t border-slate-200 pt-5 dark:border-slate-700">
            <div className="mb-4 flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-brand dark:bg-indigo-950/50">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Login Account
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Create a unique HRFlow login account
                  for this employee.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Login Email */}

              <div>
                <label className="label">
                  Login Email
                  <span className="ml-1 text-rose-500">
                    *
                  </span>
                </label>

                <input
                  className="input"
                  type="email"
                  value={
                    form.loginEmail ||
                    form.email ||
                    ""
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      loginEmail: e.target.value
                    })
                  }
                  placeholder="employee@example.com"
                  required
                />

                <p className="mt-1 text-[11px] text-slate-400">
                  This email will be used to sign in.
                </p>
              </div>

              {/* Temporary Password */}

              <div>
                <label className="label">
                  Temporary Password

                  {!editing && (
                    <span className="ml-1 text-rose-500">
                      *
                    </span>
                  )}
                </label>

                <input
                  className="input"
                  type="password"
                  value={
                    form.temporaryPassword || ""
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      temporaryPassword:
                        e.target.value
                    })
                  }
                  placeholder={
                    editing
                      ? "Leave blank to keep current password"
                      : "Enter temporary password"
                  }
                  required={!editing}
                  minLength={6}
                />

                <p className="mt-1 text-[11px] text-slate-400">
                  Minimum 6 characters.
                </p>
              </div>

              {/* Role */}

              <div>
                <label className="label">
                  System Role
                  <span className="ml-1 text-rose-500">
                    *
                  </span>
                </label>

                <select
                  className="input"
                  value={
                    form.role || "EMPLOYEE"
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value
                    })
                  }
                  required
                >
                  <option value="EMPLOYEE">
                    Employee
                  </option>

                  <option value="MANAGER">
                    Manager
                  </option>

                  <option value="HR">
                    HR
                  </option>

                  <option value="ADMIN">
                    Admin
                  </option>
                </select>
              </div>

              {/* Account Status */}

              <div>
                <label className="label">
                  Account Status
                </label>

                <div className="flex h-[42px] items-center rounded-xl border border-slate-200 bg-slate-50 px-4 dark:border-slate-700 dark:bg-slate-800">
                  <span className="mr-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= ADDRESS ================= */}

          <div className="sm:col-span-2">
            {field("address", "Address")}
          </div>

          {/* ================= ACTIONS ================= */}

          <div className="sm:col-span-2 flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setOpen(false);
                setErr("");
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
            >
              {editing
                ? "Save changes"
                : "Create employee"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}