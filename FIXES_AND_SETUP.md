# HRFlow v3 FIXED - Employee Login & Security Update

This package includes the existing HRFlow frontend/backend plus the requested fixes.

## Added
1. Unique login account during employee onboarding.
   - Login email
   - Temporary password
   - Role
   - Backend creates and links the `users` record automatically.
2. Employee can change their own password from:
   - Settings -> Change Password
3. Password changes use the authenticated JWT identity.
   - No employee ID is accepted.
   - Current password is verified with BCrypt.
4. Employee list authorization:
   - ADMIN / HR / MANAGER can view employees.
   - ADMIN / HR can create and update.
   - ADMIN can delete.
   - EMPLOYEE cannot open employee management.
5. Login metadata is returned to HR/Admin screens so editing an employee does not accidentally reset the role.
6. Existing employees without a user account can be given a login account by editing and supplying a temporary password.
7. Demo seeding is idempotent and does not stop just because another user already exists.

## Demo accounts
- ADMIN: admin@hrflow.local / Admin@123
- HR: hr@hrflow.local / Hr@12345
- MANAGER: manager@hrflow.local / Manager@123
- EMPLOYEE: employee@hrflow.local / Employee@123

## Local run

### Backend
Open:
`hrflow-backend`

Then:
```bash
mvn clean package -DskipTests
mvn spring-boot:run
```

Backend:
`http://localhost:8080`

### Frontend
Open:
`frontend`

```bash
npm install
npm run dev
```

Frontend:
`http://localhost:5173`

The frontend `.env.example` contains:
```env
VITE_API_URL=http://localhost:8080/api
```

For deployment, set `VITE_API_URL` to the public HTTPS URL of the Spring Boot API ending in `/api`.

## Important after replacing an already-running backend

Rebuild and redeploy the backend. The new endpoints and authorization rules are backend changes.

If the browser still shows an old authorization state, log out and log back in so a fresh JWT is stored.

## Password API

```http
POST /api/auth/change-password
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "currentPassword": "Employee@123",
  "newPassword": "NewPassword@123"
}
```
