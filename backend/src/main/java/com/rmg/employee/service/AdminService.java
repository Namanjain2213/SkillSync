package com.rmg.employee.service;

import com.rmg.employee.dto.AdminStatsDto;
import com.rmg.employee.dto.CreateUserRequest;
import com.rmg.employee.dto.UserDto;
import com.rmg.employee.model.Employee;
import com.rmg.employee.model.ProfileStatus;
import com.rmg.employee.model.Role;
import com.rmg.employee.model.User;
import com.rmg.employee.repository.EmployeeRepository;
import com.rmg.employee.repository.ProjectApplicationRepository;
import com.rmg.employee.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProjectApplicationRepository projectApplicationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Password: min 8 chars, uppercase, lowercase, digit, special char
    private static final String PASSWORD_REGEX =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^()_+\\-=])[A-Za-z\\d@$!%*?&#^()_+\\-=]{8,}$";

    public UserDto createUser(CreateUserRequest request) {
        // Validate password strength
        if (!request.getPassword().matches(PASSWORD_REGEX)) {
            throw new RuntimeException(
                "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        Role role = Role.valueOf(request.getRole().toUpperCase());
        String employeeId = generateEmployeeId(role);

        User user = new User();
        user.setEmployeeId(employeeId);
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setActive(true);

        return toDto(userRepository.save(user));
    }

    private String generateEmployeeId(Role role) {
        String prefix = switch (role) {
            case EMPLOYEE        -> "EMP";
            case HR              -> "HR";
            case PROJECT_MANAGER -> "PM";
            case ADMIN           -> "ADM";
        };

        // Start from 1 and find first unused ID — safe even after deletions
        long count = 1;
        String id;
        do {
            id = prefix + String.format("%03d", count);
            count++;
        } while (userRepository.existsByEmployeeId(id));

        return id;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<UserDto> getUsersByRole(String role) {
        return userRepository.findByRoleOrderByCreatedAtDesc(Role.valueOf(role.toUpperCase()))
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public UserDto toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        return toDto(userRepository.save(user));
    }

    @Transactional
    public void onBenchEmployee(Long userId) {
        Employee emp = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Employee not found for user: " + userId));
        emp.setStatus(ProfileStatus.ON_BENCH);
        emp.setRejectionReason(null);
        emp.setUpdatedAt(LocalDateTime.now());
        employeeRepository.save(emp);
    }

    @Transactional
    public void approveEmployee(Long userId) {
        Employee emp = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Employee not found for user: " + userId));
        emp.setStatus(ProfileStatus.APPROVED);
        emp.setRejectionReason(null);
        emp.setUpdatedAt(LocalDateTime.now());
        employeeRepository.save(emp);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // ADM001 is the super admin — cannot be deleted
        if ("ADM001".equals(user.getEmployeeId())) {
            throw new RuntimeException("Super admin (ADM001) cannot be deleted.");
        }

        employeeRepository.findByUserId(userId).ifPresent(emp -> {
            // Delete project applications first (FK on employee_id)
            projectApplicationRepository.deleteAll(projectApplicationRepository.findByEmployeeId(emp.getId()));
            // Clear skills collection explicitly to avoid FK constraint issues
            emp.getSkills().clear();
            employeeRepository.saveAndFlush(emp);
            // Employee delete cascades certifications and mcqTests
            employeeRepository.delete(emp);
            employeeRepository.flush();
        });

        userRepository.delete(user);
    }

    public AdminStatsDto getStats() {
        long total    = userRepository.count();
        long employees= userRepository.countByRole(Role.EMPLOYEE);
        long hr       = userRepository.countByRole(Role.HR);
        long pm       = userRepository.countByRole(Role.PROJECT_MANAGER);
        long admins   = userRepository.countByRole(Role.ADMIN);
        long active   = userRepository.countByActive(true);
        long inactive = userRepository.countByActive(false);
        return new AdminStatsDto(total, employees, hr, pm, admins, active, inactive);
    }

    private UserDto toDto(User u) {
        UserDto dto = new UserDto(u.getId(), u.getEmployeeId(), u.getFullName(),
                u.getEmail(), u.getRole().name(), u.isActive(), u.getCreatedAt());
        if (u.getRole() == Role.EMPLOYEE) {
            employeeRepository.findByUserId(u.getId()).ifPresent(emp ->
                dto.setEmployeeStatus(emp.getStatus().name())
            );
        }
        return dto;
    }
}
