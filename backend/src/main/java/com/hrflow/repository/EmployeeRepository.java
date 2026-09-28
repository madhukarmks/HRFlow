package com.hrflow.repository;

import com.hrflow.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByEmployeeCode(String code);
    Optional<Employee> findByUserId(Long userId);
    List<Employee> findByDepartmentId(Long id);
}
