package com.hrflow.controller;

import com.hrflow.dto.EmployeeRequest;
import com.hrflow.entity.*;
import com.hrflow.repository.EmployeeRepository;
import com.hrflow.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeRepository repo;
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    public List<Employee> all(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId) {

        List<Employee> rows;

        if (departmentId != null) {
            rows = repo.findByDepartmentId(departmentId);
        } else {
            rows = repo.findAll();

            if (search != null && !search.isBlank()) {
                String q = search.toLowerCase().trim();
                rows = rows.stream()
                        .filter(e ->
                                ((e.getFirstName() + " " + e.getLastName()).toLowerCase().contains(q))
                                || (e.getEmail() != null && e.getEmail().toLowerCase().contains(q))
                                || (e.getEmployeeCode() != null && e.getEmployeeCode().toLowerCase().contains(q))
                        )
                        .toList();
            }
        }

        rows.forEach(this::attachLoginMetadata);
        return rows;
    }

    @GetMapping("/{id}")
    public Employee get(@PathVariable Long id) {
        Employee employee = repo.findById(id).orElseThrow();
        attachLoginMetadata(employee);
        return employee;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @Transactional
    public Employee create(
            @Valid @RequestBody EmployeeRequest r,
            org.springframework.security.core.Authentication authentication) {

        if (r.temporaryPassword() == null || r.temporaryPassword().isBlank()) {
            throw new IllegalArgumentException(
                    "Temporary password is required when creating an employee"
            );
        }

        validatePassword(r.temporaryPassword());
        validateRequestedRole(authentication, r.role());

        String loginEmail = normalizeEmail(
                r.loginEmail() == null || r.loginEmail().isBlank()
                        ? r.email()
                        : r.loginEmail()
        );

        if (users.findByEmail(loginEmail).isPresent()) {
            throw new IllegalArgumentException(
                    "Login email is already registered"
            );
        }

        User user = new User();
        user.setEmail(loginEmail);
        user.setPasswordHash(passwordEncoder.encode(r.temporaryPassword()));
        user.setRole(r.role() == null ? Role.EMPLOYEE : r.role());
        user.setEnabled(true);
        users.save(user);

        Employee e = new Employee();
        map(e, r);
        e.setEmail(normalizeEmail(r.email()));
        e.setUserId(user.getId());

        Employee saved = repo.save(e);
        attachLoginMetadata(saved);
        return saved;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @Transactional
    public Employee update(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest r,
            org.springframework.security.core.Authentication authentication) {

        Employee e = get(id);

        if (e.getUserId() == null) {
            // Supports old employees created before login-account support.
            if (r.temporaryPassword() == null || r.temporaryPassword().isBlank()) {
                throw new IllegalArgumentException(
                        "This employee has no login account. Provide a temporary password to create one."
                );
            }

            validatePassword(r.temporaryPassword());
            validateRequestedRole(authentication, r.role());

            String loginEmail = normalizeEmail(
                    r.loginEmail() == null || r.loginEmail().isBlank()
                            ? r.email()
                            : r.loginEmail()
            );

            if (users.findByEmail(loginEmail).isPresent()) {
                throw new IllegalArgumentException(
                        "Login email is already registered"
                );
            }

            User user = new User();
            user.setEmail(loginEmail);
            user.setPasswordHash(passwordEncoder.encode(r.temporaryPassword()));
            user.setRole(r.role() == null ? Role.EMPLOYEE : r.role());
            user.setEnabled(true);
            users.save(user);

            e.setUserId(user.getId());
        } else {
            User user = users.findById(e.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Login account linked to this employee was not found"
                    ));

            String loginEmail = normalizeEmail(
                    r.loginEmail() == null || r.loginEmail().isBlank()
                            ? user.getEmail()
                            : r.loginEmail()
            );

            if (!loginEmail.equalsIgnoreCase(user.getEmail())) {
                users.findByEmail(loginEmail).ifPresent(existing -> {
                    if (!existing.getId().equals(user.getId())) {
                        throw new IllegalArgumentException(
                                "Login email is already registered"
                        );
                    }
                });
                user.setEmail(loginEmail);
            }

            Role requestedRole = r.role() == null ? user.getRole() : r.role();
            validateRequestedRole(authentication, requestedRole);
            user.setRole(requestedRole);

            if (r.temporaryPassword() != null && !r.temporaryPassword().isBlank()) {
                validatePassword(r.temporaryPassword());
                user.setPasswordHash(
                        passwordEncoder.encode(r.temporaryPassword())
                );
            }

            users.save(user);
        }

        map(e, r);
        e.setUpdatedAt(Instant.now());

        Employee saved = repo.save(e);
        attachLoginMetadata(saved);
        return saved;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public void delete(@PathVariable Long id) {
        Employee e = get(id);

        if (e.getUserId() != null) {
            users.deleteById(e.getUserId());
        }

        repo.deleteById(id);
    }

    private void attachLoginMetadata(Employee employee) {
        employee.setLoginEmail(null);
        employee.setRole(null);

        if (employee.getUserId() == null) {
            return;
        }

        users.findById(employee.getUserId()).ifPresent(user -> {
            employee.setLoginEmail(user.getEmail());
            employee.setRole(user.getRole());
        });
    }

    private void validatePassword(String password) {
        if (password.length() < 6) {
            throw new IllegalArgumentException(
                    "Password must contain at least 6 characters"
            );
        }
    }

    private void validateRequestedRole(
            org.springframework.security.core.Authentication authentication,
            Role role) {

        Role requested = role == null ? Role.EMPLOYEE : role;

        if (requested == Role.ADMIN || requested == Role.HR) {
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            if (!isAdmin) {
                throw new org.springframework.security.access.AccessDeniedException(
                        "Only an Admin can create or assign HR/Admin accounts"
                );
            }
        }
    }

    private void map(Employee e, EmployeeRequest r) {
        e.setEmployeeCode(r.employeeCode());
        e.setFirstName(r.firstName());
        e.setLastName(r.lastName());
        e.setEmail(normalizeEmail(r.email()));
        e.setPhone(r.phone());
        e.setAddress(r.address());
        e.setCity(r.city());
        e.setState(r.state());
        e.setCountry(r.country());
        e.setGender(r.gender());
        e.setDateOfBirth(r.dateOfBirth());
        e.setDesignation(r.designation());
        e.setJoiningDate(r.joiningDate());
        e.setEmploymentType(
                r.employmentType() == null
                        ? EmploymentType.FULL_TIME
                        : r.employmentType()
        );
        e.setWorkLocation(r.workLocation());
        e.setStatus(
                r.status() == null
                        ? EmploymentStatus.ACTIVE
                        : r.status()
        );
        e.setBasicSalary(
                r.basicSalary() == null
                        ? java.math.BigDecimal.ZERO
                        : r.basicSalary()
        );
        e.setAllowances(
                r.allowances() == null
                        ? java.math.BigDecimal.ZERO
                        : r.allowances()
        );
        e.setDeductions(
                r.deductions() == null
                        ? java.math.BigDecimal.ZERO
                        : r.deductions()
        );
        e.setDepartmentId(r.departmentId());
        e.setManagerId(r.managerId());
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
