package com.hrflow.dto;

import com.hrflow.entity.EmploymentStatus;
import com.hrflow.entity.EmploymentType;
import com.hrflow.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeRequest(
        @NotBlank String employeeCode,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @Email @NotBlank String email,
        String phone,
        String address,
        String city,
        String state,
        String country,
        String gender,
        LocalDate dateOfBirth,
        String designation,
        LocalDate joiningDate,
        EmploymentType employmentType,
        String workLocation,
        EmploymentStatus status,
        BigDecimal basicSalary,
        BigDecimal allowances,
        BigDecimal deductions,
        Long departmentId,
        Long managerId,
        Long userId,

        // Login account fields. These are used only by HR/Admin when onboarding.
        @Email String loginEmail,
        String temporaryPassword,
        Role role
) {}
