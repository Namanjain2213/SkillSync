package com.rmg.employee.controller;

import com.rmg.employee.dto.EmployeeProfileRequest;
import com.rmg.employee.dto.EmployeeProfileResponse;
import com.rmg.employee.dto.McqTestDto;
import com.rmg.employee.dto.McqTestResponse;
import com.rmg.employee.dto.ProjectApplicationDto;
import com.rmg.employee.dto.ProjectResponse;
import com.rmg.employee.dto.TestSubmissionRequest;
import com.rmg.employee.service.EmployeeService;
import com.rmg.employee.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employee")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private ProjectService projectService;

    @PostMapping("/profile")
    public ResponseEntity<?> createProfile(@RequestBody EmployeeProfileRequest request, Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "employee";
            EmployeeProfileResponse response = employeeService.createProfile(username, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating profile: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "employee";
            EmployeeProfileResponse response = employeeService.getProfile(username);
            if (response == null) return ResponseEntity.notFound().build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching profile: " + e.getMessage());
        }
    }

    @PostMapping("/certification")
    public ResponseEntity<?> uploadCertification(
            @RequestParam("name") String certificationName,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "employee";
            String fileName = employeeService.uploadCertification(username, certificationName, file);
            return ResponseEntity.ok(Map.of("fileName", fileName, "message", "Certification uploaded successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error uploading certification: " + e.getMessage()));
        }
    }

    @GetMapping("/test/{skill}")
    public ResponseEntity<?> generateTest(@PathVariable String skill, Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "employee";
            McqTestResponse test = employeeService.generateTest(username, skill);
            return ResponseEntity.ok(test);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error generating test: " + e.getMessage());
        }
    }

    @PostMapping("/test/submit")
    public ResponseEntity<?> submitTest(@RequestBody TestSubmissionRequest request, Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "employee";
            McqTestDto result = employeeService.submitTest(username, request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error submitting test: " + e.getMessage());
        }
    }

    @GetMapping("/suggested-projects")
    public ResponseEntity<List<ProjectResponse>> getSuggestedProjects(Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "employee";
            return ResponseEntity.ok(projectService.getSuggestedProjectsForEmployee(username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/projects/{projectId}/apply")
    public ResponseEntity<?> applyToProject(@PathVariable Long projectId, Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "employee";
            return ResponseEntity.ok(projectService.applyToProject(username, projectId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<ProjectApplicationDto>> getMyApplications(Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "employee";
            return ResponseEntity.ok(projectService.getMyApplications(username));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/application-status")
    public ResponseEntity<Map<Long, String>> getApplicationStatusMap(Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "employee";
            return ResponseEntity.ok(projectService.getApplicationStatusMap(username));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of());
        }
    }
}
