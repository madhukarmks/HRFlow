# HRFlow Frontend

React + Vite + Tailwind frontend for the supplied HRFlow Spring Boot backend.

## Run

1. Open this `frontend` folder in VS Code.
2. Copy `.env.example` to `.env`.
3. Keep `VITE_API_URL=http://localhost:8080/api` for local backend.
4. Run:

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Backend integration

The frontend is wired to the API groups exposed by the supplied backend:
`auth`, `dashboard`, `employees`, `departments`, `attendance`, `leaves`, `payroll`,
`jobs`, `candidates`, `interviews`, `performance`, `documents`, `files`,
`announcements`, `notifications`, `tasks`, and `reports`.

JWT is automatically attached to requests through Axios.

## Demo accounts

- admin@hrflow.local / Admin@123
- hr@hrflow.local / Hr@12345
- manager@hrflow.local / Manager@123
- employee@hrflow.local / Employee@123

These are development credentials from the backend seed and should be changed before production.

## Important

The supplied backend does not expose every feature listed in the larger HRMS specification (for example a dedicated payslip PDF endpoint, user password-change endpoint, leave-balance API, and full audit-log API). This frontend therefore does not pretend those missing endpoints exist. The implemented screens are connected to the APIs that actually exist in the backend.


## Employee login and password change

HR/Admin users can create a unique employee login account from **Employees → Add employee**. The employee signs in with that login email and temporary password.

After login, every user can open **Settings → Change Password** to update their own password. The password-change API uses the authenticated JWT identity, so an employee cannot select another employee ID to change someone else's password.
