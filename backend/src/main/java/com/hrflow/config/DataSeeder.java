package com.hrflow.config;

import com.hrflow.entity.*;
import com.hrflow.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(
            UserRepository users,
            EmployeeRepository employees,
            DepartmentRepository departments,
            LeaveTypeRepository leaveTypes,
            PasswordEncoder enc) {

        return args -> {
            Department engineering = departments.findByName("Engineering")
                    .orElseGet(() -> {
                        Department d = new Department();
                        d.setName("Engineering");
                        d.setDescription("Product engineering");
                        return departments.save(d);
                    });

            departments.findByName("Human Resources")
                    .orElseGet(() -> {
                        Department d = new Department();
                        d.setName("Human Resources");
                        d.setDescription("Human resources");
                        return departments.save(d);
                    });

            User admin = seedUser(users, enc, "admin@hrflow.local", "Admin@123", Role.ADMIN);
            seedUser(users, enc, "hr@hrflow.local", "Hr@12345", Role.HR);
            seedUser(users, enc, "manager@hrflow.local", "Manager@123", Role.MANAGER);
            User employee = seedUser(
                    users, enc,
                    "employee@hrflow.local",
                    "Employee@123",
                    Role.EMPLOYEE
            );

            if (employees.findByUserId(employee.getId()).isEmpty()) {
                Employee e = new Employee();
                e.setEmployeeCode("EMP-1001");
                e.setFirstName("John");
                e.setLastName("Doe");
                e.setEmail(employee.getEmail());
                e.setDesignation("Software Engineer");
                e.setDepartmentId(engineering.getId());
                e.setJoiningDate(LocalDate.now().minusMonths(8));
                e.setBasicSalary(new BigDecimal("50000"));
                e.setAllowances(new BigDecimal("10000"));
                e.setDeductions(new BigDecimal("3000"));
                e.setUserId(employee.getId());
                employees.save(e);
            }

            if (leaveTypes.count() == 0) {
                LeaveType casual = new LeaveType();
                casual.setName("Casual Leave");
                casual.setDefaultDays(12);
                leaveTypes.save(casual);

                LeaveType sick = new LeaveType();
                sick.setName("Sick Leave");
                sick.setDefaultDays(10);
                leaveTypes.save(sick);
            }
        };
    }

    private User seedUser(
            UserRepository users,
            PasswordEncoder enc,
            String email,
            String password,
            Role role) {

        return users.findByEmail(email)
                .map(existing -> {
                    if (existing.getRole() == null) {
                        existing.setRole(role);
                    }
                    existing.setEnabled(true);
                    return users.save(existing);
                })
                .orElseGet(() -> {
                    User u = new User();
                    u.setEmail(email);
                    u.setPasswordHash(enc.encode(password));
                    u.setRole(role);
                    u.setEnabled(true);
                    return users.save(u);
                });
    }
}
