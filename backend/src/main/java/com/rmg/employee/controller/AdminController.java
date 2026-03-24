package com.rmg.employee.controller;

import com.rmg.employee.dto.AdminStatsDto;
import com.rmg.employee.dto.CreateUserRequest;
import com.rmg.employee.dto.UserDto;
import com.rmg.employee.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // GET stats
    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // GET all users
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // GET users by role
    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<UserDto>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(adminService.getUsersByRole(role));
    }

    // POST create user
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        try {
            UserDto created = adminService.createUser(request);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PATCH toggle active/inactive
    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<UserDto> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id));
    }

    // POST on-bench employee (accessible by Admin)
    @PostMapping("/employees/{id}/on-bench")
    public ResponseEntity<?> onBenchEmployee(@PathVariable Long id) {
        adminService.onBenchEmployee(id);
        return ResponseEntity.ok(Map.of("message", "Employee moved to On Bench"));
    }

    // POST approve employee from bench (accessible by Admin)
    @PostMapping("/employees/{id}/approve")
    public ResponseEntity<?> approveEmployee(@PathVariable Long id) {
        adminService.approveEmployee(id);
        return ResponseEntity.ok(Map.of("message", "Employee approved"));
    }

    // DELETE user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
