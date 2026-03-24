package com.rmg.employee.controller;

import com.rmg.employee.dto.EmployeeProfileResponse;
import com.rmg.employee.service.HrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hr")
public class HrController {

    @Autowired
    private HrService hrService;

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeProfileResponse>> getAllEmployees() {
        return ResponseEntity.ok(hrService.getAllEmployees());
    }

    @GetMapping("/employees/pending")
    public ResponseEntity<List<EmployeeProfileResponse>> getPendingEmployees() {
        return ResponseEntity.ok(hrService.getPendingEmployees());
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<EmployeeProfileResponse> getEmployeeDetail(@PathVariable Long id) {
        return ResponseEntity.ok(hrService.getEmployeeDetail(id));
    }

    @PostMapping("/employees/{id}/on-bench")
    public ResponseEntity<EmployeeProfileResponse> onBenchProfile(@PathVariable Long id) {
        return ResponseEntity.ok(hrService.onBenchProfile(id));
    }

    @PostMapping("/employees/{id}/approve")
    public ResponseEntity<EmployeeProfileResponse> approveProfile(@PathVariable Long id) {
        return ResponseEntity.ok(hrService.approveProfile(id));
    }

    @PostMapping("/employees/{id}/reject")
    public ResponseEntity<EmployeeProfileResponse> rejectProfile(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "");
        return ResponseEntity.ok(hrService.rejectProfile(id, reason));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(hrService.getStats());
    }
}
