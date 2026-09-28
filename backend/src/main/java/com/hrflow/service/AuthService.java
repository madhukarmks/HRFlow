package com.hrflow.service;

import com.hrflow.dto.*;
import com.hrflow.entity.*;
import com.hrflow.repository.*;
import com.hrflow.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository users;
    private final EmployeeRepository employees;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    @Transactional
    public void register(RegisterRequest r) {
        if (users.findByEmail(r.email()).isPresent()) {
            throw new IllegalStateException("Email already registered");
        }

        User u = new User();
        u.setEmail(r.email().trim().toLowerCase());
        u.setPasswordHash(encoder.encode(r.password()));
        u.setRole(Role.EMPLOYEE);
        users.save(u);

        Employee e = new Employee();
        e.setEmployeeCode("EMP-" + System.currentTimeMillis());
        e.setFirstName(r.firstName());
        e.setLastName(r.lastName());
        e.setEmail(r.email().trim().toLowerCase());
        e.setUserId(u.getId());
        employees.save(e);
    }

    public LoginResponse login(LoginRequest r) {
        String email = r.email().trim().toLowerCase();

        User u = users.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!u.isEnabled() || !encoder.matches(r.password(), u.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        var e = employees.findAll().stream()
                .filter(x -> Objects.equals(x.getUserId(), u.getId()))
                .findFirst()
                .orElse(null);

        return new LoginResponse(
                jwt.generate(u.getId(), u.getEmail(), u.getRole().name()),
                "Bearer",
                u.getId(),
                u.getEmail(),
                u.getRole().name(),
                e == null ? null : e.getId()
        );
    }

    @Transactional
    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = users.findByEmail(username.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled");
        }

        if (!encoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (encoder.matches(newPassword, user.getPasswordHash())) {
            throw new RuntimeException("New password must be different from the current password");
        }

        user.setPasswordHash(encoder.encode(newPassword));
        users.save(user);
    }
}
