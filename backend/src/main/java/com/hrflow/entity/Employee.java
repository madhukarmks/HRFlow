package com.hrflow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(
        name = "employees",
        indexes = {
                @Index(name = "idx_emp_email", columnList = "email"),
                @Index(name = "idx_emp_dept", columnList = "department_id")
        }
)
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, unique = true)
    String employeeCode;

    @Column(nullable = false)
    String firstName;

    @Column(nullable = false)
    String lastName;

    @Column(nullable = false, unique = true)
    String email;

    String phone;
    String address;
    String city;
    String state;
    String country;
    String gender;
    String designation;

    LocalDate dateOfBirth;
    LocalDate joiningDate;

    @Enumerated(EnumType.STRING)
    EmploymentType employmentType = EmploymentType.FULL_TIME;

    String workLocation;

    @Enumerated(EnumType.STRING)
    EmploymentStatus status = EmploymentStatus.ACTIVE;

    BigDecimal basicSalary = BigDecimal.ZERO;
    BigDecimal allowances = BigDecimal.ZERO;
    BigDecimal deductions = BigDecimal.ZERO;

    Long departmentId;
    Long managerId;
    Long userId;

    Instant createdAt = Instant.now();
    Instant updatedAt = Instant.now();

    // Read-only login metadata populated by EmployeeController.
    // These are not persisted in the employees table.
    @Transient
    String loginEmail;

    @Transient
    Role role;
}
