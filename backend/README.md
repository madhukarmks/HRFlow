# HRFlow — Smart Human Resource Management System (Backend)

Production-style Spring Boot backend foundation for HRFlow. It provides JWT authentication, RBAC, employee/department management, attendance, leave, payroll, recruitment, performance, documents, tasks, announcements, notifications, dashboard metrics, reports, validation, OpenAPI and Docker support.

## Stack
Java 21, Spring Boot 3.5.6, Spring Security, JWT, JPA/Hibernate, MySQL 8, Lombok, Bean Validation, OpenAPI, Docker.

## Run locally
1. Create MySQL database `hrflow` (or let the configured JDBC URL create it).
2. Copy `.env.example` values into your environment.
3. Run `mvn spring-boot:run`.
4. API: `http://localhost:8080`.
5. Swagger: `http://localhost:8080/swagger-ui.html`.
6. Health: `http://localhost:8080/actuator/health`.

## Demo accounts
- ADMIN: admin@hrflow.local / Admin@123
- HR: hr@hrflow.local / Hr@12345
- MANAGER: manager@hrflow.local / Manager@123
- EMPLOYEE: employee@hrflow.local / Employee@123

Change seeded credentials before production use.

## Docker
`docker compose up --build`

## Important API groups
`/api/auth`, `/api/dashboard`, `/api/employees`, `/api/departments`, `/api/attendance`, `/api/leaves`, `/api/payroll`, `/api/jobs`, `/api/candidates`, `/api/interviews`, `/api/performance`, `/api/documents`, `/api/announcements`, `/api/notifications`, `/api/tasks`, `/api/reports`.

## Security
Passwords use BCrypt. JWT is required for private endpoints. Method-level RBAC protects write operations. Production deployments must provide a strong `JWT_SECRET`, HTTPS, restricted CORS, secure file/object storage and secrets management.

## Architecture
Controller -> Service/domain operations -> Repository -> MySQL. DTO validation is used on key write APIs. The frontend should never rely on hidden UI controls as security; the backend enforces authorization.

## Next frontend integration
Set Axios base URL to the deployed backend URL and send `Authorization: Bearer <accessToken>` on protected requests. Use `/api/auth/login` to obtain the token.

## Build verification / fixed compilation blockers

This package includes the following build fixes:

- `LoginRequest` and `LoginResponse` are now separate public record files, matching Java's public-type filename rule.
- `PerformanceReview` now imports `java.math.BigDecimal`.
- Lombok is pinned to a Java-21-compatible version and explicitly registered as a Maven annotation processor, so generated getters/setters/constructors are available during Maven compilation.
- `EmployeeController` includes the required `BigDecimal` import.

From the `backend` directory run:

```bash
mvn clean package -DskipTests
```

Then run:

```bash
mvn spring-boot:run
```

or:

```bash
java -jar target/hrflow-backend-1.0.0.jar
```

If MySQL is not installed locally, use:

```bash
docker compose up --build
```

The default local database is `hrflow`, with username `root` and password `root`. Change these through environment variables before production deployment.


## Employee login accounts

HR/Admin can create a unique login account while onboarding an employee from the Employees screen:

- Login Email
- Temporary Password (minimum 6 characters)
- System Role
- Employee profile data

The backend creates the `users` record and links it to the employee automatically. The temporary password is BCrypt-hashed and is never returned by the API.

Existing employees without a linked login account can also receive one by editing the employee and supplying a temporary password.

## Change password

Any authenticated user can change their own password through:

```http
POST /api/auth/change-password
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

The backend identifies the account from the JWT (`authentication.getName()`), verifies the current password with BCrypt, and stores the new BCrypt hash. No employee ID is accepted for this operation.

## Employee-management authorization

- ADMIN: view/create/update/delete employees and manage all roles.
- HR: view/create/update employees; cannot create or assign ADMIN/HR accounts.
- MANAGER: view employees.
- EMPLOYEE: cannot access the employee-management list.

The frontend also hides management controls that the logged-in role cannot use.
