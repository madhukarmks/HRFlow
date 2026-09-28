package com.hrflow.dto;

public record LoginResponse(
        String accessToken,
        String tokenType,
        Long userId,
        String email,
        String role,
        Long employeeId
) {}
