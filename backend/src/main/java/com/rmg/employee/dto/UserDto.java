package com.rmg.employee.dto;

import java.time.LocalDateTime;

public class UserDto {
    private Long id;
    private String employeeId;
    private String fullName;
    private String email;
    private String role;
    private boolean active;
    private LocalDateTime createdAt;

    public UserDto(Long id, String employeeId, String fullName, String email,
                   String role, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.employeeId = employeeId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getEmployeeId() { return employeeId; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public boolean isActive() { return active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
